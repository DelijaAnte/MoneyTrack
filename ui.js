import { transactions } from "./transactions.js";
import { savings } from "./savings.js";

export function updateUI() {
  const transactionList = document.getElementById("transaction-history");
  const totalIncome = document.getElementById("total-income");
  const totalExpenses = document.getElementById("total-expenses");
  const balance = document.getElementById("balance");
  transactionList.innerHTML = "";
  let totalIncomeValue = 0;
  let totalExpensesValue = 0;
  transactions.forEach((transaction, index) => {
    const row = document.createElement("tr");
    row.classList.add("transaction-row");
    row.innerHTML = `
      <td>${transaction.description}</td>
      <td>${transaction.category}</td>
      <td>€${transaction.amount.toFixed(2)}</td>
      <td>${transaction.type}</td>
      <td><button class="delete-btn" data-index="${index}">Delete</button></td>
    `;
    transactionList.appendChild(row);
    if (transaction.type === "Income") {
      totalIncomeValue += transaction.amount;
    } else {
      totalExpensesValue += transaction.amount;
    }
  });
  totalIncome.textContent = totalIncomeValue.toFixed(2);
  totalExpenses.textContent = totalExpensesValue.toFixed(2);
  const currentBalance = totalIncomeValue - totalExpensesValue;
  balance.textContent = currentBalance.toFixed(2);
  balance.className = currentBalance >= 0 ? "positive" : "negative";
  updateChart();
  // Dodaj event listenere za brisanje
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.getAttribute("data-index"));
      import("./transactions.js").then((mod) => mod.deleteTransaction(idx));
    });
  });
}

export function updateSavingsUI() {
  document.getElementById("total-savings").textContent = savings.toFixed(2);
}

export function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.remove("hidden");
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 500);
  }, 2000);
}

export function showAnimation(animationId) {
  const animation = document.getElementById(animationId);
  if (animation.classList.contains("show")) return;
  animation.classList.remove("hidden");
  animation.classList.add("show");
  setTimeout(() => {
    animation.classList.remove("show");
    setTimeout(() => {
      animation.classList.add("hidden");
    }, 500);
  }, 1500);
}

export function updateChart() {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  const incomeTransactions = transactions.filter((t) => t.type === "Income");
  const expenseTransactions = transactions.filter((t) => t.type === "Expense");
  const labels = [];
  const data = [];
  const backgroundColors = [];
  const incomeLabel = "Income";
  const expenseLabel = "Expense";
  const generateColor = (baseHue, index, total) => {
    const lightness = 50 + (index / total) * 30;
    return `hsl(${baseHue}, 70%, ${lightness}%)`;
  };
  incomeTransactions.forEach((transaction, index) => {
    labels.push(`${incomeLabel}: ${transaction.description}`);
    data.push(transaction.amount);
    backgroundColors.push(generateColor(120, index, incomeTransactions.length));
  });
  expenseTransactions.forEach((transaction, index) => {
    labels.push(`${expenseLabel}: ${transaction.description}`);
    data.push(transaction.amount);
    backgroundColors.push(generateColor(0, index, expenseTransactions.length));
  });
  if (data.length === 0) {
    document.querySelector(".chart-container").style.display = "none";
    return;
  } else {
    document.querySelector(".chart-container").style.display = "block";
  }
  if (window.myChart) {
    window.myChart.destroy();
  }
  window.myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.label}: €${tooltipItem.raw.toFixed(2)}`;
            },
          },
        },
      },
    },
  });
}

export function updateProgress() {
  const savingsGoalInput = document.getElementById("savings-goal");
  const progressBar = document.getElementById("progress-bar");
  const goalProgressText = document.getElementById("goal-progress-text");
  const savingsValue = savings;
  const goalAmount = parseFloat(savingsGoalInput.value);
  if (isNaN(goalAmount) || goalAmount <= 0) {
    progressBar.style.width = "0%";
    goalProgressText.textContent = "0% ispunjeno";
    return;
  }
  const progress = Math.min((savingsValue / goalAmount) * 100, 100);
  progressBar.style.width = `${progress}%`;
  goalProgressText.textContent = `${progress.toFixed(1)}% ispunjeno`;
}
