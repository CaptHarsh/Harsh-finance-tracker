const STORAGE_KEY = "harsh_finance_v6";

const EXPENSES = [
"Food",
"Petrol",
"Shopping",
"Travel",
"Gift",
"Bills",
"Entertainment",
"Misc"
];

const INCOME = [
"Salary",
"Cashback",
"Reimbursement",
"Refund",
"Interest"
];

const TRANSFERS = [
"RBL → Kotak",
"Kotak → RBL"
];

let state = JSON.parse(
localStorage.getItem(STORAGE_KEY)
) || {

salary:60316,

savingsGoal:10000,

creditCardLimit:25000,

reimbursement:8800,

rbl:33959,

kotak:25000,

creditCard:15374.41,

transactions:[]
};

function saveState(){

localStorage.setItem(
STORAGE_KEY,
JSON.stringify(state)
);

}

function showPage(id){

document
.querySelectorAll(".page")
.forEach(p =>
p.classList.remove("active")
);

document
.getElementById(id)
.classList.add("active");

}

function refreshCategories(){

const type =
document.getElementById(
"transactionType"
).value;

let data=[];

if(type==="Expense")
data=EXPENSES;

if(type==="Income")
data=INCOME;

if(type==="Transfer")
data=TRANSFERS;

document.getElementById(
"category"
).innerHTML =
data.map(x =>
`<option>${x}</option>`
).join("");

}

function quickCategory(cat){

document.getElementById(
"transactionType"
).value="Expense";

refreshCategories();

document.getElementById(
"category"
).value=cat;

document.getElementById(
"amount"
).focus();

}

function addTransaction(){

const amount =
parseFloat(
document.getElementById(
"amount"
).value
);

if(!amount) return;

const tx = {

id:Date.now(),

timestamp:
new Date().toISOString(),

month:
new Date()
.toISOString()
.slice(0,7),

type:
document.getElementById(
"transactionType"
).value,

category:
document.getElementById(
"category"
).value,

account:
document.getElementById(
"account"
).value,

amount

};

applyTransaction(tx);

state.transactions.unshift(tx);

saveState();

render();

document.getElementById(
"amount"
).value="";

}

function applyTransaction(tx){

if(tx.type==="Expense"){

if(tx.account==="RBL")
state.rbl-=tx.amount;

if(tx.account==="Kotak")
state.kotak-=tx.amount;

if(tx.account==="Credit Card")
state.creditCard+=tx.amount;

}

if(tx.type==="Income"){

if(tx.account==="RBL")
state.rbl+=tx.amount;

if(tx.account==="Kotak")
state.kotak+=tx.amount;

if(tx.account==="Credit Card")
state.creditCard-=tx.amount;

if(
tx.category==="Reimbursement"
){

state.reimbursement=
Math.max(
0,
state.reimbursement-
tx.amount
);

}

}

if(tx.type==="Transfer"){

if(
tx.category==="RBL → Kotak"
){

state.rbl-=tx.amount;
state.kotak+=tx.amount;

}

if(
tx.category==="Kotak → RBL"
){

state.kotak-=tx.amount;
state.rbl+=tx.amount;

}

}

}

function deleteTransaction(id){

const tx=
state.transactions.find(
t=>t.id===id
);

if(!tx) return;

state.transactions=
state.transactions.filter(
t=>t.id!==id
);

rebuildBalances();

saveState();

render();

}

function rebuildBalances(){

const original = {

rbl:33959,

kotak:25000,

creditCard:15374.41,

reimbursement:8800

};

state.rbl=original.rbl;
state.kotak=original.kotak;
state.creditCard=
original.creditCard;
state.reimbursement=
original.reimbursement;

state.transactions
.slice()
.reverse()
.forEach(tx =>
applyTransaction(tx)
);

}

function render(){

const netWorth =
state.rbl +
state.kotak -
state.creditCard;

document.getElementById(
"rblBalance"
).innerText =
"₹"+state.rbl.toFixed(0);

document.getElementById(
"kotakBalance"
).innerText =
"₹"+state.kotak.toFixed(0);

document.getElementById(
"ccBalance"
).innerText =
"₹"+state.creditCard.toFixed(0);

document.getElementById(
"netWorth"
).innerText =
"₹"+netWorth.toFixed(0);

const safe =
Math.max(
0,
(state.rbl+state.kotak)
-state.creditCard
-state.savingsGoal
);

document.getElementById(
"safeSpend"
).innerText =
"₹"+safe.toFixed(0);

const today =
new Date();

const daysLeft =
new Date(
today.getFullYear(),
today.getMonth()+1,
0
).getDate()
-
today.getDate()+1;

const daily =
Math.round(
safe/
Math.max(
1,
daysLeft
)
);

document.getElementById(
"dailyBudget"
).innerText =
"₹"+daily;

document.getElementById(
"weeklyBudget"
).innerText =
"₹"+(daily*7);

document.getElementById(
"reimbursementAmount"
).innerText =
"₹"+
state.reimbursement;

const progress =
Math.min(
100,
Math.round(
(netWorth/
state.savingsGoal)
*100
)
);

document.getElementById(
"goalProgress"
).innerText =
progress+"%";

const bar =
document.getElementById(
"goalBar"
);

if(bar)
bar.style.width =
progress+"%";

document.getElementById(
"currentMonth"
).innerText =
today.toLocaleString(
"default",
{
month:"long",
year:"numeric"
}
);

renderTransactions();

populateSettings();

}

function renderTransactions(){

const container =
document.getElementById(
"transactionsList"
);

container.innerHTML =
state.transactions
.map(tx => {

const date =
new Date(
tx.timestamp
);

return `
<div class="transaction-card">

<div class="transaction-title">
${tx.category}
</div>

<div class="transaction-meta">
${date.toLocaleDateString()}
</div>

<div class="transaction-meta">
${tx.account}
</div>

<div class="transaction-amount">
₹${tx.amount}
</div>

<div class="transaction-actions">

<button
class="delete-btn"
onclick="
deleteTransaction(
${tx.id}
)
">
Delete
</button>

</div>

</div>
`;

})
.join("");

}

function populateSettings(){

salaryInput.value =
state.salary;

goalInput.value =
state.savingsGoal;

ccLimitInput.value =
state.creditCardLimit;

reimbursementInput.value =
state.reimbursement;

rblInput.value =
state.rbl;

kotakInput.value =
state.kotak;

ccInput.value =
state.creditCard;

}

function saveSettings(){

state.salary =
Number(
salaryInput.value
);

state.savingsGoal =
Number(
goalInput.value
);

state.creditCardLimit =
Number(
ccLimitInput.value
);

state.reimbursement =
Number(
reimbursementInput.value
);

state.rbl =
Number(
rblInput.value
);

state.kotak =
Number(
kotakInput.value
);

state.creditCard =
Number(
ccInput.value
);

saveState();

render();

}

refreshCategories();
render();
