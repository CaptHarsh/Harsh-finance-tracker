
// Replace these calculations in your existing app.js

const savingsGoal = 10000;

const safeToday =
(state.rbl + state.kotak)
- state.cc
- savingsGoal;

document.getElementById('safe').textContent =
'₹' + Math.max(0, Math.round(safeToday));

const currentSaved =
Math.max(0,
(state.rbl + state.kotak)
- state.cc
);

const goalPercent =
Math.min(
100,
(currentSaved / savingsGoal) * 100
);

document.getElementById('goaltext').textContent =
'₹' +
Math.round(currentSaved) +
' / ₹' +
savingsGoal;

document.getElementById('goalbar').style.width =
goalPercent + '%';

// REMOVE forecast card completely
