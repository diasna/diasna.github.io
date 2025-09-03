---
layout: portfolio
title: Home
---

<!-- Hero Section -->
<section class="hero-gradient min-h-screen flex items-center justify-center pt-20" id="about">
    <div class="container mx-auto px-6">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="hero-content">
                <h1 class="hero-title text-4xl md:text-6xl font-bold text-neutral-800 mb-6 leading-tight">
                    Solution Architect & Full-Stack Developer
                </h1>
                <p class="text-xl text-neutral-600 mb-8 leading-relaxed">
                    I build robust backends, intuitive apps, and seamless digital experiences. From mobile prototypes to scalable platforms, I turn complex challenges into clean, impactful solutions.
                </p>
                <div class="flex flex-wrap gap-4 mb-8">
                    <a href="#projects" class="bg-neutral-800 text-white px-8 py-3 rounded-lg hover:bg-neutral-700 transition-colors font-medium">
                        View Projects
                    </a>
                    <a href="#contact" class="border-2 border-neutral-300 text-neutral-700 px-8 py-3 rounded-lg hover:border-neutral-400 transition-colors font-medium">
                        Get In Touch
                    </a>
                </div>
                <div class="flex space-x-8">
                    <div class="stat-item text-center">
                        <div class="text-2xl font-bold text-neutral-800" data-count="55">0</div>
                        <div class="text-sm text-neutral-600">Projects</div>
                    </div>
                    <div class="stat-item text-center">
                        {% assign start_year = 2010 %}
                        {% assign current_year = 'now' | date: '%Y' %}
                        {% assign years_experience = current_year | minus: start_year %}
                        <div class="text-2xl font-bold text-neutral-800" data-count="{{ years_experience }}`">0</div>
                        <div class="text-sm text-neutral-600">Years Experience</div>
                    </div>
                    <div class="stat-item text-center">
                        <div class="text-2xl font-bold text-neutral-800" data-count="{{ site.posts | size }}">{{ site.posts | size }}</div>
                        <div class="text-sm text-neutral-600">Blog post</div>
                    </div>
                </div>
            </div>
            <div class="hero-image">
                <div class="relative">
                    <img src="/assets/images/med-badr-chemmaoui-76OF9pjBpYQ-unsplash.jpg" 
                         alt="Professional developer workspace with modern setup" 
                         class="w-full h-96 object-cover rounded-2xl shadow-lg">
                    <div class="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-xl shadow-lg flex items-center justify-center">
                        <svg class="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Projects Section -->
<section class="py-20 bg-white" id="projects">
    <div class="container mx-auto px-6">
        <div class="section-header text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Featured Projects</h2>
            <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
                A collection of projects that showcase my skills in web development, mobile apps, and creative problem-solving.
            </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {% for project in site.data.projects %}
            <div class="project-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden card-hover" data-category="{{ project.status | downcase }}">
                <div class="relative overflow-hidden">
                    <img src="{{ project.image }}" alt="{{ project.title }}" class="w-full h-48 object-cover">
                    <div class="absolute top-4 right-4">
                        <span class="px-3 py-1 text-xs font-medium rounded-full status-{{ project.status | downcase | replace: ' ', '' }}">
                            {{ project.status }}
                        </span>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-neutral-800 mb-3">{{ project.title }}</h3>
                    <p class="text-neutral-600 mb-4 leading-relaxed">{{ project.description }}</p>
                    
                    <div class="flex flex-wrap gap-2 mb-4">
                        {% for tech in project.technologies %}
                        <span class="tech-tag px-3 py-1 text-xs font-medium text-neutral-600 rounded-full border border-neutral-200">
                            {{ tech }}
                        </span>
                        {% endfor %}
                    </div>
                    
                    <div class="flex space-x-4">
                        {% if project.github and project.github != '#' %}
                        <a href="{{ project.github }}" target="_blank" class="text-neutral-600 hover:text-neutral-800 transition-colors">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </a>
                        {% endif %}
                        {% if project.demo and project.demo != '#' %}
                        <a href="{{ project.demo }}" target="_blank" class="text-neutral-600 hover:text-neutral-800 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                            </svg>
                        </a>
                        {% endif %}
                    </div>
                </div>
            </div>
            {% endfor %}
        </div>

        <div class="text-center mt-12">
            <a href="https://github.com/{{ site.github_username }}" target="_blank" class="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-800 transition-colors font-medium">
                <span>View All Projects on GitHub</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
            </a>
        </div>
    </div>
