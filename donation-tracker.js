const formNode = document.querySelector("#donation-tracker");

const charityNameNode = document.querySelector("#charity-name-section")
const charityNameInput = document.querySelector("#charity-name");

const donationAmountNode = document.querySelector("#donation-amt-section");
const donationAmountInput = document.querySelector("#donation-amt");

const donationDateNode = document.querySelector("#donation-date-section");
const donationDateInput = document.querySelector("#donation-date");

const donorCommentNode = document.querySelector("#donor-comment-section");
const donorCommentInput = document.querySelector("#donor-comment");

const data = {};

// EVENT LISTENER: FORM SUBMIT
formNode.addEventListener("submit", (event) =>{
    event.preventDefault();
    clearErrors();
    validateCharityName();
    validateDonation();
    validateDate();
    validateComments();
    console.log(data);
})

function validateCharityName(){
    const charityName = escapeHTML(charityNameInput.value);

    if(charityName === ""){
        showError(charityNameNode, "Charity Name cannot be blank.");
    } else {
        data.name = charityName;
    }
}

function validateDonation(){
    const donationAmount = escapeHTML(donationAmountInput.value);

    if(donationAmount === ""){
        showError(donationAmountNode, "Donation cannot be blank.");
    } else {
        data.donation = donationAmount;
    }
}

function validateDate(){
    const donationDate = donationDateInput.value;
    if(donationDate === ""){
        showError(donationDateNode, "A date must be selected.");
    } else {
        data.date = donationDate;
    }
}

function validateComments(){
    const donorComment = escapeHTML(donorCommentInput.value);
    if(donorComment === ""){
        showError(donorCommentNode, "Please enter a comment.");
    } else {
        data.comment = donorComment;
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