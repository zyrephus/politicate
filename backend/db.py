import os
from dotenv import load_dotenv
from supabase import Client, create_client
from supabase.lib.client_options import SyncClientOptions

load_dotenv()


class SupabaseClient:
    client: Client

    def __init__(self) -> None:
        url = os.getenv("SUPABASE_PROJECT_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")

        if not url or not key:
            raise ValueError(
                "Missing required environment variables: SUPABASE_PROJECT_URL and/or SUPABASE_SERVICE_KEY"
            )

        options = SyncClientOptions(schema="public")
        self.client: Client = create_client(url, key, options=options)

    def postPolicies(self, policies):
        try:
            response = self.client.table("policyTest").insert(policies).execute()
            return response
        except Exception as e:
            return {"error": str(e)}

    def getRating(self, email: str):
        try:
            response = (
                self.client.table("policyTest")
                .select("rating")  # Only select the rating column
                .eq("email", email)  # Filter by email
                .order("created_at", desc=True)  # Get latest entries
                .limit(50)  # Limit to last 50 entries
                .execute()
            )

            records = response.data if response else []
            if not records:
                return {"error": "No policy ratings found for user"}

            # Sum all rating values
            total_score = sum(entry["rating"] for entry in records if "rating" in entry)

            return {"total_political_score": total_score}

        except Exception as e:
            return {"error": str(e)}

    def getPostal(self, email: str):
        """Fetches the postal code for a given email."""
        try:
            response = (
                self.client.table("userData")  
                .select("postalCode") 
                .eq("email", email) 
                .single() 
                .execute()
            )

            if response.data:
                return {"email": email, "postalCode": response.data["postalCode"]}
            else:
                return {"error": "No postal code found for this email"}

        except Exception as e:
            return {"error": str(e)}


    def postPostal(self, email: str, postalCode: str):
        """Inserts or updates the postal code for a given email."""
        try:
            response = (
                self.client.table("userData")
                .upsert({"email": email, "postalCode": postalCode})  
                .execute()
            )
            return {"message": "Postal code saved", "response": response}

        except Exception as e:
            return {"error": str(e)}


if __name__ == "__main__":
    client = SupabaseClient()
