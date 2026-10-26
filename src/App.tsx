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

export default function App() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenantId, setCurrentTenantId] = useState<string>('tenant-bharat');
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [reportType, setReportType] = useState<ReportType>('sales');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isNewTenantModalOpen, setIsNewTenantModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Fetch tenants list
  const loadTenants = useCallback(async () => {
    try {
      const res = await fetch('/api/tenants');
      const data = await res.json();
      if (data.success && data.tenants) {
        setTenants(data.tenants);
      }
    } catch (err) {
      console.error('Failed to load tenants:', err);
    }
  }, []);

  // 2. Fetch specific tenant details
  const loadTenantDetails = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/tenants/${id}`);
      const data = await res.json();
      if (data.success && data.tenant) {
        setCurrentTenant(data.tenant);
      }
    } catch (err) {
      console.error('Failed to load tenant details:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  useEffect(() => {
    if (currentTenantId) {
      loadTenantDetails(currentTenantId);
    }
  }, [currentTenantId, loadTenantDetails]);

  // 3. Switch Tenant
  const handleSelectTenant = (id: string) => {
    setCurrentTenantId(id);
  };

  // 4. Update Subscription
  const handleUpdateSubscription = async (status: 'active' | 'inactive', plan: 'Starter' | 'Pro') => {
    if (!currentTenant) return;
    setIsUpdatingSubscription(true);
    try {
      const res = await fetch(`/api/tenants/${currentTenant.id}/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, plan }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentTenant((prev) =>
          prev ? { ...prev, subscription: data.subscription } : null
        );
        loadTenants();
        showToast(data.message || 'Subscription status updated');
      }
    } catch (err) {
      console.error('Failed to update subscription:', err);
      showToast('Error updating subscription');
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
        showToast(`Tenant "${businessName}" created successfully!`);
      }
    } catch (err) {
      console.error('Failed to create tenant:', err);
      showToast('Failed to create tenant business');
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
      }
    } catch (err) {
      console.error('Failed to reset records:', err);
    }
  };

  // If loading first time
  if (isLoading && !currentTenant) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold tracking-wider mb-4 animate-pulse">
          TIC
        </div>
        <p className="text-sm font-semibold text-slate-800">Connecting to Tally Insight Cloud...</p>
        <p className="text-xs text-slate-500 mt-1">Verifying tenant API gateway and encryption tokens</p>
      </div>
    );
  }

  if (!currentTenant) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm font-semibold text-slate-800">No tenant workspace found.</p>
        <button
          type="button"
          onClick={() => loadTenantDetails('tenant-bharat')}
          className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          Load Default Company
        </button>
      </div>
    );
  }

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
