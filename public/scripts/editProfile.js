function checkNewPassword() {
    var newPasswordInput = document.getElementById("newPassword");
    var confirmPasswordInput = document.getElementById("confirmPassword");
    if (newPasswordInput.value !== "") {
      confirmPasswordInput.required = true;
    } else {
      confirmPasswordInput.required = false;
    }
  }