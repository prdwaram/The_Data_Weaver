import WeatherCard from './WeatherCard'
import SoilCard from './SoilCard'
import RecommendationsCard from './RecommendationsCard'
import MarketTrends from './MarketTrends'

function Dashboard({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeatherCard weather={data.weather} />
        <SoilCard soil={data.soil} />
      </div>
      
      <RecommendationsCard recommendations={data.recommendations} />
      
      <MarketTrends recommendations={data.recommendations.slice(0, 5)} />
    </div>
  )
}

export default Dashboard
