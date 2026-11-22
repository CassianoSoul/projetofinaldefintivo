const T=48,W=90,R=11,VW=960,VH=540,FLAG=86,cv=document.getElementById('c'),g=cv.getContext('2d'),ov=document.getElementById('ov');
const atlas=new Image();atlas.src='financas-sprites.png';
const TIPS=[["Reserva de emergência","Guarde o equivalente a 3 a 6 meses das suas despesas fixas em algo seguro e de resgate rápido. É o seu colchão contra imprevistos."],
["Regra 50-30-20","Um ponto de partida: 50% da renda para necessidades, 30% para desejos e 20% para poupar ou quitar dívidas."],
["Juros compostos","São juros sobre juros. Quanto mais cedo você investe, mais tempo o dinheiro tem para render sobre o que já rendeu."],
["Inflação","Ela reduz o poder de compra: R$ 100 compram menos a cada ano. Seu dinheiro precisa render pelo menos o mesmo que ela."],
["Pague-se primeiro","Assim que o salário cair, separe a parte da poupança. Gaste o que sobrar, e não o contrário."],
["Rotativo do cartão","Pagar só o mínimo da fatura joga o resto no rotativo, uma das taxas mais altas do mercado. Pague o total sempre que puder."],
["Dívidas caras primeiro","Com várias dívidas, quite antes as de juros mais altos. Costuma ser o melhor 'investimento' ao seu alcance."],
["Diversificação","Não coloque todos os ovos na mesma cesta. Distribuir entre ativos diferentes reduz o risco de uma única queda te derrubar."],
["Anote seus gastos","O que não é medido não é controlado. Registre tudo por um mês e veja para onde o dinheiro realmente vai."],
["Regra das 48 horas","Vai fazer uma compra por impulso? Espere 48 horas. Se ainda fizer sentido, compre com consciência."],
["FGC","O Fundo Garantidor de Créditos protege depósitos e certos investimentos de renda fixa até R$ 250 mil por CPF, por instituição. Confira as regras vigentes."],
["Risco, retorno e liquidez","Nenhum investimento tem tudo: segurança, rentabilidade e resgate rápido. Escolha pelo seu objetivo e pelo prazo."],
["Renda fixa x variável","A renda fixa tem regras de remuneração mais previsíveis. A variável oscila e pode render mais no longo prazo, com mais risco."],
["Metas com data","Dê nome e prazo a cada meta (viagem, casa, aposentadoria). Meta clara vira parcela mensal possível."]];
const QZ=[
["Quantos meses de despesas fixas a dica manda guardar na reserva de emergência?",["1 a 2 meses","3 a 6 meses","12 a 24 meses"],1,"A reserva de 3 a 6 meses de despesas fixas é o seu colchão contra imprevistos."],
["Na regra 50-30-20, quanto da renda vai para poupar ou quitar dívidas?",["20%","30%","50%"],0,"50% para necessidades, 30% para desejos e 20% para poupar ou quitar dívidas."],
["O que são juros compostos?",["Juros só sobre o valor inicial","Juros sobre juros","Uma taxa fixa do banco"],1,"São juros sobre juros: quanto mais cedo você investe, mais o dinheiro rende sobre o que já rendeu."],
["O que a inflação faz com o seu dinheiro parado?",["Aumenta o poder de compra","Não muda nada","Reduz o poder de compra"],2,"Com inflação, R$ 100 compram menos a cada ano."],
["Quando separar a parte da poupança, segundo a dica?",["No fim do mês, com a sobra","Assim que o salário cair","Só quando sobrar muito"],1,"Pague-se primeiro: separe a poupança logo que o salário cair e gaste o que sobrar."],
["Pagar só o mínimo da fatura joga o restante em quê?",["Poupança automática","Débito sem juros","Rotativo, com juros altos"],2,"O rotativo tem uma das taxas mais altas do mercado. Pague o total sempre que puder."],
["Com várias dívidas, qual quitar primeiro?",["A de menor valor","A de juros mais altos","A mais antiga"],1,"Quitar primeiro as dívidas de juros mais altos costuma ser o melhor 'investimento' ao seu alcance."],
["Qual é o objetivo da diversificação?",["Garantir lucro todo mês","Pagar menos imposto","Reduzir o risco de uma única queda te derrubar"],2,"Não coloque todos os ovos na mesma cesta."],
["Por quanto tempo a dica sugere anotar os gastos para ver para onde o dinheiro vai?",["Um dia","Um mês","Dez anos"],1,"O que não é medido não é controlado. Registre tudo por um mês."],
["Quanto tempo esperar antes de fechar uma compra por impulso?",["10 minutos","1 ano","48 horas"],2,"Se depois de 48 horas ainda fizer sentido, compre com consciência."],
["Qual o limite de proteção do FGC por CPF, por instituição?",["R$ 25 mil","R$ 250 mil","R$ 2,5 milhões"],1,"O FGC protege até R$ 250 mil por CPF, por instituição. Confira as regras vigentes."],
["Quais são os três pontos que nenhum investimento reúne por completo?",["Segurança, rentabilidade e liquidez","Cor, tamanho e preço","Banco, taxa e validade"],0,"Escolha pelo seu objetivo e pelo prazo."],
["Qual delas oscila mais, mas pode render mais no longo prazo?",["Renda fixa","Renda variável","Nenhuma das duas"],1,"A renda variável oscila, com mais risco e potencial de retorno maior."],
["O que dar a cada meta para ela virar parcela mensal possível?",["Um empréstimo","Um segredo","Nome e prazo"],2,"Meta com nome e data (viagem, casa, aposentadoria) vira parcela mensal possível."]];

