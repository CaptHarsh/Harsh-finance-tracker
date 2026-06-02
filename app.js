const KEY='hf_v3';
const expenseCats=['Food','Petrol','Shopping','Travel','Gift','Bills','Entertainment','Misc'];
const incomeCats=['Cashback','Reimbursement','Salary','Refund','Interest'];
let s=JSON.parse(localStorage.getItem(KEY)||'{"rbl":33959,"kotak":25000,"cc":15374.41,"goal":10000,"tx":[]}');

function fillCats(){
const t=document.getElementById('type').value;
let arr=t==='Income'?incomeCats:expenseCats;
if(t==='Transfer') arr=['Transfer'];
category.innerHTML=arr.map(x=>`<option>${x}</option>`).join('');
}
type.onchange=fillCats; fillCats();

date.value=new Date().toISOString().split('T')[0];
time.value=new Date().toTimeString().slice(0,5);

function save(){localStorage.setItem(KEY,JSON.stringify(s));}

function addTx(){
const tx={date:date.value,time:time.value,type:type.value,category:category.value,amount:+amount.value,account:account.value,notes:notes.value};
if(!tx.amount)return;

if(tx.type==='Expense'){
 if(tx.account==='RBL') s.rbl-=tx.amount;
 else if(tx.account==='Kotak') s.kotak-=tx.amount;
 else s.cc+=tx.amount;
}
if(tx.type==='Income'){
 if(tx.account==='RBL') s.rbl+=tx.amount;
 else if(tx.account==='Kotak') s.kotak+=tx.amount;
 else s.cc-=tx.amount;
}

s.tx.unshift(tx);
save(); render();
amount.value=''; notes.value='';
}

function delTx(i){
const tx=s.tx[i];
if(tx.type==='Expense'){
 if(tx.account==='RBL') s.rbl+=tx.amount;
 else if(tx.account==='Kotak') s.kotak+=tx.amount;
 else s.cc-=tx.amount;
}
if(tx.type==='Income'){
 if(tx.account==='RBL') s.rbl-=tx.amount;
 else if(tx.account==='Kotak') s.kotak-=tx.amount;
 else s.cc+=tx.amount;
}
s.tx.splice(i,1);
save(); render();
}

function render(){
rbl.innerText='₹'+s.rbl.toFixed(2);
kotak.innerText='₹'+s.kotak.toFixed(2);
cc.innerText='₹'+s.cc.toFixed(2);
net.innerText='₹'+(s.rbl+s.kotak-s.cc).toFixed(2);
daily.innerText='₹500';
weekly.innerText='₹3500';

let fd=filterDate.value;
txTable.innerHTML=s.tx.filter(x=>!fd||x.date===fd).map((x,i)=>`<tr><td>${x.date}</td><td>${x.time}</td><td>${x.type}</td><td>${x.category}</td><td>₹${x.amount}</td><td>${x.account}</td><td>${x.notes}</td><td><button onclick="delTx(${i})">Delete</button></td></tr>`).join('');
}

function copySummary(){
navigator.clipboard.writeText(JSON.stringify(s,null,2));
alert('Summary copied');
}
render();