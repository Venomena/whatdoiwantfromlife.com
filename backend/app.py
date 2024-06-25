import os
from flask import Flask, request, jsonify, Response, stream_with_context, render_template, send_from_directory
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import logging
import time
import urllib.parse
from colorama import Fore, Style, init

load_dotenv()

logging.basicConfig(level=logging.DEBUG)
init(autoreset=True)

app = Flask(__name__, static_folder="../frontend/build/static", template_folder="../frontend/build")
CORS(app)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

log_messages = []

# Routes and logic here...

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/static/<path:path>', methods=['GET'])
def serve_static(path):
    return send_from_directory(os.path.join(app.root_path, 'static'), path)

if __name__ == '__main__':
    app.run(debug=True)
