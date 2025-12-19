function SoilCard({ soil }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🌱</span>
        Soil Conditions
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">pH Level:</span>
          <span className="font-semibold text-green-600">{soil.ph}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Nitrogen (N):</span>
          <span className="font-semibold text-purple-600">{soil.nitrogen} kg/ha</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Phosphorus (P):</span>
          <span className="font-semibold text-orange-600">{soil.phosphorus} kg/ha</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Potassium (K):</span>
          <span className="font-semibold text-red-600">{soil.potassium} kg/ha</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Organic Matter:</span>
          <span className="font-semibold text-green-700">{soil.organic_matter}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Moisture:</span>
          <span className="font-semibold text-blue-600">{soil.moisture}%</span>
        </div>
      </div>
    </div>
  )
}

export default SoilCard
