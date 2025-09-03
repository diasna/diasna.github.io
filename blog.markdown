---
layout: portfolio
title: Blog
permalink: /blog/
---

<!-- Blog Header -->
<section class="pt-24 bg-white">
    <div class="container mx-auto px-6">
        <div class="section-header text-center mb-16">
            <h1 class="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">Blog</h1>
            <p class="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                Thoughts, tutorials, and insights about web development, programming, and the ever-evolving world of technology.
                Sharing knowledge and experiences from my journey as a developer.
            </p>
        </div>

        <!-- Blog Stats -->
        <div class="grid md:grid-cols-4 gap-8 mb-16">
            <div class="stat-item text-center p-6 bg-neutral-50 rounded-lg">
                <div class="text-3xl font-bold text-neutral-800 mb-2" data-count="{{ site.posts.size }}">0</div>
                <div class="text-sm text-neutral-600 uppercase tracking-wider">Total Posts</div>
            </div>
            <div class="stat-item text-center p-6 bg-neutral-50 rounded-lg">
                <div class="text-3xl font-bold text-neutral-800 mb-2" data-count="{{ site.data.tags.size }}">0</div>
                <div class="text-sm text-neutral-600 uppercase tracking-wider">Categories</div>
            </div>
            <div class="stat-item text-center p-6 bg-neutral-50 rounded-lg">
                <div class="text-3xl font-bold text-neutral-800 mb-2" data-count="5min">0</div>
                <div class="text-sm text-neutral-600 uppercase tracking-wider">Avg Read Time</div>
            </div>
            <div class="stat-item text-center p-6 bg-neutral-50 rounded-lg">
                {% assign start_year = 2022 %}
                {% assign current_year = 'now' | date: '%Y' %}
                {% assign years_writing = current_year | minus: start_year %}
                <div class="text-3xl font-bold text-neutral-800 mb-2" data-count="{{ years_writing }}">0</div>
                <div class="text-sm text-neutral-600 uppercase tracking-wider">Years Writing</div>
            </div>
        </div>
    </div>
</section>

<!-- Blog Posts -->
<section class="py-16 bg-white">
    <div class="container mx-auto px-6">
        <div class="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-8">
                {% for post in site.posts %}
                <article class="blog-post bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 card-hover"
                         data-categories="{% for tag in post.tags %}{{ tag | downcase | replace: ' ', '-' }}{% unless forloop.last %} {% endunless %}{% endfor %}">
                    
                    <!-- Featured Image -->
                    {% if post.featured_image %}
                    <div class="aspect-video overflow-hidden">
                        <img src="{{ post.featured_image }}" alt="{{ post.title }}" 
                             class="w-full h-full object-cover hover:scale-105 transition-transform duration-300">
                    </div>
                    {% endif %}

                    <div class="p-8">
                        <!-- Post Meta -->
                        <div class="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%B %d, %Y' }}</time>
                            <span>•</span>
                            <span>{% if post.read_time %}{{ post.read_time }}{% else %}5{% endif %} min read</span>
                        </div>

                        <!-- Title -->
                        <h2 class="text-2xl font-bold text-neutral-800 mb-4 leading-tight hover:text-neutral-600 transition-colors">
                            <a href="{{ post.url }}">{{ post.title }}</a>
                        </h2>

                        <!-- Excerpt -->
                        <p class="text-neutral-600 mb-6 leading-relaxed">{{ post.excerpt | strip_html | truncatewords: 30 }}</p>

                        <!-- Tags -->
                        <div class="flex flex-wrap gap-2 mb-6">
                            {% for tag in post.tags limit:3 %}
                            {% assign tag_data = site.data.tags | where: 'name', tag | first %}
                            <span class="px-3 py-1 text-xs font-medium rounded-full {{ tag_data.color | default: 'bg-gray-100 text-gray-800' }}">
                                {{ tag }}
                            </span>
                            {% endfor %}
                            {% if post.tags.size > 3 %}
                            <span class="px-3 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600">
                                +{{ post.tags.size | minus: 3 }} more
                            </span>
                            {% endif %}
                        </div>

                        <!-- Read More -->
                        <a href="{{ post.url }}" 
                           class="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 font-medium transition-colors group">
                            <span>Read More</span>
                            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </article>
                {% endfor %}
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1">
                <div class="sticky top-24 space-y-8">
                    
                    <!-- Popular Tags -->
                    <div class="bg-neutral-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-neutral-800 mb-4">Categories</h3>
                        <div class="flex flex-wrap gap-2">
                            {% assign sorted_tags = site.data.tags | sort: 'count' | reverse %}
                            {% for tag in sorted_tags limit:10 %}
                            <button class="tag-filter px-3 py-1 text-sm rounded-full transition-colors {{ tag.color }}"
                                    data-tag="{{ tag.slug }}">
                                {{ tag.name }} ({{ tag.count }})
                            </button>
                            {% endfor %}
                        </div>
                    </div>

                    <!-- Recent Posts -->
                    <div class="bg-neutral-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-neutral-800 mb-4">Recent Posts</h3>
                        <div class="space-y-4">
                            {% for post in site.posts limit:3 %}
                            <article class="group">
                                <h4 class="font-medium text-neutral-800 group-hover:text-neutral-600 transition-colors leading-tight mb-2">
                                    <a href="{{ post.url }}">{{ post.title }}</a>
                                </h4>
                                <p class="text-sm text-neutral-500">{{ post.date | date: '%B %d, %Y' }}</p>
                            </article>
                            {% endfor %}
                        </div>
                    </div>

                    <!-- Newsletter Signup -->
                    <div class="bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-xl p-6 text-white">
                        <h3 class="text-lg font-semibold mb-2">Stay Updated</h3>
                        <p class="text-neutral-300 text-sm mb-4">Get notified when I publish new articles</p>
                        <form class="space-y-3">
                            <input type="email" placeholder="Your email address" 
                                   class="w-full px-3 py-2 rounded-lg bg-white text-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300">
                            <button type="submit" 
                                    class="w-full bg-white text-neutral-800 py-2 rounded-lg text-sm font-medium hover:bg-neutral-100 transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    </div>
</section>
