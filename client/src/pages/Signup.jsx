// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { registerUser } from "../features/auth/authSlice";
// import { useNavigate } from "react-router-dom";
// import { Input } from "@/components/ui/Input";
// import { Button } from "@/components/ui/Button";
// import { Card } from "@/components/ui/Card";

// const Signup = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { status, error } = useSelector((s) => s.auth);

//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//     phone: "",
//     location: "",
//     role: "Performer",
//   });

//   const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const res = await dispatch(registerUser(form));
//     if (res.type === "auth/register/fulfilled") {
//       navigate("/dashboard");
//     }
//   };

//   return (
//     <div className=" bg-slate-50 flex flex-col">
//       <main className="flex-1 flex items-center justify-center px-4 py-12">
//         <div className="w-full max-w-4xl">
//           <Card>
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
//               <div className="hidden lg:block">
//                 <div className="relative h-72 rounded-lg overflow-hidden shadow-md">
//                   <img
//                     src="/src/assets/travel.avif"
//                     alt="Hero"
//                     className="object-cover w-full h-full"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
//                 </div>
//                 <h3 className="mt-4 text-lg font-medium">Join PathCrafters</h3>
//                 <p className="text-sm text-gray-500">
//                   Create paths, collaborate with your team and manage
//                   performances.
//                 </p>
//               </div>

//               <div>
//                 <form
//                   onSubmit={onSubmit}
//                   className="grid grid-cols-1 gap-2 mr-4 mb-7"
//                 >
//                   <h6 className="mt-4 text-left">Enter Your Username</h6>
//                   <Input
//                     id="username"
//                     name="username"
//                     label="Username"
//                     value={form.username}
//                     onChange={onChange}
//                     placeholder="Your username"
//                   />
//                   <h6 className=" mt-0 text-left">Enter Your Email</h6>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     label="Email"
//                     value={form.email}
//                     onChange={onChange}
//                     placeholder="you@gmail.com"
//                   />
//                   <h6 className="mt-0 text-left">Enter Your Password</h6>
//                   <Input
//                     id="password"
//                     name="password"
//                     type="password"
//                     label="Password"
//                     value={form.password}
//                     onChange={onChange}
//                     placeholder="Use at least 8 characters(mix of letters, numbers etc.)"
//                   />

//                   <h6 className="mb - 0 text-left">Phone No.</h6>
//                   <Input
//                     id="phone"
//                     name="phone"
//                     label="Phone"
//                     value={form.phone}
//                     onChange={onChange}
//                     placeholder="Your phone number"
//                   />
//                   <h6 className="text-left">Address</h6>
//                   <Input
//                     id="location"
//                     name="location"
//                     label="Location"
//                     value={form.location}
//                     onChange={onChange}
//                     placeholder="Your address"
//                   />

//                   <div>
//                     <label className="block text-left font-medium text-gray-700 mb-1">
//                       Role
//                     </label>
//                     <select
//                       name="role"
//                       value={form.role}
//                       onChange={onChange}
//                       className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
//                     >
//                       <option>Performer</option>
//                       <option>Head</option>
//                     </select>
//                   </div>

//                   <div className="pt-2">
//                     <Button
//                       type="submit"
//                       className="w-full"
//                       disabled={status === "loading"}
//                     >
//                       {status === "loading"
//                         ? "Creating account…"
//                         : "Create account"}
//                     </Button>
//                   </div>

//                   {error && (
//                     <div className="text-red-600">
//                       {error.message || JSON.stringify(error)}
//                     </div>
//                   )}
//                 </form>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Signup;


