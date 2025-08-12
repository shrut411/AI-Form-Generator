import requests
import os

# Your values
ENDPOINT_URL = "https://rgaje-m5p9t8b0-eastus2.openai.azure.com/"
API_KEY = "YOUR_AZURE_OPENAI_API_KEY"

# Endpoint to list available deployments/models
url = f"{ENDPOINT_URL}openai/deployments?api-version=2024-08-01-preview"

headers = {
    "api-key": API_KEY,
    "Content-Type": "application/json"
}

try:
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        print("✅ Azure OpenAI is reachable.")
        print("Available deployments:")
        for dep in response.json().get("data", []):
            print(f"- {dep.get('id')} (model: {dep.get('model')})")
    else:
        print(f"❌ Error {response.status_code}: {response.text}")
except Exception as e:
    print(f"❌ Connection error: {e}")
