from googletrans import Translator
import requests
import os

HF_API_URL = "";
HF_API_KEY = "";

languages = {
    "English": "en", "Spanish": "es", "French": "fr", "German": "de",
    "Hindi": "hi", "Marathi": "mr", "Chinese (Simplified)": "zh-cn", "Japanese": "ja"
}



def translate_text(text, target_language):
    translator = Translator()
    print("Text " , text , " lang : ",target_language)
    if target_language == "en":
        return translator.translate(text, dest="en").text
    translated = translator.translate(text, src="en", dest=target_language)
    print("traslated : ",translated.text)
    return translated.text
