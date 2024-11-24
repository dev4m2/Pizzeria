// const allToppings = 
//     [
//         {"style": "New York Style", "name": "xxx", "topping": "sauce", "description": "Marinara Sauce"}, 
//         {"style": "New York Style", "name": "xxx", "topping": "mozzarella", "description": "Mozzarella Cheese<"}, 
//         {"style": "New York Style", "name": "The Dr. John", "topping": "cup-n-char", "description": "Cup n' Char Pepperoni"},
//         {"style": "New York Style", "name": "The Dr. John", "topping": "sausage", "description": "Ground Italian Sausage"},
//         {"style": "New York Style", "name": "The Dr. John", "topping": "meatballs", "description": "Meatballs"},
//         {"style": "New York Style", "name": "The Dr. John", "topping": "red-onion", "description": "thinly sliced Red Onion"},
//         {"style": "New York Style", "name": "xxx", "topping": "xxx", "description": "yyy"}
//     ];



// Reference the btnToppings element
const btnToppings = document.querySelector('#btnToppings');

// Reference the toppingsList element
const selectElement = document.querySelector('#toppingsList');

// Global variable to store the fetched data
let allToppings = null;

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

        // Loop through json objects
        if (allToppings != null) {
            for (let i = 0; i < allToppings.length; i++) {
                // Create a new option element
                let newOption = document.createElement('option');
            
                // Set the value and text content of the new option
                newOption.value = allToppings[i].topping;
                newOption.textContent = allToppings[i].description;
            
                // Append the new option to the select element
                selectElement.appendChild(newOption);
            }
        }
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Attach event listener to button
btnToppings.addEventListener('click', fetchJsonFile)
