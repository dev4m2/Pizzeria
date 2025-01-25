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

// Global variable to store de-duped and sorted Pizza Styles
let sortedUniquePizzaStyles = null;

// Global variable to store de-duped and sorted Pizza Names filtered by Pizza Style
let sortedUniquePizzaNamesFilteredByPizzaStyle = null;

// Global variable to store de-duped and sorted Pizza Topping Categories
let sortedUniqueToppingCategories = null;

// Global variable to store de-duped and sorted Pizza Toppings
let sortedUniquePizzaToppings = null;

// Global variable to store de-duped and sorted Pizza Toppings filtered by Pizza Name
let sortedUniquePizzaToppingsFilteredByPizzaName = null;

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

        // Get Unique data (json, key)
        if (allToppings != null) {
            // Get unique and sorted pizza styles
            sortedUniquePizzaStyles = [...new Set(
                allToppings
                .map(item => item.style)
                .sort()
            )];
            
            // Get the unique Pizza Style
            // pizzaStyle = sortedUniquePizzaStyles[1]; // e.g. "New York Style"
            pizzaStyle = sortedUniquePizzaStyles[0]; // e.g. "Detroit Style"

            // Set innerText of Pizza Style element
            elementPizzaStyle.innerText = pizzaStyle;

            // Get unique and sorted Pizza Names filtered by Pizza Style
            sortedUniquePizzaNamesFilteredByPizzaStyle = [...new Set(
                allToppings
                .filter(item => item.style === pizzaStyle) // e.g. "Detroit Style"
                .map(item => item.name)
                .sort()
            )];
            
            // Get the unique Pizza Name
            // pizzaName = sortedUniquePizzaNamesFilteredByPizzaStyle[0]; // e.g. "Mt Lumi" ("New York Style")
            pizzaName = sortedUniquePizzaNamesFilteredByPizzaStyle[3]; // e.g. "The Meatball"
            
            // Set innerText of Pizza Name element
            elementPizzaName.innerText = pizzaName;

            // Get unique and sorted Pizza Toppings filtered by Pizza Name
            sortedUniquePizzaToppingsFilteredByPizzaName = [...new Set(
                allToppings
                .filter(item => item.name === pizzaName) // e.g. "The Meatball"
                .map(item => item.description)
                .sort()
            )];

            // Get unique and sorted Pizza Categories
            sortedUniqueToppingCategories = [...new Set(
                allToppings
                .map(item => item.category)
                .sort()
            )];

            // Get unique and sorted Pizza Toppings
            sortedUniquePizzaToppings = [...new Set(
                allToppings
                .map(item => item.description)
                .sort()
            )];

            // Create option elenents
            populateOptions(sortedUniquePizzaToppings);

            // Create ...
            populateToppingsByCategory(sortedUniqueToppingCategories, sortedUniquePizzaToppings);
        }

        // Disable button
        btnToppings.disabled = true;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function populateOptions(jsonArray) {
    // Loop through json array
    if (jsonArray != null) {
        for (let i = 0; i < jsonArray.length; i++) {
            // Create a new option element
            let newOption = document.createElement('option');
        
            // Set the value and text content of the new option
            newOption.value = jsonArray[i];
            newOption.textContent = jsonArray[i];
        
            // Append the new option to the select element
            elementSelect.appendChild(newOption);
        }
    }
}

function createVisualCategories(jsonArray) {
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

//function populateToppingsByCategory(jsonArray) {
function populateToppingsByCategory(categories, toppings) {
    // Loop through array
    if (categories != null) {
        //for (let countCat = 0; countCat < categories.length; countCat++) {
        for (const category of categories) {
            let sectionCategory = document.querySelector(`.${category}>fieldset`);

            //for (const topping of toppings) {
            for (let countTopping = 0; countTopping < toppings.length; countTopping++) {
                if (category === 'Cheese' && toppings[countTopping] === 'Piped Ricotta') {
                    // Create a new option element
                    let newOption = document.createElement('input');
                    
                    // Set the value and text content of the new option
                    newOption.type = "checkbox";
                    newOption.id = `chk${category}${countTopping}`;
                    newOption.name = toppings[countTopping];
                    newOption.value = 0;
                    
                    // Append the new option to the select element
                    sectionCategory.appendChild(newOption);
                }
            }
        }
    }
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
    sortedUniquePizzaToppingsFilteredByPizzaName.forEach(filteredTopping => {
        participantAnswerArray.find(item => item === filteredTopping ? identifiedToppingsCount++ : null)
    })

    // Did we select all of the appropriate toppings?
    identifiedToppingsCount === sortedUniquePizzaToppingsFilteredByPizzaName.length ? alert('Correct!') : alert('Try again... ☹')
}

// Attach event listener to button(s)
btnToppings.addEventListener('click', fetchJsonFile);

btnSubmit.addEventListener('click', submitAnswers);