import os
import logging
from flask import Blueprint, request, jsonify, Response, stream_with_context
from groq import Groq
from dotenv import load_dotenv
import time

load_dotenv()

logging.basicConfig(level=logging.DEBUG)

main = Blueprint('main', __name__)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

log_messages = []

def get_response_from_ai(prompt):
    if not prompt:
        return "Error: The prompt cannot be empty."
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
        )
        logging.debug(f"chat_completion: {chat_completion}")
        # Extracting the response content properly
        response_content = chat_completion.choices[0].message.content
        log_messages.append(f"AI Response: {response_content}")
        return response_content
    except Exception as e:
        logging.error(f"Error getting response from AI: {e}")
        return f"Error: {e}"

@main.route('/logs', methods=['GET'])
def stream_logs():
    def generate():
        global log_messages
        last_index = 0
        while True:
            if last_index < len(log_messages):
                message = log_messages[last_index]
                last_index += 1
                yield f"data: {message}\n\n".encode('utf-8')
            time.sleep(1)
    return Response(stream_with_context(generate()), content_type='text/event-stream')

@main.route('/evaluate', methods=['POST'])
def evaluate():
    global log_messages
    log_messages = []
    log_messages.append("Received user prompt.")
    
    def generate_log_stream():
        try:
            data = request.json
            logging.debug(f"Request JSON: {data}")  # Log the received JSON data
            prompt = data.get('idea')  # Corrected key here
            if not prompt:
                raise ValueError("Prompt is required.")
            
            yield f"data: Received user prompt.\n\n".encode('utf-8')

            # Get response from AI
            ai_response = get_response_from_ai(prompt)
            yield f"data: AI Response: {ai_response}\n\n".encode('utf-8')
            yield jsonify({"response": ai_response}).get_data(as_text=True).encode('utf-8')
        except Exception as e:
            logging.error(f"Error in /evaluate endpoint: {e}")
            yield f"data: Error: {e}\n\n".encode('utf-8')

    return Response(stream_with_context(generate_log_stream()), content_type='application/json')

if __name__ == '__main__':
    from flask import Flask
    app = Flask(__name__)
    app.register_blueprint(main)
    app.run(debug=True)
