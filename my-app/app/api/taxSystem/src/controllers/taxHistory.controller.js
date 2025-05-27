// controllers/auditController.js
const PayrollAuditRecords = require('../models/payrollAuditRecord.model');
const VATAuditRecords = require('../models/vatAuditRecord.model');
const ProfitTaxAuditRecords = require('../models/profitTaxAuditRecord.model');

exports.getAuditHistoryByType = async (req, res) => {
  try {
    const { type } = req.params;
    const userId = req.user.id;

    let records;

    switch (type.toUpperCase()) {
      case 'PAYROLL':
        records = await PayrollAuditRecords.find({ userId }).sort({ date: -1 });
        break;
      case 'VAT':
        records = await VATAuditRecords.find({ userId }).sort({ date: -1 });
        break;
      case 'PROFIT':
        records = await ProfitTaxAuditRecords.find({ userId }).sort({ date: -1 });
        break;
      default:
        return res.status(400).json({ message: 'Invalid audit type specified' });
    }

    res.status(200).json({ type, records });
  } catch (error) {
    console.error('Error fetching audit history:', error);
    res.status(500).json({ message: 'Failed to fetch audit history' });
  }
};
