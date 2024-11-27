const { attachEventListener, createDataObject, validateCharityName, validateDonation, validateDate} = require("../donation-tracker.js");

const { JSDOM } = require("jsdom");

test("callback is triggered on form submission", () => {
    // fake function; only returns true
    const mockCallback = jest.fn(() => true);

    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="donation-tracker"></form>`);
    global.document = dom.window.document;

    // query form node
    const formNode = document.querySelector("#donation-tracker");

    // invoke mocked function on submit event
    attachEventListener(formNode, mockCallback);

    let submitEvent = new dom.window.Event("submit");

    // force submit event to be triggered on form node
    formNode.dispatchEvent(submitEvent);

    expect(mockCallback).toHaveBeenCalled();
});

test("temporary data object is correctly populated with form data", () =>{
    let name = "charity";
    let donation = "2.00";
    let date = "2020-11-11";
    let comment = "hello";

    let result = createDataObject(name, donation, date, comment);
    let expected = {
        name: "charity",
        donation: "2.00",
        date: "2020-11-11",
        comment: "hello"
    }

    expect(result).toEqual(expected);
});

test("validateCharityName returns false when input is empty", () =>{
    let name = "";
    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="donation-tracker"><input type="text" id="charity-name" name="charity-name"></form>`);
    global.document = dom.window.document;

    // query form node
    const charityNode = document.querySelector("#charity-name");

    let result = validateCharityName(name, charityNode)

    expect(result).toBe(false);
});

test("validateDonation returns false when input is empty", () =>{
    let donation = "";
    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="donation-tracker"><input type="number" name="donation-amt" id="donation-amt" placeholder="$1.00 minimum" step="0.01" min="1" value=""></form>`);
    global.document = dom.window.document;

    // query form node
    const donationNode = document.querySelector("#donation-amt");

    let result = validateDonation(donation, donationNode);

    expect(result).toBe(false);

});

test("validateDate returns false when input is empty", () => {
    let date = "";
    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="donation-tracker"><input type="date" id="donation-date" name="donation-date"></form>`);
    global.document = dom.window.document;

    // query form node
    const dateNode = document.querySelector("#donation-date");

    let result = validateDate(date, dateNode);

    expect(result).toBe(false);
});

test("validateDonation returns false when input is negative", () =>{
    let donation = "-1";
    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="donation-tracker"><input type="number" name="donation-amt" id="donation-amt" placeholder="$1.00 minimum" step="0.01" min="1" value=""></form>`);
    global.document = dom.window.document;

    // query form node
    const donationNode = document.querySelector("#donation-amt");

    let result = validateDonation(donation, donationNode);

    expect(result).toBe(false);
});

test("validateDonation returns false when input is non-numeric", () =>{
    let donation = "INVALID";
    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="donation-tracker"><input type="number" name="donation-amt" id="donation-amt" placeholder="$1.00 minimum" step="0.01" min="1" value=""></form>`);
    global.document = dom.window.document;

    // query form node
    const donationNode = document.querySelector("#donation-amt");

    let result = validateDonation(donation, donationNode);

    expect(result).toBe(false);
});