let pool=[],qOk=0,fx,bump,P,score,tips,lives,state='menu',keys={},pad={},jH=0,dH=0,cam=0,tk=0;
const shuf=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
const ZP=[{s:['#0b2038','#1d5560','#2f8a72'],up:'#3ddc84',dn:'#ff5d5d',g:'#1f5a3a',gd:'#17482e',gt:'#5fd38d',gt2:'#3fae6d'},
{s:['#1b1038','#4a1f5e','#8a3a6a'],up:'#ff9a3d',dn:'#ff4d6d',g:'#4a2a62',gd:'#33194a',gt:'#b57cff',gt2:'#8f55d6'},
{s:['#3a1a10','#9a4b1f','#f2a65a'],up:'#ffe27a',dn:'#ff7a45',g:'#7a5a1f',gd:'#5a3f12',gt:'#f5c431',gt2:'#c99a1f'}];
const ZN=['ZONA 1: POUPANÇA','ZONA 2: MERCADO','ZONA 3: BOLSA'],Zi=x=>Math.min(2,Math.max(0,Math.floor(x/T/27))),QI=new Set([1,4,7,10,13]);
const PITS=[[18,3],[40,3],[58,3]],
HILLS=[[26,4,1],[48,4,2],[65,3,1]],
PIPES=[[12,2],[34,2],[54,2],[62,2]],
LOW=[],UP=[],TUN=[[44,3]],
$X=[7,15,23,31,37,50,57,66],CPS=[3,30,52,75],
EN=[10,16,24,28,32,38,49,52],
CG=[];
let curZ=-1,ban=0,gh,kind={},grid,coins,enemies,boss;
function build(){
 gh=Array(W).fill(9);
 PITS.forEach(([a,l])=>{for(let x=a;x<a+l;x++)gh[x]=11});
 HILLS.forEach(([a,l,h])=>{for(let x=a;x<a+l;x++)gh[x]=9-h});
 for(let i=0;i<4;i++)gh[68+i]=8-i;gh[72]=gh[73]=5;
 grid=Array.from({length:R},()=>Array(W).fill(0));
 for(let x=0;x<W;x++)for(let y=gh[x];y<R;y++)grid[y][x]=1;
 PIPES.forEach(([a,h])=>{for(let x=a;x<a+2;x++)for(let y=gh[x]-h;y<gh[x];y++)grid[y][x]=5});
 LOW.forEach(([a,l])=>{for(let x=a;x<a+l;x++)if(gh[x]<11)grid[gh[x]-3][x]=2});
 UP.forEach(([a,l])=>{for(let x=a;x<a+l;x++)grid[gh[x]-6][x]=2});
 TUN.forEach(([a,l])=>{for(let x=a;x<a+l;x++)grid[gh[x]-2][x]=2});
 kind={};let tc=0;
 $X.forEach(x=>{const r=gh[x]-3;grid[r][x]=3;kind[x+','+r]=tc++;[x-1,x+1].forEach(b=>{if(gh[b]==gh[x]&&!grid[r][b])grid[r][b]=2})});
 coins=[];
 enemies=EN.filter(x=>gh[x]<11&&!grid[gh[x]-1][x]).map((x,i)=>({x:x*T,y:gh[x]*T-38,w:38,h:38,d:-1,k:i%2,dead:0}));
 boss={x:80*T,y:9*T-80,w:76,h:80,d:-1,hp:3,inv:0,dead:0,gone:0}}
