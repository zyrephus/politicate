import getpass
from dotenv import load_dotenv
import os

load_dotenv()
from pse import get_political_articles

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")


from langchain.chat_models import init_chat_model

llm = init_chat_model("gpt-4o-mini", model_provider="openai")
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

for rep in representative:
    query = f"{rep} latest policies"
    articles = get_political_articles(query)

    for article in articles:
        link = article["link"]
        prompt = f"Using this article: {link}, extract policies from {rep} for the upcoming provincial election."

        try:
            response = structured_llm.invoke(prompt)
            print(f"\n **Policies for {rep} from {link}:**\n{response}\n")
        except Exception as e:
            print(f"Error processing {link}: {e}")

