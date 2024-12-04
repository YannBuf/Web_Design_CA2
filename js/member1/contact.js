document.addEventListener("DOMContentLoaded", function () {
    // Get the form element
    const form = document.querySelector("form");
  
    // Add event listener for form submission
    form.addEventListener("submit", function (event) {
      // Get form fields
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const subject = document.getElementById("subject");
      const message = document.getElementById("message");
  
      // Clear previous error messages
      clearErrorMessages();
  
      // Validate name
      if (name.value.trim() === "") {
        displayError(name, "Name is required.");
        event.preventDefault();
      }
  
      // Validate email
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (email.value.trim() === "") {
        displayError(email, "Email is required.");
        event.preventDefault();
      } else if (!emailPattern.test(email.value)) {
        displayError(email, "Please enter a valid email address.");
        event.preventDefault();
      }
  
      // Validate subject
      if (subject.value.trim() === "") {
        displayError(subject, "Subject is required.");
        event.preventDefault();
      }
  
      // Validate message
      if (message.value.trim() === "") {
        displayError(message, "Message is required.");
        event.preventDefault();
      }
    });
  
    // Function to display error messages
    function displayError(input, message) {
      const errorElement = document.createElement("div");
      errorElement.classList.add("text-danger", "mt-1");
      errorElement.textContent = message;
      input.classList.add("is-invalid");
  
      // Append error message below the input field
      input.parentElement.appendChild(errorElement);
    }
  
    // Function to clear error messages
    function clearErrorMessages() {
      const errorMessages = document.querySelectorAll(".text-danger");
      const invalidInputs = document.querySelectorAll(".is-invalid");
  
      errorMessages.forEach(function (message) {
        message.remove();
      });
      invalidInputs.forEach(function (input) {
        input.classList.remove("is-invalid");
      });
    }
  });
  