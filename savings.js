// savings.js
import { loadSavings, saveSavings } from "./storage.js";
import { updateSavingsUI, updateProgress } from "./ui.js";

export let savings = loadSavings();

export function addSavings(amount) {
  savings += amount;
  saveSavings(savings);
  updateSavingsUI();
}

export function withdrawSavings(amount) {
  if (amount > savings) return false;
  savings -= amount;
  saveSavings(savings);
  updateSavingsUI();
  updateProgress();
  return true;
}

export function clearSavings() {
  savings = 0;
  saveSavings(savings);
  updateSavingsUI();
}
