import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    employee_id: '',
    address: '',
    role: 'SE',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', formData);
      toast.success(res.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface p-6">
         <div className="absolute inset-0 rounded-3xl m-4 overflow-hidden border border-input-border shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-primary-600/50 to-transparent mix-blend-multiply z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1542401886-65d6c61db217?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
              alt="Desert landscape" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-12 left-12 z-20 text-white">
               <h1 className="text-4xl font-bold mb-4 tracking-tight leading-tight">Create an Account,<br/>Join the Team</h1>
            </div>
            <div className="absolute top-8 left-8 z-20 text-white flex items-center">
               <div className="font-bold text-2xl tracking-widest">AMU</div>
            </div>
         </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-text-main mb-2">Create Account</h2>
            <p className="text-text-muted">Already have an account? <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium ml-1">Login</Link></p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="text" required className="input-field" placeholder="Full Name"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <input
                type="email" required className="input-field" placeholder="Email Address"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <input
                type="tel" required className="input-field" placeholder="Mobile Number"
                value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}
              />
            </div>
            <div>
              <input
                type="text" required className="input-field" placeholder="Employee ID"
                value={formData.employee_id} onChange={e => setFormData({...formData, employee_id: e.target.value})}
              />
            </div>
            <div>
              <textarea
                className="input-field" placeholder="Address" rows="2"
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div>
              <select
                className="input-field"
                value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="SE">Service Engineer (SE)</option>
                <option value="Manager">Manager</option>
                <option value="HO">Head Office (HO)</option>
              </select>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} required className="input-field" placeholder="Password"
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-base mt-4 disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
