/* Mestre da Campanha: jogo de marketing para jovens aprendizes.
   Sem dependências. Dados do jogo no topo; lógica das telas abaixo. */

var ROUNDS = 1;

/* Cada cliente tem: briefing, 3 grupos de escolha (p = pontos),
   pista (antes de escolher), dica (lição depois), termo e carreira. */
var CLIENTS = [
  { nome: "Padaria Pão Quente", prod: "Pão de queijo artesanal num bairro residencial", meta: "Lotar a padaria nos sábados de manhã",
    pub: [{t:"Famílias do bairro",p:3},{t:"Turistas estrangeiros",p:1},{t:"Executivos de outra cidade",p:0}],
    canal: [{t:"Grupo de WhatsApp do bairro",p:3},{t:"Anúncio em TV nacional",p:1},{t:"Outdoor na rodovia",p:0}],
    gancho: [{t:"“Sábado tem cheiro de pão quente”",p:3},{t:"“Desde 1987. Qualidade.”",p:1},{t:"“Soluções integradas de panificação”",p:0}],
    pista: "Pense em quem consegue chegar à padaria a pé, em poucos minutos.",
    dica: "Negócio local pede público local e conversa de vizinho.",
    termo: { n: "Marketing local", d: "Atrair clientes de uma região pequena, como o bairro. O público está perto e já conhece o lugar." },
    carreira: { n: "Social media", d: "Cuida das redes e dos grupos de mensagem da marca, responde clientes e planeja os posts." } },
  { nome: "Tênis Voa", prod: "Tênis de corrida ultraleve, R$ 399", meta: "Vender 500 pares no primeiro mês",
    pub: [{t:"Corredores amadores",p:3},{t:"Quem caminha por saúde",p:1},{t:"Colecionadores de sapato social",p:0}],
    canal: [{t:"Parceria com clubes de corrida e Instagram",p:3},{t:"Panfleto em shopping",p:1},{t:"Rádio AM de madrugada",p:0}],
    gancho: [{t:"“Mais leve que a sua desculpa”",p:3},{t:"“Compre agora o produto”",p:1},{t:"“Tênis. Para os pés.”",p:0}],
    pista: "Quem se interessa por um tênis ultraleve provavelmente já corre. Onde essas pessoas se encontram?",
    dica: "Nicho engajado e um gancho com personalidade vencem a mídia de massa.",
    termo: { n: "Nicho", d: "Um grupo pequeno e bem definido, com um interesse em comum. Falar com um nicho costuma custar menos e converter mais." },
    carreira: { n: "Gestor de parcerias", d: "Fecha acordos com criadores, clubes e eventos para a marca aparecer onde o público já está." } },
  { nome: "Pila", prod: "App de controle de gastos", meta: "Conquistar 10 mil usuários jovens",
    pub: [{t:"Universitários de 18 a 24 anos",p:3},{t:"Aposentados",p:1},{t:"Grandes empresas",p:0}],
    canal: [{t:"Vídeos curtos com criadores de conteúdo",p:3},{t:"E-mail frio para lista comprada",p:1},{t:"Anúncio em jornal impresso",p:0}],
    gancho: [{t:"“Seu dinheiro some? A gente acha.”",p:3},{t:"“Banco confiável desde sempre”",p:1},{t:"“Gestão financeira omnicanal”",p:0}],
    pista: "Onde os jovens passam o tempo e como eles falam? Evite palavras de banco.",
    dica: "Fale a língua do público e vá aonde ele já está olhando.",
    termo: { n: "Segmentação", d: "Dividir o público em grupos por idade, interesse ou comportamento para falar de um jeito diferente com cada um." },
    carreira: { n: "Produtor de conteúdo", d: "Planeja, grava e edita vídeos e posts que informam ou divertem o público." } },
  { nome: "Sorvete Polar", prod: "Sorveteria artesanal em pleno inverno", meta: "Vender bem mesmo com 12 °C lá fora",
    pub: [{t:"Casais e amigos que saem à noite",p:3},{t:"Crianças na saída da escola",p:1},{t:"Atletas em dieta rigorosa",p:0}],
    canal: [{t:"Cupom no app de delivery para noite de série",p:3},{t:"Carro de som no bairro",p:1},{t:"Outdoor na praia",p:0}],
    gancho: [{t:"“Sorvete no inverno: coragem deliciosa”",p:3},{t:"“Temperatura ideal: −18 °C”",p:1},{t:"“Compre sorvete”",p:0}],
    pista: "Se o clima está contra, que situação ou momento do dia combina com sorvete mesmo no frio?",
    dica: "Quando o contexto atrapalha, transforme o problema em piada.",
    termo: { n: "Sazonalidade", d: "Mudança nas vendas conforme a época do ano, como sorvete no verão. Marcas planejam o pico e inventam ideias para o vale." },
    carreira: { n: "Planejador de marketing", d: "Define o calendário de campanhas do ano e o orçamento de cada uma." } },
  { nome: "Folha Solta", prod: "Clube de assinatura de livros", meta: "Chegar a 2 mil assinantes",
    pub: [{t:"Leitores que gostam de descobrir autores novos",p:3},{t:"Quem lê um livro por ano",p:1},{t:"Quem nunca lê",p:0}],
    canal: [{t:"Newsletter e comunidades de leitura",p:3},{t:"Anúncio em rádio de trânsito",p:1},{t:"Panfleto em estádio",p:0}],
    gancho: [{t:"“Um livro surpresa por mês na sua porta”",p:3},{t:"“Livros. Muitos livros.”",p:1},{t:"“A maior leitura do mundo”",p:0}],
    pista: "Quem gosta de descobrir livros novos já acompanha que tipo de conteúdo?",
    dica: "Uma promessa concreta e fácil de imaginar converte mais que um slogan vago.",
    termo: { n: "Marketing de conteúdo", d: "Atrair pessoas com conteúdo útil ou interessante, como newsletters e vídeos, em vez de só anunciar." },
    carreira: { n: "Redator (copywriter)", d: "Escreve textos de anúncios, e-mails e sites pensados para levar a pessoa a agir." } },
  { nome: "Academia Ritmo", prod: "Academia de bairro com planos mensais", meta: "Bater a meta de matrículas de janeiro",
    pub: [{t:"Quem fez promessa de Ano Novo",p:3},{t:"Quem treina em casa há anos",p:1},{t:"Atletas de elite",p:0}],
    canal: [{t:"Anúncio geolocalizado num raio de 2 km",p:3},{t:"TV em horário nobre",p:1},{t:"Outdoor em outra cidade",p:0}],
    gancho: [{t:"“Janeiro é seu. Primeira semana grátis.”",p:3},{t:"“A melhor academia do universo”",p:1},{t:"“Matricule-se”",p:0}],
    pista: "A academia fica no bairro. Vale mostrar anúncio para alguém que mora a 200 km?",
    dica: "Aproveite o momento certo e remova o risco da primeira decisão.",
    termo: { n: "Geomarketing", d: "Mostrar anúncios só para quem está dentro de uma região. Evita gastar dinheiro com quem nunca vai aparecer." },
    carreira: { n: "Gestor de tráfego", d: "Cria e acompanha anúncios pagos: escolhe o público, define o orçamento e ajusta conforme o resultado." } },
  { nome: "Grão Justo", prod: "Café sustentável, 30% mais caro", meta: "Mostrar por que vale pagar mais",
    pub: [{t:"Consumidores que se importam com a origem",p:3},{t:"Revendedores de atacado",p:1},{t:"Quem compra sempre o mais barato",p:0}],
    canal: [{t:"Vídeos curtos mostrando a fazenda",p:3},{t:"Anúncio genérico em portal",p:1},{t:"Cupom de 70% de desconto",p:0}],
    gancho: [{t:"“Conheça quem plantou o seu café”",p:3},{t:"“Café de alta qualidade”",p:1},{t:"“O café mais barato da cidade”",p:0}],
    pista: "Quando o preço é maior, o que o cliente precisa sentir para achar que vale a pena?",
    dica: "Se o preço é maior, venda a história e o valor, não o desconto.",
    termo: { n: "Proposta de valor", d: "O motivo claro pelo qual alguém escolhe você e não outro, mesmo pagando mais." },
    carreira: { n: "Brand manager (gerente de marca)", d: "Cuida da imagem, da história e dos valores da marca para que tudo que ela faz combine." } },
  { nome: "Au Miau", prod: "Pet shop com banho e tosa", meta: "Fazer o cliente voltar todo mês",
    pub: [{t:"Tutores que postam fotos do pet",p:3},{t:"Quem pensa em adotar um dia",p:1},{t:"Quem é alérgico a pelos",p:0}],
    canal: [{t:"Cartão de pontos e lembrete no WhatsApp",p:3},{t:"Anúncio em jornal de bairro",p:1},{t:"Patrocínio de maratona de natação",p:0}],
    gancho: [{t:"“Dez banhos e o próximo é por nossa conta”",p:3},{t:"“Seu pet merece o melhor”",p:1},{t:"“Pet shop. Tosa. Banho.”",p:0}],
    pista: "O objetivo é fazer voltar, não conquistar gente nova. O que lembra a pessoa de voltar?",
    dica: "Para recorrência, fidelidade e lembretes valem mais que alcance.",
    termo: { n: "Retenção e fidelização", d: "Manter clientes voltando. Em muitos negócios, vender de novo para quem já comprou custa menos que conquistar alguém novo." },
    carreira: { n: "Analista de CRM", d: "Cuida do relacionamento com clientes: cadastros, lembretes, cupons e programas de pontos." } }
];

