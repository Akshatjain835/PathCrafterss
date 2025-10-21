import './App.css'
import Header from './components/Header'
import AppRoutes from './routes/Route'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="p-6">
        <AppRoutes />
      </div>
    </div>
  )
}

export default App
