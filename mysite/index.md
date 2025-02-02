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
</section>

<section class="projects-section" id="projects">
  <div class="container">
    <div class="title-area">
      <h2 style="color:orange;">Check Out Some of My Past Projects</h2>
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
  <div class="wave-divider-top">
    <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path
        d="M0,224L48,213.3C96,203,192,181,288,160C384,139,480,117,576,122.7C672,128,768,160,864,186.7C960,213,1056,235,1152,213.3C1248,192,1344,128,1392,96L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        fill="#4A56E2"
      ></path>
    </svg>
  </div>
  <div class="content">
    <h2>About Me</h2>
    <p>
    I’m not just an analyst, I’m a data detective. I uncover hidden patterns and insights, transforming raw numbers into actionable strategies that drive impactful decisions.

From the trenches of startups to the labs of IBM, I’ve honed my skills across every layer of the tech stack, building real-world solutions that tackle problems head-on.

My journey started at Marist, where I didn’t just ace my CS degree (Summa Cum Laude, mind you!), I led the Student Government’s IT Council, ensuring zero downtime for their web apps and digitizing archaic processes. But I wasn’t one to only settle for dusty textbooks. As a freelance data consultant, I’ve streamlined pipelines for startups, boosting Opportunities For Writers’ data quality by 25% through Python and Java magic.</p>
    <a href="#" class="btn">Learn more</a>
  </div>
  <div class="wave-divider-bottom">
    <svg viewBox="0 0 1440 320" preserveAspectRatio="none"> <g transform="translate(1440, 0) scale(-1, 1)"> <path d="M0,96L48,106.7C96,117 192,139 288,160C384,181 480,203 576,197.3C672,192 768,160 864,133.3C960,107 1056,85 1152,106.7C1248,128 1344,192 1392,224L1440,256L1440,0L1392,0C1344,0 1248,0 1152,0C1056,0 960,0 864,0C768,0 672,0 576,0C480,0 384,0 288,0C192,0 96,0 48,0L0,0Z" fill="#4A56E2" ></path> </g> 
    </svg>
  </div>
</section>

<section class="form-section">
  <form action="https://formspree.io/f/xdkazdqd" method="POST">
  <h2>Let's Get In Touch</h2>
    <div class="form-row">
      <div class="form-group">
        <label>First name <span class="required">*</span></label>
        <input type="text" name="firstName" required>
      </div>
      <div class="form-group">
        <label>Last name <span class="required">*</span></label>
        <input type="text" name="lastName" required>
      </div>
    </div>
    
    <div class="form-group">
      <label>Email <span class="required">*</span></label>
      <input type="email" name="email" required>
    </div>
    
    <div class="form-group">
      <label>Message <span class="required">*</span></label>
      <textarea name="message" required></textarea>
    </div>
    
    <div class="form-submit">
      <button type="submit">Send Message</button>
    </div>
  </form>
</section>

