function isValid(cardNumber) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function validateCard() {
  const input = document.getElementById("cardInput").value.trim();
  const result = document.getElementById("result");

  if (!/^\d+$/.test(input)) {
    result.textContent = "Please enter only digits.";
    return;
  }

  if (input.length < 14 || input.length > 19) {
    result.textContent = "Enter valid card length (14 to 19 digits).";
    return;
  }

  if (isValid(input)) {
    result.textContent = "✅ The card number is VALID.";
  } else {
    result.textContent = "❌ The card number is INVALID.";
  }
}