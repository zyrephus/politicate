import getpass
from dotenv import load_dotenv
import os
from langchain.chat_models import init_chat_model
from pse import get_political_articles
import openai

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
                "type": "string",
                "description": "A policy found in the artcile",
                "rating":"integer between -2 to 2"
            },
            "policy2": {
                "type": "string",
                "description": "Another policy found in the article",
                "rating":"integer between -2 to 2"
            },
            "policy3": {
                "type": "string",
                "description": "Another policy found in the article",
                "rating":"integer between -2 to 2"
            },
        },
        "required": ["policy1", "policy2"],
    }

    structured_llm = llm.with_structured_output(json_schema)

    rtn = {}
    
    for rep in representative:
        query = f"{rep} latest policies"
        articles = get_political_articles(query)

        for article in articles:
            link = article["link"]
            prompt = f"
                1. Using this article: {link}, extract policies from {rep} for the upcoming provincial election. Try to convert the policies into a unbias statement, including good and bad things about it. Do NOT include the name of the representative or the party they represent in the statement.
                2. After creating a policy, rate it on a scale from -2 to 2, where:
                    -2 (NDP) → Strongly left-wing, progressive, socialist policies (e.g., universal healthcare expansion, wealth redistribution, strong labor protections).
                    -1 (Green) → Left-leaning, primarily focused on environmental sustainability and social justice (e.g., aggressive climate action, carbon taxes, renewable energy investments).
                    0 (Neutral) → Non-partisan or widely accepted policies (e.g., infrastructure investment, general economic stability, public safety improvements).
                    1 (Liberal) → Center-right, favoring regulated capitalism with some social programs (e.g., moderate tax cuts, pro-business policies, strategic public investments).
                    2 (Conservative) → Right-wing, emphasizing free markets, lower taxes, deregulation, and strong national security (e.g., corporate tax reductions, privatization, oil pipeline expansion)."


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
        messages=context
    )
    #print(response.choices[0].message.content)
    
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

