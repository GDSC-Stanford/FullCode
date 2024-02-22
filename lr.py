import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, InputLayer
from tensorflow.keras.utils import to_categorical
from sklearn.metrics import classification_report
import joblib  # For saving the scaler


# Load the dataset
df = pd.read_csv('shelter_data.csv')

# Split the dataset into features and target
X = df[['los', 'age', 'gender', 'relationship', 'location', 'language', 'disability']]  # Features
y = pd.Categorical(df['person_number']).codes  # Target variable, assuming 'person_number' is categorical

# Encode the target variable to one-hot vectors
y_encoded = to_categorical(y)

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Normalize numeric features
scaler = StandardScaler()
X_train_numeric_scaled = scaler.fit_transform(X_train[['los', 'age', 'location']])
X_test_numeric_scaled = scaler.transform(X_test[['los', 'age', 'location']])

# Concatenate scaled numeric features with categorical features
X_train_scaled = np.concatenate([X_train_numeric_scaled, X_train[['gender', 'relationship', 'language', 'disability']].values], axis=1)
X_test_scaled = np.concatenate([X_test_numeric_scaled, X_test[['gender', 'relationship', 'language', 'disability']].values], axis=1)

# Define the model
model = Sequential([
    InputLayer(input_shape=(X_train_scaled.shape[1],)),
    Dense(units=100, activation='relu'),
    Dense(units=y_train.shape[1], activation='softmax')
])

# Compile the model
model.compile(optimizer='adam', 
              loss='categorical_crossentropy', 
              metrics=['accuracy'])

# Train the model
model.fit(X_train_scaled, y_train, epochs=100, batch_size=32, verbose=1)

# Save the model
model.save('trained_model')

# Save the scaler
joblib.dump(scaler, 'scaler.pkl')

# Evaluate the model on the test set
# test_loss, test_accuracy = model.evaluate(X_test_scaled, y_test, verbose=1)
# print(f'Test accuracy: {test_accuracy}')

# Example function to load the trained model and scaler for predictions (not part of this script)
def load_for_prediction(model_path='trained_model', scaler_path='scaler.pkl'):
    model = tf.keras.models.load_model(model_path)
    scaler = joblib.load(scaler_path)
    return model, scaler

# NOTE: The load_for_prediction function is just for illustration. In a real scenario, you would
# call this function or similar logic in a separate script or application where you're making predictions.
