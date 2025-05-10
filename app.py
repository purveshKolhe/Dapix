from flask import Flask, render_template, request, jsonify, redirect
import os
from datetime import datetime
import urllib.parse
import requests
from urllib.parse import quote

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_image', methods=['POST'])
def generate_image():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        
        if not prompt:
            return jsonify({'error': 'No prompt provided'}), 400
        
        # Format prompt for Pollinations URL
        formatted_prompt = quote(prompt)
        image_url = f"https://pollinations.ai/p/{formatted_prompt}"
        
        return jsonify({
            'success': True,
            'imageUrl': image_url,
            'prompt': prompt,
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False)