/* Eventos aleatórios, cada um com o conceito de marketing por trás. */
var EVENTS = [
  { t: "Viralizou!", d: "Uma criadora de conteúdo compartilhou a campanha por conta própria.", p: 3,
    a: "Viralizar é quando as pessoas espalham o conteúdo sozinhas. Ninguém controla isso, mas conteúdo curto, divertido e fácil de compartilhar aumenta a chance." },
  { t: "Matéria espontânea", d: "Um blog local falou bem da marca sem cobrar nada.", p: 2,
    a: "Isso se chama mídia espontânea: a imprensa fala de você sem ser paga. Quem cuida disso é o assessor de imprensa, e ajuda ter uma boa história para contar." },
  { t: "Boca a boca", d: "Clientes satisfeitos indicaram para amigos.", p: 1,
    a: "Indicação é um dos canais mais confiáveis, porque vem de alguém conhecido. Ela nasce de uma boa experiência de compra." },
  { t: "Dia comum", d: "Nada fora do normal aconteceu esta semana.", p: 0,
    a: "Nem toda semana é de grande resultado. Quem trabalha com marketing olha a tendência de várias semanas, não um único dia." },
  { t: "Concorrente em promoção", d: "A loja ao lado baixou o preço e roubou atenção.", p: -1,
    a: "Acompanhar concorrentes faz parte do trabalho. O pesquisador de mercado observa preço, comunicação e o que os clientes comentam." },
  { t: "Comentário polêmico", d: "Alguém interpretou seu gancho do jeito errado nas redes.", p: -2,
    a: "Isso é uma pequena crise de imagem. O caminho é responder rápido, com calma e sem brigar, e assumir o erro quando ele existe. Testar a frase com algumas pessoas antes ajuda." }
];

