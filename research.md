---
layout: default
title: Research Projects
permalink: /research/
---
<div class="content">
    <script src="/assets/js/toggle_audience.js"></script>
<article class="research">
   <header>
     <h1 class="title">Research Projects</h1>
     </header>
<section class="post-content project">
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

<section id="msc-SLYT">
  <h2 class="project-title">SLYT &mdash; Characterisation of a 64-Channel LYSO Scintillator and Suppression of its Intrinsic Background</h2>
  <div class="project-meta">
    <div class="context">Physics Laboratory II &ndash; Fundamental Interactions, MSc at <a href='https://www.uniroma1.it/en'>Sapienza</a></div>
    <div class="time">2026</div>
  </div>
  <div id="buttonContainerSLYT" style="display:none">
    <a id="beginnerButtonSLYT" href="javascript:show_beginner('SLYT');">
        General
        <span class="tooltiptext">Introduction aimed at a more general audience.</span>
    </a>
    <a id="expertButtonSLYT" href="javascript:show_expert('SLYT');">
        Expert
        <span class="tooltiptext">Introduction aimed at an already informed audience.</span>
    </a>
</div>

  <div class="project-description">
    <div id="beginnerTextSLYT" class="beginner" style="display: none">
      <p>A <a href="https://en.wikipedia.org/wiki/Scintillator">scintillator</a> detects <a href="https://en.wikipedia.org/wiki/Gamma_ray">gamma rays</a> by turning them into tiny flashes of light, which a light sensor then converts into an electrical pulse. LYSO is a particularly good scintillating crystal &mdash; it is bright and it reacts in a few billionths of a second &mdash; and the detector we studied is divided into an 8&times;8 grid of 64 channels, so it can also tell roughly <em>where</em> in the crystal a photon landed.</p>
      <p>It has one awkward property, though: the crystal is slightly radioactive itself. About 2.6% of its lutetium is <sup>176</sup>Lu, which decays continuously and produces its own flashes of light, in the same energy range as the signals we are trying to measure. The detector therefore permanently sits in a fog of its own making, and the central problem of this project was finding ways to see through it.</p>
      <p>We began with a simpler, well-behaved sodium-iodide detector as a yardstick, calibrating it against radioactive sources whose energies are known. The cleanest trick came from a sodium-22 source, which emits two photons flying off in exactly opposite directions: by placing the two detectors face to face and recording an event only when both fire at the same instant, the crystal's own radioactivity &mdash; which has no reason to coincide with anything &mdash; is almost entirely rejected, and the signal reappears clearly.</p>
      <p>We then asked whether the same could be done without a second detector, using only the LYSO's own information. Looking at how the light spreads across neighbouring channels turned out to work; using the arrival times of the pulses did not, simply because in about 80% of events only a single channel recorded a time at all, leaving nothing to compare.</p>
    </div>
    <div id="expertTextSLYT" class="expert">
    <p>The apparatus pairs a single-channel NaI(Tl) scintillator on a 9266B PMT with a (Lu<sub>1-x</sub>Y<sub>x</sub>)<sub>2</sub>SiO<sub>5</sub> array optically coupled to a Hamamatsu H8500 flat-panel multianode PMT (49&times;49 mm<sup>2</sup> active area, 8&times;8 anodes), read out through a CAEN NIM and VME chain: N417 discriminator, 2255A dual timer defining the integration gate, N405 logic unit for the coincidence, V792 QDC and V775N TDC, bridged to the DAQ by a V1718. Since the QDC integrates only negative currents, a per-channel pedestal calibration was performed with a random trigger from a pulse generator; the response is flat below I<sub>ped</sub> &asymp; 80 (ADC underflow) and linear above &asymp; 90, fixing the operating point at I<sub>ped</sub> = 100.</p>
    <p>The NaI reference was characterised first: operating at 550 V it gives a linear calibration of 2.52&plusmn;0.01 ADC/keV, with all five photopeaks of <sup>137</sup>Cs, <sup>60</sup>Co and <sup>22</sup>Na individually resolved and a relative resolution falling from &sigma;/E &asymp; 3.3% at 511 keV to &asymp; 2.1% at 1332 keV, consistent with 1/&radic;E scaling. The LYSO detector, at 980 V, calibrates to 2.6&plusmn;0.1 ADC/keV with a markedly worse resolution of &sigma;/E &asymp; 14.8% at 511 keV, as expected from the lower light yield per channel and the intrinsic background; its gain follows an exponential dependence on HV with b = 0.0053&plusmn;0.0001 V<sup>-1</sup>. Summing a 3&times;3 pin cluster centred on the pin with the largest charge proved a reliable estimator of the total event energy, and four distinct bands appear in the Q<sub>central</sub>&ndash;Q<sub>neighbours</sub> plane (slopes m &asymp; 0.36, 1, 2, 3.8), interpreted as interactions occurring at different positions relative to the pin boundaries.</p>
    <p>Three background-suppression strategies were then compared. A hardware back-to-back coincidence between the NaI and LYSO pin 36, refined by an energy window around the NaI 511 keV photopeak, is by far the most effective: it resolves the <sup>22</sup>Na photopeak at 1722&plusmn;6 ADC with no background subtraction required. A topological filter, accepting only events whose (Q<sub>central</sub>, Q<sub>neighbours</sub>) pair falls inside a region selected from the background-subtracted 2D correlation, recovers the peak at 1736&plusmn;11 ADC from the single-trigger spectrum &mdash; consistent within 1&sigma;, but the region has to be chosen by eye and the method needs high-statistics background runs. A TDC timing cut leaves the spectrum essentially unchanged even at a deliberately radical 0.1&sigma; threshold, because roughly 80% of events fire only the trigger channel. Crucially, neither software method can separate a genuine source photon from a <sup>176</sup>Lu photon of the same energy; they reject accidental contamination only.</p>
    </div>
  </div>
  <script>show_expert('SLYT')</script>
  <div class="project-links">
    <a href="/assets/pdf/slyt_lyso_characterisation.pdf">PDF, 7.7 MB</a>
  </div>
  <div class="project-picturegroup">
    <div class="project-picturebox" style="max-width: 600px">
      <img alt="Two-dimensional histogram of the charge in the central LYSO pin against the summed charge in its eight neighbours, showing a dense central region crossed by four straight bands." src="/assets/img/research/slyt_chargesharing.png" width="1200" height="1006" loading="lazy" />
      <div class="project-picturetext">Charge collected by the central LYSO pin against the summed charge of its eight neighbours, over a nine-hour run. The four bands marked in grey correspond to interactions at different positions relative to the pin boundaries &mdash; the more light is shared with the neighbours, the closer to an edge or a corner the photon converted.</div>
    </div>
  </div>
