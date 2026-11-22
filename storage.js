/* Armazenamento das avaliações.
   Hoje usa o localStorage do navegador (fica salvo naquele navegador/aparelho).
   Para juntar avaliações de todos os visitantes num só lugar, troque o conteúdo
   de add() e all() por chamadas a um servidor (Firebase, Supabase etc.).
   O resto do site já usa Promises, então não precisa mudar mais nada. */
var Store = (function () {
  var KEY = 'adminix:avaliacoes';
  function read() {
    try { var v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  return {
    add: function (r) {
      return new Promise(function (ok, fail) {
        try { var l = read(); l.push(r); localStorage.setItem(KEY, JSON.stringify(l)); ok(r); }
        catch (e) { fail(e); }
      });
    },
    all: function () { return Promise.resolve(read()); }
  };
})();
