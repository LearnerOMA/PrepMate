from flask import Flask, request,Response, jsonify
from scrapData import scrapdata
from chatbot import generate_chat_response
from translate import translate_text
from flask_cors import CORS
import io
from gtts import gTTS
import os
import tempfile

app = Flask(__name__)
CORS(app)

LANGUAGES = {
    "hindi": "hi",
    "marathi": "mr",
    "gujarati": "gu",
    "telugu": "te",
    "tamil": "ta",
    "english": "en"
}

@app.route('/scrape', methods=['GET'])
def scrape():
    topic = request.args.get('topic', 'latest')  # Default to 'latest' if no topic is provided
    try:
        data = scrapdata(topic)
        return jsonify({"status": "success", "data": data})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})
    
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    response_text = generate_chat_response(user_message)
    return jsonify({'response': response_text})

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.json
        text = data.get("text", "")
        language = data.get("language", "")
        print("Data ",language)
        if not text or not language:
            return jsonify({"error": "Missing text or language"}), 400
        print("Language : ",LANGUAGES[language])
        translated_text = translate_text(text, target_language=LANGUAGES[language])
        print("Traslated texr : ",translated_text)
        return jsonify({"translated_text": translated_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# Function to convert text to speech
@app.route('/readAloud', methods=['POST'])
def read_aloud():
    # Dictionary of languages with their respective codes
    language = {
        "english": "en", "spanish": "es", "french": "fr", "german": "de",
        "hindi": "hi", "marathi": "mr", "chinese (Simplified)": "zh-cn", "japanese": "ja"
    }
    data = request.get_json()

    text = data.get('text')
    target_lang = data.get('target_lang')
    print("Read Aloud : " , text ," lang lang : ",language.get(target_lang))
    
    
    try:
        # Get the JSON data from the request body
        #data = request.get_json()

        text = data.get('text')
        target_lang = data.get('target_lang')
        print("Read Aloud : " , text ," lang lang : ",target_lang)
        # Ensure the text is not empty
        if not text or not text.strip():
            return "Please provide some text to read aloud.", 400

        # Get the language code for the selected target language
        lang_code = language.get(target_lang.lower(), "en")  # Default to English if not found
        print("\n - - - -- - - - -- - -- -  : ",lang_code)
        # Generate speech using gTTS (Google Text-to-Speech)
        tts = gTTS(text=text, lang=lang_code)
        print(" - - - - - - - - - m")
        # # Create an in-memory stream to store the audio
        # audio_stream = io.BytesIO()
        # audio_stream.seek(0)
        # print(" - - - - - - - - - n")
        # # Try saving the audio into the in-memory stream
        # try:
        #     tts.save(audio_stream)
        # except Exception as e:
        #     print(f"Error saving audio to stream: {e}")
        #     return f"Error saving audio: {e}", 500
        # print(" - - - - - - - - - j")
        # audio_stream.seek(0)  # Rewind the stream to the beginning
        # print(" - - - - - - - - - l")
        # # Return the audio as a response, streaming it to the client
        # return Response(audio_stream, mimetype='audio/mp3')
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
            tts.save(temp_file.name)
            print(f"Audio saved to temp file: {temp_file.name}")
            
            # Open the temp file again to send its content
            with open(temp_file.name, 'rb') as f:
                audio_content = f.read()
        
        # Remove the temporary file after reading
        os.remove(temp_file.name)
        
        # Return the audio content as a response, streaming it to the client
        return Response(io.BytesIO(audio_content), mimetype='audio/mp3')
    except Exception as e:
        # Return any exceptions as an error message
        return str(e), 500

    

if __name__ == '__main__':
    app.run(debug=True)

