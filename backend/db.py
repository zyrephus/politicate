import os
from dotenv import load_dotenv
from supabase import Client, create_client
from supabase.lib.client_options import SyncClientOptions

load_dotenv()

class SupabaseClient:
    client: Client

    def __init__(self) -> None:
        url = os.getenv("SUPABASE_PROJECT_URL")
        key = os.getenv("SUPABASE_API_KEY")

        if not url or not key:
            raise ValueError("Missing required environment variables: SUPABASE_PROJECT_URL and/or SUPABASE_API_KEY")

        options = SyncClientOptions(schema="public")
        self.client: Client = create_client(url, key, options=options)

    
    def fetch_users(self):
        response = self.client.table("users").select("*").execute()
        return response

    def sign_up(self, email: str, password: str):
        response = self.client.auth.sign_up({"email": email, "password": password})
        return response

    def log_in(self, email: str, password: str):
        response = self.client.auth.sign_in_with_password({"email": email, "password": password})
        return response

    def get_user(self):
        response = self.client.auth.get_user()
        return response

    def log_out(self):
        self.client.auth.sign_out()
        return "Logged out successfully."

if __name__ == "__main__":
    client = SupabaseClient()

    email = "hello@gmail.com"
    password = "securepassword"

    signup_response = client.sign_up(email, password)
    print("Sign Up Response:", signup_response)

    login_response = client.log_in(email, password)
    print("Log Out Response:", login_response)

    user_response = client.get_user()
    print("User:", user_response)

    logout_response = client.log_out()
    print("Logout:", logout_response)

