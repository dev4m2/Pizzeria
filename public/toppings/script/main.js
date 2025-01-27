// Reference the btnToppings element
const btnToppings = document.querySelector('#btnToppings');

// Reference the btnSubmitResponse element
const btnSubmitResponse = document.querySelector('#btnSubmitResponse');

// Reference the btnClearResponse element
const btnClearResponse = document.querySelector('#btnClearResponse');

// Reference the btnRevealAnswers element
const btnRevealAnswers = document.querySelector('#btnRevealAnswers');

// Reference the btnHideAnswers element
const btnHideAnswers = document.querySelector('#btnHideAnswers');

// Global variable to store the fetched data
let allToppings = null;

// Global variable to store user-selected Toppings
let participantAnswerArray = [];

// Global variable to store de-duped and sorted Pizza Styles
let sortedUniquePizzaStyles = null;

// Global variable to store de-duped and sorted Pizza Topping Categories
let sortedUniquePizzaToppingCategories = null;

// Global variable to store de-duped and sorted Pizza Toppings
let sortedUniquePizzaToppings = null;

// Global variable to store de-duped and sorted Pizza Names filtered by Pizza Style
let sortedUniquePizzaNamesFilteredByPizzaStyle = null;

// Global variable to store de-duped and sorted Pizza Toppings filtered by Pizza Name
let sortedUniquePizzaToppingsFilteredByPizzaName = null;

// Style of Pizza
let pizzaStyle = '';

