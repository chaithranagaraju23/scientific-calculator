// DOM Element References
const expressionDisplay = document.getElementById('expression-display');
const resultDisplay = document.getElementById('result-display');
const badgeAngle = document.getElementById('badge-angle');
const badge2nd = document.getElementById('badge-2nd');
const badgeMem = document.getElementById('badge-mem');
const btnDeg = document.getElementById('btn-deg');
const btnRad = document.getElementById('btn-rad');
const btn2nd = document.getElementById('btn-2nd');
const btnAc = document.getElementById('btn-ac');
const btnDel = document.getElementById('btn-del');
const btnEquals = document.getElementById('btn-equals');
const btnNegate = document.getElementById('btn-negate');
const funcButtons = document.querySelectorAll('.func-btn');

// Calculator State
let expression = '';
let lastAnswer = 0;
let memoryValue = 0;
let angleMode = 'DEG'; // 'DEG' or 'RAD'
let is2nd = false;
let shouldResetOnInput = false;

// 2nd Function Display Labels
const funcLabels = {
    sin: { primary: 'sin', secondary: 'sin<sup>-1</sup>' },
    cos: { primary: 'cos', secondary: 'cos<sup>-1</sup>' },
    tan: { primary: 'tan', secondary: 'tan<sup>-1</sup>' },
    ln: { primary: 'ln', secondary: 'e<sup>x</sup>' },
    log: { primary: 'log', secondary: '10<sup>x</sup>' },
    sqrt: { primary: '√', secondary: 'x<sup>2</sup>' },
    pow: { primary: 'x<sup>y</sup>', secondary: 'x<sup>3</sup>' },
    fact: { primary: 'x!', secondary: '∛' },
    recip: { primary: '1/x', secondary: '|x|' }
};

// -------------------------------------------------------------
// UI Updates
// -------------------------------------------------------------
function updateDisplay() {
    expressionDisplay.textContent = expression;
    expressionDisplay.scrollLeft = expressionDisplay.scrollWidth;

    if (!shouldResetOnInput && !resultDisplay.classList.contains('error-text')) {
        // Show 0 if expression is empty
        if (expression.trim() === '') {
            resultDisplay.textContent = '0';
        }
    }
}

function showResult(value, isError = false) {
    if (isError) {
        resultDisplay.textContent = value;
        resultDisplay.classList.add('error-text');
    } else {
        resultDisplay.textContent = formatNumber(value);
        resultDisplay.classList.remove('error-text');
    }
    resultDisplay.scrollLeft = resultDisplay.scrollWidth;
}

function formatNumber(num) {
    if (isNaN(num)) return 'Error';
    if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

    // Fix floating point inaccuracy (e.g. 0.1 + 0.2 = 0.3)
    let rounded = parseFloat(num.toPrecision(12));

    // For very large or tiny non-zero numbers, format in exponential form
    if (Math.abs(rounded) >= 1e13 || (Math.abs(rounded) < 1e-7 && rounded !== 0)) {
        return rounded.toExponential().replace('e+', 'e');
    }

    // Locale formatting for display with grouping commas
    const parts = rounded.toString().split('.');
    const intPart = parseFloat(parts[0]).toLocaleString('en-US');
    return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;
}

// -------------------------------------------------------------
// Angle Mode & 2nd Function Toggles
// -------------------------------------------------------------
function setAngleMode(mode) {
    angleMode = mode;
    if (mode === 'DEG') {
        btnDeg.classList.add('active');
        btnRad.classList.remove('active');
        badgeAngle.textContent = 'DEG';
    } else {
        btnRad.classList.add('active');
        btnDeg.classList.remove('active');
        badgeAngle.textContent = 'RAD';
    }
}

function toggle2nd() {
    is2nd = !is2nd;
    btn2nd.classList.toggle('active', is2nd);
    badge2nd.classList.toggle('active', is2nd);

    funcButtons.forEach(btn => {
        const prim = btn.getAttribute('data-primary');
        if (funcLabels[prim]) {
            btn.innerHTML = is2nd ? funcLabels[prim].secondary : funcLabels[prim].primary;
        }
    });
}

// -------------------------------------------------------------
// Input Handling
// -------------------------------------------------------------
function appendInput(str) {
    if (shouldResetOnInput) {
        expression = '';
        shouldResetOnInput = false;
        resultDisplay.classList.remove('error-text');
    }

    expression += str;
    updateDisplay();
}

