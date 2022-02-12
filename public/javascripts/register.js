const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const mismatchPasswordError = document.getElementById('mismatch-password-error');

const name = document.getElementById('name');
const userAlreadyExistsError = document.getElementById('user-already-exists-error');

password.addEventListener('keyup', () => {
  mismatchPasswordError.style.display = "none";
});

confirmPassword.addEventListener('keyup', () => {
  mismatchPasswordError.style.display = "none";
});

name.addEventListener('keyup', () => {
  userAlreadyExistsError.style.display = "none";
});

const checkFormProfile = (users) => {
  let form = document.getElementById('form-profile');
  let formData = new FormData(form);

  if (formData.get('password') !== formData.get('confirmPassword')) {
    mismatchPasswordError.style.display = "block";
    return false;
  }

  if (formData.get('name') && users.includes(formData.get('name'))) {
    userAlreadyExistsError.style.display = "block";
    return false;
  }

  if (form.reportValidity()) {
    form.submit();
  }
  return false;
}
