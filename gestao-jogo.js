/* jogo.js: lógica do jogo. Depende de conteudo.js e licoes.js (carregados antes). */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BEST_KEY = 'mesa-triagem-recorde';
  var DOCS_PER_LEVEL = 999;
  var TOTAL_DOCS = 10;

  function loadBest() { try { return parseInt(localStorage.getItem(BEST_KEY), 10) || 0; } catch (e) { return 0; } }
  function saveBest(v) { try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) {} }
  function fmt(n) { return n.toLocaleString('pt-BR'); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  var LESSON_BY_ID = {};
  LESSONS.forEach(function (l) { LESSON_BY_ID[l.id] = l; });

  // Som
  var audio = null, soundOn = true;
  function beep(freq, dur, type, delay, vol) {
    if (!soundOn) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      var o = audio.createOscillator(), g = audio.createGain();
      var t = audio.currentTime + (delay || 0), v = vol || 0.06;
      o.type = type || 'sine'; o.frequency.value = freq;
      o.connect(g); g.connect(audio.destination);
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t); o.stop(t + dur);
    } catch (e) {}
  }
  var sfx = {
    ok: function () { beep(660, 0.09, 'triangle'); beep(880, 0.13, 'triangle', 0.08); },
    no: function () { beep(170, 0.28, 'sawtooth', 0, 0.05); },
    up: function () { beep(523, 0.1, 'triangle'); beep(659, 0.1, 'triangle', 0.1); beep(784, 0.16, 'triangle', 0.2); },
    end: function () { beep(392, 0.2, 'triangle'); beep(330, 0.2, 'triangle', 0.2); beep(262, 0.4, 'triangle', 0.4); }
  };

  // Elementos
  var doc = $('doc'), stage = $('stage'), fb = $('fb'), traysEl = $('trays');
  var telaInicio = $('telaInicio'), telaJogo = $('telaJogo'), telaFim = $('telaFim');
  var modal = $('modal'), modalCard = modal.querySelector('.modal-card'), mCorpo = $('mCorpo'), mAcoes = $('mAcoes');
  var trayEls = {}, pileEls = {}, countEls = {};
  var timeBar = null;

  // Legenda e bandejas
  var legenda = $('legenda');
  ORDER.forEach(function (k, i) {
    var item = document.createElement('div');
    item.className = 'legend-item';
    item.style.setProperty('--c', 'var(--c-' + k + ')');
    item.innerHTML = '<span class="swatch">' + (i + 1) + '</span><div><b>' + DEPTS[k].nome + '</b><span class="d">' + DEPTS[k].desc + '</span></div>';
    legenda.appendChild(item);

    var b = document.createElement('button');
    b.type = 'button'; b.className = 'tray'; b.dataset.dep = k;
    b.style.setProperty('--c', 'var(--c-' + k + ')');
    b.setAttribute('aria-label', DEPTS[k].nome + ', tecla ' + (i + 1));
    b.innerHTML = '<span class="tray-key">' + (i + 1) + '</span><span class="tray-name">' + DEPTS[k].nome + '</span><span class="tray-count">0 arq.</span><span class="pile"></span>';
    traysEl.appendChild(b);
    trayEls[k] = b; pileEls[k] = b.querySelector('.pile'); countEls[k] = b.querySelector('.tray-count');
    b.addEventListener('click', function () { resolve(k, { x: 0, y: 0 }); });
  });

  // Estado
  var S = null;
  function newState() {
    var fi = {};
    ORDER.forEach(function (k) { fi[k] = Math.floor(Math.random() * FATOS[k].length); });
    return { score: 0, level: 1, lives: 3, streak: 0, bestStreak: 0, done: 0, correct: 0, cur: null, urgent: false,
      deadline: 0, duration: 1, deck: [], mistakes: [], filed: { fin: 0, rh: 0, jur: 0, log: 0, com: 0 }, fi: fi,
      locked: false, running: false, raf: 0, paused: false, pausedAt: 0, onResume: null };
  }

  function updateHud(pulseIds) {
    $('vPontos').textContent = fmt(S.score);
    $('vNivel').textContent = Math.min(S.done + 1, TOTAL_DOCS) + '/' + TOTAL_DOCS;
    $('vSeq').textContent = S.streak;
    var mult = multiplier();
    $('vMult').textContent = mult > 1 ? '×' + fmt(mult) : '';
    var pips = $('pips'); pips.innerHTML = '';
    for (var i = 0; i < 3; i++) {
      var p = document.createElement('span');
      var used = i < (3 - S.lives);
      p.className = 'pip' + (used ? ' used' : '');
      p.textContent = used ? '×' : '';
      pips.appendChild(p);
    }
    (pulseIds || []).forEach(function (id) {
      var el = $(id); el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse');
    });
  }
  function multiplier() { return Math.min(3, 1 + Math.floor(S.streak / 5) * 0.5); }

  function refreshTray(k) {
    countEls[k].textContent = S.filed[k] + ' arq.';
    pileEls[k].style.height = (Math.min(S.filed[k], 12) * 3 + 3) + 'px';
  }

  function setFeedback(kind, label, text, dep, fato) {
    var chip = '<span class="chip ' + (kind === 'dep' ? 'dep' : kind) + '"' + (dep ? ' style="--c:var(--c-' + dep + ')"' : '') + '>' + label + '</span>';
    var extra = fato ? '<span class="fato"><b>No dia a dia:</b> ' + esc(fato) + '</span>' : '';
    fb.innerHTML = chip + '<p>' + esc(text) + extra + '</p>';
  }

  function pop(text, kind) {
    var s = document.createElement('span');
    s.className = 'pop ' + kind; s.textContent = text;
    stage.appendChild(s);
    s.addEventListener('animationend', function () { s.remove(); });
  }

  // Pausa
  function pauseGame() {
    if (S && S.running && !S.paused) { S.paused = true; S.pausedAt = performance.now(); }
  }
  function resumeGame() {
    if (S && S.running && S.paused) {
      S.deadline += performance.now() - S.pausedAt;
      S.paused = false;
      var f = S.onResume; S.onResume = null;
      if (f) f();
    }
  }
  var autoPaused = false;
  document.addEventListener('visibilitychange', function () {
    if (!S || !S.running) return;
    if (document.hidden) { if (!S.paused) { autoPaused = true; pauseGame(); } }
    else if (autoPaused) { autoPaused = false; resumeGame(); }
  });

  // Janela (mentoria e guia)
  var modalState = null, prevFocus = null;

  function blocksHTML(blocks) {
    return blocks.map(function (b) {
      var h = b.label && b.type !== 'tip' ? '<h3 class="blk-h">' + esc(b.label) + '</h3>' : '';
      if (b.type === 'p') return '<p class="blk-p">' + esc(b.text) + '</p>';
      if (b.type === 'list') return '<div>' + h + '<ul class="blk-list">' + b.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></div>';
      if (b.type === 'chips') return '<div>' + h + '<div class="blk-chips">' + b.items.map(function (i) { return '<span>' + esc(i) + '</span>'; }).join('') + '</div></div>';
      if (b.type === 'gloss') return '<div>' + h + '<dl class="gloss">' + b.items.map(function (i) { return '<div><dt>' + esc(i[0]) + '</dt><dd>' + esc(i[1]) + '</dd></div>'; }).join('') + '</dl></div>';
      if (b.type === 'tip') return '<aside class="blk-tip"><b>' + esc(b.label) + '</b><p>' + esc(b.text) + '</p></aside>';
      return '';
    }).join('');
  }
  function lessonHead(l, titleOverride) {
    return '<div class="lesson-head"><span class="lesson-badge">' + esc(l.badge) + '</span><div><div class="kicker">' + esc(l.kicker) + '</div><h2 class="lesson-title" id="mTitulo">' + esc(titleOverride || l.title) + '</h2></div></div>';
  }
  function lessonStyle(l) {
    return l.dep ? '--c:var(--c-' + l.dep + ');--on:var(--on-c)' : '--c:var(--ink);--on:var(--bg)';
  }
  function lessonHTML(l) {
    return '<div class="lesson" style="' + lessonStyle(l) + '">' + lessonHead(l) + blocksHTML(l.blocks) + '</div>';
  }
  function dicasHTML() {
    var tips = LESSONS.filter(function (l) { return l.tipo === 'dica'; });
    var head = lessonHead({ badge: 'DICA', kicker: 'Para a vida de aprendiz' }, 'Dicas de carreira');
    return '<div class="lesson" style="--c:var(--ink);--on:var(--bg)">' + head +
      tips.map(function (l) { return '<section class="tip-sec"><h3 class="blk-h">' + esc(l.title) + '</h3>' + blocksHTML(l.blocks) + '</section>'; }).join('') + '</div>';
  }

  function openModal(o) {
    if (!modal.hidden) return;
    modalState = o;
    mCorpo.innerHTML = o.html;
    mAcoes.innerHTML = '';
    o.actions.forEach(function (a) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'btn sm' + (a.primary ? '' : ' alt');
      b.textContent = a.label;
      b.addEventListener('click', function () { closeModal(); });
      mAcoes.appendChild(b);
    });
    prevFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    modalCard.scrollTop = 0;
    if (o.pause) pauseGame();
    var first = mAcoes.querySelector('button');
    if (first) { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }
  }
  function closeModal() {
    if (modal.hidden) return;
    var st = modalState; modalState = null;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (st && st.pause) resumeGame();
    if (prevFocus && prevFocus.focus && document.contains(prevFocus)) { try { prevFocus.focus({ preventScroll: true }); } catch (e) {} }
    prevFocus = null;
    if (st && st.onClose) st.onClose();
  }
  modal.addEventListener('click', function (e) {
    if (e.target === modal && modalState && modalState.dismiss !== false) closeModal();
  });
  modal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
    if (e.key === 'Tab') {
      var f = modal.querySelectorAll('button');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === modalCard)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  var GUIDE_TABS = ['adm', 'fin', 'rh', 'jur', 'log', 'com', 'dicas'];
  function openGuide(id) {
    var cur = id || 'adm';
    var inGame = !!(S && S.running);
    var tabs = GUIDE_TABS.map(function (t) {
      var name = t === 'adm' ? 'Área ADM' : t === 'dicas' ? 'Dicas' : DEPTS[t].nome;
      var st = DEPTS[t] ? '--c:var(--c-' + t + ');--on:var(--on-c)' : '--c:var(--ink);--on:var(--bg)';
      return '<button type="button" class="tab" data-tab="' + t + '" aria-pressed="false" style="' + st + '">' + name + '</button>';
    }).join('');
    openModal({
      pause: inGame,
      html: '<div class="kicker">Guia das áreas' + (inGame ? ' · jogo em pausa' : '') + '</div><div class="tabs" id="gTabs">' + tabs + '</div><div id="gConteudo"></div>',
      actions: [{ label: inGame ? 'Voltar ao jogo' : 'Fechar', primary: true }]
    });
    function show(t) {
      Array.prototype.forEach.call(document.querySelectorAll('#gTabs .tab'), function (b) { b.setAttribute('aria-pressed', String(b.dataset.tab === t)); });
      $('gConteudo').innerHTML = t === 'dicas' ? dicasHTML() : lessonHTML(LESSON_BY_ID[t]);
      modalCard.scrollTop = 0;
    }
    $('gTabs').addEventListener('click', function (e) {
      var b = e.target.closest('.tab'); if (b) show(b.dataset.tab);
    });
    show(cur);
  }

  function showMentor(level) {
    var id = MENTOR_ORDER[(level - 2) % MENTOR_ORDER.length];
    var l = LESSON_BY_ID[id];
    var html = '<div class="mentor-bar"><span class="stripe" aria-hidden="true"></span><span class="kicker">Hora da Mentoria · Nível ' + level + '</span></div>' +
      lessonHTML(l) +
      '<p class="mentor-note">O jogo está em pausa. O próximo documento só chega quando você continuar.</p>';
    openModal({
      pause: true, dismiss: false, html: html,
      actions: [{ label: 'Continuar o expediente', primary: true }],
      onClose: function () { if (S && S.running) nextDoc(); }
    });
  }

  // Documentos
  function currentDuration(urgent) {
    var base = Math.max(5, 9 - S.done * 0.35);
    return urgent ? Math.max(3, base * 0.72) : base;
  }

  function nextDoc() {
    if (!S.deck.length) S.deck = shuffle(DOCS.slice());
    var d = S.deck.pop();
    S.cur = d;
    S.urgent = S.done >= 4 && Math.random() < 0.2;
    S.duration = currentDuration(S.urgent);
    S.deadline = performance.now() + S.duration * 1000;
    S.locked = false;
    var num = String(Math.floor(1000 + Math.random() * 9000));
    doc.style.transition = 'none'; doc.style.transform = ''; doc.style.visibility = '';
    doc.className = 'doc' + (S.urgent ? ' urgent' : '');
    doc.innerHTML =
      '<div class="doc-time"><i></i></div>' +
      '<div class="doc-body">' +
        '<div class="doc-meta"><span>PROT. 2026-' + num + '</span>' + (S.urgent ? '<span class="stamp">Urgente · vale 2×</span>' : '') + '</div>' +
        '<h2 class="doc-title">' + d.t + '</h2>' +
        '<dl class="doc-fields">' + d.f.map(function (p) { return '<div><dt>' + p[0] + '</dt><dd>' + p[1] + '</dd></div>'; }).join('') + '</dl>' +
        '<div class="barcode" aria-hidden="true"></div>' +
      '</div><div class="verdict" aria-hidden="true"></div>';
    timeBar = doc.querySelector('.doc-time i');
    void doc.offsetWidth; doc.style.transition = '';
    doc.setAttribute('aria-label', 'Documento: ' + d.t + (S.urgent ? ', urgente' : ''));
    if (!RM) doc.animate([{ opacity: 0, transform: 'translateY(-26px) scale(.97)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 240, easing: 'ease-out' });
  }

  // Cronômetro
  function tick() {
    if (!S || !S.running) return;
    if (!S.locked && !S.paused) {
      var rem = S.deadline - performance.now();
      var frac = Math.max(0, rem / (S.duration * 1000));
      timeBar.style.transform = 'scaleX(' + frac + ')';
      timeBar.dataset.state = frac > 0.5 ? 'ok' : frac > 0.25 ? 'warn' : 'bad';
      if (rem <= 0) { resolve(null, { x: 0, y: 0 }); }
    }
    S.raf = requestAnimationFrame(tick);
  }

  // Animações
  function flyTo(dep, from, done) {
    var tr = trayEls[dep].getBoundingClientRect(), dr = doc.getBoundingClientRect();
    var dx = from.x + (tr.left + tr.width / 2 - (dr.left + dr.width / 2));
    var dy = from.y + (tr.top + tr.height / 2 - (dr.top + dr.height / 2));
    doc.classList.add('right');
    trayEls[dep].classList.remove('bump'); void trayEls[dep].offsetWidth; trayEls[dep].classList.add('bump');
    var a = doc.animate([
      { transform: 'translate(' + from.x + 'px,' + from.y + 'px) rotate(' + (from.x * 0.04) + 'deg) scale(1)', opacity: 1 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(8deg) scale(.25)', opacity: 0.2 }
    ], { duration: RM ? 1 : 300, easing: 'cubic-bezier(.5,0,.8,.4)', fill: 'forwards' });
    a.onfinish = function () { a.cancel(); done(); };
  }
  function reject(from, late, done) {
    doc.classList.add(late ? 'late' : 'wrong');
    var x = from.x, y = from.y;
    function T(dx) { return { transform: 'translate(' + (x + dx) + 'px,' + y + 'px)' }; }
    var a = doc.animate(late ? [T(0), T(0)] : [T(0), T(-14), T(14), T(-9), T(9), T(0)], { duration: RM ? 1 : (late ? 380 : 400) });
    a.onfinish = function () {
      var b = doc.animate([
        { transform: 'translate(' + x + 'px,' + y + 'px)', opacity: 1 },
        { transform: 'translate(' + x + 'px,' + (y + 50) + 'px)', opacity: 0 }
      ], { duration: RM ? 1 : 200, fill: 'forwards' });
      b.onfinish = function () { b.cancel(); done(); };
    };
  }

  // Jogada
  function resolve(dep, from) {
    if (!S || !S.running || S.locked || S.paused) return;
    S.locked = true;
    var d = S.cur, urgent = S.urgent, late = dep === null;
    var frac = Math.max(0, (S.deadline - performance.now()) / (S.duration * 1000));
    var ok = !late && dep === d.d;
    S.done++;
    var lv = 1 + Math.floor(S.done / DOCS_PER_LEVEL), levelUp = lv > S.level;
    if (levelUp) S.level = lv;
    var extra = levelUp ? ' Nível ' + S.level + '! Hora da mentoria.' : '';
    var pulses = levelUp ? ['hNivel'] : [];
    var after;

    if (ok) {
      var mult = multiplier();
      var pts = Math.round((10 + Math.round(5 * frac)) * mult * (urgent ? 2 : 1));
      S.score += pts; S.streak++; S.correct++; S.filed[dep]++;
      S.bestStreak = Math.max(S.bestStreak, S.streak);
      refreshTray(dep);
      var arr = FATOS[dep], fato = arr[S.fi[dep] % arr.length]; S.fi[dep]++;
      setFeedback('ok', 'Arquivado', d.t + ' foi para ' + DEPTS[dep].nome + '. +' + pts + ' pontos' + (mult > 1 ? ' (sequência ×' + fmt(mult) + ')' : '') + '.' + extra, null, fato);
      pop('+' + pts, 'good'); sfx.ok();
      pulses.push('hPontos', 'hSeq');
      after = function (cb) { flyTo(dep, from, cb); };
    } else {
      S.lives--; S.streak = 0; S.mistakes.push(d);
      var msg = (late ? 'Tempo esgotado. ' : '') + d.t + ' é do departamento ' + DEPTS[d.d].nome + '. ' + d.tip;
      setFeedback('no', late ? 'Prazo' : 'Devolvido', msg + extra);
      pop(late ? 'Prazo!' : 'Errou', 'bad'); sfx.no();
      pulses.push('hErros', 'hSeq');
      after = function (cb) { reject(from, late, cb); };
    }
    if (levelUp && ok) sfx.up();
    updateHud(pulses);
    after(function () {
      doc.style.visibility = 'hidden';
      if (S.lives <= 0 || S.done >= TOTAL_DOCS) { closeModal(); endGame(); return; }
      var go = function () { if (levelUp) showMentor(S.level); else nextDoc(); };
      if (S.paused) { S.onResume = go; } else { go(); }
    });
  }

  // Arrastar
  var drag = null, overDep = null;
  function trayAt(x, y) {
    var els = document.elementsFromPoint(x, y);
    for (var i = 0; i < els.length; i++) {
      var t = els[i].closest && els[i].closest('.tray');
      if (t) return t.dataset.dep;
    }
    return null;
  }
  function setOver(dep) {
    if (dep === overDep) return;
    if (overDep) trayEls[overDep].classList.remove('over');
    overDep = dep;
    if (dep) trayEls[dep].classList.add('over');
  }
  doc.addEventListener('pointerdown', function (e) {
    if (!S || !S.running || S.locked || S.paused || drag) return;
    drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: 0, y: 0 };
    try { doc.setPointerCapture(e.pointerId); } catch (err) {}
    doc.classList.add('dragging');
  });
  doc.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    drag.x = e.clientX - drag.sx; drag.y = e.clientY - drag.sy;
    doc.style.transform = 'translate(' + drag.x + 'px,' + drag.y + 'px) rotate(' + (drag.x * 0.04) + 'deg)';
    setOver(trayAt(e.clientX, e.clientY));
  });
  function endDrag(e, cancelled) {
    if (!drag || e.pointerId !== drag.id) return;
    var dep = cancelled ? null : trayAt(e.clientX, e.clientY);
    var from = { x: drag.x, y: drag.y };
    drag = null; setOver(null);
    doc.classList.remove('dragging');
    if (dep) { resolve(dep, from); } else { doc.style.transform = ''; }
  }
  doc.addEventListener('pointerup', function (e) { endDrag(e, false); });
  doc.addEventListener('pointercancel', function (e) { endDrag(e, true); });

  // Teclado
  document.addEventListener('keydown', function (e) {
    if (!S || !S.running || S.paused || !modal.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    var i = '12345'.indexOf(e.key);
    if (i > -1 && e.key.length === 1) resolve(ORDER[i], { x: 0, y: 0 });
  });

  // Telas
  function show(which) {
    telaInicio.hidden = which !== 'inicio';
    telaJogo.hidden = which !== 'jogo';
    telaFim.hidden = which !== 'fim';
  }
  function refreshBestLabel() {
    var b = loadBest();
    $('recordeInicio').textContent = b ? 'Recorde: ' + fmt(b) + ' pontos' : '';
  }

  function startGame() {
    closeModal();
    S = newState();
    ORDER.forEach(refreshTray);
    show('jogo');
    setFeedback('', 'Dica', 'Arraste o documento até a bandeja certa, toque numa bandeja ou use as teclas 1 a 5.');
    updateHud();
    nextDoc();
    S.running = true;
    S.raf = requestAnimationFrame(tick);
    window.scrollTo(0, 0);
  }

  var worstDep = null;
  function endGame() {
    if (window.adminixDone) adminixDone('gestao', S.score);
    S.running = false; cancelAnimationFrame(S.raf);
    sfx.end();
    var prev = loadBest(), isNew = S.score > prev;
    if (isNew) saveBest(S.score);
    $('fScore').textContent = fmt(S.score);
    $('fRecorde').textContent = isNew && S.score > 0 ? 'Novo recorde!' : 'Recorde: ' + fmt(Math.max(prev, S.score)) + ' pontos';
    var rank = RANKS[0][1];
    RANKS.forEach(function (r) { if (S.score >= r[0]) rank = r[1]; });
    $('fRank').textContent = rank;
    $('fAcertos').textContent = S.correct;
    $('fSeq').textContent = S.bestStreak;
    $('fNivel').textContent = 3 - S.lives;

    var list = $('fRevisar'); list.innerHTML = '';
    var counts = {}, seen = {}, n = 0;
    worstDep = null;
    S.mistakes.forEach(function (d) {
      counts[d.d] = (counts[d.d] || 0) + 1;
      if (!worstDep || counts[d.d] > counts[worstDep]) worstDep = d.d;
      if (seen[d.t] || n >= 6) return;
      seen[d.t] = true; n++;
      var li = document.createElement('li');
      li.innerHTML = '<span class="n">' + esc(d.t) + '</span><button type="button" class="chip dep" data-dep="' + d.d + '" style="--c:var(--c-' + d.d + ')">Estudar ' + esc(DEPTS[d.d].nome) + '</button>';
      list.appendChild(li);
    });
    if (!n) {
      var li0 = document.createElement('li');
      li0.innerHTML = '<span class="n">Nenhum erro registrado. Quer conferir o guia mesmo assim?</span><button type="button" class="chip" data-dep="adm">Guia ADM</button>';
      list.appendChild(li0);
    }
    show('fim');
    window.scrollTo(0, 0);
  }

  $('fRevisar').addEventListener('click', function (e) {
    var b = e.target.closest('[data-dep]'); if (b) openGuide(b.dataset.dep);
  });
  $('btnIniciar').addEventListener('click', startGame);
  $('btnDeNovo').addEventListener('click', startGame);
  $('btnGuiaInicio').addEventListener('click', function () { openGuide('adm'); });
  $('btnGuiaFim').addEventListener('click', function () { openGuide(worstDep || 'adm'); });
  $('btnGuiaTopo').addEventListener('click', function () { openGuide('adm'); });
  $('btnInicio').addEventListener('click', function () { refreshBestLabel(); show('inicio'); window.scrollTo(0, 0); });
  $('som').addEventListener('click', function () {
    soundOn = !soundOn;
    this.textContent = soundOn ? 'Som ligado' : 'Som desligado';
    this.setAttribute('aria-pressed', String(soundOn));
  });

  refreshBestLabel();
})();
