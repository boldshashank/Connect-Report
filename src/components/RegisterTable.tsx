import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Calendar, 
  ArrowUpDown, 
  Receipt, 
  ShoppingCart, 
  BookOpen, 
  X,
  FileSpreadsheet
} from 'lucide-react';
import { formatINR, formatDate } from '../utils/formatters.ts';
import { exportCurrentRegisterToCSV } from '../utils/csvExport.ts';
import type { SalesRecord, PurchaseRecord, LedgerRecord, ReportType } from '../types/index.ts';

interface RegisterTableProps {
  reportType: ReportType;
  onChangeReportType: (type: ReportType) => void;
  sales: SalesRecord[];
  purchases: PurchaseRecord[];
  ledgers: LedgerRecord[];
  businessName: string;
}

type SortField = 'date' | 'number' | 'party' | 'amount';
type SortDirection = 'asc' | 'desc';

export const RegisterTable: React.FC<RegisterTableProps> = ({
  reportType,
  onChangeReportType,
  sales,
  purchases,
  ledgers,
  businessName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'oct26' | 'sep26' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  // Filter by date helper
  const filterByDate = (dateStr: string) => {
    if (!dateStr) return true;
    if (dateFilter === 'all') return true;
    if (dateFilter === 'oct26') return dateStr.startsWith('2026-10');
    if (dateFilter === 'sep26') return dateStr.startsWith('2026-09');
    if (dateFilter === 'custom') {
      if (startDate && dateStr < startDate) return false;
      if (endDate && dateStr > endDate) return false;
      return true;
    }
    return true;
  };

  // Filtered & Sorted Sales
  const filteredSales = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    let res = sales.filter((s) => {
      if (!filterByDate(s.date)) return false;
      if (!term) return true;
      return (
        s.partyName.toLowerCase().includes(term) ||
        s.invoiceNo.toLowerCase().includes(term) ||
        s.gstin.toLowerCase().includes(term) ||
        s.hsnSac.toLowerCase().includes(term) ||
        s.totalAmount.toString().includes(term)
      );
    });

    res = [...res].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortField === 'number') cmp = a.invoiceNo.localeCompare(b.invoiceNo);
      else if (sortField === 'party') cmp = a.partyName.localeCompare(b.partyName);
      else if (sortField === 'amount') cmp = a.totalAmount - b.totalAmount;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return res;
  }, [sales, searchTerm, dateFilter, startDate, endDate, sortField, sortDir]);

  // Filtered & Sorted Purchases
  const filteredPurchases = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    let res = purchases.filter((p) => {
      if (!filterByDate(p.date)) return false;
      if (!term) return true;
      return (
        p.supplierName.toLowerCase().includes(term) ||
        p.voucherNo.toLowerCase().includes(term) ||
        p.gstin.toLowerCase().includes(term) ||
        p.total.toString().includes(term)
      );
    });

    res = [...res].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortField === 'number') cmp = a.voucherNo.localeCompare(b.voucherNo);
      else if (sortField === 'party') cmp = a.supplierName.localeCompare(b.supplierName);
      else if (sortField === 'amount') cmp = a.total - b.total;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return res;
  }, [purchases, searchTerm, dateFilter, startDate, endDate, sortField, sortDir]);

  // Filtered & Sorted Ledgers
  const filteredLedgers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    let res = ledgers.filter((l) => {
      if (!filterByDate(l.date)) return false;
      if (!term) return true;
      return (
        l.ledgerName.toLowerCase().includes(term) ||
        l.voucherType.toLowerCase().includes(term) ||
        (l.debit !== null && l.debit.toString().includes(term)) ||
        (l.credit !== null && l.credit.toString().includes(term))
      );
    });

    res = [...res].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortField === 'party') cmp = a.ledgerName.localeCompare(b.ledgerName);
      else if (sortField === 'number') cmp = a.voucherType.localeCompare(b.voucherType);
      else if (sortField === 'amount') {
        const valA = (a.debit ?? 0) + (a.credit ?? 0);
        const valB = (b.debit ?? 0) + (b.credit ?? 0);
        cmp = valA - valB;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return res;
  }, [ledgers, searchTerm, dateFilter, startDate, endDate, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const handleExportCSV = () => {
    if (reportType === 'sales') {
      exportCurrentRegisterToCSV('sales', filteredSales, businessName);
    } else if (reportType === 'purchase') {
      exportCurrentRegisterToCSV('purchase', filteredPurchases, businessName);
    } else if (reportType === 'ledger') {
      exportCurrentRegisterToCSV('ledger', filteredLedgers, businessName);
    }
  };

  const currentCount =
    reportType === 'sales'
      ? filteredSales.length
      : reportType === 'purchase'
      ? filteredPurchases.length
      : filteredLedgers.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      
      {/* 1. Register Navigation Tabs */}
      <div className="border-b border-slate-200 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2 py-2">
          <button
            type="button"
            onClick={() => onChangeReportType('sales')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              reportType === 'sales'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>Sales Register</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded font-mono bg-slate-100 text-slate-600">
              {sales.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChangeReportType('purchase')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              reportType === 'purchase'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-blue-600" />
            <span>Purchase Register</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded font-mono bg-slate-100 text-slate-600">
              {purchases.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChangeReportType('ledger')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              reportType === 'ledger'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Ledger Register</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded font-mono bg-slate-100 text-slate-600">
              {ledgers.length}
            </span>
          </button>
        </div>

        {/* Export to CSV Button */}
        <div className="py-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors shrink-0"
            title="Download visible records as CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export to CSV ({currentCount})</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Search Controls Toolbar */}
      <div className="p-4 border-b border-slate-200/80 bg-white flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Instant Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              reportType === 'sales'
                ? 'Filter by Party, Invoice No, GSTIN, HSN...'
                : reportType === 'purchase'
                ? 'Filter by Supplier, Voucher No, GSTIN...'
                : 'Filter by Ledger Name, Voucher Type...'
            }
            className="w-full pl-9 pr-8 py-1.5 text-xs text-slate-900 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date Range Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/70 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5" />
            <button
              type="button"
              onClick={() => setDateFilter('all')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                dateFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Time
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('oct26')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                dateFilter === 'oct26' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Oct 2026
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('sep26')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                dateFilter === 'sep26' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sep 2026
            </button>
            <button
              type="button"
              onClick={() => setDateFilter('custom')}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                dateFilter === 'custom' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Custom
            </button>
          </div>

          {dateFilter === 'custom' && (
            <div className="flex items-center gap-1.5 text-xs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 text-xs"
              />
              <span className="text-slate-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-800 text-xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. Table Views */}
      <div className="overflow-x-auto">
        
        {/* === A. SALES REGISTER TABLE === */}
        {reportType === 'sales' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                <th className="py-2.5 px-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => toggleSort('date')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => toggleSort('number')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    <span>Invoice No</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-2.5 px-3">
                  <button
                    type="button"
                    onClick={() => toggleSort('party')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    <span>Party Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap">GSTIN</th>
                <th className="py-2.5 px-3 whitespace-nowrap">HSN/SAC</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Taxable Amt</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">CGST</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">SGST</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">IGST</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => toggleSort('amount')}
                    className="flex items-center gap-1 ml-auto hover:text-slate-900"
                  >
                    <span>Total Amount</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">No sales records match criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing filters or trigger a live sync</p>
                  </td>
                </tr>
              ) : (
                filteredSales.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3 whitespace-nowrap font-tabular text-slate-600">
                      {formatDate(row.date)}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap font-mono font-medium text-slate-900">
                      {row.invoiceNo}
                    </td>
                    <td className="py-2 px-3 text-slate-900 font-medium">
                      {row.partyName}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {row.gstin}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap font-mono text-slate-500">
                      {row.hsnSac}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap font-tabular text-slate-700">
                      {formatINR(row.taxableAmount)}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap font-tabular text-slate-600">
                      {row.cgst > 0 ? formatINR(row.cgst) : '—'}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap font-tabular text-slate-600">
                      {row.sgst > 0 ? formatINR(row.sgst) : '—'}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap font-tabular text-slate-600">
                      {row.igst > 0 ? formatINR(row.igst) : '—'}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap font-tabular font-bold text-slate-900">
                      {formatINR(row.totalAmount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredSales.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-semibold text-slate-900 border-t border-slate-200">
                  <td colSpan={5} className="py-2.5 px-3">
                    Total ({filteredSales.length} Invoices)
                  </td>
                  <td className="py-2.5 px-3 text-right font-tabular">
                    {formatINR(filteredSales.reduce((acc, r) => acc + r.taxableAmount, 0))}
                  </td>
                  <td className="py-2.5 px-3 text-right font-tabular">
                    {formatINR(filteredSales.reduce((acc, r) => acc + r.cgst, 0))}
                  </td>
                  <td className="py-2.5 px-3 text-right font-tabular">
                    {formatINR(filteredSales.reduce((acc, r) => acc + r.sgst, 0))}
                  </td>
                  <td className="py-2.5 px-3 text-right font-tabular">
                    {formatINR(filteredSales.reduce((acc, r) => acc + r.igst, 0))}
                  </td>
                  <td className="py-2.5 px-3 text-right font-tabular font-bold text-slate-900">
                    {formatINR(filteredSales.reduce((acc, r) => acc + r.totalAmount, 0))}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        )}

        {/* === B. PURCHASE REGISTER TABLE === */}
        {reportType === 'purchase' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                <th className="py-2.5 px-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => toggleSort('date')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => toggleSort('number')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    <span>Voucher No</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-2.5 px-3">
                  <button
                    type="button"
                    onClick={() => toggleSort('party')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    <span>Supplier Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap">GSTIN</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Taxable Amount</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Tax</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => toggleSort('amount')}
                    className="flex items-center gap-1 ml-auto hover:text-slate-900"
                  >
                    <span>Total Amount</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">No purchase records match criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing filters or trigger a live sync</p>
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3 whitespace-nowrap font-tabular text-slate-600">
                      {formatDate(row.date)}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap font-mono font-medium text-slate-900">
                      {row.voucherNo}
                    </td>
                    <td className="py-2 px-3 text-slate-900 font-medium">
                      {row.supplierName}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {row.gstin}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap font-tabular text-slate-700">
                      {formatINR(row.taxableAmount)}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap font-tabular text-slate-600">
                      {formatINR(row.tax)}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap font-tabular font-bold text-slate-900">
                      {formatINR(row.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredPurchases.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-semibold text-slate-900 border-t border-slate-200">
                  <td colSpan={4} className="py-2.5 px-3">
                    Total ({filteredPurchases.length} Purchase Bills)
                  </td>
                  <td className="py-2.5 px-3 text-right font-tabular">
                    {formatINR(filteredPurchases.reduce((acc, r) => acc + r.taxableAmount, 0))}
                  </td>
                  <td className="py-2.5 px-3 text-right font-tabular">
                    {formatINR(filteredPurchases.reduce((acc, r) => acc + r.tax, 0))}
                  </td>
                  <td className="py-2.5 px-3 text-right font-tabular font-bold text-slate-900">
                    {formatINR(filteredPurchases.reduce((acc, r) => acc + r.total, 0))}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        )}

        {/* === C. LEDGER REGISTER TABLE === */}
        {reportType === 'ledger' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                <th className="py-2.5 px-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => toggleSort('date')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-2.5 px-3">
                  <button
                    type="button"
                    onClick={() => toggleSort('party')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    <span>Ledger Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => toggleSort('number')}
                    className="flex items-center gap-1 hover:text-slate-900"
                  >
                    <span>Voucher Type</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Debit (Dr)</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Credit (Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLedgers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">No ledger entries match criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing filters or trigger a live sync</p>
                  </td>
                </tr>
              ) : (
                filteredLedgers.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3 whitespace-nowrap font-tabular text-slate-600">
                      {formatDate(row.date)}
                    </td>
                    <td className="py-2 px-3 text-slate-900 font-medium">
                      {row.ledgerName}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap font-mono">
                      <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                        {row.voucherType}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap font-tabular font-medium text-slate-900">
                      {row.debit !== null && row.debit !== undefined ? formatINR(row.debit) : '—'}
                    </td>
                    <td className="py-2 px-3 text-right whitespace-nowrap font-tabular font-medium text-slate-900">
                      {row.credit !== null && row.credit !== undefined ? formatINR(row.credit) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredLedgers.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-semibold text-slate-900 border-t border-slate-200">
                  <td colSpan={3} className="py-2.5 px-3">
                    Total ({filteredLedgers.length} Ledger Transactions)
                  </td>
                  <td className="py-2.5 px-3 text-right font-tabular">
                    {formatINR(filteredLedgers.reduce((acc, r) => acc + (r.debit ?? 0), 0))}
                  </td>
                  <td className="py-2.5 px-3 text-right font-tabular">
                    {formatINR(filteredLedgers.reduce((acc, r) => acc + (r.credit ?? 0), 0))}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        )}

      </div>
    </div>
  );
};
