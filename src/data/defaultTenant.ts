import type { Tenant } from '../types/index.ts';

export const DEFAULT_TENANT_ID = 'tenant-bharat';
export const LOCAL_STORAGE_TENANT_ID_KEY = 'tic_active_tenant_id';
export const LOCAL_STORAGE_TENANTS_CACHE_KEY = 'tic_tenants_cache';

export const DEFAULT_TENANTS: Tenant[] = [
  {
    id: 'tenant-bharat',
    businessName: 'Bharat ElectroMech Solutions Pvt Ltd',
    gstin: '27AABCB8901L1Z4',
    state: 'Maharashtra',
    apiKey: 'tic_live_bharat_7e92a10d94f2',
    subscription: {
      status: 'active',
      plan: 'Pro',
      billingCycle: 'monthly',
      expiresAt: '2026-12-31T23:59:59.000Z',
      voucherLimit: 100000,
    },
    lastSyncAt: '2026-10-26T09:42:15.000Z',
    sales: [
      {
        id: 'sal-101',
        date: '2026-10-25',
        invoiceNo: 'INV/2026/1089',
        partyName: 'Tata Power Renewable Energy Ltd',
        gstin: '27AAACT2727Q1ZB',
        hsnSac: '850440',
        taxableAmount: 485000,
        cgst: 43650,
        sgst: 43650,
        igst: 0,
        totalAmount: 572300,
      },
      {
        id: 'sal-102',
        date: '2026-10-24',
        invoiceNo: 'INV/2026/1088',
        partyName: 'Larsen & Toubro Heavy Infotech',
        gstin: '29AABCL2210G1ZS',
        hsnSac: '998313',
        taxableAmount: 320000,
        cgst: 0,
        sgst: 0,
        igst: 57600,
        totalAmount: 377600,
      },
      {
        id: 'sal-103',
        date: '2026-10-22',
        invoiceNo: 'INV/2026/1087',
        partyName: 'Godrej Process Equipment Div',
        gstin: '27AABCG1299P1ZK',
        hsnSac: '847130',
        taxableAmount: 185000,
        cgst: 16650,
        sgst: 16650,
        igst: 0,
        totalAmount: 218300,
      },
      {
        id: 'sal-104',
        date: '2026-10-20',
        invoiceNo: 'INV/2026/1086',
        partyName: 'Havells India Commercial Division',
        gstin: '07AAACH1889C1ZT',
        hsnSac: '853650',
        taxableAmount: 640000,
        cgst: 0,
        sgst: 0,
        igst: 115200,
        totalAmount: 755200,
      },
      {
        id: 'sal-105',
        date: '2026-10-18',
        invoiceNo: 'INV/2026/1085',
        partyName: 'Thermax Global Clean Systems',
        gstin: '27AAACT1441E1ZD',
        hsnSac: '841989',
        taxableAmount: 295000,
        cgst: 26550,
        sgst: 26550,
        igst: 0,
        totalAmount: 348100,
      },
      {
        id: 'sal-106',
        date: '2026-10-15',
        invoiceNo: 'INV/2026/1084',
        partyName: 'Siemens Industrial Automation Ltd',
        gstin: '27AAACS4301B1ZW',
        hsnSac: '853710',
        taxableAmount: 890000,
        cgst: 80100,
        sgst: 80100,
        igst: 0,
        totalAmount: 1050200,
      },
      {
        id: 'sal-107',
        date: '2026-10-12',
        invoiceNo: 'INV/2026/1083',
        partyName: 'ABB Power Grids India Ltd',
        gstin: '29AAACA2101M1Z1',
        hsnSac: '850422',
        taxableAmount: 510000,
        cgst: 0,
        sgst: 0,
        igst: 91800,
        totalAmount: 601800,
      },
      {
        id: 'sal-108',
        date: '2026-10-08',
        invoiceNo: 'INV/2026/1082',
        partyName: 'Schneider Electric Systems India',
        gstin: '27AAACS1429B1Z0',
        hsnSac: '853890',
        taxableAmount: 215000,
        cgst: 19350,
        sgst: 19350,
        igst: 0,
        totalAmount: 253700,
      },
    ],
    purchases: [
      {
        id: 'pur-201',
        date: '2026-10-23',
        voucherNo: 'VCH-PUR-0544',
        supplierName: 'Polycab India Cables & Wires Ltd',
        gstin: '24AAACP4912K1ZF',
        taxableAmount: 340000,
        tax: 61200,
        total: 401200,
      },
      {
        id: 'pur-202',
        date: '2026-10-21',
        voucherNo: 'VCH-PUR-0543',
        supplierName: 'Finolex Micro Cables Corporation',
        gstin: '27AAACF0811A1ZX',
        taxableAmount: 180000,
        tax: 32400,
        total: 212400,
      },
      {
        id: 'pur-203',
        date: '2026-10-17',
        voucherNo: 'VCH-PUR-0542',
        supplierName: 'Kirloskar Chillers & Compressors',
        gstin: '27AAACK1010Q1ZR',
        taxableAmount: 520000,
        tax: 93600,
        total: 613600,
      },
      {
        id: 'pur-204',
        date: '2026-10-14',
        voucherNo: 'VCH-PUR-0541',
        supplierName: 'Anchor Electricals Panasonic Group',
        gstin: '27AAACA9921D1ZB',
        taxableAmount: 145000,
        tax: 26100,
        total: 171100,
      },
      {
        id: 'pur-205',
        date: '2026-10-09',
        voucherNo: 'VCH-PUR-0540',
        supplierName: 'Crompton Greaves Consumer Electricals',
        gstin: '27AABCC3920F1ZW',
        taxableAmount: 280000,
        tax: 50400,
        total: 330400,
      },
    ],
    ledgers: [
      {
        id: 'led-301',
        date: '2026-10-25',
        ledgerName: 'HDFC Bank OD Current A/c - 502000189',
        voucherType: 'Receipt',
        debit: 572300,
        credit: null,
      },
      {
        id: 'led-302',
        date: '2026-10-25',
        ledgerName: 'Tata Power Renewable Energy Ltd',
        voucherType: 'Receipt',
        debit: null,
        credit: 572300,
      },
      {
        id: 'led-303',
        date: '2026-10-23',
        ledgerName: 'Polycab India Cables & Wires Ltd',
        voucherType: 'Payment',
        debit: 401200,
        credit: null,
      },
      {
        id: 'led-304',
        date: '2026-10-23',
        ledgerName: 'State Bank of India CC A/c - 308912',
        voucherType: 'Payment',
        debit: null,
        credit: 401200,
      },
      {
        id: 'led-305',
        date: '2026-10-20',
        ledgerName: 'GST Output IGST Payable A/c',
        voucherType: 'Journal',
        debit: null,
        credit: 115200,
      },
      {
        id: 'led-306',
        date: '2026-10-18',
        ledgerName: 'Factory Power & Fuel Expenses',
        voucherType: 'Payment',
        debit: 68500,
        credit: null,
      },
      {
        id: 'led-307',
        date: '2026-10-18',
        ledgerName: 'HDFC Bank OD Current A/c - 502000189',
        voucherType: 'Payment',
        debit: null,
        credit: 68500,
      },
    ],
  },
  {
    id: 'tenant-zenith',
    businessName: 'Zenith Retail & Logistics LLP',
    gstin: '29AAACZ9841N1Z3',
    state: 'Karnataka',
    apiKey: 'tic_live_zenith_3f81b49c71a8',
    subscription: {
      status: 'inactive',
      plan: 'Starter',
      billingCycle: 'monthly',
      expiresAt: '2026-09-30T00:00:00.000Z',
      voucherLimit: 1000,
    },
    lastSyncAt: '2026-09-28T14:10:00.000Z',
    sales: [
      {
        id: 'sal-z01',
        date: '2026-09-27',
        invoiceNo: 'ZRL/26/041',
        partyName: 'Infosys Campus Facilities Bangalore',
        gstin: '29AAACI4811H1Z2',
        hsnSac: '998511',
        taxableAmount: 140000,
        cgst: 12600,
        sgst: 12600,
        igst: 0,
        totalAmount: 165200,
      },
      {
        id: 'sal-z02',
        date: '2026-09-25',
        invoiceNo: 'ZRL/26/040',
        partyName: 'Wipro Technologies Sarjapur Office',
        gstin: '29AAACW0111L1Z9',
        hsnSac: '998511',
        taxableAmount: 85000,
        cgst: 7650,
        sgst: 7650,
        igst: 0,
        totalAmount: 100300,
      },
    ],
    purchases: [
      {
        id: 'pur-z01',
        date: '2026-09-26',
        voucherNo: 'VCH-ZRL-P12',
        supplierName: 'Blue Dart Express Courier Services',
        gstin: '27AAACB0988R1ZA',
        taxableAmount: 42000,
        tax: 7560,
        total: 49560,
      },
    ],
    ledgers: [
      {
        id: 'led-z01',
        date: '2026-09-27',
        ledgerName: 'ICICI Bank Current A/c - 000205',
        voucherType: 'Receipt',
        debit: 165200,
        credit: null,
      },
    ],
  },
];

export const DEFAULT_TENANT = DEFAULT_TENANTS[0];

export function getInitialTenantId(): string {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_TENANT_ID_KEY);
    if (saved && saved.trim()) {
      return saved;
    }
    // Initialize default on first visit
    localStorage.setItem(LOCAL_STORAGE_TENANT_ID_KEY, DEFAULT_TENANT_ID);
    return DEFAULT_TENANT_ID;
  } catch {
    return DEFAULT_TENANT_ID;
  }
}

export function saveActiveTenantId(id: string): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_TENANT_ID_KEY, id);
  } catch {
    // ignore
  }
}

export function getInitialTenant(): Tenant {
  const currentId = getInitialTenantId();
  const match = DEFAULT_TENANTS.find((t) => t.id === currentId);
  return match || DEFAULT_TENANT;
}
