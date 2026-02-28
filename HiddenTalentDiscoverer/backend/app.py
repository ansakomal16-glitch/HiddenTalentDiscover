from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app) # Taake aapka frontend server se connect ho sakay

# AI Model load karein
try:
    model = joblib.load('talent_model.pkl')
    print("AI Model loaded successfully!")
except:
    print("Model file nahi mili!")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Frontend se data lena
        data = request.json['answers'] 
        
        # Prediction karna
        prediction = model.predict([data])
        
        # Result wapis bhejna
        return jsonify({'talent': str(prediction[0])})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    # Isay 5001 kar dein taake Node.js (5000) ke saath takraaye na
    app.run(port=5001, debug=True)