var GROUPS = [
  { k: "pub", name: "Público", ask: "Quem você quer atingir?",
    explica: "Público-alvo é o grupo com mais chance de querer o produto. Quanto mais específico, melhor." },
  { k: "canal", name: "Canal", ask: "Onde a campanha aparece?",
    explica: "Canal é o lugar onde a mensagem encontra o público: redes, mensagens, mídia tradicional ou rua." },
  { k: "gancho", name: "Gancho", ask: "Qual frase prende a atenção?",
    explica: "Gancho é a frase que prende a atenção nos primeiros segundos. Precisa ser clara e falar com o público escolhido." }
];

var LABEL = { 3: "Excelente +3", 1: "Razoável +1", 0: "Fraco +0" };
var app = document.getElementById("app");
var S = null;
var lastFocus = null;

function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function getBest() { try { return parseInt(localStorage.getItem("mc-best") || "0", 10) || 0; } catch (e) { return 0; } }
function setBest(v) { try { localStorage.setItem("mc-best", String(v)); } catch (e) {} }

function hud() {
  var h = document.getElementById("hud");
  h.hidden = !S;
  if (!S) return;
  document.getElementById("pRound").textContent = "Cliente do dia";
  document.getElementById("pScore").textContent = S.score;
}
function show(html, focusSel) {
  app.innerHTML = html;
  hud();
  window.scrollTo(0, 0);
  var f = app.querySelector(focusSel || "h1, h2");
  if (f) { f.setAttribute("tabindex", "-1"); try { f.focus({ preventScroll: true }); } catch (e) {} }
}

