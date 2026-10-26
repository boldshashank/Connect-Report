import React, { useState } from 'react';
import { 
  Building2, 
  KeyRound, 
  Check, 
  Copy, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronDown, 
  Sparkles, 
  RefreshCw,
  Plus
} from 'lucide-react';
import type { Tenant } from '../types/index.ts';

interface HeaderProps {
  currentTenant: Tenant;
  tenants: Tenant[];
  onSelectTenant: (tenantId: string) => void;
  onOpenNewTenantModal: () => void;
  onOpenPricingModal: () => void;
  onOpenSyncSimulator: () => void;
  onToggleSubscriptionStatus: () => void;
  isUpdatingSubscription: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTenant,
  tenants,
  onSelectTenant,
  onOpenNewTenantModal,
  onOpenPricingModal,
  onOpenSyncSimulator,
  onToggleSubscriptionStatus,
  isUpdatingSubscription,
}) => {
  const [copied, setCopied] = useState(false);
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);

  const handleCopyApiKey = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(currentTenant.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const isActive = currentTenant.subscription.status === 'active';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm font-semibold tracking-wider text-sm">
              TIC
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight block">
                Tally Insight Cloud
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">
                Tally ERP & Prime Live Sync
              </span>
            </div>
          </div>

          {/* Zone 2: Multi-tenant Selector & Status */}
          <div className="flex items-center gap-3">
            {/* Tenant Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200/60 max-w-[220px] sm:max-w-xs"
                title="Switch Business Tenant"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate text-left">{currentTenant.businessName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
              </button>

              {tenantDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setTenantDropdownOpen(false)} 
                  />
                  <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Business Tenant
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {tenants.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            onSelectTenant(t.id);
                            setTenantDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-start justify-between gap-2 ${
                            t.id === currentTenant.id
                              ? 'bg-slate-50 text-slate-900 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50/70 hover:text-slate-900'
                          }`}
                        >
                          <div className="truncate">
                            <p className="truncate font-medium">{t.businessName}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{t.gstin}</p>
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                              t.subscription.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {t.subscription.status === 'active' ? t.subscription.plan : 'Inactive'}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="p-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setTenantDropdownOpen(false);
                          onOpenNewTenantModal();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Business</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Subscription Status Badge with fast simulated toggle */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onOpenPricingModal}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all border ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/70'
                    : 'bg-rose-50 text-rose-800 border-rose-200/80 hover:bg-rose-100/70'
                }`}
                title="Click to view subscription details"
              >
                {isActive ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                )}
                <span>{isActive ? `Active · ${currentTenant.subscription.plan}` : 'Subscription Inactive'}</span>
              </button>

              {/* Fast simulate toggle button */}
              <button
                type="button"
                onClick={onToggleSubscriptionStatus}
                disabled={isUpdatingSubscription}
                className="hidden md:inline-flex items-center gap-1 px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors border border-slate-200"
                title="Simulate toggle subscription Active / Inactive"
              >
                <RefreshCw className={`w-3 h-3 ${isUpdatingSubscription ? 'animate-spin' : ''}`} />
                <span>Simulate {isActive ? 'Cancel' : 'Activate'}</span>
              </button>
            </div>
          </div>

          {/* Zone 3: Sync API Key & Developer Simulator Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Sync API Key Button with Copy Tooltip */}
            <div className="flex items-center bg-slate-100 border border-slate-200/80 rounded-lg p-0.5">
              <button
                type="button"
                onClick={onOpenSyncSimulator}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-700 hover:text-slate-900 transition-colors font-medium"
                title="View Sync API Endpoint & Curl Guide"
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden lg:inline text-slate-500">API Key:</span>
                <span className="font-mono text-slate-900 font-semibold tracking-tight">
                  {currentTenant.apiKey.slice(0, 8)}...{currentTenant.apiKey.slice(-4)}
                </span>
              </button>
              <button
                type="button"
                onClick={handleCopyApiKey}
                className={`p-1.5 rounded-md transition-colors ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/70'
                }`}
                title="Copy API Key to clipboard"
                aria-label="Copy Sync API Key"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Simulate Tally Sync Action */}
            <button
              type="button"
              onClick={onOpenSyncSimulator}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Simulate Sync</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
