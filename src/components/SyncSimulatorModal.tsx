import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Send, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Code2
} from 'lucide-react';
import type { Tenant, ReportType } from '../types/index.ts';

interface SyncSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  onSyncSuccess: () => void;
}

export const SyncSimulatorModal: React.FC<SyncSimulatorModalProps> = ({
  isOpen,
  onClose,
  tenant,
  onSyncSuccess,
}) => {
  const [selectedReport, setSelectedReport] = useState<ReportType>('sales');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeTab, setActiveTab] = useState<'tester' | 'curl' | 'tdl'>('tester');
  
  // Custom payload editor
  const [customPayload, setCustomPayload] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [responseLog, setResponseLog] = useState<{
    status: number;
    data: unknown;
    timestamp: string;
    durationMs: number;
  } | null>(null);

  // Pre-configured realistic sample payloads
  const samplePayloads: Record<ReportType, Array<Record<string, unknown>>> = {
    sales: [
      {
        invoiceNo: `INV/2026/${Math.floor(1100 + Math.random() * 899)}`,
        date: new Date().toISOString().slice(0, 10),
        partyName: 'Reliance Retail Supply Chain Ltd',
        gstin: '27AAACR1234F1Z9',
        hsnSac: '850440',
        taxableAmount: 375000,
        cgst: 33750,
        sgst: 33750,
        igst: 0,
        totalAmount: 442500,
      },
    ],
    purchase: [
      {
        voucherNo: `PUR/26/${Math.floor(600 + Math.random() * 399)}`,
        date: new Date().toISOString().slice(0, 10),
        supplierName: 'Legrand India Electricals Pvt Ltd',
        gstin: '27AAACL9901M1Z2',
        taxableAmount: 210000,
        tax: 37800,
        total: 247800,
      },
    ],
    ledger: [
      {
        date: new Date().toISOString().slice(0, 10),
        ledgerName: 'Bank of Baroda Overdraft A/c',
        voucherType: 'Receipt',
        debit: 442500,
        credit: null,
      },
    ],
  };

  const getFullPayload = () => {
    return {
      apiKey: tenant.apiKey,
      reportType: selectedReport,
      records: samplePayloads[selectedReport],
    };
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(tenant.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const getCurlSnippet = () => {
    const payload = JSON.stringify(getFullPayload(), null, 2);
    const origin = window.location.origin;
    return `curl -X POST "${origin}/api/sync" \\
  -H "Content-Type: application/json" \\
  -d '${payload}'`;
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(getCurlSnippet());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleSendSync = async () => {
    setIsSending(true);
    setResponseLog(null);
    const start = performance.now();

    try {
      let bodyData;
      if (customPayload.trim()) {
        bodyData = JSON.parse(customPayload);
      } else {
        bodyData = getFullPayload();
      }

      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      const durationMs = Math.round(performance.now() - start);

      setResponseLog({
        status: res.status,
        data,
        timestamp: new Date().toLocaleTimeString(),
        durationMs,
      });

      if (res.ok && data.success) {
        onSyncSuccess();
      }
    } catch (err: unknown) {
      const durationMs = Math.round(performance.now() - start);
      setResponseLog({
        status: 500,
        data: { error: (err as Error).message || 'Network request failed' },
        timestamp: new Date().toLocaleTimeString(),
        durationMs,
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

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

        {/* Modal Header */}
        <div className="text-left pr-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Tally Cloud Gateway
            </span>
            <span className="text-xs text-slate-400">Endpoint: /api/sync</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Cloud Sync API & Test Console
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Accepts real-time POST payloads from Tally ERP 9 / TallyPrime TDL scripts, Python bridge, or webhooks.
          </p>
        </div>

        {/* Tenant API Key Banner */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-500 block">Your Tenant Business API Key:</span>
            <span className="font-mono font-semibold text-slate-900 text-sm select-all">
              {tenant.apiKey}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyKey}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 font-medium transition-colors shrink-0 shadow-xs"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-5 border-b border-slate-200 flex items-center gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('tester')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'tester'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('curl')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'curl'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>cURL Command</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tdl')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'tdl'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Tally TDL / Integration</span>
          </button>
        </div>

        {/* Tab 1: Interactive Tester */}
        {activeTab === 'tester' && (
          <div className="mt-4 space-y-4 text-left">
            {/* Select Report Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Register:
              </label>
              <div className="flex items-center gap-2">
                {(['sales', 'purchase', 'ledger'] as ReportType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setSelectedReport(type);
                      setCustomPayload('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                      selectedReport === type
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Payload Preview */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  JSON Request Payload (POST /api/sync):
                </label>
                <span className="text-[11px] text-slate-400">
                  Includes active API key & test voucher
                </span>
              </div>
              <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto max-h-48 border border-slate-800">
                {JSON.stringify(getFullPayload(), null, 2)}
              </pre>
            </div>

            {/* Send Trigger */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-500">
                Status check: {tenant.subscription.status === 'active' ? (
                  <span className="text-emerald-700 font-semibold">Ready to Sync (Subscription Active)</span>
                ) : (
                  <span className="text-rose-700 font-semibold">Subscription Inactive (Will return 403)</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleSendSync}
                disabled={isSending}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending POST...' : 'Send Live Request to /api/sync'}</span>
              </button>
            </div>

            {/* Live Response Panel */}
            {responseLog && (
              <div className={`mt-3 p-3.5 rounded-xl border text-xs font-mono ${
                responseLog.status >= 200 && responseLog.status < 300
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/70 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    {responseLog.status >= 200 && responseLog.status < 300 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>HTTP Status: {responseLog.status}</span>
                  </div>
                  <span className="text-[11px] opacity-75">
                    {responseLog.durationMs}ms · {responseLog.timestamp}
                  </span>
                </div>
                <pre className="p-2 bg-white/90 rounded border border-slate-200/80 overflow-x-auto text-[11px]">
                  {JSON.stringify(responseLog.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: cURL Command */}
        {activeTab === 'curl' && (
          <div className="mt-4 space-y-3 text-left">
            <p className="text-xs text-slate-600">
              Run this exact cURL command in your terminal or backend workflow to push vouchers to this tenant:
            </p>
            <div className="relative">
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
                {getCurlSnippet()}
              </pre>
              <button
                type="button"
                onClick={handleCopyCurl}
                className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs transition-colors flex items-center gap-1"
                title="Copy cURL snippet"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copiedCurl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: TDL / Python Integration */}
        {activeTab === 'tdl' && (
          <div className="mt-4 space-y-3 text-left">
            <p className="text-xs text-slate-600">
              Integrate with TallyPrime via Python bridge or TDL XML HTTP POST:
            </p>
            <pre className="p-3 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-56 border border-slate-800">
{`import requests

ENDPOINT = "${window.location.origin}/api/sync"
API_KEY = "${tenant.apiKey}"

payload = {
    "apiKey": API_KEY,
    "reportType": "sales",
    "records": [
        {
            "invoiceNo": "INV/2026/0991",
            "date": "2026-10-26",
            "partyName": "Godrej Industries Ltd",
            "gstin": "27AAACG1299P1ZK",
            "hsnSac": "847130",
            "taxableAmount": 250000,
            "cgst": 22500,
            "sgst": 22500,
            "igst": 0,
            "totalAmount": 295000
        }
    ]
}

response = requests.post(ENDPOINT, json=payload)
print(response.status_code, response.json())`}
            </pre>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Real-time persistence active in memory / JSON store</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