/* Guia da área (painel sobreposto) */
function openGuide() {
  var g = document.getElementById("guide");
  lastFocus = document.activeElement;
  g.hidden = false;
  g.scrollTop = 0;
  document.getElementById("guideClose").focus();
}
function closeGuide() {
  var g = document.getElementById("guide");
  if (g.hidden) return;
  g.hidden = true;
  if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
}

function intro() {
  S = null;
  var best = getBest();
  show('<section class="card hero"><div class="eyebrow">Jogo de marketing</div>' +
    '<h1>Mestre da <em>Campanha</em></h1>' +
    '<p>Você é a agência. Um cliente chega com um briefing e pouco tempo. Escolha o público, o canal e o gancho certos.</p>' +
    '<ol class="rules"><li>Cada escolha vale de 0 a 3 pontos.</li><li>Depois de lançar, o mundo real dá o seu palpite: pode viralizar ou dar errado.</li><li>Você aprende um termo e conhece uma profissão da área.</li><li>No fim, descubra o seu cargo.</li></ol>' +
    '<div class="actions"><button class="btn" data-act="start">Abrir a agência</button><button class="btn ghost" data-act="guide">Ler o guia da área</button></div>' +
    (best ? '<p>Seu recorde neste navegador: <b>' + best + ' pontos</b></p>' : '') + '</section>');
}

function newGame() {
  S = { rounds: shuffle(CLIENTS).slice(0, ROUNDS), i: 0, score: 0, pick: {}, opts: null, log: [], terms: [], careers: [] };
  play();
}

function play() {
  var c = S.rounds[S.i];
  S.pick = {};
  S.opts = { pub: shuffle(c.pub), canal: shuffle(c.canal), gancho: shuffle(c.gancho) };
  if (S.terms.indexOf(c.termo) < 0) S.terms.push(c.termo);
  var html = '<section class="card brief"><div class="mono">' + c.nome.charAt(0) + '</div><div>' +
    '<div class="eyebrow">Briefing do cliente</div><h2>' + c.nome + '</h2><p>' + c.prod + '</p>' +
    '<p class="meta">Objetivo: <span>' + c.meta + '</span></p></div></section>' +
    '<div class="coach">' +
    '<div class="learn"><b>Termo da rodada · ' + c.termo.n + '</b>' + c.termo.d + '</div>' +
    '<div class="mentor"><div class="mono sm">D</div><div><b>Dica da mentora Dani</b>' + c.pista + '</div></div></div>';
  GROUPS.forEach(function (g, gi) {
    html += '<section class="group"><h3><span class="step">' + (gi + 1) + '</span>' + g.name + ' <small>' + g.ask + '</small></h3>' +
      '<p class="explain">' + g.explica + '</p><div class="opts">';
    S.opts[g.k].forEach(function (o, oi) {
      html += '<button class="opt" type="button" aria-pressed="false" data-k="' + g.k + '" data-i="' + oi + '">' + o.t + '</button>';
    });
    html += '</div></section>';
  });
  html += '<button class="btn" id="go" data-act="launch" disabled>Lançar campanha</button>';
  show(html, "h2");
}

function launch() {
  var c = S.rounds[S.i], pts = 0, rows = '';
  GROUPS.forEach(function (g) {
    var chosen = S.opts[g.k][S.pick[g.k]];
    var best = c[g.k].reduce(function (m, o) { return o.p > m.p ? o : m; });
    pts += chosen.p;
    rows += '<div class="row"><div class="what"><div class="eyebrow">' + g.name + '</div>' + chosen.t +
      (chosen.p < 3 ? '<small>Melhor opção: ' + best.t + '</small>' : '') + '</div><span class="badge b' + chosen.p + '">' + LABEL[chosen.p] + '</span></div>';
  });
  var ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  var total = Math.max(0, pts + ev.p);
  S.score += total;
  S.log.push({ nome: c.nome, total: total });
  if (S.careers.indexOf(c.carreira) < 0) S.careers.push(c.carreira);
  var last = S.i === ROUNDS - 1;
  var evSign = ev.p > 0 ? "+" + ev.p : String(ev.p).replace("-", "−");
  show('<section class="card"><div class="eyebrow">Resultado · ' + c.nome + '</div>' +
    '<div class="total"><h2>Campanha no ar</h2><strong>' + total + ' <small>pts</small></strong></div>' +
    '<div class="bar" role="img" aria-label="' + total + ' de 12 pontos possíveis"><div id="fill"></div></div>' +
    '<div class="rows">' + rows + '</div></section>' +
    '<div class="event"><div class="eyebrow">Evento da semana · ' + evSign + '</div><b>' + ev.t + '</b><p>' + ev.d + '</p><p class="aprenda">' + ev.a + '</p></div>' +
    '<div class="tip"><b>Lição do cliente</b>' + c.dica + '</div>' +
    '<div class="career"><b>Quem faz isso na vida real</b><b>' + c.carreira.n + '</b><p>' + c.carreira.d + '</p></div>' +
    '<button class="btn" data-act="' + (last ? "finish" : "next") + '">' + (last ? "Ver meu cargo" : "Próximo cliente") + '</button>', "h2");
  requestAnimationFrame(function () { requestAnimationFrame(function () { var f = document.getElementById("fill"); if (f) f.style.width = Math.round(total / 12 * 100) + "%"; }); });
}

