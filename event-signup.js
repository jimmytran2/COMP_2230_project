if(typeof window === "undefined") {
    // window object represents the browser window
    module.exports = {  attachEventListener,
                        formDataObject,
                        validateForm, 
                        validateEventName,  
                        validateRepresentativeName, 
                        validateRepresentativeEmail, 
                        validateRoleSelection };
} else {
    // if undefined, window object is not available
    window.onload = init;
}

function init(){
    // Select html element
    const formNode = document.querySelector("#event-signup");
    
    // Invokes function to attach event listener to form and function to form
    attachEventListener(formNode, validateForm);
}

/**
 * Attaches event listener to html form and callback function
 * @param {element} formNode 
 */
function attachEventListener(formNode, callback) {
    formNode.addEventListener("submit", (event) => {
        event.preventDefault();
        callback();
    })
}

let formData = {};

function validateForm(){

    clearErrorMessages();

    const eventNameSection = document.querySelector("#event-name-section");
    const eventNameInputNode = document.querySelector("#event-name");
    const isValidEventName = validateEventName(eventNameInputNode.value, eventNameSection);


    const representativeNameSection = document.querySelector("#representative-name-section");
    const representativeNameInputNode = document.querySelector("#representative-name");
    const isValidRepName = validateRepresentativeName(representativeNameInputNode.value, representativeNameSection);


    const representativeEmailSection = document.querySelector("#representative-email-section");
    const representativeEmailInputNode = document.querySelector("#representative-email");
    const isValidRepEmail = validateRepresentativeEmail(representativeEmailInputNode.value, representativeEmailSection);

    const roleSelectionSection = document.querySelector("#role-selection-section");
    const roleSelectionNode = document.querySelector("#role-selection");
    const isValidRole = validateRoleSelection(roleSelectionNode.value, roleSelectionSection);

    if(isValidEventName && isValidRepName && isValidRepEmail && isValidRole){
        formDataObject(eventNameInputNode.value, representativeNameInputNode.value, representativeEmailInputNode.value, roleSelectionNode.value);
    }
}


function formDataObject(event, name, email, role){
    let formData = {event: event,
                    name: name,
                    email: email,
                    role: role
    }
    return formData;
    console.log(formData);
}


function validateEventName(eventName, section){
    let event = escapeHTML(eventName);

    // Check if input was empty
    if(event === ""){
        let error = "Please enter an event name"
        displayErrorMessage(section, error);
        return false;
    }else{
        formData.event = eventName;
        return true;
    }
}


function validateRepresentativeName(representativeName, section){
    let representative = escapeHTML(representativeName);

    if(representative === ""){
        let error = "Please enter a name"
        displayErrorMessage(section, error);
        return false;
    }else{
        formData.representative = representativeName;
        return true;
    }
}


function validateRepresentativeEmail(representativeEmail, section){
    let email = escapeHTML(representativeEmail);

    // Regex pattern for email
    const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9._]+\.[A-Z]{2,4}$/i;

    // checks if email address inputted is empty
    if(email === ""){
        let error = "Please enter an email address";
        displayErrorMessage(section, error);
        return false
    // tests email input against email regex pattern
    }else if(!(pattern.test(email))){
        let error = "Please enter a valid email address";
        displayErrorMessage(section, error);
        return false;
    }else{
        formData.email = representativeEmail;
        return true;
    }
}


function validateRoleSelection(roleSelection, section){

    // check if value was selected from dropdown
    if(roleSelection === ""){
        let error = "Please select a role"
        displayErrorMessage(section, error)
        return false;
    }else{
        formData.role = roleSelection;
        return true;
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