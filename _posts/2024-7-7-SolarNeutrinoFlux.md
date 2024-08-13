---
layout: post
title:  Plot Solar Neutrino Flux with Python
feature-img: "assets/img/SNF/header.png"
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
<footer>
  <div class="tags">
    
    <a class="tag" href="/tags#python">#python</a>
    
    <a class="tag" href="/tags#LaTeX">#physics</a>
    
  </div>
</footer>