const KEY='harsh_working';
const EXP=['Food','Petrol','Shopping','Travel'];
const INC=['Salary','Cashback','Reimbursement'];

let state=JSON.parse(localStorage.getItem(KEY)||'{"rbl":33959,"kotak":25000,"creditCard":15374.41,"transactions":[]}');

function save(){localStorage.setItem(KEY,JSON.stringify(state));}

function refreshCategories(){
const t=document.getElementById('transactionType').value;
document.getElementById('category').innerHTML=(t==='Expense'?EXP:INC).map(x=>`<option>${x}</option>`).join('');
}
refreshCategories();
document.getElementById('transactionType').addEventListener('change',refreshCategories);

function addTransaction(){
const amount=parseFloat(document.getElementById('amount').value);
if(!amount||amount<=0){alert('Enter amount');return;}

const tx={
id:Date.now(),
type:transactionType.value,
category:category.value,
account:account.value,
amount:amount,
date:new Date().toLocaleString()
};

if(tx.type==='Expense'){
 if(tx.account==='RBL') state.rbl-=amount;
 else if(tx.account==='Kotak') state.kotak-=amount;
 else state.creditCard+=amount;
}else{
 if(tx.account==='RBL') state.rbl+=amount;
 else if(tx.account==='Kotak') state.kotak+=amount;
 else state.creditCard-=amount;
}

state.transactions.unshift(tx);
save();
render();
amount.value='';
}

function deleteTx(id){
const tx=state.transactions.find(x=>x.id===id);
if(!tx) return;

if(tx.type==='Expense'){
 if(tx.account==='RBL') state.rbl+=tx.amount;
 else if(tx.account==='Kotak') state.kotak+=tx.amount;
 else state.creditCard-=tx.amount;
}else{
 if(tx.account==='RBL') state.rbl-=tx.amount;
 else if(tx.account==='Kotak') state.kotak-=tx.amount;
 else state.creditCard+=tx.amount;
}

state.transactions=state.transactions.filter(x=>x.id!==id);
save();
render();
}

function render(){
rblBalance.innerText='₹'+state.rbl.toFixed(2);
kotakBalance.innerText='₹'+state.kotak.toFixed(2);
ccBalance.innerText='₹'+state.creditCard.toFixed(2);
netWorth.innerText='₹'+(state.rbl+state.kotak-state.creditCard).toFixed(2);

transactionsList.innerHTML=state.transactions.map(tx=>`
<div class="tx">
<b>${tx.category}</b> ₹${tx.amount}<br>
${tx.account}<br>
${tx.date}<br>
<button onclick="deleteTx(${tx.id})">Delete</button>
</div>`).join('');
}
render();