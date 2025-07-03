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

// =====================
//  Helper Functions
// =====================
function isValidAmount(val) {
  return !isNaN(val) && val > 0;
}

function resetInput(id) {
  const el = document.getElementById(id);
  if (el) el.value = "";
}

function focusInput(id) {
  const el = document.getElementById(id);
  if (el) el.focus();
}

// =====================
//  DOMContentLoaded
// =====================
window.addEventListener("DOMContentLoaded", () => {
  setupDarkMode();
  updateUI();
  updateSavingsUI();
  updateChart();
  updateProgress();

  // =====================
  //  Prihodi
  // =====================
  document.getElementById("add-income-btn").addEventListener("click", () => {
    const desc = document.getElementById("income-description").value.trim();
    const amount = parseFloat(document.getElementById("income-amount").value);
    if (!desc || !isValidAmount(amount)) {
      showNotification("Enter a valid income.");
      return;
    }
    addIncome(desc, amount);
    showNotification("Income added!");
    showAnimation("income-animation");
    resetInput("income-description");
    resetInput("income-amount");
    focusInput("income-description");
  });

  // =====================
  //  Troškovi
  // =====================
  document.getElementById("add-expense-btn").addEventListener("click", () => {
    const desc = document.getElementById("expense-description").value.trim();
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const category = document.getElementById("expense-category").value;
    if (!desc || !isValidAmount(amount)) {
      showNotification("Enter a valid expense.");
      return;
    }
    addExpense(desc, amount, category);
    showNotification("Expense added!");
    showAnimation("expense-animation");
    resetInput("expense-description");
    resetInput("expense-amount");
    focusInput("expense-description");
  });

  // =====================
  //  Štednja
  // =====================
  document.getElementById("add-savings-btn").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("savings-amount").value);
    if (!isValidAmount(amount)) {
      showNotification("Enter a valid savings amount.");
      return;
    }
    addSavings(amount);
    showNotification(`€${amount.toFixed(2)} added to savings!`);
    showAnimation("savings-animation");
    resetInput("savings-amount");
    focusInput("savings-amount");
    updateProgress();
  });

  document.getElementById("withdraw-btn").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("withdraw-amount").value);
    if (!isValidAmount(amount)) {
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
      resetInput("withdraw-amount");
    });
  });

  // =====================
  //  Quick Add Štednja
  // =====================
  [1, 2, 5].forEach((val) => {
    document
      .getElementById(`quick-add-${val}`)
      .addEventListener("click", () => {
        addSavings(val);
        showNotification(`€${val.toFixed(2)} added to savings!`);
        showAnimation("savings-animation");
        updateProgress();
      });
  });

  // =====================
  //  Brisanje svih podataka
  // =====================
  document.getElementById("clear-all-btn").addEventListener("click", () => {
    if (
      !confirm(
        "Are you sure you want to delete all data? This cannot be undone!"
      )
    )
      return;
    clearAllTransactions();
    clearSavings();
    resetInput("savings-goal");
    resetInput("goal-description");
    updateProgress();
    showNotification("All data cleared!");
  });

  // =====================
  //  Sortiranje transakcija
  // =====================
  document
    .getElementById("sort-transactions-btn")
    .addEventListener("click", () => {
      window.sortAscending = !window.sortAscending;
      sortTransactions(window.sortAscending);
      document.getElementById("sort-transactions-btn").textContent =
        window.sortAscending ? "Sort by Amount ⬆" : "Sort by Amount ⬇";
    });

  // =====================
  //  Export u CSV
  // =====================
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

  // =====================
  //  Progress bar i cilj štednje
  // =====================
  document
    .getElementById("savings-goal")
    .addEventListener("change", updateProgress);
  document
    .getElementById("goal-description")
    .addEventListener("change", (e) => {
      localStorage.setItem("goalDescription", e.target.value);
    });
});
