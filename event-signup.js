const formNode = document.querySelector("#event-signup");

const eventNameSection = document.querySelector("#event-name-section");
const eventNameInputNode = document.querySelector("#event-name");

const representativeNameSection = document.querySelector("#representative-name-section");
const representativeNameInputNode = document.querySelector("#representative-name");

const representativeEmailSection = document.querySelector("#representative-email-section");
const representativeEmailInputNode = document.querySelector("#representative-email");

const roleSelectionSection = document.querySelector("#role-selection-section");
const roleSelectionNode = document.querySelector("#role-selection");

let validForm = true;

formNode.addEventListener("submit", (event) => {

    validForm = true;

    event.preventDefault();
    clearErrorMessages();
    validateEventName();
    validateRepresentativeName();
    validateRepresentativeEmail();
    validateRoleSelection();

    if(validForm){
        formData = {
            eventName: escapeHTML(eventNameInputNode.value),
            representativeName: escapeHTML(representativeNameInputNode.value),
            representativeEmail: escapeHTML(representativeEmailInputNode.value),
            roleSelection: roleSelectionNode.value
        };
        console.log(formData);

        // code that puts values into a table "Stage Two"
    }

})


function validateEventName(){
    const eventName = escapeHTML(eventNameInputNode.value);

    if(eventName === ""){
        let error = "Please enter an event name"
        displayErrorMessage(eventNameSection, error);
        validForm = false;
    }
}

function validateRepresentativeName(){
    const representativeName = escapeHTML(representativeNameInputNode.value);

    if(representativeName === ""){
        let error = "Please enter a name"
        displayErrorMessage(representativeNameSection, error);
        validForm = false;
    }
}


function validateRepresentativeEmail(){
    // Retrieves value inputted into email input
    const email = escapeHTML(representativeEmailInputNode.value);

    // Regex pattern for email
    const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9._]+\.[A-Z]{2,4}$/i;

    // checks if email address inputted is empty
    if(email === ""){
        let error = "Please enter an email address";
        displayErrorMessage(representativeEmailSection, error);
        validForm = false;

    // tests email input against email regex pattern
    }else if(!(pattern.test(email))){
        let error = "Please enter a valid email address";
        displayErrorMessage(representativeEmailSection, error);
        validForm = false;
    }
}

function validateRoleSelection(){
    if(roleSelectionNode.value === ""){
        let error = "Please select a role"
        displayErrorMessage(roleSelectionSection, error)
        validForm = false;
    }
}



/**
 * Creates and displays error messages to appropriate node and corresponding message
 * @constructor
 * @param {element} element - element to display error message to
 * @param {string} error - error message to be displayed
 */
function displayErrorMessage(element, error){

    // creates span element to insert error message
    const errorMessageNode = document.createElement("div");

    // inserts text from error into span
    errorMessageNode.textContent = error;

    // assigns error message element class "errorMessage"
    errorMessageNode.className = "error-message";

    // appends error message element to parent, section where invalid input occurred
    element.appendChild(errorMessageNode);
}

/**
 * Clears error messages upon entering valid entry and pressing submit
 */
function clearErrorMessages(){
    // selects all error messages
    const errorMessages = document.querySelectorAll(".error-message");

    // loops through error messages that were selected and removes them
    for(const errors of errorMessages){
        errors.remove();
    }
}

/**
 * Translates special characters to corresponding HTML entities
 * @param {string} input - text inputs
 * @returns HTML entities after converting special characters
 */
function escapeHTML(input){
    return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

