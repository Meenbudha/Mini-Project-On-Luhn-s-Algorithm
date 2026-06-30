# 💳 Luhn's Algorithm Card Validator

A premium, interactive web application that validates credit and debit card numbers in real-time using the **Luhn Algorithm (Mod 10 Check)**. The user interface features a sleek, glassmorphic layout, live credit card card visualization, dynamic brand auto-detection, auto-formatting, and validation micro-animations.

Live Preview URL: https://card-validator-five.vercel.app/

---

## 🧮 What is Luhn's Algorithm?

The **Luhn algorithm** (also known as the "Modulo 10" or "Mod 10" algorithm) is a simple checksum formula used to validate a variety of identification numbers, most notably credit card numbers. It is designed to protect against accidental typing errors (such as transposing two digits).

### How it works:
1. **Double every second digit** starting from the rightmost (but excluding the check digit itself, or simply doubling every second digit starting from the rightmost second).
2. If doubling a digit results in a number greater than 9 (e.g., `8 × 2 = 16`), **subtract 9** from it (which is equivalent to adding its two digits together: `1 + 6 = 7`).
3. **Sum all the digits** (both the doubled and undoubled numbers).
4. If the total modulo 10 is equal to 0 (ends in zero), then the number is **valid** according to the Luhn formula.

---

## 🌟 Features

* **Live Credit Card Mockup**: A beautiful mock credit card that updates with your input (card numbers, name, card network badge) in real-time.
* **Smart Brand Auto-Detection**: Dynamically recognizes card networks as you type:
  * **Visa** (prefix `4`)
  * **Mastercard** (prefixes `51-55`, `2221-2720`)
  * **American Express (AmEx)** (prefixes `34`, `37`)
  * **Discover** (prefixes `6011`, `644-649`, `65`)
* **Dynamic Card-Brand Styling**: Modifies the card background gradient automatically depending on the detected network (e.g., deep blue for Visa, red/yellow for Mastercard, green/slate for AmEx).
* **Smart Caret Management Formatting**: Inserts spaces automatically (standard 4-digit groups or AmEx 4-6-5 format) without messing up your keyboard cursor position when editing in the middle.
* **Micro-Animations & Visual State Feedback**:
  * Shakes the card and flashes red outline on failure/invalid checks.
  * Pulses green and emits a success drop-shadow glow on validation success.
* **Clean & Semantic HTML**: Accessible markup structure matching modern SEO rules.

---

## 🛠️ Technology Stack

* **Structure**: HTML5 (semantic layout, SEO-optimized tags)
* **Styling**: Vanilla CSS3 (Custom radial background gradients, glassmorphism, CSS keyframe animations, responsive grid/flexbox)
* **Behavior**: Plain Vanilla JavaScript

---

## 🚀 How to Run

1. Clone or download the repository workspace.
2. Open [index.html](file:///d:/Projects/Mini-Project-On-Luhn-s-Algorithm/index.html) directly in any modern browser (Chrome, Firefox, Safari, Edge).
3. Alternatively, launch the project using an extension like **Live Server** in VS Code (accessible on `https://card-validator-five.vercel.app/` as listed in your environment).
