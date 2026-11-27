/* Make-your-own scrapbook page for play.html.
   Builds into #maker. Items are stored as fractions of the page so the
   layout scales with the page. Nothing leaves the visitor's browser. */
(function () {
  'use strict';
  var root = document.getElementById('maker');
  if (!root) return;

  var IMG = 'images/redesign/';
  var STICKERS = {
    miffy: { type: 'img', src: IMG + 'sticker-miffy.png', ar: 356 / 240, w: 0.1, label: 'Miffy' },
    lego: { type: 'img', src: IMG + 'sticker-lego.png', ar: 183 / 260, w: 0.13, label: 'Lego brick' },
    stamp: { type: 'img', src: IMG + 'stamp.png', ar: 480 / 680, w: 0.17, label: 'Postage stamp' },
    star: { type: 'img', src: IMG + 'sticker-star.png', ar: 152 / 160, w: 0.07, label: 'Gold star' },
    tapePink: { type: 'tape', color: '#F3B7C8', ar: 0.26, w: 0.16, label: 'Pink washi tape' },
    tapeBlue: { type: 'tape', color: '#B9CDF2', ar: 0.26, w: 0.16, label: 'Blue washi tape' },
    tapeLav: { type: 'tape', color: '#CFC6F3', ar: 0.26, w: 0.16, label: 'Lavender washi tape' },
    heart: { type: 'glyph', ch: '♥', color: '#E58AA4', ar: 1, w: 0.06, label: 'Heart' },
    sparkle: { type: 'glyph', ch: '✦', color: '#D9A93B', ar: 1, w: 0.06, label: 'Sparkle' },
    photo: { type: 'photo', ar: 1.18, w: 0.17, label: 'Photo frame' },
    note: { type: 'note', ar: 0.42, w: 0.2, label: 'Handwritten note' }
  };
  var ORDER = ['photo', 'note', 'miffy', 'lego', 'stamp', 'star', 'tapePink', 'tapeBlue', 'tapeLav', 'heart', 'sparkle'];

  var items = [], sel = null, uid = 0;

  root.innerHTML =
    '<div class="mk-page" aria-label="Your scrapbook page">' +
      '<div class="mk-half mk-l blL"></div><div class="mk-half mk-r blR"></div><div class="mk-spine"></div>' +
      '<div class="mk-items"></div>' +
      '<p class="mk-empty">Tap a sticker below to start your page ✦</p>' +
    '</div>' +
    '<div class="mk-tray" role="toolbar" aria-label="Stickers"></div>' +
    '<div class="mk-actions">' +
      '<button type="button" class="mk-btn" data-act="shuffle">Shuffle ⟳</button>' +
      '<button type="button" class="mk-btn" data-act="clear">Clear</button>' +
      '<button type="button" class="mk-btn mk-dark" data-act="save">Save my page ↓</button>' +
    '</div>' +
    '<p class="mk-hint">Drag to move. Use the corner handle to resize and rotate. Your page stays on your device.</p>' +
    '<input type="file" accept="image/*" class="mk-file" hidden>';

  var page = root.querySelector('.mk-page'), layer = root.querySelector('.mk-items'),
      tray = root.querySelector('.mk-tray'), empty = root.querySelector('.mk-empty'),
      file = root.querySelector('.mk-file');

  ORDER.forEach(function (k) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'mk-chip'; b.title = STICKERS[k].label;
    b.setAttribute('aria-label', 'Add ' + STICKERS[k].label);
    b.appendChild(preview(k));
    b.addEventListener('click', function () { add(k, 0.5 + (Math.random() - 0.5) * 0.3, 0.5 + (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 16); });
    tray.appendChild(b);
  });

  function preview(k) {
    var d = STICKERS[k], el;
    if (d.type === 'img') { el = new Image(); el.src = d.src; el.alt = ''; }
    else if (d.type === 'tape') { el = document.createElement('span'); el.className = 'mk-tape'; el.style.background = tapeBg(d.color); el.style.width = '40px'; el.style.height = '12px'; }
    else if (d.type === 'glyph') { el = document.createElement('span'); el.textContent = d.ch; el.style.color = d.color; el.style.fontSize = '22px'; }
    else if (d.type === 'photo') { el = document.createElement('span'); el.className = 'mk-mini-photo'; }
    else { el = document.createElement('span'); el.textContent = 'note'; el.className = 'mk-mini-note'; }
    return el;
  }
  function tapeBg(c) { return 'repeating-linear-gradient(90deg,' + c + ' 0 6px,' + c + 'cc 6px 9px)'; }

  function add(k, x, y, r, extra) {
    var d = STICKERS[k];
    var it = Object.assign({ id: ++uid, k: k, x: x, y: y, r: r || 0, w: d.w, text: 'hi from me ✿', photo: null }, extra || {});
    items.push(it); draw(it); select(it); syncEmpty();
    return it;
  }

  function draw(it) {
    var d = STICKERS[it.k], el = document.createElement('div');
    el.className = 'mk-item mk-' + d.type; el.dataset.id = it.id; el.tabIndex = 0;
    if (d.type === 'img') { var im = new Image(); im.src = d.src; im.alt = d.label; im.draggable = false; el.appendChild(im); }
    else if (d.type === 'tape') { el.style.background = tapeBg(d.color); }
    else if (d.type === 'glyph') { var g = document.createElement('span'); g.textContent = d.ch; g.style.color = d.color; el.appendChild(g); }
    else if (d.type === 'photo') {
      var f = document.createElement('div'); f.className = 'mk-photo-in';
      f.innerHTML = '<span>+ add photo</span>'; el.appendChild(f);
      f.addEventListener('click', function (e) { if (sel === it && !moved) { e.stopPropagation(); pickPhoto(it); } });
    } else {
      var t = document.createElement('div'); t.className = 'mk-note-text'; t.contentEditable = 'true'; t.spellcheck = false; t.textContent = it.text;
      t.addEventListener('input', function () { it.text = t.textContent; });
      t.addEventListener('pointerdown', function (e) { if (sel === it) e.stopPropagation(); });
      el.appendChild(t);
    }
    var h = document.createElement('span'); h.className = 'mk-handle'; h.setAttribute('aria-hidden', 'true'); el.appendChild(h);
    var x = document.createElement('button'); x.type = 'button'; x.className = 'mk-del'; x.setAttribute('aria-label', 'Remove'); x.textContent = '×'; el.appendChild(x);
    x.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    x.addEventListener('click', function (e) { e.stopPropagation(); remove(it); });
    el.addEventListener('pointerdown', function (e) { startMove(e, it); });
    h.addEventListener('pointerdown', function (e) { startScale(e, it); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Delete' || e.key === 'Backspace') { if (e.target === el) { e.preventDefault(); remove(it); } } });
    layer.appendChild(el); place(it);
  }

  function elOf(it) { return layer.querySelector('[data-id="' + it.id + '"]'); }
  function place(it) {
    var el = elOf(it), d = STICKERS[it.k], W = page.clientWidth, H = page.clientHeight;
    var wpx = it.w * W, hpx = wpx * d.ar;
    el.style.width = wpx + 'px'; el.style.height = hpx + 'px';
    el.style.left = (it.x * W - wpx / 2) + 'px'; el.style.top = (it.y * H - hpx / 2) + 'px';
    el.style.transform = 'rotate(' + it.r + 'deg)';
    if (d.type === 'glyph') el.firstChild.style.fontSize = hpx + 'px';
    if (d.type === 'note') el.firstChild.style.fontSize = Math.max(11, wpx * 0.12) + 'px';
  }
  function select(it) {
    sel = it;
    Array.prototype.forEach.call(layer.children, function (c) { c.classList.toggle('mk-sel', it && +c.dataset.id === it.id); });
    if (it) { var el = elOf(it); layer.appendChild(el); items.splice(items.indexOf(it), 1); items.push(it); }
  }
  function remove(it) { var el = elOf(it); if (el) el.remove(); items.splice(items.indexOf(it), 1); sel = null; syncEmpty(); }
  function syncEmpty() { empty.style.display = items.length ? 'none' : ''; }

  var moved = false;
  function startMove(e, it) {
    if (e.button > 0) return;
    e.preventDefault(); select(it); moved = false;
    var r = page.getBoundingClientRect(), ox = e.clientX - it.x * r.width, oy = e.clientY - it.y * r.height;
    track(function (ev) {
      moved = true;
      it.x = clamp((ev.clientX - ox) / r.width, 0, 1); it.y = clamp((ev.clientY - oy) / r.height, 0, 1); place(it);
    });
  }
  function startScale(e, it) {
    e.preventDefault(); e.stopPropagation(); select(it);
    var r = page.getBoundingClientRect(), cx = r.left + it.x * r.width, cy = r.top + it.y * r.height;
    var d0 = Math.hypot(e.clientX - cx, e.clientY - cy), a0 = Math.atan2(e.clientY - cy, e.clientX - cx), w0 = it.w, r0 = it.r;
    track(function (ev) {
      var d1 = Math.hypot(ev.clientX - cx, ev.clientY - cy), a1 = Math.atan2(ev.clientY - cy, ev.clientX - cx);
      it.w = clamp(w0 * d1 / d0, 0.03, 0.6); it.r = r0 + (a1 - a0) * 180 / Math.PI; place(it);
    });
  }
  function track(onMove) {
    function up() { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); }
    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  page.addEventListener('pointerdown', function (e) { if (e.target === page || e.target.classList.contains('mk-half') || e.target === layer) select(null); });

  var photoFor = null;
  function pickPhoto(it) { photoFor = it; file.value = ''; file.click(); }
  file.addEventListener('change', function () {
    var f = file.files && file.files[0]; if (!f || !photoFor) return;
    var it = photoFor, url = URL.createObjectURL(f), im = new Image();
    im.onload = function () { it.photo = im; var box = elOf(it).querySelector('.mk-photo-in'); box.innerHTML = ''; var c = im.cloneNode(); c.alt = 'Your photo'; c.draggable = false; box.appendChild(c); };
    im.src = url;
  });

  function clearAll() { items.slice().forEach(remove); }
  function shuffle() {
    clearAll();
    var picks = ['photo', 'photo', 'note', 'miffy', 'lego', 'stamp', 'star', 'star', ['tapePink', 'tapeBlue', 'tapeLav'][Math.floor(Math.random() * 3)], ['heart', 'sparkle'][Math.floor(Math.random() * 2)]];
    var spots = [[0.22, 0.32], [0.68, 0.34], [0.32, 0.72], [0.14, 0.64], [0.84, 0.7], [0.58, 0.74], [0.42, 0.18], [0.86, 0.2], [0.18, 0.14], [0.8, 0.48]];
    spots.sort(function () { return Math.random() - 0.5; });
    picks.forEach(function (k, i) { var s = spots[i]; add(k, s[0] + (Math.random() - 0.5) * 0.06, s[1] + (Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 24); });
    select(null);
  }

  root.querySelector('[data-act="shuffle"]').addEventListener('click', shuffle);
  root.querySelector('[data-act="clear"]').addEventListener('click', clearAll);
  root.querySelector('[data-act="save"]').addEventListener('click', save);
  window.addEventListener('resize', function () { items.forEach(place); });

  /* ---------- export to PNG ---------- */
  var cache = {};
  function loadImg(src) {
    if (!cache[src]) cache[src] = new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src; });
    return cache[src];
  }
  function save() {
    select(null);
    var W = 1800, H = Math.round(W * 1315 / 1800), cv = document.createElement('canvas');
    cv.width = W; cv.height = H; var c = cv.getContext('2d');
    var bg = c.createLinearGradient(0, 0, W, 0);
    bg.addColorStop(0, '#FBF8F1'); bg.addColorStop(0.44, '#FBF8F1'); bg.addColorStop(0.5, '#F1ECDF'); bg.addColorStop(0.56, '#FBF8F1'); bg.addColorStop(1, '#FBF8F1');
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    c.fillStyle = '#E2DCCD';
    for (var yy = 18; yy < H; yy += 36) for (var xx = 18; xx < W; xx += 36) { c.beginPath(); c.arc(xx, yy, 2, 0, 7); c.fill(); }
    var srcs = items.filter(function (i) { return STICKERS[i.k].type === 'img'; }).map(function (i) { return STICKERS[i.k].src; });
    Promise.all(srcs.map(loadImg)).then(function () {
      var jobs = items.map(function (it) {
        var d = STICKERS[it.k];
        return (d.type === 'img' ? loadImg(d.src) : Promise.resolve(null)).then(function (im) { return { it: it, d: d, im: im }; });
      });
      return Promise.all(jobs);
    }).then(function (list) {
      list.forEach(function (o) {
        var it = o.it, d = o.d, w = it.w * W, h = w * d.ar;
        c.save(); c.translate(it.x * W, it.y * H); c.rotate(it.r * Math.PI / 180);
        if (d.type === 'img' && o.im) c.drawImage(o.im, -w / 2, -h / 2, w, h);
        else if (d.type === 'tape') { c.globalAlpha = 0.85; c.fillStyle = d.color; c.fillRect(-w / 2, -h / 2, w, h); c.globalAlpha = 1; }
        else if (d.type === 'glyph') { c.fillStyle = d.color; c.font = h + 'px Fraunces, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(d.ch, 0, 0); }
        else if (d.type === 'photo') {
          c.shadowColor = 'rgba(20,20,40,.18)'; c.shadowBlur = w * 0.06; c.shadowOffsetY = w * 0.02;
          c.fillStyle = '#FFFFFF'; c.fillRect(-w / 2, -h / 2, w, h); c.shadowColor = 'transparent';
          var p = w * 0.07, iw = w - 2 * p, ih = iw;
          if (it.photo) { var s = Math.max(iw / it.photo.width, ih / it.photo.height), sw = iw / s, sh = ih / s;
            c.drawImage(it.photo, (it.photo.width - sw) / 2, (it.photo.height - sh) / 2, sw, sh, -w / 2 + p, -h / 2 + p, iw, ih); }
          else { c.fillStyle = '#EDE9F8'; c.fillRect(-w / 2 + p, -h / 2 + p, iw, ih); }
        } else {
          c.fillStyle = '#FFFDF6'; c.fillRect(-w / 2, -h / 2, w, h);
          c.fillStyle = '#2B2937'; c.font = (w * 0.12) + 'px Caveat, cursive'; c.textAlign = 'center'; c.textBaseline = 'middle';
          wrap(c, it.text, w * 0.86, w * 0.14);
        }
        c.restore();
      });
      c.fillStyle = 'rgba(43,41,55,.45)'; c.font = '28px Inter, sans-serif'; c.textAlign = 'right'; c.textBaseline = 'alphabetic';
      c.fillText('made on simrangunsi.com ✦', W - 40, H - 34);
      cv.toBlob(function (b) { var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'my-scrapbook-page.png'; document.body.appendChild(a); a.click(); a.remove(); });
    });
  }
  function wrap(c, text, maxW, lh) {
    var words = String(text || '').split(/\s+/), lines = [], cur = '';
    words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur);
    var y0 = -(lines.length - 1) * lh / 2; lines.forEach(function (l, i) { c.fillText(l, 0, y0 + i * lh); });
  }

  window.ScrapbookMaker = { refresh: function () { items.forEach(place); } };
  syncEmpty();
})();
