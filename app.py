from flask import Flask, render_template, request, jsonify
from google.genai import Client
from dotenv import load_dotenv
import os
import json

app = Flask(__name__)

load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_KEY:
    print("Gemini API Key loaded successfully!")
    client = Client(api_key=GEMINI_KEY)
else:
    print("❌ No GEMINI_API_KEY found. Using fallback.")
    client = None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/firstaid", methods=["POST"])
def api_firstaid():
    data = request.get_json() or {}
    query = data.get("query", "").strip()

    if not query:
        return jsonify({"error": "Query required"}), 400

    if not client:
        return fallback_firstaid()

    prompt = f"""
You are a First Aid assistant for educational use only.

Rules:
1. ALWAYS begin:
"I am an AI assistant for educational purposes only. In a medical emergency, call emergency services immediately."
2. Provide short step-by-step instructions.
3. Use simple calm language.
4. If query is not health related → politely decline.

User question: {query}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        reply = getattr(response, "text", "") or fallback_generic_msg()
        return jsonify({"answer": reply})

    except Exception as e:
        print("Gemini AI Error:", e)
        return fallback_firstaid()


def fallback_firstaid():
    return jsonify({"answer": fallback_generic_msg()})


def fallback_generic_msg():
    return (
        "I am an AI assistant for educational purposes only. In a medical emergency, "
        "call emergency services immediately.\n\n"
        "Here are general first aid steps:\n"
        "• Stay calm\n"
        "• Ensure safety\n"
        "• Apply pressure if bleeding\n"
        "• Seek professional help"
    )

@app.route("/api/quiz", methods=["GET"])
def api_quiz():

    if not client:
        return fallback_quiz()

    prompt = """
Return a multiple-choice first aid question in JSON only:

{
  "question": "text",
  "options": ["A", "B", "C", "D"],
  "answer": "exact matching option",
  "explanation": "short reason"
}

Topic: burns, choking, cuts, CPR, fractures, nosebleeds.
No markdown or backticks.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        raw = getattr(response, "text", "") or ""
        text = raw.strip("` \n")

        data = json.loads(text)
        return jsonify(data)

    except Exception as e:
        print("Quiz Generation Error:", e)
        return fallback_quiz()


def fallback_quiz():
    return jsonify({
        "question": "What should you do first for a minor burn?",
        "options": [
            "Run cool water over it for 10–20 minutes",
            "Apply ice",
            "Pop any blisters",
            "Rub butter on it"
        ],
        "answer": "Run cool water over it for 10–20 minutes",
        "explanation": "Ice and butter can worsen the injury."
    })

if __name__ == "__main__":
    app.run(debug=True)
