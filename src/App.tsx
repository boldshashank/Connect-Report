import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { MetricsCards } from './components/MetricsCards.tsx';
import { RegisterTable } from './components/RegisterTable.tsx';
import { SubscriptionLockScreen } from './components/SubscriptionLockScreen.tsx';
import { SubscriptionModal } from './components/SubscriptionModal.tsx';
import { SyncSimulatorModal } from './components/SyncSimulatorModal.tsx';
import { NewTenantModal } from './components/NewTenantModal.tsx';
import { formatDateTime } from './utils/formatters.ts';
import { RefreshCw, RotateCcw, Cloud, ShieldCheck } from 'lucide-react';
import type { Tenant, ReportType } from './types/index.ts';
import { 
  DEFAULT_TENANTS, 
  DEFAULT_TENANT, 
  getInitialTenantId, 
  getInitialTenant, 
  saveActiveTenantId 
} from './data/defaultTenant.ts';

export default function App() {
  // Initialize immediately from localStorage / default tenant so the dashboard loads instantly
  const [currentTenantId, setCurrentTenantId] = useState<string>(() => getInitialTenantId());
  const [currentTenant, setCurrentTenant] = useState<Tenant>(() => getInitialTenant());
  const [tenants, setTenants] = useState<Tenant[]>(() => DEFAULT_TENANTS);
  const [reportType, setReportType] = useState<ReportType>('sales');
  
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isNewTenantModalOpen, setIsNewTenantModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Fetch tenants list in background
  const loadTenants = useCallback(async () => {
    try {
      const res = await fetch('/api/tenants');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.tenants) && data.tenants.length > 0) {
        setTenants(data.tenants);
      }
    } catch (err) {
      console.warn('API tenants background fetch notice:', err);
    }
  }, []);

  // 2. Fetch specific tenant details
  const loadTenantDetails = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/tenants/${id}`);
      if (!res.ok) {
        // If 404 or not found on server, fallback to local match or default tenant
        const localMatch = DEFAULT_TENANTS.find((t) => t.id === id) || DEFAULT_TENANT;
        setCurrentTenant(localMatch);
        return;
      }
      const data = await res.json();
      if (data.success && data.tenant) {
        setCurrentTenant(data.tenant);
      }
    } catch (err) {
      console.warn('API tenant detail background fetch notice:', err);
    }
  }, []);

  // On mount: persist default to localStorage and sync from server
  useEffect(() => {
    saveActiveTenantId(currentTenantId);
    loadTenants();
  }, [currentTenantId, loadTenants]);

  // When tenant ID changes: load details and update localStorage
  useEffect(() => {
    saveActiveTenantId(currentTenantId);
    loadTenantDetails(currentTenantId);
  }, [currentTenantId, loadTenantDetails]);

  // 3. Switch Tenant
  const handleSelectTenant = (id: string) => {
    setCurrentTenantId(id);
    saveActiveTenantId(id);
    // Optimistically update if already in local array
    const match = tenants.find((t) => t.id === id) || DEFAULT_TENANTS.find((t) => t.id === id);
    if (match) {
      setCurrentTenant(match);
    }
  };

  // 4. Update Subscription
  const handleUpdateSubscription = async (status: 'active' | 'inactive', plan: 'Starter' | 'Pro') => {
    if (!currentTenant) return;
    setIsUpdatingSubscription(true);

    // Optimistic UI update
    const updatedTenant: Tenant = {
      ...currentTenant,
      subscription: {
        ...currentTenant.subscription,
        status,
        plan,
        voucherLimit: plan === 'Pro' ? 100000 : 1000,
      },
    };
    setCurrentTenant(updatedTenant);

    try {
      const res = await fetch(`/api/tenants/${currentTenant.id}/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, plan }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentTenant((prev) =>
          prev ? { ...prev, subscription: data.subscription } : updatedTenant
        );
        loadTenants();
        showToast(data.message || 'Subscription status updated');
      }
    } catch (err) {
      console.error('Failed to update subscription on server:', err);
      showToast('Subscription updated in local workspace');
    } finally {
      setIsUpdatingSubscription(false);
    }
  };

  // 5. Toggle Active/Inactive status directly (simulation button)
  const handleToggleSubscriptionStatus = async () => {
    if (!currentTenant) return;
    const nextStatus = currentTenant.subscription.status === 'active' ? 'inactive' : 'active';
    await handleUpdateSubscription(nextStatus, currentTenant.subscription.plan);
  };

  // 6. Create New Tenant
  const handleCreateTenant = async (
    businessName: string,
    gstin: string,
    state: string,
    plan: 'Starter' | 'Pro'
  ) => {
    try {
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, gstin, state, plan }),
      });
      const data = await res.json();
      if (data.success && data.tenant) {
        setIsNewTenantModalOpen(false);
        await loadTenants();
        setCurrentTenantId(data.tenant.id);
        setCurrentTenant(data.tenant);
        saveActiveTenantId(data.tenant.id);
        showToast(`Tenant "${businessName}" created successfully!`);
      }
    } catch (err) {
      console.error('Failed to create tenant:', err);
      // Fallback client creation
      const localId = 'tenant-' + Math.random().toString(36).substring(2, 8);
      const newLocalTenant: Tenant = {
        id: localId,
        businessName,
        gstin: gstin || '27AAACA0000A1Z5',
        state: state || 'Maharashtra',
        apiKey: `tic_live_${localId.replace('tenant-', '')}_${Math.random().toString(36).substring(2, 6)}`,
        subscription: {
          status: 'active',
          plan,
          billingCycle: 'monthly',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          voucherLimit: plan === 'Pro' ? 100000 : 1000,
        },
        lastSyncAt: null,
        sales: [],
        purchases: [],
        ledgers: [],
      };
      setTenants((prev) => [...prev, newLocalTenant]);
      setCurrentTenantId(localId);
      setCurrentTenant(newLocalTenant);
      saveActiveTenantId(localId);
      setIsNewTenantModalOpen(false);
      showToast(`Tenant "${businessName}" created in workspace!`);
    }
  };

  // 7. Reset Records to Sample State
  const handleResetRecords = async () => {
    if (!currentTenant) return;
    if (!window.confirm('Reset this company records to default demonstration data?')) return;
    try {
      const res = await fetch(`/api/tenants/${currentTenant.id}/reset`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await loadTenantDetails(currentTenant.id);
        showToast('Company records restored to default demonstration set');
        return;
      }
    } catch (err) {
      console.error('Reset error:', err);
    }
    // Fallback reset
    const defaultMatch = DEFAULT_TENANTS.find((t) => t.id === currentTenant.id) || DEFAULT_TENANT;
    setCurrentTenant(JSON.parse(JSON.stringify(defaultMatch)));
    showToast('Company records restored to default demonstration set');
  };

  const isSubscriptionActive = currentTenant.subscription.status === 'active';

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-950 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentTenant={currentTenant}
        tenants={tenants}
        onSelectTenant={handleSelectTenant}
        onOpenNewTenantModal={() => setIsNewTenantModalOpen(true)}
        onOpenPricingModal={() => setIsPricingModalOpen(true)}
        onOpenSyncSimulator={() => setIsSyncModalOpen(true)}
        onToggleSubscriptionStatus={handleToggleSubscriptionStatus}
        isUpdatingSubscription={isUpdatingSubscription}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Business Subheader Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {currentTenant.businessName}
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-medium">
                {currentTenant.gstin}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>State: {currentTenant.state}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Cloud className="w-3 h-3 text-slate-400" />
                <span>Last Cloud Sync: {formatDateTime(currentTenant.lastSyncAt)}</span>
              </span>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadTenantDetails(currentTenant.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
              title="Refresh records from cloud server"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleResetRecords}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
              title="Reset demonstration records"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Demo Data</span>
            </button>
          </div>
        </div>

        {/* Summary Metrics Cards */}
        <MetricsCards
          sales={currentTenant.sales}
          purchases={currentTenant.purchases}
          ledgers={currentTenant.ledgers}
        />

        {/* Access Control & Register Table:
            If subscription is inactive/expired, show lock screen (Requirement 3).
            If subscription is active, show the 3 registers table (Requirement 1 & 3). */}
        {!isSubscriptionActive ? (
          <SubscriptionLockScreen
            tenant={currentTenant}
            onActivatePlan={(plan) => handleUpdateSubscription('active', plan)}
            onToggleSubscription={handleToggleSubscriptionStatus}
            isUpdating={isUpdatingSubscription}
          />
        ) : (
          <RegisterTable
            reportType={reportType}
            onChangeReportType={setReportType}
            sales={currentTenant.sales}
            purchases={currentTenant.purchases}
            ledgers={currentTenant.ledgers}
            businessName={currentTenant.businessName}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">Tally Insight Cloud</span>
            <span className="mx-2">·</span>
            <span>Cloud Accounting & GST Ledger Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSyncModalOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              API Reference (/api/sync)
            </button>
            <button
              type="button"
              onClick={() => setIsPricingModalOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Plans (Starter ₹499 / Pro ₹999)
            </button>
          </div>
        </div>
      </footer>

      {/* Subscription Pricing Modal */}
      <SubscriptionModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        tenant={currentTenant}
        onUpdateSubscription={handleUpdateSubscription}
        isUpdating={isUpdatingSubscription}
      />

      {/* Cloud Sync Simulator Modal */}
      <SyncSimulatorModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        tenant={currentTenant}
        onSyncSuccess={() => {
          loadTenantDetails(currentTenant.id);
          showToast('Records synced successfully from Tally Gateway!');
        }}
      />

      {/* Add New Tenant Modal */}
      <NewTenantModal
        isOpen={isNewTenantModalOpen}
        onClose={() => setIsNewTenantModalOpen(false)}
        onCreateTenant={handleCreateTenant}
        isCreating={false}
      />

    </div>
  );
}
