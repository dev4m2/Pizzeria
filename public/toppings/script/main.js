// TODO [x]: Move ref of chkRandomPizzaStyle to begining of code area
// TODO [x]: Create functions for chkRandomPizzaName
// TODO [x]: Toggle button to reveal/hide answers
// TODO [x]: Store "Random" checkbox settings on page refresh (sessionStorage)
// TODO []: Work on styling of webpage
// TODO []: Display success/failure on webpage vs "alert"
// TODO []: Add "gh-pages" branch to GitHub repo (publish website)


// Identify checkbox element
const chkRandomPizzaStyle = document.querySelector('#chkRandomPizzaStyle');

// Identify checkbox element
const chkRandomPizzaName = document.querySelector('#chkRandomPizzaName');

// Reference the btnLoadToppings element
const btnLoadToppings = document.querySelector('#btnLoadToppings');

// Reference the btnSubmitResponse element
const btnSubmitResponse = document.querySelector('#btnSubmitResponse');

// Reference the btnClearResponse element
const btnClearResponse = document.querySelector('#btnClearResponse');

// Reference the btnAnswers element
const btnAnswers = document.querySelector('#btnAnswers');

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

// Reveal/Hide answers
let revealAnswers = false;

// TESTING: ***** FOR TESTING PURPOSES ONLY *****
let testing = true;

window.onload = () => {
    // Check session variable
    let chkRandomPizzaStyleKey = `${chkRandomPizzaStyle.id}.checked`;
    const isRandomPizzaStyleKeyChecked = sessionStorage.getItem(chkRandomPizzaStyleKey) === 'true';
    chkRandomPizzaStyle.checked = isRandomPizzaStyleKeyChecked;
    
    // Check session variable
    let chkRandomPizzaNameKey = `${chkRandomPizzaName.id}.checked`;
    const isRandomPizzaNameKeyChecked = sessionStorage.getItem(chkRandomPizzaNameKey) === 'true';
    chkRandomPizzaName.checked = isRandomPizzaNameKeyChecked;

    // TESTING: ***** FOR TESTING PURPOSES ONLY *****
    if (testing) {
        btnLoadToppings.style.display = 'none';
        fetchJsonFile();
    }
};

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

        // Process the returned data
        processApiData(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function processApiData () {
    // Remove all child nodes
    removeAllChildrenOfType('containerPizzaCategories', 'fieldset');
    removeAllChildrenOfType('containerPizzaNames', 'fieldset');
    removeAllChildrenOfType('containerPizzaStyles', 'fieldset');

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

        // Create "styles" group and option elements
        createContainerElement(sortedUniquePizzaStyles, 'containerPizzaStyles', 'pizzaStyle', 'Pizza Style', 'radio');

        // Get random index
        let randomIndex = Math.floor(Math.random() * sortedUniquePizzaStyles.length + 1); // 1-3 ???

        // Identify fieldset element
        const fieldsetPizzaStyle = document.querySelector('.pizzaStyle');

        // Enable fieldset
        fieldsetPizzaStyle.disabled = false;

        if (chkRandomPizzaStyle.checked) {
            // Disable fieldset
            fieldsetPizzaStyle.disabled = true;

            // Get unique and sorted Pizza Toppings filtered by Pizza Style
            let sortedUniquePizzaStylesFilteredByStyleIndex = [...new Set(
                allToppings
                .filter(item => item.styleIndex === randomIndex) // e.g. "1 - New York Style" (toppings.json list "styleIndex" is 1-3)
                .map(item => item.style)
                .sort()
            )];

            // return Pizza Style
            pizzaStyle = sortedUniquePizzaStylesFilteredByStyleIndex[0]; // first item in the returned array (ex. "New York Style")
            
            // Get all radio buttons in this container
            const radioButtons = document.querySelectorAll('#containerPizzaStyles input[type="radio"]');

            // Filter radio buttons for selected pizza style
            const radioPizzaStyle = Array.from(radioButtons).filter(radio => radio.value === pizzaStyle);

            // Select radio button
            radioPizzaStyle[0].checked = true; // first item in the returned array

            clickPizzaStylesRadioButton(pizzaStyle);
        }
        else {
            document.querySelectorAll('input[name="pizzaStyle"]').forEach(radio => {
                radio.addEventListener('click', function() {
                    // Set global variable
                    pizzaStyle = this.value;
    
                    // Call event handler
                    clickPizzaStylesRadioButton(pizzaStyle);
                });
            });
        }
    }
}

