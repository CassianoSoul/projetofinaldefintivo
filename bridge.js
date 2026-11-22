/* Ponte entre os jogos e o portal Adminix (usa postMessage). */
(function () {
  function send(m) { try { parent.postMessage(m, '*'); } catch (e) {} }
  window.adminixDone = function (game, score) { send({ type: 'adminix:done', game: game, score: score }); };
  addEventListener('keydown', function (e) { if (e.key === 'Delete' && !e.repeat) send({ type: 'adminix:delete' }); });
})();
