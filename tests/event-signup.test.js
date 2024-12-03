const { DISPLAY_NAME_VAR } = require("jest-junit/constants");
const { 
    attachEventListener,
    validateForm,
    formDataObject,
    validateEventName,
    validateRepresentativeName,
    validateRepresentativeEmail,
    validateRoleSelection,
    saveDatatoLocalStorage,
    displayData
    } = require("../event-signup");

const { JSDOM } = require("jsdom");
const { LocalStorage } = require("node-localstorage");
global.localStorage = new LocalStorage("./scratch");


test("validate form function is triggered when form is submitted", () => {
    const mockCallback = jest.fn(() => true);

    const dom = new JSDOM(`<!DOCTYPE html><form id="event-signup"></form>`)
    global.document = dom.window.document;

    const formNode = document.querySelector("#event-signup");

    attachEventListener(formNode, mockCallback);
    
    let submitEvent = new dom.window.Event("submit");

    formNode.dispatchEvent(submitEvent);
    expect(mockCallback).toHaveBeenCalled();

});



test("validateForm function correctly collects data on form submit", () => {
    const dom = new JSDOM(`<!DOCTYPE html>
                            <form id="event-signup">
                                <section id="event-name-section">
                                    <label for="event-name">Event Name: </label>
                                    <input type="text" name="event-name" id="event-name" value="FunRun2024">
                                </section>

                                <section id="representative-name-section">
                                    <label for="representative-name">Representative's Name: </label>
                                    <input type="text" name="representative-name" id="representative-name" value="Jimmy">
                                </section>

                                <section id="representative-email-section">
                                    <label for="representative-email">Representative's Email:</label>
                                    <input type="email" name="representative-email" id="representative-email" value="jimmy@gmail.com">
                                </section>

                                <section id="role-selection-section">
                                    <label for="role-selection">Role Selection:</label>
                                    <select name="role-selection" id="role-selection">
                                        <option value="">Select a role:</option>
                                        <option value="Sponsor" selected>Sponsor</option>
                                        <option value="Participant">Participant</option>
                                        <option value="Organizer">Organizer</option>
                                    </select>
                                </section>

                                <div>
                                    <button type="submit" id="submit-button">Submit</button>
                                </div>
                                <section id="signup-table-section">
                                <h2>
                                    Signups
                                </h2>
                                <table id="signup-table">
                                    <thead>
                                        <tr>
                                            <th>Event Name</th>
                                            <th>Representative's Name</th>
                                            <th>Representative's Email</th>
                                            <th>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody id="signup-table-body">
                                        <!-- Rows will me injected here with javascript -->
                                    </tbody>
                                </table>
                            </section>
                            </form>`)
    global.document = dom.window.document;

    let result = validateForm();
    let expected = ({event: "FunRun2024",
        name: "Jimmy",
        email: "jimmy@gmail.com",
        role: "Sponsor"
       })

    expect(result).toStrictEqual(expected)
})




test("function flags if event name is left empty", () => {
    let event = "";

    const dom = new JSDOM(`<!DOCTYPE html>
                                <form id="event-signup">
                                    <section id="event-name-section">
                                        <label for="event-name">Event Name: </label>
                                        <input type="text" name="event-name" id="event-name">
                                    </section>
                                </form>`)

    global.document = dom.window.document;

    const eventNameSection = document.querySelector("#event-name-section");
    let result = validateEventName(event, eventNameSection)

    expect(result).toBe(false);
});


test("function flags if representative's name is left empty", () => {
    let name = "";

    const dom = new JSDOM(`<!DOCTYPE html>
                                <form id="event-signup">
                                    <section id="representative-name-section">
                                        <label for="representative-name">Representative's Name: </label>
                                        <input type="text" name="representative-name" id="representative-name">
                                    </section>
                                </form>`)

    global.document = dom.window.document;

    const representativeNameSection = document.querySelector("#representative-name-section");
    let result = validateRepresentativeName(name, representativeNameSection);

    expect(result).toBe(false);

})


test("function flags if representative's email is left empty", () => {
    let email = "";

    const dom = new JSDOM(`<!DOCTYPE html>
                                <form id="event-signup">
                                    <section id="representative-email-section">
                                        <label for="representative-email">Representative's Email:</label>
                                        <input type="email" name="representative-email" id="representative-email">
                                    </section>
                                </form>`)

    global.document = dom.window.document;

    const representativeEmailSection = document.querySelector("#representative-email-section");
    let result = validateRepresentativeEmail(email, representativeEmailSection);

    expect(result).toBe(false);

})


