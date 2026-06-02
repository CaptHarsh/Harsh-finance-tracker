const K='hfv5';
const EXP=['Food','Petrol','Shopping','Travel','Gift','Bills'];
const INC=['Cashback','Reimbursement','Salary','Refund'];
let s=JSON.parse(localStorage.getItem(K)||'{"rbl":33959,"kotak":25000,"cc":15374.41,"goal":10000,"tx":[]}');
function save(){localStorage.setItem(K,JSON.stringify(s));}
function fill(){category.innerHTML=(type.value==='Income'?INC:EXP).map(x=>'<option>'+x+'</option>').join('');}
fill(); type.onchange=fill;
function showPage(id){document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');}
function addTx(){let a=+amount.value;if(!a)return;let d=new Date();let t={amt:a,type:type.value,cat:category.value,acc:account.value,date:d.toISOString(),month:d.toISOString().slice(0,7)};
if(t.type==='Expense'){if(t.acc==='RBL')s.rbl-=a;else if(t.acc==='Kotak')s.kotak-=a;else s.cc+=a;}
else{if(t.acc==='RBL')s.rbl+=a;else if(t.acc==='Kotak')s.kotak+=a;else s.cc-=a;}
s.tx.unshift(t);save();render();}
function delTx(i){s.tx.splice(i,1);save();render();}
function render(){
rbl.innerText='₹'+s.rbl.toFixed(0);kotak.innerText='₹'+s.kotak.toFixed(0);cc.innerText='₹'+s.cc.toFixed(0);
net.innerText='₹'+(s.rbl+s.kotak-s.cc).toFixed(0);
safe.innerText='₹'+Math.max(0,s.rbl-20000).toFixed(0);
goal.innerText='₹'+s.goal;
daily.innerText='₹500';weekly.innerText='₹3500';
let months=[...new Set(s.tx.map(x=>x.month))];
monthFilter.innerHTML='<option value="">Current Month</option>'+months.map(m=>'<option>'+m+'</option>').join('');
let m=monthFilter.value;
txList.innerHTML=s.tx.filter(x=>!m||x.month===m).map((x,i)=>'<div class=tx>'+x.cat+' ₹'+x.amt+'<br>'+new Date(x.date).toLocaleString()+'<br><button onclick="delTx('+i+')">Delete</button></div>').join('');
}
monthFilter.onchange=render;render();