function init(){curZ=-1;build();pool=shuf([...Array(TIPS.length).keys()]);P={x:3*T,y:9*T-54,w:28,h:54,vx:0,vy:0,on:0,face:1,inv:0,vest:0,dead:0,coy:0,dash:0,dcd:0,dused:0,cp:3*T};score=0;tips=0;qOk=0;lives=3;fx=[];bump={}}
const S=(x,y)=>x<0||x>=W?1:y<0||y>=R?0:grid[y][x]>0;
function mX(e,dx){e.x+=dx;const a=Math.floor(e.y/T),b=Math.floor((e.y+e.h-1)/T);
 if(dx>0){const t=Math.floor((e.x+e.w)/T);for(let y=a;y<=b;y++)if(S(t,y)){e.x=t*T-e.w;e.vx=0;return 1}}
 else if(dx<0){const t=Math.floor(e.x/T);for(let y=a;y<=b;y++)if(S(t,y)){e.x=(t+1)*T;e.vx=0;return 1}}return 0}
function mY(e,dy){e.y+=dy;const a=Math.floor(e.x/T),b=Math.floor((e.x+e.w-1)/T);
 if(dy>0){const t=Math.floor((e.y+e.h)/T);for(let x=a;x<=b;x++)if(S(x,t)){e.y=t*T-e.h;e.vy=0;e.on=1;return}}
 else if(dy<0){const t=Math.floor(e.y/T),c=Math.floor((e.x+e.w/2)/T);for(const x of [c,a,b])if(S(x,t)){e.y=(t+1)*T;e.vy=0;hit(x,t);return}}}
function hit(x,y){bump[x+','+y]=10;if(grid[y][x]!=3)return;grid[y][x]=4;tips++;
 const k=pool.pop();setTimeout(()=>tip(k),180)}
function pop(x,y,s,c){fx.push({x,y,s,c:c||'#ffe27a',t:50})}
function tip(i){state='tip';
 ov.hidden=0;ov.innerHTML=`<div class="card" role="dialog"><h2>Caixa ${tips} de 8: ${TIPS[i][0]}</h2><hr><p>${TIPS[i][1]}</p><hr><p><b>Memorize!</b> A pergunta vem a seguir e vale 1 ponto.</p><button id="b">Já memorizei</button></div>`;
 const b=document.getElementById('b');b.onclick=()=>quiz(i);b.focus()}
function resume(){ov.hidden=1;ov.innerHTML='';state='play';keys={};pad={};jH=1}
function next(){resume()}
function quiz(n){state='quiz';const q=QZ[n],ord=shuf([0,1,2]);
 ov.innerHTML=`<div class="card" role="dialog"><h2>Pergunta: vale 1 ponto</h2><hr><p>${q[0]}</p>${ord.map((oi,pos)=>`<button class="o" data-i="${oi}">${'ABC'[pos]}) ${q[1][oi]}</button>`).join('')}</div>`;
 ov.querySelectorAll('.o').forEach(b=>b.onclick=()=>{state='tip';const ok=+b.dataset.i==q[2];if(ok){qOk++;score++}
  ov.innerHTML=`<div class="card"><h2>${ok?'Acertou! +1 ponto':'Quase!'}</h2><hr><p>${ok?'':'A resposta certa: <b>'+q[1][q[2]]+'</b>. '}${q[3]}</p>${tips>=8?'<hr><p><b>As 8 caixas foram abertas!</b> Agora derrote o Chefe Dívida e cruze a bandeira para vencer.</p>':''}<button id="b">Continuar</button></div>`;
  const c=document.getElementById('b');c.onclick=next;c.focus()});
 ov.querySelector('.o').focus()}
