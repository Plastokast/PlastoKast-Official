document.addEventListener("DOMContentLoaded", () => {
  // --- Navigation & Scroll Effects ---
  const header = document.querySelector("header");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("header-active");
    } else {
      header.classList.remove("header-active");
    }
  });

  // Dynamic Backdrop for Mobile Navigation Drawer
  let navBackdrop = document.querySelector(".nav-backdrop");
  if (!navBackdrop) {
    navBackdrop = document.createElement("div");
    navBackdrop.className = "nav-backdrop";
    document.body.appendChild(navBackdrop);
  }

  function closeMobileNav() {
    hamburger?.classList.remove("open");
    navLinks?.classList.remove("active");
    navBackdrop?.classList.remove("active");
    document.body.classList.remove("nav-locked");
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks?.classList.toggle("active");
      hamburger.classList.toggle("open", isOpen);
      navBackdrop?.classList.toggle("active", isOpen);
      document.body.classList.toggle("nav-locked", isOpen);
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", closeMobileNav);
  }

  // Inject Luxury Mobile Drawer Elements into navLinks
  if (navLinks && !navLinks.querySelector(".mobile-drawer-content")) {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const prodCount = typeof PRODUCTS_DATA !== "undefined" ? PRODUCTS_DATA.length : 26;

    const drawerContent = document.createElement("div");
    drawerContent.className = "mobile-drawer-content";
    drawerContent.innerHTML = `
      <div class="drawer-header">
        <a href="index.html" class="drawer-logo">
          <img src="assets/images/logo.png?v=300" alt="PlastoKast" class="drawer-logo-img">
        </a>
        <button type="button" class="drawer-close-btn" aria-label="Close Menu">
          <i class="fa fa-times"></i>
        </button>
      </div>

      <div class="drawer-body">
        <ul class="drawer-nav-list">
          <li>
            <a href="index.html" class="drawer-link ${currentPath === 'index.html' || currentPath === '' ? 'active' : ''}">
              <div class="drawer-link-left">
                <span class="drawer-link-icon"><i class="fa fa-home"></i></span>
                <span class="drawer-link-text">Home</span>
              </div>
              <i class="fa fa-angle-right drawer-link-arrow"></i>
            </a>
          </li>
          <li>
            <a href="products.html" class="drawer-link ${currentPath === 'products.html' ? 'active' : ''}">
              <div class="drawer-link-left">
                <span class="drawer-link-icon"><i class="fa fa-th-large"></i></span>
                <span class="drawer-link-text">Products</span>
              </div>
              <i class="fa fa-angle-right drawer-link-arrow"></i>
            </a>
          </li>
          <li>
            <a href="about.html" class="drawer-link ${currentPath === 'about.html' ? 'active' : ''}">
              <div class="drawer-link-left">
                <span class="drawer-link-icon"><i class="fa fa-building-o"></i></span>
                <span class="drawer-link-text">About Us</span>
              </div>
              <i class="fa fa-angle-right drawer-link-arrow"></i>
            </a>
          </li>
          <li>
            <a href="contact.html" class="drawer-link ${currentPath === 'contact.html' ? 'active' : ''}">
              <div class="drawer-link-left">
                <span class="drawer-link-icon"><i class="fa fa-envelope-o"></i></span>
                <span class="drawer-link-text">Contact Us</span>
              </div>
              <i class="fa fa-angle-right drawer-link-arrow"></i>
            </a>
          </li>
        </ul>
      </div>

      <div class="drawer-footer">
        <a href="https://api.whatsapp.com/send?phone=+919909412068&text=Hi%20PlastoKast,%20I%20am%20interested%20in%20your%20products." target="_blank" class="drawer-whatsapp-btn">
          <i class="fa fa-whatsapp"></i> Chat on WhatsApp
        </a>
        <a href="tel:+919909412068" class="drawer-phone-btn">
          <i class="fa fa-phone"></i> +91 99094 12068
        </a>
        <div class="drawer-trust-tag">
          <i class="fa fa-shield"></i> ISO 13485:2016 Certified &bull; WHO-GMP
        </div>
      </div>
    `;

    navLinks.appendChild(drawerContent);

    drawerContent.querySelector(".drawer-close-btn")?.addEventListener("click", closeMobileNav);
    drawerContent.querySelectorAll(".drawer-link").forEach(link => {
      link.addEventListener("click", closeMobileNav);
    });
  }

  // Close mobile menu on click of any raw desktop link
  document.querySelectorAll(".nav-links > li > a").forEach(link => {
    link.addEventListener("click", closeMobileNav);
  });

  // Ensure clean medical light theme across site
  document.body.classList.remove("dark-mode");
  try { localStorage.removeItem("theme"); } catch (e) {}

  // --- Search Overlay Panel ---
  const searchOpenBtn = document.getElementById("search-open");
  const searchCloseBtn = document.getElementById("search-close");
  const searchOverlay = document.getElementById("search-overlay");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  if (searchOpenBtn && searchOverlay) {
    searchOpenBtn.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      setTimeout(() => searchInput?.focus(), 200);
    });
  }

  if (searchCloseBtn && searchOverlay) {
    searchCloseBtn.addEventListener("click", () => {
      searchOverlay.classList.remove("active");
    });
  }

  if (searchOverlay) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
        searchOverlay.classList.remove("active");
      }
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
      }
    });
  }

  // --- Hero Slideshow / Carousel Logic ---
  const heroSlideshow = document.querySelector(".hero-slideshow");
  if (heroSlideshow) {
    const slides = heroSlideshow.querySelectorAll(".hero-slide");
    const dots = heroSlideshow.querySelectorAll(".hero-slide-dot");
    const prevBtn = heroSlideshow.querySelector(".hero-slide-btn.prev");
    const nextBtn = heroSlideshow.querySelector(".hero-slide-btn.next");
    
    let currentSlide = 0;
    let slideInterval = null;

    function showSlide(index) {
      if (index >= slides.length) currentSlide = 0;
      else if (index < 0) currentSlide = slides.length - 1;
      else currentSlide = index;

      slides.forEach((slide, i) => {
        if (i === currentSlide) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });

      dots.forEach((dot, i) => {
        if (i === currentSlide) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    function prevSlide() {
      showSlide(currentSlide - 1);
    }

    function startAutoSlide() {
      slideInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    }

    if (nextBtn) nextBtn.addEventListener("click", () => {
      nextSlide();
      stopAutoSlide();
      startAutoSlide();
    });
    
    if (prevBtn) prevBtn.addEventListener("click", () => {
      prevSlide();
      stopAutoSlide();
      startAutoSlide();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        showSlide(i);
        stopAutoSlide();
        startAutoSlide();
      });
    });

    heroSlideshow.addEventListener("mouseenter", stopAutoSlide);
    heroSlideshow.addEventListener("mouseleave", startAutoSlide);

    startAutoSlide();
  }

  // --- Dynamic Product Quick View Modal & Click Event Bindings ---
  function initQuickViewModal() {
    if (document.getElementById("quickview-modal")) return;
    const modalHtml = `
      <div class="quickview-overlay" id="quickview-modal">
        <div class="quickview-container">
          <button class="quickview-close-btn" id="quickview-close" aria-label="Close modal">
            <i class="fa fa-times"></i>
          </button>
          <div class="quickview-grid" id="quickview-grid-content">
            <!-- Content injected dynamically -->
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
    
    const modal = document.getElementById("quickview-modal");
    const closeBtn = document.getElementById("quickview-close");
    const container = modal.querySelector(".quickview-container");
    
    const closeQuickView = () => {
      modal.classList.remove("active");
      const inq = document.getElementById("inquiryModal");
      if (!inq || inq.style.display !== "flex") {
        document.documentElement.classList.remove("modal-open", "inquiry-modal-locked");
        document.body.classList.remove("modal-open", "inquiry-modal-locked");
      }
    };

    closeBtn.addEventListener("click", closeQuickView);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeQuickView();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeQuickView();
      }
    });

    // 1. Completely block mousewheel & touchmove on backdrop overlay
    modal.addEventListener("wheel", (e) => {
      if (e.target === modal) {
        e.preventDefault();
      }
    }, { passive: false });

    modal.addEventListener("touchmove", (e) => {
      if (e.target === modal) {
        e.preventDefault();
      }
    }, { passive: false });

    // 2. Prevent overscroll chaining on container boundaries
    if (container) {
      container.addEventListener("touchstart", () => {
        const top = container.scrollTop;
        const total = container.scrollHeight;
        const current = top + container.offsetHeight;

        if (top === 0) {
          container.scrollTop = 1;
        } else if (current >= total) {
          container.scrollTop = top - 1;
        }
      }, { passive: true });

      container.addEventListener("wheel", (e) => {
        const delta = e.deltaY;
        const up = delta < 0;
        const top = container.scrollTop;
        const total = container.scrollHeight;
        const visible = container.offsetHeight;

        if (up && top <= 0) {
          e.preventDefault();
        } else if (!up && top + visible >= total) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  }

  window.showProductQuickView = function(productId) {
    initQuickViewModal();
    if (typeof PRODUCTS_DATA === "undefined") return;
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById("quickview-modal");
    const gridContent = document.getElementById("quickview-grid-content");
    
    const priceText = typeof getProductPriceText === "function" ? getProductPriceText(product.id) : "$10.00 - $50.00";
    
    const mainImg = product.images[0];
    const thumbMarkup = product.images.map((img, idx) => `
      <img src="${img}" class="quickview-thumb ${idx === 0 ? 'active' : ''}" onclick="changeQuickViewImg('${img}', this)" alt="Thumbnail">
    `).join("");
    
    const specEntries = Object.entries(product.specs || {})
      .filter(([key]) => key.toUpperCase() !== "MOQ" && !key.toLowerCase().includes("minimum order"))
      .map(([key, val]) => `
        <div class="quickview-meta-item">
          <span class="quickview-meta-label">${key}</span>
          <span class="quickview-meta-value">${val}</span>
        </div>
      `).join("");

    gridContent.innerHTML = `
      <div class="quickview-gallery">
        <div class="quickview-main-img-wrapper">
          <img src="${mainImg}" class="quickview-main-img" id="quickview-main-img" alt="${product.title}">
        </div>
        ${product.images.length >= 1 ? `<div class="quickview-thumbs">${thumbMarkup}</div>` : ''}
      </div>
      <div class="quickview-info">
        <h2 class="quickview-title">${product.title}</h2>
        <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600; margin-top: -4px;">Code: ${product.code}</div>
        <p class="quickview-desc" style="margin-top: 4px; font-size: 0.85rem;">${product.desc}</p>
        
        <div style="margin-top: 6px; display: flex; flex-direction: column; gap: 4px;">
          ${specEntries}
        </div>
        
        <div style="margin-top: 14px; display: flex; gap: 12px; padding-bottom: 8px;">
          <button class="btn btn-primary" style="flex: 1; padding: 12px 16px; font-size: 0.85rem;" onclick="window.openInquiryModal('${product.id}'); const qm = document.getElementById('quickview-modal'); if(qm) qm.classList.remove('active');">
            <i class="fa fa-paper-plane"></i> Send Inquiry
          </button>
          <a href="product-detail.html?id=${product.id}" class="btn btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; padding: 12px 16px; font-size: 0.85rem;">
            Full Details <i class="fa fa-arrow-right" style="margin-left: 6px;"></i>
          </a>
        </div>
      </div>
    `;
    
    modal.classList.add("active");
    document.documentElement.classList.add("modal-open", "inquiry-modal-locked");
    document.body.classList.add("modal-open", "inquiry-modal-locked");

    // 60FPS GPU-Accelerated Interactive Touch & Mouse Zoom Pan Lens for QuickView
    const qvImgWrapper = modal.querySelector(".quickview-main-img-wrapper");
    const qvMainImg = document.getElementById("quickview-main-img");
    if (qvImgWrapper && qvMainImg) {
      qvImgWrapper.style.overflow = "hidden";
      qvImgWrapper.style.position = "relative";
      qvImgWrapper.style.touchAction = "none";
      qvImgWrapper.style.userSelect = "none";
      qvImgWrapper.style.webkitUserSelect = "none";
      qvImgWrapper.style.cursor = "zoom-in";
      qvMainImg.style.pointerEvents = "none";
      qvMainImg.style.willChange = "transform";
      qvMainImg.style.transformOrigin = "center center";
      qvMainImg.style.transform = "translate3d(0, 0, 0) scale(1)";

      let isZooming = false;
      let targetScale = 1;
      let currentScale = 1;
      let targetPanX = 0;
      let targetPanY = 0;
      let currentPanX = 0;
      let currentPanY = 0;
      let animFrameId = null;

      const renderQvFrame = () => {
        const factor = 0.22;
        currentScale += (targetScale - currentScale) * factor;
        currentPanX += (targetPanX - currentPanX) * factor;
        currentPanY += (targetPanY - currentPanY) * factor;

        qvMainImg.style.transform = `translate3d(${currentPanX.toFixed(2)}px, ${currentPanY.toFixed(2)}px, 0) scale(${currentScale.toFixed(3)})`;

        const diffScale = Math.abs(targetScale - currentScale);
        const diffX = Math.abs(targetPanX - currentPanX);
        const diffY = Math.abs(targetPanY - currentPanY);

        if (isZooming || diffScale > 0.001 || diffX > 0.1 || diffY > 0.1) {
          animFrameId = requestAnimationFrame(renderQvFrame);
        } else {
          currentScale = targetScale;
          currentPanX = targetPanX;
          currentPanY = targetPanY;
          qvMainImg.style.transform = `translate3d(${currentPanX}px, ${currentPanY}px, 0) scale(${currentScale})`;
          animFrameId = null;
        }
      };

      const startQvLoop = () => {
        if (!animFrameId) {
          animFrameId = requestAnimationFrame(renderQvFrame);
        }
      };

      const updateQvCoords = (clientX, clientY, zoomLevel = 2.4) => {
        const rect = qvImgWrapper.getBoundingClientRect();
        targetScale = zoomLevel;

        const normX = ((clientX - rect.left) / rect.width) - 0.5;
        const normY = ((clientY - rect.top) / rect.height) - 0.5;

        const maxPanX = (rect.width * (zoomLevel - 1)) / 2;
        const maxPanY = (rect.height * (zoomLevel - 1)) / 2;

        targetPanX = Math.max(-maxPanX, Math.min(maxPanX, -normX * 2 * maxPanX));
        targetPanY = Math.max(-maxPanY, Math.min(maxPanY, -normY * 2 * maxPanY));

        startQvLoop();
      };

      const stopQvZoom = () => {
        isZooming = false;
        targetScale = 1;
        targetPanX = 0;
        targetPanY = 0;
        startQvLoop();
      };

      qvImgWrapper.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
          isZooming = true;
          updateQvCoords(e.touches[0].clientX, e.touches[0].clientY, 2.5);
        }
      }, { passive: true });

      qvImgWrapper.addEventListener("touchmove", (e) => {
        if (isZooming && e.touches.length === 1) {
          e.preventDefault();
          updateQvCoords(e.touches[0].clientX, e.touches[0].clientY, 2.5);
        }
      }, { passive: false });

      qvImgWrapper.addEventListener("touchend", stopQvZoom, { passive: true });
      qvImgWrapper.addEventListener("touchcancel", stopQvZoom, { passive: true });

      qvImgWrapper.addEventListener("mouseenter", (e) => {
        isZooming = true;
        updateQvCoords(e.clientX, e.clientY, 2.0);
      });
      qvImgWrapper.addEventListener("mousemove", (e) => {
        if (isZooming) {
          updateQvCoords(e.clientX, e.clientY, 2.0);
        }
      });
      qvImgWrapper.addEventListener("mouseleave", stopQvZoom);
    }
  };
  
  window.changeQuickViewImg = function(imgSrc, thumbEl) {
    const mainImg = document.getElementById("quickview-main-img");
    if (mainImg) mainImg.src = imgSrc;
    const thumbs = document.querySelectorAll(".quickview-thumb");
    thumbs.forEach(t => t.classList.remove("active"));
    if (thumbEl) thumbEl.classList.add("active");
  };

  // Bind click event to hero slides to trigger Quick View
  const slides = document.querySelectorAll(".hero-slide");
  slides.forEach(slide => {
    slide.style.cursor = "pointer";
    slide.addEventListener("click", () => {
      let productId = "plastokast-fiberglass-tape"; // fallback
      const altText = slide.querySelector("img") ? slide.querySelector("img").alt : "";
      if (altText.includes("Colored") || altText.includes("Polyester")) {
        productId = "plastokast-polyester-tape";
      } else if (altText.includes("Kit") || altText.includes("Package")) {
        productId = "pk-cast-kit";
      } else if (altText.includes("Office") || altText.includes("HQ")) {
        productId = "plastokast-fiberglass-tape";
      }
      window.showProductQuickView(productId);
    });
  });

  // Bind event delegation for clicking on product cards (excluding details buttons and inputs)
  document.body.addEventListener("click", (e) => {
    if (e.target.closest(".btn") || e.target.closest(".wishlist-btn") || e.target.closest("input")) {
      return;
    }
    const card = e.target.closest(".product-card");
    if (card) {
      const productId = card.getAttribute("data-id");
      if (productId) {
        e.preventDefault();
        window.showProductQuickView(productId);
      }
    }
  });

  // --- Premium Scroll Reveal Intersection Observer ---
  const revealElements = document.querySelectorAll(".reveal, .reveal-on-scroll, .reveal-fade, .reveal-slide-left, .reveal-slide-right, .scale-reveal, .download-card, .feature-card, .stat-card, .cert-card, .about-card, .contact-card");
  
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px"
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add("active"));
  }

    // --- Dynamic Flagship Products Slider (Ultra-Smooth 60fps & Netflix Bar Arrows) ---
  const featuredGrid = document.getElementById("featured-products-grid");
  if (featuredGrid && typeof PRODUCTS_DATA !== "undefined") {
    const flagshipProducts = PRODUCTS_DATA.slice(0, 8);
    
    featuredGrid.className = "";
    featuredGrid.innerHTML = `
      <div class="slider-container-relative" id="flagship-slider-container">
        <button class="slider-control-btn prev-btn" id="flagship-prev" aria-label="Previous Products">
          <i class="fa fa-chevron-left"></i>
        </button>
        <div class="product-slider-track" id="flagship-slider-track">
          <div class="product-slider-wrapper" id="flagship-slider-wrapper">
            ${flagshipProducts.map(product => `
              <a href="product-detail.html?id=${product.id}" class="product-card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column;">
                <div class="product-card-img-wrapper">
                  <img src="${product.images[0]}" alt="${product.title}" class="product-card-img" loading="lazy">
                </div>
                <div class="product-card-body" style="padding-bottom: 20px;">
                  <div class="product-meta-row">
                    <span class="product-code">${product.code}</span>
                  </div>
                  <span class="product-card-category" style="margin-top: 4px;">${product.categoryLabel || 'Orthopedic'}</span>
                  <h3 class="product-card-title">${product.title}</h3>
                  <p class="product-card-desc" style="margin-bottom: 0;">${product.desc}</p>
                </div>
              </a>
            `).join("")}
          </div>
        </div>
        <button class="slider-control-btn next-btn visible" id="flagship-next" aria-label="Next Products">
          <i class="fa fa-chevron-right"></i>
        </button>
      </div>
    `;
    
    const track = document.getElementById("flagship-slider-track");
    const wrapper = document.getElementById("flagship-slider-wrapper");
    const prevBtn = document.getElementById("flagship-prev");
    const nextBtn = document.getElementById("flagship-next");
    const container = document.getElementById("flagship-slider-container");
    
    if (track && wrapper && prevBtn && nextBtn) {
      let isSlid = false;
      let autoPlayTimer = null;
      
      const updateSlider = (slide) => {
        isSlid = slide;
        const slideDistance = track.clientWidth + 20;
        if (isSlid) {
          wrapper.style.transform = `translate3d(-${slideDistance}px, 0, 0)`;
          prevBtn.classList.add("visible");
          nextBtn.classList.remove("visible");
        } else {
          wrapper.style.transform = "translate3d(0, 0, 0)";
          prevBtn.classList.remove("visible");
          nextBtn.classList.add("visible");
        }
      };
      
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        updateSlider(false);
      });

      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        updateSlider(true);
      });

      // Auto-play feature: Scrolls right after 2 seconds, then loops smoothly
      const startAutoPlay = () => {
        stopAutoPlay();
        autoPlayTimer = setInterval(() => {
          updateSlider(!isSlid);
        }, 3500);
      };

      const stopAutoPlay = () => {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
      };

      // Start auto-scroll after initial 2 seconds
      setTimeout(() => {
        startAutoPlay();
      }, 2000);

      // Pause auto-scroll on hover / resume on mouse leave
      if (container) {
        container.addEventListener("mouseenter", stopAutoPlay);
        container.addEventListener("mouseleave", startAutoPlay);
      }

      window.addEventListener("resize", () => {
        if (isSlid) {
          const slideDistance = track.clientWidth + 20;
          wrapper.style.transform = `translate3d(-${slideDistance}px, 0, 0)`;
        }
      });
    }

    // Dynamic Catalog Total Count Button
    const homeCatalogBtn = document.getElementById("home-catalog-btn");
    if (homeCatalogBtn && typeof PRODUCTS_DATA !== "undefined") {
      homeCatalogBtn.innerHTML = `View Entire Catalog (${PRODUCTS_DATA.length} Products) <i class="fa fa-arrow-right"></i>`;
    }
  }

  // --- Universal CRM Integration: Capture All Website Inquiries ---
  window.captureWebsiteInquiry = function(inquiry) {
    const newInquiry = {
      id: inquiry.id || 'REQ-' + Math.floor(1000 + Math.random() * 9000),
      name: inquiry.name || 'Website Visitor',
      email: inquiry.email || 'N/A',
      facility: inquiry.facility || 'Direct Website Lead',
      country: inquiry.country || 'India',
      customerType: inquiry.customerType || 'Distributor',
      subject: inquiry.subject || 'Website Inquiry',
      message: inquiry.message || 'Product Inquiry from Website',
      status: 'Pending',
      read: false,
      timestamp: new Date().toISOString()
    };

    if (window.PlastoKastDB && typeof window.PlastoKastDB.saveInquiry === 'function') {
      window.PlastoKastDB.saveInquiry(newInquiry);
    } else {
      let inquiries = [];
      try {
        const raw = localStorage.getItem('plastokast_inquiries');
        if (raw) inquiries = JSON.parse(raw);
      } catch(e) {}
      inquiries.unshift(newInquiry);
      localStorage.setItem('plastokast_inquiries', JSON.stringify(inquiries));
    }
    
    if (typeof dispatchInquiryEmail === 'function') {
      dispatchInquiryEmail(newInquiry);
    }
  };

  // Bind form submissions across the entire website
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (!form || form.tagName !== 'FORM') return;

    // Exclude search overlay and admin panel forms
    if (form.id === 'search-form' || form.id === 'login-form' || form.id === 'catalogFilterForm') return;

    e.preventDefault();

    const nameInput = form.querySelector('input[name="name"], input[placeholder*="Name"], input[id*="name"], input[type="text"]:not([id="search-input"])');
    const emailInput = form.querySelector('input[type="email"], input[name="email"], input[placeholder*="Email"]');
    const subjectInput = form.querySelector('input[name="subject"], input[placeholder*="Subject"], select[name="subject"]');
    const messageInput = form.querySelector('textarea');
    const facilityInput = form.querySelector('input[placeholder*="Facility"], input[placeholder*="Hospital"], input[placeholder*="Company"]');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : (form.dataset.subject || 'Product & Sample Inquiry');
    const message = messageInput ? messageInput.value.trim() : 'Inquiry submitted via website form.';
    const facility = facilityInput ? facilityInput.value.trim() : 'Self / General Lead';

    if (!name && !email) return;

    window.captureWebsiteInquiry({
      name: name || 'Interested Buyer',
      email: email || 'No email specified',
      facility: facility,
      subject: subject,
      message: message
    });

    alert('Thank you! Your inquiry has been submitted and logged securely in the PlastoKast CRM.');
    form.reset();
  });

  // Initialize
  updateBadge();
});

// --- PlastoKast Formatted Inquiry Email Dispatcher ---
function getInquiryRecipientEmail() {
  return localStorage.getItem("plastokast_inquiry_email") || "plastokast.sales@gmail.com";
}

function formatInquiryEmailDetails(inquiry) {
  const recipientEmail = getInquiryRecipientEmail();
  const trackingId = inquiry.trackingId || "PK-INQ-" + Math.floor(1000 + Math.random() * 9000);
  const subject = `[PlastoKast Inquiry ${trackingId}] ${inquiry.name || 'Customer'} - ${inquiry.facility || 'Medical Facility'}`;
  
  let itemsList = "";
  if (inquiry.products && inquiry.products.length > 0) {
    inquiry.products.forEach((p, idx) => {
      const codeStr = p.code ? ` (Code: ${p.code})` : "";
      const sizeStr = p.size ? ` | Size: ${p.size}` : "";
      const qtyStr = p.qty ? ` | Qty: ${p.qty}` : "";
      itemsList += `  ${idx + 1}. ${p.title || p.name}${codeStr}${sizeStr}${qtyStr}\n`;
    });
  } else {
    itemsList = "  General Product & Technical Specification Inquiry\n";
  }

  const body = `====================================================
          PLASTOKAST MEDICAL PRODUCT INQUIRY
====================================================

INQUIRY REFERENCE: ${trackingId}
DATE & TIME: ${inquiry.date || new Date().toLocaleString()}

CUSTOMER & FACILITY DETAILS:
----------------------------------------------------
Full Name: ${inquiry.name || 'N/A'}
Work Email: ${inquiry.email || 'N/A'}
Facility / Hospital: ${inquiry.facility || 'N/A'}
Customer Type: ${inquiry.customerType || 'General Customer'}
Country / Region: ${inquiry.country || 'N/A'}

REQUESTED PRODUCTS & SPECIFICATIONS:
----------------------------------------------------
${itemsList}
CUSTOMER MESSAGE / NOTES:
----------------------------------------------------
${inquiry.message || 'No additional message provided.'}

====================================================
Sent automatically via PlastoKast Medical Web Portal
Target Recipient: ${recipientEmail}
====================================================`;

  return { recipientEmail, subject, body, trackingId };
}

function dispatchInquiryEmail(inquiry) {
  const { recipientEmail, subject, body, trackingId } = formatInquiryEmailDetails(inquiry);
  const formspreeUrl = localStorage.getItem("plastokast_formspree_url");

  // 1. Primary API Dispatch to server endpoint /api/send-inquiry
  fetch("/api/send-inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipientEmail: recipientEmail,
      subject: subject,
      trackingId: trackingId,
      name: inquiry.name,
      email: inquiry.email,
      facility: inquiry.facility,
      country: inquiry.country,
      customerType: inquiry.customerType,
      message: inquiry.message,
      products: inquiry.products,
      body: body
    })
  })
  .then(res => res.json())
  .then(data => console.log("API Inquiry Dispatch Status:", data))
  .catch(err => console.warn("API Inquiry Dispatch Note:", err));

  // 2. Secondary API Dispatch to Formspree / Webhook if configured
  if (formspreeUrl && formspreeUrl.startsWith("http")) {
    fetch(formspreeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _to: recipientEmail,
        _subject: subject,
        trackingId: trackingId,
        name: inquiry.name,
        email: inquiry.email,
        facility: inquiry.facility,
        country: inquiry.country,
        customerType: inquiry.customerType,
        message: inquiry.message,
        products: inquiry.products,
        formattedEmail: body
      })
    }).catch(err => console.warn("Formspree Dispatch Note:", err));
  }

  // 3. Return pre-formatted mailto URL
  const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return mailtoUrl;
}
