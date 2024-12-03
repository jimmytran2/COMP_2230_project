if (typeof window === "undefined") {
    // if there is no window, export modules
    module.exports = { 
        attachEventListener, 
        createDataObject, 
        validateCharityName,
        validateHoursVolunteered,
        validateDate,
        validateExperienceRating,
        validateFormSubmit,
        loadLoggedHours
    };
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
    loadLoggedHours();
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
 * Save data to local storage
 * @param {Object} data - Data object to be saved
 */
function saveToLocalStorage(data) {
    let loggedHours = JSON.parse(localStorage.getItem('loggedHours')) || [];
    loggedHours.push(data);
    localStorage.setItem('loggedHours', JSON.stringify(loggedHours));
}


/**
 * Load logged hours from local storage and display them in the table
 */
function loadLoggedHours() {
    const loggedHours = JSON.parse(localStorage.getItem('loggedHours')) || [];
    const tableBody = document.querySelector("#logged-hours-table tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    loggedHours.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.name}</td>
            <td>${entry.hours}</td>
            <td>${entry.date}</td>
            <td>${entry.rating}</td>
        `;
        tableBody.appendChild(row);
    });
}


/**
 * Clears the form inputs after submission
 */
function clearForm() {
    document.querySelector("#charity-name").value = "";
    document.querySelector("#hours-volunteered").value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#experience-rating").selectedIndex = 0; // Reset to default
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
 * Validate form inputs and creates temporary data object if all tests pass
 */
function validateFormSubmit() {
    // clear errors
    clearErrors();

    let data = {};

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
    const experienceRatingInput = experienceRatingNode.value;
    const isExperienceRatingValid = validateExperienceRating(experienceRatingInput, experienceRatingNode);

    // Check if all validations passed
    const isValid = isCharityNameValid && isHoursValid && isDateValid && isExperienceRatingValid;

    // If all validations passed
    if (isValid) {
       data = createDataObject(charityNameInput, Number(hoursVolunteeredInput), dateInput, Number(experienceRatingInput));
        saveToLocalStorage(data);
        clearForm();
        loadLoggedHours();
    }


    // return data object
    return data;
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
    if (!experienceRating || experienceRating === "") {
        showError(node.parentElement, "Please select an experience rating.");
        return false;
    }

    const ratingValue = Number(experienceRating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        showError(node.parentElement, "Experience rating must be between 1 and 5.");
        return false;
    }

    return true;
}


/**
 * Creates an error message for inputElement and appends under the input
 * @param {HTMLElement} inputElement - Container error message will be appended to
 * @param {str} message - Error message to be displayed
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