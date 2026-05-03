---
layout: post
title:  Plot Solar Neutrino Flux with Python
feature-img: "assets/img/SNF/head.png"
---

<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

<p>Solar neutrinos are produced in the core of the Sun via nuclear fusion reactions. Each chain produces neutrinos with a distinct energy spectrum:</p>

<ul>
  <li>pp chain: \(p^+ + p^+ \longrightarrow {}^{2}\text{H} + e^+ + \nu_e\)</li>
  <li>pep chain: \(p^+ + e^- + p^+ \longrightarrow {}^{2}\text{H} + \nu_e\)</li>
  <li>hep chain: \({}^{3}\text{He} + p^+ \longrightarrow {}^{4}\text{He} + e^+ + \nu_e\)</li>
  <li>\({}^{7}\text{Be}\) chain: \({}^{7}\text{Be} + e^- \longrightarrow {}^{7}\text{Li} + \nu_e\)</li>
  <li>\({}^{8}\text{B}\) chain: \({}^{8}\text{B} \longrightarrow {}^{8}\text{Be} + e^+ + \nu_e\)</li>
</ul>

<p>Data from <a href="https://www.sns.ias.edu/~jnb/SNdata/sndata.html">John Bahcall's SNdata archive</a>. Flux normalizations from the BS2021 Standard Solar Model.</p>

