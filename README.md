# The Data Weaver - Smart Crop Recommendation Dashboard

An AI-powered dashboard that combines weather data, soil conditions, and market trends to recommend optimal crops for Indian farmers.

## Features

- Real-time weather data integration
- Soil condition analysis
- Market trend predictions
- AI-based crop recommendations
- Support for vegetables, grains, and cash crops

## Supported Crops

**Vegetables**: Tomato, Brinjal, Mirchi, Karela
**Grains**: Rice, Wheat, Barley, Chickpea, Ground nut, Maize, Millets
**General**: Cotton, Tobacco

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Python Flask
- AI/ML: scikit-learn
- Data: OpenWeatherMap API, mock soil & market data

## Setup

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt

# Run backend
python app.py

# Run frontend (in another terminal)
cd frontend
npm run dev
```

## Usage

1. Enter location (city/district in India)
2. View weather conditions and soil analysis
3. Get AI-recommended crops based on conditions
4. See market trends for suggested crops