</section>

<!-- Timeline Section -->
<section class="py-20 bg-neutral-50" id="timeline">
    <div class="container mx-auto px-6">
        <div class="section-header text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Professional Timeline</h2>
            <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
                My journey through education, work experiences, and key achievements that shaped my career.
            </p>
        </div>

        <div class="max-w-4xl mx-auto">
            {% for year_group in site.data.timeline %}
            <div class="mb-16">
                <h3 class="text-2xl font-bold text-neutral-800 mb-8 text-center">{{ year_group.year }}</h3>
                
                <div class="timeline-container relative">
                    <!-- Timeline line -->
                    <div class="timeline-line"></div>
                    
                    {% for item in year_group.items %}
                    <div class="timeline-item">
                        <div class="timeline-content">
                            <div class="flex justify-start mb-3">
                                <span class="px-3 py-1 text-xs font-medium rounded-full 
                                    {% if item.type == 'work' %}bg-blue-100 text-blue-800{% elsif item.type == 'education' %}bg-green-100 text-green-800{% elsif item.type == 'project' %}bg-purple-100 text-purple-800{% else %}bg-yellow-100 text-yellow-800{% endif %}">
                                    {{ item.type | capitalize }}
                                </span>
                            </div>
                            <h4 class="text-lg font-semibold text-neutral-800 mb-2">{{ item.title }}</h4>
                            <p class="text-sm font-medium text-neutral-600 mb-1">{{ item.company }}</p>
                            <p class="text-xs text-neutral-500 mb-3">{{ item.date }}</p>
                            <p class="text-neutral-600 leading-relaxed text-sm">{{ item.description }}</p>
                        </div>
                        
                        <!-- Timeline dot -->
                        <div class="timeline-dot"></div>
                    </div>
                    {% endfor %}
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</section>

<!-- Contact Section -->
<section class="py-20 bg-white" id="contact">
    <div class="container mx-auto px-6">
        <div class="section-header text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Let's Work Together</h2>
            <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
                Have a project in mind? I'd love to hear about it. Let's discuss how we can bring your ideas to life.
            </p>
        </div>

        <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            <div class="contact-form">
                <form class="space-y-6" action="#" method="POST">
                    <div>
                        <label for="email" class="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                        <input type="email" id="email" name="email" required class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 transition-colors">
                    </div>
                    <button type="submit" class="w-full bg-neutral-800 text-white px-8 py-3 rounded-lg hover:bg-neutral-700 transition-colors font-medium">
                        Contact me
                    </button>
                </form>
            </div>

            <div class="space-y-8">
                <div>
                    <h3 class="text-xl font-semibold text-neutral-800 mb-4">Get In Touch</h3>
                    <p class="text-neutral-600 leading-relaxed mb-6">
                        I'm always interested in new opportunities and exciting projects. Whether you're a company looking to hire, or you're someone who has a project in mind, I'd love to hear from you.
                    </p>
                </div>

                <div class="space-y-4">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="font-medium text-neutral-800">Email</p>
                            <p class="text-neutral-600">{{ site.email }}</p>
                        </div>
                    </div>

                    {% if site.github_username %}
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="font-medium text-neutral-800">GitHub</p>
                            <p class="text-neutral-600">github.com/{{ site.github_username }}</p>
                        </div>
                    </div>
                    {% endif %}

                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="font-medium text-neutral-800">Response Time</p>
                            <p class="text-neutral-600">Within 24 hours</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
