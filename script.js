// Basic math operator functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error("Nice try! Division by zero is not allowed.");
  }
  return a / b;
}

function percentage(a, b) {
  return (a * b) / 100;
}

// Operate function to call the appropriate math function
function operate(operator, a, b) {
  a = parseFloat(a);
  b = parseFloat(b);
  
  switch(operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '×':
      return multiply(a, b);
    case '÷':
      return divide(a, b);
    case '%':
      return percentage(a, b);
    default:
      return null;
  }
}

// Calculator state
let firstNumber = null;
let secondNumber = null;
let currentOperator = null;
let shouldResetDisplay = false;
let displayHasDecimal = false;

// DOM elements
const display = document.querySelector('.display');
const errorMessage = document.querySelector('.error-message');
const digitButtons = document.querySelectorAll('.digit');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.querySelector('.equals');
const clearButton = document.querySelector('.clear');
const decimalButton = document.querySelector('.decimal');
const backspaceButton = document.querySelector('.backspace');

// Helper functions
function updateDisplay(value) {
  // Round long decimals to prevent overflow
  if (value.toString().includes('.') && value.toString().length > 12) {
    value = parseFloat(value.toFixed(8));
  }
  display.textContent = value;
}

function clearCalculator() {
  firstNumber = null;
  secondNumber = null;
  currentOperator = null;
  updateDisplay('0');
  errorMessage.textContent = '';
  shouldResetDisplay = false;
  displayHasDecimal = false;
}

function showError(message) {
  errorMessage.textContent = message;
  setTimeout(() => {
    errorMessage.textContent = '';
  }, 3000);
}

// Event listeners for digits
digitButtons.forEach(button => {
  button.addEventListener('click', () => {
    const digit = button.textContent;
    
    if (display.textContent === '0' || shouldResetDisplay) {
      updateDisplay(digit);
      shouldResetDisplay = false;
      displayHasDecimal = false;
    } else if (display.textContent.length < 12) {
      updateDisplay(display.textContent + digit);
    }
  });
});

// Event listener for decimal button
decimalButton.addEventListener('click', () => {
  if (shouldResetDisplay) {
    updateDisplay('0.');
    shouldResetDisplay = false;
    displayHasDecimal = true;
  } else if (!displayHasDecimal) {
    updateDisplay(display.textContent + '.');
    displayHasDecimal = true;
  }
});

// Event listeners for operators
operatorButtons.forEach(button => {
  button.addEventListener('click', () => {
    // If we already have a firstNumber and an operator, calculate the result first
    if (firstNumber !== null && currentOperator !== null && !shouldResetDisplay) {
      try {
        const result = operate(currentOperator, firstNumber, display.textContent);
        updateDisplay(result);
        firstNumber = result;
      } catch (error) {
        showError(error.message);
        clearCalculator();
        return;
      }
    } else if (firstNumber === null) {
      firstNumber = display.textContent;
    }
    
    currentOperator = button.textContent;
    shouldResetDisplay = true;
  });
});

// Event listener for equals button
equalsButton.addEventListener('click', () => {
  if (firstNumber === null || currentOperator === null) {
    return; // Do nothing if we don't have enough info
  }
  
  secondNumber = display.textContent;
  
  try {
    const result = operate(currentOperator, firstNumber, secondNumber);
    updateDisplay(result);
    
    // Reset for new calculation
    firstNumber = result;
    currentOperator = null;
    shouldResetDisplay = true;
  } catch (error) {
    showError(error.message);
    clearCalculator();
  }
});

// Event listener for clear button
clearButton.addEventListener('click', clearCalculator);

// Event listener for backspace button
backspaceButton.addEventListener('click', () => {
  if (shouldResetDisplay) return;
  
  const currentValue = display.textContent;
  if (currentValue.length === 1) {
    updateDisplay('0');
  } else {
    // Check if we're removing a decimal point
    if (currentValue[currentValue.length - 1] === '.') {
      displayHasDecimal = false;
    }
    updateDisplay(currentValue.slice(0, -1));
  }
});

// Keyboard support
document.addEventListener('keydown', (event) => {
  // Number keys
  if (/^[0-9]$/.test(event.key)) {
    const matchingButton = Array.from(digitButtons).find(button => button.textContent === event.key);
    if (matchingButton) matchingButton.click();
  }
  
  // Operator keys
  switch(event.key) {
    case '+':
      Array.from(operatorButtons).find(button => button.textContent === '+').click();
      break;
    case '-':
      Array.from(operatorButtons).find(button => button.textContent === '-').click();
      break;
    case '*':
    case 'x':
      Array.from(operatorButtons).find(button => button.textContent === '×').click();
      break;
    case '/':
      Array.from(operatorButtons).find(button => button.textContent === '÷').click();
      break;
    case '%':
      Array.from(operatorButtons).find(button => button.textContent === '%').click();
      break;
    case '=':
    case 'Enter':
      equalsButton.click();
      break;
    case 'Backspace':
      backspaceButton.click();
      break;
    case 'Delete':
    case 'Escape':
      clearButton.click();
      break;
    case '.':
      decimalButton.click();
      break;
  }
});

// Initialize calculator
clearCalculator();