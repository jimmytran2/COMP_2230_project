const { attachEventListener, createDataObject, validateCharityName, validateHoursVolunteered, validateDate, validateExperienceRating, validateFormSubmit } = require("../volunteer-tracker.js");
const { JSDOM } = require("jsdom");

test("validateFormSubmit correctly collects form data", () => {
    // Setup DOM
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <form id="volunteer-tracker">
        <!-- CHARITY NAME -->
        <section id="charity-name-section">
          <label for="charity-name">Charity Name:</label>
          <input type="text" id="charity-name" name="charity-name" value="test charity">
        </section>
  
        <!-- HOURS VOLUNTEERED -->
        <section id="hours-volunteered-section">
          <label for="hours-volunteered">Hours Volunteered:</label>
          <input type="number" name="hours-volunteered" id="hours-volunteered" value="2">
        </section>
  
        <!-- DATE -->
        <section id="date-section">
          <label for="date">Date:</label>
          <input type="date" id="date" name="date" value="2020-12-30">
        </section>
  
        <!-- VOLUNTEER EXPERIENCE RATING -->
        <section>
          <label for="experience-rating">Volunteer Experience Rating:</label>
          <select id="experience-rating" name="experience-rating">
            <option value="3">3 Stars</option>
          </select>
        </section>
  
        <!-- SUBMIT BUTTON -->
        <div>
          <button type="submit" id="submit-button">Submit</button>
        </div>
      </form>
    `);
  
    global.document = dom.window.document;
  
    let result = validateFormSubmit();
    let expected = ({
      name: "test charity",
      hours: 2,
      date: "2020-12-30",
      rating: 3

    });
  
    expect(result).toStrictEqual(expected);
  });

test("callback is triggered on form submission", () => {
    // fake function; only returns true
    const mockCallback = jest.fn(() => true);

    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="volunteer-tracker"></form>`);
    global.document = dom.window.document;

    // query form node
    const formNode = document.querySelector("#volunteer-tracker");

    // invoke mocked function on submit event
    attachEventListener(formNode, mockCallback);

    let submitEvent = new dom.window.Event("submit");

    // force submit event to be triggered on form node
    formNode.dispatchEvent(submitEvent);

    expect(mockCallback).toHaveBeenCalled();
});

test("temporary data object is correctly populated with form data", () => {
    let name = "charity";
    let hours = 5;
    let date = "2020-11-11";
    let experienceRating = 4;

    let result = createDataObject(name, hours, date, experienceRating);
    let expected = {
        name: "charity",
        hours: 5,
        date: "2020-11-11",
        rating: 4
    };

    expect(result).toEqual(expected);
});

test("validateCharityName returns false when input is empty", () => {
    let name = "";
    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="volunteer-tracker"><input type="text" id="charity-name" name="charity-name"></form>`);
    global.document = dom.window.document;

    // query form node
    const charityNode = document.querySelector("#charity-name");

    let result = validateCharityName(name, charityNode);

    expect(result).toBe(false);
});

test("validateHoursVolunteered returns false when input is empty", () => {
    let hours = "";
    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="volunteer-tracker"><input type="number" id="hours-volunteered" name="hours-volunteered"></form>`);
    global.document = dom.window.document;

    // query form node
    const hoursNode = document.querySelector("#hours-volunteered");

    let result = validateHoursVolunteered(hours, hoursNode);

    expect(result).toBe(false);
});

test("validateDate returns false when input is empty", () => {
    let date = "";
    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="volunteer-tracker"><input type="date" id="date" name="date"></form>`);
    global.document = dom.window.document;

    // query form node
    const dateNode = document.querySelector("#date");

    let result = validateDate(date, dateNode);

    expect(result).toBe(false);
});

test("validateHoursVolunteered returns false when input is negative", () => {
    let hours = "-1";
    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="volunteer-tracker"><input type="number" id="hours-volunteered" name="hours-volunteered"></form>`);
    global.document = dom.window.document;

    // query form node
    const hoursNode = document.querySelector("#hours-volunteered");

    let result = validateHoursVolunteered(hours, hoursNode);

    expect(result).toBe(false);
});

test("validateHoursVolunteered returns false when input is non-numeric", () => {
    let hours = "INVALID";
    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="volunteer-tracker"><input type="number" id="hours-volunteered" name="hours-volunteered"></form>`);
    global.document = dom.window.document;

    // query form node
    const hoursNode = document.querySelector("#hours-volunteered");

    let result = validateHoursVolunteered(hours, hoursNode);

    expect(result).toBe(false);
});

test("validateExperienceRating returns false when input is empty", () => {
    let rating = "";
    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="volunteer-tracker"><select id="experience-rating" name="experience-rating"></select></form>`);
    global.document = dom.window.document;

    // query form node
    const ratingNode = document.querySelector("#experience-rating");

    let result = validateExperienceRating(rating, ratingNode);

    expect(result).toBe(false);
});

test("validateExperienceRating returns false when input is out of range", () => {
    let rating = "6"; // out of range, can only be between 1 and 5
    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="volunteer-tracker"><select id="experience-rating" name="experience-rating"><option value="6">6 Stars</option></select></form>`);
    global.document = dom.window.document;

    // query form node
    const ratingNode = document.querySelector("#experience-rating");

    let result = validateExperienceRating(rating, ratingNode);

    expect(result).toBe(false);
});

test("validateExperienceRating returns true when input is valid", () => {
    let rating = "3"; // valid rating
    // setup dom
    const dom = new JSDOM(`<!DOCTYPE html><form id="volunteer-tracker"><select id="experience-rating" name="experience-rating"><option value="3">3 Stars</option></select></form>`);
    global.document = dom.window.document;

    // query form node
    const ratingNode = document.querySelector("#experience-rating");

    let result = validateExperienceRating(rating, ratingNode);

    expect(result).toBe(true);
});