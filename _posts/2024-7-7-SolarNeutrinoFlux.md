---
layout: post
title:  Plot Solar Neutrino Flux with Python
feature-img: "assets/img/SNF/head.png"
---

<p>Solar neutrinos are neutrinos that are produced in the core of the sun with nuclear fusion reactions, each one of them has its own spectrum of neutrino energies. Here I will write about the important ones.</p>

<ul>
    <li>pp chain:   $\;\;\;\;p^+ + p^+ \longrightarrow {}^{2}\text{H} + e^+ + \nu_e$</li>
    <li>pep chain:  $\;\;p^+ + e^- + p^+ \longrightarrow {}^{2}\text{H} + \nu_e$</li>
    <li>hep chain: $\;{}^{3}\text{He} + p^+ \longrightarrow {}^{4}\text{He} + e^+ + \nu_e$</li>
    <li>${}^{7}\text{Be}$ chain: $\;{}^{7}\text{Be} + e^- \longrightarrow {}^{7}\text{Li} + \nu_e$</li>
    <li>${}^{8}\text{B}$ chain: $\;\;\;{}^{8}\text{B} + e^- \longrightarrow {}^{8}\text{Be} + e^+ + \nu_e$</li>
</ul>

<p>For plotting the solar neutrino flux at first step we need the data, I get my the data from <a href="https://www.sns.ias.edu/~jnb/SNdata/sndata.html"> Software and data for solar neutrino research</a> then I use matplotlib package to plot them here is the code(data files should be at the same folder as the python file):</p>
<script src="https://gist.github.com/SinaEtebar/9d2d740e9e8fed22ede15f6a7ba13078.js"></script>
<p>And here is the final result with a little bit modification:</p>
<img alt="Solar Neutrino Flux" src="/assets/img/SNF/SolarFlux.jpg">

---

<h3>Interactive: Solar Neutrino Oscillation</h3>

<p>
By the time these neutrinos travel from the Sun's core to Earth — a distance of about 1.496 × 10<sup>8</sup> km — quantum mechanical mixing causes them to oscillate between flavors. The survival probability at Earth is governed by the MSW (Mikheyev–Smirnov–Wolfenstein) LMA solution. The parameters below are the best-fit values from <a href="https://arxiv.org/abs/2410.05380">NuFIT 6.0 (2024)</a>:
\(\theta_{12} = 33.68°\), \(\Delta m^2_{21} = 7.49 \times 10^{-5}\,\text{eV}^2\).
</p>

<div class="neutrino-solar-viz">
<style>
.neutrino-solar-viz { font-family: inherit; margin: 1.5em 0; }
.nsv-tabs { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
.nsv-tab { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border-color); background: transparent; color: var(--text-color); font-size: 12px; cursor: pointer; transition: all 0.15s; }
.nsv-tab.active { background: var(--link-color); color: #fff; border-color: var(--link-color); font-weight: 500; }
.nsv-params { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
.nsv-ctrl { background: rgba(128,128,128,0.07); border-radius: 8px; padding: 10px 13px; }
.nsv-ctrl-label { font-size: 11px; color: var(--text-color); opacity: 0.65; margin: 0 0 6px; display: flex; justify-content: space-between; align-items: center; }
.nsv-ctrl-val { font-weight: 600; color: var(--link-color); font-family: monospace; opacity: 1; font-size: 12px; }
.nsv-ctrl input[type=range] { width: 100%; margin: 0; }
.nsv-reset { font-size: 11px; padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border-color); background: transparent; color: var(--text-color); cursor: pointer; opacity: 0.6; float: right; margin-bottom: 10px; }
.nsv-reset:hover { opacity: 1; }
#nsv-canvas { width: 100%; border-radius: 8px; display: block; }
.nsv-legend { display: flex; gap: 16px; margin-top: 8px; flex-wrap: wrap; }
.nsv-leg { display: flex; align-items: center; gap: 5px; font-size: 11px; opacity: 0.7; }
.nsv-leg-line { width: 16px; height: 3px; border-radius: 2px; }
.nsv-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 12px; }
.nsv-stat { background: rgba(128,128,128,0.07); border-radius: 8px; padding: 10px 12px; text-align: center; }
.nsv-stat-label { font-size: 10px; opacity: 0.55; margin: 0 0 3px; line-height: 1.3; }
.nsv-stat-val { font-size: 16px; font-weight: 500; margin: 0; font-family: monospace; color: var(--link-color); }
.nsv-note { font-size: 11px; opacity: 0.5; margin-top: 10px; font-style: italic; }
@media (max-width: 576px) {
  .nsv-stats { grid-template-columns: 1fr 1fr; }
  .nsv-params { grid-template-columns: 1fr; }
}
</style>

