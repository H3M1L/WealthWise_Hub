/* SAVE USER */
function saveUser(updated) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.map(u => u.email === updated.email ? updated : u);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", JSON.stringify(updated));
}

/* DASHBOARD LOAD */
function loadDashboard() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return;
  document.getElementById("welcome").innerText = `Welcome, ${user.name}`;
  document.getElementById("balance").innerText = user.balance;
  document.getElementById("dashProfileImage").src = user.profilePic || "default-avatar.png";
  displayTransactions();
}

/* DEPOSIT & WITHDRAW */
function deposit() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const amount = parseInt(document.getElementById("amount").value);
  if (!amount || amount <= 0) return alert("Invalid amount");

  user.balance += amount;
  user.transactions.push({ type:"deposit", amount, date:new Date().toLocaleString() });
  saveUser(user);
  loadDashboard();
  drawChart();
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
  drawChart();
}

/* SIMPLE BALANCE CHART */
function drawChart() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const canvas = document.getElementById("balanceChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);

  let total = 0;
  const points = user.transactions.map((t,i) => {
    total += t.type === "deposit" ? t.amount : -t.amount;
    return { x:10 + i*30, y:150 - total*0.1 };
  });

  ctx.beginPath();
  ctx.moveTo(10,150);
  points.forEach(p => ctx.lineTo(p.x,p.y));
  ctx.strokeStyle = "#66b2ff";
  ctx.stroke();
}

/* GOAL PREDICTION */
function goalPrediction() {
  const goal = parseFloat(document.getElementById("goalAmount").value);
  const monthly = parseFloat(document.getElementById("goalMonthly").value);
  if (!goal || !monthly || goal <=0 || monthly<=0) return alert("Enter valid values");
  const months = Math.ceil(goal / monthly);
  document.getElementById("goalResult").innerText =
    `Goal will be achieved in ~${months} months (~${(months/12).toFixed(1)} years).`;
}

/* PROFILE FUNCTIONS */
function uploadProfilePic() {
  const file = document.getElementById("imageUpload").files[0];
  if (!file) return;
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
  if (!user) return;
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
  const newName = document.getElementById("editName").value.trim();
  const newEmail = document.getElementById("editEmail").value.trim();

  if (!newName || !newEmail) return alert("Name and email cannot be empty");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const emailUsed = users.some(u => u.email === newEmail && u.email !== user.email);
  if (emailUsed) return alert("Email already used by another account");

  user.name = newName;
  user.email = newEmail;
  saveUser(user);
  alert("Profile updated");
  loadProfile();
}

function changePassword() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const oldPass = document.getElementById("oldPassword").value;
  const newPass = document.getElementById("newPassword").value;

  if (!oldPass || !newPass) return alert("Fill both fields");
  if (oldPass !== user.password) return alert("Wrong current password");
  if (newPass.length < 4) return alert("New password too short");

  user.password = newPass;
  saveUser(user);
  alert("Password changed");
}

/* PIN */
function setPin() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const pin = document.getElementById("pinInput").value.trim();
  if (pin.length !== 4) return alert("PIN must be 4 digits");
  user.pin = pin;
  saveUser(user);
  alert("PIN saved");
}

/* TRANSACTIONS FILTER / SORT / SEARCH */
let txFilter = "all";

function setFilter(f) {
  txFilter = f;
  updateTxView();
}

function displayTransactions() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return;
  let txs = [...user.transactions];

  const searchInput = document.getElementById("searchTx");
  const search = searchInput ? searchInput.value.toLowerCase() : "";

  if (search) {
    txs = txs.filter(t =>
      t.type.toLowerCase().includes(search) ||
      t.date.toLowerCase().includes(search)
    );
  }

  if (txFilter !== "all") {
    txs = txs.filter(t => t.type === txFilter);
  }

  const sortSelect = document.getElementById("sortTx");
  const sortVal = sortSelect ? sortSelect.value : "latest";

  if (sortVal === "latest") txs.sort((a,b)=> new Date(b.date) - new Date(a.date));
  if (sortVal === "oldest") txs.sort((a,b)=> new Date(a.date) - new Date(b.date));
  if (sortVal === "high") txs.sort((a,b)=> b.amount - a.amount);
  if (sortVal === "low") txs.sort((a,b)=> a.amount - b.amount);

  const list = document.getElementById("transactionList");
  if (!list) return;
  list.innerHTML = "";
  txs.forEach(t => {
    const li = document.createElement("li");
    li.innerText = `${t.type.toUpperCase()} | ₹${t.amount} | ${t.date}`;
    list.appendChild(li);
  });
}

