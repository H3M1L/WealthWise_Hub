function saveUser(updated) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.map(u => u.email === updated.email ? updated : u);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", JSON.stringify(updated));
}

function loadDashboard() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  document.getElementById("welcome").innerText = `Welcome, ${user.name}`;
  document.getElementById("balance").innerText = user.balance;
  document.getElementById("dashProfileImage").src = user.profilePic || "default-avatar.png";
  displayTransactions();
}

function deposit() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const amount = parseInt(document.getElementById("amount").value);
  if (!amount || amount <= 0) return alert("Invalid amount");

  user.balance += amount;
  user.transactions.push({ type:"deposit", amount, date:new Date().toLocaleString() });
  saveUser(user);
  loadDashboard();
}

function withdraw() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const amount = parseInt(document.getElementById("amount").value);
  if (!amount || amount <= 0) return alert("Invalid amount");
  if (amount > user.balance) return alert("Insufficient balance");

  user.balance -= amount;
  user.transactions.push({ type:"withdraw", amount, date:new Date().toLocaleString() });
  saveUser(user);
  loadDashboard();
}

/* PROFILE */
function uploadProfilePic() {
  const file = document.getElementById("imageUpload").files[0];
  const reader = new FileReader();
  reader.onload = e => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    user.profilePic = e.target.result;
    saveUser(user);
    document.getElementById("profileImage").src = user.profilePic;
  };
  reader.readAsDataURL(file);
}

function removeProfilePic() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  delete user.profilePic;
  saveUser(user);
  document.getElementById("profileImage").src = "default-avatar.png";
}

function loadProfile() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  document.getElementById("profileName").innerText = user.name;
  document.getElementById("profileEmail").innerText = user.email;
  document.getElementById("profileBalance").innerText = user.balance;
  document.getElementById("profileTxCount").innerText = user.transactions.length;
  document.getElementById("profileImage").src = user.profilePic || "default-avatar.png";
  document.getElementById("editName").value = user.name;
  document.getElementById("editEmail").value = user.email;
}

function updateProfile() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  user.name = document.getElementById("editName").value;
  user.email = document.getElementById("editEmail").value;
  saveUser(user);
  alert("Profile Updated");
}

function changePassword() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const oldPass = document.getElementById("oldPassword").value;
  const newPass = document.getElementById("newPassword").value;

  if (oldPass !== user.password) return alert("Wrong password");
  user.password = newPass;
  saveUser(user);
  alert("Password changed");
}

/* PIN */
function setPin() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const pin = document.getElementById("pinInput").value;
  if (pin.length !== 4) return alert("PIN must be 4 digits");
  user.pin = pin;
  saveUser(user);
  alert("PIN Saved");
}

/* SEARCH / FILTER / SORT */
let txFilter = "all";
function setFilter(f) { txFilter = f; updateTxView(); }

function displayTransactions() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  let txs = [...user.transactions];

  const search = document.getElementById("searchTx")?.value?.toLowerCase() || "";
  if (search) txs = txs.filter(t => t.type.includes(search) || t.date.includes(search));

  if (txFilter !== "all") txs = txs.filter(t => t.type === txFilter);

  const sortVal = document.getElementById("sortTx")?.value || "latest";
  if (sortVal === "latest") txs.sort((a,b)=>new Date(b.date)-new Date(a.date));
  if (sortVal === "oldest") txs.sort((a,b)=>new Date(a.date)-new Date(b.date));
  if (sortVal === "high") txs.sort((a,b)=>b.amount - a.amount);
  if (sortVal === "low") txs.sort((a,b)=>a.amount - b.amount);

  const list = document.getElementById("transactionList");
  list.innerHTML = "";
  txs.forEach(t => {
    const li = document.createElement("li");
    li.innerText = `${t.type.toUpperCase()} | ₹${t.amount} | ${t.date}`;
    list.appendChild(li);
  });
}

function updateTxView() { displayTransactions(); }

/* PDF + CSV */
function exportPDF() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const content = `
   === WealthWise Report ===
   Name: ${user.name}
   Balance: ₹${user.balance}
   Total Transactions: ${user.transactions.length}
  `;
  const blob = new Blob([content], { type: "application/pdf" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "WealthWise_Report.pdf";
  a.click();
}

function exportCSV() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  let csv = "Type,Amount,Date\n";
  user.transactions.forEach(t => csv += `${t.type},₹${t.amount},${t.date}\n`);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv]));
  a.download = "transactions.csv";
  a.click();
}

/* AI ADVICE */
function getAdvice() {
  const q = document.getElementById("adviceInput").value.toLowerCase();
  let ans = "Stay consistent and diversify for long-term wealth.";
  if (q.includes("sip")) ans = "Increase SIP yearly with salary growth.";
  if (q.includes("emi") || q.includes("loan")) ans = "Keep EMIs under 40% of income.";
  if (q.includes("stocks")) ans = "Don't invest emotionally & diversify.";
  document.getElementById("adviceOutput").innerText = ans;
}

/* THEME MODAL */
function openThemeModal() { document.getElementById("themeModal").classList.remove("hidden"); }
function closeThemeModal() { document.getElementById("themeModal").classList.add("hidden"); }

function setTheme(themeName) {
  document.body.classList.remove("theme-purple", "theme-green", "theme-gold");
  if (themeName !== "default") document.body.classList.add(themeName);
  localStorage.setItem("themeMode", themeName);
}

function initTheme() {
  const saved = localStorage.getItem("themeMode");
  if (saved && saved !== "default") document.body.classList.add(saved);
}

/* SCROLL */
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}