function finish() {
  if (window.adminixDone) adminixDone('marketing', S.score);
  var s = S.score, best = getBest(), isNew = s > best;
  if (isNew) setBest(s);
  var rank = s >= 10 ? "CMO Lendário" : s >= 7 ? "Gerente de Marca" : s >= 4 ? "Analista Júnior" : "Estagiário do café";
  var msg = s >= 10 ? "Suas campanhas viram case de faculdade." : s >= 7 ? "Bons instintos. Falta pouco para a sala da diretoria." : s >= 4 ? "Você acertou o básico. Estude mais o público de cada cliente." : "Ainda dá tempo. Releia os briefings e tente de novo.";
  var log = S.log.map(function (l) { return '<div><span>' + l.nome + '</span><b>' + l.total + ' pts</b></div>'; }).join("");
  var terms = S.terms.map(function (t) { return '<li><b>' + t.n + ':</b> <span>' + t.d + '</span></li>'; }).join("");
  var careers = S.careers.map(function (t) { return '<li><b>' + t.n + ':</b> <span>' + t.d + '</span></li>'; }).join("");
  show('<section class="card hero"><div class="eyebrow">Fim do expediente</div><div class="rank">' + rank + '</div>' +
    '<p><b>' + s + ' pontos</b> de 12 possíveis. ' + msg + '</p>' +
    (isNew ? '<p><b>Novo recorde!</b></p>' : '<p>Recorde: ' + Math.max(best, s) + ' pontos</p>') +
    '<div class="log">' + log + '</div>' +
    '<div class="notebook"><h3>Seu caderno de termos</h3><ul>' + terms + '</ul></div>' +
    '<div class="notebook"><h3>Profissões que você conheceu</h3><ul>' + careers + '</ul></div>' +
    '<div class="notebook"><h3>Para continuar aprendendo</h3><ul>' +
    '<li>Observe campanhas ao seu redor e tente descobrir o público, o canal e o gancho de cada uma.</li>' +
    '<li>Ajude um negócio do bairro ou um projeto da escola a divulgar algo e anote o que funcionou.</li>' +
    '<li>Treine escrever: um bom texto curto vale metade de uma campanha.</li>' +
    '<li>Pratique números básicos, como porcentagem, média e leitura de gráficos. Marketing hoje se decide com dados.</li></ul></div>' +
    '<div class="actions"><button class="btn" data-act="start">Jogar novamente</button><button class="btn ghost" data-act="guide">Guia da área</button></div></section>', ".rank");
}

document.addEventListener("click", function (e) {
  var opt = e.target.closest(".opt");
  if (opt && S) {
    var k = opt.getAttribute("data-k");
    S.pick[k] = parseInt(opt.getAttribute("data-i"), 10);
    opt.parentNode.querySelectorAll(".opt").forEach(function (b) { b.setAttribute("aria-pressed", b === opt ? "true" : "false"); });
    document.getElementById("go").disabled = !(S.pick.pub !== undefined && S.pick.canal !== undefined && S.pick.gancho !== undefined);
    return;
  }
  var a = e.target.closest("[data-act]");
  if (a) {
    var act = a.getAttribute("data-act");
    if (act === "guide") openGuide();
    else if (act === "guide-close") closeGuide();
    else if (act === "start") newGame();
    else if (act === "launch") launch();
    else if (act === "next") { S.i++; hud(); play(); }
    else if (act === "finish") { S.i = ROUNDS - 1; finish(); }
    return;
  }
  if (e.target.id === "guide") closeGuide();
});
document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeGuide(); });

intro();
