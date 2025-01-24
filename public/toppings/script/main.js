// Reference the btnToppings element
const btnToppings = document.querySelector('#btnToppings');

// Reference the btnSubmit element
const btnSubmit = document.querySelector('#btnSubmit');

// Pizza Style
const elementPizzaStyle = document.querySelector('#pizzaStyle');

// Pizza Name
const elementPizzaName = document.querySelector('#pizzaName');

// Reference the toppingsList element
const elementSelect = document.querySelector('#toppingsList');

// Global variable to store the fetched data
let allToppings = null;

// Global variable to store user-selected Toppings
let participantAnswerArray = [];

// Global variable to store de-duped Pizza Styles
let uniquePizzaStyles = null;

// Global variable to store de-duped Pizza Names
let uniquePizzaNames = null;

// Global variable to store de-duped Pizza Toppings
let uniqueToppings = null;

// Global variable to store de-duped and sorted Pizza Toppings
let sortedUniqueToppings = null;

// Global variable to store Toppings by Pizza Style
let filteredToppingsByPizzaStyle = null;

// Global variable to store Toppings by Pizza Name
let filteredToppingsByPizzaName = null;

// Style of Pizza
let pizzaStyle = elementPizzaStyle.innerText;

// Name of Pizza
let pizzaName = elementPizzaName.innerText;

// Function to fetch the JSON file and read its contents
async function fetchJsonFile() {
    try {
        // Fetch the JSON file
        let response = await fetch('data/toppings.json');
        
        // Check if the response is ok
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        // Parse the JSON content
        let data = await response.json();

        // Assign the data to the global variable 
        allToppings = data;

        // Log the JSON object to the console
        // console.log(allToppings);

        // Get unique pizza toppings
        uniqueToppings = removeDuplicates(allToppings, "description");

        // Copy array (safely copies deeply nested objects/arrays)
        sortedUniqueToppings = JSON.parse(JSON.stringify(uniqueToppings))

        // Sort array of pizzas by description
        sortedUniqueToppings.sort((a, b) => {
            if (a.description < b.description) {
              return -1;
            }
            if (a.description > b.description) {
              return 1;
            }
            return 0;
        });

        // Create option elenents
        populateOptions(sortedUniqueToppings);

        // Get Unique data (json, key)
        if (allToppings != null) {
            // Get unique pizza styles
            uniquePizzaStyles = removeDuplicates(allToppings, "style");
            
            // Get the unique Pizza Style
            // pizzaStyle = uniquePizzaStyles[0].style; // New York Style
            pizzaStyle = uniquePizzaStyles[2].style; // Detroit Style

            // Set innerText of Pizza Style element
            elementPizzaStyle.innerText = pizzaStyle;

            // Get pizza toppings based on style of pizza
            filteredToppingsByPizzaStyle = allToppings.filter(pizza => pizza.style == pizzaStyle);
            
            // Get unique pizza names
            uniquePizzaNames = removeDuplicates(filteredToppingsByPizzaStyle, "name");
            
            // Get the unique Pizza Name
            // pizzaName = uniquePizzaNames[7].name; // Mt Lumi
            pizzaName = uniquePizzaNames[4].name; // The Meatball
            
            // Get pizza toppings based on name of pizza
            filteredToppingsByPizzaName = allToppings.filter(pizza => pizza.name == pizzaName);

            // Set innerText of Pizza Name element
            elementPizzaName.innerText = pizzaName;
        }

        // Disable button
        btnToppings.disabled = true;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function populateOptions(jsonArray) {
    // Loop through json objects
    if (jsonArray != null) {
        for (let i = 0; i < jsonArray.length; i++) {
            // Create a new option element
            let newOption = document.createElement('option');
        
            // Set the value and text content of the new option
            newOption.value = jsonArray[i].topping;
            newOption.textContent = jsonArray[i].description;
        
            // Append the new option to the select element
            elementSelect.appendChild(newOption);
        }
    }
}

function removeDuplicates(data, key) {
    const seen = new Set();
    return data.filter(item => {
        const value = item[key];
        if (!seen.has(value)) {
            seen.add(value);
            return true;
        }
        return false;
    });
}

function submitAnswers() {
    // Clear counter
    let identifiedToppingsCount = 0;

    // Clear array
    participantAnswerArray.length = 0;

    // Get items selected in toppings list
    let selectedAnswers = elementSelect.selectedOptions;

    // Add toppings to array of participant answers
    for (let i = 0; i < selectedAnswers.length; i++) {
        participantAnswerArray.push(selectedAnswers[i].innerText);
    }

    // Compare toppings selected with actual pizza
    filteredToppingsByPizzaName.forEach(filteredTopping => {
        participantAnswerArray.find(item => item === filteredTopping['description'] ? identifiedToppingsCount++ : null)
    })

    // Did we select all of the appropriate toppings?
    // identifiedToppingsCount === filteredToppingsByPizzaName.length ? console.log('Correct!') : console.log('Try again... ☹')
    identifiedToppingsCount === filteredToppingsByPizzaName.length ? alert('Correct!') : alert('Try again... ☹')
}

// Attach event listener to button(s)
btnToppings.addEventListener('click', fetchJsonFile);

btnSubmit.addEventListener('click', submitAnswers);