<!-- ── TABBED BLOCK ─────────────────────────────────── -->
<div class="snf-wrap">
<style>
.snf-wrap{margin:2em 0}
.snf-tabs{display:flex;gap:0;border-bottom:1.5px solid var(--border-color)}
.snf-tab{padding:8px 20px;font-size:13px;cursor:pointer;border:1.5px solid transparent;border-bottom:none;background:transparent;color:var(--text-color);opacity:.55;border-radius:6px 6px 0 0;transition:all .15s;font-family:inherit}
.snf-tab.active{opacity:1;font-weight:500;border-color:var(--border-color);border-bottom-color:var(--bg-color,#fafafa);background:var(--bg-color,#fafafa);color:var(--link-color)}
.snf-panel{display:none;border:1.5px solid var(--border-color);border-top:none;border-radius:0 0 8px 8px}
.snf-panel.active{display:block}
.snf-code-wrap{position:relative}
.snf-copy{position:absolute;top:10px;right:10px;font-size:11px;padding:4px 10px;border-radius:5px;border:1px solid var(--border-color);background:var(--bg-color,#fafafa);color:var(--text-color);cursor:pointer;opacity:.7;transition:opacity .15s;z-index:2}
.snf-copy:hover{opacity:1}
/* اضافه کردن padding به بخش کدها برای فاصله گرفتن از دیواره داخلی */
.snf-panel pre{margin:0;padding:16px;border-radius:0 0 8px 8px;max-height:440px;overflow:auto;box-sizing:border-box}
.snf-panel code{font-size:12px;line-height:1.6}
/* افزایش فاصله داخلی نمودار برای زیباتر شدن و دوری از دیواره‌ها */
.snf-plot-inner{padding:24px;box-sizing:border-box}
.snf-note{font-size:11px;opacity:.5;margin-top:8px;font-style:italic}
#snf-canvas{width:100%;display:block;border-radius:6px}
</style>

<div class="snf-tabs">
  <button class="snf-tab active" onclick="snfTab('plot')">📈 Plot</button>
  <button class="snf-tab"        onclick="snfTab('code')">🐍 Python code</button>
</div>

<!-- PLOT PANEL -->
<div class="snf-panel active" id="snf-panel-plot">
  <div class="snf-plot-inner">
    <canvas id="snf-canvas"></canvas>
    <p class="snf-note">Interactive reproduction · BS2021 SSM flux normalizations · Lines (⁷Be, pep) in cm⁻²s⁻¹ · Continua in cm⁻²s⁻¹MeV⁻¹</p>
  </div>
</div>

<!-- CODE PANEL -->
<div class="snf-panel" id="snf-panel-code">
  <div class="snf-code-wrap">
    <button class="snf-copy" onclick="snfCopy(this)">copy</button>
<pre><code class="language-python">import numpy as np
import matplotlib.pyplot as plt
import mplhep as hep_style

hep_style.style.use("CMS")

label_font  = dict(family='serif', color='darkred', weight='normal', size=20)
annot_font  = dict(family='serif', color='black',   weight='normal', size=13)
annot_font2 = dict(family='serif', color='#555555', weight='normal', size=12)

# ── total fluxes (BS2021 SSM, cm⁻²s⁻¹) ──────────────────────────
PP_TOTAL  = 5.99e10
N13_TOTAL = 3.07e8
O15_TOTAL = 2.33e8
F17_TOTAL = 5.84e6
B8_TOTAL  = 5.69e6
HEP_TOTAL = 7.93e3
BE7_TOTAL = 4.84e9
PEP_TOTAL = 1.40e8

# ── load spectral data ────────────────────────────────────────────
pp  = np.loadtxt('pp.txt')
n13 = np.loadtxt('n13.dat')
o15 = np.loadtxt('o15.dat')
f17 = np.loadtxt('f17.dat')
b8  = np.loadtxt('b8.txt')
hep = np.loadtxt('hep.dat')

# ── normalize to absolute flux ────────────────────────────────────
pp_flux  = pp[:,1]  * PP_TOTAL
n13_flux = n13[:,1] * N13_TOTAL
o15_flux = o15[:,1] * O15_TOTAL
f17_flux = f17[:,1] * F17_TOTAL
b8_flux  = b8[:,1]  * B8_TOTAL
hep_flux = hep[:,1] * HEP_TOTAL

COLOR_PP  = '#F2C4AE'
COLOR_B8  = '#C5DDB5'
COLOR_HEP = '#C0B6D4'

fig, ax = plt.subplots(figsize=(8, 8), facecolor='#fafafa')
ax.set_facecolor('#fafafa')

# ── filled spectra (layered — B8 and hep start from bottom) ──────
ax.fill_between(pp[:,0],  pp_flux,  where=pp_flux  > 0, color=COLOR_PP,  alpha=0.85, zorder=1)
ax.fill_between(b8[:,0],  b8_flux,  where=b8_flux  > 0, color=COLOR_B8,  alpha=0.80, zorder=2)
ax.fill_between(hep[:,0], hep_flux, where=hep_flux > 0, color=COLOR_HEP, alpha=0.80, zorder=3)

# ── contour lines ─────────────────────────────────────────────────
kw_cont = dict(color='black', linewidth=1.2, zorder=5)
kw_dash = dict(color='black', linewidth=0.9, linestyle=':', zorder=5)

ax.plot(pp[:,0],  pp_flux,  **kw_cont)
ax.plot(n13[:,0], n13_flux, **kw_dash)
ax.plot(o15[:,0], o15_flux, **kw_dash)
ax.plot(f17[:,0], f17_flux, **kw_dash)
ax.plot(b8[:,0],  b8_flux,  **kw_cont)
ax.plot(hep[:,0], hep_flux, **kw_cont)

# ── monochromatic lines: ⁷Be and pep ─────────────────────────────
be7_energies  = [0.3843, 0.8613]
be7_fractions = [0.1050, 0.8950]
be7_fluxes    = [BE7_TOTAL * f for f in be7_fractions]

for E, F in zip(be7_energies, be7_fluxes):
    ax.vlines(E, 1e-2, F, color='black', linewidth=2.5, zorder=6)

ax.vlines(1.442, 1e-2, PEP_TOTAL, color='black', linewidth=2.5, zorder=6)

# ── labels ───────────────────────────────────────────────────────
ax.text(0.225, 5e10, 'pp',        **annot_font)
ax.text(0.118, 5.4e7, r'$^{13}$N', **annot_font2)
ax.text(0.118, 3.5e6, r'$^{15}$O', **annot_font2)
ax.text(0.118, 3.5e5, r'$^{17}$F', **annot_font2)
ax.text(7.5,   7.8e4, r'$^8$B',    **annot_font)
ax.text(10.0,  95,    'hep',       **annot_font)

ax.annotate('', xy=(0.862, 2.5e3), xytext=(0.384, 2.5e3),
            arrowprops=dict(arrowstyle='<->', color='black', lw=1.2))
ax.text(0.50, 5e2, r'$^7$Be', **annot_font)

ax.annotate('pep', xy=(1.442, 1.5e7), xytext=(1.442+0.35, 1.5e7),
            fontsize=13, fontfamily='serif',
            arrowprops=dict(arrowstyle='->', color='black', lw=1.2),
            ha='left', va='center')

# ── axes ─────────────────────────────────────────────────────────
ax.set_xscale('log', base=10)
ax.set_yscale('log', base=10)
ax.set_xlim(0.1, 25)
ax.set_ylim(1e-2, 1e15)

x_ticks = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20]
ax.set_xticks(x_ticks)
ax.set_xticklabels([str(v) for v in x_ticks])
ax.set_yticks([10**i for i in range(0, 16, 2)])

ax.grid(True, which='major', linestyle='--', linewidth=0.4, color='gray', alpha=0.4)
ax.grid(True, which='minor', linestyle=':', linewidth=0.2, color='gray', alpha=0.2)

ax.set_xlabel(r'$E_\nu\ \mathrm{[MeV]}$', fontdict=label_font)
ax.set_ylabel(
    r'Flux at 1 AU $(\mathrm{cm}^{-2}\,\mathrm{s}^{-1}\,\mathrm{MeV}^{-1})$'
    r'[for lines, $\mathrm{cm}^{-2}\,\mathrm{s}^{-1}$]',
    fontdict=label_font
)

plt.savefig('solar_neutrino_flux.pdf', dpi=200, bbox_inches='tight')
plt.savefig('solar_neutrino_flux.png', dpi=200, bbox_inches='tight')
print("Saved.")
</code></pre>
  </div>
</div>
</div>

<script>
function snfTab(name) {
  ['plot','code'].forEach(function(t){
    document.getElementById('snf-panel-'+t).classList.toggle('active',t===name);
  });
  document.querySelectorAll('.snf-tab').forEach(function(b,i){
    b.classList.toggle('active',['plot','code'][i]===name);
  });
}
function snfCopy(btn){
  navigator.clipboard.writeText(btn.parentElement.querySelector('code').innerText).then(function(){
    btn.textContent='✓ copied';
    setTimeout(function(){btn.textContent='copy';},2000);
  });
}
</script>

<!-- ── CANVAS PLOT ─────────────────────────────────────────────── -->
<script>
(function(){
  var SPECS = {
    pp:  {fn:function(e){var em=0.42341;return(e>0&&e<=em)?Math.pow(e,2.75)*Math.pow(em-e,1):0;}, em:0.42341, total:5.98e10, fill:'#F2C4AE', stroke:'#111', lw:1.5, dash:false, z:1},
    // اصلاح تابع B8: شروع در 0.1 MeV به حدود 55 می‌رسد (کمتر از 100)
    b8:  {fn:function(e){var em=16.0;return(e>=0.1&&e<=em)?Math.pow(e,2.25)*Math.pow(em-e,3.0)*Math.exp(-0.2*e):0;}, em:16.0, total:5.46e6,  fill:'#C5DDB5', stroke:'#111', lw:1.5, dash:false, z:2},
    // اصلاح تابع hep: شروع در 0.1 MeV به محدوده 0.01 می‌رسد (بسیار کمتر از 1)
    hep: {fn:function(e){var em=18.778;return(e>=0.1&&e<=em)? Math.pow(e,2.25)*Math.pow(em-e,3.) + 1.2e-4 :0;}, em:18.778, total:7.98e3,  fill:'#C0B6D4', stroke:'#111', lw:1.5, dash:false, z:3},
   n13: {fn:function(e){var em=1.1982;return(e>0&&e<=em)?Math.pow(e,2)*Math.pow(em-e,1):0;}, em:1.1982,  total:2.78e8,  fill:null,     stroke:'#333', lw:1.2, dash:true,  z:4},
    o15: {fn:function(e){var em=1.7317;return(e>0&&e<=em)?Math.pow(e,2)*Math.pow(em-e,1):0;}, em:1.7317,  total:2.05e8,  fill:null,     stroke:'#333', lw:1.2, dash:true,  z:4},
    f17: {fn:function(e){var em=1.7364;return(e>0&&e<=em)?Math.pow(e,2)*Math.pow(em-e,1):0;}, em:1.7364,  total:5.29e6,  fill:null,     stroke:'#333', lw:1.2, dash:true,  z:4}
  };

  Object.keys(SPECS).forEach(function(k){
    var sp=SPECS[k], emin=1e-5, emax=sp.em;
    var steps=2500, sum=0;
    for(var i=0;i<=steps;i++){var e=emin+i*(emax-emin)/steps;sum+=sp.fn(e);}
    sum*=(emax-emin)/steps;
    sp.norm=sum>0?function(fn,s){return function(e){return fn(e)/s;};}(sp.fn,sum):function(){return 0;};
  });

  var BE7=[{E:0.3843,flux:4.84e9*0.105*1.15},{E:0.8613,flux:4.84e9*0.895*1.05}];
  var PEP={E:1.442,flux:1.44e8*1.08};
  var XMIN=0.1, XMAX=20, YMIN=1e-1, YMAX=1e15;
  var N=1000;

  function lx(e,pw,padL){return padL+pw*(Math.log10(e)-Math.log10(XMIN))/(Math.log10(XMAX)-Math.log10(XMIN));}
  function ly(v,ph,padT){var f=(Math.log10(Math.max(v,YMIN))-Math.log10(YMIN))/(Math.log10(YMAX)-Math.log10(YMIN));return padT+ph*(1-f);}

  function draw(){
    var canvas=document.getElementById('snf-canvas');
    if(!canvas)return;
    var W=canvas.offsetWidth||680;
    var H=Math.min(Math.round(W*0.92), 640);
    var dpr=window.devicePixelRatio||1;
    canvas.width=W*dpr; canvas.height=H*dpr;
    var ctx=canvas.getContext('2d');
    ctx.scale(dpr,dpr);
    var w=W,h=H;
    var pad={l:68,r:16,t:18,b:48};
    var pw=w-pad.l-pad.r, ph=h-pad.t-pad.b;

    var bgC='#fafafa';
    var gridC='rgba(0,0,0,0.06)';
    var axC='rgba(0,0,0,0.15)';
    var textC='rgba(0,0,0,0.85)';
    var labelC='#832434';

    ctx.fillStyle=bgC; ctx.fillRect(0,0,w,h);

    ctx.save();
    ctx.rect(pad.l, pad.t, pw, ph);
    ctx.clip();

    var yBase=ly(YMIN,ph,pad.t);

    ['pp','b8','hep'].forEach(function(k){
      var sp=SPECS[k];
      ctx.beginPath();
      ctx.moveTo(lx(XMIN, pw, pad.l), yBase);

      for(var si=0; si<=N; si++){
        var e = Math.pow(10, Math.log10(XMIN) + si*(Math.log10(XMAX)-Math.log10(XMIN))/N);
        var y = sp.norm(e)*sp.total;
        if(e <= sp.em) {
          ctx.lineTo(lx(e, pw, pad.l), y>YMIN ? ly(y, ph, pad.t) : yBase);
        }
      }
      if(sp.em < XMAX) {
        ctx.lineTo(lx(sp.em, pw, pad.l), yBase);
      }
      ctx.lineTo(lx(XMAX, pw, pad.l), yBase);
      ctx.closePath();
      ctx.fillStyle=sp.fill; ctx.globalAlpha=0.88; ctx.fill(); ctx.globalAlpha=1;
    });

    Object.keys(SPECS).forEach(function(k){
      var sp=SPECS[k];
      ctx.beginPath();
      ctx.strokeStyle=sp.stroke; ctx.lineWidth=sp.lw;
      if(sp.dash) ctx.setLineDash([4,3]); else ctx.setLineDash([]);

      var firstPoint = true;
      for(var si=0; si<=N; si++){
        var e = Math.pow(10, Math.log10(XMIN) + si*(Math.log10(XMAX)-Math.log10(XMIN))/N);
        var y = sp.norm(e)*sp.total;
        
        if(e <= sp.em) {
          var cx = lx(e, pw, pad.l);
          var cy = ly(y, ph, pad.t);
          if(firstPoint) { ctx.moveTo(cx, cy); firstPoint = false; }
          else { ctx.lineTo(cx, cy); }
        }
      }
      if(sp.em < XMAX) {
        ctx.lineTo(lx(sp.em, pw, pad.l), yBase);
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.restore();

    ctx.strokeStyle='#111'; ctx.lineWidth=1.2;
    ctx.strokeRect(pad.l, pad.t, pw, ph);

    for(var yi=0; yi<=14; yi+=2){
      var gy=ly(Math.pow(10,yi),ph,pad.t);
      ctx.beginPath(); ctx.moveTo(pad.l,gy); ctx.lineTo(pad.l+pw,gy);
      ctx.strokeStyle=yi%4===0?'rgba(0,0,0,0.15)':gridC; ctx.lineWidth=0.6; ctx.stroke();
      
      ctx.fillStyle=textC; ctx.font='11px sans-serif'; ctx.textAlign='right';
      ctx.fillText('10', pad.l-16, gy+4);
      ctx.font='8px sans-serif'; ctx.fillText(String(yi), pad.l-7, gy-4);
    }

    var xTicks=[0.1,0.2,0.5,1,2,5,10,20];
    xTicks.forEach(function(xv){
      var gx=lx(xv,pw,pad.l);
      ctx.beginPath(); ctx.moveTo(gx,pad.t); ctx.lineTo(gx,pad.t+ph);
      ctx.strokeStyle='rgba(0,0,0,0.12)'; ctx.lineWidth=0.5; ctx.stroke();
      
      ctx.fillStyle=textC; ctx.font='12px sans-serif'; ctx.textAlign='center';
      ctx.fillText(String(xv), gx, h-pad.b+18);
    });

    ctx.fillStyle=labelC; ctx.font='bold 16px serif'; ctx.textAlign='center';
    ctx.fillText('Eν [MeV]', pad.l+pw/2, h-10);

    ctx.save();
    ctx.translate(16, pad.t+ph/2); ctx.rotate(-Math.PI/2);
    ctx.fillStyle=labelC; ctx.font='bold 14px serif'; ctx.textAlign='center';
    ctx.fillText('Flux at 1 AU (cm⁻²s⁻¹MeV⁻¹) [for lines, cm⁻²s⁻¹]', 0, 0);
    ctx.restore();

    BE7.forEach(function(ln){
      var lxv=lx(ln.E,pw,pad.l);
      var lyv=ly(ln.flux,ph,pad.t);
      ctx.beginPath(); ctx.moveTo(lxv,yBase); ctx.lineTo(lxv,lyv);
      ctx.strokeStyle='#111'; ctx.lineWidth=2.5; ctx.stroke();
    });
    var pepX=lx(PEP.E,pw,pad.l), pepY=ly(PEP.flux,ph,pad.t);
    ctx.beginPath(); ctx.moveTo(pepX,yBase); ctx.lineTo(pepX,pepY);
    ctx.strokeStyle='#111'; ctx.lineWidth=2.5; ctx.stroke();

    var be1x=lx(0.3843,pw,pad.l), be2x=lx(0.8613,pw,pad.l);
    var arY=ly(2.5e3,ph,pad.t);
    ctx.beginPath(); ctx.moveTo(be1x+2,arY); ctx.lineTo(be2x-2,arY);
    ctx.strokeStyle='#111'; ctx.lineWidth=1.2; ctx.stroke();
    [[be1x,1],[be2x,-1]].forEach(function(p){
      ctx.beginPath(); ctx.moveTo(p[0]+p[1]*2,arY);
      ctx.lineTo(p[0]+p[1]*8,arY-3.5); ctx.lineTo(p[0]+p[1]*8,arY+3.5);
      ctx.closePath(); ctx.fillStyle='#111'; ctx.fill();
    });
    ctx.fillStyle='#111'; ctx.font='14px serif'; ctx.textAlign='center';
    ctx.fillText('⁷Be', (be1x+be2x)/2, ly(4.5e2,ph,pad.t));

    var pepLX=lx(1.78,pw,pad.l), pepLY=ly(1.5e7,ph,pad.t);
    ctx.beginPath(); ctx.moveTo(pepLX,pepLY); ctx.lineTo(pepX+3,pepLY);
    ctx.strokeStyle='#111'; ctx.lineWidth=1.2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pepX+2,pepLY); ctx.lineTo(pepX+8,pepLY-3.5); ctx.lineTo(pepX+8,pepLY+3.5);
    ctx.closePath(); ctx.fillStyle='#111'; ctx.fill();
    ctx.fillStyle='#111'; ctx.font='13px serif'; ctx.textAlign='left';
    ctx.fillText('pep', pepLX+4, pepLY+4);

    [
      {x:0.24,  y:6.5e10, t:'pp',   big:true},
      {x:7.5,   y:1.2e5,  t:'⁸B',   big:true},
      {x:12.2,  y:1.1e2,  t:'hep',  big:true},
      {x:0.104, y:2.5e7,  t:'¹³N',  big:false},
      {x:0.104, y:2.0e6,  t:'¹⁵O',  big:false},
      {x:0.104, y:2.2e5,  t:'¹⁷F',  big:false}
    ].forEach(function(a){
      ctx.fillStyle='#111';
      ctx.font=(a.big?'bold 15px':'13px')+' serif';
      ctx.textAlign='left';
      ctx.fillText(a.t, lx(a.x,pw,pad.l), ly(a.y,ph,pad.t));
    });
  }

  document.addEventListener('DOMContentLoaded',draw);
  window.addEventListener('resize',draw);
  setTimeout(draw,150);
})();
</script>

---

<h3>Interactive: Solar Neutrino Oscillation</h3>

<p>
By the time these neutrinos reach Earth — 1 AU ≈ 1.496×10⁸ km — quantum mixing causes them to oscillate between flavors.
Parameters from <a href="https://arxiv.org/abs/2410.05380">NuFIT 6.0 (2024)</a>:
\(\theta_{12} = 33.68°\), \(\Delta m^2_{21} = 7.49 \times 10^{-5}\,\text{eV}^2\).
</p>

<div class="nsv-wrap">
<style>
.nsv-wrap{font-family:inherit;margin:1.5em 0}
.nsv-tabs{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}
.nsv-tab{padding:6px 14px;border-radius:20px;border:1px solid var(--border-color);background:transparent;color:var(--text-color);font-size:12px;cursor:pointer;transition:all .15s}
.nsv-tab.active{background:var(--link-color);color:#fff;border-color:var(--link-color);font-weight:500}
.nsv-params{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
.nsv-ctrl{background:rgba(128,128,128,.07);border-radius:8px;padding:10px 13px}
.nsv-ctrl-label{font-size:11px;color:var(--text-color);opacity:.65;margin:0 0 6px;display:flex;justify-content:space-between;align-items:center}
.nsv-ctrl-val{font-weight:600;color:var(--link-color);font-family:monospace;opacity:1;font-size:12px}
.nsv-ctrl input[type=range]{width:100%;margin:0}
.nsv-reset{font-size:11px;padding:4px 10px;border-radius:6px;border:1px solid var(--border-color);background:transparent;color:var(--text-color);cursor:pointer;opacity:.6;float:right;margin-bottom:10px}
.nsv-reset:hover{opacity:1}
#nsv-canvas{width:100%;border-radius:8px;display:block}
.nsv-legend{display:flex;gap:16px;margin-top:8px;flex-wrap:wrap}
.nsv-leg{display:flex;align-items:center;gap:5px;font-size:11px;opacity:.7}
.nsv-leg-line{width:16px;height:3px;border-radius:2px}
.nsv-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px}
.nsv-stat{background:rgba(128,128,128,.07);border-radius:8px;padding:10px 12px;text-align:center}
.nsv-stat-label{font-size:10px;opacity:.55;margin:0 0 3px}
.nsv-stat-val{font-size:16px;font-weight:500;margin:0;font-family:monospace;color:var(--link-color)}
.nsv-note{font-size:11px;opacity:.5;margin-top:10px;font-style:italic}
@media(max-width:576px){.nsv-stats{grid-template-columns:1fr 1fr}.nsv-params{grid-template-columns:1fr}}
</style>

<div class="nsv-tabs">
  <button class="nsv-tab active" onclick="nsvSetType('pp')"  id="nsv-t-pp">pp (0.27 MeV)</button>
  <button class="nsv-tab"       onclick="nsvSetType('Be7')" id="nsv-t-Be7">⁷Be (0.86 MeV)</button>
  <button class="nsv-tab"       onclick="nsvSetType('pep')" id="nsv-t-pep">pep (1.44 MeV)</button>
  <button class="nsv-tab"       onclick="nsvSetType('B8')"  id="nsv-t-B8">⁸B (8 MeV)</button>
  <button class="nsv-tab"       onclick="nsvSetType('hep')" id="nsv-t-hep">hep (18 MeV)</button>
</div>

<button class="nsv-reset" onclick="nsvReset()">↺ reset to NuFIT 6.0</button>

<div class="nsv-params">
  <div class="nsv-ctrl">
    <div class="nsv-ctrl-label">θ₁₂ (mixing angle)<span class="nsv-ctrl-val" id="nsv-theta-val">33.68°</span></div>
    <input type="range" min="0" max="45" step="0.1" value="33.68" id="nsv-theta" oninput="nsvUpdate()">
  </div>
  <div class="nsv-ctrl">
    <div class="nsv-ctrl-label">Δm²₂₁ (×10⁻⁵ eV²)<span class="nsv-ctrl-val" id="nsv-dm2-val">7.49</span></div>
    <input type="range" min="4" max="12" step="0.01" value="7.49" id="nsv-dm2" oninput="nsvUpdate()">
  </div>
</div>

<canvas id="nsv-canvas" height="230"></canvas>

<div class="nsv-legend">
  <div class="nsv-leg"><div class="nsv-leg-line" style="background:#832434"></div><span>P(νe→νe) survival</span></div>
  <div class="nsv-leg"><div class="nsv-leg-line" style="background:#C9A84C"></div><span>P(νe→νx) oscillation</span></div>
  <div class="nsv-leg"><div class="nsv-leg-line" style="background:rgba(50,140,50,.6);height:1px;width:22px"></div><span>Sun–Earth (1 AU)</span></div>
</div>

<div class="nsv-stats">
  <div class="nsv-stat"><p class="nsv-stat-label">P(νe→νe) at Earth</p><p class="nsv-stat-val" id="nsv-p-ee">—</p></div>
  <div class="nsv-stat"><p class="nsv-stat-label">P(νe→νx) at Earth</p><p class="nsv-stat-val" id="nsv-p-ex">—</p></div>
  <div class="nsv-stat"><p class="nsv-stat-label">L_osc (km)</p><p class="nsv-stat-val" id="nsv-losc">—</p></div>
  <div class="nsv-stat"><p class="nsv-stat-label">oscillations in 1 AU</p><p class="nsv-stat-val" id="nsv-ncycles">—</p></div>
</div>
<p class="nsv-note">NuFIT 6.0 (2024) · θ₁₂=33.68°, Δm²₂₁=7.49×10⁻⁵eV² · L=1.496×10⁸ km · vacuum approximation</p>
</div>

<script>
(function(){
  var AU=1.496e8;
  var NU={pp:{E:0.267},Be7:{E:0.862},pep:{E:1.442},B8:{E:8.0},hep:{E:18.0}};
  var cur='pp';
  window.nsvSetType=function(t){
    cur=t;
    Object.keys(NU).forEach(function(k){document.getElementById('nsv-t-'+k).classList.toggle('active',k===t);});
    nsvUpdate();
  };
  window.nsvReset=function(){
    document.getElementById('nsv-theta').value=33.68;
    document.getElementById('nsv-dm2').value=7.49;
    nsvUpdate();
  };
  function pS(L,theta,dm2,E){var a=1.267*dm2*L/E;return 1-Math.pow(Math.sin(2*theta),2)*Math.pow(Math.sin(a),2);}
  window.nsvUpdate=function(){
    var theta=parseFloat(document.getElementById('nsv-theta').value);
    var dm2=parseFloat(document.getElementById('nsv-dm2').value)*1e-5;
    var E=NU[cur].E, tR=theta*Math.PI/180;
    document.getElementById('nsv-theta-val').textContent=theta.toFixed(2)+'°';
    document.getElementById('nsv-dm2-val').textContent=(dm2/1e-5).toFixed(2);
    var canvas=document.getElementById('nsv-canvas');
    var W=canvas.offsetWidth||680, dpr=window.devicePixelRatio||1;
    var H=Math.min(Math.round(W*0.38),260);
    canvas.width=W*dpr;canvas.height=H*dpr;
    var ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
    var w=W,h=H,pad={l:44,r:16,t:14,b:30};
    var pw=w-pad.l-pad.r,ph=h-pad.t-pad.b,Lmax=AU*1.6;
    var isDark=document.documentElement.getAttribute('data-theme')==='dark';
    var gridC=isDark?'rgba(255,255,255,.06)':'rgba(0,0,0,.06)';
    var textC=isDark?'rgba(255,255,255,.36)':'rgba(0,0,0,.36)';
    ctx.clearRect(0,0,w,h);
    for(var i=0;i<=4;i++){var gy=pad.t+ph*(1-i/4);ctx.beginPath();ctx.moveTo(pad.l,gy);ctx.lineTo(pad.l+pw,gy);ctx.strokeStyle=gridC;ctx.lineWidth=.5;ctx.stroke();ctx.fillStyle=textC;ctx.font='10px sans-serif';ctx.textAlign='right';ctx.fillText((i/4).toFixed(2),pad.l-5,gy+3);}
    for(var j=0;j<=4;j++){var gx=pad.l+pw*j/4;ctx.fillStyle=textC;ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText((Lmax*j/4/AU).toFixed(2)+' AU',gx,h-7);}
    function curve(fn,color,lw){ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.lineJoin='round';for(var k=0;k<=pw;k++){var L=k/pw*Lmax,val=fn(L,tR,dm2,E),cx=pad.l+k,cy=pad.t+ph*(1-val);k===0?ctx.moveTo(cx,cy):ctx.lineTo(cx,cy);}ctx.stroke();}
    curve(pS,'#832434',2.5);
    curve(function(L,t,d,e){return 1-pS(L,t,d,e);},'#C9A84C',2);
    var auX=pad.l+(AU/Lmax)*pw;
    ctx.beginPath();ctx.moveTo(auX,pad.t);ctx.lineTo(auX,pad.t+ph);ctx.strokeStyle='rgba(50,140,50,.65)';ctx.lineWidth=1.5;ctx.setLineDash([5,3]);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(50,140,50,.7)';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText('Earth (1 AU)',auX,pad.t-2);
    var sv=pS(AU,tR,dm2,E);
    ctx.beginPath();ctx.arc(auX,pad.t+ph*(1-sv),4,0,2*Math.PI);ctx.fillStyle='#832434';ctx.fill();
    var Losc=E/(1.267*dm2),nCyc=AU/Losc;
    document.getElementById('nsv-p-ee').textContent=sv.toFixed(4);
    document.getElementById('nsv-p-ex').textContent=(1-sv).toFixed(4);
    document.getElementById('nsv-losc').textContent=Losc>=1e6?(Losc/1e6).toFixed(1)+'M':Math.round(Losc).toLocaleString();
    document.getElementById('nsv-ncycles').textContent=nCyc>=1000?(nCyc/1000).toFixed(1)+'k':nCyc.toFixed(1);
  };
  nsvUpdate();
  window.addEventListener('resize',nsvUpdate);
})();
</script>

<footer>
  <div class="tags">
    <a class="tag" href="/tags#python">#python</a>
    <a class="tag" href="/tags#LaTeX">#physics</a>
  </div>
</footer>