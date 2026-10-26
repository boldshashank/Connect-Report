import type { SalesRecord, PurchaseRecord, LedgerRecord, ReportType } from '../types/index.ts';

function escapeCSV(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export function exportSalesToCSV(records: SalesRecord[], filename = 'Sales_Register.csv') {
  const headers = [
    'Date',
    'Invoice No',
    'Party Name',
    'GSTIN',
    'HSN/SAC',
    'Taxable Amount (INR)',
    'CGST (INR)',
    'SGST (INR)',
    'IGST (INR)',
    'Total Amount (INR)',
  ];

  const rows = records.map((r) => [
    escapeCSV(r.date),
    escapeCSV(r.invoiceNo),
    escapeCSV(r.partyName),
    escapeCSV(r.gstin),
    escapeCSV(r.hsnSac),
    r.taxableAmount.toFixed(2),
    r.cgst.toFixed(2),
    r.sgst.toFixed(2),
    r.igst.toFixed(2),
    r.totalAmount.toFixed(2),
  ]);

  downloadCSV([headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n'), filename);
}

export function exportPurchasesToCSV(records: PurchaseRecord[], filename = 'Purchase_Register.csv') {
  const headers = [
    'Date',
    'Voucher No',
    'Supplier Name',
    'GSTIN',
    'Taxable Amount (INR)',
    'Tax (INR)',
    'Total Amount (INR)',
  ];

  const rows = records.map((r) => [
    escapeCSV(r.date),
    escapeCSV(r.voucherNo),
    escapeCSV(r.supplierName),
    escapeCSV(r.gstin),
    r.taxableAmount.toFixed(2),
    r.tax.toFixed(2),
    r.total.toFixed(2),
  ]);

  downloadCSV([headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n'), filename);
}

export function exportLedgersToCSV(records: LedgerRecord[], filename = 'Ledger_Register.csv') {
  const headers = ['Date', 'Ledger Name', 'Voucher Type', 'Debit (INR)', 'Credit (INR)'];

  const rows = records.map((r) => [
    escapeCSV(r.date),
    escapeCSV(r.ledgerName),
    escapeCSV(r.voucherType),
    r.debit !== null && r.debit !== undefined ? r.debit.toFixed(2) : '0.00',
    r.credit !== null && r.credit !== undefined ? r.credit.toFixed(2) : '0.00',
  ]);

  downloadCSV([headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n'), filename);
}

export function exportCurrentRegisterToCSV(
  type: ReportType,
  records: SalesRecord[] | PurchaseRecord[] | LedgerRecord[],
  businessName: string
) {
  const safeBusiness = businessName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
  const dateStamp = new Date().toISOString().slice(0, 10);

  if (type === 'sales') {
    exportSalesToCSV(records as SalesRecord[], `Tally_${safeBusiness}_Sales_${dateStamp}.csv`);
  } else if (type === 'purchase') {
    exportPurchasesToCSV(records as PurchaseRecord[], `Tally_${safeBusiness}_Purchases_${dateStamp}.csv`);
  } else if (type === 'ledger') {
    exportLedgersToCSV(records as LedgerRecord[], `Tally_${safeBusiness}_Ledgers_${dateStamp}.csv`);
  }
}

function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
