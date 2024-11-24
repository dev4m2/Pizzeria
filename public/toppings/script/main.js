const allToppings = 
    [
        {"style": "New York Style", "name": "xxx", "topping": "sauce", "description": "Marinara Sauce"}, 
        {"style": "New York Style", "name": "xxx", "topping": "mozzarella", "description": "Mozzarella Cheese<"}, 
        {"style": "New York Style", "name": "The Dr. John", "topping": "cup-n-char", "description": "Cup n' Char Pepperoni"},
        {"style": "New York Style", "name": "The Dr. John", "topping": "sausage", "description": "Ground Italian Sausage"},
        {"style": "New York Style", "name": "The Dr. John", "topping": "meatballs", "description": "Meatballs"},
        {"style": "New York Style", "name": "The Dr. John", "topping": "red-onion", "description": "thinly sliced Red Onion"},
        {"style": "New York Style", "name": "xxx", "topping": "xxx", "description": "yyy"}
    ];


const btnQuestion = document.querySelector('#btnQuestion');

// Reference the toppingsList element
let selectElement = document.querySelector('#toppingsList');

for (let i = 0; i < allToppings.length; i++) {
    // Create a new option element
    let newOption = document.createElement('option');

    // Set the value and text content of the new option
    newOption.value = allToppings[i].topping;
    newOption.textContent = allToppings[i].description;

    // Append the new option to the select element
    selectElement.appendChild(newOption);
}

