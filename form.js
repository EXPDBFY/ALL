document.addEventListener('DOMContentLoaded', function() {
  // Set today's date in the date input
  var now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth() + 1;
  var d = now.getDate();
  m = m < 10 ? "0" + m : m;
  d = d < 10 ? "0" + d : d;
  document.querySelector("input[type=date]").value = y + "-" + m + "-" + d;

  // Close all groups by default
  document.querySelectorAll('.group-header').forEach(header => {
    const group = header.dataset.group;
    const rows = document.querySelectorAll(`.${group}`);
    rows.forEach(row => {
      row.classList.add('hidden');
    });
  });
});

// Function to toggle favorite status when a button is clicked
function toggleFavorite(btn) {
  var hiddenInput = btn.nextElementSibling;
  if (hiddenInput && hiddenInput.type === "hidden") {
    hiddenInput.value = "true";
    btn.classList.add("favorite-selected");
    // Optionally disable the button after marking as favorite
    btn.disabled = true;
  }
}

// Function to show the modal
function showModal(message) {
  var modal = document.getElementById("myModal");
  var modalNote = document.getElementById("modalNote");

  // Set the message in the modal
  modalNote.textContent = message;

  // Show the modal
  modal.style.display = "block";

  // Add event listener to close the modal when the close button is clicked
  var closeButton = document.getElementsByClassName("close")[0];
  closeButton.addEventListener("click", function() {
    modal.style.display = "none";
  });

  // Close the modal when clicking outside of it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

// Add event listener to the form submission
document.getElementById("myForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Remove previous error highlighting
  document.querySelectorAll('.error').forEach(function(element) {
    element.classList.remove('error');
  });

  // Collect form data
  var formData = new FormData(this);
  var valid = true;

  // Define categories with corresponding IDs
  var categories = [
    'Food',
    'Bills',
    'Housing',
    'Transports',
    'Shopping',
    'Personal_Discretionary',
    'Income',
    'Cashback',
    'Credit_Card',
    'Card_Bill',
    'Invest',
    'Returns',
    'S&G',
    'Debt',
    'OC-Revenue',
    'OC-Savings',
    'OC-Liabilities'
  ];

  // Validate each category
  categories.forEach(function(category) {
    var description = formData.get(category + '_Description');
    var amount = formData.get(category + '_Amount');

    // Check if amount is filled and description is missing
    if (amount && !description) {
      valid = false;
      document.getElementById(category + '_Description').classList.add('error');
      showModal('Please provide a description for ' + category.replace('_', ' ') + '.');
    }

    // Check if description is filled and amount is missing
    if (description && !amount) {
      valid = false;
      document.getElementById(category + '_Amount').classList.add('error');
      showModal('Please provide an amount for ' + category.replace('_', ' ') + '.');
    }
  });

  if (!valid) return;

  // Show the modal immediately to indicate form submission is in progress
  showModal("Submitting form...");

  // Perform an AJAX request to submit the form
  var xhr = new XMLHttpRequest();
  xhr.open("POST", this.action);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // Successful response
        var response = xhr.responseText;
        showModal(response); // Show the modal with the response message
        document.getElementById("myForm").reset(); // Clear the form fields
        window.location.href = "Dashboard.html";
      } else {
        // Error response
        showModal("Error: Something went wrong."); // Show a generic error message
      }
    }
  };
  xhr.send(formData);
});

// Add toggle functionality for group headers
document.querySelectorAll('.group-header').forEach(header => {
  header.addEventListener('click', () => {
    const group = header.dataset.group;
    const arrow = header.querySelector('.arrow');
    const rows = document.querySelectorAll(`.${group}`);

    rows.forEach(row => {
      row.classList.toggle('hidden');
    });

    arrow.classList.toggle('rotate-up');
  });
});
