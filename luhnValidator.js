// Luhn's Algorithm Card Validator Logic

// Core Luhn Validation Function (Mod 10 Check)
function isValidLuhn(cardNumber) {
  let sum = 0;
  let shouldDouble = false;

  // Loop from rightmost digit to leftmost
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// Brand Detection based on initial digits
function detectBrand(digits) {
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^(6011|65|64[4-9])/.test(digits)) return "discover";
  return "unknown";
}

// Format the card input dynamically
function formatCardNumber(value, brand) {
  const digits = value.replace(/\D/g, "");
  
  if (brand === "amex") {
    // American Express: 4-6-5 digit grouping
    const parts = [];
    if (digits.length > 0) parts.push(digits.substring(0, 4));
    if (digits.length > 4) parts.push(digits.substring(4, 10));
    if (digits.length > 10) parts.push(digits.substring(10, 15));
    return parts.join(" ");
  } else {
    // Standard format (Visa, Mastercard, Discover, etc.): 4-4-4-4-3 (up to 19 digits)
    const matches = digits.match(/\d{1,4}/g);
    if (matches) {
      return matches.join(" ");
    }
    return digits;
  }
}

// Masking card number for live display
function maskCardDisplay(formattedValue, brand) {
  const defaultMask = brand === "amex" ? "•••• •••••• •••••" : "•••• •••• •••• ••••";
  if (!formattedValue) return defaultMask;
  
  // Fill the remainder of the length with bullet dots to look premium
  let result = formattedValue;
  let currentDigitsCount = formattedValue.replace(/\s/g, "").length;
  let targetLength = brand === "amex" ? 15 : 16;
  
  if (currentDigitsCount < targetLength) {
    const defaultParts = defaultMask.split(" ");
    const currentParts = formattedValue.split(" ");
    
    for (let i = 0; i < defaultParts.length; i++) {
      if (i >= currentParts.length) {
        currentParts.push(defaultParts[i]);
      } else {
        const gap = defaultParts[i].length - currentParts[i].length;
        if (gap > 0) {
          currentParts[i] += defaultParts[i].slice(-gap);
        }
      }
    }
    result = currentParts.join(" ");
  }
  
  return result;
}

// Main Interactive Operations
document.addEventListener("DOMContentLoaded", () => {
  const cardInput = document.getElementById("cardInput");
  const cardholderInput = document.getElementById("cardholderInput");
  const cardWidget = document.getElementById("cardWidget");
  
  const cardNumberDisplay = document.getElementById("cardNumberDisplay");
  const cardholderDisplay = document.getElementById("cardholderDisplay");
  const cardBrand = document.getElementById("cardBrand");
  
  const validatorForm = document.getElementById("validatorForm");
  const resultBox = document.getElementById("resultBox");
  const resultIcon = document.getElementById("resultIcon");
  const resultMessage = document.getElementById("resultMessage");

  // Input Formatting and Visual Card Live Updates
  cardInput.addEventListener("input", (e) => {
    let rawValue = cardInput.value;
    let digits = rawValue.replace(/\D/g, "");
    
    // Identify Card Network Brand
    const brand = detectBrand(digits);
    
    // Update Brand Display and CSS Styles on Visual Widget
    cardWidget.className = "card-widget"; // reset classes
    if (brand !== "unknown") {
      cardWidget.classList.add(brand);
      cardBrand.textContent = brand.toUpperCase();
    } else {
      cardBrand.textContent = digits.length > 0 ? "UNKNOWN" : "CARD";
    }

    // Capture cursor index details before formatting to prevent jumping cursors
    let selectionStart = cardInput.selectionStart;
    let digitsBeforeCursor = rawValue.substring(0, selectionStart).replace(/\D/g, "").length;

    // Apply specific formats
    let formattedValue = formatCardNumber(rawValue, brand);
    cardInput.value = formattedValue;

    // Correctly restore cursor position after inserting formatting spaces
    let newCursorPos = 0;
    let digitsCount = 0;
    for (let i = 0; i < formattedValue.length; i++) {
      if (formattedValue[i] !== " ") {
        digitsCount++;
      }
      newCursorPos = i + 1;
      if (digitsCount === digitsBeforeCursor) {
        break;
      }
    }
    
    // If input is empty, reset cursor position to index 0
    if (digits.length === 0) {
      newCursorPos = 0;
    }
    cardInput.setSelectionRange(newCursorPos, newCursorPos);

    // Update real-time mock display card
    cardNumberDisplay.textContent = maskCardDisplay(formattedValue, brand);
    
    // Remove error formatting styles dynamically as they type a new number
    cardInput.classList.remove("error");
    cardWidget.classList.remove("valid-glow", "invalid-glow");
  });

  // Dynamic Cardholder Name Updates
  cardholderInput.addEventListener("input", () => {
    const val = cardholderInput.value.trim().toUpperCase();
    cardholderDisplay.textContent = val.length > 0 ? val : "VALUED CUSTOMER";
  });

  // Form Submit Validation Action
  validatorForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevents page reload

    const rawValue = cardInput.value;
    const digitsOnly = rawValue.replace(/\D/g, "");
    const brand = detectBrand(digitsOnly);

    // Reset feedback UI styles
    resultBox.className = "result-box";
    cardInput.classList.remove("error");
    cardWidget.classList.remove("valid-glow", "invalid-glow");

    // Empty validation guard
    if (digitsOnly.length === 0) {
      cardInput.classList.add("error");
      showResult("warning", "⚠️ Please enter a card number to validate.");
      return;
    }

    // Card length boundary validations (13 to 19 digits)
    const minLen = brand === "amex" ? 15 : 13;
    const maxLen = 19;
    
    if (digitsOnly.length < minLen || digitsOnly.length > maxLen) {
      cardInput.classList.add("error");
      cardWidget.classList.add("invalid-glow");
      showResult("error", `❌ Invalid Length. Standard numbers range from ${minLen} to ${maxLen} digits. (Got ${digitsOnly.length})`);
      return;
    }

    // Run the Luhn math algorithm
    const valid = isValidLuhn(digitsOnly);

    if (valid) {
      cardWidget.classList.add("valid-glow");
      let brandInfo = brand !== "unknown" ? ` (${brand.toUpperCase()})` : "";
      showResult("success", `✅ Valid Card Number${brandInfo}! The number passed the Luhn Mod 10 check.`);
    } else {
      cardInput.classList.add("error");
      cardWidget.classList.add("invalid-glow");
      showResult("error", "❌ Invalid Card Number. The digits did not satisfy the Luhn algorithm sum check.");
    }
  });

  // Display validation outcome
  function showResult(type, message) {
    resultMessage.textContent = message;
    resultBox.className = `result-box show ${type}`;
    
    if (type === "success") {
      resultIcon.textContent = "🏆";
    } else if (type === "error") {
      resultIcon.textContent = "🚨";
    } else {
      resultIcon.textContent = "⚠️";
    }
  }
});