// Name of Pizza
let pizzaName = '';

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

        // Copy data values (not reference) to global array of objects
        allToppings = JSON.parse(JSON.stringify(data));

        // Disable button
        btnToppings.disabled = true;

        // Process the returned data
        processApiData(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function processApiData () {
    // Get data
    if (allToppings != null) {
        // Get unique and sorted pizza styles
        sortedUniquePizzaStyles = [...new Set(
            allToppings
            .map(item => item.style)
            .sort()
        )];

        // Get unique and sorted Pizza Topping Categories
        sortedUniquePizzaToppingCategories = [...new Set(
            allToppings
            .sort((a, b) => a.categoryIndex - b.categoryIndex)
            .map(item => item.category)
            // .sort()
        )];

        // Get unique and sorted Pizza Toppings
        sortedUniquePizzaToppings = [...new Set(
            allToppings
            .map(item => item.description)
            .sort()
        )];

        // Create "styles" container and option elements
        createElementsForPizzaStyles(sortedUniquePizzaStyles);
    }
}

function createElementsForPizzaStyles(styles) {
    // Loop through array
    if (styles != null) {
        // Reference the styles element
        let sectionStyles = document.querySelector('#pizzaStyles');

        // Create a new fieldset element
        let newFieldset = document.createElement('fieldset');

        // Create a new legend element
        let newLegend = document.createElement('legend');

        // Set the text of the new legend
        newLegend.textContent = "Pizza Style";

        // Append the new legend to the parent element
        newFieldset.appendChild(newLegend);

        // Append the new fieldset to the parent element
        sectionStyles.appendChild(newFieldset);

        // Reference the fieldset as direct descendant of the section (category) element
        let sectionStyle = document.querySelector(`#pizzaStyles>fieldset`);

        for (const style of styles) {
            // Create a new div element
            let newDiv = document.createElement('div');

            // Create a new option element
            let newOption = document.createElement('input');

            // Create a new option label
            let newLabel = document.createElement('label');

            // Set the class of the new div
            newDiv.className = "option";

            // Set the name and value of the new option
            newOption.type = "radio";
            newOption.id = style;
            newOption.name = "pizzaStyles";
            newOption.value = style;

            // Set the "for" value and text content of the new label
            newLabel.htmlFor = newOption.id;
            newLabel.textContent = style;

            // Append the new option and label to the parent element
            newDiv.appendChild(newOption);
            newDiv.appendChild(newLabel);

            // Append the new div to the parent element
            sectionStyle.appendChild(newDiv);
        }

        document.querySelectorAll('input[name="pizzaStyles"]').forEach(radio => {
            radio.addEventListener('click', function() {
                // Set global variable
                pizzaStyle = this.value;

                // Call event handler
                clickPizzaStylesRadioButton(pizzaStyle);
            });
        });
    }
}

function createElementsForPizzaNames(names) {
    // Remove all child nodes
    removeAllChildrenOfType('pizzaCategories', 'section');

    // Remove all child nodes
    removeAllChildrenOfType('pizzaNames', 'fieldset');

    // Loop through array
    if (names != null) {
        // Reference the names element
        let sectionNames = document.querySelector('#pizzaNames');

        // Create a new fieldset element
        let newFieldset = document.createElement('fieldset');

        // Create a new legend element
        let newLegend = document.createElement('legend');

        // Set the text of the new legend
        newLegend.textContent = "Pizza Name";

        // Append the new legend to the parent element
        newFieldset.appendChild(newLegend);

        // Append the new fieldset to the parent element
        sectionNames.appendChild(newFieldset);

        // Reference the fieldset as direct descendant of the section (name) element
        let sectionName = document.querySelector(`#pizzaNames>fieldset`);

        for (const name of names) {
            // Create a new div element
            let newDiv = document.createElement('div');

            // Create a new option element
            let newOption = document.createElement('input');

            // Create a new option label
            let newLabel = document.createElement('label');

            // Set the class of the new div
            newDiv.className = "option";

            // Set the name and value of the new option
            newOption.type = "radio";
            newOption.id = name;
            newOption.name = "pizzaNames";
            newOption.value = name;

            // Set the "for" value and text content of the new label
            newLabel.htmlFor = newOption.id;
            newLabel.textContent = name;

            // Append the new option and label to the parent element
            newDiv.appendChild(newOption);
            newDiv.appendChild(newLabel);

            // Append the new div to the parent element
            sectionName.appendChild(newDiv);
        }

        document.querySelectorAll('input[name="pizzaNames"]').forEach(radio => {
            radio.addEventListener('click', function() {
                // Set global variable
                pizzaName = this.value;

                // Call event handler
                clickPizzaNamesRadioButton(pizzaName);
            });
        });
    }
}

function constructPizzaCategoriesAndToppings(name) {
    if (allToppings != null) {
        // Get unique and sorted Pizza Toppings filtered by Pizza Name
        sortedUniquePizzaToppingsFilteredByPizzaName = [...new Set(
            allToppings
            .filter(item => item.name === name) // e.g. "The Meatball"
            .map(item => item.description)
            .sort()
        )];

        // Create Pizza Topping "categories" container elements
        createElementsForPizzaCategories(sortedUniquePizzaToppingCategories);

        //Loop thru Pizza Topping Categories
        if (sortedUniquePizzaToppingCategories != null) {
            for (const category of sortedUniquePizzaToppingCategories) {
                // Get unique and sorted Pizza Toppings filtered by Category
                let sortedUniquePizzaToppingsFilteredByCategory = [...new Set(
                    allToppings
                    .filter(item => item.category === category) // e.g. "Cheese"
                    .map(item => item.description)
                    .sort()
                )];

                // Create "toppings" checkbox elements
                createElementsForPizzaToppingsByCategories(category, sortedUniquePizzaToppingsFilteredByCategory)
            }
        }
    }
}

function createElementsForPizzaCategories(categories) {
    // Remove all child nodes
    removeAllChildrenOfType('pizzaCategories', 'section');

    // Loop through array
    if (categories != null) {
        // Reference the categories element
        let sectionCategories = document.querySelector('#pizzaCategories');

        for (const category of categories) {
            // Create a new section element
            let newSection = document.createElement('section');

            // Create a new fieldset element
            let newFieldset = document.createElement('fieldset');

            // Create a new legend element
            let newLegend = document.createElement('legend');

            // Set the class of the new section
            newSection.className = category;

            // Set the text of the new legend
            newLegend.textContent = category;

            // Append the new legend to the parent element
            newFieldset.appendChild(newLegend);

            // Append the new fieldset to the parent element
            newSection.appendChild(newFieldset);

            // Append the new section to the parent element
            sectionCategories.appendChild(newSection);
        }
    }
}

function createElementsForPizzaToppingsByCategories(category, toppings) {
    // Loop through array
    if (toppings != null) {
        // Reference the fieldset as direct descendant of the section (category) element
        let sectionCategory = document.querySelector(`.${category}>fieldset`);

        for (let countTopping = 0; countTopping < toppings.length; countTopping++) {
            // Create a new div element
            let newDiv = document.createElement('div');

            // Create a new option element
            let newOption = document.createElement('input');

            // Create a new option label
            let newLabel = document.createElement('label');

            // Set the class of the new div
            newDiv.className = "option";
            
            // Set the name and value of the new option
            newOption.type = "checkbox";
            newOption.id = `chk${category}${countTopping}`;
            newOption.name = category;
            newOption.value = toppings[countTopping];
            
            // Set the "for" value and text content of the new label
            newLabel.htmlFor = newOption.id;
            newLabel.textContent = toppings[countTopping];

            // Append the new option and label to the parent element
            newDiv.appendChild(newOption);
            newDiv.appendChild(newLabel);

            // Append the new div to the parent element
            sectionCategory.appendChild(newDiv);
        }
    }
}

function clickPizzaStylesRadioButton(style) {
    console.log("Selected pizza style:", style);
    
    if (allToppings != null) {
        // Get unique and sorted Pizza Names filtered by Pizza Style
        sortedUniquePizzaNamesFilteredByPizzaStyle = [...new Set(
            allToppings
            .filter(item => item.style === style) // e.g. "Detroit Style"
            .map(item => item.name)
            .sort()
        )];
        
        createElementsForPizzaNames(sortedUniquePizzaNamesFilteredByPizzaStyle);
    }
}

function clickPizzaNamesRadioButton(name) {
    console.log("Selected pizza name:", name);
    
    if (allToppings != null) {
        constructPizzaCategoriesAndToppings(name);
    }
}

function removeAllChildrenOfType(parentId, childType) {
    let parentElement = document.getElementById(parentId);
    let children = parentElement.getElementsByTagName(childType);

    // Convert HTMLCollection to an array to avoid issues with dynamic changes
    let childrenArray = Array.from(children);

    childrenArray.forEach(child => {
        parentElement.removeChild(child);
    });
} 

function submitResponse() {
    // Get data
    if (allToppings != null) {
        // Clear counter
        let identifiedToppingsCount = 0;

        // Clear array
        participantAnswerArray.length = 0;

        // Get all checkboxes on the page
        const checkboxes = document.querySelectorAll('#pizzaCategories input[type="checkbox"]');

        // Filter checked checkboxes
        const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);

        checkedCheckboxes.forEach(checkbox => {
            participantAnswerArray.push(checkbox.value);
        });

        console.log(participantAnswerArray);

        // Compare toppings selected with actual pizza
        sortedUniquePizzaToppingsFilteredByPizzaName.forEach(filteredTopping => {
            participantAnswerArray.find(item => item === filteredTopping ? identifiedToppingsCount++ : null);
        })

        // // Did we select all of the appropriate toppings?
        participantAnswerArray.length === identifiedToppingsCount && identifiedToppingsCount === sortedUniquePizzaToppingsFilteredByPizzaName.length ? alert('Correct!') : alert('Try again... ☹')
    }
}

