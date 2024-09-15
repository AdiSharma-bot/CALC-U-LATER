// variables to store numbers and operators

let firstNumber = "";
let operator;
let secondNumber = "";
let result;

// HTML references

const buttons = document.querySelectorAll("button");
const calcBody = document.querySelector(".calc-body");
const headerDisplay = document.querySelector(".header-display");
const resultDisplay = document.querySelector(".result-display");
const equalsBtn = document.querySelector(".equal-to");
const clearBtn = document.querySelector(".clear");
const percentBtn = document.querySelector(".percent");

// variables to toggle the states

let isEvaluated = false;
let isSecondNumber = false;
let lastOperation = null;
let percentageApplied = false;


// function to adjust size if the calculations results or text content overflows
const adjustSize = () => {
  const maxSize = 3; 
  const minSize = 1.5;
  const textLength = resultDisplay.textContent.length;
  const headerTextLength = headerDisplay.textContent.length;


  // for result display
  if (textLength > 12 && textLength < 20) {
    resultDisplay.style.fontSize = `${Math.max(
      maxSize - (textLength - 12) * 0.3,
      minSize
    )}rem`;
  } else if (textLength >= 20) {
    resultDisplay.style.fontSize = `${minSize}rem`;
  } else {
    resultDisplay.style.fontSize = `${maxSize}rem`;
  }

  // for header display
  if (headerTextLength > 20) {
    headerDisplay.style.fontSize = `1rem`;
  } else {
    headerDisplay.style.fontSize = "1.4rem";
  }
};


// to add decimal
const decimalBtn = document.querySelector(".decimal");
decimalBtn.addEventListener("click", addDecimal);


buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const buttonText = button.textContent.trim(); // to trim extra whitespace after clicking backspace button as the button text content was "/n  "
    if (button.classList.contains("operator")) {
      handleOperator(buttonText); //to handle the subsequent calculation
      percentageApplied = false;
      isSecondNumber = true; // after selecting operator the next number will be stored in second number
      headerDisplay.textContent = `${firstNumber} ${operator}`;
    } else {
      const numbers = buttonText;
      if (!isNaN(numbers)) {
        handleNumber(buttonText);
      }
    }
  });
  adjustSize();
});

equalsBtn.addEventListener("click", () => {
  // If an operation has already been evaluated and there's a last operation stored
  if (isEvaluated && lastOperation) {
    firstNumber = result.toString(); // Use the last result as the new first number
    secondNumber = lastOperation.secondNumber; // Repeat with the last second number
    operator = lastOperation.operator; // Use the last operator
  }

  operate(); // Perform the operation
  isEvaluated = true;
  adjustSize();
});
percentBtn.addEventListener("click", percent);

clearBtn.addEventListener("click", () => {
  resetCalculator();
});

function addDecimal() {
  if (!isSecondNumber) {
    if (!firstNumber.includes(".")) {
      firstNumber += "."; 
      resultDisplay.textContent = firstNumber;
    }
  } else {
    if (!secondNumber.includes(".")) {
      secondNumber += ".";
      resultDisplay.textContent = secondNumber;
    }
  }
}

// function to round the results 
function formatResult(num) {
  const rounded = parseFloat(num.toFixed(6)); // this converts the number back to a number as toFixed returns a string after rounding the result
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toString(); //if the number is whole number then round and return it as a string  
}

// to add percentage feature
function percent() {
  let calculatedResult;
  if (isSecondNumber && secondNumber) { //  to calculate percentage of second number only
    // Handle percentages for other operations
    calculatedResult = (Number(firstNumber) * Number(secondNumber)) / 100;  // this formula is used in all typical calculators to calculate percentage for second number
    secondNumber = formatResult(calculatedResult); // to round the result
    resultDisplay.textContent = formattingWithComma(secondNumber);
    headerDisplay.textContent = `${firstNumber || ""} ${operator || ""} ${
      secondNumber || ""
    }`;
  } else {
    // Handle standalone percentage calculation for first number only
    calculatedResult = firstNumber / 100;
    firstNumber = formatResult(calculatedResult);
    resultDisplay.textContent = formattingWithComma(firstNumber);
    headerDisplay.textContent = firstNumber + "%";
  }
  adjustSize();

  percentageApplied = true;
}


function operate() {
  if (!firstNumber || !operator || !secondNumber) return;

  const a = parseFloat(firstNumber);
  const b = parseFloat(secondNumber);

  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "x":
      result = a * b;
      break;
    case "/":
      if (b === 0) {
        result = "LMAO";
        break;
      } else {
        result = a / b;
      }
      break;
    default:
      return;
  }

  if (result === "LMAO") {
    resultDisplay.textContent = "LMAO";
    headerDisplay.textContent = `${firstNumber} ${operator} ${secondNumber} =`
    return;
  }

  if (typeof result === "number") {
    result =
      operator === "/"
        ? parseFloat(result.toFixed(5))
        : parseFloat(result.toFixed(2));
  }

  lastOperation = { operator, secondNumber }; // an object to store the last operation and second number to be used in equals button operation

  // Display result and update state
  resultDisplay.textContent = formattingWithComma(result);
  headerDisplay.textContent = `${firstNumber} ${operator} ${secondNumber} =`;
  firstNumber = typeof result == "number" ? result.toString() : firstNumber; 
  operator = null; // Clear the operator
  secondNumber = ""; // Clear the second number
  adjustSize();
}

