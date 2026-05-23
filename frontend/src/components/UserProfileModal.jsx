import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, FileText, Eye } from 'lucide-react';
import FormPreviewModal from './FormPreviewModal';

export default function UserProfileModal({ isOpen, onClose, user }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchUserForms(user.id);
    }
  }, [isOpen, user]);

  const fetchUserForms = async (userId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/forms/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setForms(res.data);
    } catch (error) {
      console.error('Failed to fetch user forms', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Registration Form</h2>
            <p className="text-sm text-gray-500 mt-1">Review applicant details before approval</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
              <div className="text-gray-900 font-medium text-lg">{user.name || '-'}</div>
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Role Requested</label>
              <div className="text-gray-900 font-medium">
                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {user.role || '-'}
                </span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
              <div className="text-gray-900">{user.email || '-'}</div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Mobile Number</label>
              <div className="text-gray-900">{user.mobile || '-'}</div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Employee ID</label>
              <div className="text-gray-900">{user.employee_id || '-'}</div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Current Status</label>
              <div className="text-gray-900 capitalize font-medium">{user.status || '-'}</div>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Residential Address</label>
              <div className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">
                {user.address || 'No address provided.'}
              </div>
            </div>
          </div>

          <hr className="my-8 border-gray-200" />

          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <FileText size={20} className="text-blue-500" />
              Forms Submitted by this User
            </h3>
            
            {loading ? (
              <div className="text-sm text-gray-500">Loading forms...</div>
            ) : forms.length === 0 ? (
              <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">
                This user has not submitted any forms yet.
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Form Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Document ID</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {forms.map((form, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {form._type}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {form.customer_name || form.customer || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {form.document_id || form.doc_id || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => { setSelectedForm(form); setPreviewOpen(true); }}
                            className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors inline-flex items-center gap-1.5"
                          >
                            <Eye size={14} /> View Form
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
      </div>

      <FormPreviewModal 
        isOpen={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        formType={selectedForm?._type} 
        formData={selectedForm} 
      />
    </div>
  );
}