</section>

<section id="msc-Geant4">
  <h2 class="project-title">Geant4 Simulation of the Bragg Peak for 100 MeV Protons in Water</h2>
  <div class="project-meta">
    <div class="context">Detectors and Accelerators in Particle Physics, MSc at <a href='https://www.uniroma1.it/en'>Sapienza</a>, supervised by Prof. Paolo Gauzzi</div>
    <div class="time">2026</div>
  </div>
  <div id="buttonContainerGeant4" style="display:none">
    <a id="beginnerButtonGeant4" href="javascript:show_beginner('Geant4');">
        General
        <span class="tooltiptext">Introduction aimed at a more general audience.</span>
    </a>
    <a id="expertButtonGeant4" href="javascript:show_expert('Geant4');">
        Expert
        <span class="tooltiptext">Introduction aimed at an already informed audience.</span>
    </a>
</div>

  <div class="project-description">
    <div id="beginnerTextGeant4" class="beginner" style="display: none">
      <p>X-rays lose energy steadily as they pass through the body, so treating a deep tumour also means irradiating everything in front of it. Protons behave differently: they deposit most of their energy in the last few millimetres before they stop, in a sharp spike called the <a href="https://en.wikipedia.org/wiki/Bragg_peak">Bragg peak</a>, and the depth at which they stop is set by the energy of the beam. This is what makes <a href="https://en.wikipedia.org/wiki/Proton_therapy">proton therapy</a> possible — the dose can be placed on the tumour while the healthy tissue in front of it is largely spared.</p>
      <p>For this project I simulated a beam of protons entering a block of water, which behaves much like human tissue, using <a href="https://geant4.web.cern.ch/">Geant4</a>, the <a href="https://en.wikipedia.org/wiki/Monte_Carlo_method">Monte Carlo</a> toolkit developed at CERN to model how particles travel through matter. Tracking fifty thousand protons one by one, I reconstructed where their energy is deposited, found that the beam stops after about 7.7 cm — within half a percent of published reference tables — and measured a peak roughly five and a half times higher than the dose at the surface.</p>
      <p>Geant4 offers several competing models of what happens when a proton collides with an atomic nucleus, and a physicist setting up a simulation has to choose one. I repeated the simulation with six of them to find out how much that choice actually matters. It turns out the stopping depth barely moves at all, but the models disagree by around ten percent on how much energy escapes the block as stray neutrons and gamma rays — which is precisely what matters for shielding a treatment room.</p>
    </div>
    <div id="expertTextGeant4" class="expert">
    <p>A monoenergetic 100 MeV proton pencil beam was fired into a homogeneous <code>G4_WATER</code> phantom in Geant4 11.4, with the depth&ndash;dose profile scored in a user stepping action at 0.25 mm and re-binned to 0.5 mm; a 0.1 mm step limit keeps the tracking steps well below the bin width. Each configuration was run with 5&times;10<sup>4</sup> primaries, and the reference configuration was repeated with five independent seeds to establish the run-to-run scatter against which any model differences have to be judged.</p>
    <p>The reconstructed Bragg curve places the peak at 76.75 mm and the practical range at R<sub>80</sub> = 77.53 mm, about 0.4% above the tabulated <a href="https://physics.nist.gov/PhysRefData/Star/Text/PSTAR.html">PSTAR</a> CSDA value of 77.18 mm — a difference consistent with the definitions of the two quantities. The entrance dose of 0.759 MeV/mm agrees with the PSTAR stopping power to about 4%, and the distal fall-off (80% &rarr; 20%) is 1.16 mm, confirming that the electromagnetic energy-loss modelling which fixes the range is sound.</p>
    <p>Six reference hadronic physics lists were then compared, spanning the Binary, Bertini and Liège cascade families, together with a variant swapping in the <code>option4</code> electromagnetic constructor. The range proves essentially insensitive to both choices: R<sub>80</sub> spans only 0.03 mm across all lists, comparable to the 0.009 mm statistical scatter measured from the five seeds. The hadronic model instead shows up in the energy escaping the phantom, which ranges from 2.04 MeV per proton for the Bertini-based lists to 2.30 MeV for the Binary Cascade and QBBC — a ~10% gap that is several standard deviations wide and therefore a genuine systematic difference between the models, not noise. On this basis <code>QGSP_BIC</code> is the appropriate default at this energy, with <code>QGSP_BIC_HP</code> preferable when thermal-neutron transport or activation is of interest.</p>
    </div>
  </div>
  <script>show_expert('Geant4')</script>
  <div class="project-links">
    <a href="/assets/pdf/geant4_bragg_peak.pdf">PDF, 0.5 MB</a>
  </div>
  <div class="project-picturegroup">
    <div class="project-picturebox" style="max-width: 600px">
      <img alt="Simulated depth-dose curve for 100 MeV protons in water: a slowly rising plateau followed by a sharp Bragg peak just before 78 mm, then a steep fall to zero." src="/assets/img/research/braggcurve.png" width="1200" height="856" loading="lazy" />
      <div class="project-picturetext">Simulated depth&ndash;dose distribution (Bragg curve) for 100 MeV protons in water, the mean of five independent runs. The dashed line marks the tabulated NIST CSDA range of 77.18 mm; the &plusmn;1&sigma; band is thinner than the line width on this scale.</div>
    </div>
  </div>
