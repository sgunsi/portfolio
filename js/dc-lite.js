/* Tiny reactive template runner for the redesign pages.
   Supports {{ path }} holes in text and attributes, data-on-<event> handlers,
   <sc-for list as>, <sc-if value>, and ref callbacks. */
(function () {
  'use strict';
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (p) {
    Object.assign(this.state, typeof p === 'function' ? p(this.state) : p);
    if (this.__q) this.__q();
  };
  window.DCLogic = DCLogic;

  var ONE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/, ANY = /\{\{\s*([^}]+?)\s*\}\}/g;
  function get(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d/.test(path)) return Number(path);
    var parts = path.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) { if (v == null) return undefined; v = v[parts[i]]; }
    return v;
  }
  function interp(t, scope) {
    var m = t.match(ONE);
    if (m) return get(m[1], scope);
    return t.replace(ANY, function (_, p) { var v = get(p, scope); return v == null ? '' : v; });
  }
  function has(t) { return t && t.indexOf('{{') !== -1; }

  function compile(node, scopeFn, out) {
    if (node.nodeType === 3) {
      if (has(node.nodeValue)) {
        var tpl = node.nodeValue;
        out.push(function () { var v = interp(tpl, scopeFn()); node.nodeValue = v == null ? '' : String(v); });
      }
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.localName;
    if (tag === 'sc-for' || tag === 'sc-if') return compileStruct(node, scopeFn, out, tag);
    var attrs = Array.prototype.slice.call(node.attributes);
    attrs.forEach(function (a) {
      var name = a.name, val = a.value;
      if (name.indexOf('hint-') === 0) { node.removeAttribute(name); return; }
      if (name.indexOf('data-on-') === 0) {
        node.removeAttribute(name);
        var evt = name.slice(8);
        node.addEventListener(evt, function (e) { var f = interp(val, scopeFn()); if (typeof f === 'function') f(e); });
        return;
      }
      if (name === 'data-ref') {
        node.removeAttribute(name);
        out.push(function () { if (node.__refd) return; var f = interp(val, scopeFn()); if (typeof f === 'function') { node.__refd = true; f(node); } });
        return;
      }
      if (has(val)) {
        out.push(function () {
          var v = interp(val, scopeFn());
          if (v === false || v == null) node.removeAttribute(name);
          else if (node.getAttribute(name) !== String(v)) node.setAttribute(name, String(v));
        });
      }
    });
    Array.prototype.slice.call(node.childNodes).forEach(function (c) { compile(c, scopeFn, out); });
  }

  function compileStruct(node, scopeFn, out, tag) {
    var anchor = document.createComment(tag);
    var tplFrag = document.createDocumentFragment();
    while (node.firstChild) tplFrag.appendChild(node.firstChild);
    var expr = node.getAttribute(tag === 'sc-for' ? 'list' : 'value');
    var as = node.getAttribute('as') || 'item';
    node.parentNode.replaceChild(anchor, node);
    var instances = []; // {nodes, binds}
    function mount(scopeOf) {
      var frag = tplFrag.cloneNode(true), nodes = Array.prototype.slice.call(frag.childNodes), binds = [];
      nodes.forEach(function (n) { compile(n, scopeOf, binds); });
      return { nodes: nodes, binds: binds, frag: frag };
    }
    function insertAfter(inst, ref) {
      var parent = anchor.parentNode, next = ref.nextSibling;
      inst.nodes.forEach(function (n) { parent.insertBefore(n, next); });
    }
    function lastNode() { var l = instances[instances.length - 1]; return l ? l.nodes[l.nodes.length - 1] || anchor : anchor; }
    out.push(function () {
      var v = interp(expr, scopeFn());
      if (tag === 'sc-if') {
        if (v && !instances.length) { var inst = mount(scopeFn); instances.push(inst); insertAfter(inst, anchor); }
        else if (!v && instances.length) { instances.forEach(function (i) { i.nodes.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); }); }); instances = []; }
        instances.forEach(function (i) { i.binds.forEach(function (b) { b(); }); });
        return;
      }
      var list = v || [];
      while (instances.length > list.length) { var r = instances.pop(); r.nodes.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); }); }
      while (instances.length < list.length) {
        (function (idx) {
          var inst = mount(function () { var s = Object.create(scopeFn()); s[as] = inst.cur; s.$index = idx; return s; });
          var ref = lastNode(); instances.push(inst); insertAfter(inst, ref);
        })(instances.length);
      }
      instances.forEach(function (inst, i) { inst.cur = list[i]; inst.binds.forEach(function (b) { b(); }); });
    });
  }

  window.DCLite = {
    mount: function (root, Component) {
      var comp = new Component({}), vals = {}, binds = [], queued = false;
      function render() { queued = false; vals = comp.renderVals() || {}; binds.forEach(function (b) { b(); }); }
      comp.__q = function () { if (!queued) { queued = true; Promise.resolve().then(render); } };
      compile(root, function () { return vals; }, binds);
      render();
      root.removeAttribute('hidden');
      return comp;
    }
  };
})();
