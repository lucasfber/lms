const formLogin = document.querySelector("#form-login");
let btnLogin = document.querySelector("#btn-login");
let currentUser = null;

btnLogin.innerHTML =
  localStorage.getItem("user") === null
    ? "Login"
    : localStorage.getItem("user");

formLogin.addEventListener("submit", function(e) {
  e.preventDefault();
  currentUser = e.target.user.value;

  localStorage.setItem("user", currentUser);
});

localStorage.removeItem("user");
