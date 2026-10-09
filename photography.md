---
layout: page
title: Photography
permalink: /photography/
---

{%- comment -%}
Gallery content lives in _data/photography.yml; image derivatives are built by
tools/build-images.js. Thumbnails are served at 1x/2x/3x in AVIF, WebP and JPEG;
the lightbox loads a 2560px version, and its script is fetched only on first click.
{%- endcomment -%}

<div class="photography">
{%- assign idx = 0 -%}
{%- for folder in site.data.photography %}
  <figure class="folder-group">
    <figcaption class="caption">{{ folder.caption }}</figcaption>
    <div class="folder">
      {%- for box in folder.boxes %}
      <div class="picturebox {{ box.layout }}">
        {%- for p in box.photos -%}
        {%- assign idx = idx | plus: 1 -%}
        {%- assign thumb = "/assets/img/photography/thumb/" | append: p.file -%}
        {%- if box.photos.size > 1 -%}
          {%- if forloop.first -%}{%- assign pos = " left" -%}{%- else -%}{%- assign pos = " right" -%}{%- endif -%}
        {%- else -%}{%- assign pos = "" -%}{%- endif %}
        <a href="/assets/img/photography/large/{{ p.file }}.jpg" data-avif="/assets/img/photography/large/{{ p.file }}.avif" data-lightbox="gallery" data-title="{{ p.title | escape }} &copy; Sina Etebar">
          <picture>
            <source type="image/avif" srcset="{{ thumb }}@1x.avif 1x, {{ thumb }}@2x.avif 2x, {{ thumb }}@3x.avif 3x">
            <source type="image/webp" srcset="{{ thumb }}@1x.webp 1x, {{ thumb }}@2x.webp 2x, {{ thumb }}@3x.webp 3x">
            <img class="photo{{ pos }}" src="{{ thumb }}@1x.jpg" srcset="{{ thumb }}@1x.jpg 1x, {{ thumb }}@2x.jpg 2x, {{ thumb }}@3x.jpg 3x" width="{{ p.w }}" height="{{ p.h }}" alt="{{ p.alt | escape }}" decoding="async" {% if idx <= 4 %}loading="eager"{% if idx == 1 %} fetchpriority="high"{% endif %}{% else %}loading="lazy"{% endif %}>
          </picture>
        </a>
        {%- endfor %}
      </div>
      {%- endfor %}
    </div>
  </figure>
{%- endfor %}
</div>

<script>
/* Lightbox is loaded on demand: the 166 KB jQuery + lightbox bundle and its
   stylesheet are fetched only when a photo is first clicked. Where the browser
   supports AVIF, the full-size links are swapped to the smaller AVIF version. */
(function () {
  var gallery = document.querySelector('.photography');
  if (!gallery) return;
  var state = 'idle'; // idle -> loading -> ready

  function useAvifIfSupported() {
    var probe = gallery.querySelector('img');
    if (!probe || !/\.avif($|\?)/.test(probe.currentSrc || '')) return;
    var links = gallery.querySelectorAll('a[data-avif]');
    for (var i = 0; i < links.length; i++) links[i].href = links[i].getAttribute('data-avif');
  }

  gallery.addEventListener('click', function (e) {
    if (state === 'ready') return;              // lightbox handles it from here
    var link = e.target.closest('a[data-lightbox]');
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (state === 'loading') return;
    state = 'loading';

    useAvifIfSupported();

    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/assets/css/lightbox.css';
    document.head.appendChild(css);

    var js = document.createElement('script');
    js.src = '/assets/js/lightbox-plus-jquery.min.js';
    js.onload = function () {
      // lightbox binds its handlers from jQuery's ready queue, which runs a
      // tick after onload, so wait for the instance before replaying the click.
      var tries = 0;
      (function whenReady() {
        // #lightbox is built right after the click handler is bound
        if (window.lightbox && window.lightbox.option && document.getElementById('lightbox')) {
          window.lightbox.option({
            disableScrolling: true,
            resizeDuration: 400,
            imageFadeDuration: 700,
            wrapAround: true
          });
        } else if (++tries < 100) {
          return setTimeout(whenReady, 20);
        }
        state = 'ready';
        link.click();                            // replay the click we swallowed
      })();
    };
    js.onerror = function () { state = 'ready'; link.click(); }; // fall back to plain navigation
    document.body.appendChild(js);
  });
})();
</script>