function createContainerElement(arrPizzaItems, containerID, className, legendTitle, elementType) {
    // example: 
    // arrPizzaItems = sortedUniquePizzaStyles;
    // containerID = "containerPizzaStyles";
    // className = "pizzaStyle";
    // legendTitle = "Pizza Style";
    // elementType = "radio";

    // Loop through array
    if (arrPizzaItems != null) {
        // Reference the categories element
        let container = document.querySelector(`#${containerID}`);

        // Create a new fieldset element
        let newFieldset = document.createElement('fieldset');

        // Create a new legend element
        let newLegend = document.createElement('legend');

        // Set the class of the new fieldset
        newFieldset.className = className;

        // Set the text of the new legend
        newLegend.textContent = legendTitle;

        // Append the new legend to the parent element
        newFieldset.appendChild(newLegend);

        // Append the new fieldset to the parent element
        container.appendChild(newFieldset);

        // Reference the fieldset as direct descendant of the container element
        let fieldSetNode = document.querySelector(`.${className}`);

        for (let i = 0; i < arrPizzaItems.length; i++) {
            // Create a new div element
            let newDiv = document.createElement('div');

            // Create a new option element
            let newOption = document.createElement('input');

            // Create a new option label
            let newLabel = document.createElement('label');

            // Set the class of the new div
            newDiv.className = "option";

            // Set the name and value of the new option
            newOption.type = elementType; // "radio"
            newOption.id = `${className}${i}`; // "pizzaStyle2"
            newOption.name = className; // "pizzaStyle"
            newOption.value = arrPizzaItems[i]; // "New York Style"
            
            // Set the "for" value and text content of the new label
            newLabel.htmlFor = newOption.id;
            newLabel.textContent = arrPizzaItems[i];

            // Append the new option and label to the parent element
            newDiv.appendChild(newOption);
            newDiv.appendChild(newLabel);

            // Append the new div to the parent element
            fieldSetNode.appendChild(newDiv);
        }
    }
}

function constructPizzaCategoriesAndToppings(name) {
    // Remove all child nodes
    removeAllChildrenOfType('containerPizzaCategories', 'fieldset');

    if (allToppings != null) {
        // Get unique and sorted Pizza Toppings filtered by Pizza Name
        sortedUniquePizzaToppingsFilteredByPizzaName = [...new Set(
            allToppings
            .filter(item => item.name === name) // e.g. "The Meatball"
            .map(item => item.description)
            .sort()
        )];

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
                createContainerElement(sortedUniquePizzaToppingsFilteredByCategory, 'containerPizzaCategories', category, category, 'checkbox');
            }
        }
    }
}

function clickPizzaStylesRadioButton(style) {
    console.log("Selected pizza style:", style);
    
    // Remove all child nodes
    removeAllChildrenOfType('containerPizzaCategories', 'fieldset');
    removeAllChildrenOfType('containerPizzaNames', 'fieldset');

    if (allToppings != null) {
        // Get unique and sorted Pizza Names filtered by Pizza Style
        sortedUniquePizzaNamesFilteredByPizzaStyle = [...new Set(
            allToppings
            .filter(item => item.style === style) // e.g. "Detroit Style"
            .map(item => item.name)
            .sort()
        )];
        
        // Create "names" group and option elements
        createContainerElement(sortedUniquePizzaNamesFilteredByPizzaStyle, 'containerPizzaNames', 'pizzaName', 'Pizza Name', 'radio');

        // Get random index
        let randomIndex = Math.ceil(Math.random() * sortedUniquePizzaNamesFilteredByPizzaStyle.length) // 1-7 ???

        // Identify fieldset element
        const fieldsetPizzaName = document.querySelector('.pizzaName');

        // Enable fieldset
        fieldsetPizzaName.disabled = false;

        if (chkRandomPizzaName.checked) {
            // Disable fieldset
            fieldsetPizzaName.disabled = true;

            // Get unique and sorted Pizza Toppings filtered by Pizza Name
            let sortedUniquePizzaNamesFilteredByNameIndex = [...new Set(
                allToppings
                .filter(item => item.style === style && item.nameIndex === randomIndex) // e.g. "8 - New York Style - Mt Lumi" (toppings.json list "nameIndex" is 1-9)
                .map(item => item.name)
                .sort()
            )];

            // return Pizza Name
            pizzaName = sortedUniquePizzaNamesFilteredByNameIndex[0]; // first item in the returned array (ex. "Mt Lumi")
            
            // Get all radio buttons in this container
            const radioButtons = document.querySelectorAll('#containerPizzaNames input[type="radio"]');

            // Filter radio buttons for selected pizza name
            const radioPizzaName = Array.from(radioButtons).filter(radio => radio.value === pizzaName);

            // Select radio button
            radioPizzaName[0].checked = true; // first item in the returned array

            clickPizzaNamesRadioButton(pizzaName);

            // TESTING: ***** FOR TESTING PURPOSES ONLY *****
            if (testing) {
                revealHideAnswers();
            }
        }
        else {
            document.querySelectorAll('input[name="pizzaName"]').forEach(radio => {
                radio.addEventListener('click', function() {
                    // Set global variable
                    pizzaName = this.value;
    
                    // Call event handler
                    clickPizzaNamesRadioButton(pizzaName);
                });
            });
        }
    }
}