</section>

<section id="bachelor-Physics">
  <h2 class="project-title">The Role of Sterile Neutrinos to Explain Various Anomalies Observed in
Neutrino Oscillation Experiments</h2>
  <div class="project-meta">
    <div class="context">Thesis (BA Sc. in Physics) at <a href='https://english.iut.ac.ir/'>IUT</a></div>
    <div class="time">2021</div>
  </div>
  <div id="buttonContainerBAPhy" style="display:none">
    <a id="beginnerButtonBAPhy" href="javascript:show_beginner('BAPhy');">
        General
        <span class="tooltiptext">Introduction aimed at a more general audience.</span>
    </a>
    <a id="expertButtonBAPhy" href="javascript:show_expert('BAPhy');">
        Expert
        <span class="tooltiptext">Introduction aimed at an already informed audience.</span>
    </a>
</div>
<script>show_expert('BAPhy')</script>

  <div class="project-description">
    <div id="beginnerTextBAPhy" class="beginner" style="display: none">
      <p>Most of our current understanding of elementary particle physics is based on the <a href="https://en.wikipedia.org/wiki/Standard_Model">"Standard Model"</a>, a mathematically consistent description of all known particles and their interactions (except gravitation). However there are a number of <a href="https://en.wikipedia.org/wiki/Physics_beyond_the_Standard_Model#Problems_with_the_Standard_Model">shortcomings of the Standard Model</a> and most notably, astrophysical observations suggest that the currently known particle content can account for but 5% of the total mass content of the universe (the rest being called <a href="https://en.wikipedia.org/wiki/Dark_matter">dark matter</a> and <a href="https://en.wikipedia.org/wiki/Dark_energy">dark energy</a>). One of the most popular theoretical concept that tries to solve some of these problems is the concept of <a href="https://en.wikipedia.org/wiki/Sterile_neutrino">sterile neutrino</a>.</p>
      <p>Sterile neutrinos are hypothetical neutrino species that do not interact via the weak nuclear force, unlike the three known neutrino types (electron neutrinos, muon neutrinos, and tau neutrinos). These hypothetical particles are called "sterile" because they do not participate in the standard weak interactions, making them much harder to detect than active neutrinos.</p>
      <p>For my thesis I reviewed various neutrino experiments and explained and reviewed various sterile neutrino models that were used to explain them. </p>
    </div>
    <div id="expertTextBAPhy" class="expert">
    <p><a href="https://sbn.fnal.gov/">Neutrino short-baseline</a> anomalies refer to puzzling observations in neutrino experiments where neutrinos appear to behave differently than our current understanding predicts. These anomalies have sparked immense interest in the scientific community, leading to investigations that may revolutionize our understanding of neutrino physics.</p>
    <p>The anomalies arise from experiments involving neutrinos that travel shorter distances, such as those generated in nuclear reactors or accelerators. When observed over short baselines, unexpected deficit neutrino flux or excess in neutrino interactions, particularly electron antineutrinos, has been noticed. These discrepancies challenge the <a href="https://en.wikipedia.org/wiki/Standard_Model">Standard Model of particle physics</a>, indicating potential new physics beyond our current understanding.</p>
    <p>One proposed solution to these anomalies involves the existence of sterile neutrinos. Sterile neutrinos are hypothetical particles that don't interact via the weak nuclear force, making them exceedingly difficult to detect. If these sterile neutrinos have a small mass and mix with the standard neutrinos, they could lead to the observed anomalies. The presence of sterile neutrinos could create a new type of <a href="https://en.wikipedia.org/wiki/Neutrino_oscillation">neutrino oscillation</a>, where active neutrinos transform into sterile neutrinos over short distances, causing the unexpected experimental results.</p>
    </div>
  </div>
  <div class="project-links">
    <a href="/assets/pdf/ba_physics.pdf">PDF, 8.2 MB</a>
  </div>
  <div class="project-picturegroup">
    <div class="project-picturebox" style="max-width: 600px">
      <img alt="MiniBooNE experiment data" src="/assets/img/research/miniboone.png" />
      <div class="project-picturetext">The <a href="https://en.wikipedia.org/wiki/MiniBooNE">MiniBooNE</a> neutrino and antineutrino mode visible energy distributions \(E^{QE}_{\nu}\)</div>
    </div>
  </div>
</section>
</section>