// constants
const mondayApiKey =
  "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI2MzIyMTM5NiwiYWFpIjoxMSwidWlkIjo0NDU5NjMzNCwiaWFkIjoiMjAyMy0wNi0xN1QxNTozNzo1OC4yMTNaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTc0MzExNjIsInJnbiI6InVzZTEifQ.d0fww48glqurlUJ9NcCud6rQYOVNdY_cGw7ypcVGkxk";
const mondayApiUrl = "https://api.monday.com/v2";
const getProspectWithURLSnovApi = "https://api.snov.io/v1/get-emails-from-url";
const addUrlForSearchApiUrl = "https://api.snov.io/v1/add-url-for-search";
const generateAccessTokenApiUrl = "https://api.snov.io/v1/oauth/access_token";
var accessToken = "";
// Replace with your board ID
const boardId = 4661502644; 
// Replace with your group ID
const groupId = "topics"; 

const client_id = "80bb001ad4a3a3e792e7016a0df0ca08";
const client_secret = "a5d32c77beb7db0ab6292a4be4a80ff3";

//regex pattern - to match the linkedin page url
const regex = /^https:\/\/www\.linkedin\.com\/in\/([^/]+)\/$/;
const regexProfileUrl = /\/in\/([\w-]+)\//;

// will run in the start of the page, listen to link changes , when it matches with the user profile path url, the script will run

// 1. when we click on name, profile picture on home feed, we match the upper parent element which a <a  href="/in/irahulsah"/> and get the href to compare with the regex
window.addEventListener("click", function (event) {
  const anchorElement = event.target.closest("a");
  if (anchorElement) {
    const hrefValue = anchorElement.getAttribute("href");
    if (hrefValue.match(regexProfileUrl)) {
      window.addEventListener("load", function () {
        runScript();
      });

      // Navigate to the profile page
      window.location.href = hrefValue;
    }
    // Do something with hrefValue
  }
});

// even if we reload the page, the code must execute

window.onload = function () {
  const match = window.location.href.match(regex);
  if (match) {
    runScript();
  }
};

// whenever user go any profile page , the script will run .
function runScript() {
  //fetch and initialze the access_token
  getToken();

  // Find the profile name element
  const profileNameElement = document.querySelector(
    ".pv-text-details__left-panel"
  );
  console.log(profileNameElement, "profileNameElement");

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
  const openFormPopup = async () => {
    //fetch email from snov api, first retrive the information, if it is failed or prospect  not found, we will add the url to search and re-hit the getEmailFromSnovApiAndSetEmailInForm;
    // set email in the dom element/
    getEmailFromSnovApiAndSetEmailInForm();

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
        Authorization: mondayApiKey,
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

  function getEmailFromSnovApiAndSetEmailInForm() {
    // initially clear previous email, as it is fetched from snov api
    document.getElementById("email").value = "";

    const profileUrl = window.location.href;
    fetch(getProspectWithURLSnovApi, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,
        url: profileUrl,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // for this , we have to use snov email finder from backend, since from frontend there is cors issue.
        if (res.success) {
          document.getElementById("email").value =
            res.data.emails.at(-1)?.email ?? "";
        } else {
          addUrlForSnovApiSearch();
        }
      });
  }
  async function addUrlForSnovApiSearch() {
    const profileUrl = window.location.href;
    const res = await fetch(addUrlForSearchApiUrl, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,
        url: profileUrl,
      }),
    });
    const resp = await res.json();
    if (resp.success) {
      getEmailFromSnovApiAndSetEmailInForm();
    }
  }
}

// get the access_token and store in a variable for apis calls
function getToken() {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: client_id,
      client_secret: client_secret,
    }),
  };

  fetch(generateAccessTokenApiUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data, which will contain the access_token
      accessToken = data.access_token;
      // Use the access_token for subsequent API requests
    })
    .catch((error) => {
      // Handle any errors
    });
}