function appendOperator(op) {
    resultDisplay.classList.remove('error-text');

    if (shouldResetOnInput) {
        expression = 'Ans' + op;
        shouldResetOnInput = false;
        updateDisplay();
        return;
    }

    if (expression === '' && op === '−') {
        expression = '−';
        updateDisplay();
        return;
    }

    // If the expression already ends with an operator, replace it
    const lastChar = expression.slice(-1);
    const ops = ['+', '−', '×', '÷', '^'];
    if (ops.includes(lastChar)) {
        expression = expression.slice(0, -1) + op;
    } else {
        expression += op;
    }
    updateDisplay();
}

function handleFunction(func) {
    if (shouldResetOnInput) {
        expression = '';
        shouldResetOnInput = false;
        resultDisplay.classList.remove('error-text');
    }

    switch (func) {
        case 'sin':
        case 'cos':
        case 'tan':
        case 'asin':
        case 'acos':
        case 'atan':
        case 'ln':
        case 'log':
        case 'abs':
            appendInput(`${func}(`);
            break;
        case 'sqrt':
            appendInput('√(');
            break;
        case 'cbrt':
            appendInput('∛(');
            break;
        case 'exp':
            appendInput('e^(');
            break;
        case 'tenpow':
            appendInput('10^(');
            break;
        case 'pow':
            appendOperator('^');
            break;
        case 'sqr':
            appendInput('^2');
            break;
        case 'cube':
            appendInput('^3');
            break;
        case 'fact':
            appendInput('!');
            break;
        case 'recip': {
            const hasOperand = /[\d\)\%πe\w]$/.test(expression.trim());
            if (hasOperand) {
                appendInput('^(-1)');
            } else {
                appendInput('1/(');
            }
            break;
        }
        default:
            appendInput(`${func}(`);
            break;
    }

    if (is2nd) {
        toggle2nd();
    }
}

function toggleNegate() {
    if (shouldResetOnInput) {
        shouldResetOnInput = false;
        expression = '(-' + lastAnswer + ')';
        updateDisplay();
        return;
    }

    if (expression === '') {
        expression = '−';
        updateDisplay();
        return;
    }

    // Regex to match trailing number or negative number
    const match = expression.match(/(\(-?\d+\.?\d*\)|\d+\.?\d*)$/);
    if (match) {
        const matched = match[0];
        const startIndex = match.index;
        if (matched.startsWith('(-') && matched.endsWith(')')) {
            // Remove (-...)
            const inner = matched.slice(2, -1);
            expression = expression.slice(0, startIndex) + inner;
        } else if (matched.startsWith('-')) {
            expression = expression.slice(0, startIndex) + matched.slice(1);
        } else {
            expression = expression.slice(0, startIndex) + `(-${matched})`;
        }
    } else {
        expression += '−';
    }
    updateDisplay();
}

function deleteLast() {
    if (shouldResetOnInput || resultDisplay.classList.contains('error-text')) {
        clearAll();
        return;
    }

    if (expression.length === 0) return;

    // Check if expression ends with known multi-character functions
    const multiChars = ['sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan(', '10^(', 'e^(', '√(', '∛(', 'ln(', 'log(', 'abs(', 'Ans', '^(-1)'];
    let removed = false;

    for (const token of multiChars) {
        if (expression.endsWith(token)) {
            expression = expression.slice(0, -token.length);
            removed = true;
            break;
        }
    }

    if (!removed) {
        expression = expression.slice(0, -1);
    }

    updateDisplay();
}

function clearAll() {
    expression = '';
    shouldResetOnInput = false;
    resultDisplay.classList.remove('error-text');
    resultDisplay.textContent = '0';
    updateDisplay();
}

// -------------------------------------------------------------
// Memory Controls
// -------------------------------------------------------------
function handleMemory(action) {
    switch (action) {
        case 'MC':
            memoryValue = 0;
            badgeMem.classList.remove('active');
            break;
        case 'MR':
            if (memoryValue !== 0) {
                appendInput(memoryValue < 0 ? `(${memoryValue})` : memoryValue.toString());
            }
            break;
        case 'M+': {
            const currentVal = calculateCurrentValue();
            if (currentVal !== null) {
                memoryValue += currentVal;
                badgeMem.classList.add('active');
            }
            break;
        }
        case 'M-': {
            const currentVal = calculateCurrentValue();
            if (currentVal !== null) {
                memoryValue -= currentVal;
                badgeMem.classList.add('active');
            }
            break;
        }
        case 'Ans':
            appendInput('Ans');
            break;
    }
}

