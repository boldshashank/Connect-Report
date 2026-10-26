import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Tenant, ReportType, SalesRecord, PurchaseRecord, LedgerRecord } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial mock data store
const initialTenants: Tenant[] = [
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

const tenants: Tenant[] = [...initialTenants];

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Enable CORS & Body parsing
  app.use(express.json({ limit: '15mb' }));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // --- API Routes ---

  // 1. Get all tenants list (metadata for tenant switcher)
  app.get('/api/tenants', (req: Request, res: Response) => {
    const list = tenants.map((t) => ({
      id: t.id,
      businessName: t.businessName,
      gstin: t.gstin,
      state: t.state,
      apiKey: t.apiKey,
      subscription: t.subscription,
      lastSyncAt: t.lastSyncAt,
      salesCount: t.sales.length,
      purchaseCount: t.purchases.length,
      ledgerCount: t.ledgers.length,
    }));
    res.json({ success: true, tenants: list });
  });

  // 2. Get specific tenant with records
  app.get('/api/tenants/:id', (req: Request, res: Response) => {
    const tenant = tenants.find((t) => t.id === req.params.id);
    if (!tenant) {
      res.status(404).json({ success: false, error: 'Tenant not found' });
      return;
    }
    res.json({ success: true, tenant });
  });

  // 3. Update subscription status / plan (Simulate active/cancelled)
  app.post('/api/tenants/:id/subscription', (req: Request, res: Response) => {
    const tenant = tenants.find((t) => t.id === req.params.id);
    if (!tenant) {
      res.status(404).json({ success: false, error: 'Tenant not found' });
      return;
    }

    const { status, plan, billingCycle } = req.body;
    if (status && ['active', 'inactive'].includes(status)) {
      tenant.subscription.status = status;
    }
    if (plan && ['Starter', 'Pro'].includes(plan)) {
      tenant.subscription.plan = plan;
      tenant.subscription.voucherLimit = plan === 'Pro' ? 100000 : 1000;
    }
    if (billingCycle && ['monthly', 'annual'].includes(billingCycle)) {
      tenant.subscription.billingCycle = billingCycle;
    }
    if (tenant.subscription.status === 'active') {
      // renew expiry to 30 days from now
      const d = new Date();
      d.setDate(d.getDate() + 30);
      tenant.subscription.expiresAt = d.toISOString();
    }

    res.json({
      success: true,
      message: `Subscription updated to ${tenant.subscription.status.toUpperCase()} (${tenant.subscription.plan} plan)`,
      subscription: tenant.subscription,
    });
  });

  // 4. Regenerate API key
  app.post('/api/tenants/:id/regenerate-key', (req: Request, res: Response) => {
    const tenant = tenants.find((t) => t.id === req.params.id);
    if (!tenant) {
      res.status(404).json({ success: false, error: 'Tenant not found' });
      return;
    }
    const rand = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    tenant.apiKey = `tic_live_${tenant.id.replace('tenant-', '')}_${rand}`;
    res.json({ success: true, apiKey: tenant.apiKey });
  });

  // 5. Create new business tenant
  app.post('/api/tenants', (req: Request, res: Response) => {
    const { businessName, gstin, state, plan } = req.body;
    if (!businessName) {
      res.status(400).json({ success: false, error: 'Business name is required' });
      return;
    }
    const cleanId = 'tenant-' + businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 20);
    const rand = Math.random().toString(36).substring(2, 10);
    const newTenant: Tenant = {
      id: cleanId,
      businessName,
      gstin: gstin || '27AAACX1234F1Z0',
      state: state || 'Maharashtra',
      apiKey: `tic_live_${cleanId.replace('tenant-', '')}_${rand}`,
      subscription: {
        status: 'active',
        plan: plan === 'Pro' ? 'Pro' : 'Starter',
        billingCycle: 'monthly',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        voucherLimit: plan === 'Pro' ? 100000 : 1000,
      },
      lastSyncAt: null,
      sales: [],
      purchases: [],
      ledgers: [],
    };
    tenants.push(newTenant);
    res.status(201).json({ success: true, tenant: newTenant });
  });

  // 6. Reset records to initial state
  app.post('/api/tenants/:id/reset', (req: Request, res: Response) => {
    const tenantIndex = tenants.findIndex((t) => t.id === req.params.id);
    if (tenantIndex === -1) {
      res.status(404).json({ success: false, error: 'Tenant not found' });
      return;
    }
    const initialMatch = initialTenants.find((t) => t.id === req.params.id);
    if (initialMatch) {
      tenants[tenantIndex] = JSON.parse(JSON.stringify(initialMatch));
    } else {
      tenants[tenantIndex].sales = [];
      tenants[tenantIndex].purchases = [];
      tenants[tenantIndex].ledgers = [];
    }
    res.json({ success: true, message: 'Records reset successfully' });
  });

  // 7. Core Cloud Sync API Endpoint: /api/sync
  // Requirements:
  // - accepts POST requests with JSON payload: { apiKey, reportType, records }
  // - If apiKey is valid and subscription is active, save/update the records in state/database and return { success: true }
  app.post('/api/sync', (req: Request, res: Response) => {
    const { apiKey, reportType, records } = req.body;

    if (!apiKey) {
      res.status(401).json({
        success: false,
        error: 'API key is missing. Please provide a valid "apiKey" in your payload.',
      });
      return;
    }

    // Find tenant by apiKey
    const tenant = tenants.find((t) => t.apiKey === apiKey.trim());
    if (!tenant) {
      res.status(401).json({
        success: false,
        error: 'Invalid API key. No tenant business found associated with this key.',
      });
      return;
    }

    // Check subscription active status
    if (tenant.subscription.status !== 'active') {
      res.status(403).json({
        success: false,
        error: 'Subscription is INACTIVE. Real-time Tally cloud sync is paused. Please renew or activate your subscription plan in Tally Insight Cloud.',
        subscriptionStatus: tenant.subscription.status,
      });
      return;
    }

    // Validate reportType
    const validReportTypes: ReportType[] = ['sales', 'purchase', 'ledger'];
    const normalizedType = (reportType || '').toLowerCase().trim() as ReportType;
    if (!validReportTypes.includes(normalizedType)) {
      res.status(400).json({
        success: false,
        error: `Invalid reportType: "${reportType}". Allowed values are: 'sales', 'purchase', 'ledger'.`,
      });
      return;
    }

    if (!Array.isArray(records) || records.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Payload "records" must be a non-empty array of voucher objects.',
      });
      return;
    }

    // Process and normalize records based on reportType
    const timestamp = new Date().toISOString();
    let processedCount = 0;

    if (normalizedType === 'sales') {
      const formatted: SalesRecord[] = records.map((r, idx) => {
        const taxable = Number(r.taxableAmount ?? r.taxable ?? r.amount ?? 0);
        const cgst = Number(r.cgst ?? 0);
        const sgst = Number(r.sgst ?? 0);
        const igst = Number(r.igst ?? 0);
        const total = Number(r.totalAmount ?? r.total ?? (taxable + cgst + sgst + igst));

        return {
          id: (r.id as string) || `sync-sal-${Date.now()}-${idx}`,
          date: (r.date as string) || new Date().toISOString().slice(0, 10),
          invoiceNo: String(r.invoiceNo ?? r.voucherNo ?? `INV/${Date.now().toString().slice(-4)}`),
          partyName: String(r.partyName ?? r.customerName ?? r.ledgerName ?? 'Sundry Customer'),
          gstin: String(r.gstin ?? '27AAACA0000A1Z5'),
          hsnSac: String(r.hsnSac ?? r.hsn ?? '998313'),
          taxableAmount: taxable,
          cgst,
          sgst,
          igst,
          totalAmount: total,
        };
      });

      // Upsert: replace if invoiceNo matches, else prepend
      for (const item of formatted) {
        const existingIdx = tenant.sales.findIndex((s) => s.invoiceNo === item.invoiceNo);
        if (existingIdx !== -1) {
          tenant.sales[existingIdx] = item;
        } else {
          tenant.sales.unshift(item);
        }
        processedCount++;
      }
    } else if (normalizedType === 'purchase') {
      const formatted: PurchaseRecord[] = records.map((r, idx) => {
        const taxable = Number(r.taxableAmount ?? r.taxable ?? r.amount ?? 0);
        const tax = Number(r.tax ?? ((Number(r.cgst ?? 0) + Number(r.sgst ?? 0) + Number(r.igst ?? 0))));
        const total = Number(r.total ?? r.totalAmount ?? (taxable + tax));

        return {
          id: (r.id as string) || `sync-pur-${Date.now()}-${idx}`,
          date: (r.date as string) || new Date().toISOString().slice(0, 10),
          voucherNo: String(r.voucherNo ?? r.invoiceNo ?? `PUR-${Date.now().toString().slice(-4)}`),
          supplierName: String(r.supplierName ?? r.partyName ?? r.vendorName ?? 'Sundry Creditor'),
          gstin: String(r.gstin ?? '27AAACS0000S1Z1'),
          taxableAmount: taxable,
          tax,
          total,
        };
      });

      for (const item of formatted) {
        const existingIdx = tenant.purchases.findIndex((p) => p.voucherNo === item.voucherNo);
        if (existingIdx !== -1) {
          tenant.purchases[existingIdx] = item;
        } else {
          tenant.purchases.unshift(item);
        }
        processedCount++;
      }
    } else if (normalizedType === 'ledger') {
      const formatted: LedgerRecord[] = records.map((r, idx) => ({
        id: (r.id as string) || `sync-led-${Date.now()}-${idx}`,
        date: (r.date as string) || new Date().toISOString().slice(0, 10),
        ledgerName: String(r.ledgerName ?? r.partyName ?? 'General Account'),
        voucherType: String(r.voucherType ?? r.type ?? 'Journal'),
        debit: r.debit !== undefined && r.debit !== null ? Number(r.debit) : null,
        credit: r.credit !== undefined && r.credit !== null ? Number(r.credit) : null,
      }));

      for (const item of formatted) {
        tenant.ledgers.unshift(item);
        processedCount++;
      }
    }

    tenant.lastSyncAt = timestamp;

    res.json({
      success: true,
      message: `Successfully synced ${processedCount} ${normalizedType} records for ${tenant.businessName}`,
      tenantId: tenant.id,
      reportType: normalizedType,
      count: processedCount,
      timestamp,
    });
  });

  // Vite Integration (Dev Mode) or Static Files (Production Mode)
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tally Insight Cloud server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
