// import { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { loginUser } from '../features/auth/authSlice'
// import { useNavigate } from 'react-router-dom'
// import { Input } from '@/components/ui/Input'
// import { Button } from '@/components/ui/Button'
// import { Card } from '@/components/ui/Card'

// const Login = () => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const { status, error } = useSelector((s) => s.auth)

//   const [form, setForm] = useState({ email: '', password: '', role: 'Performer' })

//   const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

//   const onSubmit = async (e) => {
//     e.preventDefault()
//   try {
//     await dispatch(loginUser(form)).unwrap()
//     navigate("/dashboard")
//   } catch (err) {
//     console.error("Login failed:", err)
//   }
//   }

//   return (
//     <div className=" bg-slate-50 flex flex-col">
//       <main className="flex-1 flex items-center justify-center px-4 py-12">
//         <div className="w-full max-w-3xl">
//           <Card>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//               <div className="hidden lg:block">
//                 <div className="relative h-72 rounded-lg overflow-hidden shadow-md">
//                   <img src="/src/assets/travel.avif" alt="Hero" className="object-cover w-full h-full" />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
//                 </div>
//                 <h3 className="mt-4 text-lg font-medium">Design your routes</h3>
//                 <p className="text-sm text-gray-500">Manage performers, heads and map paths with ease.</p>
//               </div>

//               <div>
//                 <form onSubmit={onSubmit} className="space-y-4 mt-3 mr-4 mb-7">
//                   <label className="block text-sm text-left font-medium text-gray-700 mb-1">Enter your email</label>
//                   <Input id="email" name="email" type="email" label="Email" value={form.email} onChange={onChange} placeholder="you@gmail.com" />
//                   <label className="block text-sm text-left font-medium text-gray-700 mb-1">Enter your password</label>
//                   <Input id="password" name="password" type="password" label="Password" value={form.password} onChange={onChange} placeholder="Your password" />
//                   <div>
//                     <label className="block text-sm text-left font-medium text-gray-700 mb-1">Role</label>
//                     <select name="role" value={form.role} onChange={onChange} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2">
//                       <option>Performer</option>
//                       <option>Head</option>
//                     </select>
//                   </div>

//                   <div className="pt-2">
//                     <Button type="submit" className="w-full" disabled={status === 'loading'}>
//                       {status === 'loading' ? 'Signing in…' : 'Sign in'}
//                     </Button>
//                   </div>

//                   {error && <div className="text-red-600">{error.message || JSON.stringify(error)}</div>}
//                 </form>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default Login


import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'

