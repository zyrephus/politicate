from fastapi import FastAPI
from llm import getPolicies
app = FastAPI()


@app.get("/swipe")
def getPolicy():
    return getPolicies()

@app.get("/")
async def root():
    return {"message": "Hello World"}
