import React from 'react';
import { TrendingUp, Receipt, Percent, FileSpreadsheet } from 'lucide-react';
import { formatINR, formatNumber } from '../utils/formatters.ts';
import type { SalesRecord, PurchaseRecord, LedgerRecord } from '../types/index.ts';

interface MetricsCardsProps {
  sales: SalesRecord[];
  purchases: PurchaseRecord[];
  ledgers: LedgerRecord[];
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  sales,
  purchases,
  ledgers,
}) => {
  // Aggregate calculations
  const totalSalesAmount = sales.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalSalesTaxable = sales.reduce((sum, item) => sum + item.taxableAmount, 0);
  const totalOutputTax = sales.reduce((sum, item) => sum + item.cgst + item.sgst + item.igst, 0);

  const totalPurchaseAmount = purchases.reduce((sum, item) => sum + item.total, 0);
  const totalInputTaxCredit = purchases.reduce((sum, item) => sum + item.tax, 0);

  const netGstPayable = totalOutputTax - totalInputTaxCredit;
  const totalVouchersCount = sales.length + purchases.length + ledgers.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Sales */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Sales Volume
            </span>
            <div className="mt-1.5 text-2xl font-bold text-slate-900 font-tabular tracking-tight">
              {formatINR(totalSalesAmount)}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Taxable: {formatINR(totalSalesTaxable)}</span>
          <span className="font-medium text-slate-700">{sales.length} Invoices</span>
        </div>
      </div>

      {/* 2. Total Tax */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Output Tax (GST)
            </span>
            <div className="mt-1.5 text-2xl font-bold text-slate-900 font-tabular tracking-tight">
              {formatINR(totalOutputTax)}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>ITC Credit: {formatINR(totalInputTaxCredit)}</span>
          <span className={`font-semibold ${netGstPayable >= 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
            Net: {formatINR(Math.abs(netGstPayable))} {netGstPayable >= 0 ? 'Pay' : 'Cr'}
          </span>
        </div>
      </div>

      {/* 3. Total Purchases */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Purchases
            </span>
            <div className="mt-1.5 text-2xl font-bold text-slate-900 font-tabular tracking-tight">
              {formatINR(totalPurchaseAmount)}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Tax Incurred: {formatINR(totalInputTaxCredit)}</span>
          <span className="font-medium text-slate-700">{purchases.length} Bills</span>
        </div>
      </div>

      {/* 4. Total Invoices / Vouchers */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Synced Vouchers
            </span>
            <div className="mt-1.5 text-2xl font-bold text-slate-900 font-tabular tracking-tight">
              {formatNumber(totalVouchersCount)}
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Ledger Entries: {ledgers.length}</span>
          <span className="text-emerald-600 font-medium">Tally Live</span>
        </div>
      </div>
    </div>
  );
};
