function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(u => u.email === email)) {
    alert("Email already registered");
    return;
  }

  users.push({ name, email, password, balance: 0, transactions: [] });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registered Successfully");
  window.location.href = "login.html";
}

function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password");
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));
  window.location.href = "dashboard.html";
}

function loginWithPin() {
  const email = document.getElementById("pinEmail").value;
  const pin = document.getElementById("pinLogin").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.pin === pin);

  if (!user) {
    alert("Invalid Email or PIN");
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));
  window.location.href = "dashboard.html";
}

function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

function checkAuth() {
  if (!localStorage.getItem("loggedInUser")) {
    window.location.href = "login.html";
  }
}
