// Reference the btnToppings element
const btnToppings = document.querySelector('#btnToppings');

// Pizza Style
const elementPizzaStyle = document.querySelector('#pizzaStyle');

// Pizza Name
const elementPizzaName = document.querySelector('#pizzaName');

// Reference the toppingsList element
const elementSelect = document.querySelector('#toppingsList');

// Global variable to store the fetched data
let allToppings = null;

// Global variable to store de-duped fetched data (based on Pizza Style)
let uniquePizzaStyles = null;

// Global variable to store de-duped fetched data (based on Pizza Name)
let uniquePizzaNames = null;

// Global variable to store Pizza Names (filtered by Pizza Type)
let filteredPizzasByStyle = null;

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
        console.log(allToppings);

        // Create option elenents
        populateOptions(allToppings);

        // Get Unique data (json, key)
        if (allToppings != null) {
            // Get unique pizza styles
            uniquePizzaStyles = removeDuplicates(allToppings, "style");
            
            // Get the unique Pizza Style
            pizzaStyle = uniquePizzaStyles[0].style;

            // Set innerText of Pizza Style element
            elementPizzaStyle.innerText = pizzaStyle;

            // Filter the list based on a condition
            filteredPizzasByStyle = allToppings.filter(pizza => pizza.style == pizzaStyle);

            // Get unique pizza names
            uniquePizzaNames = removeDuplicates(filteredPizzasByStyle, "name");
            
            // Get the unique Pizza Name
            pizzaName = uniquePizzaNames[1].name;

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

// Attach event listener to button
btnToppings.addEventListener('click', fetchJsonFile);
