if(typeof window === "undefined") {
    // if there is no window, export modules
    module.exports = { attachEventListener, 
        createDataObject, 
        validateCharityName,
        validateDonation,
        validateDate,
        validateFormSubmit};
} else {
    // run init fuction when window loads
    window.onload = init;
}

/**
 * Initializes event listener for form
 */
function init(){
    const formNode = document.querySelector("#donation-tracker");
    attachEventListener(formNode, validateFormSubmit);
}

/**
 * Adds eventlistener and attaches callback function to node
 * @param {HTMLElement} node -  Node to attach event listener to
 * @param {Function} callback - Function to be called when event happens
 */
function attachEventListener(node, callback){
    node.addEventListener("submit", event => {
        event.preventDefault();
        callback();
    })
}

/**
 * Validate form inputs and creates temporary data object if all tests pass
 */
function validateFormSubmit(){
    // clear errors
    clearErrors();

    // instantiate data to empty object
    let data = {};
    // Validate inputs
    const charityNameNode = document.querySelector("#charity-name-section");
    const charityNameInput = escapeHTML(document.querySelector("#charity-name").value);
    const isCharityNameValid = validateCharityName(charityNameInput, charityNameNode);

    const donationAmountNode = document.querySelector("#donation-amt-section");
    const donationAmountInput = escapeHTML(document.querySelector("#donation-amt").value);
    const isDonationValid = validateDonation(donationAmountInput, donationAmountNode);

    const donationDateNode = document.querySelector("#donation-date-section");
    const donationDateInput = escapeHTML(document.querySelector("#donation-date").value);
    const isDateValid = validateDate(donationDateInput, donationDateNode);

    // const donorCommentNode = document.querySelector("#donor-comment-section");
    const donorCommentInput = escapeHTML(document.querySelector("#donor-comment").value);
    // const isCommentsValid = validateComments(donorCommentInput, donorCommentNode);

    // Check if all validations passsed, doesn't check for comments
    const isValid = isCharityNameValid && isDonationValid && isDateValid;

    // If all validations passed
    if(isValid){
        data = createDataObject(charityNameInput, donationAmountInput, donationDateInput, donorCommentInput);
    }

    return data;

}

/**
 * Returns an object that is created using arguments
 * @param {str} charityName - Name of charity
 * @param {str} donationAmt - Donation amount
 * @param {str} donationDate - Date of donation
 * @param {str} donorComment - Donor comments
 * @returns - object containing data
 */
function createDataObject(charityName, donationAmt, donationDate, donorComment){
    const data = {
        name: charityName,
        donation: donationAmt,
        date: donationDate,
        comment: donorComment
    }
    
    console.log(data);
    return data;
}

/**
 * Validate charity name input, creates error if it was blank.
 * @param {str} charityName - Value of charity name input
 * @param {HTMLElement} node - Container of charity name input
 * @returns - false if there was an error, otherwise returns true
 */
function validateCharityName(charityName, node){
    // Check charityName if blank
    if(charityName.length <= 0){
        showError(node, "Charity Name cannot be blank.");
        return false;
    } else {
        return true;
    }

}

/**
 * Validate donation input, creates errors if input is blank, less than 1.00, or non-numeric
 * @param {str} donationAmount - Value of donation amount input
 * @param {HTMLElement} node - Container of donation input
 * @returns - false if there was an error, otherwise returns true
 */
function validateDonation(donationAmount, node){
    // Floating point numbers pattern
    const numericPattern = /^-?\d+(\.\d+)?$/;

    // Check if donation is blank
    if(donationAmount.length <= 0){
        showError(node, "Donation cannot be blank.");
        return false;
    }
    // Check if donation is less than $1.00
    if(parseFloat(donationAmount) < 1.00){
        showError(node, "Donation must be at least $1.00");
        return false;
    }
    // Check if donation is numeric
    if(!numericPattern.test(donationAmount)){
        showError(node, "Donation amount must be numeric.");
        return false;
    }
    
    return true;
    
}

/**
 * Validates date input, creates error if it was blank.
 * @param {str} donationDate - Value of donation date input
 * @param {HTMLElement} node - Container of donation date input
 * @returns - false if there was an error, otherwise returns true
 */
function validateDate(donationDate, node){
    // Check if blank
    if(donationDate.length <= 0){
        showError(node, "A date must be selected.");
        return false;
    } else{
        return true;
    }
}

// function validateComments(donorComment, node){
    
//     if(donorComment.length <= 0){
//         showError(node, "Please enter a comment.");
//         return false;
//     } else{
//         return true;
//     }
// }

/**
 * Creates an error message for inputElement and appends under the input
 * @param {HTMLElement} inputElement - Container error message will be appended to
 * @param {str} message - Error message
 */
function showError(inputElement, message){
    // Create new element
    const errorMessage = document.createElement("div");
    errorMessage.textContent = message;
    errorMessage.className = "error-message";

    // Append to input
    inputElement.appendChild(errorMessage);
    
}

/**
 * Clears all error messages that have .error-message class
 */
function clearErrors(){
    // Select error messages
    const errorMessages = document.querySelectorAll(".error-message");

    // Loop and delete all errors
    for(const errors of errorMessages){
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
