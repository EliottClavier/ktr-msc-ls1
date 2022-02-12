const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const mismatchPasswordError = document.getElementById('mismatch-password-error');

password.addEventListener('keyup', () => {
  mismatchPasswordError.style.display = "none";
});

confirmPassword.addEventListener('keyup', () => {
  mismatchPasswordError.style.display = "none";
});

const checkFormProfile = () => {
  let form = document.getElementById('form-profile');
  let formData = new FormData(form);

  if (formData.get('password') !== formData.get('confirmPassword')) {
    mismatchPasswordError.style.display = "block";
    return false;
  }

  if (form.reportValidity()) {
    form.submit();
  }
  return false;
}
