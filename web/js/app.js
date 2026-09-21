/*
 * El Buen Gusto · pedidos en línea
 * Carta → carrito → datos de entrega → mensaje de WhatsApp con código de pedido.
 * Sin dependencias ni build: se abre con doble clic en index.html.
 */
(function () {
  "use strict";

  var CFG = window.EBG_CONFIG;
  var CAT = window.EBG_CATALOGO;
  var FAVS = window.EBG_FAVORITOS || [];

  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var DIAS_CORTOS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var CLIENTE_CAMPOS = ["nombre", "celular", "entrega", "distrito", "direccion", "referencia", "ruc", "razon"];

  /* ---------- utilidades ---------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function store(key, value) {
    try {
      if (value === undefined) { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
      if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { return null; }
    return null;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var nf;
  try { nf = new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); } catch (e) { nf = null; }
  function money(n) { return "S/ " + (nf ? nf.format(n) : Number(n).toFixed(2)); }

  function norm(s) { return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }

  // Resalta los términos buscados sin importar tildes (NFC y NFD sin tildes tienen el mismo largo).
  function hl(text, terms) {
    if (!terms.length) return esc(text);
    var n = norm(text);
    var marks = new Array(text.length).fill(false);
    terms.forEach(function (t) {
      var i = n.indexOf(t);
      while (t && i !== -1) { for (var k = i; k < i + t.length; k++) marks[k] = true; i = n.indexOf(t, i + t.length); }
    });
    var out = "", open = false;
    for (var i = 0; i < text.length; i++) {
      if (marks[i] && !open) { out += "<mark>"; open = true; }
      if (!marks[i] && open) { out += "</mark>"; open = false; }
      out += esc(text[i]);
    }
    return out + (open ? "</mark>" : "");
  }

  function icon(name, cls) { return '<svg class="ic' + (cls ? " " + cls : "") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }
  function pad(n) { return String(n).padStart(2, "0"); }
  function isoDate(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fechaLarga(d) { return DIAS[d.getDay()] + " " + d.getDate() + " de " + MESES[d.getMonth()]; }
  function getPath(obj, path) { return path.split(".").reduce(function (o, k) { return o ? o[k] : undefined; }, obj); }

  /* ---------- índice del catálogo ---------- */
  var index = {};
  var totalProductos = 0;
  ["carta", "eventos"].forEach(function (k) {
    CAT[k].categorias.forEach(function (c) {
      c.items.forEach(function (it) { index[k + ":" + it.id] = { item: it, cat: c, catalogo: k }; totalProductos++; });
    });
  });

  function packsOf(it) {
    return it.precios ? Object.keys(it.precios).map(Number).sort(function (a, b) { return a - b; }) : [];
  }

  /* ---------- estado ---------- */
  var state = {
    tab: "carta",
    q: "",
    sel: {},
    cart: (store("ebg_carrito") || []).filter(function (l) { return index[l.ref] && l.qty > 0; }),
    step: "cart",
    form: {
      entrega: "recojo", distrito: "", direccion: "", referencia: "",
      fecha: "", franja: "", nombre: "", celular: "", pago: "",
      factura: false, ruc: "", razon: "", notas: ""
    },
    lastOrder: store("ebg_ultimo_pedido")
  };
  var cliente = store("ebg_cliente") || {};
  CLIENTE_CAMPOS.forEach(function (k) { if (cliente[k]) state.form[k] = cliente[k]; });
  if (!CFG.delivery.activo) state.form.entrega = "recojo";

  function optionOf(ref) {
    var it = index[ref].item;
    return it.opciones ? (state.sel[ref] || it.opciones[0]) : "";
  }

  /* ---------- carrito ---------- */
  function lineKey(ref, opcion, pack) { return ref + "|" + (opcion || "") + "|" + (pack || ""); }
  function findLine(ref, opcion, pack) {
    var key = lineKey(ref, opcion, pack);
    for (var i = 0; i < state.cart.length; i++) {
      var l = state.cart[i];
      if (lineKey(l.ref, l.opcion, l.pack) === key) return l;
    }
    return null;
  }
  function qtyOf(ref, opcion, pack) { var l = findLine(ref, opcion, pack); return l ? l.qty : 0; }
  function unitPrice(l) { var it = index[l.ref].item; return l.pack ? it.precios[l.pack] : it.precio; }
  function cartCount() { return state.cart.reduce(function (s, l) { return s + l.qty; }, 0); }
  function cartTotal() { return state.cart.reduce(function (s, l) { return s + unitPrice(l) * l.qty; }, 0); }
  function hasEventos() { return state.cart.some(function (l) { return index[l.ref].catalogo === "eventos"; }); }
  function bocaditosCount() {
    return state.cart.reduce(function (s, l) { return s + (l.pack ? l.pack * l.qty : 0); }, 0);
  }
  function lineName(l) {
    var it = index[l.ref].item;
    return it.nombre + (l.opcion ? " · " + l.opcion : "");
  }

  function setQty(ref, opcion, pack, qty) {
    pack = pack ? Number(pack) : "";
    var l = findLine(ref, opcion, pack);
    var before = l ? l.qty : 0;
    qty = Math.max(0, Math.min(99, qty));
    if (l && qty === 0) state.cart.splice(state.cart.indexOf(l), 1);
    else if (l) l.qty = qty;
    else if (qty > 0) state.cart.push({ ref: ref, opcion: opcion || "", pack: pack, qty: qty });
    store("ebg_carrito", state.cart);
    refreshProduct(ref);
    updateCartBadges(qty > before);
    if (!drawer.hidden && state.step === "cart") renderDrawer();
    if (qty > before && before === 0) {
      var it = index[ref].item;
      toast("Agregado: " + it.nombre + (opcion ? " · " + opcion : "") + (pack ? " (" + pack + " und.)" : ""));
    }
  }

  /* ---------- controles de producto ---------- */
  function data(ref, opcion, pack) {
    return ' data-ref="' + esc(ref) + '" data-opcion="' + esc(opcion || "") + '" data-pack="' + (pack || "") + '"';
  }
  function label(it, opcion, pack) {
    return it.nombre + (opcion ? " " + opcion : "") + (pack ? " por " + pack + " unidades" : "");
  }
  function addBtn(ref, it, opcion, pack, big) {
    var l = esc(label(it, opcion, pack));
    if (big) return '<button type="button" class="add add-text" data-action="add"' + data(ref, opcion, pack) + ' aria-label="Agregar ' + l + '">' + icon("plus") + "Agregar</button>";
    return '<button type="button" class="add" data-action="add"' + data(ref, opcion, pack) + ' aria-label="Agregar ' + l + '">' + icon("plus") + "</button>";
  }
  function stepper(ref, it, opcion, pack, qty) {
    var l = esc(label(it, opcion, pack));
    return '<div class="stepper" role="group" aria-label="Cantidad de ' + l + '">' +
      '<button type="button" data-action="dec"' + data(ref, opcion, pack) + ' aria-label="Quitar uno">' + icon("minus") + "</button>" +
      "<output>" + qty + "</output>" +
      '<button type="button" data-action="inc"' + data(ref, opcion, pack) + ' aria-label="Agregar uno">' + icon("plus") + "</button></div>";
  }
  function ctlHtml(ref, big) {
    var it = index[ref].item;
    var opcion = optionOf(ref);
    if (it.precios) {
      return '<div class="packs">' + packsOf(it).map(function (p) {
        var q = qtyOf(ref, opcion, p);
        return '<div class="pack' + (q ? " is-in" : "") + '"><span class="pack-info"><span class="pack-qty">' + p + ' und.</span><span class="price">' +
          money(it.precios[p]) + "</span></span>" + (q ? stepper(ref, it, opcion, p, q) : addBtn(ref, it, opcion, p)) + "</div>";
      }).join("") + "</div>";
    }
    var q = qtyOf(ref, opcion, "");
    return q ? stepper(ref, it, opcion, "", q) : addBtn(ref, it, opcion, "", big);
  }
  function optsHtml(ref) {
    var it = index[ref].item;
    if (!it.opciones) return "";
    var current = optionOf(ref);
    return '<div class="opts" role="radiogroup" aria-label="Elige sabor de ' + esc(it.nombre) + '" data-opts="' + esc(ref) + '">' +
      it.opciones.map(function (o) {
        return '<button type="button" role="radio" class="opt" data-action="opt" data-ref="' + esc(ref) + '" data-opcion="' + esc(o) + '" aria-checked="' + (o === current) + '">' + esc(o) + "</button>";
      }).join("") + "</div>";
  }
  function inCart(ref) { return state.cart.some(function (l) { return l.ref === ref; }); }

  function focusInfo(el) {
    if (!el || !el.dataset || !el.dataset.action) return null;
    return { action: el.dataset.action, ref: el.dataset.ref, opcion: el.dataset.opcion || "", pack: el.dataset.pack || "" };
  }
  function restoreFocus(root, f) {
    if (!f) return;
    var base = '[data-ref="' + CSS.escape(f.ref) + '"][data-opcion="' + CSS.escape(f.opcion) + '"][data-pack="' + f.pack + '"]';
    var order = { add: ["inc", "add"], inc: ["inc", "add"], dec: ["dec", "add"], remove: [] }[f.action] || [f.action];
    for (var i = 0; i < order.length; i++) {
      var el = root.querySelector('[data-action="' + order[i] + '"]' + base);
      if (el) { el.focus(); return; }
    }
  }

  function refreshProduct(ref) {
    var active = document.activeElement;
    var holder = active && active.closest ? active.closest("[data-ctl]") : null;
    var f = holder ? focusInfo(active) : null;
    $$('[data-ctl="' + CSS.escape(ref) + '"]').forEach(function (box) {
      box.innerHTML = ctlHtml(ref, box.dataset.big === "1");
      var wrap = box.closest(".item, .fav");
      if (wrap) wrap.classList.toggle("is-in", inCart(ref));
      if (box === holder) restoreFocus(box, f);
    });
    var opt = optionOf(ref);
    $$('[data-opts="' + CSS.escape(ref) + '"] .opt').forEach(function (b) {
      b.setAttribute("aria-checked", String(b.dataset.opcion === opt));
    });
  }

  /* ---------- favoritos ---------- */
  function renderFavs() {
    var el = $("#favs");
    if (!el) return;
    el.innerHTML = FAVS.map(function (f) {
      var ref = f.catalogo + ":" + f.id;
      var e = index[ref];
      if (!e || !e.item.foto) return "";
      var it = e.item, foto = "img/" + it.foto;
      return '<article class="fav' + (inCart(ref) ? " is-in" : "") + '">' +
        '<div class="fav-img"><img src="' + foto + '-800.webp" srcset="' + foto + "-480.webp 480w, " + foto + '-800.webp 800w" sizes="(min-width: 960px) 360px, (min-width: 641px) 45vw, 78vw" width="800" height="600" loading="lazy" alt="' + esc(it.nombre) + '"></div>' +
        '<div class="fav-body"><h3>' + esc(it.nombre) + "</h3><p>" + esc(f.texto || it.desc || "") + "</p>" + optsHtml(ref) +
        '<div class="fav-foot"><span class="price">' + money(it.precio) + '</span><div data-ctl="' + esc(ref) + '" data-big="1">' + ctlHtml(ref, true) + "</div></div></div></article>";
    }).join("");
  }

  /* ---------- carta ---------- */
  var panel = $("#menu-panel");
  var chips = $("#chips");
  var note = $("#menu-note");
  var search = $("#search");

  function matches(it, cat, terms) {
    if (!terms.length) return true;
    var hay = norm([it.nombre, it.desc, it.unidad, (it.opciones || []).join(" "), cat.nombre].join(" "));
    return terms.every(function (t) { return hay.indexOf(t) !== -1; });
  }
  function countMatches(tab, terms) {
    var n = 0;
    CAT[tab].categorias.forEach(function (c) { c.items.forEach(function (it) { if (matches(it, c, terms)) n++; }); });
    return n;
  }

  function itemRow(k, it, terms) {
    var ref = k + ":" + it.id;
    var ev = !!it.precios;
    return '<article class="item' + (ev ? " ev" : "") + (inCart(ref) ? " is-in" : "") + '">' +
      '<div class="item-text"><div class="item-line"><h4 class="item-name">' + hl(it.nombre, terms) +
      (it.unidad ? ' <span class="unit">' + esc(it.unidad) + "</span>" : "") + "</h4>" +
      '<span class="leader" aria-hidden="true"></span>' + (ev ? "" : '<span class="price">' + money(it.precio) + "</span>") + "</div>" +
      (it.desc ? '<p class="item-desc">' + hl(it.desc, terms) + "</p>" : "") + optsHtml(ref) + "</div>" +
      '<div class="item-ctl" data-ctl="' + esc(ref) + '">' + ctlHtml(ref) + "</div></article>";
  }

  function eventBanner() {
    return '<div class="event-banner">' +
      '<figure class="photo"><img src="img/caja-bocaditos-600.webp" width="600" height="750" loading="lazy" alt="Caja de sanguchitos surtidos"></figure>' +
      '<div class="event-banner-copy"><h3>¿Cumpleaños, reunión u oficina?</h3>' +
      "<p>Arma tu pedido de bocaditos por 25 o 50 unidades. Los preparamos con 48 horas de anticipación para que lleguen frescos a tu evento.</p>" +
      '<div class="pills"><span class="pill">' + icon("clock") + ' 48 h de anticipación</span><span class="pill">' + icon("bag") + ' Por 25 o 50 und.</span><span class="pill">' + icon("store") + " Recojo o delivery</span></div></div></div>";
  }

  function renderMenu() {
    var data = CAT[state.tab];
    var terms = norm(state.q).split(/\s+/).filter(Boolean);
    var html = state.tab === "eventos" && !terms.length ? eventBanner() : "";
    var visibles = [];
    var count = 0;

    data.categorias.forEach(function (c) {
      var items = c.items.filter(function (it) { return matches(it, c, terms); });
      if (!items.length) return;
      count += items.length;
      visibles.push(c);
      html += '<section class="cat" id="cat-' + c.id + '" aria-labelledby="h-' + c.id + '">' +
        '<div class="cat-title"><h3 id="h-' + c.id + '">' + esc(c.nombre) + "</h3>" + (terms.length ? "<span>" + items.length + "</span>" : "") + "</div>" +
        (c.nota && !terms.length ? '<p class="cat-note">' + esc(c.nota) + "</p>" : "") +
        '<div class="cat-items' + (state.tab === "eventos" ? " events" : "") + '">' +
        items.map(function (it) { return itemRow(state.tab, it, terms); }).join("") + "</div></section>";
    });

    var other = state.tab === "carta" ? "eventos" : "carta";
    var otherCount = terms.length ? countMatches(other, terms) : 0;
    var otherBtn = otherCount ? ' <button type="button" class="link-arrow link-btn-inline" data-action="tab" data-tab="' + other + '">Ver ' + otherCount + " en " + (other === "eventos" ? "bocaditos para eventos" : "la carta") + " " + icon("arrow") + "</button>" : "";

    if (!count) {
      html += '<div class="empty-results"><h3>No encontramos “' + esc(state.q) + '”</h3>' +
        "<p>Prueba con otra palabra o revisa la otra pestaña.</p>" +
        (otherBtn ? "<p>" + otherBtn + "</p>" : "") +
        '<p><a class="btn btn-ghost" href="https://wa.me/' + CFG.whatsappPedidos + '" target="_blank" rel="noopener">' + icon("whatsapp") + " Pregúntanos por WhatsApp</a></p></div>";
    }

    panel.innerHTML = html;
    panel.setAttribute("aria-labelledby", "tab-" + state.tab);
    note.innerHTML = terms.length
      ? count + (count === 1 ? " producto encontrado" : " productos encontrados") + (count ? otherBtn : "")
      : esc(data.nota);

    chips.innerHTML = visibles.map(function (c) {
      return '<a href="#cat-' + c.id + '" data-cat="' + c.id + '">' + esc(c.nombre) + "</a>";
    }).join("");
    updateActiveChip();
  }

  function setTab(tab, opts) {
    if (!CAT[tab]) return;
    opts = opts || {};
    var changed = state.tab !== tab;
    state.tab = tab;
    $$(".tabs [data-tab]").forEach(function (b) {
      var on = b.dataset.tab === tab;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    if (changed || opts.force) renderMenu();
    if (opts.scroll) {
      var intro = $(".menu-intro");
      var top = intro.getBoundingClientRect().top + window.scrollY - headerH() - $("#menu-bar").offsetHeight - 12;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: "auto" });
    }
  }

  function headerH() { return $("#header").offsetHeight; }

  var chipTick = false;
  function updateActiveChip() {
    chipTick = false;
    var cats = $$(".cat", panel);
    if (!cats.length) return;
    var line = headerH() + $("#menu-bar").offsetHeight + 40;
    var current = cats[0];
    cats.forEach(function (c) { if (c.getBoundingClientRect().top <= line) current = c; });
    var id = current.id.replace("cat-", "");
    $$("a", chips).forEach(function (a) {
      var on = a.dataset.cat === id;
      if (on && !a.classList.contains("is-active")) {
        chips.scrollTo({ left: a.offsetLeft - chips.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" });
      }
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }

  /* ---------- insignias y barra de pedido ---------- */
  function updateCartBadges(bump) {
    var n = cartCount();
    $$("[data-cart-count]").forEach(function (el) {
      el.textContent = n;
      if (el.classList.contains("cart-count")) el.hidden = n === 0;
      if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    });
    $$("[data-cart-total]").forEach(function (el) { el.textContent = money(cartTotal()); });
    var bar = $(".order-bar");
    var show = n > 0 && drawer.hidden;
    bar.hidden = !show;
    document.body.classList.toggle("has-order-bar", show);
    $(".cart-btn").setAttribute("aria-label", n ? "Ver mi pedido: " + n + (n === 1 ? " producto, " : " productos, ") + money(cartTotal()) : "Ver mi pedido");
  }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.innerHTML = icon("check") + "<span>" + esc(msg) + "</span>";
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 2200);
  }

  /* ---------- fechas ---------- */
  function leadHours() { return hasEventos() ? CFG.anticipacionEventos : CFG.anticipacionCarta; }

  function availableDays() {
    var now = new Date();
    var minTime = now.getTime() + leadHours() * 3600 * 1000;
    var days = [];
    for (var i = 0; days.length < CFG.diasVisibles && i < 90; i++) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      if (CFG.diasAtencion.indexOf(d.getDay()) === -1) continue;
      var slots = CFG.franjas.map(function (f) {
        var hm = f.desde.split(":").map(Number);
        var start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hm[0], hm[1]);
        return { id: f.desde + "-" + f.hasta, texto: f.desde + " – " + f.hasta, ok: start.getTime() >= minTime };
      });
      days.push({ date: d, iso: isoDate(d), offset: i, slots: slots, ok: slots.some(function (s) { return s.ok; }) });
    }
    return days;
  }
  function firstAvailable(days) { for (var i = 0; i < days.length; i++) if (days[i].ok) return days[i]; return null; }

  /* ---------- drawer ---------- */
  var drawer = $("#drawer");
  var overlay = $(".overlay");
  var body = $("#drawer-body");
  var foot = $("#drawer-foot");
  var lastFocus = null;
  var closeTimer;

  function openDrawer(step) {
    clearTimeout(closeTimer);
    if (step) state.step = step;
    if (state.step !== "cart" && !state.cart.length && state.step !== "listo") state.step = "cart";
    lastFocus = document.activeElement;
    drawer.hidden = false;
    overlay.hidden = false;
    renderDrawer();
    document.body.classList.add("no-scroll");
    void drawer.offsetWidth;
    drawer.classList.add("is-on");
    overlay.classList.add("is-on");
    updateCartBadges(false);
    setTimeout(function () { var h = $("#drawer-title"); h.setAttribute("tabindex", "-1"); h.focus(); }, 60);
  }

  function closeDrawer() {
    if (drawer.hidden) return;
    drawer.classList.remove("is-on");
    overlay.classList.remove("is-on");
    document.body.classList.remove("no-scroll");
    closeTimer = setTimeout(function () {
      drawer.hidden = true;
      overlay.hidden = true;
      if (state.step === "listo") state.step = "cart";
      updateCartBadges(false);
    }, 280);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  var renderedStep = null;
  function renderDrawer() {
    if (renderedStep !== state.step) { body.scrollTop = 0; renderedStep = state.step; }
    var titles = { cart: "Tu pedido", datos: "Entrega y datos", listo: "¡Pedido listo!" };
    $("#drawer-title").textContent = titles[state.step];
    $(".drawer-back", drawer).hidden = state.step !== "datos";
    var order = ["cart", "datos", "listo"];
    $$("[data-step-dot]", drawer).forEach(function (li) {
      var i = order.indexOf(li.dataset.stepDot), cur = order.indexOf(state.step);
      li.classList.toggle("is-done", i < cur);
      li.classList.toggle("is-current", i === cur);
      if (i === cur) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    if (state.step === "cart") renderCartStep();
    else if (state.step === "datos") renderDatosStep();
    else renderListoStep();
  }

  function renderCartStep() {
    var active = document.activeElement;
    var f = drawer.contains(active) ? focusInfo(active) : null;

    if (!state.cart.length) {
      var last = state.lastOrder && Date.now() - state.lastOrder.creado < 1000 * 60 * 60 * 24 ? state.lastOrder : null;
      body.innerHTML = '<div class="cart-empty">' + icon("bag") + "<h3>Aún no agregas productos</h3><p>Elige de la carta o de los bocaditos para eventos.</p>" +
        '<button type="button" class="btn btn-primary" data-action="close-cart" data-goto="carta">Ver la carta</button></div>' +
        (last ? '<div class="notice soft">' + icon("whatsapp") + "<div>Tu último pedido <strong>" + esc(last.codigo) + "</strong> (" + money(last.total) + ') · <a href="' + esc(last.url) + '" target="_blank" rel="noopener">Abrir en WhatsApp de nuevo</a></div></div>' : "");
      foot.innerHTML = "";
      return;
    }

    var html = "";
    [["carta", "Carta"], ["eventos", "Bocaditos para eventos"]].forEach(function (g) {
      var lines = state.cart.filter(function (l) { return index[l.ref].catalogo === g[0]; });
      if (!lines.length) return;
      html += '<div class="cart-group"><p class="cart-group-title">' + g[1] + "</p>";
      lines.forEach(function (l) {
        var it = index[l.ref].item;
        var meta = [];
        if (l.pack) meta.push(l.pack + " und.");
        if (it.unidad) meta.push(it.unidad);
        meta.push(money(unitPrice(l)) + " c/u");
        html += '<div class="line"><div><p class="line-name">' + esc(lineName(l)) + '</p><p class="line-meta">' + esc(meta.join(" · ")) + "</p></div>" +
          '<p class="line-total">' + money(unitPrice(l) * l.qty) + "</p>" +
          '<div class="line-actions">' + stepper(l.ref, it, l.opcion, l.pack, l.qty) +
          '<button type="button" class="link-btn" data-action="remove"' + data(l.ref, l.opcion, l.pack) + ">Quitar</button></div></div>";
      });
      html += "</div>";
    });

    if (hasEventos()) {
      var first = firstAvailable(availableDays());
      var n = bocaditosCount();
      html += '<div class="notice">' + icon("clock") + "<div><strong>Tu pedido incluye bocaditos para eventos.</strong> Los preparamos con " + CFG.anticipacionEventos +
        " horas de anticipación" + (first ? ": puedes recibirlo desde el " + fechaLarga(first.date) + "." : ".") +
        (n >= 50 ? "<br>Llevas " + n + " bocaditos: alcanzan para unas " + Math.floor(n / 10) + " personas si calculas 10 por invitado." : "") + "</div></div>";
    }
    body.innerHTML = html;

    foot.innerHTML = '<div class="totals"><div class="grand"><span>Subtotal</span><span>' + money(cartTotal()) + "</span></div>" +
      "<div><span>Delivery</span><span>Se cotiza según distrito</span></div></div>" +
      '<button type="button" class="btn btn-primary btn-lg btn-block" data-action="to-datos">Continuar ' + icon("arrow") + "</button>";

    if (f) restoreFocus(body, f);
    if (f && !drawer.contains(document.activeElement)) body.focus();
  }

  function renderDatosStep() {
    var F = state.form;
    var days = availableDays();
    if (!days.some(function (d) { return d.iso === F.fecha && d.ok; })) {
      var first = firstAvailable(days);
      F.fecha = first ? first.iso : "";
      F.franja = "";
    }

    var distritos = CFG.delivery.distritos.map(function (d) {
      return '<option value="' + esc(d) + '"' + (F.distrito === d ? " selected" : "") + ">" + esc(d) + "</option>";
    }).join("");

    body.innerHTML =
      '<form class="form" id="order-form" novalidate>' +
      "<fieldset><legend>¿Cómo lo recibes?</legend>" +
      '<div class="choice-cards">' +
      '<label class="choice-card"><input type="radio" name="entrega" value="recojo"' + (F.entrega === "recojo" ? " checked" : "") + ">" + icon("store") +
      "<strong>Recojo en tienda</strong><span>" + esc(CFG.direccion) + ", Miraflores</span></label>" +
      (CFG.delivery.activo ? '<label class="choice-card"><input type="radio" name="entrega" value="delivery"' + (F.entrega === "delivery" ? " checked" : "") + ">" + icon("truck") +
        "<strong>Delivery</strong><span>Costo según distrito</span></label>" : "") +
      "</div>" +
      '<div id="delivery-fields"' + (F.entrega === "delivery" ? "" : " hidden") + ' style="margin-top:16px">' +
      field("distrito", "Distrito", '<select id="f-distrito" name="distrito" class="input" autocomplete="address-level2"><option value="">Elige tu distrito</option>' + distritos + "</select>") +
      field("direccion", "Dirección", '<input id="f-direccion" name="direccion" class="input" autocomplete="street-address" placeholder="Calle, número, dpto. o interior" value="' + esc(F.direccion) + '">') +
      field("referencia", 'Referencia <span class="opt-tag">(opcional)</span>', '<input id="f-referencia" name="referencia" class="input" placeholder="Ej.: frente al parque" value="' + esc(F.referencia) + '">') +
      '<p class="notice soft" style="margin-top:4px">' + icon("truck") + "<span>" + esc(CFG.delivery.nota) + "</span></p>" +
      "</div></fieldset>" +

      "<fieldset><legend>¿Para cuándo?</legend>" +
      '<div class="field" data-field="fecha"><span class="field-label" id="lbl-fecha">Día</span>' +
      '<div class="day-row" id="days" role="radiogroup" aria-labelledby="lbl-fecha"></div>' +
      '<p class="field-hint" id="lead-hint"></p><p class="field-error" id="err-fecha"></p></div>' +
      '<div class="field" data-field="franja"><span class="field-label" id="lbl-franja">Horario</span>' +
      '<div class="slots" id="slots" role="radiogroup" aria-labelledby="lbl-franja"></div><p class="field-error" id="err-franja"></p></div>' +
      "</fieldset>" +

      "<fieldset><legend>Tus datos</legend><div class=\"row-2\">" +
      field("nombre", "Nombre y apellido", '<input id="f-nombre" name="nombre" class="input" autocomplete="name" value="' + esc(F.nombre) + '">') +
      field("celular", "Celular", '<input id="f-celular" name="celular" class="input" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="9XX XXX XXX" value="' + esc(F.celular) + '">') +
      "</div></fieldset>" +

      "<fieldset><legend>Pago</legend>" +
      '<div class="field" data-field="pago"><div class="chip-radios" id="pagos" role="radiogroup" aria-label="Forma de pago"></div>' +
      '<p class="field-hint">Te enviamos los datos de pago por WhatsApp cuando confirmemos tu pedido.</p><p class="field-error" id="err-pago"></p></div>' +
      '<label class="check"><input type="checkbox" name="factura"' + (F.factura ? " checked" : "") + "> Necesito factura</label>" +
      '<div id="factura-fields" class="row-2"' + (F.factura ? "" : " hidden") + ">" +
      field("ruc", "RUC", '<input id="f-ruc" name="ruc" class="input" inputmode="numeric" maxlength="11" value="' + esc(F.ruc) + '">') +
      field("razon", "Razón social", '<input id="f-razon" name="razon" class="input" autocomplete="organization" value="' + esc(F.razon) + '">') +
      "</div></fieldset>" +

      '<fieldset style="margin-bottom:0">' +
      field("notas", 'Notas para tu pedido <span class="opt-tag">(opcional)</span>', '<textarea id="f-notas" name="notas" class="input" rows="3" placeholder="Ej.: dedicatoria, alergias, a quién entregar…">' + esc(F.notas) + "</textarea>") +
      "</fieldset></form>";

    renderDays(days);
    renderPagos();
    renderDatosFoot();
    syncChoiceCards();
  }

  function field(name, labelHtml, control) {
    return '<div class="field" data-field="' + name + '"><label for="f-' + name + '">' + labelHtml + "</label>" + control + '<p class="field-error" id="err-' + name + '"></p></div>';
  }

  function renderDays(days) {
    days = days || availableDays();
    var F = state.form;
    $("#days").innerHTML = days.map(function (d) {
      var top = d.offset === 0 ? "Hoy" : d.offset === 1 ? "Mañana" : DIAS_CORTOS[d.date.getDay()];
      return '<button type="button" class="day" role="radio" data-action="day" data-iso="' + d.iso + '" aria-checked="' + (F.fecha === d.iso) + '"' + (d.ok ? "" : " disabled") +
        ' aria-label="' + fechaLarga(d.date) + (d.ok ? "" : ", sin horarios disponibles") + '"><small>' + top + "</small><strong>" + d.date.getDate() + "</strong><em>" + MESES[d.date.getMonth()].slice(0, 3) + "</em></button>";
    }).join("");
    var day = days.filter(function (d) { return d.iso === F.fecha; })[0];
    if (day && !day.slots.some(function (s) { return s.id === F.franja && s.ok; })) F.franja = "";
    $("#slots").innerHTML = day ? day.slots.map(function (s) {
      return '<button type="button" class="slot" role="radio" data-action="slot" data-franja="' + s.id + '" aria-checked="' + (F.franja === s.id) + '"' + (s.ok ? "" : " disabled") + ">" + s.texto + "</button>";
    }).join("") : "";
    $("#lead-hint").textContent = hasEventos()
      ? "Como tu pedido incluye bocaditos para eventos, lo preparamos con " + CFG.anticipacionEventos + " horas de anticipación. Domingos cerrado."
      : "Preparamos tu pedido con al menos " + CFG.anticipacionCarta + " horas de anticipación. Domingos cerrado.";
  }

  function renderPagos() {
    var F = state.form;
    var pagos = CFG.pagos.filter(function (p) { return !(p.soloRecojo && F.entrega === "delivery"); });
    if (!pagos.some(function (p) { return p.id === F.pago; })) F.pago = "";
    $("#pagos").innerHTML = pagos.map(function (p) {
      return '<button type="button" class="chip-radio" role="radio" data-action="pago" data-pago="' + p.id + '" aria-checked="' + (F.pago === p.id) + '">' + esc(p.nombre) + "</button>";
    }).join("");
  }

  function renderDatosFoot() {
    foot.innerHTML = '<div class="totals"><div class="grand"><span>Total productos</span><span>' + money(cartTotal()) + "</span></div>" +
      "<div><span>" + (state.form.entrega === "delivery" ? "Delivery" : "Recojo en tienda") + "</span><span>" + (state.form.entrega === "delivery" ? "Por confirmar" : "Sin costo") + "</span></div></div>" +
      '<button type="submit" form="order-form" class="btn btn-wa btn-lg btn-block">' + icon("whatsapp") + " Enviar pedido por WhatsApp</button>" +
      '<p class="foot-hint">Se abrirá WhatsApp con tu pedido escrito. Solo tienes que enviarlo.</p>';
  }

  function syncChoiceCards() {
    $$(".choice-card", body).forEach(function (c) { c.classList.toggle("is-checked", $("input", c).checked); });
  }

  function setError(name, msg) {
    var wrap = $('[data-field="' + name + '"]', body);
    if (!wrap) return;
    wrap.classList.toggle("has-error", !!msg);
    var e = $(".field-error", wrap);
    if (e) e.textContent = msg || "";
    var input = $(".input", wrap);
    if (input) {
      if (msg) { input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", "err-" + name); }
      else { input.removeAttribute("aria-invalid"); input.removeAttribute("aria-describedby"); }
    }
  }

  function saveCliente() {
    var c = {};
    CLIENTE_CAMPOS.forEach(function (k) { c[k] = state.form[k]; });
    store("ebg_cliente", c);
  }

  function validate() {
    var F = state.form, errors = {};
    if (F.nombre.trim().length < 3) errors.nombre = "Escribe tu nombre y apellido.";
    var cel = F.celular.replace(/\D/g, "").replace(/^51(?=9\d{8}$)/, "");
    if (!/^9\d{8}$/.test(cel)) errors.celular = "Escribe un celular de 9 dígitos que empiece con 9.";
    if (F.entrega === "delivery") {
      if (!F.distrito) errors.distrito = "Elige tu distrito.";
      if (F.direccion.trim().length < 5) errors.direccion = "Escribe la dirección de entrega.";
    }
    var days = availableDays();
    var day = days.filter(function (d) { return d.iso === F.fecha; })[0];
    if (!day || !day.ok) errors.fecha = "Elige un día disponible.";
    else if (!day.slots.some(function (s) { return s.id === F.franja && s.ok; })) errors.franja = "Elige un horario.";
    if (!F.pago) errors.pago = "Elige cómo vas a pagar.";
    if (F.factura) {
      if (!/^(10|15|17|20)\d{9}$/.test(F.ruc.replace(/\D/g, ""))) errors.ruc = "El RUC tiene 11 dígitos.";
      if (F.razon.trim().length < 3) errors.razon = "Escribe la razón social.";
    }
    ["nombre", "celular", "distrito", "direccion", "fecha", "franja", "pago", "ruc", "razon"].forEach(function (k) { setError(k, errors[k]); });
    return errors;
  }

  /* ---------- mensaje de WhatsApp ---------- */
  function orderCode() {
    var d = new Date();
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var r = "";
    for (var i = 0; i < 4; i++) r += chars[Math.floor(Math.random() * chars.length)];
    return "EBG-" + pad(d.getDate()) + pad(d.getMonth() + 1) + "-" + r;
  }

  function buildMessage(codigo) {
    var F = state.form;
    var L = [];
    L.push("Hola, El Buen Gusto. Quiero hacer este pedido:");
    L.push("");
    L.push("*PEDIDO WEB " + codigo + "*");
    [["carta", "Carta"], ["eventos", "Bocaditos para eventos"]].forEach(function (g) {
      var lines = state.cart.filter(function (l) { return index[l.ref].catalogo === g[0]; });
      if (!lines.length) return;
      L.push("");
      L.push("*" + g[1] + "*");
      lines.forEach(function (l) {
        var it = index[l.ref].item;
        var extra = l.pack ? " (" + l.pack + " und.)" : it.unidad ? " (" + it.unidad + ")" : "";
        L.push(l.qty + " × " + lineName(l) + extra + " — " + money(unitPrice(l) * l.qty));
      });
    });
    L.push("");
    L.push("*Total productos: " + money(cartTotal()) + "*");
    if (F.entrega === "delivery") L.push("_Delivery por confirmar según distrito_");
    L.push("");
    var day = availableDays().filter(function (d) { return d.iso === F.fecha; })[0];
    L.push("*Entrega:* " + (F.entrega === "delivery" ? "Delivery" : "Recojo en tienda"));
    if (F.entrega === "delivery") {
      L.push("*Distrito:* " + F.distrito);
      L.push("*Dirección:* " + F.direccion.trim());
      if (F.referencia.trim()) L.push("*Referencia:* " + F.referencia.trim());
    }
    if (day) L.push("*Fecha:* " + fechaLarga(day.date));
    L.push("*Horario:* " + F.franja.replace("-", " a "));
    L.push("");
    L.push("*Cliente:* " + F.nombre.trim());
    var cel = F.celular.replace(/\D/g, "").replace(/^51(?=9\d{8}$)/, "");
    L.push("*Celular:* " + cel.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"));
    var pago = CFG.pagos.filter(function (p) { return p.id === F.pago; })[0];
    L.push("*Pago:* " + (pago ? pago.nombre : ""));
    L.push("*Comprobante:* " + (F.factura ? "Factura · RUC " + F.ruc.replace(/\D/g, "") + " · " + F.razon.trim() : "Boleta"));
    if (F.notas.trim()) L.push("*Notas:* " + F.notas.trim());
    L.push("");
    L.push("Quedo atento a su confirmación. ¡Gracias!");
    return L.join("\n");
  }

  function submitOrder() {
    var errors = validate();
    var keys = Object.keys(errors);
    if (keys.length) {
      var first = $('[data-field="' + keys[0] + '"]', body);
      if (first) {
        first.scrollIntoView({ behavior: "smooth", block: "center" });
        var focusable = $("input, select, textarea, button:not([disabled])", first);
        if (focusable) setTimeout(function () { focusable.focus({ preventScroll: true }); }, 250);
      }
      return;
    }
    saveCliente();
    var codigo = orderCode();
    var msg = buildMessage(codigo);
    var url = "https://wa.me/" + CFG.whatsappPedidos + "?text=" + encodeURIComponent(msg);
    state.lastOrder = { codigo: codigo, mensaje: msg, url: url, total: cartTotal(), creado: Date.now() };
    store("ebg_ultimo_pedido", state.lastOrder);

    var w = window.open(url, "_blank");
    if (w) { try { w.opener = null; } catch (e) { /* nada */ } }
    else { setTimeout(function () { window.location.href = url; }, 400); }

    var refs = state.cart.map(function (l) { return l.ref; });
    state.cart = [];
    store("ebg_carrito", state.cart);
    state.form.notas = "";
    refs.forEach(refreshProduct);
    state.step = "listo";
    renderDrawer();
    updateCartBadges(false);
  }

  function waHtml(msg) {
    return esc(msg).replace(/\*([^*\n]+)\*/g, "<b>$1</b>").replace(/_([^_\n]+)_/g, "<i>$1</i>");
  }

  function renderListoStep() {
    var o = state.lastOrder;
    if (!o) { state.step = "cart"; renderDrawer(); return; }
    body.innerHTML = '<div class="done"><div class="done-icon">' + icon("check") + "</div>" +
      "<h3>Tu pedido ya está en WhatsApp</h3>" +
      "<p>Revisa el mensaje y presiona <strong>enviar</strong>. Te responderemos para confirmar tu pedido y el pago.</p>" +
      '<span class="code">' + esc(o.codigo) + "</span>" +
      '<div class="done-actions">' +
      '<a class="btn btn-wa" href="' + esc(o.url) + '" target="_blank" rel="noopener">' + icon("whatsapp") + " Abrir WhatsApp de nuevo</a>" +
      '<button type="button" class="btn btn-ghost" data-action="copy">' + icon("copy") + " Copiar pedido</button></div></div>" +
      '<div class="wa-preview" style="margin-top:22px"><p class="wa-preview-label">Así llega tu mensaje</p><div class="wa-bubble">' + waHtml(o.mensaje) + "</div></div>";
    foot.innerHTML = '<button type="button" class="btn btn-primary btn-block" data-action="close-cart">Seguir viendo la carta</button>';
  }

  function copyOrder() {
    var o = state.lastOrder;
    if (!o) return;
    var done = function () { toast("Pedido copiado"); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(o.mensaje).then(done, fallback);
    } else fallback();
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = o.mensaje;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { /* nada */ }
      document.body.removeChild(ta);
    }
  }

  /* ---------- eventos ---------- */
  document.addEventListener("click", function (e) {
    var tabLink = e.target.closest("[data-tab-link]");
    if (tabLink) {
      setTab(tabLink.dataset.tabLink);
      closeNav();
    }

    var chip = e.target.closest(".chips a");
    if (chip) {
      e.preventDefault();
      var target = document.getElementById("cat-" + chip.dataset.cat);
      if (target) {
        var y = target.getBoundingClientRect().top + window.scrollY - headerH() - $("#menu-bar").offsetHeight - 30;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      return;
    }

    var t = e.target.closest("[data-action]");
    if (!t) return;
    var a = t.dataset.action;
    var ref = t.dataset.ref, opcion = t.dataset.opcion || "", pack = t.dataset.pack || "";

    switch (a) {
      case "add":
      case "inc": setQty(ref, opcion, pack, qtyOf(ref, opcion, pack ? Number(pack) : "") + 1); break;
      case "dec": setQty(ref, opcion, pack, qtyOf(ref, opcion, pack ? Number(pack) : "") - 1); break;
      case "remove": setQty(ref, opcion, pack, 0); break;
      case "opt": state.sel[ref] = opcion; refreshProduct(ref); break;
      case "tab": setTab(t.dataset.tab, { scroll: true }); break;
      case "open-cart": openDrawer("cart"); break;
      case "close-cart":
        closeDrawer();
        if (t.dataset.goto) setTimeout(function () { setTab(t.dataset.goto); document.getElementById("carta").scrollIntoView({ behavior: "smooth" }); }, 300);
        break;
      case "to-datos": state.step = "datos"; renderDrawer(); body.scrollTop = 0; break;
      case "step-back": state.step = "cart"; renderDrawer(); break;
      case "day":
        state.form.fecha = t.dataset.iso;
        renderDays();
        setError("fecha", "");
        var dayBtn = $('.day[data-iso="' + state.form.fecha + '"]', body);
        if (dayBtn) dayBtn.focus();
        break;
      case "slot":
        state.form.franja = t.dataset.franja;
        $$(".slot", body).forEach(function (s) { s.setAttribute("aria-checked", String(s === t)); });
        setError("franja", "");
        break;
      case "pago":
        state.form.pago = t.dataset.pago;
        $$(".chip-radio", body).forEach(function (s) { s.setAttribute("aria-checked", String(s === t)); });
        setError("pago", "");
        break;
      case "copy": copyOrder(); break;
    }
  });

  body.addEventListener("input", onFormInput);
  body.addEventListener("change", onFormInput);
  function onFormInput(e) {
    var el = e.target;
    if (!el.name || !(el.name in state.form)) return;
    var F = state.form;
    F[el.name] = el.type === "checkbox" ? el.checked : el.value;
    if (el.name === "entrega") {
      $("#delivery-fields").hidden = F.entrega !== "delivery";
      syncChoiceCards();
      renderPagos();
      renderDatosFoot();
    }
    if (el.name === "factura") $("#factura-fields").hidden = !F.factura;
    if (e.type === "input" && $('[data-field="' + el.name + '"].has-error', body)) setError(el.name, "");
    if (CLIENTE_CAMPOS.indexOf(el.name) !== -1) saveCliente();
  }

  body.addEventListener("submit", function (e) {
    e.preventDefault();
    submitOrder();
  });

  document.addEventListener("keydown", function (e) {
    if (drawer.hidden) return;
    if (e.key === "Escape") { closeDrawer(); return; }
    if (e.key !== "Tab") return;
    var f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', drawer)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  // Pestañas: clic y flechas
  $$(".tabs [data-tab]").forEach(function (b) {
    b.addEventListener("click", function () { setTab(b.dataset.tab, { scroll: true }); });
    b.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var next = b.dataset.tab === "carta" ? "eventos" : "carta";
      setTab(next, { scroll: true });
      $('.tabs [data-tab="' + next + '"]').focus();
    });
  });

  var searchTimer;
  search.addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () { state.q = search.value.trim(); renderMenu(); }, 120);
  });

  // Menú móvil
  var navToggle = $(".nav-toggle");
  var nav = $("#nav");
  function closeNav() { nav.classList.remove("is-open"); navToggle.setAttribute("aria-expanded", "false"); }
  navToggle.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(); });

  var header = $("#header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    if (!chipTick) { chipTick = true; requestAnimationFrame(updateActiveChip); }
  }, { passive: true });

  /* ---------- datos del negocio en la página ---------- */
  $$("[data-cfg]").forEach(function (el) { var v = getPath(CFG, el.dataset.cfg); if (v != null) el.textContent = v; });
  $$("[data-cfg-href]").forEach(function (el) { var v = getPath(CFG, el.dataset.cfgHref); if (v) el.href = v; });
  $$("[data-total-productos]").forEach(function (el) { el.textContent = totalProductos; });
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  var mapFrame = $("iframe[data-src-cfg]");
  if (mapFrame) {
    var loadMap = function () { mapFrame.src = getPath(CFG, mapFrame.dataset.srcCfg); };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { loadMap(); io.disconnect(); }
      }, { rootMargin: "400px" });
      io.observe(mapFrame);
    } else loadMap();
  }

  /* ---------- inicio ---------- */
  if (location.hash === "#eventos") state.tab = "eventos";
  setTab(state.tab, { force: true });
  renderFavs();
  updateCartBadges(false);
})();
