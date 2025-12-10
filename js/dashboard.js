// THEME INIT
function initTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// TOASTS
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast " + type;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// LOADER
function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
}
function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}

function loadDashboard() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  document.getElementById("welcome").innerText = `Welcome, ${user.name}`;
  document.getElementById("balance").innerText = user.balance;
  displayTransactions();
}

function deposit() {
  updateBalance("deposit");
}

function withdraw() {
  updateBalance("withdraw");
}

function updateBalance(type) {
  showLoader();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const amount = parseFloat(document.getElementById("amount").value);

  if (isNaN(amount) || amount <= 0) {
    hideLoader();
    showToast("Enter a valid amount", "error");
    return;
  }

  if (type === "withdraw" && amount > user.balance) {
    hideLoader();
    showToast("Insufficient funds", "error");
    return;
  }

  user.balance = type === "deposit" ? user.balance + amount : user.balance - amount;

  user.transactions.push({
    type,
    amount,
    date: new Date().toLocaleString(),
    month: new Date().getMonth()
  });

  saveUser(user);
  loadDashboard();
  drawChart();
  hideLoader();
  showToast(type === "deposit" ? "Deposit successful" : "Withdrawal successful", "success");
}

function saveUser(updatedUser) {
  const users = JSON.parse(localStorage.getItem("users"));
  const index = users.findIndex(u => u.email === updatedUser.email);
  users[index] = updatedUser;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
}

function displayTransactions() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const list = document.getElementById("transactionList");
  list.innerHTML = "";
  user.transactions.forEach(t => {
    const li = document.createElement("li");
    li.innerText = `${t.type.toUpperCase()} - ₹${t.amount} - ${t.date}`;
    list.appendChild(li);
  });
}

function drawChart() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const amounts = user.transactions.map(t => t.type === "deposit" ? t.amount : -t.amount);
  const canvas = document.getElementById("balanceChart");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(10, 150);

  let total = 0;
  for (let i = 0; i < amounts.length; i++) {
    total += amounts[i];
    ctx.lineTo(10 + (i * 30), 150 - total * 0.1); // scaling factor
  }
  ctx.strokeStyle = "#0066ff";
  ctx.stroke();
}

function monthlySpend() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const month = new Date().getMonth();

  const spent = user.transactions
    .filter(t => t.type === "withdraw" && t.month === month)
    .reduce((sum, t) => sum + t.amount, 0);

  showToast("This month you spent: ₹" + spent, "info");
}

function goalPrediction() {
  const goal = parseFloat(document.getElementById("goalAmount").value);
  const save = parseFloat(document.getElementById("goalMonthly").value);
  if (isNaN(goal) || isNaN(save) || goal <= 0 || save <= 0) {
    showToast("Enter valid goal and monthly amount", "error");
    return;
  }
  const months = Math.ceil(goal / save);
  document.getElementById("goalResult").innerText =
    `Goal will be achieved in ${months} months (~${(months / 12).toFixed(1)} years).`;
}

function exportPDF() {
  showLoader();
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  let content = `
WealthWise Hub Report
User: ${user.name}
Email: ${user.email}
Current Balance: ₹${user.balance}
Total Transactions: ${user.transactions.length}
Generated: ${new Date().toLocaleString()}
`;
  const blob = new Blob([content], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bank-report.pdf";
  a.click();
  hideLoader();
  showToast("PDF downloaded", "success");
}

function exportCSV() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const rows = [
    ["Type", "Amount", "Date"]
  ];
  user.transactions.forEach(t => {
    rows.push([t.type, t.amount, t.date]);
  });

  let csvContent = rows.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  showToast("CSV exported", "success");
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}
