import { loadTransactions, saveTransactions } from "./storage.js";
import { updateUI } from "./ui.js";

export let transactions = loadTransactions();

export function addIncome(description, amount) {
  transactions.push({
    description,
    amount,
    category: "Income",
    type: "Income",
  });
  saveTransactions(transactions);
  updateUI();
}

export function addExpense(description, amount, category) {
  transactions.push({ description, amount, category, type: "Expense" });
  saveTransactions(transactions);
  updateUI();
}

export function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveTransactions(transactions);
  updateUI();
}

export function clearAllTransactions() {
  transactions = [];
  saveTransactions(transactions);
  updateUI();
}

export function sortTransactions(sortAscending) {
  transactions.sort((a, b) =>
    sortAscending ? a.amount - b.amount : b.amount - a.amount
  );
  updateUI();
}
