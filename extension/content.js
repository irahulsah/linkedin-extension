// constants
const mondayApiUrl = "https://api.monday.com/v2";
const apiKey =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI2MzIyMTM5NiwiYWFpIjoxMSwidWlkIjo0NDU5NjMzNCwiaWFkIjoiMjAyMy0wNi0xN1QxNTozNzo1OC4yMTNaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTc0MzExNjIsInJnbiI6InVzZTEifQ.d0fww48glqurlUJ9NcCud6rQYOVNdY_cGw7ypcVGkxk";
const boardId = 4661502644; // Replace with your board ID
const groupId = "topics"; // Replace with your group ID

// Find the profile name element
const profileNameElement = document.querySelector(
  ".pv-text-details__left-panel"
);

// Find the <h1> tag inside the profile name element
const h1Element = profileNameElement.querySelector("h1");

// Create the save button element
const saveButtonElement = document.createElement("button");
saveButtonElement.innerText = "Save";
saveButtonElement.style.backgroundColor = "#0077B5";
saveButtonElement.style.color = "white";
saveButtonElement.style.padding = "10px 20px";
saveButtonElement.style.margin = "10px 20px";

// Add the button as a sibling to the <h1> tag (beside user name)
h1Element.insertAdjacentElement("afterend", saveButtonElement);

// Create the form popup elements
const popupContainer = document.createElement("div");
popupContainer.id = "contactForm";
popupContainer.classList.add("popup-container");
popupContainer.style.display = "none";

const popupForm = document.createElement("div");
popupForm.classList.add("popup-form");

// close icon to close popup
const closeIcon = document.createElement("div");
closeIcon.classList.add("close-icon");
closeIcon.innerHTML = "&#10005;";

popupForm.innerHTML = `
  <h2>Save Contact Information</h2>
  <form id="contactForm">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>

    <label for="company">Company:</label>
    <input type="text" id="company" name="company">

    <label for="url">URL:</label>
    <input type="url" id="url" name="url">

    <button type="submit">Save</button>
  </form>
`;

popupForm.appendChild(closeIcon);
popupContainer.appendChild(popupForm);

// Function to open the form popup
const openFormPopup = () => {
  popupContainer.style.display = "block";
  document.body.classList.add("popup-open");

  // set name, email, company, url
  setData();
};

// Append the form popup to the document body
document.body.appendChild(popupContainer);

// set name, email, company, url
function setData() {
  const rightPanelElement = document.querySelector(
    ".pv-text-details__right-panel"
  );
  const companyNameElement = rightPanelElement.querySelector(
    ".pv-text-details__right-panel-item-text"
  );
  const companyName = companyNameElement.textContent.trim();

  document.getElementById("name").value = h1Element.innerText;
  document.getElementById("email").value = "rahulsah3660@gmail.com";
  document.getElementById("company").value = companyName;
  document.getElementById("url").value = window.location.href;
}

// Add event listener to the "Save" button
saveButtonElement.addEventListener("click", openFormPopup);

// Function to close the form popup
const closeFormPopup = () => {
  popupContainer.style.display = "none";
  document.body.classList.remove("popup-open");
};

// Add event listener to the close icon to close the form popup
closeIcon.addEventListener("click", closeFormPopup);

// Add event listener to the form submit event
document.addEventListener("submit", (event) => {
  if (event.target.id === "contactForm") {
    event.preventDefault();

    // Get the values entered by the user
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const company = document.getElementById("company").value;
    const url = document.getElementById("url").value;

    saveToMonday(name, email, company, url);

    // Hide the form popup after submission
    closeFormPopup();
  }
});

// Function to save form data to monday.com
function saveToMonday(name, email, company, url) {
  const variables = {
    boardId: boardId,
    itemName: name,
    groupId: groupId,
    columnValues: JSON.stringify({
      company: company,
      url: url,
      email: email,
    }),
  };

  const query = `mutation create_item ($boardId: Int!, $groupId: String!, $itemName: String!, $columnValues: JSON!) { 
    create_item (
        board_id: $boardId,
        group_id: $groupId,
        item_name: $itemName, 
        column_values: $columnValues
    ) 
    { 
        id
    } 
}`;

  fetch(mondayApiUrl, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      query: query,
      variables: JSON.stringify(variables),
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      const itemId = res.data.create_item.id;

      // since for this particular item , we will save the user about info in the chat.
      updateDescriptionOfUserInItemChat(itemId);
    });
}

// Function to update "About Us" of user content in monday.com item chat board.
const updateDescriptionOfUserInItemChat = async (itemId) => {
  // targeted the class for the about us content
  const aboutUsDiv = document.querySelector(
    ".inline-show-more-text.full-width"
  );
  const aboutUsContent = aboutUsDiv.textContent.trim();

  // inject item_id which is taken after task gets created  and aboutUsContent
  let query = `mutation {
    create_update (item_id: ${itemId}, body: "${aboutUsContent}") {
      id
    }
  }`;

  fetch(mondayApiUrl, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      query: query,
    }),
  })
    .then((res) => res.json())
    .then((res) => console.log(JSON.stringify(res, null, 2)));
};