<!-- neutrino type selector -->
<div class="nsv-tabs">
  <button class="nsv-tab active" onclick="nsvSetType('pp')"   id="nsv-t-pp">pp (0.27 MeV)</button>
  <button class="nsv-tab"        onclick="nsvSetType('Be7')"  id="nsv-t-Be7">⁷Be (0.86 MeV)</button>
  <button class="nsv-tab"        onclick="nsvSetType('pep')"  id="nsv-t-pep">pep (1.44 MeV)</button>
  <button class="nsv-tab"        onclick="nsvSetType('B8')"   id="nsv-t-B8">⁸B (8 MeV)</button>
  <button class="nsv-tab"        onclick="nsvSetType('hep')"  id="nsv-t-hep">hep (18 MeV)</button>
</div>

<button class="nsv-reset" onclick="nsvReset()">↺ reset to NuFIT 6.0</button>

<div class="nsv-params">
  <div class="nsv-ctrl">
    <div class="nsv-ctrl-label">
      θ₁₂ (mixing angle)
      <span class="nsv-ctrl-val" id="nsv-theta-val">33.68°</span>
    </div>
    <input type="range" min="0" max="45" step="0.1" value="33.68" id="nsv-theta" oninput="nsvUpdate()">
  </div>
  <div class="nsv-ctrl">
    <div class="nsv-ctrl-label">
      Δm²₂₁ (×10⁻⁵ eV²)
      <span class="nsv-ctrl-val" id="nsv-dm2-val">7.49</span>
    </div>
    <input type="range" min="4" max="12" step="0.01" value="7.49" id="nsv-dm2" oninput="nsvUpdate()">
  </div>
</div>

<canvas id="nsv-canvas" height="230"></canvas>

<div class="nsv-legend">
  <div class="nsv-leg"><div class="nsv-leg-line" style="background:#832434;"></div><span>P(νe → νe) survival</span></div>
  <div class="nsv-leg"><div class="nsv-leg-line" style="background:#C9A84C;"></div><span>P(νe → νx) oscillation</span></div>
  <div class="nsv-leg"><div class="nsv-leg-line" style="background:rgba(50,140,50,0.6); height:1px; width:22px;"></div><span>Sun–Earth distance (1 AU)</span></div>
</div>

<div class="nsv-stats">
  <div class="nsv-stat">
    <p class="nsv-stat-label">P(νe→νe) at Earth</p>
    <p class="nsv-stat-val" id="nsv-p-ee">—</p>
  </div>
  <div class="nsv-stat">
    <p class="nsv-stat-label">P(νe→νx) at Earth</p>
    <p class="nsv-stat-val" id="nsv-p-ex">—</p>
  </div>
  <div class="nsv-stat">
    <p class="nsv-stat-label">L_osc (km)</p>
    <p class="nsv-stat-val" id="nsv-losc">—</p>
  </div>
  <div class="nsv-stat">
    <p class="nsv-stat-label">oscillations in 1 AU</p>
    <p class="nsv-stat-val" id="nsv-ncycles">—</p>
  </div>
</div>

<p class="nsv-note">
  Parameters from NuFIT 6.0 (2024): θ₁₂ = 33.68°, Δm²₂₁ = 7.49×10⁻⁵ eV² (LMA-MSW solution).
  Sun–Earth distance L = 1.496×10⁸ km (1 AU). Vacuum oscillation approximation shown.
</p>
</div>

