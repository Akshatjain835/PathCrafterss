import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../features/auth/authSlice'

const Header = () => {
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <header className="bg-slate-50 border-b">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">PathCrafters</Link>
        <nav className="space-x-3 flex items-center">
          {!user && (
            <>
              <Link to="/login" className="text-sky-600">Login</Link>
              <Link to="/signup" className="text-sky-600">Sign up</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/dashboard" className="text-sky-600 mr-3">Dashboard</Link>
              <span className="text-gray-700 mr-3">{user.username || user.email}</span>
              <button onClick={onLogout} className="text-red-600">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
