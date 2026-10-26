import React, { useState } from 'react';
import { X, Check, Zap, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { formatDate } from '../utils/formatters.ts';
import type { Tenant } from '../types/index.ts';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  onUpdateSubscription: (status: 'active' | 'inactive', plan: 'Starter' | 'Pro') => void;
  isUpdating: boolean;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  tenant,
  onUpdateSubscription,
  isUpdating,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  if (!isOpen) return null;

  const currentPlan = tenant.subscription.plan;
  const isActive = tenant.subscription.status === 'active';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full p-6 sm:p-8 z-10 overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-left pr-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 mb-2">
            <span>{tenant.businessName}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Tally Insight Cloud Subscription & Pricing
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Choose the cloud tier that fits your voucher volume and accounting team size.
          </p>
        </div>

        {/* Current Status Banner */}
        <div className="mt-4 p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Current Status:</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded text-xs ${
                isActive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isActive ? `ACTIVE (${currentPlan})` : 'INACTIVE / EXPIRED'}
            </span>
            {isActive && (
              <span className="text-slate-400 hidden sm:inline">
                · Renews {formatDate(tenant.subscription.expiresAt)}
              </span>
            )}
          </div>

          {/* Quick Simulation Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateSubscription(isActive ? 'inactive' : 'active', currentPlan)}
              disabled={isUpdating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors border ${
                isActive
                  ? 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
                  : 'bg-slate-900 text-white border-transparent hover:bg-slate-800'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>Simulate {isActive ? 'Cancel / Expire' : 'Activate'}</span>
            </button>
          </div>
        </div>

        {/* Billing cycle tabs */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-md transition-colors ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-md transition-colors ${
                billingCycle === 'annual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          {/* Starter Plan */}
          <div className={`rounded-xl p-5 border transition-all flex flex-col justify-between ${
            currentPlan === 'Starter' && isActive
              ? 'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Starter</span>
                {currentPlan === 'Starter' && isActive && (
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Current Plan
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900 font-tabular">
                  {billingCycle === 'monthly' ? '₹499' : '₹399'}
                </span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Ideal for single business proprietors and small trading firms.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Up to 1,000 monthly vouchers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1 Tally Company connection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sales & Purchase GST Registers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>CSV Downloads & Search</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onUpdateSubscription('active', 'Starter')}
                disabled={isUpdating || (currentPlan === 'Starter' && isActive)}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors text-center ${
                  currentPlan === 'Starter' && isActive
                    ? 'bg-slate-100 text-slate-400 cursor-default'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                }`}
              >
                {currentPlan === 'Starter' && isActive ? 'Active Plan' : 'Select Starter'}
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className={`rounded-xl p-5 border transition-all flex flex-col justify-between ${
            currentPlan === 'Pro' && isActive
              ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/20'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}>
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900">Pro Enterprise</span>
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                </div>
                {currentPlan === 'Pro' && isActive ? (
                  <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    Current Plan
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Popular
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900 font-tabular">
                  {billingCycle === 'monthly' ? '₹999' : '₹799'}
                </span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                For manufacturing, distributors, and chartered accountants.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Unlimited monthly vouchers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Multi-company & branch consolidation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Sales, Purchase & Ledger registers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>GSTIN auto-validation & ITC Audit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>24/7 Dedicated Support</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onUpdateSubscription('active', 'Pro')}
                disabled={isUpdating || (currentPlan === 'Pro' && isActive)}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors text-center ${
                  currentPlan === 'Pro' && isActive
                    ? 'bg-slate-100 text-slate-400 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                }`}
              >
                {currentPlan === 'Pro' && isActive ? 'Active Plan' : 'Select Pro'}
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Instant activation · No contract cancellation fees</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
