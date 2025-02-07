const translations = {
    en: {
        income: "Income",
        addIncome: "Add Income",
        expense: "Expenses",
        addExpense: "Add Expense",
        savings: "Savings",
        addToSavings: "Add to Savings (€)",
        withdrawFromSavings: "Withdraw from Savings (€)",
        totalSavings: "Total Savings",
        transactionHistory: "Transaction History",
        description: "Description",
        category: "Category",
        amount: "Amount (€)",
        type: "Type",
        action: "Action",
        budgetSummary: "Budget Summary",
        totalIncome: "Total Income",
        totalExpenses: "Total Expenses",
        balance: "Balance",
        clearAll: "Clear All",
        downloadCSV: "Download CSV",
        delete: "Delete"
    },
    hr: {
        income: "Prihod",
        addIncome: "Dodaj prihod",
        expense: "Trošak",
        addExpense: "Dodaj trošak",
        savings: "Štednja",
        addToSavings: "Dodaj u štednju (€)",
        withdrawFromSavings: "Podigni sa štednje (€)",
        totalSavings: "Ukupna štednja",
        transactionHistory: "Povijest transakcija",
        description: "Opis",
        category: "Kategorija",
        amount: "Iznos (€)",
        type: "Vrsta",
        action: "Akcija",
        budgetSummary: "Sažetak budžeta",
        totalIncome: "Ukupni prihodi",
        totalExpenses: "Ukupni troškovi",
        balance: "Stanje",
        clearAll: "Obriši sve",
        downloadCSV: "Preuzmi CSV",
        delete: "Obriši"
    }
};

const languageToggle = document.getElementById('language-toggle');
let currentLanguage = localStorage.getItem('language') || 'en';

languageToggle.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'hr' : 'en';
    localStorage.setItem('language', currentLanguage);
    languageToggle.textContent = currentLanguage.toUpperCase();
    updateLanguage(currentLanguage);
});

function updateLanguage(lang) {
    const t = translations[lang];

    document.querySelector('h1').textContent = 'MoneyTrack';
    document.getElementById('income-title').textContent = t.income;
    document.querySelector('label[for="income-description"]').textContent = t.description;
    document.querySelector('label[for="income-amount"]').textContent = t.amount;
    document.getElementById('add-income-btn').textContent = t.addIncome;

    document.getElementById('expense-title').textContent = t.expense;
    document.querySelector('label[for="expense-description"]').textContent = t.description;
    document.querySelector('label[for="expense-category"]').textContent = t.category;
    document.querySelector('label[for="expense-amount"]').textContent = t.amount;
    document.getElementById('add-expense-btn').textContent = t.addExpense;

    document.getElementById('transaction-history-title').textContent = t.transactionHistory;
    document.getElementById('table-description-header').textContent = t.description;
    document.getElementById('table-category-header').textContent = t.category;
    document.getElementById('table-amount-header').textContent = t.amount;
    document.getElementById('table-type-header').textContent = t.type;
    document.getElementById('table-action-header').textContent = t.action;

    // Prevođenje unutar tablice transakcija
    document.querySelectorAll('#transaction-history td:nth-child(4)').forEach(cell => {
        if (cell.textContent === 'Income') {
            cell.textContent = lang === 'hr' ? 'Prihod' : 'Income';
        } else if (cell.textContent === 'Expense') {
            cell.textContent = lang === 'hr' ? 'Trošak' : 'Expense';
        }
    });

    document.querySelectorAll('#transaction-history td:nth-child(2)').forEach(cell => {
        if (cell.textContent === 'Income') {
            cell.textContent = lang === 'hr' ? 'Prihod' : 'Income';
        } else if (cell.textContent === 'Housing') {
            cell.textContent = lang === 'hr' ? 'Stanovanje' : 'Housing';
        } else if (cell.textContent === 'Food') {
            cell.textContent = lang === 'hr' ? 'Hrana' : 'Food';
        } else if (cell.textContent === 'Transportation') {
            cell.textContent = lang === 'hr' ? 'Prijevoz' : 'Transportation';
        } else if (cell.textContent === 'Entertainment') {
            cell.textContent = lang === 'hr' ? 'Zabava' : 'Entertainment';
        } else if (cell.textContent === 'Others') {
            cell.textContent = lang === 'hr' ? 'Ostalo' : 'Others';
        }
    });

    document.querySelectorAll('#transaction-history button').forEach(button => {
        button.textContent = lang === 'hr' ? 'Obriši' : 'Delete';
    });

    // Sažetak budžeta
    document.getElementById('budget-summary-title').textContent = t.budgetSummary;
    document.querySelector('#total-income').parentElement.innerHTML = `${t.totalIncome}: €<span id="total-income">${totalIncome.textContent}</span>`;
    document.querySelector('#total-expenses').parentElement.innerHTML = `${t.totalExpenses}: €<span id="total-expenses">${totalExpenses.textContent}</span>`;
    document.querySelector('#balance').parentElement.innerHTML = `${t.balance}: <span id="balance">${balance.textContent}</span>`;

    // Štednja
    document.getElementById('savings-title').textContent = t.savings;
    document.querySelector('label[for="savings-amount"]').textContent = t.addToSavings;
    document.querySelector('label[for="withdraw-amount"]').textContent = t.withdrawFromSavings;
    document.getElementById('add-savings-btn').textContent = lang === 'hr' ? 'Dodaj štednju' : 'Add Savings';
    document.getElementById('withdraw-btn').textContent = lang === 'hr' ? 'Podigni' : 'Withdraw';
    document.querySelector('.savings-display p').innerHTML = `${t.totalSavings}: €<span id="total-savings">${savings.toFixed(2)}</span>`;

    document.getElementById('clear-all-btn').textContent = t.clearAll;
    document.getElementById('download-csv-btn').textContent = t.downloadCSV;

    translateExpenseCategories(lang);
}

function translateExpenseCategories(lang) {
    const categories = {
        en: ["Housing", "Food", "Transportation", "Entertainment", "Others"],
        hr: ["Stanovanje", "Hrana", "Prijevoz", "Zabava", "Ostalo"]
    };

    const categoryOptions = document.querySelectorAll('#expense-category option');
    categoryOptions.forEach((option, index) => {
        option.textContent = categories[lang][index];
    });
}