function clickPizzaNamesRadioButton(name) {
    console.log("Selected pizza name:", name);
    
    if (allToppings != null) {
        constructPizzaCategoriesAndToppings(name);

        // TESTING: ***** FOR TESTING PURPOSES ONLY *****
        if (testing) {
            revealHideAnswers();
        }
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

    // Reset
    revealAnswers = false;

    // Change button text
    btnAnswers.innerText = "Reveal Answers";
} 

function submitResponse() {
    // Get data
    if (allToppings != null) {
        // Clear counter
        let identifiedToppingsCount = 0;

        // Clear array
        participantAnswerArray.length = 0;

        // Get all checkboxes in this container
        const checkboxes = document.querySelectorAll('#containerPizzaCategories input[type="checkbox"]');

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
    // Get all checkboxes in this container
    const checkboxes = document.querySelectorAll('#containerPizzaCategories input[type="checkbox"]');

    // Filter checked checkboxes
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);

    checkedCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

function revealHideAnswers() {
    // Get data
    if (allToppings != null) {
        // Get all checkboxes in this container
        const checkboxes = document.querySelectorAll('#containerPizzaCategories input[type="checkbox"]');

        // Get all labels in this container
        const labels = document.querySelectorAll('#containerPizzaCategories label');

        // Invert boolean
        revealAnswers = !revealAnswers;

        // Compare toppings selected with actual pizza
        sortedUniquePizzaToppingsFilteredByPizzaName.forEach(filteredTopping => {
            // checkboxes.forEach(checkbox => {
            //     if (revealAnswers) {
            //         checkbox.value === filteredTopping ? checkbox.checked = true : null;
            //     }
            //     else {
            //         checkbox.value === filteredTopping ? checkbox.checked = false : null;
            //     }
            // });

            labels.forEach(label => {
                if (revealAnswers) {
                    label.textContent === filteredTopping ? label.style.backgroundColor = "cyan" : null;
                }
                else {
                    label.textContent === filteredTopping ? label.style.backgroundColor = "" : null;
                }
            });
        })

        // Change button text
        revealAnswers ? btnAnswers.innerText = "Hide Answers" : btnAnswers.innerText = "Reveal Answers";
    }
}

function checkboxChanged(event) {
    let customKey = `${event.target.id}.checked`;
    sessionStorage.setItem(customKey, event.target.checked);
}

// Retrieve JSON data
btnLoadToppings.addEventListener('click', fetchJsonFile);

// Check my responses (answers)
btnSubmitResponse.addEventListener('click', submitResponse);

// Clear my responses (answers)
btnClearResponse.addEventListener('click', clearResponse);

// Show/Hide correct answers
btnAnswers.addEventListener('click', revealHideAnswers);

// Checkbox changed
chkRandomPizzaStyle.addEventListener('change', checkboxChanged);

// Checkbox changed
chkRandomPizzaName.addEventListener('change', checkboxChanged);