function over(){window.adminixDone&&adminixDone('financas',score);state='end';ov.hidden=0;ov.innerHTML=`<div class="card dark"><h2>Fim de jogo: saldo no vermelho</h2><p>Você abriu ${tips} de 8 caixas e fez ${score} ponto(s). Dívida pesa; planejamento alivia.</p><button id="b">Jogar novamente</button></div>`;btn()}
function win(){state='end';window.adminixDone&&adminixDone('financas',score);const r=qOk>=8?'Mestre das Finanças':qOk>=6?'Investidor Experiente':qOk>=4?'Poupador em Ascensão':'Iniciante curioso: leia as dicas com mais atenção';
 ov.hidden=0;ov.innerHTML=`<div class="card dark"><h2>Meta alcançada!</h2><canvas id="v" width="108" height="108" style="float:right;width:12cqw;image-rendering:pixelated"></canvas><p>Você derrotou o Chefe Dívida!</p><p>Pontos: <b>${score} de 8</b></p><p>Caixas abertas: <b>${tips} de 8</b></p><p>Seu nível: <b>${r}</b></p><button id="b">Jogar novamente</button></div>`;
 document.getElementById('v').getContext('2d').drawImage(atlas,3*72,72,72,72,0,0,108,108);btn()}
function btn(){const b=document.getElementById('b');b.onclick=()=>{init();resume()};b.focus()}
function menu(){ov.innerHTML=`<div class="card dark"><h1>Jefferson Jr.<br>Missão Saldo Positivo</h1><p>Bata a cabeça nas <b style="color:var(--gold)">8 caixas $</b>, derrote o <b>Chefe Dívida</b> no final e cruze a bandeira para vencer. Cada caixa traz uma <b>dica de finanças</b> sorteada e, em seguida, uma <b>pergunta</b> sobre ela. Acertou? <b>Ganha 1 ponto!</b> Pise na Inflação (%) e nas Dívidas (−) para eliminá-las. O chefe aguenta 3 pisões.</p><hr><p><kbd>←</kbd> <kbd>→</kbd> ou <kbd>A</kbd> <kbd>D</kbd> movem. <kbd>Espaço</kbd>, <kbd>↑</kbd> ou <kbd>W</kbd> pulam. <kbd>Shift</kbd> (ou <kbd>X</kbd>) dá um dash que esmaga inimigos e <kbd>↓</kbd> ou <kbd>S</kbd> agacha. Passe agachado pelo túnel de tijolos.</p><button id="b">Jogar</button></div>`;document.getElementById('b').onclick=()=>{init();resume()};document.getElementById('b').focus()}
addEventListener('keydown',e=>{if(state=='tip'&&!e.repeat&&['Enter',' ','Escape'].includes(e.key)){e.preventDefault();document.getElementById('b')?.click();return}
 if(state=='play'){keys[e.key.length>1?e.key:e.key.toLowerCase()]=1;if([' ','ArrowUp','ArrowDown'].includes(e.key))e.preventDefault()}});
