---
layout: default
title: Home
---

<section class="profile-section">
  <div class="image-container">
    <img src="/assets/images/profile.jpg" alt="Mehul Shetty">
  </div>
  <div class="text-content">
    <h1>Hi, I'm Mehul. <br><br>I craft innovative solutions at the intersection of data and technology.</h1>
  </div>
</section>

<section class="hero">
  <div class="cta-buttons">
    <a href="#" class="btn btn-contact">Contact</a>
    <a href="#" class="btn btn-resume">Resume</a>
  </div>
  <div class="wave-divider">
    <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path
        d="M0,224L48,213.3C96,203,192,181,288,160C384,139,480,117,576,122.7C672,128,768,160,864,186.7C960,213,1056,235,1152,213.3C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        fill="#4A56E2"
      ></path>
    </svg>
  </div>
</section>

<section class="projects-section">
  <div class="container">
    <div class="title-area">
      <h2>Check Out Some of My Past Projects</h2>
    </div>

    <!-- Swiper Container -->
    <div class="projects-carousel swiper">
      <div class="swiper-wrapper">
        <!-- Each project card wrapped in a swiper-slide -->
        <div class="swiper-slide">
          {% include project-card.html
             img_src="/assets/images/causaLM.png"
             img_alt="Workplace compliance"
             category=""
             title="CausaLM"
             description="In this post, we’ll explore what workplace compliance is and how to build a compliance culture for your organization."
             github_link="#"
             paper_link="/assets/docs/CausaLMPaper.pdf"
          %}
        </div>

        <div class="swiper-slide">
          {% include project-card.html
             img_src="/assets/images/marioRL.png"
             img_alt="Mailroom management"
             category=""
             title="RL using Intrinsic Curiosity"
             description="With more folks sending personal packages to the workplace, having a sound mailroom management system in place is key."
             github_link="#"
             paper_link="/assets/docs/RLPaper.pdf"
          %}
        </div>

        <div class="swiper-slide">
          {% include project-card.html
             img_src="/assets/images/gtel.png"
             category=""
             title="GTel Tech App"
             description="A quality workplace has the power to make your organization thrive. Explore why workplace management is so important..."
             github_link="#"
             paper_link="#"
          %}
        </div>

        <div class="swiper-slide">
          {% include project-card.html
             img_src="/assets/images/aml.png"
             category=""
             title="AML Detection"
             description="A quality workplace has the power to make your organization thrive. Explore why workplace management is so important..."
             github_link="#"
             paper_link="#"
          %}
        </div>
      </div>

      <!-- Swiper Navigation Buttons -->
      <div class="carousel-controls">
        <button class="btn swiper-button-prev">
          <i class="fa-solid fa-arrow-left fa-lg"></i>
        </button>
        <button class="btn swiper-button-next">
          <i class="fa-solid fa-arrow-right fa-lg"></i>
        </button>
      </div>
    </div>
  </div>
</section>


<section class="wave-section">
  <div class="content">
    <h2>The enterprise-grade workplace platform</h2>
    <p>
      Envoy is an all-in-one workplace platform that lets you turn every workplace location into a collaborative hub where all teams thrive.
    </p>
    <a href="#" class="btn">Learn more</a>
  </div>
</section>
