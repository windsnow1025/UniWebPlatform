from completion import ChatCompletionFactory

from flask import Flask, request
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from waitress import serve

import logging
import os

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = os.environ["JWT_SECRET"]
jwt = JWTManager(app)


@app.route("/", methods=["POST"])
@jwt_required()
def generate():
    username = get_jwt_identity()

    messages = request.form.get("messages")
    messages = list(eval(messages))
    model = request.form.get("model")
    api_type = request.form.get("api_type")
    temperature = request.form.get("temperature")
    temperature = float(temperature)
    stream = request.form.get("stream")
    stream = True if stream == "true" else False

    logging.info(f"username: {username}, model: {model}, api_type: {api_type}")

    factory = ChatCompletionFactory(messages, model, api_type, temperature, stream)
    completion = factory.create_chat_completion()
    response = completion.process_request()
    return response


@app.route("/", methods=["GET"])
def index():
    return "gpt-4-0613"


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    serve(app, host="0.0.0.0", port=5000)
