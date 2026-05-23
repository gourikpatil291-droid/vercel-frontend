import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye } from 'lucide-react';
import UserProfileModal from '../components/UserProfileModal';

export default function ManagerDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      // Manager should ideally see SEs, let's show all or SEs. Let's filter for SEs just to be safe, or show all.
      // The API returns all users. We will show users that are not Managers or HO.
      setUsers(res.data.filter(u => u.role === 'SE'));
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch users');
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
        <h1 className="text-3xl font-bold text-text-main">Manager Dashboard</h1>
      </div>

      <div className="card">
        <div className="px-6 py-5 border-b border-input-border bg-surfaceHover">
          <h2 className="text-xl font-semibold text-text-main">User Approvals</h2>
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center text-text-muted">No users found.</div>
        ) : (
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
                      <div className="text-sm text-text-muted">{user.email}</div>
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
                          className="text-green-400 hover:text-green-300 bg-green-400/10 px-4 py-2 rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {user.status !== 'rejected' && (
                        <button
                          onClick={() => updateStatus(user.id, 'rejected')}
                          className="text-red-400 hover:text-red-300 bg-red-400/10 px-4 py-2 rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => { setSelectedUser(user); setModalOpen(true); }}
                        className="text-blue-400 hover:text-blue-300 bg-blue-400/10 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
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

      <UserProfileModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        user={selectedUser} 
      />
    </div>
  );
}
