---
layout: portfolio
title: Tags
permalink: /tags/
---

<!-- Tags Header -->
<section class="pt-24 pb-16 bg-white">
    <div class="container mx-auto px-6">
        <div class="section-header text-center mb-16">
            <h1 class="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">Tags</h1>
            <p class="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                Browse articles by topic. Click on any tag to explore related content and discover new insights 
                in web development, programming, and technology.
            </p>
        </div>
    </div>
</section>

<!-- Tags Cloud -->
<section class="py-16 bg-neutral-50">
    <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-neutral-800 mb-8 text-center">All Tags</h2>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {% for tag in site.data.tags %}
                {% assign tag_posts = site.posts | where_exp: "post", "post.tags contains tag.name" %}
                <div class="tag-card bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 card-hover">
                    <div class="flex items-center justify-between mb-3">
                        <span class="px-3 py-1 text-sm font-medium rounded-full {{ tag.color }}">
                            {{ tag.name }}
                        </span>
                        <span class="text-sm text-neutral-500">{{ tag_posts.size }} posts</span>
                    </div>
                    <p class="text-neutral-600 text-sm leading-relaxed">{{ tag.description }}</p>
                    <button class="mt-4 text-sm text-neutral-700 hover:text-neutral-900 font-medium transition-colors tag-filter"
                            data-tag="{{ tag.slug }}">
                        View Posts →
                    </button>
                </div>
                {% endfor %}
            </div>
        </div>
    </div>
</section>

<!-- Posts by Tag -->
<section class="py-16 bg-white">
    <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold text-neutral-800 mb-8 text-center">Posts by Tag</h2>
            
            {% for tag in site.data.tags %}
            {% assign tag_posts = site.posts | where_exp: "post", "post.tags contains tag.name" %}
            {% if tag_posts.size > 0 %}
            <div class="tag-section mb-12" data-tag-section="{{ tag.slug }}">
                <div class="flex items-center gap-4 mb-6">
                    <span class="px-4 py-2 font-medium rounded-full {{ tag.color }}">
                        {{ tag.name }}
                    </span>
                    <span class="text-neutral-500">{{ tag_posts.size }} posts</span>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6">
                    {% for post in tag_posts %}
                    <article class="bg-neutral-50 rounded-lg p-6 hover:bg-neutral-100 transition-colors">
                        <h3 class="font-semibold text-neutral-800 mb-2 leading-tight">
                            <a href="{{ post.url }}" class="hover:text-neutral-600 transition-colors">
                                {{ post.title }}
                            </a>
                        </h3>
                        <p class="text-neutral-600 text-sm mb-3">{{ post.excerpt | strip_html | truncatewords: 20 }}</p>
                        <div class="flex items-center justify-between text-xs text-neutral-500">
                            <span>{{ post.date | date: '%B %d, %Y' }}</span>
                            <span>{% if post.read_time %}{{ post.read_time }}{% else %}5{% endif %} min read</span>
                        </div>
                    </article>
                    {% endfor %}
                </div>
            </div>
            {% endif %}
            {% endfor %}
        </div>
    </div>
</section>