addEventListener('keyup',e=>{if(state!='play'&&e.key==' ')e.preventDefault();delete keys[e.key.length>1?e.key:e.key.toLowerCase()]});
document.querySelectorAll('#tc button').forEach(b=>{const k=b.dataset.k,on=e=>{e.preventDefault();pad[k]=1},off=()=>{pad[k]=0};b.onpointerdown=on;b.onpointerup=b.onpointerleave=b.onpointercancel=off});
const K=n=>keys[n]||pad[n];
function die(){if(P.dead)return;P.dead=70;P.vy=-11;lives--;P.vest=0}
function setH(h){if(P.h==h)return;P.y+=P.h-h;P.h=h}
function canStand(){const y0=P.y+P.h-54,a=Math.floor(P.x/T),b=Math.floor((P.x+P.w-1)/T);for(let x=a;x<=b;x++)for(let y=Math.floor(y0/T);y<=Math.floor((P.y+P.h-1)/T);y++)if(S(x,y))return 0;return 1}
function upd(){tk++;if(ban>0)ban--;const zz=Zi(P.x);if(zz!=curZ){curZ=zz;ban=150}
 if(P.dead){P.dead--;P.vy+=.6;P.y+=P.vy;if(!P.dead){if(lives<=0)return over();P.h=54;P.dash=0;P.x=P.cp;P.y=9*T-54;P.vx=P.vy=0;P.inv=120}return}
 const L=K('ArrowLeft')||K('a'),Rr=K('ArrowRight')||K('d'),d=(Rr?1:0)-(L?1:0),dk=K('ArrowDown')||K('s'),mx=5*(P.h<54?.45:1);
 if(d){P.vx+=d*.55;P.face=d}else P.vx*=.78;P.vx=Math.max(-mx,Math.min(mx,P.vx));if(Math.abs(P.vx)<.05)P.vx=0;
 if(P.on)P.dused=0;P.dcd--;
 if(dk&&P.on&&P.h==54)setH(30);else if(P.h==30&&(!dk||!P.on)&&canStand())setH(54);
 const dp=K('Shift')||K('x')||K('k');if(!dp)dH=0;else if(!dH){dH=1;if(!P.dash&&P.dcd<=0&&!P.dused){P.dash=13;P.dcd=30;if(!P.on)P.dused=1}}
 const jp=K(' ')||K('ArrowUp')||K('w');P.coy=P.on?6:P.coy-1;
 if(jp&&!jH&&P.coy>0&&!(P.dash>0)){P.vy=-14.2;P.coy=0;P.on=0;jH=1}if(!jp){jH=0;if(P.vy<-4.5)P.vy=-4.5}
 if(P.dash>0){P.dash--;P.vx=P.face*14;P.vy=0}else P.vy=Math.min(P.vy+.62,14);P.on=0;mX(P,P.vx);mY(P,P.vy);if(P.x<0)P.x=0;
 for(const c of CPS)if(P.x>c*T&&P.cp<c*T)P.cp=c*T;
 if(P.y>VH+60)die();if(P.x+P.w/2>FLAG*T){if(boss.dead||boss.gone)return win();if(tk%80==0)pop(P.x+14,P.y-20,'Derrote o chefe!','#ff9a9a')}if(P.inv>0)P.inv--;
 for(const c of coins)if(!c.got&&Math.abs(c.x-P.x-14)<24&&Math.abs(c.y-P.y-P.h/2)<34){c.got=1;const m=P.vest?2:1;score+=10*m;pop(c.x,c.y,'+'+10*m)}
 for(const e of enemies){if(e.gone)continue;if(e.dead){if(--e.dead<=0)e.gone=1;continue}
  const ax=e.d>0?e.x+e.w+2:e.x-2,tx=Math.floor(ax/T);
  if(S(tx,Math.floor((e.y+e.h-2)/T))||!S(tx,Math.floor((e.y+e.h+1)/T)))e.d*=-1;e.x+=e.d*1.1;
  if(P.x<e.x+e.w&&P.x+P.w>e.x&&P.y<e.y+e.h&&P.y+P.h>e.y){
   if(P.dash>0){e.dead=20;pop(e.x,e.y,'Esmagou!','#9cffc0')}
   else if(P.vy>0&&P.y+P.h-e.y<26){e.dead=20;P.vy=jp?-12:-8;pop(e.x,e.y,'Esmagou!','#9cffc0')}
   else if(!P.inv){if(P.vest){P.vest=0;P.inv=100;P.vy=-6;pop(P.x,P.y-10,'Escudo perdido','#ff9a9a')}else die()}}}
 if(!boss.gone){const b=boss;if(b.dead){if(--b.dead<=0)b.gone=1}else{
  const ax=b.d>0?b.x+b.w+2:b.x-2,tx=Math.floor(ax/T);if(S(tx,Math.floor((b.y+b.h-2)/T)))b.d*=-1;b.x+=b.d*.8;if(b.inv>0)b.inv--;
  if(P.x<b.x+b.w&&P.x+P.w>b.x&&P.y<b.y+b.h&&P.y+P.h>b.y){
   const st=P.vy>0&&P.y+P.h-b.y<34&&!(P.dash>0);
   if(P.dash>0||st){if(!b.inv){b.hp--;b.inv=30;pop(b.x+30,b.y-44,b.hp>0?'Acertou!':'Derrotado!','#9cffc0');if(b.hp<=0)b.dead=40}if(st)P.vy=jp?-12:-10}
   else if(!b.inv&&!P.inv)die()}}}
 for(const k in bump)if(--bump[k]<=0)delete bump[k];
 fx.forEach(f=>{f.t--;f.y-=.8});fx=fx.filter(f=>f.t>0);
 cam=Math.max(0,Math.min(W*T-VW,P.x-VW*.4))}
