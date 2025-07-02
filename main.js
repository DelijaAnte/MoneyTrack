// main.js
import {
  addIncome,
  addExpense,
  deleteTransaction,
  clearAllTransactions,
  sortTransactions,
} from "./transactions.js";
import { addSavings, withdrawSavings, clearSavings } from "./savings.js";
import {
  updateUI,
  updateSavingsUI,
  showNotification,
  showAnimation,
  updateChart,
  updateProgress,
} from "./ui.js";
import { setupDarkMode } from "./darkmode.js";

window.addEventListener("DOMContentLoaded", () => {
  setupDarkMode();
  updateUI();
  updateSavingsUI();
  updateChart();
  updateProgress();

  document.getElementById("add-income-btn").addEventListener("click", () => {
    const desc = document.getElementById("income-description").value.trim();
    const amount = parseFloat(document.getElementById("income-amount").value);
    if (!desc || isNaN(amount) || amount <= 0) {
      showNotification("Enter a valid income.");
      return;
    }
    addIncome(desc, amount);
    showNotification("Income added!");
    showAnimation("income-animation");
    document.getElementById("income-description").value = "";
    document.getElementById("income-amount").value = "";
    document.getElementById("income-description").focus();
  });
  document.getElementById("add-expense-btn").addEventListener("click", () => {
    const desc = document.getElementById("expense-description").value.trim();
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const category = document.getElementById("expense-category").value;
    if (!desc || isNaN(amount) || amount <= 0) {
      showNotification("Enter a valid expense.");
      return;
    }
    addExpense(desc, amount, category);
    showNotification("Expense added!");
    showAnimation("expense-animation");
    document.getElementById("expense-description").value = "";
    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-description").focus();
  });
  document.getElementById("add-savings-btn").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("savings-amount").value);
    if (isNaN(amount) || amount <= 0) {
      showNotification("Enter a valid savings amount.");
      return;
    }
    addSavings(amount);
    showNotification(`€${amount.toFixed(2)} added to savings!`);
    showAnimation("savings-animation");
    document.getElementById("savings-amount").value = "";
    document.getElementById("savings-amount").focus();
    updateProgress();
  });
  document.getElementById("withdraw-btn").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("withdraw-amount").value);
    if (isNaN(amount) || amount <= 0) {
      showNotification("Unesi ispravan iznos za podizanje.");
      return;
    }
    import("./savings.js").then((mod) => {
      if (!mod.withdrawSavings(amount)) {
        showNotification("Nema dovoljno štednje za podizanje.");
        return;
      }
      showNotification(`€${amount.toFixed(2)} podignuto sa štednje!`);
      updateProgress();
      document.getElementById("withdraw-amount").value = "";
    });
  });
  document.getElementById("clear-all-btn").addEventListener("click", () => {
    if (
      !confirm(
        "Are you sure you want to delete all data? This cannot be undone!"
      )
    )
      return;
    clearAllTransactions();
    clearSavings();
    document.getElementById("savings-goal").value = "";
    document.getElementById("goal-description").value = "";
    updateProgress();
    showNotification("All data cleared!");
  });
  document
    .getElementById("sort-transactions-btn")
    .addEventListener("click", () => {
      window.sortAscending = !window.sortAscending;
      sortTransactions(window.sortAscending);
      document.getElementById("sort-transactions-btn").textContent =
        window.sortAscending ? "Sort by Amount ⬆" : "Sort by Amount ⬇";
    });
  // Quick add savings
  document.getElementById("quick-add-1").addEventListener("click", () => {
    addSavings(1);
    showNotification("€1.00 added to savings!");
    showAnimation("savings-animation");
    updateProgress();
  });
  document.getElementById("quick-add-2").addEventListener("click", () => {
    addSavings(2);
    showNotification("€2.00 added to savings!");
    showAnimation("savings-animation");
    updateProgress();
  });
  document.getElementById("quick-add-5").addEventListener("click", () => {
    addSavings(5);
    showNotification("€5.00 added to savings!");
    showAnimation("savings-animation");
    updateProgress();
  });
  // Export to CSV
  document.getElementById("download-csv-btn").addEventListener("click", () => {
    import("./transactions.js").then((mod) => {
      const transactions = mod.transactions;
      if (transactions.length === 0) {
        showNotification("No transactions to export.");
        return;
      }
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Description,Category,Amount,Type\n";
      transactions.forEach((transaction) => {
        const row = `${transaction.description},${
          transaction.category
        },${transaction.amount.toFixed(2)},${transaction.type}`;
        csvContent += row + "\n";
      });
      const date = new Date().toISOString().replace(/[:.]/g, "-");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `transactions_${date}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });
  // Progress bar i cilj štednje
  document
    .getElementById("savings-goal")
    .addEventListener("change", updateProgress);
  document
    .getElementById("goal-description")
    .addEventListener("change", (e) => {
      localStorage.setItem("goalDescription", e.target.value);
    });
});
