const KEY='harsh_updated';
const EXP=['Food','Petrol','Shopping','Travel'];
const INC=['Salary','Cashback','Reimbursement','Refund','Interest'];
const TRANSFER=['RBL → Kotak','Kotak → RBL'];

let state=JSON.parse(localStorage.getItem(KEY)||'{"rbl":33959,"kotak":25000,"creditCard":15374.41,"reimbursement":8800,"transactions":[]}');

function save(){localStorage.setItem(KEY,JSON.stringify(state));}

function refreshCategories(){
const t=document.getElementById('transactionType').value;
let list=[];
if(t==='Expense') list=EXP;
if(t==='Income') list=INC;
if(t==='Transfer') list=TRANSFER;
document.getElementById('category').innerHTML=list.map(x=>`<option>${x}</option>`).join('');
}
refreshCategories();
document.getElementById('transactionType').addEventListener('change',refreshCategories);

function addTransaction(){
const amount=parseFloat(document.getElementById('amount').value);
if(!amount||amount<=0){alert('Enter amount');return;}

const tx={id:Date.now(),type:transactionType.value,category:category.value,account:account.value,amount,date:new Date().toLocaleString()};

if(tx.type==='Expense'){
 if(tx.account==='RBL') state.rbl-=amount;
 else if(tx.account==='Kotak') state.kotak-=amount;
 else state.creditCard+=amount;
}
else if(tx.type==='Income'){
 if(tx.account==='RBL') state.rbl+=amount;
 else if(tx.account==='Kotak') state.kotak+=amount;
 else state.creditCard-=amount;

 if(tx.category==='Reimbursement'){
   state.reimbursement=Math.max(0,state.reimbursement-amount);
 }
}
else if(tx.type==='Transfer'){
 if(tx.category==='RBL → Kotak'){state.rbl-=amount;state.kotak+=amount;}
 if(tx.category==='Kotak → RBL'){state.kotak-=amount;state.rbl+=amount;}
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
}
else if(tx.type==='Income'){
 if(tx.account==='RBL') state.rbl-=tx.amount;
 else if(tx.account==='Kotak') state.kotak-=tx.amount;
 else state.creditCard+=tx.amount;
}
else if(tx.type==='Transfer'){
 if(tx.category==='RBL → Kotak'){state.rbl+=tx.amount;state.kotak-=tx.amount;}
 if(tx.category==='Kotak → RBL'){state.kotak+=tx.amount;state.rbl-=tx.amount;}
}

state.transactions=state.transactions.filter(x=>x.id!==id);
save();
render();
}

function render(){
document.getElementById('rblBalance').innerText='₹'+state.rbl.toFixed(2);
document.getElementById('kotakBalance').innerText='₹'+state.kotak.toFixed(2);
document.getElementById('ccBalance').innerText='₹'+state.creditCard.toFixed(2);

const nw=state.rbl+state.kotak-state.creditCard;
document.getElementById('netWorth').innerText='₹'+nw.toFixed(2);

document.getElementById('reimbursementAmount').innerText='₹'+state.reimbursement;

const safe=Math.max(0,(state.rbl+state.kotak)-state.creditCard-10000);
document.getElementById('safeSpend').innerText='₹'+safe.toFixed(0);

transactionsList.innerHTML=state.transactions.map(tx=>`
<div class="tx">
<b>${tx.category}</b> ₹${tx.amount}<br>
${tx.account}<br>
${tx.date}<br>
<button onclick="deleteTx(${tx.id})">Delete</button>
</div>`).join('');
}
render();