function T2(s,x,y,sz,col,al){g.font=sz+"px 'Press Start 2P',monospace";g.textAlign=al||'left';g.lineWidth=4;g.strokeStyle='#000b';g.strokeText(s,x,y);g.fillStyle=col||'#fff';g.fillText(s,x,y)}
function draw(){
 const Zc=ZP[Zi(cam+VW/2)],sk=g.createLinearGradient(0,0,0,VH);sk.addColorStop(0,Zc.s[0]);sk.addColorStop(.7,Zc.s[1]);sk.addColorStop(1,Zc.s[2]);g.fillStyle=sk;g.fillRect(0,0,VW,VH);
 for(let i=0;i<60;i++){g.fillStyle='#fff6';g.fillRect((i*173)%VW,(i*61)%220,2,2)}
 for(let l=0;l<2;l++){const sp=l?.35:.18,w=l?70:120;for(let i=-1;i<VW/w+2;i++){const n=Math.floor(cam*sp/w)+i,h=(l?60:110)+((n*53)%7+7)%7*(l?14:22),x=n*w-cam*sp,up=n%3!=0;
  g.globalAlpha=l?.28:.16;g.fillStyle=up?Zc.up:Zc.dn;g.fillRect(x+w*.3,VH-h-90,w*.4,h);g.fillRect(x+w*.48,VH-h-120,3,h+60)}}g.globalAlpha=1;
 g.save();g.translate(-Math.floor(cam),0);
 for(let y=0;y<R;y++)for(let x=Math.floor(cam/T);x<=Math.floor((cam+VW)/T);x++){const t=grid[y][x];if(!t)continue;
  const b=bump[x+','+y],oy=b?-Math.sin(b/10*Math.PI)*10:0,px=x*T,py=y*T+oy;
  if(t==1){const z=ZP[Zi(px)];g.fillStyle=z.g;g.fillRect(px,py,T,T);g.fillStyle=z.gd;g.fillRect(px,py+T-3,T,3);g.fillRect(px+T-3,py,3,T);if(!grid[y-1]?.[x]){g.fillStyle=z.gt;g.fillRect(px,py,T,9);g.fillStyle=z.gt2;g.fillRect(px,py+9,T,4)}}
  else if(t==5){g.fillStyle='#2fbf5a';g.fillRect(px,py,T,T);g.fillStyle='#8cf0a8';g.fillRect(px+5,py,6,T);g.fillStyle='#14532d';g.fillRect(px+T-6,py,6,T);if(grid[y-1][x]!=5){g.fillRect(px,py,T,5);g.fillRect(px,py+T-4,T,4)}}
  else if(t==2){g.fillStyle='#b5532e';g.fillRect(px,py,T,T);g.fillStyle='#6e2c14';g.fillRect(px,py+T/2-1,T,3);g.fillRect(px+T/2-1,py,3,T/2);g.fillRect(px+T/4,py+T/2,3,T/2);g.strokeStyle='#4a1d0c';g.lineWidth=3;g.strokeRect(px+1.5,py+1.5,T-3,T-3)}
  else{const u=t==4;g.fillStyle=u?'#6b5a3a':'#f5c431';g.fillRect(px,py,T,T);g.fillStyle=u?'#52452c':'#ffe27a';g.fillRect(px+4,py+4,T-8,5);g.strokeStyle=u?'#2c2415':'#7a5200';g.lineWidth=4;g.strokeRect(px+2,py+2,T-4,T-4);
   if(!u){g.font="24px 'Press Start 2P',monospace";g.textAlign='center';g.fillStyle='#7a5200';g.fillText('$',px+T/2+2,py+34);g.fillStyle='#fff6c9';g.fillText('$',px+T/2,py+32)}}}
 const fx0=FLAG*T;g.fillStyle='#d8d8d8';g.fillRect(fx0,4*T,6,5*T);g.fillStyle='#f5c431';g.fillRect(fx0-3,4*T-8,12,10);
 for(let i=0;i<6;i++)for(let j=0;j<4;j++){g.fillStyle=(i+j)%2?'#111':'#fff';g.fillRect(fx0+6+i*8,4*T+j*8,8,8)}
 for(const c of coins){if(c.got)continue;const w=Math.abs(Math.cos((tk+c.x)/14))*9+2;g.fillStyle='#f5c431';g.beginPath();g.ellipse(c.x,c.y,w,11,0,0,7);g.fill();g.strokeStyle='#7a5200';g.lineWidth=2;g.stroke()}
 for(const e of enemies){if(e.gone)continue;const h=e.dead?e.h*.35:e.h,y=e.y+e.h-h;g.fillStyle=e.k?'#8e44ad':'#e8572a';g.beginPath();g.roundRect(e.x,y,e.w,h,10);g.fill();g.strokeStyle='#000a';g.lineWidth=3;g.stroke();
  if(!e.dead){g.fillStyle='#fff';g.fillRect(e.x+7,y+8,9,10);g.fillRect(e.x+22,y+8,9,10);g.fillStyle='#000';g.fillRect(e.x+(e.d>0?11:7),y+11,5,7);g.fillRect(e.x+(e.d>0?26:22),y+11,5,7);g.fillStyle='#000';g.fillRect(e.x+6,y+5,12,3);g.fillRect(e.x+20,y+5,12,3);T2(e.k?'−':'%',e.x+19,y+36,12,'#fff','center')}}
 if(!boss.gone){const b=boss,h=b.dead?b.h*.3:b.h,y=b.y+b.h-h;if(!(b.inv&&tk%6<3)){g.fillStyle='#7b2fd6';g.beginPath();g.roundRect(b.x,y,b.w,h,16);g.fill();g.strokeStyle='#000a';g.lineWidth=4;g.stroke();
  if(!b.dead){g.fillStyle='#fff';g.fillRect(b.x+14,y+18,16,18);g.fillRect(b.x+46,y+18,16,18);g.fillStyle='#000';g.fillRect(b.x+(b.d>0?22:16),y+24,8,12);g.fillRect(b.x+(b.d>0?54:48),y+24,8,12);g.fillRect(b.x+12,y+10,22,4);g.fillRect(b.x+42,y+10,22,4);g.fillStyle='#f5c431';g.fillRect(b.x+16,y-12,44,12);g.fillRect(b.x+16,y-22,8,10);g.fillRect(b.x+34,y-26,8,14);g.fillRect(b.x+52,y-22,8,10);T2('-R$',b.x+38,y+70,12,'#fff','center');T2('♥'.repeat(b.hp),b.x+38,y-34,12,'#ff9a9a','center')}}}
 const p=P,run=Math.abs(p.vx)>5,fr=p.dead||p.dash>0?11:p.h<54?4:p.vest?(!p.on?15:p.vx&&tk%16<8?15:14):!p.on?(p.vy<0?6:20):K('ArrowDown')&&!p.vx?4:Math.abs(p.vx)>.4?(run?[0,1,5,1]:[7,12,8,13])[Math.floor(tk/(run?4:6))%4]:3;
 if(!(p.inv&&tk%6<3)){for(let i=p.dash>0?3:0;i>=0;i--){g.globalAlpha=i?.18:1;g.save();g.translate(p.x+p.w/2-p.face*i*16,p.y+p.h+1);g.scale(p.face,1);g.drawImage(atlas,(fr%7)*72,Math.floor(fr/7)*72,72,72,-36,-72,72,72);g.restore()}g.globalAlpha=1}
 for(const f of fx){g.globalAlpha=Math.min(1,f.t/20);T2(f.s,f.x,f.y,11,f.c,'center')}g.globalAlpha=1;g.restore();
 T2('PONTOS '+score+'/8',16,32,14,'#ffe27a');T2('CAIXAS '+tips+'/8',16,58,11,'#9cffc0');if(!boss.gone&&!boss.dead&&P.x>64*T)T2('CHEFE DÍVIDA '+'♥'.repeat(boss.hp),VW-16,58,11,'#ff9a9a','right');T2('VIDAS '+'♥'.repeat(Math.max(0,lives)),VW-16,32,14,'#ff9a9a','right');
 if(ban>0){g.globalAlpha=Math.min(1,ban/40);T2(ZN[curZ],VW/2,120,18,'#fff','center');g.globalAlpha=1}}
let last=0,acc=0;function loop(t){acc+=Math.min(50,t-last);last=t;while(acc>16.7){acc-=16.7;if(state=='play')upd()}draw();requestAnimationFrame(loop)}
init();menu();document.fonts.load("12px 'Press Start 2P'").finally(()=>requestAnimationFrame(loop));
