# This is where the main python code for our backend is. We used Generative AI to help with 
# some of the API endpoints with Firebase and the React frontend.


from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
import joblib
from sklearn.model_selection import train_test_split

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Firebase
cred = credentials.Certificate('database-f961e-firebase-adminsdk-56g24-5b8965a56f.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Route for testing the server
@app.route('/')
def hello_world():
    return 'Hello, World!'

# API endpoint to get items from Firebase
@app.route('/api/items', methods=['GET'])
def get_items():
    try:
        items_ref = db.collection('items')
        docs = items_ref.stream()
        items_list = [doc.to_dict() for doc in docs]
        return jsonify(items_list), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

# API endpoint to add an item to Firebase
@app.route('/api/items', methods=['POST'])
def add_item():
    try:
        data = request.json
        db.collection('items').add(data)
        return jsonify({'success': True}), 201
    except Exception as e:
        return jsonify(error=str(e)), 500

# API endpoint for making predictions with the ML model
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
import joblib
from sklearn.preprocessing import StandardScaler

# Assuming the model and scaler are loaded here

@app.route('/api/predict', methods=['POST'])
def predict():
    model = load_model('lr_model')  # Update with the correct path to your TensorFlow model
    scaler = StandardScaler()
    df = pd.read_csv('shelter_data.csv')
    X = df[['los','age','gender','relationship','location','language','disability']]  # Features
    y = pd.Categorical(df['person_number']).codes  # Target variable

    # Encode the target variable to one-hot vectors
    y_encoded = pd.get_dummies(y).values
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

    # Normalize numeric features
    scaler = StandardScaler()
    X_train_numeric_scaled = scaler.fit_transform(X_train[['los', 'age', 'location']])
    # Parse the incoming JSON payload
    data = request.get_json(force=True)
    print("this is data")
    print(data)
    # Validate and extract the input features
    try:
        input_features = np.array([[data['los'], data['age'], data['location'], data['relationship'], data['gender'], data['language'], data['disability']]])
    except KeyError as e:
        return jsonify({'error': f'Missing required feature: {e}'}), 400
    print("this is input features")
    # Preprocess the input data
    # Note: Adjust preprocessing as needed based on how your model was trained
    # Example: Scaling numeric features (if your model expects scaled inputs)
    scaled_features = scaler.transform(input_features[:, :3])  # Assuming first three features are numeric and need scaling
    final_features = np.concatenate([scaled_features, input_features[:, 3:]], axis=1)  # Reconstructing the input array with scaled and categorical features

    # Predict using the model
    prediction = model.predict(final_features)
    predicted_shelter = np.argmax(prediction, axis=1)[0]  # Assuming your model outputs a class index representing a shelter
    person_number_to_name = df.set_index('person_number')['Person'].to_dict()
    predicted_person_number = predicted_shelter # Adding 1 because the class indices are 0-based but your person_number starts from 1
    predicted_person_name = person_number_to_name.get(predicted_person_number)

    # Return the prediction
    return jsonify({'predictedShelter': predicted_person_name}), 200

if __name__ == '__main__':
    app.run(debug=True, port=8080)
