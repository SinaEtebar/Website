---
layout: default
title: Blog
subtitle: Blogging about Maths & Physics and history
permalink: /blog/
feature-img: "assets/img/SNF/header.png"
---
<div class="content">
  <div class="blog">
    <div class="call-out">
      <h1>Blog</h1>
      <h2>Blogging about hacking &amp; Maths, Physics, history...</h2>
    </div>

    <div class="posts">
      {% for post in site.posts %}
      <div class="post-teaser">
        <header>
          <h1>
            <a class="post-link" href="{{ post.url | relative_url }}">
              {{ post.title | replace: "<br>", " " | strip_html }}
            </a>
          </h1>
          <p class="meta">
            {{ post.date | date: "%B %-d, %Y" }}
          </p>
        </header>
        <div class="excerpt">
          {% if post.description %}
            {{ post.description }}
          {% else %}
            {{ post.excerpt | strip_html | truncate: 300 }}
          {% endif %}
          <br>
          <a class="button" href="{{ post.url | relative_url }}">
            {{ site.theme_settings.str_continue_reading | default: "Continue reading" }}
          </a>
        </div>
      </div>
      {% endfor %}
    </div>
  </div>
</div>