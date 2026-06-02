const KEY='harsh_proper';
let s=JSON.parse(localStorage.getItem(KEY)||'{"rbl":33959,"kotak":25000,"cc":15374.41,"reimb":8800,"goal":10000,"limit":25000,"tx":[]}');

const exp=['Food','Petrol','Shopping','Misc'];
const inc=['Salary','Cashback','Reimbursement','Refund'];

function save(){localStorage.setItem(KEY,JSON.stringify(s));}
function cats(){category.innerHTML=(type.value==='Expense'?exp:inc).map(x=>`<option>${x}</option>`).join('');}
type.onchange=cats; cats();

function setCat(c){type.value='Expense';cats();category.value=c;}

function addTx(){
let a=parseFloat(amount.value); if(!a)return;
let t={id:Date.now(),type:type.value,cat:category.value,acc:account.value,amt:a,month:new Date().toISOString().slice(0,7),date:new Date().toLocaleString()};
if(t.type==='Expense'){
 if(t.acc==='RBL')s.rbl-=a; else if(t.acc==='Kotak')s.kotak-=a; else s.cc+=a;
}else{
 if(t.acc==='RBL')s.rbl+=a; else if(t.acc==='Kotak')s.kotak+=a; else s.cc-=a;
}
s.tx.unshift(t); save(); render(); amount.value='';
}

function delTx(id){
let t=s.tx.find(x=>x.id===id); if(!t)return;
if(t.type==='Expense'){
 if(t.acc==='RBL')s.rbl+=t.amt; else if(t.acc==='Kotak')s.kotak+=t.amt; else s.cc-=t.amt;
}else{
 if(t.acc==='RBL')s.rbl-=t.amt; else if(t.acc==='Kotak')s.kotak-=t.amt; else s.cc+=t.amt;
}
s.tx=s.tx.filter(x=>x.id!==id); save(); render();
}

function render(){
rbl.textContent='₹'+Math.round(s.rbl);
kotak.textContent='₹'+Math.round(s.kotak);
cc.textContent='₹'+Math.round(s.cc);
reimb.textContent='₹'+Math.round(s.reimb);

let nw=s.rbl+s.kotak-s.cc;
networth.textContent='₹'+Math.round(nw);
usage.textContent=((s.cc/s.limit)*100).toFixed(1)+'%';

let safe=Math.max(0,(s.rbl+s.kotak)-s.cc-s.goal);
daily.textContent='₹'+Math.round(safe/30);
weekly.textContent='₹'+Math.round((safe/30)*7);

let pct=Math.min(100,nw/s.goal*100);
goalbar.style.width=pct+'%';
goaltext.textContent=Math.round(pct)+'%';

let food=0,petrol=0,shop=0,misc=0;
s.tx.forEach(x=>{
 if(x.type==='Expense'){
  if(x.cat==='Food')food+=x.amt;
  if(x.cat==='Petrol')petrol+=x.amt;
  if(x.cat==='Shopping')shop+=x.amt;
  if(x.cat==='Misc')misc+=x.amt;
 }
});
foodSpend.textContent='₹'+food;
petrolSpend.textContent='₹'+petrol;
shoppingSpend.textContent='₹'+shop;
miscSpend.textContent='₹'+misc;

let months=[...new Set(s.tx.map(x=>x.month))];
monthFilter.innerHTML='<option value="">All Months</option>'+months.map(m=>`<option>${m}</option>`).join('');

let tx=s.tx;
if(monthFilter.value) tx=tx.filter(x=>x.month===monthFilter.value);

txlist.innerHTML=tx.map(x=>`<div class="tx">${x.cat} ₹${x.amt}<br>${x.date}<br><button onclick="delTx(${x.id})">🗑️ Delete</button></div>`).join('');
}
monthFilter.onchange=render;
render();