<script>
(function() {
  var AU_KM = 1.496e8;

  var neutrinos = {
    pp:  { label: 'pp',  E: 0.267,  color: '#5b8dd9' },
    Be7: { label: '⁷Be', E: 0.862,  color: '#C9A84C' },
    pep: { label: 'pep', E: 1.442,  color: '#9b6fc7' },
    B8:  { label: '⁸B',  E: 8.0,    color: '#e07b54' },
    hep: { label: 'hep', E: 18.0,   color: '#4db87a'  }
  };

  var currentType = 'pp';

  window.nsvSetType = function(t) {
    currentType = t;
    Object.keys(neutrinos).forEach(function(k) {
      document.getElementById('nsv-t-'+k).classList.toggle('active', k===t);
    });
    nsvUpdate();
  };

  window.nsvReset = function() {
    document.getElementById('nsv-theta').value = 33.68;
    document.getElementById('nsv-dm2').value   = 7.49;
    nsvUpdate();
  };

  function pSurv(L_km, theta_rad, dm2_eV2, E_MeV) {
    var arg = 1.267 * dm2_eV2 * L_km / E_MeV;
    return 1 - Math.pow(Math.sin(2 * theta_rad), 2) * Math.pow(Math.sin(arg), 2);
  }

  window.nsvUpdate = function() {
    var theta = parseFloat(document.getElementById('nsv-theta').value);
    var dm2   = parseFloat(document.getElementById('nsv-dm2').value) * 1e-5;
    var E     = neutrinos[currentType].E;
    var theta_rad = theta * Math.PI / 180;

    document.getElementById('nsv-theta-val').textContent = theta.toFixed(2) + '°';
    document.getElementById('nsv-dm2-val').textContent   = (dm2/1e-5).toFixed(2);

    var canvas = document.getElementById('nsv-canvas');
    var W = canvas.offsetWidth || 680;
    var dpr = window.devicePixelRatio || 1;
    canvas.width  = W * dpr;
    canvas.height = 230 * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    var w = W, h = 230;
    var pad = { l:44, r:16, t:14, b:30 };
    var pw = w - pad.l - pad.r;
    var ph = h - pad.t - pad.b;

    var Lmax = AU_KM * 1.6;

    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var gridC  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    var textC  = isDark ? 'rgba(255,255,255,0.36)' : 'rgba(0,0,0,0.36)';

    ctx.clearRect(0, 0, w, h);

    // grid lines
    for (var i = 0; i <= 4; i++) {
      var gy = pad.t + ph * (1 - i/4);
      ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(pad.l+pw, gy);
      ctx.strokeStyle = gridC; ctx.lineWidth = 0.5; ctx.stroke();
      ctx.fillStyle = textC; ctx.font = '10px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText((i/4).toFixed(2), pad.l-5, gy+3);
    }

    // x-axis labels in AU
    for (var j = 0; j <= 4; j++) {
      var gx = pad.l + pw * j / 4;
      var auVal = (Lmax * j / 4 / AU_KM).toFixed(2);
      ctx.fillStyle = textC; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(auVal + ' AU', gx, h - 7);
    }

    // survival curve
    ctx.beginPath();
    ctx.strokeStyle = '#832434'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
    for (var k = 0; k <= pw; k++) {
      var L = (k/pw) * Lmax;
      var val = pSurv(L, theta_rad, dm2, E);
      var cx = pad.l + k;
      var cy = pad.t + ph * (1 - val);
      k === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // oscillation curve
    ctx.beginPath();
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 1.8; ctx.lineJoin = 'round';
    for (var k2 = 0; k2 <= pw; k2++) {
      var L2 = (k2/pw) * Lmax;
      var val2 = 1 - pSurv(L2, theta_rad, dm2, E);
      var cx2 = pad.l + k2;
      var cy2 = pad.t + ph * (1 - val2);
      k2 === 0 ? ctx.moveTo(cx2, cy2) : ctx.lineTo(cx2, cy2);
    }
    ctx.stroke();

    // 1 AU marker
    var auX = pad.l + (AU_KM / Lmax) * pw;
    ctx.beginPath(); ctx.moveTo(auX, pad.t); ctx.lineTo(auX, pad.t+ph);
    ctx.strokeStyle = 'rgba(50,140,50,0.65)'; ctx.lineWidth = 1.5;
    ctx.setLineDash([5,3]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(50,140,50,0.7)'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Earth (1 AU)', auX, pad.t - 2);

    // dot at Earth
    var survAtEarth = pSurv(AU_KM, theta_rad, dm2, E);
    var dotY = pad.t + ph * (1 - survAtEarth);
    ctx.beginPath(); ctx.arc(auX, dotY, 4, 0, 2*Math.PI);
    ctx.fillStyle = '#832434'; ctx.fill();

    // stats
    var Losc = E / (1.267 * dm2);
    var nCycles = AU_KM / Losc;
    document.getElementById('nsv-p-ee').textContent    = survAtEarth.toFixed(4);
    document.getElementById('nsv-p-ex').textContent    = (1-survAtEarth).toFixed(4);
    document.getElementById('nsv-losc').textContent    = Losc >= 1e6
      ? (Losc/1e6).toFixed(1)+'M'
      : Math.round(Losc).toLocaleString();
    document.getElementById('nsv-ncycles').textContent = nCycles >= 1000
      ? (nCycles/1000).toFixed(1)+'k'
      : nCycles.toFixed(1);
  };

  nsvUpdate();
  window.addEventListener('resize', nsvUpdate);
})();
</script>

<footer>
  <div class="tags">
    <a class="tag" href="/tags#python">#python</a>
    <a class="tag" href="/tags#LaTeX">#physics</a>
  </div>
</footer>
