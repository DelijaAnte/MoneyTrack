const incomeDescription = document.getElementById('income-description');
const incomeAmount = document.getElementById('income-amount');
const expenseDescription = document.getElementById('expense-description');
const expenseAmount = document.getElementById('expense-amount');
const expenseCategory = document.getElementById('expense-category');
const transactionList = document.getElementById('transaction-history');
const totalIncome = document.getElementById('total-income');
const totalExpenses = document.getElementById('total-expenses');
const balance = document.getElementById('balance');

let transactions = [];
let savings = 0;

window.onload = function() {
    loadTransactions();
    loadSavings();
};

function loadTransactions() {
    const savedTransactions = localStorage.getItem('transactions');
    transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
    updateUI();
}

function loadSavings() {
    const savedSavings = localStorage.getItem('savings');
    savings = savedSavings ? parseFloat(savedSavings) : 0;
    updateSavingsUI();
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function saveSavings() {
    localStorage.setItem('savings', savings.toFixed(2));
}

function addIncome() {
    const description = incomeDescription.value.trim();
    const amount = parseFloat(incomeAmount.value);
    if (!description || isNaN(amount) || amount <= 0) {
        alert('Enter a valid income.');
        return;
    }
    transactions.push({ description, amount, category: 'Income', type: 'Income' });
    saveTransactions();
    updateUI();
    showNotification("Income added!");
    incomeDescription.value = '';
    incomeAmount.value = '';
}

function addExpense() {
    const description = expenseDescription.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const category = expenseCategory.value;
    if (!description || isNaN(amount) || amount <= 0) {
        alert('Enter a valid expense.');
        return;
    }
    transactions.push({ description, amount, category, type: 'Expense' });
    saveTransactions();
    updateUI();
    showNotification("Expense added!");
    expenseDescription.value = '';
    expenseAmount.value = '';
}
function deleteTransaction(index) {
    transactions.splice(index, 1);
    saveTransactions();
    updateUI();
    showNotification("Transaction deleted!");
}
function clearAll() {
    transactions = [];
    savings = 0;
    localStorage.clear();
    updateUI();
    updateSavingsUI();
    updateChart();
    showNotification("All data cleared!");
}

function addSavings() {
    const savingsInput = document.getElementById('savings-amount');
    const amount = parseFloat(savingsInput.value);
    if (isNaN(amount) || amount <= 0) {
        alert('Enter a valid savings amount.');
        return;
    }
    savings += amount;
    saveSavings();
    updateSavingsUI();
    showNotification(`€${amount.toFixed(2)} added to savings!`);
    showSavingsAnimation();
    savingsInput.value = '';
}

function quickAddSavings(amount) {
    savings += amount;
    saveSavings();
    updateSavingsUI();
    showNotification(`€${amount.toFixed(2)} added to savings!`);
    showSavingsAnimation();
}

function withdrawSavings() {
    const withdrawInput = document.getElementById('withdraw-amount');
    const amount = parseFloat(withdrawInput.value);
    if (isNaN(amount) || amount <= 0) {
        alert('Enter a valid withdrawal amount.');
        return;
    }
    if (amount > savings) {
        alert('Not enough savings.');
        return;
    }
    savings -= amount;
    saveSavings();
    updateSavingsUI();
    showNotification(`€${amount.toFixed(2)} withdrawn from savings!`);
    withdrawInput.value = '';
}

function updateSavingsUI() {
    document.getElementById('total-savings').textContent = savings.toFixed(2);
}

function updateUI() {
    transactionList.innerHTML = '';
    let totalIncomeValue = 0;
    let totalExpensesValue = 0;

    transactions.forEach((transaction, index) => {
        const row = document.createElement('tr');
        row.classList.add("transaction-row");
        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>${transaction.category}</td>
            <td>€${transaction.amount.toFixed(2)}</td>
            <td>${transaction.type}</td>
            <td>
                <button onclick="deleteTransaction(${index})">Delete</button>
            </td>
        `;
        transactionList.appendChild(row);

        if (transaction.type === 'Income') {
            totalIncomeValue += transaction.amount;
        } else {
            totalExpensesValue += transaction.amount;
        }
    });

    totalIncome.textContent = totalIncomeValue.toFixed(2);
    totalExpenses.textContent = totalExpensesValue.toFixed(2);
    const currentBalance = totalIncomeValue - totalExpensesValue;
    balance.textContent = currentBalance.toFixed(2);
    balance.className = currentBalance >= 0 ? 'positive' : 'negative';

    updateChart();
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.classList.add('hidden'); 
        }, 500);
    }, 2000);
}


function updateChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');

    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach(transaction => {
        if (transaction.type === 'Income') {
            incomeTotal += transaction.amount;
        } else if (transaction.type === 'Expense') {
            expenseTotal += transaction.amount;
        }
    });

    const labels = [];
    const data = [];
    const backgroundColors = [];

    if (incomeTotal > 0) {
        labels.push('Income');
        data.push(incomeTotal);
        backgroundColors.push('#4CAF50'); 
    }

    if (expenseTotal > 0) {
        labels.push('Expenses');
        data.push(expenseTotal);
        backgroundColors.push('#FF4C4C'); 
    }

    if (data.length === 0) {
        document.querySelector('.chart-container').style.display = 'none';
        return;
    } else {
        document.querySelector('.chart-container').style.display = 'block';
    }

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: €${tooltipItem.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

function showSavingsAnimation() {
    const animation = document.getElementById('savings-animation');
    animation.classList.remove('hidden');
    animation.classList.add('show');

    setTimeout(() => {
        animation.classList.remove('show');
        setTimeout(() => {
            animation.classList.add('hidden');
        }, 500);
    }, 1500);
}
function exportToCSV() {
    if (transactions.length === 0) {
        alert('No transactions to export.');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Description,Category,Amount,Type\n";  // Header

    transactions.forEach(transaction => {
        const row = `${transaction.description},${transaction.category},${transaction.amount.toFixed(2)},${transaction.type}`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);  // Required for Firefox
    link.click();
    document.body.removeChild(link);
}