function resetCalculator() {
  isSecondNumber = false;
  percentageApplied = false;
  isEvaluated = false;
  lastOperation = null;
  firstNumber = "";
  secondNumber = "";
  operator = null;
  resultDisplay.style.fontSize = "3rem";
  headerDisplay.style.fontSize = "1.4rem";
  resultDisplay.textContent = "0";
  headerDisplay.textContent = "0";
}


// function to handle if the operator is clicked after typing all the numbers so that it may evaluate the first expression and then move on to the next mainly for subsequent calculations
function handleOperator(nextOperator) {

  if (!firstNumber) {
    firstNumber = "0"; // default 0 as first number
  }

  // If both numbers are present, evaluate the current expression
  if (firstNumber && operator && secondNumber) {
    operate(); // Perform the current operation
  }

  // Set the new operator after the current operation is evaluated
  operator = nextOperator;
  isSecondNumber = true; // We are now expecting the second number
  isEvaluated = false; // Reset evaluation status
  headerDisplay.textContent = `${firstNumber} ${operator}`; // Update the display
  adjustSize(); // Adjust text size if needed
}

function handleNumber(numbers) {
  // after equals button if a new number is typed then previous calculation is reset
  if (isEvaluated) {
    resetCalculator();
  } 
  // condition to add numbers to first number and second number with regard to their length
  if (!isSecondNumber) {
    if (firstNumber.length < 12) {
      firstNumber += numbers;
      resultDisplay.textContent = formattingWithComma(firstNumber);
    } else {
      alert("Uh uh! Not more than 12 digits!");
    }
  } else {
    if (secondNumber.length < 12) {
      secondNumber += numbers;
      resultDisplay.textContent = formattingWithComma(secondNumber);
    } else {
      alert("Uh uh! Not more than 12 digits");
    }
  }
}

const backspaceBtn = document.querySelector(".back-arrow");

backspaceBtn.addEventListener("click", () => {
  // Case 1: Handle backspace for the first number
  if (!isSecondNumber && firstNumber) {
    firstNumber = firstNumber.slice(0, -1); // Remove the last character of the first number
    resultDisplay.textContent = formattingWithComma(firstNumber || "0");
    headerDisplay.textContent = firstNumber || "0" // Display "0" if empty
  } 
  // Case 2: Handle backspace for the second number
  else if (isSecondNumber && secondNumber) {
    secondNumber = secondNumber.slice(0, -1); // Remove the last character of the second number
    resultDisplay.textContent = formattingWithComma(secondNumber || "0"); // Display "0" if empty
  } 
  // Case 3: Handle removing the operator
  else if (isSecondNumber && !secondNumber && operator) {
    operator = null; // Remove the operator
    isSecondNumber = false; // Switch back to handling the first number
    headerDisplay.textContent = `${firstNumber || "0"}`; // Update display to show only the first number
  } 
  // Case 4: After removing the operator, remove the last digit of the first number
  else if (!isSecondNumber && !operator && firstNumber) {
    firstNumber = firstNumber.slice(0, -1); // Remove the last digit of the first number
    headerDisplay.textContent = formattingWithComma(firstNumber || "0"); // Display "0" if empty
  }

  adjustSize(); // Adjust the display size if necessary
});


// function to add commas
function formattingWithComma(number) {
  if (number === "") return "0"; // Only return "0" for an empty string
  const num = parseFloat(number);
  return !isNaN(num) ? num.toLocaleString("en-US") : "0"; // Return formatted number if valid
}


document.addEventListener("keydown", (event) => {
  const key = event.key;
  
  switch (key) {
    case "Enter":
      // Trigger the equals button click
      equalsBtn.click();
      break;
    case "Backspace":
      // Trigger the backspace button click
      backspaceBtn.click();
      break;
    case "Escape":
      // Trigger the clear button click
      clearBtn.click();
      break;
    case ".":
      // Trigger the decimal button click
      decimalBtn.click();
      break;
    case "+":
    case "-":
    case "*":
    case "/":
      // Map operator keys to handleOperator function
      handleOperator(convertOperator(key));
      break;
    default:
      if (key >= "0" && key <= "9") {
        // Map number keys to handleNumber function
        handleNumber(key);
      }
      break;
  }
});

function convertOperator(key) {
  switch (key) {
    case "+":
      return "+";
    case "-":
      return "-";
    case "*":
      return "x"; // Use the x operator 
    case "/":
      return "/";
    default:
      return null;
  }
}