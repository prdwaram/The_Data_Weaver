import { useState } from 'react'
import axios from 'axios'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [location, setLocation] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!location.trim()) {
      setError('Please enter a location')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        location: location
      })
      setData(response.data)
    } catch (err) {
      setError('Failed to fetch data. Make sure the backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            🌾 The Data Weaver
          </h1>
          <p className="text-gray-600">
            AI-Powered Crop Recommendations for Indian Farmers
          </p>
        </header>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter location (e.g., Delhi, Mumbai, Bangalore)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
            {error && (
              <p className="mt-4 text-red-600 text-sm">{error}</p>
            )}
          </div>
        </div>

        {data && <Dashboard data={data} />}
      </div>
    </div>
  )
}

export default App
