function calculateSIP() {
  const monthly = parseFloat(document.getElementById("sipMonthly").value);
  const rate = parseFloat(document.getElementById("sipRate").value) / 100 / 12;
  const months = parseFloat(document.getElementById("sipYears").value) * 12;

  if (isNaN(monthly) || isNaN(rate) || isNaN(months)) {
    alert("Enter valid SIP inputs");
    return;
  }

  const finalValue = monthly * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
  document.getElementById("sipResult").innerText = "Maturity Value: ₹ " + finalValue.toFixed(2);
}

function calculateCI() {
  const principal = parseFloat(document.getElementById("ciPrincipal").value);
  const rate = parseFloat(document.getElementById("ciRate").value) / 100;
  const time = parseFloat(document.getElementById("ciTime").value);

  if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
    alert("Enter valid CI inputs");
    return;
  }

  const amount = principal * Math.pow(1 + rate, time);
  document.getElementById("ciResult").innerText = "Maturity Value: ₹ " + amount.toFixed(2);
}

function calculateEMI() {
  const P = parseFloat(document.getElementById("emiAmount").value);
  const r = parseFloat(document.getElementById("emiRate").value) / (12 * 100);
  const n = parseFloat(document.getElementById("emiYears").value) * 12;

  if (isNaN(P) || isNaN(r) || isNaN(n)) {
    alert("Enter valid EMI inputs");
    return;
  }

  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  document.getElementById("emiResult").innerText = "Monthly EMI: ₹ " + emi.toFixed(2);
}

function calculateFD() {
  const amount = parseFloat(document.getElementById("fdAmount").value);
  const rate = parseFloat(document.getElementById("fdRate").value) / 100;
  const years = parseFloat(document.getElementById("fdYears").value);

  if (isNaN(amount) || isNaN(rate) || isNaN(years)) {
    alert("Enter valid FD inputs");
    return;
  }

  const maturity = amount * Math.pow(1 + rate, years);
  document.getElementById("fdResult").innerText = "FD Maturity: ₹ " + maturity.toFixed(2);
}

function calculateRD() {
  const monthly = parseFloat(document.getElementById("rdMonthly").value);
  const rate = parseFloat(document.getElementById("rdRate").value) / (12 * 100);
  const months = parseFloat(document.getElementById("rdMonths").value);

  if (isNaN(monthly) || isNaN(rate) || isNaN(months)) {
    alert("Enter valid RD inputs");
    return;
  }

  const maturity = monthly * months + monthly * (((months * (months + 1)) / 2) * rate);
  document.getElementById("rdResult").innerText = "RD Maturity: ₹ " + maturity.toFixed(2);
}
