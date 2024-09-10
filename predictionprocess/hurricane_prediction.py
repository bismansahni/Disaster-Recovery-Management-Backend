




import joblib
import numpy as np
import pandas as pd
import sys


model = joblib.load('./models/hurricane_prediction_gb_model.pkl')


feature_names = ['lat', 'long', 'wind', 'pressure']


def normalize(value, mean, std):
    return (value - mean) / std


def convert_pressure_to_hpa(pressure_hg):
    
    return pressure_hg * 33.86

def normalize_wind_mph(wind_mph):
    
    return normalize(wind_mph, 50, 15)

def normalize_pressure_hpa(pressure_hpa):
    
    return normalize(pressure_hpa, 1010, 10)

def predict_hurricane(lat, lon, wind_mph, pressure_hg):
    
    wind = normalize_wind_mph(float(wind_mph))
    pressure_hpa = convert_pressure_to_hpa(float(pressure_hg))
    pressure = normalize_pressure_hpa(pressure_hpa)

    
    features = pd.DataFrame([[float(lat), float(lon), wind, pressure]], columns=feature_names)

    
    prediction = model.predict(features)

    
    if prediction == 1:
        return f"Hurricane is likely to occur at location:{location} having latitude: {lat}, longitude: {lon}"
    else:
        return f"No hurricane is likely to occur at {location} having latitude: {lat}, longitude: {lon}"

if __name__ == "__main__":
    
    lat = sys.argv[1]
    lon = sys.argv[2]
    wind_mph = sys.argv[3]
    pressure_hg = sys.argv[4]
    location=sys.argv[5]

    
    print(predict_hurricane(lat, lon, wind_mph, pressure_hg))
