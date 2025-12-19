function RecommendationsCard({ recommendations }) {
  const getCategoryColor = (category) => {
    const colors = {
      vegetables: 'bg-green-100 text-green-800',
      grains: 'bg-yellow-100 text-yellow-800',
      general: 'bg-blue-100 text-blue-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (trend) => {
    if (trend === 'rising') return '📈'
    if (trend === 'falling') return '📉'
    return '➡️'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🎯</span>
        AI Crop Recommendations
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4">Rank</th>
              <th className="text-left py-3 px-4">Crop</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Suitability Score</th>
              <th className="text-left py-3 px-4">Season</th>
              <th className="text-left py-3 px-4">Market Trend</th>
              <th className="text-left py-3 px-4">Demand</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-bold text-gray-600">#{index + 1}</td>
                <td className="py-3 px-4 font-semibold text-gray-800">{rec.crop}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(rec.category)}`}>
                    {rec.category}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`font-bold text-lg ${getScoreColor(rec.score)}`}>
                    {rec.score}%
                  </span>
                </td>
                <td className="py-3 px-4 capitalize text-gray-600">{rec.suitable_season}</td>
                <td className="py-3 px-4">
                  <span className="flex items-center gap-1">
                    {getTrendIcon(rec.market.trend)}
                    <span className="capitalize">{rec.market.trend}</span>
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    rec.market.demand === 'high' ? 'bg-green-100 text-green-800' :
                    rec.market.demand === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {rec.market.demand}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecommendationsCard
