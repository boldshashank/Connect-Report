import React, { useState } from 'react';
import { X, Building2, Check } from 'lucide-react';

interface NewTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTenant: (businessName: string, gstin: string, state: string, plan: 'Starter' | 'Pro') => void;
  isCreating: boolean;
}

export const NewTenantModal: React.FC<NewTenantModalProps> = ({
  isOpen,
  onClose,
  onCreateTenant,
  isCreating,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [plan, setPlan] = useState<'Starter' | 'Pro'>('Pro');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    onCreateTenant(
      businessName.trim(),
      gstin.trim() || '27AAACA0000A1Z5',
      state,
      plan
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 z-10 overflow-hidden my-8 text-left">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Building2 className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Add New Business Tenant</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Create an isolated Tally sync workspace with its own dedicated API key.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Business / Company Name *
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Mahavir Textiles & Yarn Pvt Ltd"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company GSTIN (15-digit)
            </label>
            <input
              type="text"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              placeholder="e.g. 27AABCM9102K1Z9"
              maxLength={15}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
              >
                <option value="Maharashtra">Maharashtra (27)</option>
                <option value="Karnataka">Karnataka (29)</option>
                <option value="Gujarat">Gujarat (24)</option>
                <option value="Delhi">Delhi (07)</option>
                <option value="Tamil Nadu">Tamil Nadu (33)</option>
                <option value="Telangana">Telangana (36)</option>
                <option value="West Bengal">West Bengal (19)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subscription Plan
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as 'Starter' | 'Pro')}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
              >
                <option value="Pro">Pro (₹999/mo)</option>
                <option value="Starter">Starter (₹499/mo)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !businessName.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isCreating ? 'Creating Tenant...' : 'Create Business'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
