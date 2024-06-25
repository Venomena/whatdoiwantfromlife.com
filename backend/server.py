import os
import json
import time
import logging
import colorlog
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure colorful logging
handler = colorlog.StreamHandler()
handler.setFormatter(colorlog.ColoredFormatter(
    "%(log_color)s%(levelname)s: %(message)s",
    log_colors={
        'DEBUG': 'reset',
        'INFO': 'green',
        'WARNING': 'yellow',
        'ERROR': 'red',
        'CRITICAL': 'bold_red',
    }
))
logging.getLogger().handlers = [handler]
logging.getLogger().setLevel(logging.DEBUG)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
log_messages = []

user_responses = []
conversation_stage = 0

def log_message(action, status, source=None, detail=None):
    log_entry = {
        "action": action,
        "status": status,
        "source": source,
        "detail": detail
    }
    log_messages.append(log_entry)
    logging.info(json.dumps(log_entry))

def initiate_conversation():
    global conversation_stage
    conversation_stage = 1
    prompt = {
        "question": "Hey there! Let's start with a quick question. What are you currently thinking about for your future?",
        "options": ["College", "Working", "Traveling", "Not sure yet"]
    }
    return prompt

def continue_conversation(user_responses):
    global conversation_stage
    response = user_responses[-1].lower()

    if conversation_stage == 1:
        conversation_stage = 2
        return {
            "question": "Cool! What's something that makes you feel really excited or passionate?",
            "options": []
        }

    if conversation_stage == 2:
        conversation_stage = 3
        return {
            "question": "Nice! Do you prefer working with people, technology, nature, or something else?",
            "options": ["People", "Technology", "Nature", "Something else"]
        }

    if conversation_stage == 3:
        conversation_stage = 4
        return {
            "question": "Interesting! What kind of activities do you enjoy the most in your free time?",
            "options": []
        }

    if conversation_stage == 4:
        conversation_stage = 5
        return {
            "question": "Thanks for sharing! What's something you value the most in life?",
            "options": ["Adventure", "Security", "Helping others", "Creativity"]
        }

    if conversation_stage == 5:
        return None  # End of conversation

def generate_suggestion(user_responses):
    conversation = "Based on our entire conversation, here is a summary:\n\n"
    for i, response in enumerate(user_responses):
        conversation += f"User: {response}\n"

    conversation += "\nGiven this information, provide a detailed suggestion on what the user should pursue in life, considering their interests, passions, and values."
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": conversation}],
            model="mixtral-8x7b-32768",
        )
        response_content = chat_completion.choices[0].message.content
        log_message(action="Suggestion", status="Generated", detail=response_content)
        return response_content
    except Exception as e:
        logging.error(f"Error generating suggestion from AI: {e}")
        log_message(action="Suggestion", status="Failed")
        return "I'm sorry, there was an error generating your suggestion. Please try again later."

@app.route('/logs', methods=['GET'])
def stream_logs():
    def generate():
        global log_messages
        last_index = 0
        while True:
            if last_index < len(log_messages):
                message = log_messages[last_index]
                last_index += 1
                yield f"data: {json.dumps(message)}\n\n".encode('utf-8')
            time.sleep(1)
    return Response(stream_with_context(generate()), content_type='text/event-stream')

@app.route('/start', methods=['GET'])
def start_conversation():
    prompt = initiate_conversation()
    return jsonify(prompt)

@app.route('/respond', methods=['POST'])
def user_response():
    global conversation_stage
    try:
        data = request.json
        user_response = data.get('response')
        log_message(action="UserResponse", status="Received", detail=user_response)

        user_responses.append(user_response)
        if conversation_stage >= 5:
            suggestion = generate_suggestion(user_responses)
            return jsonify({"suggestion": suggestion})
        else:
            prompt = continue_conversation(user_responses)
            return jsonify(prompt)

    except Exception as e:
        logging.error(f"Error in /respond endpoint: {e}")
        log_message(action="Response", status="Failed", detail=str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
