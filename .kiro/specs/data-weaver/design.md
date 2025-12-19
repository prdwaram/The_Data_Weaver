# Design Document: The Data Weaver

## Overview

The Data Weaver is a full-stack web application that provides AI-powered crop recommendations for Indian farmers. The system architecture follows a client-server model with a React-based frontend and a Python Flask backend. The application integrates multiple data sources (weather, soil, market) and applies a scoring algorithm to rank crops by suitability.

The core innovation lies in the Recommendation Engine, which combines environmental factors (temperature, rainfall, soil pH) with economic indicators (market trends, demand, price forecasts) to produce actionable crop recommendations. The system is designed to be extensible, allowing for future integration of real weather APIs, soil sensor data, and live market feeds.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Location   │  │   Dashboard  │  │  Components  │      │
│  │    Input     │  │  Controller  │  │   (Cards)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │ HTTP/JSON
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend (Flask)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   API Layer  │  │ Recommendation│  │  Data Layer  │      │
│  │  (Routes)    │  │    Engine     │  │ (Crop DB)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         ▼                  ▼                  ▼              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Weather    │  │     Soil     │  │    Market    │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Axios
- **Backend**: Python 3.x, Flask, Flask-CORS
- **Data Sources**: OpenWeatherMap API (weather), Generated data (soil, market)
- **Deployment**: Development servers (Vite dev server, Flask debug mode)

### Communication Flow

1. User enters location in frontend
2. Frontend sends POST request to `/api/analyze` with location
3. Backend fetches weather data from Weather Service
4. Backend generates soil data from Soil Service
5. Backend generates market data from Market Service
6. Recommendation Engine calculates suitability scores for all crops
7. Backend returns top 10 recommendations with supporting data
8. Frontend displays results in organized dashboard layout

## Components and Interfaces

### Frontend Components

#### App Component
- **Responsibility**: Main application controller, manages location input and data fetching
- **State**: location (string), data (object), loading (boolean), error (string)
- **Methods**: 
  - `handleAnalyze()`: Validates input and triggers API call
- **Interface**: Renders location input, analyze button, and Dashboard component

#### Dashboard Component
- **Responsibility**: Organizes and displays all data sections
- **Props**: data (object containing weather, soil, recommendations)
- **Interface**: Renders WeatherCard, SoilCard, RecommendationsCard, MarketTrends

#### WeatherCard Component
- **Responsibility**: Displays weather information
- **Props**: weather (object with temperature, humidity, rainfall, description)
- **Interface**: Card layout with weather metrics

#### SoilCard Component
- **Responsibility**: Displays soil condition information
- **Props**: soil (object with pH, nitrogen, phosphorus, potassium, organic_matter, moisture)
- **Interface**: Card layout with soil metrics

#### RecommendationsCard Component
- **Responsibility**: Displays ranked crop recommendations
- **Props**: recommendations (array of crop objects)
- **Interface**: List of crops with scores, categories, and seasons

#### MarketTrends Component
- **Responsibility**: Displays market data for top crops
- **Props**: recommendations (array of top 5 crop objects)
- **Interface**: Table or card layout with market indicators

### Backend Components

#### API Layer (`/api/analyze`, `/api/health`)
- **Responsibility**: Handle HTTP requests and responses
- **Input**: JSON with location field
- **Output**: JSON with weather, soil, recommendations, timestamp
- **Error Handling**: Returns appropriate HTTP status codes and error messages

#### Weather Service
- **Responsibility**: Fetch or generate weather data
- **Function**: `get_weather_data(location: str) -> dict`
- **Output**: Dictionary with temperature, humidity, rainfall, description, location
- **Current Implementation**: Mock data generation (to be replaced with API integration)

#### Soil Service
- **Responsibility**: Generate or fetch soil condition data
- **Function**: `get_soil_data(location: str) -> dict`
- **Output**: Dictionary with pH, nitrogen, phosphorus, potassium, organic_matter, moisture
- **Current Implementation**: Random generation within realistic ranges

