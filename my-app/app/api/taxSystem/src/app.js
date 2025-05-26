const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors=require('cors')
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors({
  origin: 'http://localhost:3000', // allow your frontend origin
  credentials: true // if you use cookies or authentication
}));
 
// Routes
app.use('/api/incomes', require('./routes/income.routes'));
app.use('/api/expenses', require('./routes/expense.routes'));
app.use('/api/payroll', require('./routes/payroll.routes'));
app.use('/api/taxPayer', require('./routes/taxPayer.routes'))
app.use('/api/auditor', require('./routes/auditor.routes'))
app.use('/api/official', require('./routes/official.routes'))
app.use('/api/profitTax', require('./routes/profitTax.routes'))
app.use('/api/receipt', require('./routes/reciept.routes'))
app.use('/api/payments', require('./routes/payment.routes'))
app.use('/api/vat', require('./routes/vat.routes'))



// Root test
app.get('/', (req, res) => {
  res.send('Tax Collection API is live!');
});

module.exports = app;
