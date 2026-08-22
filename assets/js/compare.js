// Product Comparison System
document.addEventListener("DOMContentLoaded", () => {
  let selectedProductIds = [];

  // Inject Compare CSS styles dynamically
  const style = document.createElement("style");
  style.textContent = `
    /* Floating Compare Bar */
    #compare-bar {
      position: fixed;
      bottom: -100px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: 20px;
      padding: 16px 28px;
      box-shadow: var(--shadow-lg);
      z-index: 1200;
      display: flex;
      align-items: center;
      gap: 24px;
      transition: bottom var(--transition-normal);
      max-width: 90%;
      width: fit-content;
      backdrop-filter: blur(12px);
    }
    
    #compare-bar.active {
      bottom: 30px;
    }
    
    .compare-bar-thumbs {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .compare-thumb-item {
      position: relative;
      width: 44px;
      height: 44px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--border-light);
      background-color: var(--bg-main);
    }
    
    .compare-thumb-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .compare-thumb-remove {
      position: absolute;
      top: -4px;
      right: -4px;
      background-color: #ef4444;
      color: white;
      border: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.6rem;
      cursor: pointer;
    }
    
    /* Compare Modal */
    #compare-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--transition-normal);
      padding: 24px;
    }
    
    #compare-modal.active {
      opacity: 1;
      pointer-events: auto;
    }
    
    .compare-modal-content {
      background-color: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: 24px;
      padding: 32px;
      width: 100%;
      max-width: 950px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
      position: relative;
      transform: translateY(-20px);
      transition: transform var(--transition-normal);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    #compare-modal.active .compare-modal-content {
      transform: translateY(0);
    }
    
    .compare-table-wrapper {
      overflow-x: auto;
      border: 1px solid var(--border-light);
      border-radius: 12px;
    }
    
    .compare-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.9rem;
    }
    
    .compare-table th,
    .compare-table td {
      padding: 14px 18px;
      border-bottom: 1px solid var(--border-light);
    }
    
    .compare-table th {
      background-color: var(--primary-light);
      color: var(--primary);
      font-family: var(--font-headings);
      font-weight: 700;
    }
    
    body.dark-mode .compare-table th {
      background-color: #112a20;
      color: var(--accent);
    }
    
    .compare-table td:first-child {
      font-weight: 700;
      background-color: var(--bg-main);
      width: 180px;
      position: sticky;
      left: 0;
      z-index: 10;
    }
    
    .compare-header-cell {
      text-align: center;
      min-width: 180px;
    }
    
    .compare-header-cell img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
      margin: 0 auto 10px auto;
      background-color: var(--bg-main);
      border: 1px solid var(--border-light);
    }
  `;
  document.head.appendChild(style);

  // Inject Compare Bar & Modal HTML elements
  const barEl = document.createElement("div");
  barEl.id = "compare-bar";
  barEl.innerHTML = `
    <div class="compare-bar-thumbs" id="compare-bar-thumbs"></div>
    <div style="font-family: var(--font-headings); font-weight: 600; font-size: 0.9rem;">
      <span id="compare-count-badge">0</span> selected
    </div>
    <button class="btn btn-primary" id="compare-trigger-btn" style="padding: 8px 18px; font-size: 0.85rem;">
      <i class="fa fa-columns"></i> Compare Now
    </button>
    <button class="action-btn" id="compare-clear-btn" style="width: 32px; height: 32px; font-size: 0.9rem;" title="Clear all selection">
      <i class="fa fa-times"></i>
    </button>
  `;
  document.body.appendChild(barEl);

  const modalEl = document.createElement("div");
  modalEl.id = "compare-modal";
  modalEl.innerHTML = `
    <div class="compare-modal-content">
      <button class="lightbox-close" id="compare-modal-close" style="top: 20px; right: 20px;"><i class="fa fa-times"></i></button>
      <h3 style="font-family: var(--font-headings); font-weight: 800; font-size: 1.4rem; border-bottom: 2px solid var(--primary-light); padding-bottom: 10px;">
        <i class="fa fa-exchange" style="color: var(--accent);"></i> Product Comparison Matrix
      </h3>
      <div class="compare-table-wrapper">
        <table class="compare-table" id="compare-table-body">
          <!-- Dynamic compare grid -->
        </table>
      </div>
    </div>
  `;
  document.body.appendChild(modalEl);

  // Set event handlers
  document.getElementById("compare-modal-close").addEventListener("click", () => showCompareModal(false));
  document.getElementById("compare-clear-btn").addEventListener("click", clearSelection);
  document.getElementById("compare-trigger-btn").addEventListener("click", () => {
    if (selectedProductIds.length < 2) {
      alert("Please select at least 2 products to compare.");
      return;
    }
    renderComparisonTable();
    showCompareModal(true);
  });

  // Modal dismiss click outside
  modalEl.addEventListener("click", (e) => {
    if (e.target === modalEl) showCompareModal(false);
  });

  // Esc key close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalEl.classList.contains("active")) {
      showCompareModal(false);
    }
  });

  function showCompareModal(open = true) {
    if (open) {
      modalEl.classList.add("active");
      document.body.classList.add("no-scroll");
    } else {
      modalEl.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }
  }

  function clearSelection() {
    selectedProductIds = [];
    document.querySelectorAll(".compare-btn").forEach(cb => cb.checked = false);
    updateCompareBar();
  }

  // Monitor document click to capture dynamically rendered checkboxes
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("compare-btn")) {
      const pid = e.target.getAttribute("data-id");
      if (e.target.checked) {
        if (selectedProductIds.length >= 4) {
          alert("You can compare up to 4 products at a time.");
          e.target.checked = false;
          return;
        }
        if (!selectedProductIds.includes(pid)) {
          selectedProductIds.push(pid);
        }
      } else {
        selectedProductIds = selectedProductIds.filter(id => id !== pid);
      }
      updateCompareBar();
    }
  });

  // Update Compare Bar state
  function updateCompareBar() {
    const bar = document.getElementById("compare-bar");
    const thumbsContainer = document.getElementById("compare-bar-thumbs");
    const badge = document.getElementById("compare-count-badge");

    if (selectedProductIds.length === 0) {
      bar.classList.remove("active");
      return;
    }

    badge.textContent = selectedProductIds.length;
    thumbsContainer.innerHTML = selectedProductIds.map(id => {
      const product = getProductById(id);
      if (!product) return "";
      return `
        <div class="compare-thumb-item">
          <img src="${product.images[0]}" alt="${product.title}">
          <button type="button" class="compare-thumb-remove" onclick="removeCompareItem('${id}')">&times;</button>
        </div>
      `;
    }).join("");

    bar.classList.add("active");
  }

  // Globally accessible callback to remove item from float bar
  window.removeCompareItem = function(id) {
    selectedProductIds = selectedProductIds.filter(pid => pid !== id);
    // Find checkbox in page and uncheck it
    const checkbox = document.querySelector(`.compare-btn[data-id="${id}"]`);
    if (checkbox) checkbox.checked = false;
    updateCompareBar();
  };

  // Render comparison matrix table
  function renderComparisonTable() {
    const table = document.getElementById("compare-table-body");
    if (!table) return;

    const products = selectedProductIds.map(id => getProductById(id)).filter(Boolean);
    const lang = getActiveLanguage();
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

    // Build Header Row
    let headHTML = `<tr><td>Attribute</td>`;
    products.forEach(p => {
      headHTML += `
        <th class="compare-header-cell">
          <img src="${p.images[0]}" alt="${p.title}">
          <div style="font-weight: 800; font-size: 0.95rem;">${p.title}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Code: ${p.code || ''}</div>
        </th>
      `;
    });
    headHTML += `</tr>`;

    // Comparison attributes list
    const attrs = [
      { key: "category", label: "Category", getVal: p => p.categoryLabel },
      
            { key: "avail", label: "Availability", getVal: p => p.availability || 'In Stock' },
      { key: "material", label: "Material Composition", getVal: p => p.specs["Material Composition"] || p.specs["Structure"] || p.specs["Fiber Content"] || p.specs["Material Core"] || "Standard core fabric" },
      { key: "curing", label: "Curing / Setting Time", getVal: p => p.specs["Curing Time"] || p.specs["Setting Time"] || "N/A" },
      { key: "bearing", label: "Weight-Bearing Time", getVal: p => p.specs["Full Weight-Bearing Time"] || "N/A" },
      { key: "waterproof", label: "Waterproof Capacity", getVal: p => p.features.some(f => f.toLowerCase().includes("water")) ? "Yes (Hydrophobic / Quick-Draining)" : "Standard Dressing" },
      { key: "sterility", label: "Sterility", getVal: p => p.specs["Sterility Status"] || p.specs["Sterility"] || p.specs["Sterility Options"] || "Sterilizable" },
      { key: "widths", label: "Width Sizes", getVal: p => p.sizes.map(s => s.split(" x ")[0]).join(", ") },
      { key: "application", label: "Primary Application", getVal: p => p.specs["Usage Range"] || p.specs["Application"] || "Orthopedic support & dressing" }
    ];

    let bodyHTML = headHTML;
    attrs.forEach(attr => {
      bodyHTML += `<tr><td>${attr.label}</td>`;
      products.forEach(p => {
        bodyHTML += `<td>${attr.getVal(p)}</td>`;
      });
      bodyHTML += `</tr>`;
    });

    table.innerHTML = bodyHTML;
  }
});
