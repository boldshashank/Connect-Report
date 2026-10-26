export interface SalesRecord {
  id: string;
  date: string;
  invoiceNo: string;
  partyName: string;
  gstin: string;
  hsnSac: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
}

export interface PurchaseRecord {
  id: string;
  date: string;
  voucherNo: string;
  supplierName: string;
  gstin: string;
  taxableAmount: number;
  tax: number;
  total: number;
}

export interface LedgerRecord {
  id: string;
  date: string;
  ledgerName: string;
  voucherType: string;
  debit: number | null;
  credit: number | null;
}

export interface TenantSubscription {
  status: 'active' | 'inactive';
  plan: 'Starter' | 'Pro';
  billingCycle: 'monthly' | 'annual';
  expiresAt: string;
  voucherLimit: number;
}

export interface Tenant {
  id: string;
  businessName: string;
  gstin: string;
  state: string;
  apiKey: string;
  subscription: TenantSubscription;
  lastSyncAt: string | null;
  sales: SalesRecord[];
  purchases: PurchaseRecord[];
  ledgers: LedgerRecord[];
}

export type ReportType = 'sales' | 'purchase' | 'ledger';

export interface SyncPayload {
  apiKey: string;
  reportType: ReportType;
  records: Array<Record<string, unknown>>;
}

export interface SyncResponse {
  success: boolean;
  message?: string;
  count?: number;
  error?: string;
  reportType?: ReportType;
  timestamp?: string;
}
