const KEY='hf_v2';
let s=JSON.parse(localStorage.getItem(KEY)||'{"rbl":33959,"kotak":25000,"cc":15374.41,"tx":[]}');

function save(){localStorage.setItem(KEY,JSON.stringify(s));}
function render(){
document.getElementById('rbl').innerText='₹'+s.rbl.toFixed(2);
document.getElementById('kotak').innerText='₹'+s.kotak.toFixed(2);
document.getElementById('cc').innerText='₹'+s.cc.toFixed(2);
document.getElementById('networth').innerText='₹'+(s.rbl+s.kotak-s.cc).toFixed(2);

let t='';
s.tx.forEach((x,i)=>{
t+=`<tr><td>${x.date}</td><td>${x.type}</td><td>${x.category}</td><td>₹${x.amount}</td><td>${x.account}</td><td><button class="del" onclick="delTx(${i})">Delete</button></td></tr>`;
});
document.getElementById('txTable').innerHTML=t;
}
function addTx(){
const type=document.getElementById('type').value;
const amount=parseFloat(document.getElementById('amount').value);
const category=document.getElementById('category').value;
const account=document.getElementById('account').value;
if(!amount)return;

if(type==='Expense'){
if(account==='RBL')s.rbl-=amount;
else if(account==='Kotak')s.kotak-=amount;
else s.cc+=amount;
}
if(type==='Income'){
if(account==='RBL')s.rbl+=amount;
else if(account==='Kotak')s.kotak+=amount;
else s.cc-=amount;
}

s.tx.unshift({date:new Date().toLocaleDateString(),type,category,amount,account});
save();render();
document.getElementById('amount').value='';
}
function delTx(i){s.tx.splice(i,1);save();render();}
function copySummary(){
navigator.clipboard.writeText(JSON.stringify(s,null,2));
alert('Summary copied');
}
render();