#### Market Service
- **Responsibility**: Generate or fetch market trend data
- **Function**: `get_market_trends() -> dict`
- **Output**: Dictionary mapping crop names to market data (current_price, trend, demand, forecast)
- **Current Implementation**: Random generation

#### Recommendation Engine
- **Responsibility**: Calculate crop suitability scores
- **Function**: `calculate_crop_score(crop_data: dict, weather: dict, soil: dict) -> float`
- **Algorithm**:
  1. Start with base score of 100
  2. Add 20 points if temperature in optimal range, else subtract based on difference
  3. Add 20 points if rainfall in optimal range, else subtract based on difference
  4. Add 15 points if soil pH in optimal range, else subtract based on difference
  5. Adjust for market trends (+10 rising, -10 falling)
  6. Adjust for demand (+5 high demand)
  7. Constrain final score to [0, 100]
- **Output**: Float between 0 and 100

## Data Models

### Crop Data Structure
```python
{
    'crop_name': {
        'temp_range': (min_temp, max_temp),  # Celsius
        'rainfall': (min_rainfall, max_rainfall),  # mm
        'soil_ph': (min_ph, max_ph),  # pH scale
        'season': 'winter' | 'summer' | 'monsoon'
    }
}
```

### Weather Data Structure
```python
{
    'temperature': float,  # Celsius
    'humidity': float,  # Percentage
    'rainfall': float,  # mm
    'description': str,
    'location': str
}
```

### Soil Data Structure
```python
{
    'ph': float,  # 5.0-7.5
    'nitrogen': int,  # ppm
    'phosphorus': int,  # ppm
    'potassium': int,  # ppm
    'organic_matter': float,  # percentage
    'moisture': int  # percentage
}
```

### Market Data Structure
```python
{
    'crop_name': {
        'current_price': int,  # INR
        'trend': 'rising' | 'stable' | 'falling',
        'demand': 'high' | 'medium' | 'low',
        'forecast': int  # percentage change
    }
}
```

### Recommendation Data Structure
```python
{
    'crop': str,
    'category': 'vegetables' | 'grains' | 'general',
    'score': float,  # 0-100
    'market': dict,  # Market data structure
    'suitable_season': str
}
```

