from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
import os

app = Flask(__name__)
CORS(app)

# =========================
# FEATURES (CAREER MODEL)
# =========================
FEATURE_COLS = [
    "O_score", "C_score", "E_score", "A_score", "N_score",
    "Numerical Aptitude", "Spatial Aptitude",
    "Perceptual Aptitude", "Abstract Reasoning", "Verbal Reasoning"
]

model = None
scaler = StandardScaler()

# =========================
# TRAIN CAREER MODEL
# =========================
def train_nn_engine():
    global model, scaler

    file_path = os.path.join(os.path.dirname(__file__), "Data_final.csv")

    if os.path.exists(file_path):
        df = pd.read_csv(file_path)

        X = df[FEATURE_COLS]
        y = df["Career"]

        X_scaled = scaler.fit_transform(X)

        model = MLPClassifier(
            hidden_layer_sizes=(100, 50, 25),
            max_iter=1000,
            random_state=42
        )

        model.fit(X_scaled, y)
        print("✅ Career Model Trained")

# =========================
# TRAIN GAME MODEL
# =========================
game_model = None

def train_game_model():
    global game_model

    X = [
        [1, 10],[2, 9],[3, 8],[4, 7],[5, 6],
        [6, 5],[7, 4],[8, 3],[9, 2],[10, 1]
    ]

    y = [
        "Weak","Weak","Average","Average","Good",
        "Good","Very Good","Excellent","Expert","Genius"
    ]

    game_model = KNeighborsClassifier(n_neighbors=3)
    game_model.fit(X, y)

    print("🎮 Game Model Trained")

# =========================
# CAREER PREDICT API
# =========================
@app.route('/predict', methods=['POST'])
def predict():
    try:
        content = request.json
        scores = content.get("scores", {})

        input_data = {}

        for col in FEATURE_COLS:
            key = col.replace(" ", "_")
            val = scores.get(key, scores.get(col, 0))
            input_data[col] = [float(val)]

        df = pd.DataFrame(input_data)
        scaled = scaler.transform(df)

        prediction = model.predict(scaled)[0]

        return jsonify({
            "prediction": prediction
        })

    except Exception as e:
        return jsonify({"error": str(e)})

# =========================
# GAME RESULT API
# =========================
# =========================
# MAIN GAME RESULT API
# =========================
@app.route('/game-result', methods=['POST'])

def game_result():
    print("ROUTE LOADED: /game-result")

    data = request.json or {}

    # ALL GAME INPUTS (SAFE DEFAULTS)
    score = float(data.get("score", 0))
    memory = float(data.get("memory", 0))
    logic = float(data.get("logic", 0))
    creativity = float(data.get("creativity", 0))
    business = float(data.get("business", 0))

    # =========================
    # SAFE NORMALIZED SYSTEM
    # =========================

    base_score = score + memory + logic + creativity + business

    accuracy = min(100, (base_score / 50) * 100)

    speed = min(100, (logic + memory) * 5)

    creativity_boost = min(100, creativity * 8)

    final_score = (
        accuracy * 0.4 +
        speed * 0.3 +
        creativity_boost * 0.3
    )

    # =========================
    # CAREER SYSTEM
    # =========================
    if final_score >= 80:
        career = "🧠 AI Engineer / Strategist"
    elif final_score >= 60:
        career = "📊 Business Analyst / Manager"
    elif final_score >= 40:
        career = "🎨 Creative Designer / Thinker"
    else:
        career = "📚 Learning Stage"

    # =========================
    # GRAPH DATA
    # =========================
    graph = {
        "labels": ["Accuracy", "Speed", "Creativity", "Final Score"],
        "values": [
            round(accuracy, 2),
            round(speed, 2),
            round(creativity_boost, 2),
            round(final_score, 2)
        ]
    }

    return jsonify({
        "career": career,
        "accuracy": round(accuracy, 2),
        "speed": round(speed, 2),
        "final_score": round(final_score, 2),
        "graph": graph
    })


# =========================
# HEALTH CHECK (IMPORTANT)
# =========================
@app.route('/', methods=['GET'])
def home():
    return {"status": "Server Running Fine"}, 200



# =========================
# RUN SERVER (ONLY ONE)
if __name__ == "__main__":
    try:
        train_nn_engine()
    except Exception as e:
        print("NN error:", e)

    try:
        train_game_model()
    except Exception as e:
        print("Game model error:", e)

    print("🚀 Flask Starting...")
    app.run(debug=True)