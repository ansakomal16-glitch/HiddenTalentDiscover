import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# 1. Data load karo 
try:
    df = pd.read_csv('Data_final.csv')
    print("Data load ho gaya!")
    
    # Ye line check karegi ke columns ke naam kya hain
    print("Columns in your file:", df.columns.tolist())
    
    # Maan lo last column 'Talent' hai, agar naam alag hai toh niche 'Talent' ko change kar dena
    target_column = 'Career' 
    
    X = df.drop(target_column, axis=1) 
    y = df[target_column]

    # 2. Model Train karo
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)

    # 3. Model ko Save karo
    joblib.dump(model, 'talent_model.pkl')
    print("Success! 'talent_model.pkl' ban gayi hai.")

except Exception as e:
    print(f"Error aa gaya: {e}")