import React from 'react';
import { Lock, Check, Zap, ShieldCheck, RefreshCw } from 'lucide-react';
import type { Tenant } from '../types/index.ts';

interface SubscriptionLockScreenProps {
  tenant: Tenant;
  onActivatePlan: (plan: 'Starter' | 'Pro') => void;
  onToggleSubscription: () => void;
  isUpdating: boolean;
}

export const SubscriptionLockScreen: React.FC<SubscriptionLockScreenProps> = ({
  tenant,
  onActivatePlan,
  onToggleSubscription,
  isUpdating,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 my-4 text-center">
      {/* Lock Icon & Badge */}
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60 shadow-xs">
        <Lock className="w-8 h-8" />
      </div>

      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Subscription Inactive · Synced Records Locked
        </h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Cloud sync is currently paused for{' '}
          <strong className="text-slate-900 font-semibold">{tenant.businessName}</strong>. 
          Accounting vouchers, GST sales, purchase registers, and ledger exports are protected and require an active subscription to access.
        </p>

        {/* Test Simulator Banner */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-900 block">Developer / Evaluation Testing:</span>
            Toggle subscription status directly to verify both locked and unlocked behaviors.
          </div>
          <button
            type="button"
            onClick={onToggleSubscription}
            disabled={isUpdating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
            <span>Simulate Activate Subscription</span>
          </button>
        </div>
      </div>

      {/* Subscription Plans Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
        
        {/* Starter Plan */}
        <div className="bg-slate-50/60 rounded-xl p-6 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Starter</span>
              <span className="text-xs text-slate-500 font-medium">For Single Tally Company</span>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900 font-tabular">₹499</span>
              <span className="text-xs text-slate-500 font-medium">/ month</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Essential cloud sync gateway for small businesses and single accountant setups.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Up to 1,000 monthly vouchers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1 Tally Company sync</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sales & Purchase GST Registers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant CSV Export</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automated daily backups</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => onActivatePlan('Starter')}
              disabled={isUpdating}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors shadow-xs text-center"
            >
              Subscribe to Starter (₹499/mo)
            </button>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
            Recommended
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Pro Enterprise</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white font-tabular">₹999</span>
              <span className="text-xs text-slate-400 font-medium">/ month</span>
            </div>
            <p className="mt-2 text-xs text-slate-300">
              Complete automated Tally Prime sync, unlimited vouchers, and multi-ledger reconciliation.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited monthly vouchers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-company & branch consolidation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sales, Purchase & Ledger registers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>GSTIN auto-validation & ITC mismatch audit</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 Priority support & SLA</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => onActivatePlan('Pro')}
              disabled={isUpdating}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs text-center font-semibold"
            >
              Subscribe to Pro (₹999/mo)
            </button>
          </div>
        </div>

      </div>

      <div className="mt-6 text-xs text-slate-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-slate-400" />
        <span>Enterprise 256-bit encryption · Compliant with Indian GST Act & IT Rules</span>
      </div>
    </div>
  );
};
