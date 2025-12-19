function WeatherCard({ weather }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🌤️</span>
        Weather Conditions
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Location:</span>
          <span className="font-semibold text-gray-800">{weather.location}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Temperature:</span>
          <span className="font-semibold text-orange-600">{weather.temperature.toFixed(1)}°C</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Humidity:</span>
          <span className="font-semibold text-blue-600">{weather.humidity.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Rainfall:</span>
          <span className="font-semibold text-blue-800">{weather.rainfall.toFixed(1)} mm</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Condition:</span>
          <span className="font-semibold text-gray-800">{weather.description}</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
