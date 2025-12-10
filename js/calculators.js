/* SIP CALCULATOR */
function sipCalculator() {
  let invest = parseInt(document.getElementById("sipInvest").value);
  let years = parseInt(document.getElementById("sipYears").value);
  let rate = parseFloat(document.getElementById("sipRate").value) || 12;

  let months = years * 12;
  let r = rate / 12 / 100;
  let future = invest * (((1 + r) ** months - 1) / r) * (1 + r);

  document.getElementById("sipResult").innerText = `Future Value: ₹${Math.round(future).toLocaleString()}`;
}

/* FD CALCULATOR */
function fdCalculator() {
  let amount = parseInt(document.getElementById("fdAmount").value);
  let years = parseInt(document.getElementById("fdYears").value);
  let rate = parseFloat(document.getElementById("fdRate").value) || 7;

  let future = amount * ((1 + rate / 100) ** years);
  document.getElementById("fdResult").innerText = `Maturity: ₹${Math.round(future).toLocaleString()}`;
}

/* EMI CALCULATOR */
function emiCalculator() {
  let loan = parseInt(document.getElementById("emiLoan").value);
  let years = parseInt(document.getElementById("emiYears").value);
  let rate = parseFloat(document.getElementById("emiRate").value);
  let r = rate / 12 / 100;
  let n = years * 12;

  let emi = loan * r * ((1 + r) ** n) / (((1 + r) ** n) - 1);
  document.getElementById("emiResult").innerText = `Monthly EMI: ₹${Math.round(emi).toLocaleString()}`;
}

/* COMPOUND INTEREST */
function compoundInterest() {
  let p = parseInt(document.getElementById("ciPrincipal").value);
  let r = parseFloat(document.getElementById("ciRate").value) / 100;
  let t = parseInt(document.getElementById("ciYears").value);

  let amount = p * Math.pow((1 + r), t);
  document.getElementById("ciResult").innerText = `Future Value: ₹${Math.round(amount).toLocaleString()}`;
}

/* SIMPLE INTEREST */
function simpleInterest() {
  let p = parseInt(document.getElementById("siPrincipal").value);
  let r = parseFloat(document.getElementById("siRate").value);
  let t = parseInt(document.getElementById("siYears").value);

  let si = (p * r * t) / 100;
  document.getElementById("siResult").innerText =
    `Interest Earned: ₹${Math.round(si).toLocaleString()} | Total: ₹${Math.round(p + si).toLocaleString()}`;
}

/* SWP WITHDRAWAL */
function swpCalculator() {
  let corpus = parseInt(document.getElementById("swpCorpus").value);
  let withdrawal = parseInt(document.getElementById("swpMonthly").value);
  let rate = parseFloat(document.getElementById("swpRate").value) || 12;

  let months = 0;
  let balance = corpus;
  let monthlyReturn = rate / 12 / 100;

  while (balance > 0) {
    balance = balance + (balance * monthlyReturn) - withdrawal;
    months++;
    if (months > 3000) break;
  }

  let years = (months / 12).toFixed(1);
  document.getElementById("swpResult").innerText = `Corpus lasts for approx: ${years} years`;
}

/* RETIREMENT CORPUS REQUIRED */
function retirementNeed() {
  let monthly = parseInt(document.getElementById("rtMonthly").value);
  let years = parseInt(document.getElementById("rtYears").value);

  let totalNeeded = monthly * 12 * years;
  document.getElementById("rtResult").innerText = `Approx Corpus Needed: ₹${totalNeeded.toLocaleString()}`;
}
