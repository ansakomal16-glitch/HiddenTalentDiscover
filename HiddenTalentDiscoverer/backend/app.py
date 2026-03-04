from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import MinMaxScaler
import os

app = Flask(__name__)
CORS(app)

# Dataset columns (CSV wali exact naming honi chahiye)
FEATURE_COLS = [
    "O_score", "C_score", "E_score", "A_score", "N_score", 
    "Numerical Aptitude", "Spatial Aptitude", "Perceptual Aptitude", 
    "Abstract Reasoning", "Verbal Reasoning"
]

# Frontend categories ko CSV columns se map karne ke liye
CATEGORY_MAP = {
    "O_score": "O_score",
    "C_score": "C_score",
    "E_score": "E_score",
    "A_score": "A_score",
    "N_score": "N_score",
    "Numerical_Aptitude": "Numerical Aptitude",
    "Spatial_Aptitude": "Spatial Aptitude",
    "Perceptual_Aptitude": "Perceptual Aptitude",
    "Abstract_Reasoning": "Abstract Reasoning",
    "Verbal_Reasoning": "Verbal Reasoning"
}

model = None
scaler = MinMaxScaler()

def train_engine():
    global model, scaler
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, "expanded_career_dataset.csv") # Aapki generated CSV ka naam
    
    if os.path.exists(file_path):
        df = pd.read_csv(file_path)
        print(f"✅ Data Loaded: {len(df)} rows, {df['Career'].nunique()} careers.")
        
        X = df[FEATURE_COLS]
        y = df['Career']
        
        X_scaled = scaler.fit_transform(X)
        # 5 neighbors aur cosine similarity best hai psychological match ke liye
        model = KNeighborsClassifier(n_neighbors=5, weights='distance', metric='cosine')
        model.fit(X_scaled, y)
    else:
        print(f"❌ ERROR: {file_path} missing!")

train_engine()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Frontend se "scores" object milega: {"scores": {"O_score": 8, "C_score": 6...}}
        data = request.json.get('scores', {})
        
        final_vec = []
        for col in FEATURE_COLS:
            # Hum direct key dhundenge (e.g., Numerical_Aptitude)
            # Frontend se agar 'Numerical_Aptitude' aata hai toh map use karenge
            input_key = next((k for k, v in CATEGORY_MAP.items() if v == col), col)
            val = data.get(input_key, 5.0) # Default middle value agar category missing ho
            
            # Tiny jitter to avoid mathematical ties
            final_vec.append(float(val) + np.random.uniform(-0.01, 0.01))

        # ML Prediction logic
        scaled_input = scaler.transform([final_vec])
        prediction = model.predict(scaled_input)[0]
        
        # User Traits report ke liye wapis bhej rahe hain
        user_traits = {FEATURE_COLS[i]: round(final_vec[i], 2) for i in range(len(FEATURE_COLS))}

        return jsonify({
            "prediction": str(prediction),
            "user_traits": user_traits,
            "status": "success"
        })
        
    except Exception as e:
        print(f"⚠️ Prediction Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)