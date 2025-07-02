// i18n.js
// Inicijalizacija i18next s dinamičkim učitavanjem prijevoda

function loadLocale(lang) {
  return fetch(`locales/${lang}.json`).then((res) => res.json());
}

const userLang = localStorage.getItem("language") || "en";

Promise.all([loadLocale("en"), loadLocale("hr")]).then(([en, hr]) => {
  i18next.init(
    {
      lng: userLang,
      debug: false,
      resources: {
        en: { translation: en },
        hr: { translation: hr },
      },
    },
    function (err, t) {
      updateTexts();
      // Postavi tekst dugmeta jezika
      const languageToggle = document.getElementById("language-toggle");
      if (languageToggle)
        languageToggle.textContent = i18next.language.toUpperCase();
    }
  );
});

function updateTexts() {
  const t = i18next.t.bind(i18next);
  if (document.getElementById("income-title"))
    document.getElementById("income-title").textContent = t("income");
  if (document.querySelector('label[for="income-description"]'))
    document.querySelector('label[for="income-description"]').textContent =
      t("description");
  if (document.querySelector('label[for="income-amount"]'))
    document.querySelector('label[for="income-amount"]').textContent =
      t("amount");
  if (document.getElementById("add-income-btn"))
    document.getElementById("add-income-btn").textContent = t("addIncome");

  if (document.getElementById("expense-title"))
    document.getElementById("expense-title").textContent = t("expense");
  if (document.querySelector('label[for="expense-description"]'))
    document.querySelector('label[for="expense-description"]').textContent =
      t("description");
  if (document.querySelector('label[for="expense-category"]'))
    document.querySelector('label[for="expense-category"]').textContent =
      t("category");
  if (document.querySelector('label[for="expense-amount"]'))
    document.querySelector('label[for="expense-amount"]').textContent =
      t("amount");
  if (document.getElementById("add-expense-btn"))
    document.getElementById("add-expense-btn").textContent = t("addExpense");

  if (document.getElementById("transaction-history-title"))
    document.getElementById("transaction-history-title").textContent =
      t("transactionHistory");
  if (document.getElementById("table-description-header"))
    document.getElementById("table-description-header").textContent =
      t("description");
  if (document.getElementById("table-category-header"))
    document.getElementById("table-category-header").textContent =
      t("category");
  if (document.getElementById("table-amount-header"))
    document.getElementById("table-amount-header").textContent = t("amount");
  if (document.getElementById("table-type-header"))
    document.getElementById("table-type-header").textContent = t("type");
  if (document.getElementById("table-action-header"))
    document.getElementById("table-action-header").textContent = t("action");

  // Gumbi u tablici transakcija
  document.querySelectorAll("#transaction-history button").forEach((button) => {
    button.textContent = t("delete");
  });

  // Sažetak budžeta
  if (document.getElementById("budget-summary-title"))
    document.getElementById("budget-summary-title").textContent =
      t("budgetSummary");
  if (document.querySelector("#total-income"))
    document.querySelector("#total-income").parentElement.innerHTML = `${t(
      "totalIncome"
    )}: €<span id="total-income">${
      document.querySelector("#total-income").textContent
    }</span>`;
  if (document.querySelector("#total-expenses"))
    document.querySelector("#total-expenses").parentElement.innerHTML = `${t(
      "totalExpenses"
    )}: €<span id="total-expenses">${
      document.querySelector("#total-expenses").textContent
    }</span>`;
  if (document.getElementById("balance-label"))
    document.getElementById("balance-label").childNodes[0].textContent = `${t(
      "balance"
    )}: `;

  // Štednja
  if (document.getElementById("savings-title"))
    document.getElementById("savings-title").textContent = t("savings");
  if (document.querySelector('label[for="savings-amount"]'))
    document.querySelector('label[for="savings-amount"]').textContent =
      t("addToSavings");
  if (document.querySelector('label[for="withdraw-amount"]'))
    document.querySelector('label[for="withdraw-amount"]').textContent = t(
      "withdrawFromSavings"
    );
  if (document.getElementById("add-savings-btn"))
    document.getElementById("add-savings-btn").textContent =
      i18next.language === "hr" ? "Dodaj štednju" : "Add Savings";
  if (document.getElementById("withdraw-btn"))
    document.getElementById("withdraw-btn").textContent =
      i18next.language === "hr" ? "Podigni" : "Withdraw";
  if (
    document.querySelector(".savings-display p") &&
    window.savings !== undefined
  )
    document.querySelector(".savings-display p").innerHTML = `${t(
      "totalSavings"
    )}: €<span id="total-savings">${window.savings.toFixed(2)}</span>`;

  if (document.querySelector('label[for="savings-goal"]'))
    document.querySelector('label[for="savings-goal"]').textContent =
      t("savingGoal");
  if (document.querySelector('label[for="goal-description"]'))
    document.querySelector('label[for="goal-description"]').textContent =
      t("savingFor");

  // Prikaz napretka cilja štednje
  const goalProgressText = document.getElementById("goal-progress-text");
  if (goalProgressText) {
    const progressMatch = goalProgressText.textContent.match(/\d+(\.\d+)?/);
    const currentProgress = progressMatch ? parseFloat(progressMatch[0]) : 0;
    goalProgressText.textContent = `${currentProgress.toFixed(1)}${t(
      "goalProgress"
    )}`;
  }

  // Gumbi za čišćenje i eksport
  if (document.getElementById("clear-all-btn"))
    document.getElementById("clear-all-btn").textContent = t("clearAll");
  if (document.getElementById("download-csv-btn"))
    document.getElementById("download-csv-btn").textContent = t("downloadCSV");

  if (document.getElementById("sort-transactions-btn")) {
    const sortAscending =
      window.sortAscending !== undefined ? window.sortAscending : true;
    document.getElementById("sort-transactions-btn").textContent = sortAscending
      ? i18next.language === "hr"
        ? "Sortiraj po iznosu ⬆"
        : "Sort by Amount ⬆"
      : i18next.language === "hr"
      ? "Sortiraj po iznosu ⬇"
      : "Sort by Amount ⬇";
  }

  translateExpenseCategories(i18next.language);
  if (typeof updateChart === "function") updateChart();

  // --- PLACEHOLDERI ---
  if (document.getElementById("income-description"))
    document.getElementById("income-description").placeholder = t(
      "ph_income_description"
    );
  if (document.getElementById("income-amount"))
    document.getElementById("income-amount").placeholder =
      t("ph_income_amount");
  if (document.getElementById("expense-description"))
    document.getElementById("expense-description").placeholder = t(
      "ph_expense_description"
    );
  if (document.getElementById("expense-amount"))
    document.getElementById("expense-amount").placeholder =
      t("ph_expense_amount");
  if (document.getElementById("savings-amount"))
    document.getElementById("savings-amount").placeholder =
      t("ph_savings_amount");
  if (document.getElementById("withdraw-amount"))
    document.getElementById("withdraw-amount").placeholder =
      t("ph_withdraw_amount");
  if (document.getElementById("savings-goal"))
    document.getElementById("savings-goal").placeholder = t("ph_savings_goal");
  if (document.getElementById("goal-description"))
    document.getElementById("goal-description").placeholder = t(
      "ph_goal_description"
    );

  // --- PREVOĐENJE VRIJEDNOSTI U TABLICI ---
  // Vrsta (Type): Income/Expense
  document
    .querySelectorAll("#transaction-history td:nth-child(4)")
    .forEach((cell) => {
      if (cell.textContent === "Income" || cell.textContent === "Prihod") {
        cell.textContent = i18next.language === "hr" ? "Prihod" : "Income";
      } else if (
        cell.textContent === "Expense" ||
        cell.textContent === "Trošak"
      ) {
        cell.textContent = i18next.language === "hr" ? "Trošak" : "Expense";
      }
    });
  // Kategorija (Category): Housing, Food, Transportation, Entertainment, Others
  document
    .querySelectorAll("#transaction-history td:nth-child(2)")
    .forEach((cell) => {
      if (cell.textContent === "Housing" || cell.textContent === "Stanovanje") {
        cell.textContent = i18next.language === "hr" ? "Stanovanje" : "Housing";
      } else if (cell.textContent === "Food" || cell.textContent === "Hrana") {
        cell.textContent = i18next.language === "hr" ? "Hrana" : "Food";
      } else if (
        cell.textContent === "Transportation" ||
        cell.textContent === "Prijevoz"
      ) {
        cell.textContent =
          i18next.language === "hr" ? "Prijevoz" : "Transportation";
      } else if (
        cell.textContent === "Entertainment" ||
        cell.textContent === "Zabava"
      ) {
        cell.textContent =
          i18next.language === "hr" ? "Zabava" : "Entertainment";
      } else if (
        cell.textContent === "Others" ||
        cell.textContent === "Ostalo"
      ) {
        cell.textContent = i18next.language === "hr" ? "Ostalo" : "Others";
      }
    });
}

function translateExpenseCategories(lang) {
  const categories = {
    en: ["Housing", "Food", "Transportation", "Entertainment", "Others"],
    hr: ["Stanovanje", "Hrana", "Prijevoz", "Zabava", "Ostalo"],
  };
  const categoryOptions = document.querySelectorAll("#expense-category option");
  categoryOptions.forEach((option, index) => {
    option.textContent = categories[lang][index];
  });
}

// Promjena jezika
const languageToggle = document.getElementById("language-toggle");
if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    const newLang = i18next.language === "en" ? "hr" : "en";
    i18next.changeLanguage(newLang, () => {
      localStorage.setItem("language", newLang);
      languageToggle.textContent = newLang.toUpperCase();
      updateTexts();
    });
  });
}
