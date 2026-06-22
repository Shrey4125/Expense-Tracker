// src/utils/exportUtils.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

export const exportTransactionsPDF = (incomeList, expenseList, month) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(99, 102, 241);
  doc.text('Smart Expense Tracker', 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Monthly Report — ${month}`, 14, 30);

  // Summary
  const totalIncome = incomeList.reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenseList.reduce((s, i) => s + i.amount, 0);
  const balance = totalIncome - totalExpenses;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 14, 44);
  doc.text(`Total Expenses: ${formatCurrency(totalExpenses)}`, 14, 52);
  doc.text(`Net Balance: ${formatCurrency(balance)}`, 14, 60);

  // Income Table
  if (incomeList.length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(16, 185, 129);
    doc.text('Income Records', 14, 75);

    autoTable(doc, {
      startY: 80,
      head: [['Date', 'Source', 'Description', 'Amount']],
      body: incomeList.map((i) => [
        formatDate(i.date),
        i.source,
        i.description || '-',
        formatCurrency(i.amount),
      ]),
      headStyles: { fillColor: [16, 185, 129] },
      styles: { fontSize: 9 },
    });
  }

  // Expense Table
  if (expenseList.length > 0) {
    const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 14 : 80;
    doc.setFontSize(13);
    doc.setTextColor(239, 68, 68);
    doc.text('Expense Records', 14, startY);

    autoTable(doc, {
      startY: startY + 6,
      head: [['Date', 'Category', 'Description', 'Amount']],
      body: expenseList.map((e) => [
        formatDate(e.date),
        e.category,
        e.description || '-',
        formatCurrency(e.amount),
      ]),
      headStyles: { fillColor: [239, 68, 68] },
      styles: { fontSize: 9 },
    });
  }

  doc.save(`expense-report-${month}.pdf`);
};

export const buildCSVData = (incomeList, expenseList) => {
  const rows = [];

  incomeList.forEach((i) => {
    rows.push({
      Type: 'Income',
      Date: i.date,
      Source_Category: i.source,
      Description: i.description || '',
      Amount: i.amount,
    });
  });

  expenseList.forEach((e) => {
    rows.push({
      Type: 'Expense',
      Date: e.date,
      Source_Category: e.category,
      Description: e.description || '',
      Amount: e.amount,
    });
  });

  rows.sort((a, b) => b.Date.localeCompare(a.Date));
  return rows;
};
