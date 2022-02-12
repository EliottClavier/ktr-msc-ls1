const logout = () => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/profile/logout", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
  window.location.href = '/profile';
}
