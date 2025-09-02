// Script for the editable fields
    const fields = document.querySelectorAll(".field");
    let activeEditField = null;
	
    fields.forEach(field => {
      const displaySpan = field.querySelector(".display");
      const editInput = field.querySelector(".edit");
      const editBtn = field.querySelector(".edit-btn");
      const cancelBtn = field.querySelector(".cancel-btn");

      let originalValue = displaySpan.textContent.trim();
      let editing = false;

      editBtn.addEventListener("click", () => {
        if (!editing) {
          // Close any other open edit fields
          if (activeEditField && activeEditField !== field) {
            const otherDisplay = activeEditField.querySelector(".display");
            const otherInput = activeEditField.querySelector(".edit");
            const otherEditBtn = activeEditField.querySelector(".edit-btn");
            const otherCancelBtn = activeEditField.querySelector(".cancel-btn");
            otherDisplay.style.display = "inline";
            otherInput.style.display = "none";
            otherEditBtn.textContent = "✏️";
            otherCancelBtn.style.display = "none";
            activeEditField.editing = false;
          }

          // Enter edit mode
          originalValue = displaySpan.textContent.trim();
          editInput.value = originalValue;
          displaySpan.style.display = "none";
          editInput.style.display = "inline";
          editBtn.textContent = "✔️";
          cancelBtn.style.display = "inline";
          editing = true;
          activeEditField = field;
        } else {
          // Save changes
          const newValue = editInput.value.trim();
          if (newValue === "" || newValue === originalValue) {
            displaySpan.textContent = originalValue;
          } else {
            displaySpan.textContent = newValue;
          }

          // Exit edit mode
          displaySpan.style.display = "inline";
          editInput.style.display = "none";
          editBtn.textContent = "✏️";
          cancelBtn.style.display = "none";
          editing = false;
          activeEditField = null;
        }
      });

      cancelBtn.addEventListener("click", () => {
        // Cancel changes and revert
        displaySpan.textContent = originalValue;
        displaySpan.style.display = "inline";
        editInput.style.display = "none";
        editBtn.textContent = "✏️";
        cancelBtn.style.display = "none";
        editing = false;
        activeEditField = null;
      });

      field.editing = editing;
    });
	
// Restriction logic for edit fields
fields.forEach(field => {
  const editInput = field.querySelector(".edit");

  if (editInput) {
    // Example: block "@" in name/location/about/skills fields
    if (editInput.type === "text" || editInput.tagName === "TEXTAREA") {
      editInput.addEventListener("keypress", function (e) {
        if (e.key === "@") {
          e.preventDefault();
          alert("The @ symbol is not allowed here.");
        }
      });
    }

    // Example: enforce email format for email field
    if (editInput.type === "email") {
      editInput.addEventListener("input", function () {
        const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
        if (!emailPattern.test(editInput.value)) {
          editInput.setCustomValidity("Please enter a valid email address.");
        } else {
          editInput.setCustomValidity("");
        }
      });
    }
  }
});