import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      toast.success(res.data.message);
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      login(res.data.user, res.data.token);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface p-6">
         <div className="absolute inset-0 rounded-3xl m-4 overflow-hidden border border-input-border shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-primary-600/50 to-transparent mix-blend-multiply z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1542401886-65d6c61db217?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
              alt="Desert landscape" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-12 left-12 z-20 text-white">
               <h1 className="text-4xl font-bold mb-4 tracking-tight leading-tight">Capturing Moments,<br/>Creating Memories</h1>
               <div className="flex gap-2">
                 <div className="w-8 h-1 bg-white rounded-full"></div>
                 <div className="w-2 h-1 bg-white/40 rounded-full"></div>
                 <div className="w-2 h-1 bg-white/40 rounded-full"></div>
               </div>
            </div>
            <div className="absolute top-8 left-8 z-20 text-white flex items-center">
               <div className="font-bold text-2xl tracking-widest">AMU</div>
            </div>
         </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-text-main mb-2">Welcome Back</h2>
            <p className="text-text-muted">Don't have an account? <Link to="/register" className="text-primary-500 hover:text-primary-400 font-medium ml-1">Register</Link></p>
          </div>

          {step === 1 ? (
            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              <div>
                <input
                  type="email" required className="input-field" placeholder="Email address"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} required className="input-field" placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted mt-0.5">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="h-4 w-4 rounded border-input-border bg-input-bg text-primary-500 focus:ring-primary-500 focus:ring-offset-background" />
                <label htmlFor="remember" className="ml-2 block text-sm text-text-muted">
                  Remember me
                </label>
              </div>
              <button type="submit" className="w-full btn-primary py-4 text-base mt-4">
                Login to account
              </button>
            </form>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={handleVerifyOTP}>
              <div>
                <p className="text-sm text-text-muted mb-4">We've sent a 6-digit OTP to your email. Check console for mock OTP.</p>
                <input
                  type="text" required className="input-field text-center tracking-widest text-xl" placeholder="••••••"
                  value={otp} onChange={e => setOtp(e.target.value)} maxLength={6}
                />
              </div>
              <button type="submit" className="w-full btn-primary py-4 text-base mt-4">
                Verify OTP & Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
