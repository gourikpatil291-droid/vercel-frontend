import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye } from 'lucide-react';
import FormPreviewModal from '../components/FormPreviewModal';

export default function HODashboard() {
  const [users, setUsers] = useState([]);
  const [submittedForms, setSubmittedForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchForms();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      setUsers(res.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const fetchForms = async () => {
    try {
      setLoading(true);
      const [instRes, servRes, feedRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/forms/installations`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/forms/service-reports`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/forms/customer-feedbacks`)
      ]);
      
      const combined = [
        ...instRes.data.map(f => ({ ...f, _type: 'Acceptance Certificate' })),
        ...servRes.data.map(f => ({ ...f, _type: 'Service Report' })),
        ...feedRes.data.map(f => ({ ...f, _type: 'Customer Feedback' }))
      ].sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));
      
      setSubmittedForms(combined);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch forms');
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${id}/status`, { status });
      toast.success(`User ${status} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="text-text-main">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-main">Head Office Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 border border-input-border">
          <h3 className="text-text-muted text-sm font-medium uppercase tracking-wider">Total Users</h3>
          <p className="text-4xl font-bold text-text-main mt-3">{users.length}</p>
        </div>
        <div className="card p-6 border border-input-border">
          <h3 className="text-text-muted text-sm font-medium uppercase tracking-wider">Active Engineers</h3>
          <p className="text-4xl font-bold text-primary-500 mt-3">
            {users.filter(u => u.role === 'SE' && u.status === 'approved').length}
          </p>
        </div>
        <div className="card p-6 border border-input-border">
          <h3 className="text-text-muted text-sm font-medium uppercase tracking-wider">Pending Approvals</h3>
          <p className="text-4xl font-bold text-orange-400 mt-3">
            {users.filter(u => u.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="px-6 py-5 border-b border-input-border bg-surfaceHover">
          <h2 className="text-xl font-semibold text-text-main">All System Users</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-input-border">
            <thead className="bg-background">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-input-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surfaceHover transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-text-main">{user.name}</div>
                    <div className="text-sm text-text-muted mt-1">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-500/20 text-primary-400">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'approved' ? 'bg-green-400/10 text-green-400' :
                      user.status === 'pending' ? 'bg-orange-400/10 text-orange-400' :
                      'bg-red-400/10 text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {user.status !== 'approved' && (
                      <button 
                        onClick={() => updateStatus(user.id, 'approved')}
                        className="text-green-400 hover:text-green-300 px-3 py-2 bg-green-400/10 rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {user.status !== 'rejected' && (
                      <button 
                        onClick={() => updateStatus(user.id, 'rejected')}
                        className="text-red-400 hover:text-red-300 px-3 py-2 bg-red-400/10 rounded-lg transition-colors"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mt-10">
        <div className="px-6 py-5 border-b border-input-border bg-surfaceHover">
          <h2 className="text-xl font-semibold text-text-main">Recent Submitted Forms</h2>
        </div>
        {submittedForms.length === 0 ? (
          <div className="p-8 text-center text-text-muted">No forms submitted yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-input-border">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Form Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Document ID</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-input-border">
                {submittedForms.map((form, i) => (
                  <tr key={i} className="hover:bg-surfaceHover transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-text-main">
                      {form._type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                      {form.customer_name || form.customer || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                      {form.document_id || form.doc_id || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => { setSelectedForm(form); setModalOpen(true); }}
                        className="text-primary-400 hover:text-primary-300 bg-primary-400/10 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
                      >
                        <Eye size={16} /> Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FormPreviewModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        formType={selectedForm?._type} 
        formData={selectedForm} 
      />
    </div>
  );
}