function clearResponse() {
    // Get all checkboxes on the page
    const checkboxes = document.querySelectorAll('#pizzaCategories input[type="checkbox"]');

    // Filter checked checkboxes
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);

    checkedCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

function revealAnswers() {
    // Get data
    if (allToppings != null) {
        // Get all checkboxes on the page
        const checkboxes = document.querySelectorAll('#pizzaCategories input[type="checkbox"]');

        // Get all labels on the page
        const labels = document.querySelectorAll('#pizzaCategories label');

        // Compare toppings selected with actual pizza
        sortedUniquePizzaToppingsFilteredByPizzaName.forEach(filteredTopping => {
            // checkboxes.forEach(checkbox => {
            //     checkbox.value === filteredTopping ? checkbox.checked = true : null;
            // });

            labels.forEach(label => {
                label.textContent === filteredTopping ? label.style.backgroundColor = "cyan" : null;
            });
        })
    }
}

function hideAnswers() {
    // Get data
    if (allToppings != null) {
        // Get all checkboxes on the page
        const checkboxes = document.querySelectorAll('#pizzaCategories input[type="checkbox"]');

        // Get all labels on the page
        const labels = document.querySelectorAll('#pizzaCategories label');

        // Compare toppings selected with actual pizza
        sortedUniquePizzaToppingsFilteredByPizzaName.forEach(filteredTopping => {
            // checkboxes.forEach(checkbox => {
            //     checkbox.value === filteredTopping ? checkbox.checked = false : null;
            // });

            labels.forEach(label => {
                label.textContent === filteredTopping ? label.style.backgroundColor = "" : null;
            });
        })
    }
}

// Retrieve JSON data
btnToppings.addEventListener('click', fetchJsonFile);

// Check my responses (answers)
btnSubmitResponse.addEventListener('click', submitResponse);

// Clear all responses (answers)
btnClearResponse.addEventListener('click', clearResponse);

// Show correct answers
btnRevealAnswers.addEventListener('click', revealAnswers);

// Clear correct answers
btnHideAnswers.addEventListener('click', hideAnswers);