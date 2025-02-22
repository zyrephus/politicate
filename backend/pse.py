import os
import requests
from dotenv import load_dotenv
load_dotenv()

# Replace these with your actual API Key and Search Engine ID
key = os.getenv("GOOGLE_CLOUD_API_KEY")
cseID = os.getenv("PSE_API_KEY")


def get_political_articles(query):
    url = f"https://www.googleapis.com/customsearch/v1"
    params = {
        "q": query,
        "key": key,
        "cx": cseID,
        "num": 5,  # Number of results (max 10 per request)
        "lr": "lang_en",  # English language results
    }

    response = requests.get(url, params=params)
    data = response.json()

    articles = []
    for item in data.get("items", []):
        articles.append({
            "title": item.get("title"),
            "link": item.get("link"),
            "snippet": item.get("snippet"),
            "image": item.get("pagemap", {}).get("metatags", [{}])[0].get("og:image")
        })
    
    return articles

if __name__ == "__main__":
    articles = get_political_articles("Bonnie Crombie latest policies site:cbc.ca")
    for article in articles:
        print(article["title"], "-", article["link"])