### API Response Structure
```python
{
    'weather': dict,  # Weather data structure
    'soil': dict,  # Soil data structure
    'recommendations': list,  # Array of recommendation structures
    'timestamp': str  # ISO format datetime
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

After analyzing the acceptance criteria, several properties can be consolidated to avoid redundancy. For example, properties 2.1-2.4 all verify that weather data contains required fields, which can be combined into a single comprehensive property. Similarly, properties 3.2-3.6 for soil data fields can be consolidated. Properties about market data structure (5.1-5.4) can also be combined.

### Data Structure Properties

**Property 1: Weather data completeness**
*For any* location query, the returned weather data should contain all required fields: temperature, humidity, rainfall, description, and location.
**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

**Property 2: Soil data completeness and pH range**
*For any* location query, the returned soil data should contain all required fields (pH, nitrogen, phosphorus, potassium, organic_matter, moisture) and the pH value should be between 5.0 and 7.5.
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

**Property 3: Market data completeness and valid enums**
*For any* crop in the market data, the data should contain all required fields (current_price, trend, demand, forecast) and trend should be one of {rising, stable, falling} and demand should be one of {high, medium, low}.
**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

**Property 4: Recommendation structure completeness**
*For any* recommendation in the output, it should contain all required fields: crop name, category, suitability score, market data, and suitable season.
**Validates: Requirements 6.4, 6.5, 8.4**

### Recommendation Engine Properties

**Property 5: All crops evaluated**
*For any* analysis request, the recommendation engine should evaluate every crop in the Crop Database and include it in the initial results before filtering to top 10.
**Validates: Requirements 4.1**

**Property 6: Temperature affects scoring**
*For any* crop and weather conditions, if the temperature is within the crop's optimal range, the suitability score should be higher than if the temperature is outside the range (all other factors being equal).
**Validates: Requirements 4.2, 4.7, 9.2, 9.3**

**Property 7: Rainfall affects scoring**
*For any* crop and weather conditions, if the rainfall is within the crop's optimal range, the suitability score should be higher than if the rainfall is outside the range (all other factors being equal).
**Validates: Requirements 4.3, 9.4, 9.5**

**Property 8: Soil pH affects scoring**
*For any* crop and soil conditions, if the soil pH is within the crop's optimal range, the suitability score should be higher than if the pH is outside the range (all other factors being equal).
**Validates: Requirements 4.4, 9.6, 9.7**

**Property 9: Market trend adjustment**
*For any* crop with identical environmental scores, a crop with a rising market trend should have a score 10 points higher than one with stable trend, and a crop with falling trend should have a score 10 points lower than one with stable trend.
**Validates: Requirements 4.5, 5.5, 5.6**

**Property 10: High demand adjustment**
*For any* crop with identical environmental and trend scores, a crop with high demand should have a score 5 points higher than one without high demand.
**Validates: Requirements 5.7**

**Property 11: Score bounds**
*For any* crop and conditions (even extreme values), the calculated suitability score should always be constrained between 0 and 100 inclusive.
**Validates: Requirements 9.8**

**Property 12: Top 10 sorted recommendations**
*For any* analysis result, the recommendations list should contain at most 10 crops and should be sorted in descending order by suitability score.
**Validates: Requirements 4.6**

### API Properties

**Property 13: API response structure**
*For any* valid POST request to /api/analyze with a location, the response should be valid JSON containing weather, soil, recommendations, and timestamp fields.
**Validates: Requirements 8.1**

**Property 14: Error responses**
*For any* request that triggers an error condition, the backend should return an appropriate HTTP error status code (4xx or 5xx) and an error message.
**Validates: Requirements 8.5**

### Frontend Properties

**Property 15: Loading state management**
*For any* data fetch operation, the loading indicator should be displayed while the request is in progress and hidden once the request completes (success or failure).
**Validates: Requirements 7.3**

**Property 16: Dashboard sections present**
*For any* successful data fetch, the rendered dashboard should contain distinct sections for weather, soil, recommendations, and market trends.
**Validates: Requirements 7.4**

## Error Handling

### Frontend Error Handling

1. **Empty Input Validation**
   - Check for empty or whitespace-only location strings before submission
   - Display user-friendly error message: "Please enter a location"
   - Prevent API call if validation fails

2. **Network Errors**
   - Catch axios request failures
   - Display error message: "Failed to fetch data. Make sure the backend is running."
   - Log error details to console for debugging
   - Maintain previous data display if available

3. **Invalid Response**
   - Validate response structure before updating state
   - Handle missing fields gracefully
   - Display generic error message if response is malformed

### Backend Error Handling

1. **Missing Request Data**
   - Validate presence of location field in request body
   - Return 400 Bad Request with error message if missing

2. **Weather Service Failures**
   - Catch exceptions from weather API calls
   - Return 503 Service Unavailable if external service fails
   - Include error details in response for debugging

3. **Internal Errors**
   - Catch unexpected exceptions in scoring algorithm
   - Return 500 Internal Server Error
   - Log full stack trace for debugging

4. **CORS Configuration**
   - Enable CORS for all routes to prevent cross-origin errors
   - Configure appropriate headers for development and production

## Testing Strategy

### Unit Testing

**Frontend Unit Tests (Jest + React Testing Library)**
- Test App component input validation logic
- Test Dashboard component rendering with mock data
- Test individual card components with various data inputs
- Test error state rendering
- Test loading state rendering

**Backend Unit Tests (pytest)**
- Test `get_weather_data()` returns correct structure
- Test `get_soil_data()` returns correct structure and pH range
- Test `get_market_trends()` returns correct structure
- Test `calculate_crop_score()` with various input combinations
- Test API endpoints return correct status codes
- Test error handling for missing request data

### Property-Based Testing

We will use **Hypothesis** for Python backend property-based testing and **fast-check** for JavaScript frontend property-based testing.

**Configuration**: Each property-based test should run a minimum of 100 iterations to ensure thorough coverage of the input space.

**Tagging Convention**: Each property-based test must include a comment tag in this format:
```python
# Feature: data-weaver, Property {number}: {property_text}
```

**Backend Property Tests**:
- Property 2: Generate random locations, verify soil data structure and pH bounds
- Property 3: Generate random crop lists, verify market data structure and enum values
- Property 5: Verify all crops in database appear in initial recommendation results
- Property 6: Generate random temperatures and crop ranges, verify scoring behavior
- Property 7: Generate random rainfall and crop ranges, verify scoring behavior
- Property 8: Generate random pH values and crop ranges, verify scoring behavior
- Property 9: Generate random environmental scores, verify market trend adjustments
- Property 10: Generate random scores, verify high demand adjustment
- Property 11: Generate extreme environmental values, verify score bounds
- Property 12: Generate random crop scores, verify top 10 sorting and limiting

**Frontend Property Tests**:
- Property 1: Generate random weather data structures, verify all required fields present
- Property 4: Generate random recommendation structures, verify all required fields present
- Property 15: Test loading state transitions with various async scenarios
- Property 16: Generate random valid data, verify all dashboard sections render

**Integration Tests**:
- End-to-end test: Submit location → verify complete workflow → check response structure
- Test with various Indian city names
- Test error scenarios (empty input, backend unavailable)

### Test Data Generators

For property-based testing, we need smart generators that produce realistic test data:

**Weather Generator**:
- Temperature: 10-40°C (realistic range for India)
- Humidity: 20-100%
- Rainfall: 0-300mm
- Description: Random selection from realistic descriptions

**Soil Generator**:
- pH: 4.0-8.5 (wider than valid range to test bounds)
- Nitrogen: 100-500 ppm
- Phosphorus: 10-80 ppm
- Potassium: 100-400 ppm
- Organic matter: 0.5-6.0%
- Moisture: 10-90%

**Crop Generator**:
- Temperature range: Random valid ranges within 5-45°C
- Rainfall range: Random valid ranges within 20-250mm
- pH range: Random valid ranges within 4.5-8.0
- Season: Random selection from {winter, summer, monsoon}

**Market Generator**:
- Price: 500-10000 INR
- Trend: Random from {rising, stable, falling}
- Demand: Random from {high, medium, low}
- Forecast: -30 to +50 percentage

## Performance Considerations

1. **Response Time**: Target < 5 seconds for complete analysis (Requirement 1.4)
   - Weather API call: < 2 seconds
   - Scoring calculation: < 1 second
   - Frontend rendering: < 1 second

2. **Scalability**: Current implementation handles single-user requests
   - Future: Add caching for weather data (5-minute TTL)
   - Future: Add database for crop data instead of in-memory dictionary
   - Future: Add request queuing for high traffic

3. **Data Efficiency**: Minimize payload size
   - Return only top 10 recommendations (not all crops)
   - Use compact JSON structure
   - Consider compression for large responses

## Security Considerations

1. **API Key Protection**: Weather API key should be stored in environment variables, not hardcoded
2. **Input Validation**: Sanitize location input to prevent injection attacks
3. **Rate Limiting**: Implement rate limiting to prevent abuse (future enhancement)
4. **CORS Configuration**: Restrict CORS to specific origins in production
5. **HTTPS**: Use HTTPS in production to encrypt data in transit

## Future Enhancements

1. **Real Weather Integration**: Replace mock data with actual OpenWeatherMap API calls
2. **Soil Sensor Integration**: Connect to IoT soil sensors for real-time data
3. **Live Market Data**: Integrate with agricultural market APIs (e.g., Agmarknet)
4. **User Accounts**: Allow farmers to save locations and track recommendations over time
5. **Historical Analysis**: Show trends in recommendations over seasons
6. **Multi-language Support**: Add Hindi, Tamil, Telugu, and other regional languages
7. **Offline Mode**: Cache data for offline access in areas with poor connectivity
8. **SMS Notifications**: Send recommendations via SMS for farmers without smartphones
9. **Crop Calendar**: Integrate planting and harvesting schedules
10. **Pest and Disease Alerts**: Add warnings based on weather conditions
