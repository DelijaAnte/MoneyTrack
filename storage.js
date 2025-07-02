// storage.js

export function loadTransactions() {
  const savedTransactions = localStorage.getItem("transactions");
  return savedTransactions ? JSON.parse(savedTransactions) : [];
}

export function saveTransactions(transactions) {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

export function loadSavings() {
  const savedSavings = localStorage.getItem("savings");
  return savedSavings ? parseFloat(savedSavings) : 0;
}

export function saveSavings(savings) {
  localStorage.setItem("savings", savings.toFixed(2));
}
