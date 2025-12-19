from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Crop database with growing conditions
CROPS_DB = {
    'vegetables': {
        'Tomato': {'temp_range': (15, 30), 'rainfall': (50, 150), 'soil_ph': (6.0, 7.0), 'season': 'winter'},
        'Brinjal': {'temp_range': (20, 35), 'rainfall': (60, 100), 'soil_ph': (5.5, 6.5), 'season': 'summer'},
        'Mirchi': {'temp_range': (20, 30), 'rainfall': (60, 120), 'soil_ph': (6.5, 7.5), 'season': 'summer'},
        'Karela': {'temp_range': (24, 35), 'rainfall': (50, 100), 'soil_ph': (6.0, 7.0), 'season': 'summer'}
    },
    'grains': {
        'Rice': {'temp_range': (20, 35), 'rainfall': (100, 200), 'soil_ph': (5.5, 6.5), 'season': 'monsoon'},
        'Wheat': {'temp_range': (10, 25), 'rainfall': (30, 80), 'soil_ph': (6.0, 7.5), 'season': 'winter'},
        'Barley': {'temp_range': (12, 25), 'rainfall': (30, 70), 'soil_ph': (6.5, 7.5), 'season': 'winter'},
        'Chickpea': {'temp_range': (15, 30), 'rainfall': (40, 80), 'soil_ph': (6.0, 7.5), 'season': 'winter'},
        'Ground nut': {'temp_range': (20, 30), 'rainfall': (50, 100), 'soil_ph': (6.0, 6.5), 'season': 'summer'},
        'Maize': {'temp_range': (18, 32), 'rainfall': (60, 120), 'soil_ph': (5.5, 7.0), 'season': 'monsoon'},
        'Millets': {'temp_range': (25, 35), 'rainfall': (40, 80), 'soil_ph': (5.0, 7.0), 'season': 'summer'}
    },
    'general': {
        'Cotton': {'temp_range': (21, 35), 'rainfall': (50, 100), 'soil_ph': (6.0, 7.5), 'season': 'summer'},
        'Tobacco': {'temp_range': (20, 30), 'rainfall': (50, 120), 'soil_ph': (5.5, 6.5), 'season': 'winter'}
    }
}

def get_weather_data(location):
    """Fetch weather data from OpenWeatherMap API"""
    api_key = "YOUR_API_KEY"  # Replace with actual API key
    
    # Mock weather data for demo
    return {
        'temperature': random.uniform(15, 35),
        'humidity': random.uniform(40, 90),
        'rainfall': random.uniform(20, 150),
        'description': random.choice(['Clear sky', 'Partly cloudy', 'Rainy', 'Humid']),
        'location': location
    }

def get_soil_data(location):
    """Generate soil condition data"""
    return {
        'ph': round(random.uniform(5.0, 7.5), 1),
        'nitrogen': random.randint(200, 400),
        'phosphorus': random.randint(20, 60),
        'potassium': random.randint(150, 300),
        'organic_matter': round(random.uniform(1.5, 4.0), 1),
        'moisture': random.randint(30, 70)
    }

def calculate_crop_score(crop_data, weather, soil):
    """Calculate suitability score for a crop"""
    score = 100
    
    # Temperature match
    temp = weather['temperature']
    if crop_data['temp_range'][0] <= temp <= crop_data['temp_range'][1]:
        score += 20
    else:
        score -= abs(temp - sum(crop_data['temp_range'])/2) * 2
    
    # Rainfall match
    rainfall = weather['rainfall']
    if crop_data['rainfall'][0] <= rainfall <= crop_data['rainfall'][1]:
        score += 20
    else:
        score -= abs(rainfall - sum(crop_data['rainfall'])/2) * 0.5
    
    # Soil pH match
    ph = soil['ph']
    if crop_data['soil_ph'][0] <= ph <= crop_data['soil_ph'][1]:
        score += 15
    else:
        score -= abs(ph - sum(crop_data['soil_ph'])/2) * 10
    
    return max(0, min(100, score))

def get_market_trends():
    """Generate market trend data"""
    crops = []
    for category in CROPS_DB.values():
        crops.extend(category.keys())
    
    trends = {}
    for crop in crops:
        trends[crop] = {
            'current_price': random.randint(1000, 5000),
            'trend': random.choice(['rising', 'stable', 'falling']),
            'demand': random.choice(['high', 'medium', 'low']),
            'forecast': random.randint(-15, 25)
        }
    return trends

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    location = data.get('location', 'Delhi')
    
    # Fetch data
    weather = get_weather_data(location)
    soil = get_soil_data(location)
    market = get_market_trends()
    
    # Calculate recommendations
    recommendations = []
    for category, crops in CROPS_DB.items():
        for crop_name, crop_data in crops.items():
            score = calculate_crop_score(crop_data, weather, soil)
            market_data = market[crop_name]
            
            # Adjust score based on market
            if market_data['trend'] == 'rising':
                score += 10
            elif market_data['trend'] == 'falling':
                score -= 10
            
            if market_data['demand'] == 'high':
                score += 5
            
            recommendations.append({
                'crop': crop_name,
                'category': category,
                'score': round(score, 1),
                'market': market_data,
                'suitable_season': crop_data['season']
            })
    
    # Sort by score
    recommendations.sort(key=lambda x: x['score'], reverse=True)
    
    return jsonify({
        'weather': weather,
        'soil': soil,
        'recommendations': recommendations[:10],
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
