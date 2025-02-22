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
            # Fetch last 60 ratings for the user
            response = (
                self.client.table("policyTest")
                .select("rating")  # Only select the rating column
                .eq("email", email)  # Filter by email
                .order("created_at", desc=True)  # Get latest entries
                .limit(60)  # Limit to last 60 entries
                .execute()
            )

            records = response.data if response else []
            if not records:
                return {"error": "No policy ratings found for user"}

            # Sum all rating values
            total_score = sum(entry["rating"] for entry in records if "rating" in entry)

            return {"email": email, "total_political_score": total_score}

        except Exception as e:
            return {"error": str(e)}


if __name__ == "__main__":
    client = SupabaseClient()
