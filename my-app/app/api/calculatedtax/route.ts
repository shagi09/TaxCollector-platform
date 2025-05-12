import { NextResponse } from 'next/server';

export async function GET() {
  // Replace these with actual logic to fetch income and expense from a database
  const totalIncome = 5000; // Example total income
  const totalExpense = 2000; // Example total expense

  // Calculate taxable income
  const taxableIncome = totalIncome - totalExpense;

  // Apply tax rate (e.g., 20%)
  const taxRate = 0.2;
  const calculatedTax = taxableIncome > 0 ? taxableIncome * taxRate : 0;

  return NextResponse.json({ totalIncome, totalExpense, calculatedTax });
}