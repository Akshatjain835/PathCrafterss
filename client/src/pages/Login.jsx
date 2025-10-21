import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
// Header is rendered globally in App

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((s) => s.auth)

  const [form, setForm] = useState({ email: '', password: '', role: 'Performer' })

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(loginUser(form))
    if (res.type === 'auth/login/fulfilled') {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="hidden lg:block">
                <div className="relative h-72 rounded-lg overflow-hidden shadow-md">
                  <img src="/src/assets/hero.jpg" alt="Hero" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Design your routes</h3>
                <p className="text-sm text-gray-500">Manage performers, heads and map paths with ease.</p>
              </div>

              <div>
                <form onSubmit={onSubmit} className="space-y-4">
                  <Input id="email" name="email" type="email" label="Email" value={form.email} onChange={onChange} description="We'll never share your email." />
                  <Input id="password" name="password" type="password" label="Password" value={form.password} onChange={onChange} />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select name="role" value={form.role} onChange={onChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2">
                      <option>Performer</option>
                      <option>Head</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={status === 'loading'}>
                      {status === 'loading' ? 'Signing in…' : 'Sign in'}
                    </Button>
                  </div>

                  {error && <div className="text-red-600">{error.message || JSON.stringify(error)}</div>}
                </form>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Login
