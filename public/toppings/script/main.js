const allToppings = 
    [
        {"topping": "sauce", "description": "Marinara Sauce"}, 
        {"topping": "mozzarella", "description": "Mozzarella Cheese<"}, 
        {"topping": "cup-n-char", "description": "Cup n' Char Pepperoni"},
        {"topping": "sausage", "description": "Ground Italian Sausage"},
        {"topping": "meatballs", "description": "Meatballs"},
        {"topping": "red-onion", "description": "thinly sliced Red Onion"},
        {"topping": "xxx", "description": "yyy"}
    ];



// Reference the toppingsList element
// var selectElement = document.getElementById('toppingsList');
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

