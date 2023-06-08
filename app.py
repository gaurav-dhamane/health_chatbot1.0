from flask import Flask, render_template, request,jsonify
import requests




app = Flask(__name__)
# Define the health conditions and severity levels
health_conditions = [
    "Headache",
    "Fever",
    "Cough",
    "Flu",
    "Stomach Ache",
    "Diarrhea"
    # Add more conditions here
]

severity_levels = [
    "Mild",
    "Moderate",
    "Severe"
]

# Define the endpoint for the ChatGPT API
api_endpoint = "https://api.openai.com/v1/chat/completions"

# Define your ChatGPT API key
api_key = "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"

@app.route("/")
def index():
    return render_template("index.html", conditions=health_conditions, severities=severity_levels)
@app.route("/chat", methods=["POST"])
def chat():
    condition = request.form["condition"]
    severity = request.form["severity"]
    message = request.form["message"]

    prompt = f"I have a {condition.lower()} with {severity.lower()} severity. {message}"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "messages": [
            {"role": "system", "content": "You can start the conversation with the system message."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 50,  # Adjust the response length as needed
        "model": "gpt-3.5-turbo"
    }

    response = requests.post(api_endpoint, headers=headers, json=data)

    print(response.json())
    if response.status_code == 200:
        result = response.json()
        
        try:
            chatbot_response = result["choices"][0]["message"]["content"].strip()
        except KeyError:
            chatbot_response = "Oops! Something went wrong. Please try again."
        print(chatbot_response)
        return jsonify({"response": chatbot_response})
    else:
        return jsonify({"response": "Error communicating with the ChatGPT API"})

    
@app.after_request
def add_cache_control_headers(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response




if __name__ == "__main__":
    app.run(debug=False)
    