function updateTxView() {
  displayTransactions();
}

/* MONTHLY SPEND */
function monthlySpend() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return;
  const currentMonth = new Date().getMonth();
  const spent = user.transactions
    .filter(t => t.type === "withdraw" && new Date(t.date).getMonth() === currentMonth)
    .reduce((sum, t) => sum + t.amount, 0);
  alert(`This month you've spent: ₹${spent}`);
}

/* PDF + CSV */
function exportPDF() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return;
  const content = `
=== WealthWise Report ===

Name: ${user.name}
Balance: ₹${user.balance}
Total Transactions: ${user.transactions.length}

Generated: ${new Date().toLocaleString()}
`;
  const blob = new Blob([content], { type: "application/pdf" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "WealthWise_Report.pdf";
  a.click();
}

function exportCSV() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return;
  let csv = "Type,Amount,Date\n";
  user.transactions.forEach(t => {
    csv += `${t.type.toUpperCase()},₹${t.amount},${t.date}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "WealthWise_Transactions.csv";
  a.click();
}

/* SIMPLE AI ADVICE (used by Advisor section) */
function getAdvice() {
  const input = document.getElementById("adviceInput");
  if (!input) return;
  const q = input.value.toLowerCase();
  let ans = "Consistent investing, diversification and long-term holding generally work better than quick speculation.";

  if (q.includes("sip")) ans = "Increase your SIP gradually with income growth and stay invested long-term.";
  else if (q.includes("emi") || q.includes("loan")) ans = "Keep EMIs under 40% of your monthly income and clear high-interest loans first.";
  else if (q.includes("fd")) ans = "FDs are safe but usually don't beat inflation. Good for short-term and emergency funds.";
  else if (q.includes("mutual")) ans = "Use SIP in diversified mutual funds and hold for 5+ years.";
  else if (q.includes("crypto")) ans = "Crypto is highly volatile. Invest very small portion and only what you can afford to lose.";
  else if (q.includes("retire")) ans = "Start retirement investing early. The earlier you start, the less you need to invest monthly.";

  document.getElementById("adviceOutput").innerText = ans;
}

/* FLOATING AI CHAT ASSISTANT */
function toggleAIChat() {
  const box = document.getElementById("aiChatBox");
  if (!box) return;
  box.classList.toggle("hidden");
}

function sendAI() {
  const input = document.getElementById("aiInput");
  if (!input) return;
  const msg = input.value.trim();
  if (!msg) return;

  appendMessage("user", msg);
  input.value = "";

  setTimeout(() => {
    const response = generateAIResponse(msg.toLowerCase());
    appendMessage("bot", response);
  }, 300);
}

function appendMessage(sender, text) {
  const container = document.getElementById("aiMessages");
  if (!container) return;
  const div = document.createElement("div");
  div.className = sender === "user" ? "ai-msg-user" : "ai-msg-bot";
  div.innerText = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function generateAIResponse(q) {
  if (q.includes("sip")) return "SIP is best used for long-term goals. Increase it yearly to match income and inflation.";
  if (q.includes("loan") || q.includes("emi")) return "Avoid taking loans where EMIs cross 40% of your net take-home salary.";
  if (q.includes("fd")) return "FD is safe. Use it for short-term parking and emergencies, not long-term wealth.";
  if (q.includes("stocks")) return "Don't bet everything on one stock. Use diversification and think 5–10 years.";
  if (q.includes("tax")) return "Use legal tax-saving options like ELSS, PPF, insurance and retirement funds.";
  if (q.includes("retire")) return "Higher your starting age, higher monthly investment required. Start early to reduce pressure.";
  return "Stick to a plan, diversify, avoid emotional decisions and keep reviewing your goals once or twice a year.";
}

/* THEME HANDLING */
function openThemeModal() {
  const m = document.getElementById("themeModal");
  if (m) m.classList.remove("hidden");
}
function closeThemeModal() {
  const m = document.getElementById("themeModal");
  if (m) m.classList.add("hidden");
}
function setTheme(themeName) {
  document.body.classList.remove("theme-purple","theme-green","theme-gold");
  if (themeName !== "default") document.body.classList.add(themeName);
  localStorage.setItem("themeMode", themeName);
}
function initTheme() {
  const saved = localStorage.getItem("themeMode");
  if (saved && saved !== "default") document.body.classList.add(saved);
}

/* SCROLL HELPER */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
