const KEY='compact_final';
const EXP=['🍔 Food','⛽ Petrol','🛍 Shopping','🚕 Travel','🧾 Bills'];
const INC=['💰 Salary','💵 Cashback','💵 Reimbursement','↩️ Refund','🏦 Interest'];
const TRANS=['RBL → Kotak','Kotak → RBL'];
let editId=null;

let s=JSON.parse(localStorage.getItem(KEY)||'{"rbl":33959,"kotak":25000,"cc":15374.41,"goal":10000,"ccLimit":25000,"reimb":8800,"tx":[]}');

function save(){localStorage.setItem(KEY,JSON.stringify(s));}
function cats(){let a=EXP;if(type.value==='Income')a=INC;if(type.value==='Transfer')a=TRANS;category.innerHTML=a.map(x=>`<option>${x}</option>`).join('');}
type.onchange=cats;cats();

function months(){const m=[...new Set(s.tx.map(x=>x.month))];monthFilter.innerHTML='<option value="">📅 All Months</option>'+m.map(x=>`<option>${x}</option>`).join('');}

function addTx(){
let a=parseFloat(amount.value); if(!a)return;
if(editId){delCore(editId,false);}
const d=new Date();
const t={id:editId||Date.now(),type:type.value,cat:category.value,acc:account.value,amt:a,date:d.toLocaleString(),month:d.toISOString().slice(0,7)};
editId=null;

if(t.type==='Expense'){if(t.acc==='RBL')s.rbl-=a;else if(t.acc==='Kotak')s.kotak-=a;else s.cc+=a;}
else if(t.type==='Income'){if(t.acc==='RBL')s.rbl+=a;else if(t.acc==='Kotak')s.kotak+=a;else s.cc-=a;if(t.cat.includes('Reimbursement'))s.reimb=Math.max(0,s.reimb-a);}
else{if(t.cat==='RBL → Kotak'){s.rbl-=a;s.kotak+=a;}else{s.kotak-=a;s.rbl+=a;}}

s.tx.unshift(t);save();render();amount.value='';
}

function delCore(id,r=true){
const t=s.tx.find(x=>x.id===id); if(!t)return;
if(t.type==='Expense'){if(t.acc==='RBL')s.rbl+=t.amt;else if(t.acc==='Kotak')s.kotak+=t.amt;else s.cc-=t.amt;}
else if(t.type==='Income'){if(t.acc==='RBL')s.rbl-=t.amt;else if(t.acc==='Kotak')s.kotak-=t.amt;else s.cc+=t.amt;}
else{if(t.cat==='RBL → Kotak'){s.rbl+=t.amt;s.kotak-=t.amt;}else{s.kotak+=t.amt;s.rbl-=t.amt;}}
s.tx=s.tx.filter(x=>x.id!==id);save();if(r)render();
}
function delTx(id){delCore(id,true);}
function editTx(id){const t=s.tx.find(x=>x.id===id);type.value=t.type;cats();category.value=t.cat;account.value=t.acc;amount.value=t.amt;editId=id;}

function render(){
months();
const nw=s.rbl+s.kotak-s.cc;
const safe=Math.max(0,(s.rbl+s.kotak)-s.cc-s.goal);
const days=Math.max(1,new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate()-new Date().getDate()+1);

rbl.textContent='₹'+Math.round(s.rbl);
kotak.textContent='₹'+Math.round(s.kotak);
cc.textContent='₹'+Math.round(s.cc);
netWorth.textContent='₹'+Math.round(nw);
safeSpend.textContent='₹'+Math.round(safe);
reimb.textContent='₹'+Math.round(s.reimb);
dailyBudget.textContent='₹'+Math.round(safe/days);
weeklyBudget.textContent='₹'+Math.round((safe/days)*7);
ccUtil.textContent=((s.cc/s.ccLimit)*100).toFixed(1)+'%';
forecast.textContent='₹'+Math.round(nw+s.reimb);

let p=Math.min(100,(nw/s.goal)*100);
goalBar.style.width=p+'%';
goalText.textContent=Math.round(p)+'%';

let tx=s.tx;
if(monthFilter.value) tx=tx.filter(x=>x.month===monthFilter.value);

list.innerHTML=tx.map(t=>`<div class="tx">${t.cat} ₹${t.amt}<br>${t.date}<br><button onclick="editTx(${t.id})">✏️</button> <button onclick="delTx(${t.id})">🗑️</button></div>`).join('');
}
monthFilter.onchange=render;
render();