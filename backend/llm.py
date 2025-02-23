from dotenv import load_dotenv
import os
from langchain.chat_models import init_chat_model
from pse import get_political_articles
import openai
from langchain.schema import SystemMessage, HumanMessage
import requests
from pse import get_political_articles

load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
llm = init_chat_model("gpt-4o-mini", model_provider="openai")

def getPolicies():
    representative = ["Doug Ford", "Marit Stiles", "Bonnie Crombie", "Mike Schreiner"]

    json_schema = {
        "title": "policies",
        "description": "Policies for upcoming election",
        "type": "object",
        "properties": {
            "policy1": {
                "type": "object",
                "properties": {
                    "statement": {"type": "string", "description": "A policy found in the article"},
                    "rating": {"type": "integer", "description": "Rating of the policy from -2 to 2"}
                },
                "required": ["statement", "rating"]
            },
            "policy2": {
                "type": "object",
                "properties": {
                    "statement": {"type": "string", "description": "Another policy found in the article"},
                    "rating": {"type": "integer", "description": "Rating of the policy from -2 to 2"}
                },
                "required": ["statement", "rating"]
            },
            "policy3": {
                "type": "object",
                "properties": {
                    "statement": {"type": "string", "description": "Another policy found in the article"},
                    "rating": {"type": "integer", "description": "Rating of the policy from -2 to 2"}
                },
                "required": ["statement", "rating"]
            },
        },
        "required": ["policy1", "policy2"]
    }

    structured_llm = llm.with_structured_output(json_schema)

    rtn = {}
    
    for rep in representative:
        query = f"{rep} latest policies"
        articles = get_political_articles(query, 1)

        for article in articles:
            link = article["link"]
            prompt = f" 1. Using this article: {link}, extract policies from {rep} for the upcoming provincial election. Try to convert the policies into a unbias statement, including good and bad things about it. Do NOT include the name of the representative or the party they represent in the statement. 2. After creating a policy, rate it on a scale from -2 to 2, where: -2 (NDP) → Strongly left-wing, progressive, socialist policies (e.g., universal healthcare expansion, wealth redistribution, strong labor protections). -1 (Green) → Left-leaning, primarily focused on environmental sustainability and social justice (e.g., aggressive climate action, carbon taxes, renewable energy investments). 0 (Neutral) → Non-partisan or widely accepted policies (e.g., infrastructure investment, general economic stability, public safety improvements). 1 (Liberal) → Center-right, favoring regulated capitalism with some social programs (e.g., moderate tax cuts, pro-business policies, strategic public investments). 2 (Conservative) → Right-wing, emphasizing free markets, lower taxes, deregulation, and strong national security (e.g., corporate tax reductions, privatization, oil pipeline expansion)."


            try:
                response = structured_llm.invoke(prompt)
                #check if a list exists at the key before adding repsonse to dic
                rtn[rep] = rtn.get(rep, [])
                rtn[rep].append(response)
                print(f"\n **Policies for {rep} from {link}:**\n{response}\n")
            except Exception as e:
                print(f"Error processing {link}: {e}")

    return rtn
    


'''
context should be in this format
conversation_history = [
    {"role": "developer", "content": "You are a helpful AI assistant."}, 
    {"role": "user", "content": "Explain this"},
    {"role": "assistant", "content": "this talks abt blah blah blah"},

]
'''
def askChat(context, user_input):
    context.append({"role": "user", "content": user_input})
    response = openai.chat.completions.create(
        model="gpt-4o-mini",  # Change to gpt-3.5-turbo if needed
        messages=context,
        max_tokens=100  # This will limit response to roughly 400 characters
    )
    
    ai_message = response.choices[0].message.content
    context.append({"role": "assistant", "content": ai_message})
    return context
    

'''
#----For testing----

conversation_history = [
    {"role": "developer", "content": "You are a helpful AI assistant."}, 
]


while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit"]:
        break
    conversation_history = askChat(conversation_history, user_input)
    print("AI:", conversation_history.choices[0].message.content)

'''

def summarize(link):
    input = f'Please give me a brief summary (max 400 characters) about this article: {link}. Please include key policies mentioned in the article.'
    context = [
            {"role":"developer", "content":f"You are an AI assistant that helps summarize the article: {link} in a concise way (max 400 characters) to help users understand the content and answer any questions the user has about the article."},
        ]
    messages = askChat(context, input)
    return messages

#print(summarize("https://www.tvo.org/article/will-bonnie-crombies-new-housing-policy-light-a-fire-under-the-ford-government"))

def scoreSummary(rating):
    prompt = """
    You are an AI expert in Canadian politics, trained to analyze political alignment based on a user's rating on a scale from -50 to 50.
    The user's normalized score determines their political alignment:

    ≤ 80: Strongly Left-Wing (NDP)
    -79 to -40: Leaning Left (Green)
    -39 to 39: Centrist
    40 to 79: Leaning Right (Liberal)
    ≥ 80: Strongly Right-Wing (Conservative)
    Your task:

    Provide a concise, educational, and unbiased explanation (1-2 sentences) of what their rating means.
    Explain the general beliefs and policy positions of their alignment without assuming personal views.
    Avoid partisan language or persuasion—keep it neutral and informative.

    Example Output:

    "Your score places you in the Centrist category, indicating a balance between progressive and conservative views. Centrists may support policies from both sides, such as moderate economic regulation alongside social freedoms."
    """

    messages = [
            SystemMessage(content=prompt),
            HumanMessage(content=rating),
            ]

    response = llm(messages)
    return response.content

if __name__ == "__main__":
    print(scoreSummary("40"))

def getSnippet(governmentBody, postcode):
    url = f"http://api.geonames.org/postalCodeSearchJSON?postalcode={postcode}&country=CA&username=talz_a"
    response = requests.get(url)
    data = response.json().get("postalCodes", [])
    location=""
    if data:
        if(governmentBody == "Provincial"):
            location = data[0].get("adminName1", "Unknown")
        elif(governmentBody == "Municipal"):
            location = data[0].get("placeName", "Unknown")
        elif(governmentBody == "Federal"):
            location = "Canada"
    query = f"Latest news articles in {location}'s {governmentBody} government"
    articles =  get_political_articles(query, 3)

    rtn = []
    

    for article in articles:
            try:
                link = article["link"]
                prompt = f" Using this article: {link}, give me a short 1-2 sentence summary introduction about the article"
                
                context = [
                    {"role":"developer", "content":f"You are an AI assistant that helps summarize articles"}
                ]
                context.append({"role": "user", "content": prompt})
                response = openai.chat.completions.create(
                    model="gpt-4o-mini",  # Change to gpt-3.5-turbo if needed
                    messages=context
                )
                #print(response.choices[0].message.content)
        
                ai_message = response.choices[0].message.content
                
                result = {
                    "title": article["title"],
                    "link": article["link"],
                    "response": ai_message,
                    "image": article["image"]
                }
                rtn.append(result)
                
            except Exception as e:
                print(f"Error processing {link}: {e}")
                
    return rtn
    

#print(getSnippet("Provincial", "M2J3B1"))
