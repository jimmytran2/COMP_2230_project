const { 
    attachEventListener,
    formDataObject,
    validateEventName,
    validateRepresentativeName,
    validateRepresentativeEmail,
    validateRoleSelection
    } = require("../event-signup");

const { JSDOM } = require("jsdom");


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

    expect(result).toStrictEqual(expected);
});


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

    const eventNameSection = document.querySelector("#event-name");

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

    let email = "@jimmy.com";

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