import getpass
import os

#os.environ.get("OPENAI_API_KEY") = 

if not os.environ.get("OPENAI_API_KEY"):
  os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")
  

from langchain.chat_models import init_chat_model

llm = init_chat_model("gpt-4o-mini", model_provider="openai")


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

print(structured_llm.invoke("Using this article: https://www.tvo.org/article/will-bonnie-crombies-new-housing-policy-light-a-fire-under-the-ford-government give me policies from Bonnie Crombie for the upcoming provincial election."))

