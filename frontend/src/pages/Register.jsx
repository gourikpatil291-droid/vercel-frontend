import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', employee_id: '',
    address: '', role: 'SE', password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isPendingSE, setIsPendingSE] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      if (formData.role === 'SE') {
        setIsPendingSE(true);
      } else {
        toast.success(res.data.message);
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
               <h1 className="text-4xl font-bold mb-4 tracking-tight leading-tight">Join our platform,<br/>Manage seamlessly</h1>
            </div>
            <div className="absolute top-8 left-8 z-20 text-white flex items-center">
               <div className="font-bold text-2xl tracking-widest">AMU</div>
            </div>
         </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="max-w-xl w-full space-y-6 my-8">
          {isPendingSE ? (
            <div className="bg-surfaceHover p-8 rounded-2xl border border-input-border text-center shadow-xl">
              <div className="w-20 h-20 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h2 className="text-3xl font-bold text-text-main mb-3">Registration Successful</h2>
              <p className="text-text-muted mb-8 leading-relaxed text-lg">Your Service Engineer account has been created successfully. However, it requires Manager or Head Office approval before you can log in. You will be notified once it is approved.</p>
              <Link to="/login" className="btn-primary inline-block w-auto px-8">Return to Login</Link>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-3xl font-bold text-text-main mb-2">Create an account</h2>
                <p className="text-text-muted">Already have an account? <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium ml-1">Log in</Link></p>
              </div>

              <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input type="text" name="name" required className="input-field" placeholder="Full Name" onChange={handleChange} />
                  </div>
                  <div>
                    <input type="email" name="email" required className="input-field" placeholder="Email Address" onChange={handleChange} />
                  </div>
                  <div>
                    <input type="text" name="mobile" required className="input-field" placeholder="Mobile Number" onChange={handleChange} />
                  </div>
                  <div>
                    <input type="text" name="employee_id" required className="input-field" placeholder="Employee ID" onChange={handleChange} />
                  </div>
                  <div className="md:col-span-2">
                    <textarea name="address" required className="input-field" rows="2" placeholder="Address" onChange={handleChange}></textarea>
                  </div>
                  <div>
                    <select name="role" required className="input-field text-text-muted" onChange={handleChange} defaultValue="SE">
                      <option value="SE" className="bg-input-bg">Service Engineer</option>
                      <option value="Manager" className="bg-input-bg">Manager</option>
                      <option value="HO" className="bg-input-bg">HO Admin</option>
                    </select>
                  </div>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" required className="input-field" placeholder="Password" onChange={handleChange} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted mt-0.5">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center mt-6">
                  <input type="checkbox" required id="terms" className="h-4 w-4 rounded border-input-border bg-input-bg text-primary-500 focus:ring-primary-500 focus:ring-offset-background" />
                  <label htmlFor="terms" className="ml-2 block text-sm text-text-muted">
                    I agree to the <span className="text-primary-500">Terms & Conditions</span>
                  </label>
                </div>

                <button type="submit" className="w-full btn-primary py-4 text-base mt-6">
                  Create account
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
