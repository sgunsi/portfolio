/* Make-your-own scrapbook page for play.html.
   Builds into #maker. Items are stored as fractions of the page so the
   layout scales with the page. Nothing leaves the visitor's browser. */
(function () {
  'use strict';
  var root = document.getElementById('maker');
  if (!root) return;

  var IMG = 'images/redesign/', MK = IMG + 'maker/';
  var LETTERS = {"A":[["a1",1.172],["a2",1.225],["a3",1.007]],"B":[["b1",1.137],["b2",1.223],["b3",1.261]],"C":[["c1",1.042],["c2",1.63],["c3",1.154]],"D":[["d1",0.959],["d2",1.119],["d3",1.327]],"E":[["e1",0.96],["e2",1.172],["e3",1.339]],"F":[["f1",0.98],["f2",1.304],["f3",1.316]],"G":[["g1",0.993],["g2",1.014],["g3",1.923]],"H":[["h1",1.21],["h2",1.189],["h3",1.087]],"I":[["i1",1.875],["i2",2.0],["i3",0.76]],"J":[["j1",1.765],["j2",1.542],["j3",0.993]],"K":[["k1",1.613],["k2",1.456],["k3",1.0]],"L":[["l1",1.181],["l2",1.442],["l3",1.339]],"M":[["m1",1.0],["m2",1.172],["m3",0.68]],"N":[["n1",1.111],["n2",1.1],["n3",0.933]],"O":[["o1",1.306],["o2",1.049],["o3",1.0]],"P":[["p1",1.25],["p2",1.376],["p3",1.21]],"R":[["r1",0.813],["r2",1.096],["r3",1.042]],"S":[["s1",1.087],["s2",1.415],["s3",1.345]],"T":[["t1",1.282],["t2",1.03],["t3",1.154]],"U":[["u1",0.98],["u2",1.22],["u3",1.056]],"V":[["v1",1.027]],"W":[["w1",0.9]],"X":[["x1",1.054]],"Y":[["y1",0.98],["y2",1.145],["y3",1.261]],"Z":[["z1",0.96]]};
  var PATCHES = {"dog":0.7,"denim-heart":0.858,"apple":1.044,"burst-star":0.929,"red-dot-star":0.927,"dachshund":0.542,"bear":0.769,"luck":1.067,"cloud":0.64,"dragonfly":0.798,"sun":0.975,"cards":0.974,"eight-ball":0.995,"red-heart":0.888};
  var TINTS = ['#EDE9F8', '#FBE3E8', '#E1ECFA', '#E6F3E4', '#FCF0D6'];
  var PAPERS = {
    dots: { label: 'Cream dot grid', base: '#F6F0E1', css: 'radial-gradient(#DCD3BF 1px,transparent 1.3px) 0 0/18px 18px' },
    gingham: { label: 'Blue gingham', base: '#EEF0F2', css: 'linear-gradient(90deg,rgba(120,138,170,.28) 50%,transparent 50%) 0 0/22px 22px,linear-gradient(rgba(120,138,170,.28) 50%,transparent 50%) 0 0/22px 22px' },
    plaid: { label: 'Red plaid', base: '#F3E9E3', css: 'linear-gradient(90deg,transparent 40%,rgba(255,255,255,.55) 40% 46%,transparent 46%) 0 0/30px 30px,linear-gradient(transparent 40%,rgba(255,255,255,.55) 40% 46%,transparent 46%) 0 0/30px 30px,linear-gradient(90deg,rgba(176,38,48,.55) 50%,transparent 50%) 0 0/30px 30px,linear-gradient(rgba(176,38,48,.55) 50%,transparent 50%) 0 0/30px 30px' },
    stars: { label: 'Navy stars', base: '#2C3452', css: 'radial-gradient(rgba(255,240,200,.85) 1px,transparent 1.6px) 0 0/34px 30px,radial-gradient(rgba(255,240,200,.55) .8px,transparent 1.3px) 17px 15px/34px 30px' },
    lined: { label: 'Pink lined', base: '#F4E4EA', css: 'linear-gradient(90deg,transparent 9%,#D98C9C 9%,#D98C9C calc(9% + 1px),transparent calc(9% + 1px)),repeating-linear-gradient(transparent 0 21px,#B9C6E0 21px 22px)' },
    kraft: { label: 'Kraft', base: '#C9A77A', css: 'radial-gradient(rgba(110,80,40,.22) 1px,transparent 1.4px) 0 0/7px 9px,radial-gradient(rgba(255,255,255,.16) 1px,transparent 1.4px) 3px 4px/11px 8px' }
  };
  var paper = 'dots';
  var WORDS = ['hello', 'yay', 'hi friend', 'xoxo', 'fun', 'smile', 'lucky'];
  var STICKERS = {
    miffy: { type: 'img', src: IMG + 'sticker-miffy.png', ar: 356 / 240, w: 0.1, label: 'Miffy' },
    lego: { type: 'img', src: IMG + 'sticker-lego.png', ar: 183 / 260, w: 0.13, label: 'Lego brick' },
    stamp: { type: 'img', src: IMG + 'stamp.png', ar: 480 / 680, w: 0.17, label: 'SF + Toronto stamp' },
    star: { type: 'img', src: IMG + 'sticker-star.png', ar: 152 / 160, w: 0.07, label: 'Gold star' },
    tapePink: { type: 'tape', color: '#F3B7C8', ar: 0.26, w: 0.16, label: 'Pink washi tape' },
    tapeBlue: { type: 'tape', color: '#B9CDF2', ar: 0.26, w: 0.16, label: 'Blue washi tape' },
    tapeLav: { type: 'tape', color: '#CFC6F3', ar: 0.26, w: 0.16, label: 'Lavender washi tape' },
    sparkle: { type: 'glyph', ch: '✦', color: '#D9A93B', ar: 1, w: 0.06, label: 'Sparkle' },
    photo: { type: 'photo', ar: 1.18, w: 0.17, label: 'Photo frame' },
    note: { type: 'note', ar: 0.42, w: 0.2, label: 'Handwritten note' }
  };
  Object.keys(PATCHES).forEach(function (k) { STICKERS['p-' + k] = { type: 'img', src: MK + 'patch-' + k + '.webp', ar: PATCHES[k], w: 0.11, label: k.replace(/-/g, ' ').replace(/^./, function (m) { return m.toUpperCase(); }) + ' patch' }; });
  STICKERS.word = { type: 'word', ar: 0.3, w: 0.3, label: 'Word' };
  var ORDER = ['photo', 'note', 'miffy', 'lego', 'stamp', 'star'].concat(Object.keys(PATCHES).map(function (k) { return 'p-' + k; }), ['tapePink', 'tapeBlue', 'tapeLav', 'sparkle']);


  /* ---------- sounds: generated, no files ---------- */
  var AC = null, soundOn = true, quiet = false, ready = false;
  try { if (localStorage.getItem('mk-sound') === 'off') soundOn = false; } catch (e) {}
  function actx() { if (!AC) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; AC = new C(); } if (AC.state === 'suspended') AC.resume(); return AC; }
  function burst(type, freq, q, dur, peak, delay, sweepTo) {
    var c = actx(); if (!c) return;
    var t = c.currentTime + (delay || 0), len = Math.ceil(c.sampleRate * (dur + 0.05)), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    var src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = b; f.type = type; f.frequency.setValueAtTime(freq, t); if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur); f.Q.value = q;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(c.destination); src.start(t); src.stop(t + dur + 0.05);
  }
  function tone(f0, f1, dur, peak, delay) {
    var c = actx(); if (!c) return;
    var t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  function notes(list, gap, dur, peak) { list.forEach(function (f, k) { tone(f, f * 1.01, dur, peak, k * gap); }); }
  var SFX = {
    pat: function () { tone(880, 1320, 0.09, 0.06); },
    tape: function () { notes([1046, 1318], 0.06, 0.08, 0.045); },
    snip: function () { notes([1568, 2093], 0.07, 0.06, 0.04); },
    shutter: function () { notes([1046, 1318, 1568, 2093], 0.07, 0.16, 0.045); },
    rustle: function () { notes([784, 659], 0.07, 0.09, 0.04); },
    pop: function () { tone(440, 990, 0.07, 0.05); },
    tada: function () { notes([784, 988, 1175, 1568], 0.08, 0.22, 0.04); setTimeout(function () { notes([2093, 2637], 0.09, 0.3, 0.018); }, 300); },
    shuffle: function () { notes([659, 784, 988, 1318], 0.05, 0.08, 0.04); }
  };
  function sfx(n) { if (soundOn && ready && !quiet && SFX[n]) try { SFX[n](); } catch (e) {} }

  var items = [], sel = null, uid = 0;

  root.innerHTML =
    '<div class="mk-stage"><div class="mk-rail mk-rail-l" role="toolbar" aria-label="Stickers"></div>' +
    '<div class="mk-page" aria-label="Your scrapbook page">' +
      '<div class="mk-half mk-l"></div><div class="mk-half mk-r"></div><div class="mk-spine"></div>' +
      '<div class="mk-items"></div>' +
      '<p class="mk-empty">Tap a sticker to start your page ✦</p>' +
    '</div><div class="mk-rail mk-rail-r" role="toolbar" aria-label="More stickers"></div></div>' +
    '<div class="mk-box mk-box-l"><p class="mk-box-title">Cut-out letters</p>' +
    '<div class="mk-word-demo" aria-hidden="true"><img src="' + MK + 'letter-a1.webp" alt=""><img src="' + MK + 'letter-b3.webp" alt=""><img src="' + MK + 'letter-c3.webp" alt=""></div>' +
    '<p class="mk-sub">Type anything and it shows up as magazine cutouts</p>' +
    '<form class="mk-wordbar" autocomplete="off"><input class="mk-word-in" maxlength="16" placeholder="e.g. hello" aria-label="Word to spell in cut-out letters"><button type="submit" class="mk-btn">Cut it out ✂︎</button></form>' +
    '</div><div class="mk-box mk-box-p"><p class="mk-box-title">Paper</p><div class="mk-papers" role="group" aria-label="Paper"></div></div>' +
    '<div class="mk-tray" role="toolbar" aria-label="Stickers"></div>' +
    '<div class="mk-box mk-box-r"><p class="mk-box-title">Your page</p><div class="mk-actions">' +
      '<button type="button" class="mk-btn" data-act="shuffle">Shuffle ⟳</button>' +
      '<button type="button" class="mk-btn" data-act="clear">Clear</button>' +
      '<button type="button" class="mk-btn mk-sound" data-act="sound" aria-pressed="true">🔈 Sound on</button>' +
      '<button type="button" class="mk-btn mk-dark" data-act="save">Save my page ↓</button>' +
    '</div>' +
    '<p class="mk-hint">Drag to move. Use the corner handle to resize and rotate. Your page stays on your device.</p></div>' +
    '<input type="file" accept="image/*" class="mk-file" hidden>';

  var page = root.querySelector('.mk-page'), layer = root.querySelector('.mk-items'),
      tray = root.querySelector('.mk-tray'), empty = root.querySelector('.mk-empty'),
      file = root.querySelector('.mk-file');

  var railL = root.querySelector('.mk-rail-l'), railR = root.querySelector('.mk-rail-r');
  railL.innerHTML = '<button type="button" class="mk-btn mk-back">← Back to my scrapbook</button><div class="mk-rail-sk"></div>'; railR.innerHTML = '<div class="mk-rail-sk"></div>';
  railL.querySelector('.mk-back').addEventListener('click', function () { var b = document.querySelector('.pl-actions .pl-dark'); if (b) b.click(); });
  var skL = railL.querySelector('.mk-rail-sk'), skR = railR.querySelector('.mk-rail-sk');
  ORDER.forEach(function (k, n) {
    [n < 9 ? skL : skR, tray].forEach(function (dest) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'mk-chip'; b.dataset.tip = STICKERS[k].label;
    b.setAttribute('aria-label', 'Add ' + STICKERS[k].label);
    b.appendChild(preview(k));
    b.addEventListener('click', function () { add(k, 0.5 + (Math.random() - 0.5) * 0.3, 0.5 + (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 16); });
    dest.appendChild(b);
    });
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
    if (d.type === 'photo' && !it.tint) it.tint = TINTS[Math.floor(Math.random() * TINTS.length)];
    if (d.type === 'word') buildWord(it);
    items.push(it); draw(it); select(it); syncEmpty();
    sfx(d.type === 'tape' ? 'tape' : d.type === 'word' ? 'snip' : 'pat');
    return it;
  }

  function draw(it) {
    var d = STICKERS[it.k], el = document.createElement('div');
    el.className = 'mk-item mk-' + d.type; el.dataset.id = it.id; el.tabIndex = 0;
    if (d.type === 'img') { var im = new Image(); im.src = d.src; im.alt = d.label; im.draggable = false; el.appendChild(im); }
    else if (d.type === 'tape') { el.style.background = tapeBg(d.color); }
    else if (d.type === 'glyph') { var g = document.createElement('span'); g.textContent = d.ch; g.style.color = d.color; el.appendChild(g); }
    else if (d.type === 'photo') {
      var f = document.createElement('div'); f.className = 'mk-photo-in'; el.appendChild(f);
      var tools = document.createElement('div'); tools.className = 'mk-ptools';
      tools.innerHTML = '<button type="button" data-p="own">Add a photo +</button>';
      it.tools = tools; setPhoto(it, f);
      tools.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
      tools.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return; e.stopPropagation();
        pickPhoto(it);
      });
    } else if (d.type === 'word') {
      el.setAttribute('aria-label', it.word);
      it.parts.forEach(function (pt) {
        var c;
        if (pt.space) { c = document.createElement('span'); c.className = 'mk-wspace'; }
        else if (pt.n) { c = new Image(); c.src = MK + 'letter-' + pt.n + '.webp'; c.alt = ''; c.draggable = false; }
        else { c = document.createElement('span'); c.className = 'mk-wtile'; c.textContent = pt.ch; c.style.background = pt.bg; }
        c.style.width = (pt.u / it.units * 100) + '%';
        c.style.transform = 'translateY(' + pt.dy + '%) rotate(' + pt.rot + 'deg)';
        el.appendChild(c);
      });
    } else {
      var t = document.createElement('div'); t.className = 'mk-note-text'; t.contentEditable = 'true'; t.spellcheck = false; t.style.textAlign = it.align || 'center'; if (it.clean) t.classList.add('mk-clean'); if (/\*\*/.test(it.text)) { it.text.split(/\*\*/).forEach(function (seg, k) { var n = k % 2 ? document.createElement('b') : document.createTextNode(seg); if (k % 2) n.textContent = seg; t.appendChild(n); }); } else t.textContent = it.text;
      t.addEventListener('input', function () { it.text = noteMarkup(t); });
      t.addEventListener('pointerdown', function (e) { if (sel === it) e.stopPropagation(); });
      el.appendChild(t);
    }
    var h = document.createElement('span'); h.className = 'mk-handle'; h.setAttribute('aria-hidden', 'true'); el.appendChild(h);
    var x = document.createElement('button'); x.type = 'button'; x.className = 'mk-del'; x.setAttribute('aria-label', 'Remove'); x.textContent = '×'; el.appendChild(x);
    x.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    x.addEventListener('click', function (e) { e.stopPropagation(); remove(it); sfx('pop'); });
    el.addEventListener('pointerdown', function (e) { startMove(e, it); });
    h.addEventListener('pointerdown', function (e) { startScale(e, it); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Delete' || e.key === 'Backspace') { if (e.target === el) { e.preventDefault(); remove(it); } } });
    layer.appendChild(el); place(it);
  }

  function elOf(it) { return layer.querySelector('[data-id="' + it.id + '"]'); }
  function place(it) {
    var el = elOf(it), d = STICKERS[it.k], W = page.clientWidth, H = page.clientHeight;
    var wpx = it.w * W, hpx = wpx * (it.ar || d.ar);
    el.style.width = wpx + 'px'; el.style.height = hpx + 'px';
    el.style.left = (it.x * W - wpx / 2) + 'px'; el.style.top = (it.y * H - hpx / 2) + 'px';
    el.style.transform = 'rotate(' + it.r + 'deg)';
    if (d.type === 'glyph') el.firstChild.style.fontSize = hpx + 'px';
    if (d.type === 'note') el.firstChild.style.fontSize = Math.max(10, wpx * (it.fs || 0.12)) + 'px';
    if (d.type === 'word') Array.prototype.forEach.call(el.querySelectorAll('.mk-wtile'), function (t) { t.style.fontSize = (hpx * 0.62) + 'px'; });
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

  function setPhoto(it, box) {
    box.innerHTML = ''; box.style.background = it.tint;
    if (!it.photo) { box.innerHTML = '<span class="mk-ph">your photo here ✦</span>'; }
    else { var c = it.photo.cloneNode(); c.alt = 'Your photo'; c.draggable = false; box.appendChild(c); it.tools.firstChild.textContent = 'Change photo'; }
    box.appendChild(it.tools);
  }
  var TILE_BG = ['#F3B7C8', '#B9CDF2', '#F6DF73', '#CFC6F3', '#BFE3C0', '#F7C59F'];
  function buildWord(it) {
    var word = String(it.word || 'hello').slice(0, 16), units = 0, used = {};
    it.word = word;
    it.parts = word.split('').map(function (ch) {
      var up = ch.toUpperCase(), opts = LETTERS[up], pt;
      if (ch === ' ') pt = { space: true, u: 0.45 };
      else if (opts) {
        var k = used[up] || Math.floor(Math.random() * opts.length); used[up] = (k + 1) % opts.length;
        var o = opts[k % opts.length]; pt = { n: o[0], ar: o[1], u: Math.min(1 / o[1], 1.15) };
      } else pt = { ch: ch, u: 0.85, bg: TILE_BG[Math.floor(Math.random() * TILE_BG.length)] };
      pt.rot = pt.space ? 0 : (Math.random() - 0.5) * 14; pt.dy = pt.space ? 0 : (Math.random() - 0.5) * 10;
      units += pt.u; return pt;
    });
    it.units = units; it.ar = 1.05 / units; it.w = Math.min(0.065 * units, 0.7);
  }
  var wordForm = root.querySelector(".mk-wordbar"), wordIn = root.querySelector('.mk-word-in');
  wordForm.addEventListener('submit', function (e) {
    e.preventDefault(); var v = wordIn.value.trim(); if (!v) { wordIn.focus(); return; }
    add('word', 0.5, 0.5, (Math.random() - 0.5) * 8, { word: v }); wordIn.value = '';
  });

  var photoFor = null;
  function pickPhoto(it) { photoFor = it; file.value = ''; file.click(); }
  file.addEventListener('change', function () {
    var f = file.files && file.files[0]; if (!f || !photoFor) return;
    var it = photoFor, url = URL.createObjectURL(f), im = new Image();
    im.onload = function () { it.photo = im; setPhoto(it, elOf(it).querySelector('.mk-photo-in')); sfx('pat'); };
    im.src = url;
  });

  function clearAll() { items.slice().forEach(remove); }
  function clearBtn() { clearAll(); sfx('rustle'); }
  function shuffle() {
    quiet = true; clearAll();
    var pk = Object.keys(PATCHES).sort(function () { return Math.random() - 0.5; }).slice(0, 3).map(function (k) { return 'p-' + k; });
    var picks = ['word', 'photo', 'photo', 'note', ['miffy', 'lego'][Math.floor(Math.random() * 2)], 'stamp', 'star', ['tapePink', 'tapeBlue', 'tapeLav'][Math.floor(Math.random() * 3)]].concat(pk);
    var spots = [[0.22, 0.34], [0.7, 0.36], [0.33, 0.74], [0.13, 0.64], [0.85, 0.72], [0.6, 0.76], [0.44, 0.44], [0.87, 0.18], [0.14, 0.16], [0.6, 0.12], [0.42, 0.9]];
    spots.sort(function () { return Math.random() - 0.5; });
    add('word', 0.27 + Math.random() * 0.06, 0.13, (Math.random() - 0.5) * 6, { word: WORDS[Math.floor(Math.random() * WORDS.length)] });
    picks.slice(1).forEach(function (k, i) { var s = spots[i]; add(k, s[0] + (Math.random() - 0.5) * 0.05, s[1] + (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 22); });
    select(null);
    var pk2 = Object.keys(PAPERS); setPaper(pk2[Math.floor(Math.random() * pk2.length)]);
    quiet = false; sfx('shuffle');
  }

  root.querySelector('[data-act="shuffle"]').addEventListener('click', shuffle);
  root.querySelector('[data-act="clear"]').addEventListener('click', clearBtn);
  root.querySelector('[data-act="save"]').addEventListener('click', save);
  window.addEventListener('resize', function () { items.forEach(place); });

  /* ---------- export to PNG ---------- */
  var cache = {};
  function loadImg(src) {
    if (!cache[src]) cache[src] = new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src; });
    return cache[src];
  }
  function showSaved(url) {
    var old = document.querySelector('.mk-saved'); if (old) old.remove();
    var m = document.createElement('div'); m.className = 'mk-saved'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-label', 'Your saved page');
    m.innerHTML = url
      ? '<div class="mk-saved-card"><p class="mk-saved-t">Your page is ready ✧˖°⟡</p><img alt="Your scrapbook page"><p class="mk-saved-s">It should be downloading. If not, right-click (or press and hold) the image to save it.</p><div class="mk-saved-b"><a class="mk-btn mk-dark" download="my-scrapbook-page.png">Download again ↓</a><button type="button" class="mk-btn">Keep making</button></div></div>'
      : '<div class="mk-saved-card"><p class="mk-saved-t">Hmm, that didn\'t work</p><p class="mk-saved-s">Try a screenshot instead, sorry!</p><div class="mk-saved-b"><button type="button" class="mk-btn">Close</button></div></div>';
    if (url) { m.querySelector('img').src = url; m.querySelector('a').href = url; }
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('button')) m.remove(); });
    document.body.appendChild(m);
  }
  function save() {
    sfx('shutter');
    var fr = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fr.then(doSave);
  }
  function doSave() {
    select(null);
    var W = 1800, H = Math.round(W * 1265 / 1800), cv = document.createElement('canvas');
    cv.width = W; cv.height = H; var c = cv.getContext('2d');
    drawPaper(c, W, H);
    var srcs = items.filter(function (i) { return STICKERS[i.k].type === 'img'; }).map(function (i) { return STICKERS[i.k].src; });
    Promise.all(srcs.map(loadImg)).then(function () {
      var jobs = items.map(function (it) {
        var d = STICKERS[it.k];
        if (d.type === 'word') return Promise.all(it.parts.map(function (pt) { return pt.n ? loadImg(MK + 'letter-' + pt.n + '.webp') : Promise.resolve(null); })).then(function (ims) { return { it: it, d: d, ims: ims }; });
        if (d.type === 'photo') return Promise.resolve({ it: it, d: d, im: it.photo });
        return (d.type === 'img' ? loadImg(d.src) : Promise.resolve(null)).then(function (im) { return { it: it, d: d, im: im }; });
      });
      return Promise.all(jobs);
    }).then(function (list) {
      list.forEach(function (o) {
        var it = o.it, d = o.d, w = it.w * W, h = w * (it.ar || d.ar);
        c.save(); c.translate(it.x * W, it.y * H); c.rotate(it.r * Math.PI / 180);
        if (d.type === 'img' && o.im) c.drawImage(o.im, -w / 2, -h / 2, w, h);
        else if (d.type === 'tape') { c.globalAlpha = 0.85; c.fillStyle = d.color; c.fillRect(-w / 2, -h / 2, w, h); c.globalAlpha = 1; }
        else if (d.type === 'glyph') { c.fillStyle = d.color; c.font = h + 'px Fraunces, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(d.ch, 0, 0); }
        else if (d.type === 'photo') {
          c.shadowColor = 'rgba(20,20,40,.18)'; c.shadowBlur = w * 0.06; c.shadowOffsetY = w * 0.02;
          c.fillStyle = '#FFFFFF'; c.fillRect(-w / 2, -h / 2, w, h); c.shadowColor = 'transparent';
          var p = w * 0.07, iw = w - 2 * p, ih = iw;
          var ph = o.im;
          if (ph) { var s = Math.max(iw / ph.width, ih / ph.height), sw = iw / s, sh = ih / s;
            c.drawImage(ph, (ph.width - sw) / 2, (ph.height - sh) / 2, sw, sh, -w / 2 + p, -h / 2 + p, iw, ih); }
          else { c.fillStyle = it.tint; c.fillRect(-w / 2 + p, -h / 2 + p, iw, ih); c.fillStyle = 'rgba(43,41,55,.55)'; c.font = (iw * 0.12) + 'px Caveat, cursive'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('your photo here ✦', 0, -h / 2 + p + ih / 2); }
        } else if (d.type === 'word') {
          var uw = w / it.units, cx = -w / 2;
          it.parts.forEach(function (pt, i) {
            var pw = pt.u * uw; c.save(); c.translate(cx + pw / 2, pt.dy / 100 * h); c.rotate(pt.rot * Math.PI / 180);
            if (pt.n && o.ims[i]) { var lh = pw * pt.ar; c.drawImage(o.ims[i], -pw / 2, -lh / 2, pw, lh); }
            else if (!pt.space && !pt.n) { c.fillStyle = pt.bg; c.fillRect(-pw * 0.45, -h * 0.4, pw * 0.9, h * 0.8); c.fillStyle = '#2B2937'; c.font = (h * 0.62) + 'px Fraunces, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(pt.ch, 0, 0); }
            c.restore(); cx += pw;
          });
        } else {
          c.fillStyle = '#FFFDF6'; c.fillRect(-w / 2, -h / 2, w, h);
          var fs = it.fs || 0.12; c.fillStyle = '#2B2937'; c.font = (w * fs) + (it.clean ? 'px Inter, sans-serif' : 'px Caveat, cursive'); c.textAlign = it.align === 'left' ? 'left' : 'center'; c.textBaseline = 'middle';
          var face = it.clean ? 'Inter, sans-serif' : 'Caveat, cursive';
          richWrap(c, it.text, w * 0.86, w * fs * (it.clean ? 1.5 : 1.17), it.align === 'left' ? -w * 0.43 : 0, w * fs, face, it.align === 'left');
        }
        c.restore();
      });
      c.fillStyle = 'rgba(43,41,55,.45)'; c.font = '28px Inter, sans-serif'; c.textAlign = 'right'; c.textBaseline = 'alphabetic';
      c.fillText('made on simrangunsi.com ✦', W - 40, H - 34);
      var url;
      try { url = cv.toDataURL('image/png'); } catch (e) { showSaved(null); return; }
      try { var a = document.createElement('a'); a.href = url; a.download = 'my-scrapbook-page.png'; document.body.appendChild(a); a.click(); a.remove(); } catch (e) {}
      showSaved(url);
    });
  }
  function drawPaper(c, W, H) {
    var P = PAPERS[paper], g = 36, x, y;
    c.fillStyle = P.base; c.fillRect(0, 0, W, H);
    if (paper === 'dots') { c.fillStyle = '#DCD3BF'; for (y = 18; y < H; y += g) for (x = 18; x < W; x += g) { c.beginPath(); c.arc(x, y, 2, 0, 7); c.fill(); } }
    else if (paper === 'gingham') { g = 44; c.fillStyle = 'rgba(120,138,170,.28)'; for (x = 0; x < W; x += g) c.fillRect(x, 0, g / 2, H); for (y = 0; y < H; y += g) c.fillRect(0, y, W, g / 2); }
    else if (paper === 'plaid') { g = 60; c.fillStyle = 'rgba(176,38,48,.55)'; for (x = 0; x < W; x += g) c.fillRect(x, 0, g / 2, H); for (y = 0; y < H; y += g) c.fillRect(0, y, W, g / 2);
      c.fillStyle = 'rgba(255,255,255,.55)'; for (x = 0; x < W; x += g) c.fillRect(x + g * 0.4, 0, g * 0.06, H); for (y = 0; y < H; y += g) c.fillRect(0, y + g * 0.4, W, g * 0.06); }
    else if (paper === 'stars') { for (y = 0; y < H; y += 60) for (x = 0; x < W; x += 68) { c.fillStyle = 'rgba(255,240,200,.85)'; c.beginPath(); c.arc(x, y, 2.4, 0, 7); c.fill(); c.fillStyle = 'rgba(255,240,200,.55)'; c.beginPath(); c.arc(x + 34, y + 30, 1.8, 0, 7); c.fill(); } }
    else if (paper === 'lined') { c.fillStyle = '#B9C6E0'; for (y = 42; y < H; y += 44) c.fillRect(0, y, W, 2); c.fillStyle = '#D98C9C'; c.fillRect(W * 0.045, 0, 2, H); c.fillRect(W * 0.545, 0, 2, H); }
    else if (paper === 'kraft') { for (var i = 0; i < 9000; i++) { c.fillStyle = Math.random() < 0.6 ? 'rgba(110,80,40,.2)' : 'rgba(255,255,255,.14)'; c.fillRect(Math.random() * W, Math.random() * H, 2, 2); } }
    var sp = c.createLinearGradient(W / 2 - 40, 0, W / 2 + 40, 0);
    sp.addColorStop(0, 'rgba(60,50,30,0)'); sp.addColorStop(0.5, 'rgba(60,50,30,.16)'); sp.addColorStop(1, 'rgba(60,50,30,0)');
    c.fillStyle = sp; c.fillRect(W / 2 - 40, 0, 80, H);
  }
  function setPaper(k) {
    paper = k; sfx('rustle'); var P = PAPERS[k];
    root.querySelectorAll('.mk-half').forEach(function (h) { h.style.background = P.css + ',' + P.base; });
    root.querySelectorAll('.mk-paper').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.paper === k ? 'true' : 'false'); });
  }
  var papersRow = root.querySelector('.mk-papers');
  Object.keys(PAPERS).forEach(function (k) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'mk-paper'; b.dataset.paper = k;
    b.title = PAPERS[k].label; b.setAttribute('aria-label', PAPERS[k].label + ' paper');
    b.style.background = PAPERS[k].css.replace(/(18|22|30)px (18|22|30)px/g, '9px 9px').replace(/34px 30px/g, '12px 11px').replace(/0 21px/, '0 7px').replace(/21px 22px/, '7px 8px') + ',' + PAPERS[k].base;
    b.addEventListener('click', function () { setPaper(k); });
    papersRow.appendChild(b);
  });
  setPaper('dots');

  function noteMarkup(el) {
    var out = '';
    (function walk(n, bold) {
      n.childNodes.forEach(function (ch) {
        if (ch.nodeType === 3) out += bold ? '**' + ch.nodeValue + '**' : ch.nodeValue;
        else if (ch.nodeName === 'BR') out += '\n';
        else { var blk = ch.nodeName === 'DIV' || ch.nodeName === 'P'; if (blk && out && !/\n$/.test(out)) out += '\n'; walk(ch, bold || ch.nodeName === 'B' || ch.nodeName === 'STRONG'); }
      });
    })(el, false);
    return out.replace(/\*\*\*\*/g, '');
  }
  function richWrap(c, text, maxW, lh, x0, size, face, left) {
    var lines = [];
    String(text || '').split(/\n/).forEach(function (para) {
      var toks = [];
      para.split(/\*\*/).forEach(function (seg, k) { seg.split(/\s+/).filter(Boolean).forEach(function (w) { toks.push({ w: w, b: k % 2 === 1 }); }); });
      var cur = [], cw = 0;
      toks.forEach(function (tk) {
        c.font = (tk.b ? '600 ' : '') + size + 'px ' + face; tk.wd = c.measureText(tk.w).width;
        c.font = size + 'px ' + face; var sp = cur.length ? c.measureText(' ').width : 0;
        if (cur.length && cw + sp + tk.wd > maxW) { lines.push({ t: cur, w: cw }); cur = []; cw = 0; sp = 0; }
        tk.sp = sp; cur.push(tk); cw += sp + tk.wd;
      });
      lines.push({ t: cur, w: cw });
    });
    c.textAlign = 'left';
    var y0 = -(lines.length - 1) * lh / 2;
    lines.forEach(function (ln, i) {
      var x = left ? x0 : -ln.w / 2;
      ln.t.forEach(function (tk) { x += tk.sp; c.font = (tk.b ? '600 ' : '') + size + 'px ' + face; c.fillText(tk.w, x, y0 + i * lh); x += tk.wd; });
    });
  }
  function wrap(c, text, maxW, lh, x0) {
    var lines = [];
    String(text || '').split(/\n/).forEach(function (para) {
      var cur = '';
      para.split(/\s+/).filter(Boolean).forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
      lines.push(cur);
    });
    var y0 = -(lines.length - 1) * lh / 2; lines.forEach(function (l, i) { c.fillText(l, x0 || 0, y0 + i * lh); });
  }


  var mq = window.matchMedia('(min-width: 1100px)'), boxL = root.querySelector('.mk-box-l'), boxP = root.querySelector('.mk-box-p'), boxR = root.querySelector('.mk-box-r');
  function layout() {
    var tr = root.querySelector('.mk-tray');
    if (mq.matches) { railL.insertBefore(boxL, skL); railL.insertBefore(boxP, skL); railR.appendChild(boxR); }
    else { tr.parentNode.insertBefore(boxL, tr); tr.parentNode.insertBefore(boxP, tr); tr.parentNode.insertBefore(boxR, tr.nextSibling); }
    items.forEach(place);
  }
  (mq.addEventListener ? mq.addEventListener('change', layout) : mq.addListener(layout)); layout();

  function starter() {
    quiet = true; clearAll();
    add('word', 0.25, 0.13, -3, { word: 'yippee!' });
    add('note', 0.25, 0.55, -1.5, { w: 0.4, ar: 0.8, fs: 0.043, align: 'left', clean: true, text: 'you found my little craft corner ✧˖°⟡\n\ngrowing up, i dabbled in a lot of crafts, but scrapbooking has a special place in my heart. it was my first time asking a design question: **how do you tell a story with just visuals and a few constraints?**\n\nmake your own virtual scrapbook, play around with the elements, and save it to your device!' });
    add('tapeLav', 0.25, 0.2, 2, { w: 0.12 });
    add('photo', 0.7, 0.42, 4);
    add('star', 0.86, 0.2, 12);
    add('p-denim-heart', 0.86, 0.74, -8);
    add('miffy', 0.6, 0.78, -6, { w: 0.08 });
    select(null); quiet = false;
  }
  var sBtn = root.querySelector('[data-act="sound"]');
  function syncSound() { sBtn.textContent = soundOn ? '🔈 Sound on' : '🔇 Sound off'; sBtn.setAttribute('aria-pressed', soundOn ? 'true' : 'false'); }
  sBtn.addEventListener('click', function () { soundOn = !soundOn; try { localStorage.setItem('mk-sound', soundOn ? 'on' : 'off'); } catch (e) {} syncSound(); sfx('pop'); });
  syncSound(); ready = true;

  window.ScrapbookMaker = { starter: starter, sfx: function (n) { sfx(n); }, refresh: function () { items.forEach(place); } };
  syncEmpty();
})();
