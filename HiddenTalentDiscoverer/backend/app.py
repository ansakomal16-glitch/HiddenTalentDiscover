from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
import os

app = Flask(__name__)
CORS(app)

FEATURE_COLS = [
    "O_score", "C_score", "E_score", "A_score", "N_score", 
    "Numerical Aptitude", "Spatial Aptitude", "Perceptual Aptitude", 
    "Abstract Reasoning", "Verbal Reasoning"
]

model = None
scaler = StandardScaler() # Neural Networks ke liye StandardScaler behtar perform karta hai

def train_nn_engine():
    global model, scaler
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, "Data_final.csv") 
    
    if os.path.exists(file_path):
        df = pd.read_csv(file_path)
        X = df[FEATURE_COLS]
        y = df['Career']
        
        # Data Normalization
        X_scaled = scaler.fit_transform(X)
        
        # Neural Network Architecture
        # (100, 50, 25) matlab 3 hidden layers hain jin mein 100, 50, aur 25 neurons hain
        model = MLPClassifier(
            hidden_layer_sizes=(100, 50, 25), 
            max_iter=1000, 
            activation='relu', 
            solver='adam', 
            random_state=42
        )
        model.fit(X_scaled, y)
        print("✅ Neural Network Trained Successfully!")
    else:
        print(f"❌ ERROR: {file_path} missing!")

train_nn_engine()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        content = request.json
        scores = content.get('scores', {})

        # 1. Dataframe banayein exact FEATURE_COLS ke sath
        input_data = {}
        for col in FEATURE_COLS:
            # Check for space vs underscore (e.g., "Numerical Aptitude" vs "Numerical_Aptitude")
            key_variant1 = col.replace(" ", "_")
            val = scores.get(key_variant1, scores.get(col, 0.0)) # Default 0.0 for better debugging
            input_data[col] = [float(val)]
        
        input_df = pd.DataFrame(input_data)

        # --- TERMINAL LOGGING START ---
        print("\n" + "="*30)
        print("📊 RECEIVED INPUT SCORES:")
        # Loop ke zariye har feature aur uska score terminal mein print karein
        for col in FEATURE_COLS:
            score_val = input_data[col][0]
            print(f"{col:20}: {score_val}")
        print("="*30)
        # --- TERMINAL LOGGING END ---

        # 2. Scale aur Predict
        scaled_input = scaler.transform(input_df)
        prediction = model.predict(scaled_input)[0]
        
        print(f"🎯 PREDICTED CAREER: {prediction}\n") 

        return jsonify({
            "prediction": str(prediction),
            "status": "success"
        })
        
    except Exception as e:
        print(f"❌ PYTHON ERROR: {str(e)}")
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True, port=5001)