const formNode = document.querySelector("#donation-tracker");

const charityNameNode = document.querySelector("#charity-name-section")
const charityName = document.querySelector("#charity-name");

const donationAmountNode = document.querySelector("#donation-amt-section");
const donationAmount = document.querySelector("#donation-amt");

const donationDateNode = document.querySelector("#donation-date-section");
const donationDate = document.querySelector("#donation-date");

const donorCommentNode = document.querySelector("#donor-comment-section");
const donorComment = document.querySelector("#donor-comment");

// EVENT LISTENER: FORM SUBMIT
formNode.addEventListener("submit", (event) =>{
    event.preventDefault();
    clearErrors();
    validateCharityName();
    validateDonation();
    validateDate();
    validateComments();
})

function validateCharityName(){
    if(escapeHTML(charityName.value) === ""){
        showError(charityNameNode, "Charity Name cannot be blank.");
    }
}

function validateDonation(){
    if(escapeHTML(donationAmount.value) === ""){
        showError(donationAmountNode, "Donation cannot be blank.");
    }
}

function validateDate(){
    if(donationDate.value === ""){
        showError(donationDateNode, "A date must be selected.");
    }
}

function validateComments(){
    if(escapeHTML(donorComment.value) === ""){
        showError(donorCommentNode, "Please enter a comment.");
    }
}

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