test("function flags if role selection is left empty", () => {
    let role = "";

    const dom = new JSDOM(`<!DOCTYPE html>
                                <form id="event-signup">
                                    <section id="role-selection-section">
                                        <label for="role-selection">Role Selection:</label>
                                        <select name="role-selection" id="role-selection">
                                            <option value="">Select a role:</option>
                                            <option value="Sponsor">Sponsor</option>
                                            <option value="Participant">Participant</option>
                                            <option value="Organizer">Organizer</option>
                                        </select>
                                    </section>
                                </form>`)

    global.document = dom.window.document;

    const roleSectionSection = document.querySelector("#role-selection-section");
    let result = validateRoleSelection(role, roleSectionSection);

    expect(result).toBe(false);

})


test("function correctly identifies and flags when email is not in valid form", () => {
    let badEmail = "@jimmy.com";

    const dom = new JSDOM(`<!DOCTYPE html>
                                <form id="event-signup">
                                    <section id="representative-email-section">
                                        <label for="representative-email">Representative's Email:</label>
                                        <input type="email" name="representative-email" id="representative-email">
                                    </section>
                                </form>`)

    global.document = dom.window.document;

    const representativeEmailSection = document.querySelector("#representative-email-section");
    let result = validateRepresentativeEmail(badEmail, representativeEmailSection);

    expect(result).toBe(false);

})

test("formData object is created on valid form submission", () => {
    let event = "FunRun2024";
    let name = "Matt Damon";
    let email = "matt@gmail.com";
    let role = "Sponsor";

    let result = formDataObject(event, name, email, role);

    let expected = ({event: "FunRun2024",
                     name: "Matt Damon",
                     email: "matt@gmail.com",
                     role: "Sponsor"
                    })

    expect(result).toEqual(expected);
});



describe("test localStorage", () => {
    beforeEach(() => {
        // Clear local storage before each test
        localStorage.clear(); 
    });

    test("data stored in localStorage", () => {

        let expected = ({event: "FunRun2024",
            name: "Matt Damon",
            email: "matt@gmail.com",
            role: "Sponsor"
        })
    
        saveDatatoLocalStorage(expected);
        const result = JSON.parse(localStorage.getItem("storedData"));

        expect(result[0]).toEqual(expected);
    });


    test("data is retrieved and displayed to table", () => {
        const dom = new JSDOM(`<!DOCTYPE html>
                                <section id="signup-table-section">
                                    <table id="signup-table">
                                        <thead>
                                            <tr>
                                                <th>Event Name</th>
                                                <th>Representative's Name</th>
                                                <th>Representative's Email</th>
                                                <th>Role</th>
                                            </tr>
                                        </thead>
                                        <tbody id="signup-table-body">
                                            <!-- Rows will me injected here with javascript -->
                                        </tbody>
                                    </table>
                                </section>`)

        global.document = dom.window.document;
        
        let formData = {
            event: "FunRun2024",
            name: "Matt Damon",
            email: "matt@gmail.com",
            role: "Sponsor"
            };

        saveDatatoLocalStorage(formData);
        displayData();

        expected = global.document.querySelector("#signup-table-body").innerHTML;
        actualHTML = ('<tr><td>FunRun2024</td><td>Matt Damon</td><td>matt@gmail.com</td><td>Sponsor</td><td><button class=\"delete-button\">X</button></td></tr>');

        expect(expected).toBe(actualHTML);
    });

    test("table correctly displays signups by role", () => {
        const dom = new JSDOM(`<!DOCTYPE html>
                                    <section id="signup-table-section">
                                        <table id="signup-table">
                                            <thead>
                                                <tr>
                                                    <th>Event Name</th>
                                                    <th>Representative's Name</th>
                                                    <th>Representative's Email</th>
                                                    <th>Role</th>
                                                </tr>
                                            </thead>
                                            <tbody id="signup-table-body">
                                                <!-- Rows will me injected here with javascript -->
                                            </tbody>
                                        </table>
                                    </section>`)

        global.document = dom.window.document;
        
        let formData = [
            {event: "FunRun2024", name: "Matt Damon", email: "matt@gmail.com", role: "Sponsor" },
            {event: "RacefortheCure", name: "Michael Scott", email: "dmifflin@gmail.com", role: "Organizer" },
            {event: "Olympics", name: "Usain Bolt", email: "speed@gmail.com", role: "Participant" },
            {event: "ManitobaMarathon", name: "Jimmy Tran", email: "jimmy@gmail.com", role: "Sponsor" },
            {event: "TerryFoxRun", name: "Terry Fox", email: "tfox@gmail.com", role: "Organizer" },
            {event: "PistonCup", name: "Lightning McQueen", email: "speed@gmail.com", role: "Participant" },
        ];

        formData.forEach(formData => {
            saveDatatoLocalStorage(formData);
        })

        displayData();

        expected = global.document.querySelector("#signup-table-body").textContent;
        actualHTML = ('RacefortheCureMichael Scottdmifflin@gmail.comOrganizerX' +
                      'TerryFoxRunTerry Foxtfox@gmail.comOrganizerX' +
                      'OlympicsUsain Boltspeed@gmail.comParticipantX' +
                      'PistonCupLightning McQueenspeed@gmail.comParticipantX'+
                      'FunRun2024Matt Damonmatt@gmail.comSponsorX' +
                      'ManitobaMarathonJimmy Tranjimmy@gmail.comSponsorX'
                    );

        expect(expected).toBe(actualHTML);
    })

});



