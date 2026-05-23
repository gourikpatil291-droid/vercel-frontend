import { X } from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose, user }) {
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
        </div>
        
      </div>
    </div>
  );
}