function calculateCurrentValue() {
    if (expression.trim() === '') {
        return lastAnswer;
    }
    try {
        const val = evaluateExpression(expression, angleMode, lastAnswer);
        return val;
    } catch {
        return null;
    }
}

// -------------------------------------------------------------
// Calculation
// -------------------------------------------------------------
function calculate() {
    if (expression.trim() === '') return;

    try {
        const result = evaluateExpression(expression, angleMode, lastAnswer);
        lastAnswer = result;
        showResult(result);
        shouldResetOnInput = true;
    } catch (err) {
        showResult(err.message || 'Error', true);
        shouldResetOnInput = true;
    }
}

// -------------------------------------------------------------
// Math Parser & Evaluator Engine
// -------------------------------------------------------------
function evaluateExpression(exprStr, mode, ans) {
    // 1. Symbol Replacement
    let s = exprStr
        .replace(/\s+/g, '')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/Ans/g, `(${ans})`)
        .replace(/π/g, `(${Math.PI})`)
        .replace(/e(?![a-z0-9_])/g, `(${Math.E})`)
        .replace(/√\(/g, 'sqrt(')
        .replace(/∛\(/g, 'cbrt(');

    // Trim trailing operators or decimal points if user pressed = prematurely (e.g. "5 + " or "3.")
    s = s.replace(/[\+\-\*\/\^\.]+$/, '');

    // 2. Auto-close parentheses if any unclosed
    let openCount = (s.match(/\(/g) || []).length;
    let closeCount = (s.match(/\)/g) || []).length;
    while (openCount > closeCount) {
        s += ')';
        closeCount++;
    }

    if (!s) return 0;

    // 3. Tokenize
    const tokens = tokenize(s);

    // 4. Recursive Descent Parsing
    const parser = new Parser(tokens, mode);
    return parser.parse();
}

function tokenize(str) {
    const tokens = [];
    let i = 0;

    const isDigit = c => c >= '0' && c <= '9';
    const isAlpha = c => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');

    while (i < str.length) {
        const char = str[i];

        // Number
        if (isDigit(char) || (char === '.' && isDigit(str[i + 1]))) {
            let numStr = '';
            while (i < str.length && (isDigit(str[i]) || str[i] === '.')) {
                numStr += str[i++];
            }

            // Insert implicit multiplication if needed
            insertImplicitMultiplyIfNeeded(tokens);
            tokens.push({ type: 'NUM', value: parseFloat(numStr) });
            continue;
        }

        // Functions / Identifiers
        if (isAlpha(char)) {
            let ident = '';
            while (i < str.length && isAlpha(str[i])) {
                ident += str[i++];
            }

            insertImplicitMultiplyIfNeeded(tokens);
            tokens.push({ type: 'FUNC', value: ident.toLowerCase() });
            continue;
        }

        // Parentheses & Operators
        if (char === '(') {
            insertImplicitMultiplyIfNeeded(tokens);
            tokens.push({ type: 'LPAREN', value: '(' });
            i++;
        } else if (char === ')') {
            tokens.push({ type: 'RPAREN', value: ')' });
            i++;
        } else if (char === '!') {
            tokens.push({ type: 'POSTFIX', value: '!' });
            i++;
        } else if (char === '%') {
            tokens.push({ type: 'POSTFIX', value: '%' });
            i++;
        } else if (['+', '-', '*', '/', '^'].includes(char)) {
            tokens.push({ type: 'OP', value: char });
            i++;
        } else {
            throw new Error(`Unknown symbol: ${char}`);
        }
    }

    return tokens;
}

function insertImplicitMultiplyIfNeeded(tokens) {
    if (tokens.length === 0) return;
    const last = tokens[tokens.length - 1];
    if (last.type === 'NUM' || last.type === 'RPAREN' || last.type === 'POSTFIX') {
        tokens.push({ type: 'OP', value: '*' });
    }
}

class Parser {
    constructor(tokens, angleMode) {
        this.tokens = tokens;
        this.pos = 0;
        this.angleMode = angleMode;
    }

    peek() {
        return this.tokens[this.pos];
    }

    consume() {
        return this.tokens[this.pos++];
    }

    parse() {
        if (this.tokens.length === 0) return 0;
        const res = this.expr();
        if (this.pos < this.tokens.length) {
            throw new Error('Invalid syntax');
        }
        return res;
    }

    // expr = term ( ('+' | '-') term )*
    expr() {
        let left = this.term();
        while (this.pos < this.tokens.length) {
            const tok = this.peek();
            if (tok.type === 'OP' && (tok.value === '+' || tok.value === '-')) {
                this.consume();
                const right = this.term();
                left = (tok.value === '+') ? left + right : left - right;
            } else {
                break;
            }
        }
        return left;
    }

    // term = unary ( ('*' | '/') unary )*
    term() {
        let left = this.unary();
        while (this.pos < this.tokens.length) {
            const tok = this.peek();
            if (tok.type === 'OP' && (tok.value === '*' || tok.value === '/')) {
                this.consume();
                const right = this.unary();
                if (tok.value === '*') {
                    left = left * right;
                } else {
                    if (right === 0) throw new Error('Cannot divide by 0');
                    left = left / right;
                }
            } else {
                break;
            }
        }
        return left;
    }

    // unary = ('+' | '-') unary | power
    unary() {
        if (this.pos < this.tokens.length && this.peek().type === 'OP') {
            const tok = this.peek();
            if (tok.value === '+') {
                this.consume();
                return this.unary();
            } else if (tok.value === '-') {
                this.consume();
                return -this.unary();
            }
        }
        return this.power();
    }

    // power = postfix ( '^' unary )?  (Right-associative / supports negative exponents like 2^-3)
    power() {
        let base = this.postfix();
        if (this.pos < this.tokens.length && this.peek().type === 'OP' && this.peek().value === '^') {
            this.consume();
            const exponent = this.unary();
            base = Math.pow(base, exponent);
        }
        return base;
    }

    // postfix = primary ( '!' | '%' )*
    postfix() {
        let val = this.primary();
        while (this.pos < this.tokens.length) {
            const tok = this.peek();
            if (tok.type === 'POSTFIX') {
                this.consume();
                if (tok.value === '!') {
                    if (val < 0 || !Number.isInteger(val)) {
                        throw new Error('Invalid Input (n!)');
                    }
                    if (val > 170) throw new Error('Overflow (n > 170)');
                    let fact = 1;
                    for (let i = 2; i <= val; i++) fact *= i;
                    val = fact;
                } else if (tok.value === '%') {
                    val = val / 100;
                }
            } else {
                break;
            }
        }
        return val;
    }

    // primary = NUM | '(' expr ')' | FUNC '(' expr ')'
    primary() {
        if (this.pos >= this.tokens.length) {
            throw new Error('Unexpected end of expression');
        }
        const tok = this.consume();

        if (tok.type === 'NUM') {
            return tok.value;
        }

        if (tok.type === 'LPAREN') {
            const val = this.expr();
            if (this.pos >= this.tokens.length || this.peek().type !== 'RPAREN') {
                throw new Error('Missing )');
            }
            this.consume(); // consume ')'
            return val;
        }

        if (tok.type === 'FUNC') {
            if (this.pos >= this.tokens.length || this.peek().type !== 'LPAREN') {
                throw new Error(`Missing ( after ${tok.value}`);
            }
            this.consume(); // consume '('
            const arg = this.expr();
            if (this.pos >= this.tokens.length || this.peek().type !== 'RPAREN') {
                throw new Error(`Missing ) for ${tok.value}`);
            }
            this.consume(); // consume ')'
            return this.applyFunction(tok.value, arg);
        }

        throw new Error('Invalid syntax');
    }

    applyFunction(name, arg) {
        const isDeg = (this.angleMode === 'DEG');
        const toRad = deg => (deg * Math.PI) / 180;
        const toDeg = rad => (rad * 180) / Math.PI;

        switch (name) {
            case 'sin': {
                if (isDeg) {
                    let norm = ((arg % 360) + 360) % 360;
                    if (norm === 0 || norm === 180 || norm === 360) return 0;
                    if (norm === 90) return 1;
                    if (norm === 270) return -1;
                    return Math.sin(toRad(arg));
                }
                return Math.sin(arg);
            }
            case 'cos': {
                if (isDeg) {
                    let norm = ((arg % 360) + 360) % 360;
                    if (norm === 90 || norm === 270) return 0;
                    if (norm === 0 || norm === 360) return 1;
                    if (norm === 180) return -1;
                    return Math.cos(toRad(arg));
                }
                return Math.cos(arg);
            }
            case 'tan': {
                if (isDeg) {
                    let norm = ((arg % 180) + 180) % 180;
                    if (Math.abs(norm - 90) < 1e-9) throw new Error('Undefined');
                    if (norm === 0) return 0;
                    return Math.tan(toRad(arg));
                } else {
                    if (Math.abs(Math.cos(arg)) < 1e-15) throw new Error('Undefined');
                    return Math.tan(arg);
                }
            }
            case 'asin': {
                if (arg < -1 || arg > 1) throw new Error('Domain Error');
                const rad = Math.asin(arg);
                return isDeg ? toDeg(rad) : rad;
            }
            case 'acos': {
                if (arg < -1 || arg > 1) throw new Error('Domain Error');
                const rad = Math.acos(arg);
                return isDeg ? toDeg(rad) : rad;
            }
            case 'atan': {
                const rad = Math.atan(arg);
                return isDeg ? toDeg(rad) : rad;
            }
            case 'sqrt': {
                if (arg < 0) throw new Error('Domain Error');
                return Math.sqrt(arg);
            }
            case 'cbrt':
                return Math.cbrt(arg);
            case 'ln': {
                if (arg <= 0) throw new Error('Domain Error');
                return Math.log(arg);
            }
            case 'log': {
                if (arg <= 0) throw new Error('Domain Error');
                return Math.log10(arg);
            }
            case 'abs':
                return Math.abs(arg);
            default:
                throw new Error(`Unknown function ${name}`);
        }
    }
}

// -------------------------------------------------------------
// Event Listeners
// -------------------------------------------------------------

// Numbers
document.querySelectorAll('button[data-num]').forEach(btn => {
    btn.addEventListener('click', () => appendInput(btn.getAttribute('data-num')));
});

// Direct Inserts (Parentheses, constants, percent)
document.querySelectorAll('button[data-insert]').forEach(btn => {
    btn.addEventListener('click', () => appendInput(btn.getAttribute('data-insert')));
});

// Arithmetic Operators
document.querySelectorAll('button[data-op]').forEach(btn => {
    btn.addEventListener('click', () => appendOperator(btn.getAttribute('data-op')));
});

// Scientific Functions
funcButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const prim = btn.getAttribute('data-primary');
        const sec = btn.getAttribute('data-secondary');
        const activeFunc = is2nd ? sec : prim;
        handleFunction(activeFunc);
    });
});

