function sipCalculator() {
  let invest = parseInt(document.getElementById("sipInvest").value);
  let years = parseInt(document.getElementById("sipYears").value);
  let rate = parseFloat(document.getElementById("sipRate").value) || 12;

  let months = years * 12;
  let r = rate / 12 / 100;

  let future = invest * (((1 + r) ** months - 1) / r) * (1 + r);
  document.getElementById("sipResult").innerText = `Future Value: ₹${Math.round(future)}`;
}

function fdCalculator() {
  let amount = parseInt(document.getElementById("fdAmount").value);
  let years = parseInt(document.getElementById("fdYears").value);
  let rate = parseFloat(document.getElementById("fdRate").value) || 7;

  let future = amount * ((1 + rate / 100) ** years);
  document.getElementById("fdResult").innerText = `Maturity: ₹${Math.round(future)}`;
}

function emiCalculator() {
  let loan = parseInt(document.getElementById("emiLoan").value);
  let years = parseInt(document.getElementById("emiYears").value);
  let rate = parseFloat(document.getElementById("emiRate").value);
  let r = rate / 12 / 100;
  let n = years * 12;
  let emi = loan * r * ((1 + r) ** n) / (((1 + r) ** n) - 1);

  document.getElementById("emiResult").innerText = `Monthly EMI: ₹${Math.round(emi)}`;
}
