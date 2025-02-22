from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from llm import getPolicies, askChat, summarize
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

@app.post("/summarize")
def getSummary(request: str):
    return {"response": summarize(request)}

@app.post("/postPolicy")
async def postPolicy(request: Request):
    supabase_client = SupabaseClient()
    try:
        data = await request.json()  # Parse JSON request

        # Extract values from JSON body
        email = data.get("email")
        rep = data.get("rep")
        policy = data.get("policy")
        agree = data.get("agree")

        if not email:  # Ensure email exists (you can add more validation)
            return {"error": "Email is required"}

        # Call the `postPolicies` function from SupabaseClient
        response = supabase_client.postPolicies(email, rep, policy, agree)
        
        return {"message": "Swipe recorded", "response": response}
    
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "Hello World"}
