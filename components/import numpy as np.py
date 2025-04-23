import numpy as np
# ... other imports (FastAPI/Flask, joblib, etc.) ...
# ... load your model (e.g., model = joblib.load('your_model.pkl')) ...

# --- Inside your /runaiinference endpoint function ---

# Assume 'input_data' is the dictionary received from the request
# containing potentially more than the 4 needed features.

# BAD Example (Causes the error if input_data has 8 items):
# X = np.array(list(input_data.values())).reshape(1, -1)
# prediction = model.predict(X)

# GOOD Example (Select only the 4 features the model expects):
# Replace 'length', 'mean', 'std', 'maxEntropy' with the actual names
# of the 4 features your model was trained on, in the correct order.
try:
    feature_values = [
        input_data['length'],
        input_data['mean'],
        input_data['std'],
        input_data['maxEntropy']
        # Add/remove/reorder features here to exactly match model training
    ]

    # Create the NumPy array with the correct shape (1 row, 4 columns)
    X = np.array(feature_values).reshape(1, 4) # Use reshape(1, 4) explicitly

    # Now predict using the correctly shaped input
    prediction = model.predict(X)

    # ... rest of your endpoint logic (processing prediction, returning response) ...

except KeyError as e:
    # Handle cases where expected features might be missing in input_data
    print(f"Error: Missing expected feature in input data: {e}")
    # Return an appropriate error response (e.g., HTTP 400 Bad Request)
    # raise HTTPException(status_code=400, detail=f"Missing feature: {e}")
    pass # Replace pass with actual error handling

except Exception as e:
    # Handle other potential errors during feature extraction or prediction
    print(f"Error during prediction preparation: {e}")
    # Return an appropriate error response (e.g., HTTP 500 Internal Server Error)
    # raise HTTPException(status_code=500, detail="Error processing data for prediction")
    pass # Replace pass with actual error handling


# --- Optional: Using the helper function (Recommended) ---

def extract_features_for_model(input_data_dict):
    """Extracts and orders the specific features needed by the model."""
    try:
        # Define the exact feature names and order expected by the model
        feature_names = ['length', 'mean', 'std', 'maxEntropy']
        return [input_data_dict[feature] for feature in feature_names]
    except KeyError as e:
        print(f"Error: Missing expected feature in input data: {e}")
        raise ValueError(f"Input data is missing required feature: {e}") # Re-raise for endpoint handling

# --- Inside your /runaiinference endpoint function (using helper) ---
try:
    # Extract the required features in the correct order
    feature_values = extract_features_for_model(input_data)

    # Create the NumPy array
    X = np.array(feature_values).reshape(1, 4) # Shape (1, 4)

    # Predict
    prediction = model.predict(X)

    # ... rest of your endpoint logic ...

except ValueError as e:
    # Handle error from the helper function (e.g., missing feature)
    print(f"Data extraction error: {e}")
    # Return HTTP 400 Bad Request
    # raise HTTPException(status_code=400, detail=str(e))
    pass # Replace pass with actual error handling

except Exception as e:
    # Handle other errors
    print(f"Error during prediction: {e}")
    # Return HTTP 500 Internal Server Error
    # raise HTTPException(status_code=500, detail="Prediction failed")
    pass # Replace pass with actual error handling
