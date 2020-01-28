'use strict';
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const w = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90};
const x = (a, b, d, c = !1, h = !1) => {
  const k = d ? new RegExp(`^-(${d}|-${b})$`) : new RegExp(`^--${b}$`);
  b = a.findIndex(f => k.test(f));
  if (-1 == b) {
    return {argv:a};
  }
  if (c) {
    return {value:!0, index:b, length:1};
  }
  c = a[b + 1];
  if (!c || "string" == typeof c && c.startsWith("--")) {
    return {argv:a};
  }
  h && (c = parseInt(c, 10));
  return {value:c, index:b, length:2};
}, y = a => {
  const b = [];
  for (let d = 0; d < a.length; d++) {
    const c = a[d];
    if (c.startsWith("-")) {
      break;
    }
    b.push(c);
  }
  return b;
};
module.exports = {c:function(a, b) {
  return (b = w[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}, reduceUsage:a => Object.keys(a).reduce((b, d) => {
  const c = a[d];
  if ("string" == typeof c) {
    return b[`-${c}`] = "", b;
  }
  d = c.command ? d : `--${d}`;
  c.short && (d = `${d}, -${c.short}`);
  let h = c.description;
  c.default && (h = `${h}\nDefault: ${c.default}.`);
  b[d] = h;
  return b;
}, {}), argufy:function(a = {}, b = process.argv) {
  let [, , ...d] = b;
  const c = y(d);
  d = d.slice(c.length);
  a = Object.entries(a).reduce((f, [l, m]) => {
    f[l] = "string" == typeof m ? {short:m} : m;
    return f;
  }, {});
  const h = [];
  a = Object.entries(a).reduce((f, [l, m]) => {
    let e;
    try {
      const g = m.short, n = m.boolean, q = m.number, p = m.command, r = m.multiple;
      if (p && r && c.length) {
        e = c;
      } else {
        if (p && c.length) {
          e = c[0];
        } else {
          const t = x(d, l, g, n, q);
          ({value:e} = t);
          const u = t.index, v = t.length;
          void 0 !== u && v && h.push({index:u, length:v});
        }
      }
    } catch (g) {
      return f;
    }
    return void 0 === e ? f : {...f, [l]:e};
  }, {});
  let k = d;
  h.forEach(({index:f, length:l}) => {
    Array.from({length:l}).forEach((m, e) => {
      k[f + e] = null;
    });
  });
  k = k.filter(f => null !== f);
  Object.assign(a, {a:k});
  return a;
}, usually:function(a = {usage:{}}) {
  const {usage:b = {}, description:d, line:c, example:h} = a;
  a = Object.keys(b);
  const k = Object.values(b), [f] = a.reduce(([e = 0, g = 0], n) => {
    const q = b[n].split("\n").reduce((p, r) => r.length > p ? r.length : p, 0);
    q > g && (g = q);
    n.length > e && (e = n.length);
    return [e, g];
  }, []), l = (e, g) => {
    g = " ".repeat(g - e.length);
    return `${e}${g}`;
  };
  a = a.reduce((e, g, n) => {
    n = k[n].split("\n");
    g = l(g, f);
    const [q, ...p] = n;
    g = `${g}\t${q}`;
    const r = l("", f);
    n = p.map(t => `${r}\t${t}`);
    return [...e, g, ...n];
  }, []).map(e => `\t${e}`);
  const m = [d, `  ${c || ""}`].filter(e => e ? e.trim() : e).join("\n\n");
  a = `${m ? `${m}\n` : ""}
${a.join("\n")}
`;
  return h ? `${a}
  Example:

    ${h}
` : a;
}, indicatrix:async function(a, b, d = {}) {
  const {interval:c = 250, writable:h = process.stdout} = d;
  b = "function" == typeof b ? b() : b;
  const k = h.write.bind(h);
  if ((d = process.env.b) && "0" != d) {
    return k(`${a}<INDICATRIX_PLACEHOLDER>`), await b;
  }
  let f = 1, l = `${a}${".".repeat(f)}`;
  k(l);
  d = setInterval(() => {
    f = (f + 1) % 4;
    l = `${a}${".".repeat(f)}`;
    k(`\r${" ".repeat(a.length + 3)}\r`);
    k(l);
  }, c);
  try {
    return await b;
  } finally {
    clearInterval(d), k(`\r${" ".repeat(a.length + 3)}\r`);
  }
}};


//# sourceMappingURL=index.js.map