import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
.pc-su-root { min-height:100vh; display:flex; font-family:'DM Sans',sans-serif; }
.pc-su-left { position:relative; flex:.9; overflow:hidden; display:none; flex-direction:column; justify-content:flex-end; }
@media(min-width:960px){ .pc-su-left{display:flex;} }
.pc-su-bg { position:absolute; inset:0; background:url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80') center/cover no-repeat; }
.pc-su-overlay { position:absolute; inset:0; background:linear-gradient(170deg,rgba(6,10,30,.1) 0%,rgba(6,10,30,.82) 100%); }
.pc-su-right { flex:1; display:flex; align-items:flex-start; justify-content:center; background:#F7F7F5; padding:40px 28px; overflow-y:auto; }
.pc-su-card { width:100%; max-width:460px; padding:8px 0 40px; }
.pc-su-label { display:block; font-size:11.5px; font-weight:500; letter-spacing:.07em; text-transform:uppercase; color:#6B7280; margin-bottom:7px; }
.pc-su-input { width:100%; padding:12px 16px; border:1.5px solid #E5E7EB; border-radius:10px; font-size:15px; color:#111827; background:#fff; outline:none; transition:border-color .2s,box-shadow .2s; font-family:'DM Sans',sans-serif; box-sizing:border-box; }
.pc-su-input:focus { border-color:#2B4FD8; box-shadow:0 0 0 3px rgba(43,79,216,.09); }
.pc-su-input::placeholder { color:#B0B7C3; }
.pc-su-eye { position:absolute; right:13px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#9CA3AF; padding:4px; display:flex; align-items:center; }
.pc-su-eye:hover { color:#374151; }
.pc-su-btn { width:100%; padding:13px; border-radius:10px; border:none; cursor:pointer; background:linear-gradient(135deg,#2B4FD8 0%,#1535b0 100%); color:#fff; font-size:15px; font-weight:600; font-family:'DM Sans',sans-serif; letter-spacing:.02em; transition:transform .15s,box-shadow .15s; box-shadow:0 4px 14px rgba(43,79,216,.3); }
.pc-su-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 7px 22px rgba(43,79,216,.38); }
.pc-su-btn:disabled { opacity:.6; cursor:not-allowed; }
.pc-su-err { background:#FEF2F2; border:1px solid #FECACA; border-radius:8px; padding:10px 14px; color:#DC2626; font-size:13px; margin-top:14px; }
.pc-su-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
@media(max-width:520px){ .pc-su-grid{grid-template-columns:1fr;} }
.pc-su-full { grid-column:1/-1; }
.pc-su-divider { display:flex; align-items:center; gap:12px; margin:22px 0; color:#9CA3AF; font-size:13px; }
.pc-su-divider::before,.pc-su-divider::after { content:''; flex:1; height:1px; background:#E5E7EB; }
.pc-serif { font-family:'Cormorant Garamond',serif; }
.pc-strength-bar { height:4px; border-radius:2px; flex:1; transition:background .3s; }
.step-pill { display:flex; align-items:center; gap:7px; font-size:12.5px; color:#6B7280; }
.step-pill .dot { width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; transition:all .25s; }
.step-pill .dot.done { background:#2B4FD8; color:#fff; }
.step-pill .dot.active { background:#EEF2FF; color:#2B4FD8; border:1.5px solid #2B4FD8; }
.step-pill .dot.idle { background:#F3F4F6; color:#9CA3AF; }
.step-line { flex:1; height:1.5px; background:#E5E7EB; max-width:32px; }
`

const STYLES_TRAVEL = [
  { v:'adventurer', label:'🧗 Adventurer' },
  { v:'relaxed',    label:'🌴 Relaxed' },
  { v:'cultural',   label:'🏛️ Cultural' },
  { v:'foodie',     label:'🍜 Foodie' },
  { v:'backpacker', label:'🎒 Backpacker' },
  { v:'luxury',     label:'✨ Luxury' },
]

const EyeOpen  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeShut  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
const PlaneIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
const CheckIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>

const strengthLabel = (p) => {
  if (!p) return { label:'', bars:[0,0,0,0] }
  if (p.length < 6) return { label:'Too short', bars:[1,0,0,0], color:'#EF4444' }
  const has = { upper:/[A-Z]/.test(p), num:/\d/.test(p), sym:/[^A-Za-z0-9]/.test(p) }
  const score = (p.length >= 8 ? 1 : 0) + (has.upper ? 1 : 0) + (has.num ? 1 : 0) + (has.sym ? 1 : 0)
  if (score <= 1) return { label:'Weak',   bars:[1,0,0,0], color:'#F97316' }
  if (score === 2) return { label:'Fair',   bars:[1,1,0,0], color:'#EAB308' }
  if (score === 3) return { label:'Good',   bars:[1,1,1,0], color:'#22C55E' }
  return               { label:'Strong', bars:[1,1,1,1], color:'#16A34A' }
}

const STEPS = ['Account', 'Personal', 'Style']

export default function Signup() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((s) => s.auth)

  const [step, setStep] = useState(0)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({
    username:'', email:'', password:'', confirmPassword:'',
    phone:'', location:'', travelStyle:'', bio:''
  })

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const strength = strengthLabel(form.password)

  const nextStep = (e) => { e.preventDefault(); setStep(s => s+1) }
  const prevStep = () => setStep(s => s-1)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return
    const { confirmPassword, ...payload } = form
    try {
      await dispatch(registerUser(payload)).unwrap()
      navigate('/dashboard')
    } catch(_) {}
  }

  return (
    <div className="pc-su-root">
      <style>{CSS}</style>

      {/* LEFT panel */}
      <div className="pc-su-left">
        <div className="pc-su-bg" />
        <div className="pc-su-overlay" />
        <div style={{ position:'relative', zIndex:2, padding:'36px 40px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'rgba(255,255,255,0.13)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.22)' }}>
              <PlaneIcon />
            </div>
            <span className="pc-serif" style={{ color:'#fff', fontSize:22, fontWeight:600 }}>PathCrafters</span>
          </div>
        </div>
        <div style={{ position:'relative', zIndex:2, padding:'0 40px 48px' }}>
          <div style={{ background:'rgba(255,255,255,.08)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,.18)', borderRadius:16, padding:'24px 26px', marginBottom:32 }}>
            <p style={{ color:'rgba(255,255,255,.6)', fontSize:12, letterSpacing:'.08em', textTransform:'uppercase', margin:'0 0 10px' }}>Why join us</p>
            {['AI-powered itinerary generation','Interactive maps & day planning','Budget tracker built-in','Explore cities & attractions'].map((t,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:i<3?10:0 }}>
                <div style={{ width:20, height:20, borderRadius:6, background:'rgba(245,200,66,.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span style={{ color:'rgba(255,255,255,.82)', fontSize:14 }}>{t}</span>
              </div>
            ))}
          </div>
          <h2 className="pc-serif" style={{ color:'#fff', fontSize:44, fontWeight:600, lineHeight:1.1, margin:'0 0 8px' }}>Start your<br/>journey today</h2>
          <p style={{ color:'rgba(255,255,255,.6)', fontSize:15 }}>Join thousands of travellers crafting unforgettable trips.</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="pc-su-right">
        <div className="pc-su-card">
          {/* logo */}
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:28 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#2B4FD8,#1535b0)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <PlaneIcon />
            </div>
            <span className="pc-serif" style={{ fontSize:20, fontWeight:600, color:'#111827' }}>PathCrafters</span>
          </div>

          <h1 className="pc-serif" style={{ fontSize:33, fontWeight:600, color:'#111827', margin:'0 0 4px' }}>Create your account</h1>
          <p style={{ color:'#6B7280', fontSize:14.5, margin:'0 0 24px' }}>Free forever. No credit card needed.</p>

          {/* step indicator */}
          <div style={{ display:'flex', alignItems:'center', marginBottom:28 }}>
            {STEPS.map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:7 }}>
                <div className="step-pill">
                  <div className={`dot ${i<step?'done':i===step?'active':'idle'}`}>
                    {i<step ? <CheckIcon /> : i+1}
                  </div>
                  <span style={{ fontWeight: i===step?500:400, color: i===step?'#111827':'#9CA3AF', fontSize:13 }}>{s}</span>
                </div>
                {i<STEPS.length-1 && <div className="step-line" style={{ margin:'0 6px' }} />}
              </div>
            ))}
          </div>

          {/* ── STEP 0: Account ── */}
          {step === 0 && (
            <form onSubmit={nextStep}>
              <div style={{ marginBottom:16 }}>
                <label className="pc-su-label">Username</label>
                <input className="pc-su-input" name="username" value={form.username} onChange={onChange} placeholder="your_username" required autoComplete="username" />
              </div>
              <div style={{ marginBottom:16 }}>
                <label className="pc-su-label">Email address</label>
                <input className="pc-su-input" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" required autoComplete="email" />
              </div>
              <div style={{ marginBottom:6, position:'relative' }}>
                <label className="pc-su-label">Password</label>
                <input className="pc-su-input" name="password" type={showPass?'text':'password'} value={form.password} onChange={onChange} placeholder="Min. 8 characters" required autoComplete="new-password" style={{ paddingRight:44 }} />
                <button type="button" className="pc-su-eye" onClick={() => setShowPass(v=>!v)} tabIndex={-1}>
                  {showPass ? <EyeShut /> : <EyeOpen />}
                </button>
              </div>
              {/* strength */}
              {form.password && (
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:14 }}>
                  {strength.bars.map((on,i) => (
                    <div key={i} className="pc-strength-bar" style={{ background: on ? strength.color : '#E5E7EB' }} />
                  ))}
                  <span style={{ fontSize:12, color:strength.color, whiteSpace:'nowrap', fontWeight:500 }}>{strength.label}</span>
                </div>
              )}
              <div style={{ marginBottom:24 }}>
                <label className="pc-su-label">Confirm password</label>
                <input className="pc-su-input" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} placeholder="••••••••" required autoComplete="new-password" />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p style={{ color:'#DC2626', fontSize:12, marginTop:5 }}>Passwords don't match</p>
                )}
              </div>
              <button type="submit" className="pc-su-btn"
                disabled={!form.username||!form.email||form.password.length<6||form.password!==form.confirmPassword}>
                Continue →
              </button>
            </form>
          )}

          {/* ── STEP 1: Personal ── */}
          {step === 1 && (
            <form onSubmit={nextStep}>
              <div className="pc-su-grid" style={{ marginBottom:16 }}>
                <div>
                  <label className="pc-su-label">Phone (optional)</label>
                  <input className="pc-su-input" name="phone" type="tel" value={form.phone} onChange={onChange} placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="pc-su-label">Location (optional)</label>
                  <input className="pc-su-input" name="location" value={form.location} onChange={onChange} placeholder="City, Country" />
                </div>
              </div>
              <div style={{ marginBottom:24 }}>
                <label className="pc-su-label">Bio (optional)</label>
                <textarea className="pc-su-input" name="bio" value={form.bio} onChange={onChange}
                  placeholder="Tell us about yourself and your travel dreams…"
                  rows={3} style={{ resize:'vertical', lineHeight:1.5, paddingTop:10 }} />
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button type="button" onClick={prevStep} style={{ flex:'0 0 auto', padding:'12px 20px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'#fff', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontWeight:500, color:'#374151', fontSize:15 }}>← Back</button>
                <button type="submit" className="pc-su-btn">Continue →</button>
              </div>
            </form>
          )}

          {/* ── STEP 2: Travel Style ── */}
          {step === 2 && (
            <form onSubmit={onSubmit}>
              <p style={{ color:'#374151', fontSize:14.5, marginBottom:16 }}>Pick your travel style — this helps our AI craft better itineraries for you.</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:26 }}>
                {STYLES_TRAVEL.map(({ v, label }) => {
                  const sel = form.travelStyle === v
                  return (
                    <button key={v} type="button"
                      onClick={() => setForm(f => ({ ...f, travelStyle: v }))}
                      style={{
                        padding:'12px 14px', borderRadius:10, border:`1.5px solid ${sel?'#2B4FD8':'#E5E7EB'}`,
                        background: sel ? '#EEF2FF' : '#fff', cursor:'pointer', textAlign:'left',
                        fontFamily:'DM Sans,sans-serif', fontSize:14, color: sel ? '#1D40B5' : '#374151',
                        fontWeight: sel ? 600 : 400, transition:'all .18s'
                      }}>
                      {label}
                    </button>
                  )
                })}
              </div>
              {error && <div className="pc-su-err">{error.message || 'Something went wrong. Please try again.'}</div>}
              <div style={{ display:'flex', gap:10 }}>
                <button type="button" onClick={prevStep} style={{ flex:'0 0 auto', padding:'12px 20px', borderRadius:10, border:'1.5px solid #E5E7EB', background:'#fff', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontWeight:500, color:'#374151', fontSize:15 }}>← Back</button>
                <button type="submit" className="pc-su-btn" disabled={status==='loading'}>
                  {status==='loading' ? 'Creating account…' : 'Create account 🎉'}
                </button>
              </div>
            </form>
          )}

          <div className="pc-su-divider">or</div>
          <p style={{ textAlign:'center', fontSize:14, color:'#6B7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#2B4FD8', fontWeight:600, textDecoration:'none' }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}