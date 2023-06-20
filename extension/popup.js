// popup.js

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
  
    // Retrieve the form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const company = document.getElementById('company').value;
    const url = document.getElementById('url').value;
  
    // Perform further actions like sending the data to the server or interacting with the Monday.com API
  });
  