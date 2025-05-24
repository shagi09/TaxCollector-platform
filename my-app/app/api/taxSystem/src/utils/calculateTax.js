const calculatePayrollTax = (salary) => {
  const s = parseFloat(salary);

  if (s <= 600) return 0;
  if (s <= 1650) return s * 0.10 - 60;
  if (s <= 3200) return s * 0.15 - 142.5;
  if (s <= 5250) return s * 0.20 - 302.5;
  if (s <= 7800) return s * 0.25 - 565;
  if (s <= 10900) return s * 0.30 - 955;
  return s * 0.35 - 1500;
};

const calculateProfitTax = (profit) => 0.3 * profit

module.exports = { 
    calculatePayrollTax,
    calculateProfitTax
}