describe("test delete button works", () => {
    beforeEach(() => {
        // Clear local storage before each test
        localStorage.clear(); 
    })

    test("delete button removes a record from table", () => {
        const dom = new JSDOM(`<!DOCTYPE html>
                                    <section id="signup-table-section">
                                        <table id="signup-table">
                                            <thead>
                                                <tr>
                                                    <th>Event Name</th>
                                                    <th>Representative's Name</th>
                                                    <th>Representative's Email</th>
                                                    <th>Role</th>
                                                </tr>
                                            </thead>
                                            <tbody id="signup-table-body">
                                                <!-- Rows will me injected here with javascript -->
                                            </tbody>
                                        </table>
                                    </section>`)

        global.document = dom.window.document;

        let formData = [
            {event: "FunRun2024", name: "Matt Damon", email: "matt@gmail.com", role: "Sponsor" },
            {event: "Olympics", name: "Usain Bolt", email: "speed@gmail.com", role: "Participant" },
            {event: "RacefortheCure", name: "Michael Scott", email: "dmifflin@gmail.com", role: "Organizer" },
        ];

        formData.forEach(formData => {
            saveDatatoLocalStorage(formData);
        })

        displayData();

        const deleteButton = document.querySelector('.delete-button');
        // deletes the latest entry
        deleteButton.click();

        expected = global.document.querySelector("#signup-table-body").textContent;
        actualHTML = ('OlympicsUsain Boltspeed@gmail.comParticipantX' +
                      'FunRun2024Matt Damonmatt@gmail.comSponsorX'
                    );
        
        expect(expected).toBe(actualHTML);
    });

    test("delete button removes a record from localStorage", () => {
        const dom = new JSDOM(`<!DOCTYPE html>
                                    <section id="signup-table-section">
                                        <table id="signup-table">
                                            <thead>
                                                <tr>
                                                    <th>Event Name</th>
                                                    <th>Representative's Name</th>
                                                    <th>Representative's Email</th>
                                                    <th>Role</th>
                                                </tr>
                                            </thead>
                                            <tbody id="signup-table-body">
                                                <!-- Rows will me injected here with javascript -->
                                            </tbody>
                                        </table>
                                    </section>`)

        global.document = dom.window.document;

        let formData = [
            {event: "FunRun2024", name: "Matt Damon", email: "matt@gmail.com", role: "Sponsor" },
            {event: "Olympics", name: "Usain Bolt", email: "speed@gmail.com", role: "Participant" },
            {event: "RacefortheCure", name: "Michael Scott", email: "dmifflin@gmail.com", role: "Organizer" },
        ];

        formData.forEach(formData => {
            saveDatatoLocalStorage(formData);
        })

        displayData();

        const deleteButton = document.querySelector('.delete-button');
        // deletes the latest entry
        deleteButton.click();

        const result = JSON.parse(localStorage.getItem("storedData"));
        expect(result.length).toEqual(2);
    });

});