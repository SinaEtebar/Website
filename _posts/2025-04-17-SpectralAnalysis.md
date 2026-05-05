---
layout: post
title: "Spectral Analysis: From Periodograms to Welch's Method"
feature-img: "assets/img/SNF/head.png"
tags: [physics, data-analysis, signal-processing]
---

<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

<style>
/* ── shared tab/code styles ─────────────────────────────── */
.sa-wrap{margin:2em 0;font-family:inherit}
.sa-tabs{display:flex;gap:0;border-bottom:1.5px solid var(--border-color)}
.sa-tab{padding:8px 20px;font-size:13px;cursor:pointer;border:1.5px solid transparent;border-bottom:none;background:transparent;color:var(--text-color);opacity:.55;border-radius:6px 6px 0 0;transition:all .15s;font-family:inherit}
.sa-tab.active{opacity:1;font-weight:500;border-color:var(--border-color);border-bottom-color:var(--bg-color,#fafafa);background:var(--bg-color,#fafafa);color:var(--link-color)}
.sa-panel{display:none;border:1.5px solid var(--border-color);border-top:none;border-radius:0 0 8px 8px}
.sa-panel.active{display:block}
.sa-code-wrap{position:relative}
.sa-copy{position:absolute;top:10px;right:20px;font-size:11px;padding:4px 10px;border-radius:5px;border:1px solid var(--border-color);background:var(--bg-color,#fafafa);color:var(--text-color);cursor:pointer;opacity:.7;transition:opacity .15s;z-index:2}
.sa-copy:hover{opacity:1}
.sa-panel pre{margin:0;padding:16px;border-radius:0 0 8px 8px;max-height:440px;overflow:auto;scrollbar-color:rgba(128,128,128,.4) var(--bg-color,#fafafa);scrollbar-width:thin}
.sa-panel pre::-webkit-scrollbar{width:8px;height:8px}
.sa-panel pre::-webkit-scrollbar-track{background:var(--bg-color,#fafafa)}
.sa-panel pre::-webkit-scrollbar-thumb{background:rgba(128,128,128,.4);border-radius:4px}
.sa-panel code{font-size:12px;line-height:1.6}
.sa-plot-inner{padding:16px}
/* ── controls ───────────────────────────────────────────── */
.sa-controls{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.sa-ctrl{background:rgba(128,128,128,.07);border-radius:8px;padding:10px 13px}
.sa-ctrl-label{font-size:11px;opacity:.65;margin:0 0 5px;display:flex;justify-content:space-between}
.sa-ctrl-val{font-weight:600;color:var(--link-color);font-family:monospace}
.sa-ctrl input[type=range]{width:100%;margin:0}
.sa-note{font-size:11px;opacity:.5;margin-top:8px;font-style:italic}
canvas.sa-canvas{width:100%;display:block;border-radius:6px}
@media(max-width:576px){.sa-controls{grid-template-columns:1fr}}
</style>

<script>
function saTab(id, name, btn) {
  ['plot','code'].forEach(function(t){
    document.getElementById(id+'-'+t).classList.toggle('active', t===name);
  });
  btn.parentElement.querySelectorAll('.sa-tab').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
}
function saCopy(btn){
  navigator.clipboard.writeText(btn.parentElement.querySelector('code').innerText).then(function(){
    btn.textContent='✓ copied';
    setTimeout(function(){btn.textContent='copy';},2000);
  });
}
function saRedraw(fn){ setTimeout(fn,30); }
</script>

<p>
When we analyse signals in physics — gravitational waves, neutrino detectors, particle collisions — we almost never have an infinite, perfectly known time series. We have a finite chunk of noisy, random data. The question becomes: how do we reliably extract frequency information from it? The answer lies in <em>spectral estimation</em>.
</p>
<p>
This post covers the key ideas from the Laboratory of Data Analysis course at Sapienza (Prof. Paola Leaci), building up from the basic periodogram to the Welch method — the workhorse of modern PSD estimation. Each section includes an interactive plot and the equivalent Python code.
</p>

<hr>

<h2>1 — Why spectral <em>estimation</em>, not calculation?</h2>

<p>
The <strong>power spectrum</strong> \(S(\Omega)\) is a theoretical quantity defined over an infinitely long, continuous signal. What we compute from a finite dataset is its <em>estimate</em> — the <strong>periodogram</strong> \(\hat{S}(\Omega)\).
</p>
<p>
Because our signals are <strong>random</strong>, not deterministic, we need a statistical framework. In the time domain we characterise random signals via the <strong>autocorrelation function</strong>; its Fourier transform gives the PSD:
</p>

$$S(\Omega) = \mathcal{F}\{R_{xx}(\tau)\}$$

<p>Two broad families of methods exist:</p>
<ul>
  <li><strong>Non-parametric</strong> (Periodogram, Bartlett, Welch): minimal assumptions, used when signal structure is unknown.</li>
  <li><strong>Parametric</strong> (AR, MA, ARMA): assume a generative model — more accurate when the model matches, e.g. acoustic signals.</li>
</ul>

<hr>

<h2>2 — The Periodogram</h2>

<p>Given \(N\) samples \(\{x_1,\ldots,x_N\}\), compute the Discrete Fourier Transform:</p>

$$X(\Omega) = \sum_{i=1}^{N} x_i\,e^{-j(i-1)\Omega}, \qquad \Omega = \omega\Delta t$$

<p>The periodogram estimate is:</p>

$$ \boxed{\hat{S}(\Omega) = \frac{|X(\Omega)|^2}{N}} $$

<hr>

<h2>3 — Spectral Resolution</h2>

<p>
The minimum resolvable frequency separation depends only on the <em>length of data</em>, not on zero-padding:
</p>

$$ \Delta f = \frac{f_s}{N} = \frac{1}{T_{\text{obs}}} $$

<p>Zero-padding increases DFT length \(L\) and interpolates between bins — it improves appearance but not true resolution. To actually resolve two frequencies, we need more <em>data</em>.</p>

<!-- ── SECTION 3: INTERACTIVE + CODE ─────────────────────────── -->
<div class="sa-wrap">
<div class="sa-tabs">
  <button class="sa-tab active" onclick="saTab('res','plot',this)">📈 Interactive</button>
  <button class="sa-tab"        onclick="saTab('res','code',this)">🐍 Python code</button>
</div>
<div class="sa-panel active" id="res-plot">
  <div class="sa-plot-inner">
    <div class="sa-controls">
      <div class="sa-ctrl">
        <div class="sa-ctrl-label">N (number of samples) <span class="sa-ctrl-val" id="res-N-val">64</span></div>
        <input type="range" min="16" max="512" step="16" value="64" id="res-N" oninput="drawRes()">
      </div>
      <div class="sa-ctrl">
        <div class="sa-ctrl-label">df (freq. separation) <span class="sa-ctrl-val" id="res-df-val">0.050</span></div>
        <input type="range" min="0.005" max="0.15" step="0.005" value="0.05" id="res-df" oninput="drawRes()">
      </div>
    </div>
    <canvas class="sa-canvas" id="res-canvas" height="220"></canvas>
    <p class="sa-note">Signal: x(n) = sin(2π·0.12·n) + cos(2π·(0.12+df)·n). Green dashed line = Δf=1/N. When df &lt; Δf the two peaks merge.</p>
  </div>
</div>
<div class="sa-panel" id="res-code">
  <div class="sa-code-wrap">
    <button class="sa-copy" onclick="saCopy(this)">copy</button>
<pre><code class="language-python">import numpy as np
import matplotlib.pyplot as plt

# ── parameters ────────────────────────────────────────────────────
N  = 64       # try 16, 64, 256 ...
df = 0.05     # frequency separation between the two components

# ── signal ────────────────────────────────────────────────────────
n  = np.arange(N)
x  = np.sin(2*np.pi*0.12*n) + np.cos(2*np.pi*(0.12 + df)*n)

# ── periodogram (zero-padded for display) ─────────────────────────
L    = N * 4
xdft = np.fft.fft(x, L)
psd  = np.abs(xdft[:L//2])**2 / N
freq = np.arange(L//2) / L

delta_f = 1.0 / N   # true resolution limit

# ── plot ──────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(9, 4))
ax.plot(freq, psd / psd.max(), linewidth=1.5, label='Periodogram')
ax.axvline(delta_f, color='green', linestyle='--', label=f'Δf = 1/N = {delta_f:.3f}')
ax.set_xlabel('Normalised frequency (cycles/sample)')
ax.set_ylabel('Normalised PSD')
ax.set_title(f'Spectral Resolution — N={N}, df={df}')
ax.legend()
ax.grid(True, linestyle='--', linewidth=0.4, alpha=0.5)
plt.tight_layout()
plt.show()

# When df < delta_f, the two peaks are indistinguishable.
# Increase N (more data) to improve actual resolution.
</code></pre>
  </div>
</div>
</div>

<script>
(function(){
  function drawRes(){
    var N=parseInt(document.getElementById('res-N').value);
    var df=parseFloat(document.getElementById('res-df').value);
    document.getElementById('res-N-val').textContent=N;
    document.getElementById('res-df-val').textContent=df.toFixed(3);
    var canvas=document.getElementById('res-canvas');
    var W=canvas.offsetWidth||680,dpr=window.devicePixelRatio||1;
    var H=Math.min(Math.round(W*0.36),230);
    canvas.width=W*dpr;canvas.height=H*dpr;
    var ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
    var w=W,h=H,pad={l:44,r:12,t:14,b:30};
    var pw=w-pad.l-pad.r,ph=h-pad.t-pad.b;
    var isDark=document.documentElement.getAttribute('data-theme')==='dark';
    var bgC=isDark?'#111214':'#fafafa',gridC=isDark?'rgba(255,255,255,.06)':'rgba(0,0,0,.06)';
    var textC=isDark?'rgba(255,255,255,.5)':'rgba(0,0,0,.5)',lineC=isDark?'#C9A84C':'#832434';
    ctx.fillStyle=bgC;ctx.fillRect(0,0,w,h);
    var L=N*4,re=new Array(L).fill(0),im=new Array(L).fill(0);
    for(var k=0;k<L/2;k++){var r=0,i2=0;
      for(var n=0;n<N;n++){var xn=Math.sin(2*Math.PI*0.12*n)+Math.cos(2*Math.PI*(0.12+df)*n);
        var a=2*Math.PI*k*n/L;r+=xn*Math.cos(a);i2-=xn*Math.sin(a);}
      re[k]=r;im[k]=i2;}
    var psd=[],mx=0;
    for(var k2=0;k2<L/2;k2++){var v=(re[k2]*re[k2]+im[k2]*im[k2])/N;psd.push(v);if(v>mx)mx=v;}
    for(var yi=0;yi<=4;yi++){var gy=pad.t+ph*(1-yi/4);
      ctx.beginPath();ctx.moveTo(pad.l,gy);ctx.lineTo(pad.l+pw,gy);
      ctx.strokeStyle=gridC;ctx.lineWidth=.5;ctx.stroke();
      ctx.fillStyle=textC;ctx.font='10px sans-serif';ctx.textAlign='right';
      ctx.fillText((yi/4).toFixed(2),pad.l-4,gy+3);}
    [0,0.1,0.2,0.3,0.4,0.5].forEach(function(fv){
      var gx=pad.l+pw*(fv/0.5);
      ctx.fillStyle=textC;ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText(fv.toFixed(1),gx,h-7);});
    var deltaF=1/N,dlx=pad.l+pw*(deltaF/0.5);
    ctx.beginPath();ctx.moveTo(dlx,pad.t);ctx.lineTo(dlx,pad.t+ph);
    ctx.strokeStyle='rgba(80,160,80,.7)';ctx.lineWidth=1;ctx.setLineDash([4,3]);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(80,160,80,.8)';ctx.font='10px sans-serif';ctx.textAlign='left';
    ctx.fillText('Δf=1/N',dlx+3,pad.t+10);
    ctx.beginPath();ctx.strokeStyle=lineC;ctx.lineWidth=1.8;ctx.lineJoin='round';
    for(var ki=0;ki<L/2;ki++){var fx=ki/L;if(fx>0.5)break;
      var cx=pad.l+pw*(fx/0.5),cy=pad.t+ph*(1-psd[ki]/mx);
      ki===0?ctx.moveTo(cx,cy):ctx.lineTo(cx,cy);}
    ctx.stroke();
    ctx.fillStyle=isDark?'#C9A84C':'#832434';ctx.font='bold 12px serif';ctx.textAlign='center';
    ctx.fillText('Normalised frequency',pad.l+pw/2,h-1);
  }
  window.drawRes=drawRes;drawRes();
  window.addEventListener('resize',drawRes);
  if(typeof MutationObserver!=='undefined')
    new MutationObserver(function(){setTimeout(drawRes,30);}).observe(document.documentElement,{attributes:true});
})();
</script>

<hr>

<h2>4 — Windowing and Spectral Leakage</h2>

<p>
Any finite measurement multiplies the signal by a <strong>rectangular window</strong>. Multiplication in time = convolution in frequency, so the true spectrum is convolved with the window's Fourier transform — causing <strong>spectral leakage</strong>: energy bleeds into neighbouring bins.
</p>

<p>The windowed periodogram becomes:</p>

$$ \hat{S}(\Omega) = \frac{\left|\sum_{i=1}^{N} w_i\,x_i\,e^{-j(i-1)\Omega}\right|^2}{\sum_{i=1}^{N}|w_i|^2} $$

<p>Three common windows:</p>
<ul>
  <li><strong>Rectangular</strong>: \(w_i = 1\) — narrowest main lobe (best resolution), largest side lobes (worst leakage).</li>
  <li><strong>Von Hann (Hanning)</strong>: \(w_i = \frac{1+\cos(2\pi(i-N/2)/N)}{2}\) — excellent side-lobe suppression, slightly wider main lobe.</li>
  <li><strong>Bartlett (Triangular)</strong>: linear taper — slightly narrower main lobe than Hanning but wider side lobes.</li>
</ul>

<!-- ── SECTION 4: INTERACTIVE + CODE ─────────────────────────── -->
<div class="sa-wrap">
<div class="sa-tabs">
  <button class="sa-tab active" onclick="saTab('win','plot',this)">📈 Interactive</button>
  <button class="sa-tab"        onclick="saTab('win','code',this)">🐍 Python code</button>
</div>
<div class="sa-panel active" id="win-plot">
  <div class="sa-plot-inner">
    <div class="sa-controls" style="grid-template-columns:1fr;">
      <div class="sa-ctrl">
        <div class="sa-ctrl-label">N (window length) <span class="sa-ctrl-val" id="win-N-val">128</span></div>
        <input type="range" min="32" max="512" step="32" value="128" id="win-N" oninput="drawWin()">
      </div>
    </div>
    <canvas class="sa-canvas" id="win-canvas" height="220"></canvas>
    <p class="sa-note">Magnitude (dB) of the three window transforms. Narrower main lobe = better resolution. Lower side lobes = less leakage. Always a tradeoff.</p>
  </div>
</div>
<div class="sa-panel" id="win-code">
  <div class="sa-code-wrap">
    <button class="sa-copy" onclick="saCopy(this)">copy</button>
<pre><code class="language-python">import numpy as np
import matplotlib.pyplot as plt

# ── signal parameters (from WindowingExa.m) ───────────────────────
N   = 100          # number of samples
fs  = 8            # sampling frequency (Hz)
fr  = 0.1          # signal frequency (Hz)
ts  = 1.0 / fs
t   = np.arange(N) * ts
x1  = np.sin(2 * np.pi * fr * t)

# ── FFT parameters ────────────────────────────────────────────────
nfft = 1024        # zero-padded DFT length

xdft = np.fft.fft(x1, nfft)

# ── windows ───────────────────────────────────────────────────────
windows = {
    'Rectangular': np.ones(N),
    'Hanning':     np.hanning(N),
    'Triangular':  np.bartlett(N),   # Bartlett = triangular in scipy
}

def windowed_spectrum_db(x_dft, window, nfft):
    """Circular convolution via FFT, result in dB (equivalent to MATLAB cconv + db)."""
    w_dft  = np.fft.fft(window, nfft)
    conv   = np.fft.ifft(x_dft * w_dft) * nfft   # circular convolution
    return 20 * np.log10(np.abs(conv / nfft) + 1e-12)

# ── one-sided frequency axis [0, fs/2] ───────────────────────────
dfr  = 1.0 / (nfft * ts)
frs  = np.arange(nfft) * dfr
sel  = slice(0, nfft // 2 + 1)   # EVEN nfft
frsR = frs[sel]

# ── plot: frequency domain comparison ────────────────────────────
colors = {'Rectangular':'#378ADD', 'Hanning':'#832434', 'Triangular':'#C9A84C'}
fig, ax = plt.subplots(figsize=(9, 5))
for name, win in windows.items():
    spec = windowed_spectrum_db(xdft, win, nfft)[sel]
    ax.plot(frsR, spec, linewidth=2, label=name, color=colors[name])
ax.set_xlabel('Frequency (Hz)')
ax.set_ylabel('Magnitude (dB)')
ax.set_title('Windowed spectrum — Rectangular vs Hanning vs Triangular')
ax.legend()
ax.grid(True, linestyle='--', linewidth=0.4, alpha=0.5)
ax.set_xlim([0, fs/2])
plt.tight_layout()
plt.show()

# ── plot: windowed signals in time domain (equiv. to wvtool) ─────
fig, axes = plt.subplots(3, 1, figsize=(9, 7), sharex=True)
for ax2, (name, win), color in zip(axes, windows.items(), colors.values()):
    ax2.plot(t, x1 * win, color=color, linewidth=1.5)
    ax2.set_ylabel(name)
    ax2.grid(True, linestyle='--', linewidth=0.4, alpha=0.4)
axes[-1].set_xlabel('Time (s)')
fig.suptitle('Windowed signals in time domain')
plt.tight_layout()
plt.show()
</code></pre>
  </div>
</div>
</div>

<script>
(function(){
  function drawWin(){
    var N=parseInt(document.getElementById('win-N').value);
    document.getElementById('win-N-val').textContent=N;
    var canvas=document.getElementById('win-canvas');
    var W=canvas.offsetWidth||680,dpr=window.devicePixelRatio||1;
    var H=Math.min(Math.round(W*0.36),230);
    canvas.width=W*dpr;canvas.height=H*dpr;
    var ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
    var w=W,h=H,pad={l:44,r:12,t:14,b:30};
    var pw=w-pad.l-pad.r,ph=h-pad.t-pad.b;
    var isDark=document.documentElement.getAttribute('data-theme')==='dark';
    var bgC=isDark?'#111214':'#fafafa',gridC=isDark?'rgba(255,255,255,.06)':'rgba(0,0,0,.06)';
    var textC=isDark?'rgba(255,255,255,.5)':'rgba(0,0,0,.5)';
    ctx.fillStyle=bgC;ctx.fillRect(0,0,w,h);
    function makeWin(type){var a=[];for(var i=0;i<N;i++){
      if(type==='rect')a.push(1);
      else if(type==='hann')a.push(0.5*(1-Math.cos(2*Math.PI*i/(N-1))));
      else a.push(i<N/2?2*i/N:2-2*i/N);}return a;}
    function winMag(win){var L=1024,mags=[];
      for(var k=0;k<L/2;k++){var re=0,im=0;
        for(var n=0;n<win.length;n++){var a=2*Math.PI*k*n/L;re+=win[n]*Math.cos(a);im-=win[n]*Math.sin(a);}
        mags.push(Math.sqrt(re*re+im*im));}
      var mx=Math.max.apply(null,mags);
      return mags.map(function(v){return 20*Math.log10(v/mx+1e-12);});}
    var wins={rect:{mag:winMag(makeWin('rect')),color:'#378ADD',label:'Rectangular'},
              hann:{mag:winMag(makeWin('hann')),color:'#832434',label:'Hanning'},
              bart:{mag:winMag(makeWin('bart')),color:'#C9A84C',label:'Triangular'}};
    var YMIN=-80,YMAX=5;
    function ly(db){return pad.t+ph*(1-(db-YMIN)/(YMAX-YMIN));}
    function lx2(f){return pad.l+pw*(f/0.5);}
    [-60,-40,-20,0].forEach(function(db){var gy=ly(db);
      ctx.beginPath();ctx.moveTo(pad.l,gy);ctx.lineTo(pad.l+pw,gy);
      ctx.strokeStyle=gridC;ctx.lineWidth=.5;ctx.stroke();
      ctx.fillStyle=textC;ctx.font='10px sans-serif';ctx.textAlign='right';
      ctx.fillText(db+'dB',pad.l-4,gy+3);});
    [0,0.1,0.2,0.3,0.4,0.5].forEach(function(fv){
      ctx.fillStyle=textC;ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText(fv.toFixed(1),lx2(fv),h-7);});
    Object.keys(wins).forEach(function(k){var wd=wins[k];
      ctx.beginPath();ctx.strokeStyle=wd.color;ctx.lineWidth=1.8;ctx.lineJoin='round';
      wd.mag.forEach(function(db,i){var fx=i/1024;if(fx>0.5)return;
        var cx=lx2(fx),cy=ly(Math.max(db,YMIN));
        i===0?ctx.moveTo(cx,cy):ctx.lineTo(cx,cy);});ctx.stroke();});
    var lx3=pad.l+8,ly3=pad.t+8;
    Object.keys(wins).forEach(function(k,i){
      ctx.fillStyle=wins[k].color;ctx.fillRect(lx3,ly3+i*16,14,3);
      ctx.fillStyle=textC;ctx.font='11px sans-serif';ctx.textAlign='left';
      ctx.fillText(wins[k].label,lx3+18,ly3+i*16+4);});}
  window.drawWin=drawWin;drawWin();
  window.addEventListener('resize',drawWin);
  if(typeof MutationObserver!=='undefined')
    new MutationObserver(function(){setTimeout(drawWin,30);}).observe(document.documentElement,{attributes:true});
})();
</script>

<hr>

<h2>5 — Spectral Estimate Uncertainty</h2>

<p>
The raw periodogram has a fundamental problem: its <strong>variance does not decrease</strong> as \(N\) increases. Adding more data improves frequency resolution, but each bin remains exponentially distributed with standard deviation equal to its mean — regardless of \(N\).
</p>
<p>
For white noise with \(S(\Omega)=1\), the periodogram values follow an exponential distribution with mean 1. Increasing \(N\) just stretches the Fourier-transformed vector — it does not give us independent repeated measurements.
</p>

<hr>

<h2>6 — Bartlett and Welch: Averaging to Reduce Variance</h2>

<p>
The solution: <strong>average \(M\) independent periodograms</strong>. The standard deviation reduces by \(\sqrt{M}\) and the distribution becomes a normalised \(\chi^2\) with \(2M\) degrees of freedom.
</p>

<p><strong>Bartlett's method:</strong> split \(N\) samples into \(K\) non-overlapping rectangular windows of \(M=N/K\) samples each, compute and average their periodograms. Resolution worsens by \(K\), variance reduces by \(K\).</p>

$$ \Delta f_{\text{Bartlett}} = \frac{f_s}{M} = K\cdot\Delta f_{\text{full}} $$

<p><strong>Welch's method:</strong> same as Bartlett but with 50% overlap and a Hanning window. Averages \(\approx 2K-1\) periodograms — further variance reduction. Slightly wider main lobe but much better leakage control. This is the standard in gravitational-wave data analysis.</p>

<!-- ── SECTION 6: INTERACTIVE + CODE ─────────────────────────── -->
<div class="sa-wrap">
<div class="sa-tabs">
  <button class="sa-tab active" onclick="saTab('avg','plot',this)">📈 Interactive</button>
  <button class="sa-tab"        onclick="saTab('avg','code',this)">🐍 Python code</button>
</div>
<div class="sa-panel active" id="avg-plot">
  <div class="sa-plot-inner">
    <div class="sa-controls">
      <div class="sa-ctrl">
        <div class="sa-ctrl-label">M (segments averaged) <span class="sa-ctrl-val" id="avg-M-val">8</span></div>
        <input type="range" min="1" max="32" step="1" value="8" id="avg-M" oninput="drawAvg()">
      </div>
      <div class="sa-ctrl">
        <div class="sa-ctrl-label">Method <span class="sa-ctrl-val" id="avg-win-val">Welch (Hann)</span></div>
        <input type="range" min="0" max="1" step="1" value="1" id="avg-win" oninput="drawAvg()">
      </div>
    </div>
    <canvas class="sa-canvas" id="avg-canvas" height="220"></canvas>
    <p class="sa-note">Simulated white noise PSD (true value = 1.0, green dashed). More segments → lower σ. σ shown top-right.</p>
  </div>
</div>
<div class="sa-panel" id="avg-code">
  <div class="sa-code-wrap">
    <button class="sa-copy" onclick="saCopy(this)">copy</button>
<pre><code class="language-python">import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import periodogram, welch

# ── signal (from pwelchMethod.m) ──────────────────────────────────
Fs  = 1000
t   = np.arange(0, 1, 1/Fs)
x   = np.cos(2 * np.pi * 100 * t) + np.random.randn(len(t))
N   = len(x)

# ── periodogram (rectangular window, no averaging) ────────────────
freq, per = periodogram(x, fs=Fs, window='boxcar', nfft=N, scaling='density')
# 'boxcar' = rectangular, equivalent to rectwin(N) in MATLAB

# ── Welch's method ────────────────────────────────────────────────
nfft     = 500
win_len  = 500          # Hamming window by default in scipy (same as MATLAB pwelch)
noverlap = win_len // 2 # 50% overlap — set None for scipy default

f, pxx = welch(x, fs=Fs, window='hamming', nperseg=win_len,
               noverlap=noverlap, nfft=nfft, scaling='density')

# Number of averaged segments (with 50% overlap):
# n_segments ≈ 2 * (N / win_len) - 1 = 2*2-1 = 3

# ── comparison plot (dB) ──────────────────────────────────────────
fig, ax = plt.subplots(figsize=(9, 5))
ax.plot(freq, 10*np.log10(per), linewidth=1.5, label='Periodogram (no avg)',  color='#378ADD')
ax.plot(f,    10*np.log10(pxx), linewidth=2,   label='Welch (50% overlap)',   color='#832434')
ax.set_xlabel('Frequency (Hz)')
ax.set_ylabel('PSD (dB/Hz)')
ax.set_title('Periodogram vs Welch — variance comparison')
ax.legend()
ax.grid(True, linestyle='--', linewidth=0.4, alpha=0.5)
plt.tight_layout()
plt.show()

# ── variance comparison ───────────────────────────────────────────
print(f"var(periodogram) = {np.var(per):.6f}")
print(f"var(welch)       = {np.var(pxx):.6f}")
print(f"variance ratio   = {np.var(per)/np.var(pxx):.1f}x")
# Expected: var(welch) << var(periodogram)
</code></pre>
  </div>
</div>
</div>

<script>
(function(){
  var seed=42;
  function rand(){seed=(seed*1664525+1013904223)&0xffffffff;return(seed>>>0)/0xffffffff;}
  function randn(){var u=rand()||1e-10,v=rand()||1e-10;return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
  function drawAvg(){
    var M=parseInt(document.getElementById('avg-M').value);
    var useHann=parseInt(document.getElementById('avg-win').value)===1;
    document.getElementById('avg-M-val').textContent=M;
    document.getElementById('avg-win-val').textContent=useHann?'Welch (Hann)':'Bartlett (Rect)';
    var canvas=document.getElementById('avg-canvas');
    var W=canvas.offsetWidth||680,dpr=window.devicePixelRatio||1;
    var H=Math.min(Math.round(W*0.36),230);
    canvas.width=W*dpr;canvas.height=H*dpr;
    var ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);
    var w=W,h=H,pad={l:44,r:12,t:14,b:30};
    var pw=w-pad.l-pad.r,ph=h-pad.t-pad.b;
    var isDark=document.documentElement.getAttribute('data-theme')==='dark';
    var bgC=isDark?'#111214':'#fafafa',gridC=isDark?'rgba(255,255,255,.06)':'rgba(0,0,0,.06)';
    var textC=isDark?'rgba(255,255,255,.5)':'rgba(0,0,0,.5)';
    var lineC=isDark?'#C9A84C':'#832434',trueC='rgba(80,160,80,.7)';
    ctx.fillStyle=bgC;ctx.fillRect(0,0,w,h);
    var segLen=256,totalN=M*segLen;seed=42;
    var noise=[];for(var i=0;i<totalN;i++)noise.push(randn());
    var L=segLen,psdAvg=new Array(L/2).fill(0);
    for(var m=0;m<M;m++){var offset=m*segLen;
      for(var k=0;k<L/2;k++){var re=0,im=0,ws=0;
        for(var n=0;n<L;n++){var wi=useHann?0.5*(1-Math.cos(2*Math.PI*n/(L-1))):1;
          var an=2*Math.PI*k*n/L;re+=wi*noise[offset+n]*Math.cos(an);im-=wi*noise[offset+n]*Math.sin(an);ws+=wi*wi;}
        psdAvg[k]+=(re*re+im*im)/ws;}}
    for(var k2=0;k2<L/2;k2++)psdAvg[k2]/=M;
    var YMAX=3.5;
    function lx4(f){return pad.l+pw*(f/0.5);}
    function ly4(v){return pad.t+ph*(1-v/YMAX);}
    [0,0.5,1,1.5,2,2.5,3].forEach(function(v){var gy=ly4(v);
      ctx.beginPath();ctx.moveTo(pad.l,gy);ctx.lineTo(pad.l+pw,gy);
      ctx.strokeStyle=gridC;ctx.lineWidth=.5;ctx.stroke();
      ctx.fillStyle=textC;ctx.font='10px sans-serif';ctx.textAlign='right';
      ctx.fillText(v.toFixed(1),pad.l-4,gy+3);});
    [0,0.1,0.2,0.3,0.4,0.5].forEach(function(fv){
      ctx.fillStyle=textC;ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText(fv.toFixed(1),lx4(fv),h-7);});
    ctx.beginPath();ctx.moveTo(pad.l,ly4(1));ctx.lineTo(pad.l+pw,ly4(1));
    ctx.strokeStyle=trueC;ctx.lineWidth=1.5;ctx.setLineDash([6,3]);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle=trueC;ctx.font='11px serif';ctx.textAlign='left';ctx.fillText('true S=1',pad.l+4,ly4(1)-4);
    ctx.beginPath();ctx.strokeStyle=lineC;ctx.lineWidth=1.5;ctx.lineJoin='round';
    psdAvg.forEach(function(v,i){var fx=i/L;if(fx>0.5)return;
      var cx=lx4(fx),cy=ly4(Math.min(v,YMAX));
      i===0?ctx.moveTo(cx,cy):ctx.lineTo(cx,cy);});ctx.stroke();
    var mean=0,std=0;psdAvg.forEach(function(v){mean+=v;});mean/=psdAvg.length;
    psdAvg.forEach(function(v){std+=(v-mean)*(v-mean);});std=Math.sqrt(std/psdAvg.length);
    ctx.fillStyle=lineC;ctx.font='11px serif';ctx.textAlign='right';
    ctx.fillText('σ = '+std.toFixed(3),pad.l+pw-4,pad.t+14);}
  window.drawAvg=drawAvg;drawAvg();
  window.addEventListener('resize',drawAvg);
  if(typeof MutationObserver!=='undefined')
    new MutationObserver(function(){setTimeout(drawAvg,30);}).observe(document.documentElement,{attributes:true});
})();
</script>

<hr>

<h2>7 — Whitening</h2>

<p>
In many physics applications the noise is <em>coloured</em> — it has a strongly frequency-dependent PSD \(S_N(f)\). Before applying a matched filter or searching for weak signals, we apply a <strong>whitening filter</strong> \(G(f) = S_N(f)^{-1/2}\):
</p>

$$ z(t) = y(t)*g(t), \qquad S_{n_g}(f) = S_N(f)|G(f)|^2 = 1 $$

<p>
After whitening the noise floor is flat and standard periodogram methods apply cleanly. This pipeline — estimate PSD → build whitening filter → apply to data → matched filter — underpins LIGO/Virgo gravitational-wave searches. In Python this is done with <code>scipy.signal.lfilter</code> or GWpy's built-in <code>TimeSeries.whiten()</code>.
</p>

<hr>

<h2>Summary</h2>

<table>
<thead><tr><th>Method</th><th>Window</th><th>Overlap</th><th>Resolution</th><th>Variance</th></tr></thead>
<tbody>
<tr><td>Periodogram</td><td>Rectangular</td><td>—</td><td>1/N</td><td>high, constant</td></tr>
<tr><td>Bartlett</td><td>Rectangular ×K</td><td>0%</td><td>K/N</td><td>reduced ×K</td></tr>
<tr><td>Welch</td><td>Hanning ×≈2K</td><td>50%</td><td>slightly worse</td><td>reduced ×2K, less leakage</td></tr>
</tbody>
</table>

<p>
Key takeaways: more averaging always reduces variance, but shorter windows reduce frequency resolution. Hanning windows suppress leakage but widen the main lobe. Welch with Hanning and 50% overlap is the standard choice in physics data analysis.
</p>

<footer>
  <div class="tags">
    <a class="tag" href="/tags#physics">#physics</a>
    <a class="tag" href="/tags#data-analysis">#data-analysis</a>
    <a class="tag" href="/tags#signal-processing">#signal-processing</a>
  </div>
</footer>