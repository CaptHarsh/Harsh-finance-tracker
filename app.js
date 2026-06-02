const KEY='finance_v3plus';
const EXP=['Food','Petrol','Shopping','Travel','Bills'];
const INC=['Salary','Cashback','Reimbursement','Refund','Interest'];
const TRANS=['RBL → Kotak','Kotak → RBL'];
let editId=null;

let s=JSON.parse(localStorage.getItem(KEY)||'{"rbl":33959,"kotak":25000,"cc":15374.41,"goal":10000,"ccLimit":25000,"reimb":8800,"tx":[]}');

function save(){localStorage.setItem(KEY,JSON.stringify(s));}
function cats(){let a=EXP;if(type.value==='Income')a=INC;if(type.value==='Transfer')a=TRANS;category.innerHTML=a.map(x=>`<option>${x}</option>`).join('');}
type.onchange=cats;cats();

function populateMonths(){const m=[...new Set(s.tx.map(x=>x.month))];monthFilter.innerHTML='<option value="">All Months</option>'+m.map(x=>`<option>${x}</option>`).join('');}

function addTx(){
let a=parseFloat(amount.value); if(!a)return;
const now=new Date();
let tx={id:editId||Date.now(),type:type.value,cat:category.value,acc:account.value,amt:a,date:now.toLocaleString(),month:now.toISOString().slice(0,7)};
if(editId){deleteCore(editId,false); editId=null;}

if(tx.type==='Expense'){if(tx.acc==='RBL')s.rbl-=a; else if(tx.acc==='Kotak')s.kotak-=a; else s.cc+=a;}
else if(tx.type==='Income'){if(tx.acc==='RBL')s.rbl+=a; else if(tx.acc==='Kotak')s.kotak+=a; else s.cc-=a;}
else {if(tx.cat==='RBL → Kotak'){s.rbl-=a;s.kotak+=a;} else {s.kotak-=a;s.rbl+=a;}}

s.tx.unshift(tx); save(); render(); amount.value='';
}

function deleteCore(id,rer=true){
const t=s.tx.find(x=>x.id===id); if(!t)return;
if(t.type==='Expense'){if(t.acc==='RBL')s.rbl+=t.amt; else if(t.acc==='Kotak')s.kotak+=t.amt; else s.cc-=t.amt;}
else if(t.type==='Income'){if(t.acc==='RBL')s.rbl-=t.amt; else if(t.acc==='Kotak')s.kotak-=t.amt; else s.cc+=t.amt;}
else {if(t.cat==='RBL → Kotak'){s.rbl+=t.amt;s.kotak-=t.amt;} else {s.kotak+=t.amt;s.rbl-=t.amt;}}
s.tx=s.tx.filter(x=>x.id!==id); save(); if(rer)render();
}
function delTx(id){deleteCore(id,true);}
function editTx(id){const t=s.tx.find(x=>x.id===id); if(!t)return; type.value=t.type; cats(); category.value=t.cat; account.value=t.acc; amount.value=t.amt; editId=id;}

function render(){
populateMonths();
const nw=s.rbl+s.kotak-s.cc;
const safe=Math.max(0,(s.rbl+s.kotak)-s.cc-s.goal);
const daysLeft=Math.max(1,new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate()-new Date().getDate()+1);
const daily=Math.round(safe/daysLeft);
const weekly=daily*7;
const util=((s.cc/s.ccLimit)*100).toFixed(1)+'%';

rbl.innerText='₹'+s.rbl.toFixed(0);
kotak.innerText='₹'+s.kotak.toFixed(0);
cc.innerText='₹'+s.cc.toFixed(0);
reimb.innerText='₹'+s.reimb.toFixed(0);
netWorth.innerText='₹'+nw.toFixed(0);
safeSpend.innerText='₹'+safe.toFixed(0);
dailyBudget.innerText='₹'+daily;
weeklyBudget.innerText='₹'+weekly;
ccUtil.innerText=util;
forecast.innerText='₹'+Math.round(nw + s.reimb);

let txs=s.tx; if(monthFilter.value) txs=txs.filter(x=>x.month===monthFilter.value);
list.innerHTML=txs.map(t=>`<div class="tx"><b>${t.cat}</b> ₹${t.amt}<br>${t.date}<br><button onclick="editTx(${t.id})">Edit</button> <button onclick="delTx(${t.id})">Delete</button></div>`).join('');
}
monthFilter.onchange=render;
render();