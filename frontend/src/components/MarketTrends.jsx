import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function MarketTrends({ recommendations }) {
  const chartData = recommendations.map(rec => ({
    name: rec.crop,
    price: rec.market.current_price,
    forecast: rec.market.forecast,
    score: rec.score
  }))

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Market Analysis - Top 5 Crops
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {recommendations.map((rec, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-lg text-gray-800 mb-2">{rec.crop}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Price:</span>
                <span className="font-semibold text-green-600">₹{rec.market.current_price}/quintal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price Forecast:</span>
                <span className={`font-semibold ${rec.market.forecast > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {rec.market.forecast > 0 ? '+' : ''}{rec.market.forecast}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Market Demand:</span>
                <span className="font-semibold capitalize">{rec.market.demand}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="price" fill="#10b981" name="Current Price (₹)" />
            <Bar dataKey="score" fill="#3b82f6" name="Suitability Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default MarketTrends
