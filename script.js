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
    updateLanguage(currentLanguage);
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
    showAnimation('income-animation');  
    incomeDescription.value = '';
    incomeAmount.value = '';
    incomeDescription.focus();
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
    showAnimation('expense-animation');
    expenseDescription.value = '';
    expenseAmount.value = '';
    expenseDescription.focus();
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
    document.getElementById('savings-goal').value = '';
    document.getElementById('goal-description').value = '';
    updateProgress();
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
    showAnimation('savings-animation'); 
    savingsInput.value = '';
    savingsInput.focus();
}

function quickAddSavings(amount) {
    savings += amount;
    saveSavings();
    updateSavingsUI();
    showNotification(`€${amount.toFixed(2)} added to savings!`);
    showAnimation('savings-animation'); 
}

function withdrawSavings() {
    const withdrawInput = document.getElementById('withdraw-amount');
    const amount = parseFloat(withdrawInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert('Unesi ispravan iznos za podizanje.');
        return;
    }

    if (amount > savings) {
        alert('Nema dovoljno štednje za podizanje.');
        return;
    }

    savings -= amount;
    saveSavings();
    updateSavingsUI();
    showNotification(`€${amount.toFixed(2)} podignuto sa štednje!`);
    updateProgress();  // Ažuriraj progress bar nakon podizanja štednje
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

    const incomeTransactions = transactions.filter(t => t.type === 'Income');
    const expenseTransactions = transactions.filter(t => t.type === 'Expense');

    const labels = [];
    const data = [];
    const backgroundColors = [];

    const incomeLabel = translations[currentLanguage].income;
    const expenseLabel = translations[currentLanguage].expense;

    const generateColor = (baseHue, index, total) => {
        const lightness = 50 + (index / total) * 30; // Povećava svjetlinu sa svakim unosom
        return `hsl(${baseHue}, 70%, ${lightness}%)`;
    };

    // Dodavanje prihoda s nijansama zelene
    incomeTransactions.forEach((transaction, index) => {
        labels.push(`${incomeLabel}: ${transaction.description}`);
        data.push(transaction.amount);
        backgroundColors.push(generateColor(120, index, incomeTransactions.length)); // 120 = zelena
    });

    // Dodavanje troškova s nijansama crvene
    expenseTransactions.forEach((transaction, index) => {
        labels.push(`${expenseLabel}: ${transaction.description}`);
        data.push(transaction.amount);
        backgroundColors.push(generateColor(0, index, expenseTransactions.length)); // 0 = crvena
    });

    // Ako nema podataka, sakrij graf
    if (data.length === 0) {
        document.querySelector('.chart-container').style.display = 'none';
        return;
    } else {
        document.querySelector('.chart-container').style.display = 'block';
    }

    // Uništi prethodni graf ako postoji
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Kreiraj novi pie chart
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



function showAnimation(animationId) {
    const animation = document.getElementById(animationId);
    if (animation.classList.contains('show')) return; 
    
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
    csvContent += "Description,Category,Amount,Type\n";

    transactions.forEach(transaction => {
        const row = `${transaction.description},${transaction.category},${transaction.amount.toFixed(2)},${transaction.type}`;
        csvContent += row + "\n";
    });

    const date = new Date().toISOString().replace(/[:.]/g, '-');  // Format za naziv datoteke
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

if (localStorage.getItem('darkMode') === 'enabled') {
    darkModeStylesheet.removeAttribute('disabled');
    darkModeToggle.textContent = '🌙';  
} else {
    darkModeToggle.textContent = '☀️';
}

darkModeToggle.addEventListener('click', () => {
    if (darkModeStylesheet.disabled) {
        darkModeStylesheet.removeAttribute('disabled');  
        localStorage.setItem('darkMode', 'enabled');    
        darkModeToggle.textContent = '🌙'; 
    } else {
        darkModeStylesheet.setAttribute('disabled', 'true'); 
        localStorage.setItem('darkMode', 'disabled');     
        darkModeToggle.textContent = '☀️';  
    }
});

const savingsGoalInput = document.getElementById('savings-goal');
const progressBar = document.getElementById('progress-bar');
const goalProgressText = document.getElementById('goal-progress-text');

savingsGoalInput.addEventListener('input', updateProgress);
document.getElementById('add-savings-btn').addEventListener('click', updateProgress);
document.querySelectorAll('.quick-add-buttons button').forEach(button => {
    button.addEventListener('click', updateProgress);
});

function updateProgress() {
    const goalAmount = parseFloat(savingsGoalInput.value);
    if (isNaN(goalAmount) || goalAmount <= 0) {
        progressBar.style.width = '0%';
        goalProgressText.textContent = '0% ispunjeno';
        return;
    }

    const progress = Math.min((savings / goalAmount) * 100, 100);
    progressBar.style.width = `${progress}%`;
    goalProgressText.textContent = `${progress.toFixed(1)}% ispunjeno`;
}

// Automatski učitaj spremljene ciljeve iz localStorage
window.onload = function() {
    loadTransactions();
    loadSavings();
    updateLanguage(currentLanguage);

    // Učitaj spremljeni cilj štednje
    const savedGoal = localStorage.getItem('savingsGoal');
    if (savedGoal) {
        savingsGoalInput.value = savedGoal;
        updateProgress();
    }

    // Učitaj opis cilja štednje
    const savedGoalDescription = localStorage.getItem('goalDescription');
    if (savedGoalDescription) {
        document.getElementById('goal-description').value = savedGoalDescription;
    }
};


// Spremi cilj štednje u localStorage
savingsGoalInput.addEventListener('change', () => {
    localStorage.setItem('savingsGoal', savingsGoalInput.value);
    updateProgress();
});

// Spremi opis cilja štednje
document.getElementById('goal-description').addEventListener('change', (e) => {
    localStorage.setItem('goalDescription', e.target.value);
});



