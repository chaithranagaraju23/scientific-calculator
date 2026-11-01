# Scientific Calculator 🧮

A modern, responsive, and feature-rich Scientific Calculator built with **vanilla HTML5, CSS3, and JavaScript (ES6+)**. It offers high-precision math parsing, dual angle modes (DEG/RAD), secondary shift functions, memory registers, natural expression syntax, and full keyboard accessibility wrapped in a dark glassmorphism interface.

---

## ✨ Features

### 1. Mathematical Capabilities
- **Standard Arithmetic**: Addition ($+$), Subtraction ($-$), Multiplication ($\times$), Division ($\div$), and Percentage ($\%$).
- **Trigonometric Functions**:
  - Primary: $\sin$, $\cos$, $\tan$
  - Secondary (`2nd`): $\sin^{-1}$ ($\arcsin$), $\cos^{-1}$ ($\arccos$), $\tan^{-1}$ ($\arctan$)
- **Angle Modes**: Toggle between **`DEG`** (Degrees) and **`RAD`** (Radians) with live badge indicators and trigonometric normalization (e.g., $\cos(90^\circ) = 0$).
- **Powers & Roots**:
  - Exponentiation: $x^y$, $x^2$, $x^3$
  - Roots: Square root ($\sqrt{x}$), Cube root ($\sqrt[3]{x}$)
  - Reciprocal: $1/x$
- **Logarithms & Exponentials**:
  - Natural logarithm ($\ln$), Base-10 logarithm ($\log$)
  - Natural exponential ($e^x$), Base-10 power ($10^x$)
- **Factorials & Specials**:
  - Factorial ($n!$, up to $170!$)
  - Absolute value ($|x|$)
  - Mathematical constants: $\pi$ (`Math.PI`) and $e$ (`Math.E`)
  - Negation ($\pm$) with smart sign toggling on active numbers

### 2. Smart Math Engine
- **Safe Parsing (Zero `eval`)**: Built using a custom tokenizer and recursive descent parser respecting mathematical operator precedence (PEMDAS / BODMAS).
- **Implicit Multiplication**: Natural syntax support like `2π`, `5(2+3)`, and `4sin(30)`.
- **Auto-Closing Parentheses**: Missing closing parentheses are automatically balanced upon pressing `=`.
- **Floating-Point Correction**: Eliminates IEEE-754 precision artifacts (e.g., $0.1 + 0.2 = 0.3$).
- **Clean Scientific Notation**: Large ($\ge 10^{13}$) and tiny ($< 10^{-7}$) non-zero results automatically switch to exponential notation.

### 3. Memory & History
- **`MC`**: Memory Clear (resets memory register to 0).
- **`MR`**: Memory Recall (inserts stored value into the expression).
- **`M+`**: Memory Add (adds the current result to memory).
- **`M-`**: Memory Subtract (subtracts the current result from memory).
- **`Ans`**: Recalls the previous calculation's result for continuous chained operations.
- **Active Memory Indicator**: `M` badge in the header illuminates with a warm gold glow when a non-zero value is in memory.

### 4. Modern Glassmorphism UI
- Responsive layout optimized for desktop, tablets, and mobile phones.
- Two-tier display: Expression preview line with automatic horizontal scrolling and a large result screen.
- Tactile button feedback with subtle hover transitions and active presses.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `0` – `9` | Enter numbers |
| `.` | Decimal point |
| `+`, `-`, `*`, `/` | Basic operators ($+$, $-$, $\times$, $\div$) |
| `^` | Exponentiation ($x^y$) |
| `(` and `)` | Parentheses |
| `!` | Factorial ($n!$) |
| `%` | Percentage |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last character / token (`DEL`) |
| `Escape` | Clear all (`AC`) |
| `d` or `D` | Toggle angle mode (`DEG` $\leftrightarrow$ `RAD`) |
| `s` | Sine function ($\sin$) |
| `c` | Cosine function ($\cos$) |
| `t` | Tangent function ($\tan$) |
| `p` or `P` | Constant Pi ($\pi$) |
| `e` or `E` | Constant Euler's number ($e$) |

---

## 📁 Project Structure

```text
fronted/
├── index.html     # Semantic calculator markup and button grid
├── style.css      # Dark glassmorphism styling, layout, and animations
├── script.js      # Parser, math evaluation engine, and UI controller
└── README.md      # Project documentation
```

---

## 🚀 Getting Started

No build tools or package managers required. Simply open the application in any modern web browser.

### Option 1: Direct File Open
Double-click [**`index.html`**](index.html) or right-click and select **Open with... > Google Chrome / Microsoft Edge / Firefox / Safari**.

### Option 2: VS Code Live Server
1. Open this folder in VS Code.
2. Install the **Live Server** extension (`ritwickdey.LiveServer`).
3. Right-click [**`index.html`**](index.html) and select **Open with Live Server**.

### Option 3: Local HTTP Server
Using Python:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic tags, accessible attributes, and `data-*` properties.
- **CSS3**: CSS Grid, Flexbox, custom variables, gradients, and media queries.
- **JavaScript (ES6+)**: Tokenizer, recursive descent parser, DOM event handling, and Math API.

---

## 📄 License

This project is open-source and free to use for personal, educational, or commercial purposes.

