const { 
  attachEventListener, 
  createDataObject, 
  validateCharityName, 
  validateHoursVolunteered, 
  validateDate, 
  validateExperienceRating, 
  validateFormSubmit,
  saveToLocalStorage,
  loadLoggedHours,
  deleteLoggedHours
} = require("../volunteer-tracker.js");

const { JSDOM } = require("jsdom");
const { LocalStorage } = require('node-localstorage');
global.localStorage = new LocalStorage("./scratch");


// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});

test("validateFormSubmit correctly collects form data", () => {
  // Setup DOM
  const dom = new JSDOM(`
      <!DOCTYPE html>
      <form id="volunteer-tracker">
          <section id="charity-name-section">
              <label for="charity-name">Charity Name:</label>
              <input type="text" name="charity-name" id="charity-name" value="test charity">
          </section>
          <section id="hours-volunteered-section">
              <label for="hours-volunteered">Hours Volunteered:</label>
              <input type="number" name="hours-volunteered" id="hours-volunteered" value="2">
          </section>
          <section id="date-section">
              <label for="date">Date:</label>
              <input type="date" name="date" id="date" value="2020-12-30">
          </section>
          <section>
              <label for="experience-rating">Volunteer Experience Rating:</label>
              <select id="experience-rating" name="experience-rating">
                  <option value="3" selected>3 Stars</option>
              </select>
          </section>
          <div>
              <button type="submit" id="submit-button">Submit</button>
          </div>
      </form>
      <section id="logged-hours-section">
          <h2>Logged Hours</h2>
          <table id="logged-hours-table">
              <thead>
                  <tr>
                      <th>Charity Name</th>
                      <th>Hours Volunteered</th>
                      <th>Date</th>
                      <th>Experience Rating</th>
                  </tr>
              </thead>
              <tbody>
                  <!-- Rows will be injected with JavaScript here -->
              </tbody>
          </table>
      </section>
      <section id="summary-section">
          <h2 id="total-hours">Total Hours Volunteered: 0</h2>
      </section>
  `);

  global.document = dom.window.document;

  // Mock localStorage
  const localStorageMock = {
      store: {},
      getItem: function(key) { return this.store[key] || null; },
      setItem: function(key, value) { this.store[key] = value.toString(); },
      clear: function() { this.store = {}; }
  };
  global.localStorage = localStorageMock;

  // Call the function to validate form
  const result = validateFormSubmit();

  // Expected output
  const expected = {
      name: "test charity",
      hours: 2,
      date: "2020-12-30",
      rating: 3
  };

  expect(result).toStrictEqual(expected);

  // Check if data was saved to localStorage
  const savedData = JSON.parse(localStorageMock.getItem("loggedHours"));
  expect(savedData).toContainEqual(expected);
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

test("saveToLocalStorage correctly stores data", () => {
  const data = {
      name: "charity",
      hours: 5,
      date: "2023-10-10",
      rating: 4
  };
  
  saveToLocalStorage(data);

  // Retrieve loggedHours as array
  const loggedHours = JSON.parse(localStorage.getItem("loggedHours"));
  
  // Check if the stored data matches the expected data
  expect(loggedHours[0]).toEqual(data);
  expect(loggedHours).toHaveLength(1);
});

test("loadLoggedHours correctly retrieves data from localStorage and displays it in the table", () => {
  const dom = new JSDOM(`
      <!DOCTYPE html>
      <section id="logged-hours-section">
            <h2>Logged Hours</h2>
            <table id="logged-hours-table">
                <thead>
                    <tr>
                        <th>Charity Name</th>
                        <th>Hours Volunteered</th>
                        <th>Date</th>
                        <th>Experience Rating</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Rows will be injected with JavaScript here-->
                </tbody>
            </table>
        </section>
  `);
  global.document = dom.window.document;

  const data1 = {
      name: "charity 1",
      hours: 5,
      date: "2023-10-10",
      rating: 4
  };
  const data2 = {
      name: "charity 2",
      hours: 3,
      date: "2023-10-11",
      rating: 5
  };
  saveToLocalStorage(data1);
  saveToLocalStorage(data2);
  
  loadLoggedHours();

  // select table body
  const loggedHoursTable = document.querySelector("#logged-hours-table").getElementsByTagName("tbody")[0];

  // Check the amount of rows
  expect(loggedHoursTable.rows.length).toEqual(2);

  // Check the content of the first row
  expect(loggedHoursTable.rows[0].cells[0].textContent).toEqual(data1.name);
  expect(loggedHoursTable.rows[0].cells[1].textContent).toEqual(data1.hours.toString());
  expect(loggedHoursTable.rows[0].cells[2].textContent).toEqual(data1.date);
  expect(loggedHoursTable.rows[0].cells[3].textContent).toEqual(data1.rating.toString());

  // Check the content of the second row
  expect(loggedHoursTable.rows[1].cells[0].textContent).toEqual(data2.name);
  expect(loggedHoursTable.rows[1].cells[1].textContent).toEqual(data2.hours.toString());
  expect(loggedHoursTable.rows[1].cells[2].textContent).toEqual(data2.date);
  expect(loggedHoursTable.rows[1].cells[3].textContent).toEqual(data2.rating.toString());
});

test("summary section correctly calculates and displays total hours volunteered", () => {
  const dom = new JSDOM(`
      <!DOCTYPE html>
      <section id="summary-section">
          <h2 id="total-hours">Total Hours Volunteered: 0</h2>
      </section>
      <section id="logged-hours-section">
          <h2>Logged Hours</h2>
          <table id="logged-hours-table">
              <thead>
                  <tr>
                      <th>Charity Name</th>
                      <th>Hours Volunteered</th>
                      <th>Date</th>
                      <th>Experience Rating</th>
                  </tr>
              </thead>
              <tbody>
                  <!-- Rows will be injected with JavaScript here-->
              </tbody>
          </table>
      </section>
  `);
  global.document = dom.window.document;

  // Simulate adding entries
  const data1 = { name: "charity 1", hours: 5, date: "2023-10-10", rating: 4 };
  const data2 = { name: "charity 2", hours: 3, date: "2023-10-11", rating: 5 };
  saveToLocalStorage(data1);
  saveToLocalStorage(data2);
  loadLoggedHours();

  const totalHoursText = document.getElementById("total-hours").textContent;
  expect(totalHoursText).toBe("Total Hours Volunteered: 8");
});

test("delete button removes a record from the table", () => {
  const dom = new JSDOM(`
      <!DOCTYPE html>
      <section id="logged-hours-section">
          <h2>Logged Hours</h2>
          <table id="logged-hours-table">
              <thead>
                  <tr>
                      <th>Charity Name</th>
                      <th>Hours Volunteered</th>
                      <th>Date</th>
                      <th>Experience Rating</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  <!-- Rows will be injected with JavaScript here-->
              </tbody>
          </table>
      </section>
  `);
  global.document = dom.window.document;

  // Simulate adding an entry
  const data = { name: "charity 1", hours: 5, date: "2023-10-10", rating: 4 };
  saveToLocalStorage(data);
  loadLoggedHours();

  // Simulate delete button click
  const deleteButton = document.querySelector('.delete-button');
  deleteButton.click();

  // Check if the table is empty after deletion
  const loggedHoursTableBody = document.querySelector("#logged-hours-table tbody");
  expect(loggedHoursTableBody.rows.length).toBe(0);
});

test("delete button removes a record from localStorage", () => {
  const dom = new JSDOM(`
      <!DOCTYPE html>
      <section id="logged-hours-section">
          <h2>Logged Hours</h2>
          <table id="logged-hours-table">
              <thead>
                  <tr>
                      <th>Charity Name</th>
                      <th>Hours Volunteered</th>
                      <th>Date</th>
                      <th>Experience Rating</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  <!-- Rows will be injected with JavaScript here-->
              </tbody>
          </table>
      </section>
  `);
  global.document = dom.window.document;

  // Simulate adding entries
  const data1 = { name: "charity 1", hours: 5, date: "2023-10-10", rating: 4 };
  const data2 = { name: "charity 2", hours: 3, date: "2023-10-11", rating: 5 };
  saveToLocalStorage(data1);
  saveToLocalStorage(data2);
  loadLoggedHours();

  // Simulate delete button click for the first entry
  const deleteButton = document.querySelector('.delete-button');
  deleteButton.click();

  // Check if the localStorage has the correct number of entries after deletion
  const result = JSON.parse(localStorage.getItem("loggedHours"));
  expect(result.length).toEqual(1);
  expect(result[0]).toEqual(data2); 
});

test("total volunteered hours in the summary section is updated when a log is deleted", () => {
  const dom = new JSDOM(`
      <!DOCTYPE html>
      <section id="summary-section">
          <h2 id="total-hours">Total Hours Volunteered: 0</h2>
      </section>
      <section id="logged-hours-section">
          <h2>Logged Hours</h2>
          <table id="logged-hours-table">
              <thead>
                  <tr>
                      <th>Charity Name</th>
                      <th>Hours Volunteered</th>
                      <th>Date</th>
                      <th>Experience Rating</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  <!-- Rows will be injected with JavaScript here-->
              </tbody>
          </table>
      </section>
  `);
  global.document = dom.window.document;

  // Simulate adding entries
  const data1 = { name: "charity 1", hours: 5, date: "2023-10-10", rating: 4 };
  const data2 = { name: "charity 2", hours: 3, date: "2023-10-11", rating: 5 };
  saveToLocalStorage(data1);
  saveToLocalStorage(data2);
  loadLoggedHours();

  // Check initial total hours
  let totalHoursText = document.getElementById("total-hours").textContent;
  expect(totalHoursText).toBe("Total Hours Volunteered: 8");

  // Simulate delete button click for the first entry
  const deleteButton = document.querySelector('.delete-button');
  deleteButton.click();

  // Check updated total hours after deletion
  totalHoursText = document.getElementById("total-hours").textContent;
  expect(totalHoursText).toBe("Total Hours Volunteered: 3");
});
