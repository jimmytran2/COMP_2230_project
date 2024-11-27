if (typeof window === "undefined") {
    // if there is no window, export modules
    module.exports = { attachEventListener, 
        createDataObject, 
        validateCharityName,
        validateHoursVolunteered,
        validateDate,
        validateExperienceRating };
} else {
    // run init function when window loads
    window.onload = init;
}


/**
 * Initializes event listener for form
 */
function init() {
    const formNode = document.querySelector("#volunteer-tracker");
    attachEventListener(formNode, validateFormSubmit);
}


/**
 * Adds event listener and attaches callback function to node
 * @param {HTMLElement} node - Node to attach event listener to
 * @param {Function} callback - Function to be called when event happens
 */
function attachEventListener(node, callback) {
    node.addEventListener("submit", event => {
        event.preventDefault();
        callback();
    });
}


/**
 * Validate form inputs and creates temporary data object if all tests pass
 */
function validateFormSubmit() {
    // clear errors
    clearErrors();

    // Validate inputs
    const charityNameNode = document.querySelector("#charity-name-section");
    const charityNameInput = escapeHTML(document.querySelector("#charity-name").value);
    const isCharityNameValid = validateCharityName(charityNameInput, charityNameNode);

    const hoursVolunteeredNode = document.querySelector("#hours-volunteered-section");
    const hoursVolunteeredInput = escapeHTML(document.querySelector("#hours-volunteered").value);
    const isHoursValid = validateHoursVolunteered(hoursVolunteeredInput, hoursVolunteeredNode);

    const dateNode = document.querySelector("#date-section");
    const dateInput = escapeHTML(document.querySelector("#date").value);
    const isDateValid = validateDate(dateInput, dateNode);

    const experienceRatingNode = document.querySelector("#experience-rating");
    const experienceRatingInput = escapeHTML(document.querySelector("#experience-rating").value);
    const isExperienceRatingValid = validateExperienceRating(experienceRatingInput, experienceRatingNode);

    // Check if all validations passed
    const isValid = isCharityNameValid && isHoursValid && isDateValid && isExperienceRatingValid;

    // If all validations passed
    if (isValid) {
        createDataObject(charityNameInput, Number(hoursVolunteeredInput), dateInput, Number(experienceRatingInput));
    }
}


/**
 * Returns an object that is created using arguments
 * @param {str} charityName - Name of charity
 * @param {number} hoursVolunteered - Hours volunteered
 * @param {str} date - Date of volunteering
 * @param {number} experienceRating - Experience rating
 * @returns - object containing data
 */
function createDataObject(charityName, hoursVolunteered, date, experienceRating) {
    const data = {
        name: charityName,
        hours: hoursVolunteered,
        date: date,
        rating: experienceRating
    };

    console.log(data);
    return data;
}


/**
 * Validate charity name input, creates error if it was blank.
 * @param {str} charityName - Value of charity name input
 * @param {HTMLElement} node - Container of charity name input
 * @returns - false if there was an error, otherwise returns true
 */
function validateCharityName(charityName, node) {
    if (charityName.length <= 0) {
        showError(node, "Charity Name cannot be blank.");
        return false;
    }
    return true;
}


/**
 * Validate hours volunteered input, creates errors if input is blank or non-numeric
 * @param {str} hoursVolunteered - Value of hours volunteered input
 * @param {HTMLElement} node - Container of hours volunteered input
 * @returns - false if there was an error, otherwise returns true
 */
function validateHoursVolunteered(hoursVolunteered, node) {
    if (hoursVolunteered.length <= 0 || isNaN(hoursVolunteered) || Number(hoursVolunteered) <= 0) {
        showError(node, "Please enter a valid number of hours volunteered.");
        return false;
    }
    return true;
}


/**
 * Validates date input, creates error if it was blank.
 * @param {str} date - Value of date input
 * @param {HTMLElement} node - Container of date input
 * @returns - false if there was an error, otherwise returns true
 */
function validateDate(date, node) {
    if (date.length <= 0) {
        showError(node, "Date is required.");
        return false;
    }
    return true;
}


/**
 * Validates experience rating input, creates error if it was blank or out of range.
 * @param {str} experienceRating - Value of experience rating input
 * @param {HTMLElement} node - Container of experience rating input
 * @returns - false if there was an error, otherwise returns true
 */
function validateExperienceRating(experienceRating, node) {
    if (experienceRating.length <= 0) {
        showError(node, "Please select an experience rating.");
        return false;
    }

    // Check if experience rating is a number and within the valid range (1-5)
    const ratingValue = Number(experienceRating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        showError(node, "Experience rating must be between 1 and 5.");
        return false;
    }

    return true;
}


/**
 * Creates an error message for inputElement and appends under the input
 * @param {HTMLElement} inputElement - Container error message will be appended to
 * @param {str} message - Error message
 */
function showError(inputElement, message) {
    const errorMessage = document.createElement("div");
    errorMessage.textContent = message;
    errorMessage.className = "error-message";
    inputElement.appendChild(errorMessage);
}


/**
 * Clears all error messages that have .error-message class
 */
function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-message");
    for (const errors of errorMessages) {
        errors.remove();
    }
}


/**
 * Converts special characters to their corresponding HTML entities.
 * @param {str} input - Input to be converted
 * @returns - HTML entities after being converted
 */
function escapeHTML(input) {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}