const DESTINATIONS = [
  { city: 'Santorini', country: 'Greece',     img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80' },
  { city: 'Kyoto',     country: 'Japan',      img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80' },
  { city: 'Amalfi',   country: 'Italy',      img: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=80' },
  { city: 'Bali',      country: 'Indonesia',  img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80' },
]

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
.pc-auth-root { min-height:100vh; display:flex; font-family:'DM Sans',sans-serif; }
.pc-left { position:relative; flex:1.15; overflow:hidden; display:none; flex-direction:column; }
@media(min-width:900px){ .pc-left{display:flex;} }
.pc-dest-img { position:absolute; inset:0; background-size:cover; background-position:center; transition:opacity 1.2s ease; }
.pc-dest-overlay { position:absolute; inset:0; background:linear-gradient(155deg,rgba(8,12,36,.18) 0%,rgba(8,12,36,.78) 100%); }
.pc-dot { width:8px; height:8px; border-radius:50%; border:1.5px solid rgba(255,255,255,.55); background:transparent; cursor:pointer; transition:all .3s; padding:0; }
.pc-dot.on { background:#F5C842; border-color:#F5C842; width:22px; border-radius:4px; }
.pc-right { flex:1; display:flex; align-items:center; justify-content:center; background:#F7F7F5; padding:48px 24px; }
.pc-card { width:100%; max-width:400px; }
.pc-label { display:block; font-size:11.5px; font-weight:500; letter-spacing:.07em; text-transform:uppercase; color:#6B7280; margin-bottom:7px; }
.pc-input { width:100%; padding:12px 16px; border:1.5px solid #E5E7EB; border-radius:10px; font-size:15px; color:#111827; background:#fff; outline:none; transition:border-color .2s,box-shadow .2s; font-family:'DM Sans',sans-serif; box-sizing:border-box; }
.pc-input:focus { border-color:#2B4FD8; box-shadow:0 0 0 3px rgba(43,79,216,.09); }
.pc-input::placeholder { color:#B0B7C3; }
.pc-eye { position:absolute; right:13px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#9CA3AF; padding:4px; display:flex; align-items:center; }
.pc-eye:hover { color:#374151; }
.pc-btn { width:100%; padding:13px; border-radius:10px; border:none; cursor:pointer; background:linear-gradient(135deg,#2B4FD8 0%,#1535b0 100%); color:#fff; font-size:15px; font-weight:600; font-family:'DM Sans',sans-serif; letter-spacing:.02em; transition:transform .15s,box-shadow .15s; box-shadow:0 4px 14px rgba(43,79,216,.3); }
.pc-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 7px 22px rgba(43,79,216,.38); }
.pc-btn:disabled { opacity:.6; cursor:not-allowed; }
.pc-err { background:#FEF2F2; border:1px solid #FECACA; border-radius:8px; padding:10px 14px; color:#DC2626; font-size:13px; margin-top:14px; }
.pc-divider { display:flex; align-items:center; gap:12px; margin:22px 0; color:#9CA3AF; font-size:13px; }
.pc-divider::before,.pc-divider::after { content:''; flex:1; height:1px; background:#E5E7EB; }
.pc-serif { font-family:'Cormorant Garamond',serif; }
`

const EyeOpen  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeShut  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
const PlaneIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((s) => s.auth)
  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [active, setActive]     = useState(0)
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSubmit = async (e) => {
    e.preventDefault()
    try { await dispatch(loginUser(form)).unwrap(); navigate('/dashboard') } catch(_) {}
  }
  return (
    <div className="pc-auth-root">
      <style>{CSS}</style>
      {/* LEFT */}
      <div className="pc-left">
        {DESTINATIONS.map((d,i) => (
          <div key={i} className="pc-dest-img" style={{ backgroundImage:`url(${d.img})`, opacity:i===active?1:0 }} />
        ))}
        <div className="pc-dest-overlay" />
        {/* top */}
        <div style={{ position:'relative', zIndex:2, padding:'36px 40px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'rgba(255,255,255,0.13)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.22)' }}>
              <PlaneIcon />
            </div>
            <span className="pc-serif" style={{ color:'#fff', fontSize:22, fontWeight:600 }}>PathCrafters</span>
          </div>
        </div>
        {/* bottom */}
        <div style={{ position:'relative', zIndex:2, padding:'0 40px 44px', marginTop:'auto' }}>
          <p style={{ color:'rgba(255,255,255,.55)', fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', margin:'0 0 8px' }}>Currently exploring</p>
          <h2 className="pc-serif" style={{ color:'#fff', fontSize:52, fontWeight:600, lineHeight:1.05, margin:'0 0 6px' }}>{DESTINATIONS[active].city}</h2>
          <p style={{ color:'rgba(255,255,255,.65)', fontSize:15, margin:'0 0 26px' }}>{DESTINATIONS[active].country}</p>
          <div style={{ display:'flex', gap:8 }}>
            {DESTINATIONS.map((_,i) => <button key={i} className={`pc-dot${i===active?' on':''}`} onClick={() => setActive(i)} />)}
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="pc-right">
        <div className="pc-card">
          {/* logo (mobile + desktop) */}
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:36 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#2B4FD8,#1535b0)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <PlaneIcon />
            </div>
            <span className="pc-serif" style={{ fontSize:20, fontWeight:600, color:'#111827' }}>PathCrafters</span>
          </div>

          <h1 className="pc-serif" style={{ fontSize:36, fontWeight:600, color:'#111827', margin:'0 0 6px', lineHeight:1.15 }}>Welcome back</h1>
          <p style={{ color:'#6B7280', fontSize:15, margin:'0 0 32px', lineHeight:1.5 }}>Sign in to continue planning your next adventure.</p>

          <form onSubmit={onSubmit}>
            {/* email */}
            <div style={{ marginBottom:18 }}>
              <label className="pc-label">Email address</label>
              <input className="pc-input" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" required autoComplete="email" />
            </div>
            {/* password */}
            <div style={{ marginBottom:10, position:'relative' }}>
              <label className="pc-label">Password</label>
              <input className="pc-input" name="password" type={showPass?'text':'password'} value={form.password} onChange={onChange} placeholder="••••••••" required autoComplete="current-password" style={{ paddingRight:44 }} />
              <button type="button" className="pc-eye" onClick={() => setShowPass(v=>!v)} tabIndex={-1}>
                {showPass ? <EyeShut /> : <EyeOpen />}
              </button>
            </div>
            {/* forgot */}
            <div style={{ textAlign:'right', marginBottom:26 }}>
              <a href="#" style={{ fontSize:13, color:'#2B4FD8', textDecoration:'none', fontWeight:500 }}>Forgot password?</a>
            </div>

            <button type="submit" className="pc-btn" disabled={status==='loading'}>
              {status==='loading' ? 'Signing in…' : 'Sign in →'}
            </button>

            {error && <div className="pc-err">{error.message || 'Invalid credentials. Please try again.'}</div>}
          </form>

          <div className="pc-divider">or</div>

          <p style={{ textAlign:'center', fontSize:14, color:'#6B7280' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color:'#2B4FD8', fontWeight:600, textDecoration:'none' }}>Create one free →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}