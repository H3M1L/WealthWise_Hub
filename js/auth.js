function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(user => user.email === email)) {
    alert("Email already registered!");
    return;
  }

  users.push({ name, email, password, balance: 0, transactions: [] });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registered Successfully!");
  window.location.href = "login.html";
}

function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid Credentials");
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));
  window.location.href = "dashboard.html";
}

function checkAuth() {
  const user = localStorage.getItem("loggedInUser");
  if (!user) window.location.href = "login.html";
}

function logoutUser() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}