// Negate (±)
if (btnNegate) {
    btnNegate.addEventListener('click', toggleNegate);
}

// Equals (=)
if (btnEquals) {
    btnEquals.addEventListener('click', calculate);
}

// Clear (AC) & Delete (DEL)
if (btnAc) {
    btnAc.addEventListener('click', clearAll);
}
if (btnDel) {
    btnDel.addEventListener('click', deleteLast);
}

// 2nd Function Toggle
if (btn2nd) {
    btn2nd.addEventListener('click', toggle2nd);
}

// Angle Mode Toggles
if (btnDeg) {
    btnDeg.addEventListener('click', () => setAngleMode('DEG'));
}
if (btnRad) {
    btnRad.addEventListener('click', () => setAngleMode('RAD'));
}

// Memory Buttons
document.querySelectorAll('button[data-mem]').forEach(btn => {
    btn.addEventListener('click', () => handleMemory(btn.getAttribute('data-mem')));
});

// Keyboard Support
window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendInput(e.key);
    } else if (e.key === '.') {
        appendInput('.');
    } else if (e.key === '+') {
        appendOperator('+');
    } else if (e.key === '-') {
        appendOperator('−');
    } else if (e.key === '*') {
        appendOperator('×');
    } else if (e.key === '/') {
        e.preventDefault();
        appendOperator('÷');
    } else if (e.key === '^') {
        appendOperator('^');
    } else if (e.key === '(' || e.key === ')') {
        appendInput(e.key);
    } else if (e.key === '!' || e.key === '%') {
        appendInput(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        deleteLast();
    } else if (e.key === 'Escape') {
        clearAll();
    } else if (e.key === 'd' || e.key === 'D') {
        setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG');
    } else if (e.key === 's') {
        handleFunction('sin');
    } else if (e.key === 'c') {
        handleFunction('cos');
    } else if (e.key === 't') {
        handleFunction('tan');
    } else if (e.key === 'p' || e.key === 'P') {
        appendInput('π');
    } else if (e.key === 'e' || e.key === 'E') {
        appendInput('e');
    }
});
