const KEY='harsh_v4_real';
const EXP=['Food','Petrol','Shopping','Travel','Gift','Bills','Entertainment','Misc'];
const INC=['Cashback','Reimbursement','Salary','Refund','Interest'];
let s=JSON.parse(localStorage.getItem(KEY)||'{"rbl":33959,"kotak":25000,"cc":15374.41,"reimb":8800,"tx":[]}');

function save(){localStorage.setItem(KEY,JSON.stringify(s));}
function fill(){category.innerHTML=(type.value==='Income'?INC:EXP).map(x=>`<option>${x}</option>`).join('');}
type.onchange=fill;fill();

function quick(c){type.value='Expense';fill();category.value=c;amount.focus();}

function addTx(){
 let a=+amount.value;if(!a)return;
 let now=new Date();
 let tx={date:now.toISOString(),month:now.toISOString().slice(0,7),type:type.value,cat:category.value,acc:account.value,amt:a};

 if(tx.type==='Expense'){
   if(tx.acc==='RBL')s.rbl-=a;
   else if(tx.acc==='Kotak')s.kotak-=a;
   else s.cc+=a;
 } else {
   if(tx.acc==='RBL')s.rbl+=a;
   else if(tx.acc==='Kotak')s.kotak+=a;
   else s.cc-=a;
   if(tx.cat==='Reimbursement') s.reimb=Math.max(0,s.reimb-a);
 }
 s.tx.unshift(tx);
 save(); render(); amount.value='';
}

function del(i){
 let t=s.tx[i],a=t.amt;
 if(t.type==='Expense'){
   if(t.acc==='RBL')s.rbl+=a; else if(t.acc==='Kotak')s.kotak+=a; else s.cc-=a;
 } else {
   if(t.acc==='RBL')s.rbl-=a; else if(t.acc==='Kotak')s.kotak-=a; else s.cc+=a;
 }
 s.tx.splice(i,1); save(); render();
}

function render(){
 rbl.innerHTML='<div class=value>₹'+s.rbl.toFixed(0)+'</div>';
 kotak.innerHTML='<div class=value>₹'+s.kotak.toFixed(0)+'</div>';
 cc.innerHTML='<div class=value>₹'+s.cc.toFixed(0)+'</div>';
 net.innerHTML='<div class=value>₹'+(s.rbl+s.kotak-s.cc).toFixed(0)+'</div>';
 safe.innerHTML='<div class=value>₹'+Math.max(0,s.rbl-20000).toFixed(0)+'</div>';
 reimb.innerHTML='<div class=value>₹'+s.reimb.toFixed(0)+'</div>';

 let months=[...new Set(s.tx.map(x=>x.month))];
 monthFilter.innerHTML='<option value="">Current/All</option>'+months.map(m=>`<option>${m}</option>`).join('');

 let mf=monthFilter.value;
 transactions.innerHTML=s.tx.filter(x=>!mf||x.month===mf).map((x,i)=>{
   let d=new Date(x.date);
   return `<div class="tx">${x.cat} • ₹${x.amt}<br>${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}<br>${x.acc}<br><button onclick="del(${i})">Delete</button></div>`;
 }).join('');
}
monthFilter.onchange=render;
render();