const K='hfv4';
const E=['Food','Petrol','Shopping','Travel','Gift','Bills','Entertainment','Misc'];
const I=['Cashback','Reimbursement','Salary','Refund','Interest'];
let s=JSON.parse(localStorage.getItem(K)||'{"rbl":33959,"kotak":25000,"cc":15374.41,"goal":10000,"tx":[]}');
function save(){localStorage.setItem(K,JSON.stringify(s));}
function fill(){let t=type.value;category.innerHTML=(t==='Income'?I:(t==='Transfer'?['Transfer']:E)).map(x=>`<option>${x}</option>`).join('');}
type.onchange=fill;fill();
function quick(c){type.value='Expense';fill();category.value=c;amount.focus();}
function addTx(){
let a=+amount.value;if(!a)return;
let d=new Date();let m=d.toISOString().slice(0,7);
let tx={date:d.toISOString(),month:m,type:type.value,cat:category.value,amt:a,acc:account.value};
if(tx.type==='Expense'){if(tx.acc==='RBL')s.rbl-=a;else if(tx.acc==='Kotak')s.kotak-=a;else s.cc+=a;}
if(tx.type==='Income'){if(tx.acc==='RBL')s.rbl+=a;else if(tx.acc==='Kotak')s.kotak+=a;else s.cc-=a;}
s.tx.unshift(tx);save();render();amount.value='';
}
function del(i){
let t=s.tx[i],a=t.amt;
if(t.type==='Expense'){if(t.acc==='RBL')s.rbl+=a;else if(t.acc==='Kotak')s.kotak+=a;else s.cc-=a;}
if(t.type==='Income'){if(t.acc==='RBL')s.rbl-=a;else if(t.acc==='Kotak')s.kotak-=a;else s.cc+=a;}
s.tx.splice(i,1);save();render();
}
function render(){
let nw=s.rbl+s.kotak-s.cc;
net.innerText='₹'+nw.toFixed(0);
safe.innerText='₹'+Math.max(0,s.rbl-20000).toFixed(0);
daily.innerText='₹500';
weekly.innerText='₹3500';
let months=[...new Set(s.tx.map(x=>x.month))];
monthFilter.innerHTML='<option value="">All Months</option>'+months.map(m=>`<option>${m}</option>`).join('');
let mf=monthFilter.value;
list.innerHTML=s.tx.filter(x=>!mf||x.month===mf).map((x,i)=>`<div>${x.date.slice(0,10)} ${x.cat} ₹${x.amt} (${x.acc}) <button onclick="del(${i})">🗑</button></div>`).join('');
}
monthFilter.onchange=render;
render();