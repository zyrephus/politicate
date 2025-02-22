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
            raise ValueError("Missing required environment variables: SUPABASE_PROJECT_URL and/or SUPABASE_API_KEY")

        options = SyncClientOptions(schema="public")
        self.client: Client = create_client(url, key, options=options)


    def postPolicies(self, email, rep, policy, agree):
        try:
            response = (
                    self.client.table("policyTest")
                    .insert({"email":email, "rep":rep, "policy":policy, "agree":agree})
                    .execute()
                    )
            return response
        except Exception as e:
            return e

if __name__ == "__main__":
    client = SupabaseClient()

