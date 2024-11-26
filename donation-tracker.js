

const data = {};

if(typeof window === "undefined") {
    // window object represents the browser window
    module.exports = { attachEventListener, 
        createDataObject, 
        validateCharityName,
        validateDonation,
        validateDate};
} else {
    // if undefined, window object is not available
    // typically result of working in a Node environment
    window.onload = init;
}

function init(){
    const formNode = document.querySelector("#donation-tracker");
    attachEventListener(formNode, validateFormSubmit);
}

function attachEventListener(node, callback){
    
    node.addEventListener("submit", event => {
        event.preventDefault();
        callback();
    })
}

function validateFormSubmit(){
    // reset validity and clear errors

    clearErrors();

    // Validate inputs
    const charityNameNode = document.querySelector("#charity-name-section");
    const charityNameInput = document.querySelector("#charity-name").value;
    const isCharityNameValid = validateCharityName(charityNameInput, charityNameNode);

    const donationAmountNode = document.querySelector("#donation-amt-section");
    const donationAmountInput = document.querySelector("#donation-amt").value;
    const isDonationValid = validateDonation(donationAmountInput, donationAmountNode);

    const donationDateNode = document.querySelector("#donation-date-section");
    const donationDateInput = document.querySelector("#donation-date").value;
    const isDateValid = validateDate(donationDateInput, donationDateNode);

    // const donorCommentNode = document.querySelector("#donor-comment-section");
    const donorCommentInput = document.querySelector("#donor-comment").value;
    // const isCommentsValid = validateComments(donorCommentInput, donorCommentNode);

    // Check if all validations passsed, doesn't check for comments
    const isValid = isCharityNameValid && isDonationValid && isDateValid;

    // If all validations passed
    if(isValid){
        createDataObject(charityNameInput, donationAmountInput, donationDateInput, donorCommentInput);
    }

}

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

function validateCharityName(charityName, node){
    // Check charityName if blank
    if(charityName.length <= 0){
        showError(node, "Charity Name cannot be blank.");
        return false;
    } else {
        return true;
    }

}

function validateDonation(donationAmount, node){
    // Floating point numbers
    const numericPattern = /^-?\d+(\.\d+)?$/;
    // check if donation is blank, less than $1.00, or non numeric.
    // Break out of function if any errors
    if(donationAmount.length <= 0){
        showError(node, "Donation cannot be blank.");
        return false;
    }
    if(parseFloat(donationAmount) < 1.00){
        showError(node, "Donation must be at least $1.00");
        return false;
    }
    if(!numericPattern.test(donationAmount)){
        showError(node, "Donation amount must be numeric.");
        return false;
    }
    
    return true;
    
}

function validateDate(donationDate, node){
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

function showError(inputElement, message){
    // Create new element
    const errorMessage = document.createElement("div");
    errorMessage.textContent = message;
    errorMessage.className = "error-message";

    // Append to input
    inputElement.appendChild(errorMessage);
    
}

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
 * @param {*} input - Input to be converted
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
