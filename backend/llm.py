import getpass
from dotenv import load_dotenv
import os
from langchain.chat_models import init_chat_model
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
                "type": "string",
                "description": "A policy found in the artcile",
            },
            "policy2": {
                "type": "string",
                "description": "Another policy found in the artcile",
            },
            "policy3": {
                "type": "string",
                "description": "Another policy found in the artcile",
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
            prompt = f"Using this article: {link}, extract policies from {rep} for the upcoming provincial election."

            try:
                response = structured_llm.invoke(prompt)
                #check if a list exists at the key before adding repsonse to dic
                rtn[rep] = rtn.get(rep, [])
                rtn[rep].append(response)
                print(f"\n **Policies for {rep} from {link}:**\n{response}\n")
            except Exception as e:
                print(f"Error processing {link}: {e}")

    return rtn
    

