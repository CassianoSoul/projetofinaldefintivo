(function () {
  'use strict';

  /* ===== Configuração ===== */
  var ADMIN_PIN = '';   // opcional: coloque uma senha aqui (ex.: '1234') para pedir ao abrir o painel
  var PHOTOS = ['foto1.jpg', 'foto2.jpg', 'foto3.jpg'];  // fotos da tela de avaliação

  /* Para adicionar um jogo novo: acrescente um item aqui, na ordem desejada. */
  var GAMES = [
    { id: 'financas', nome: 'Finanças', titulo: 'Jefferson Jr.: Missão Saldo Positivo', icone: '💰', cor: '#39ff88',
      desc: 'Corra, abra 8 caixas $ e responda perguntas sobre dicas de finanças sorteadas.', url: 'financas.html' },
    { id: 'marketing', nome: 'Marketing', titulo: 'Mestre da Campanha', icone: '📣', cor: '#ff2d95',
      desc: 'Seja a agência: escolha público, canal e gancho certos para um cliente.', url: 'marketing.html' },
    { id: 'atendimento', nome: 'Atendimento', titulo: 'Alô, SAC! Central do Caos', icone: '🎧', cor: '#2f5bff',
      desc: 'Jogo de cartas: atenda um cliente maluco, mostre empatia e convença antes que ele desligue.', url: 'atendimento.html' },
    { id: 'gestao', nome: 'Gestão', titulo: 'Mesa de Triagem', icone: '🧭', cor: '#ff8a1f',
      desc: 'Leve 10 documentos ao departamento certo antes do prazo e conheça a área administrativa.', url: 'gestao.html' }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var S = { nome: '', done: {}, nota: 0, current: null };
  var frame = $('frame');

  /* ===== Telas ===== */
  function show(id) {
    document.querySelectorAll('.screen').forEach(function (s) { s.classList.toggle('active', s.id === 's-' + id); });
    window.scrollTo(0, 0);
    var h = document.querySelector('#s-' + id + ' h1, #s-' + id + ' h2');
    if (h && id !== 'play') { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) {} }
  }
  function stopGame() { frame.src = 'about:blank'; S.current = null; }
  function reset() { stopGame(); S = { nome: '', done: {}, nota: 0, current: null }; $('nameInput').value = ''; $('comment').value = ''; }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-go]');
    if (!b) return;
    var to = b.getAttribute('data-go');
    if (to === 'home') reset();
    if (to === 'home' || to === 'name') show(to);
    if (to === 'name') setTimeout(function () { $('nameInput').focus(); }, 30);
  });

  /* ===== Nome ===== */
  $('nameForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('nameInput').value.replace(/\s+/g, ' ').trim();
    if (!n) { $('nameErr').hidden = false; $('nameInput').focus(); return; }
    $('nameErr').hidden = true;
    S.nome = n;
    renderHub();
    show('hub');
  });

  /* ===== Jogos ===== */
  function renderHub() {
    $('hubName').textContent = S.nome;
    var box = $('cards'); box.textContent = '';
    GAMES.forEach(function (g, i) {
      var c = document.createElement('article'); c.className = 'card' + (g.soon ? ' soon' : ''); c.style.setProperty('--c', g.cor);
      var n = document.createElement('span'); n.className = 'n'; n.textContent = i + 1;
      var ic = document.createElement('div'); ic.className = 'ic'; ic.textContent = g.icone; ic.setAttribute('aria-hidden', 'true');
      var h = document.createElement('h3'); h.textContent = g.nome;
      var t = document.createElement('div'); t.className = 't'; t.textContent = g.soon ? '' : g.titulo;
      var p = document.createElement('p'); p.textContent = g.desc;
      c.append(n, ic, h);
      if (!g.soon) c.append(t);
      c.append(p);
      if (S.done[g.id]) { var ok = document.createElement('div'); ok.className = 'ok'; ok.textContent = '✔ CONCLUÍDO'; c.append(ok); }
      var go = document.createElement('button'); go.type = 'button'; go.className = 'go';
      if (g.soon) { go.textContent = 'EM BREVE'; go.disabled = true; }
      else { go.textContent = S.done[g.id] ? '▶ JOGAR DE NOVO' : '▶ JOGAR'; go.addEventListener('click', function () { openGame(g); }); }
      c.append(go); box.append(c);
    });
    var avail = GAMES.filter(function (g) { return !g.soon; });
    $('rateBtn').classList.toggle('pulse', avail.every(function (g) { return S.done[g.id]; }));
  }
  function openGame(g) {
    S.current = g; $('playTitle').textContent = g.titulo; frame.src = g.url; show('play');
  }
  $('backBtn').addEventListener('click', function () { stopGame(); renderHub(); show('hub'); });

  /* ===== Avaliação ===== */
  var starsBox = $('stars');
  for (var i = 1; i <= 5; i++) (function (v) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'star'; b.textContent = '★';
    b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false'); b.setAttribute('aria-label', v + (v === 1 ? ' estrela' : ' estrelas'));
    b.addEventListener('click', function () { setStars(v); });
    starsBox.append(b);
  })(i);
  function setStars(v) {
    S.nota = v; $('starErr').hidden = true;
    starsBox.querySelectorAll('.star').forEach(function (b, k) { b.classList.toggle('on', k < v); b.setAttribute('aria-checked', String(k + 1 === v)); });
  }
  function buildGallery() {
    var g = $('gallery'); g.textContent = '';
    PHOTOS.forEach(function (src) {
      var d = document.createElement('div'); d.className = 'slot'; d.textContent = 'Espaço para foto';
      var img = new Image(); img.alt = '';
      img.onload = function () { d.textContent = ''; d.classList.add('has'); d.append(img); };
      img.src = src; g.append(d);
    });
  }
  $('rateBtn').addEventListener('click', function () {
    stopGame(); $('rateName').textContent = S.nome; setStars(0); buildGallery(); show('rate');
  });
  $('rateBack').addEventListener('click', function () { renderHub(); show('hub'); });
  $('rateForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!S.nota) { $('starErr').hidden = false; return; }
    var r = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      nome: S.nome, estrelas: S.nota, comentario: $('comment').value.trim(),
      data: new Date().toISOString(),
      jogos: GAMES.filter(function (g) { return S.done[g.id]; }).map(function (g) { return g.nome; })
    };
    Store.add(r).then(function () {
      $('thanksName').textContent = S.nome; show('thanks');
      var nome = S.nome; reset();
      setTimeout(function () { if (document.getElementById('s-thanks').classList.contains('active')) show('home'); }, 6000);
    }, function () { alert('Não foi possível salvar a avaliação neste navegador.'); });
  });

  /* ===== Mensagens dos jogos ===== */
  addEventListener('message', function (e) {
    if (e.source !== frame.contentWindow) return;
    var d = e.data || {};
    if (d.type === 'adminix:done' && S.current && d.game === S.current.id) S.done[d.game] = true;
    if (d.type === 'adminix:delete') onDelete();
  });

  /* ===== Painel do administrador: Delete 5 vezes ===== */
  var dels = 0, delT;
  function onDelete() {
    clearTimeout(delT); dels++;
    delT = setTimeout(function () { dels = 0; }, 2500);
    if (dels >= 5) { dels = 0; openAdmin(); }
  }
  addEventListener('keydown', function (e) { if (e.key === 'Delete' && !e.repeat) onDelete(); });

  function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }
  function fmt(iso) { try { return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }); } catch (e) { return iso; } }
  function openAdmin() {
    if (ADMIN_PIN && prompt('Senha do administrador:') !== ADMIN_PIN) return;
    stopGame();
    Store.all().then(function (list) {
      list = list.slice().reverse();
      var sum = $('adminSum'); sum.textContent = '';
      var avg = list.length ? (list.reduce(function (a, r) { return a + r.estrelas; }, 0) / list.length) : 0;
      [[list.length, 'avaliações'], [list.length ? avg.toFixed(1).replace('.', ',') : '–', 'média de estrelas']].forEach(function (x) {
        var d = document.createElement('div'), b = document.createElement('b'); b.textContent = x[0];
        d.append(b, document.createTextNode(x[1])); sum.append(d);
      });
      var box = $('adminList'); box.textContent = '';
      if (!list.length) { var em = document.createElement('p'); em.className = 'empty'; em.textContent = 'Nenhuma avaliação salva ainda.'; box.append(em); }
      list.forEach(function (r) {
        var it = document.createElement('article'); it.className = 'item';
        var top = document.createElement('div'); top.className = 'top';
        var nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = r.nome;
        var st = document.createElement('span'); st.className = 'stv'; st.textContent = stars(r.estrelas); st.setAttribute('aria-label', r.estrelas + ' de 5 estrelas');
        top.append(nm, st);
        var meta = document.createElement('div'); meta.className = 'meta';
        meta.textContent = fmt(r.data) + (r.jogos && r.jogos.length ? ' · Jogos concluídos: ' + r.jogos.join(', ') : ' · Nenhum jogo concluído');
        var p = document.createElement('p'); if (r.comentario) p.textContent = r.comentario; else { p.className = 'none'; p.textContent = 'Sem comentário.'; }
        it.append(top, meta, p); box.append(it);
      });
      show('admin');
    });
  }
  $('adminExit').addEventListener('click', function () { reset(); show('home'); });
  $('adminCsv').addEventListener('click', function () {
    Store.all().then(function (list) {
      var q = function (v) { v = String(v == null ? '' : v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; };
      var rows = [['Data', 'Nome', 'Estrelas', 'Comentário', 'Jogos concluídos'].map(q).join(';')];
      list.forEach(function (r) { rows.push([fmt(r.data), r.nome, r.estrelas, r.comentario, (r.jogos || []).join(', ')].map(q).join(';')); });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob(['﻿' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
      a.download = 'avaliacoes-adminix.csv'; document.body.append(a); a.click(); a.remove();
    });
  });
})();
