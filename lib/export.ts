import { Expense, Income } from '@/types';

export function exportExpensesToCSV(expenses: Expense[], monthStr: string) {
  if (expenses.length === 0) return;

  const headers = ['ID', 'Date', 'Category', 'Amount', 'Payment Method', 'Recurring', 'Description'];
  const rows = expenses.map((e) => [
    e.id,
    e.date,
    e.category,
    e.amount,
    e.paymentMethod,
    e.isRecurring ? 'Yes' : 'No',
    `"${e.description.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SpendWise_Expenses_${monthStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportIncomeToCSV(incomes: Income[], monthStr: string) {
  if (incomes.length === 0) return;

  const headers = ['ID', 'Date', 'Type', 'Amount', 'Description'];
  const rows = incomes.map((i) => [
    i.id,
    i.date,
    i.type,
    i.amount,
    `"${i.description.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SpendWise_Income_${monthStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
