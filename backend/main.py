from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from llm import getPolicies, askChat, summarize, scoreSummary
from pydantic import BaseModel
from db import SupabaseClient
from api import get_postcode_data


load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase_client = SupabaseClient()


class ChatRequest(BaseModel):
    context: list  # List of history messages
    user_input: str  # New user message

class String(BaseModel):
    req: str

@app.get("/getPoliticians/{postalCode}")
def getPoliticians(postalCode):
    result = get_postcode_data(postalCode)
    if result:
        return result
    else:
        return {"error": "No mayor found for this postcode."}
    

@app.post("/askChat")
def getResponse(request: ChatRequest):
    return {"response": askChat(request.context, request.user_input)}


@app.get("/swipe")
def getPolicy():
    return getPolicies()

@app.post("/summarize")
def getSummary(request: String):
    return {"response": summarize(request.req)}

@app.post("/postPolicy")
async def postPolicy(request: Request):
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
            rating = entry.get("rating")

            if not email or rep is None or policy is None or agree is None:
                return {"error": "Missing required fields in an entry", "entry": entry}

            formatted_policies.append(
                    {"email": email, "rep": rep, "policy": policy, "agree": agree, "rating":rating}
            )

        if formatted_policies:
            response = supabase_client.postPolicies(formatted_policies)
            return {"message": "Policies inserted", "response": response}
        else:
            return {"error": "No valid policies to insert"}

    except Exception as e:
        return {"error": str(e)}


@app.get("/getScore/{email}")
async def get_score(email):
    try:
        if not email:
            return {"error": "Email is required"}

        # Fetch political score from Supabase
        score = supabase_client.getRating(email)
        summary = scoreSummary(str(score)) 

        return {
                "score":score,
                "summary":summary
            }

    except Exception as e:
        return {"error": str(e)}

@app.get("/getPostal/{email}")
async def get_postal(email):
    """Fetches the postal code for a given email."""
    try:
        response = supabase_client.getPostal(email)
        print(response)
        return response

    except Exception as e:
        return {"error": str(e)}

@app.post("/postPostal")
async def post_postal(request: Request):
    """Stores or updates the postal code for a user."""
    try:
        data = await request.json()  # Parse JSON request
        email = data.get("email")
        postal_code = data.get("postalCode")

        if not email or not postal_code:
            return {"error": "Both email and postal code are required"}

        response = supabase_client.postPostal(email, postal_code)
        return response

    except Exception as e:
        return {"error": str(e)}

@app.get("/")
async def root():
    return {"message": "Hello World"}
