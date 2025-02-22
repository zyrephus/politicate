from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from llm import getPolicies, askChat
from pydantic import BaseModel
from db import SupabaseClient



load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    context: list  # List of history messages
    user_input: str  # New user message


@app.post("/askChat")
def getResponse(request: ChatRequest):
    return {"response": askChat(request.context, request.user_input)}

@app.get("/swipe")
def getPolicy():
    return getPolicies()

@app.post("/postPolicy")
async def postPolicy(request: Request):
    supabase_client = SupabaseClient()
    try:
        data = await request.json()

        if not isinstance(data, list):  # Ensure it's a list
            return {"error": "Expected a list of policy swipes"}

        formatted_policies = []
        for entry in data:
            email = entry.get("email")
            rep = entry.get("person")
            policy = entry.get("policy")
            agree = entry.get("liked")

            if not email or rep is None or policy is None or agree is None:
                return {"error": "Missing required fields in an entry", "entry": entry}

            formatted_policies.append({
                "email": email,
                "rep": rep,
                "policy": policy,
                "agree": agree
            })

        if formatted_policies:
            response = supabase_client.postPolicies(formatted_policies)
            return {"message": "Policies inserted", "response": response}
        else:
            return {"error": "No valid policies to insert"}

    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "Hello World"}
