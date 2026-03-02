from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
# Sab se zaroori: CORS ko allow karna taake frontend connect ho sakay
CORS(app)

# Model Load Karna
try:
    model = joblib.load('talent_model.pkl')
    print("✅ Neural AI Model loaded successfully!")
except Exception as e:
    print(f"❌ Model Error: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Frontend se 'scores' object lena (Jaisa Cursor ne banaya hai)
        data = request.json.get('scores') 
        
        if not data:
            return jsonify({'error': 'No data received'}), 400

        # Features ko sahi order mein arrange karna (10 features)
        # Sequence: O, C, E, A, N, Numerical, Spatial, Perceptual, Abstract, Verbal
        features = [
            data.get('O_score', 3), data.get('C_score', 3), data.get('E_score', 3),
            data.get('A_score', 3), data.get('N_score', 3), data.get('Numerical', 3),
            data.get('Spatial', 3), data.get('Perceptual', 3), data.get('Abstract', 3),
            data.get('Verbal', 3)
        ]

        # Model Prediction
        input_array = np.array(features).reshape(1, -1)
        prediction = model.predict(input_array)[0]
        
        # Elite Dashboard ke liye response taiyar karna
        # Hum dummy match percentages add kar rahe hain taake UI bhtreen dikhay
        return jsonify({
            'user_traits': data, # Radar chart ke liye
            'predictions': [
                {
                    'career': str(prediction),
                    'match': 98,
                    'market_demand': 'Very High'
                },
                {
                    'career': 'Strategic Consultant', # Backup career
                    'match': 85,
                    'market_demand': 'High'
                }
            ]
        })

    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Port 5001 par run karna
    app.run(port=5001, debug=True)