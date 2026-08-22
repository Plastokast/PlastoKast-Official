// PlastoKast Universal Product Inquiry & Multi-Product RFQ System
document.addEventListener("DOMContentLoaded", () => {

  // Inject Keyframe Animations, Overscroll Containment & Body Lock Styles
  if (!document.getElementById("inquiryModalStyles")) {
    const styleEl = document.createElement("style");
    styleEl.id = "inquiryModalStyles";
    styleEl.textContent = `
      @keyframes modalFadeIn {
        from { opacity: 0; transform: scale(0.95) translateY(-10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes subModalBounce {
        from { opacity: 0; transform: scale(0.9) translateY(10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes successBounceIn {
        0% { opacity: 0; transform: scale(0.6); }
        70% { transform: scale(1.05); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes pulseCheck {
        0% { transform: scale(1); box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4); }
        100% { transform: scale(1.08); box-shadow: 0 14px 30px rgba(16, 185, 129, 0.6); }
      }
      body.inquiry-modal-locked {
        overflow: hidden !important;
        touch-action: none;
      }
      #inquiryModal, #addProductSubModal, #removeProductSubModal, #inquirySuccessToast {
        overscroll-behavior: contain;
      }
      #selectedProductsList, #subProductListGrid, #subRemoveListGrid, .inquiry-modal-scrollable {
        overscroll-behavior: contain;
      }
      .sub-product-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        background: #ffffff;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .sub-product-item:hover {
        border-color: #2563eb;
        background: #f8fafc;
      }
      .sub-product-item.selected {
        border-color: #2563eb;
        background: #eff6ff;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // 1. Inject Main Modal & Sub-Modals HTML into Document
  if (!document.getElementById("inquiryModal")) {
    const modalHTML = `
      <!-- Main Inquiry Form Modal -->
      <div id="inquiryModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.82); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 30000; display: none; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;">
        <div style="background: #ffffff; width: 100%; max-width: 600px; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4); overflow: hidden; border: 1px solid #e2e8f0; animation: modalFadeIn 0.3s ease; position: relative;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0f172a, #1e293b); color: white; padding: 24px 30px; position: relative;">
            <span id="closeInquiryModal" style="position: absolute; top: 20px; right: 24px; font-size: 1.5rem; color: #94a3b8; cursor: pointer; line-height: 1; transition: color 0.2s;">&times;</span>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); font-size: 0.7rem; font-weight: 700; padding: 3px 10px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px;">Official RFQ</span>
            </div>
            <h3 style="font-size: 1.4rem; font-weight: 800; margin: 0; color: #ffffff;">Product Quote & Inquiry</h3>
            <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 4px; margin-bottom: 0;">Submit your details directly to the PlastoKast Medical Sales Team.</p>
          </div>

          <!-- Body Form -->
          <div class="inquiry-modal-scrollable" style="padding: 24px 30px; max-height: 78vh; overflow-y: auto;">
            
            <!-- Multi-Product Preview & Management Container -->
            <div id="inquiryProductContainer" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 14px 16px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                <span id="inquiryProductCountLabel" style="font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">Selected Products (1)</span>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <button type="button" id="btnOpenAddProducts" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.2s;">
                    <i class="fa fa-plus-circle"></i> Add Other Products
                  </button>
                  <button type="button" id="btnOpenRemoveProducts" style="display: none; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 10px; cursor: pointer; align-items: center; gap: 5px; transition: all 0.2s;">
                    <i class="fa fa-minus-circle"></i> Remove Products
                  </button>
                </div>
              </div>

              <!-- Selected Products Cards List -->
              <div id="selectedProductsList" style="display: flex; flex-direction: column; gap: 8px; max-height: 160px; overflow-y: auto; padding-right: 2px;">
                <!-- Dynamically rendered selected products -->
              </div>
            </div>

            <form id="popInquiryForm" style="display: flex; flex-direction: column; gap: 16px;">
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div>
                  <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Full Name *</label>
                  <input type="text" id="inqCustName" placeholder="Dr. / Mr. / Ms. Name" required style="width: 100%; padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; color: #0f172a; box-sizing: border-box;">
                </div>
                <div>
                  <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Work Email *</label>
                  <input type="email" id="inqCustEmail" placeholder="name@hospital.com" required style="width: 100%; padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; color: #0f172a; box-sizing: border-box;">
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div>
                  <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Hospital / Facility *</label>
                  <input type="text" id="inqCustFacility" placeholder="City Med Hospital / Self" required style="width: 100%; padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; color: #0f172a; box-sizing: border-box;">
                </div>
                <div>
                  <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Quantity / Units</label>
                  <input type="text" id="inqCustQty" inputmode="numeric" pattern="[0-9]*" placeholder="e.g. 100 or 500" style="width: 100%; padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; color: #0f172a; box-sizing: border-box;">
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div>
                  <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Country / Region *</label>
                  <select id="inqCustCountry" style="width: 100%; padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; color: #0f172a; box-sizing: border-box; background: #ffffff; cursor: pointer;">
                    <option value="India" data-code="+91" selected>🇮🇳 India (+91)</option>
                    <option value="United States" data-code="+1">🇺🇸 United States (+1)</option>
                    <option value="United Kingdom" data-code="+44">🇬🇧 United Kingdom (+44)</option>
                    <option value="United Arab Emirates" data-code="+971">🇦🇪 United Arab Emirates (+971)</option>
                    <option value="Saudi Arabia" data-code="+966">🇸🇦 Saudi Arabia (+966)</option>
                    <option value="Germany" data-code="+49">🇩🇪 Germany (+49)</option>
                    <option value="France" data-code="+33">🇫🇷 France (+33)</option>
                    <option value="Australia" data-code="+61">🇦🇺 Australia (+61)</option>
                    <option value="Canada" data-code="+1">🇨🇦 Canada (+1)</option>
                    <option value="Singapore" data-code="+65">🇸🇬 Singapore (+65)</option>
                    <option value="Japan" data-code="+81">🇯🇵 Japan (+81)</option>
                    <option value="South Africa" data-code="+27">🇿🇦 South Africa (+27)</option>
                    <option value="Brazil" data-code="+55">🇧🇷 Brazil (+55)</option>
                    <option value="Malaysia" data-code="+60">🇲🇾 Malaysia (+60)</option>
                    <option value="Qatar" data-code="+974">🇶🇦 Qatar (+974)</option>
                    <option value="Kuwait" data-code="+965">🇰🇼 Kuwait (+965)</option>
                    <option value="Oman" data-code="+968">🇴🇲 Oman (+968)</option>
                    <option value="Bahrain" data-code="+973">🇧🇭 Bahrain (+973)</option>
                    <option value="Italy" data-code="+39">🇮🇹 Italy (+39)</option>
                    <option value="Spain" data-code="+34">🇪🇸 Spain (+34)</option>
                    <option value="Netherlands" data-code="+31">🇳🇱 Netherlands (+31)</option>
                    <option value="Switzerland" data-code="+41">🇨🇭 Switzerland (+41)</option>
                    <option value="Turkey" data-code="+90">🇹🇷 Turkey (+90)</option>
                    <option value="Egypt" data-code="+20">🇪🇬 Egypt (+20)</option>
                    <option value="Nigeria" data-code="+234">🇳🇬 Nigeria (+234)</option>
                    <option value="Kenya" data-code="+254">🇰🇪 Kenya (+254)</option>
                    <option value="Thailand" data-code="+66">🇹🇭 Thailand (+66)</option>
                    <option value="Indonesia" data-code="+62">🇮🇩 Indonesia (+62)</option>
                    <option value="Vietnam" data-code="+84">🇻🇳 Vietnam (+84)</option>
                    <option value="Mexico" data-code="+52">🇲🇽 Mexico (+52)</option>
                    <option value="Pakistan" data-code="+92">🇵🇰 Pakistan (+92)</option>
                    <option value="Bangladesh" data-code="+880">🇧🇩 Bangladesh (+880)</option>
                    <option value="Sri Lanka" data-code="+94">🇱🇰 Sri Lanka (+94)</option>
                    <option value="Nepal" data-code="+977">🇳🇵 Nepal (+977)</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Phone / WhatsApp</label>
                  <div style="display: flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; background: white;">
                    <span id="phoneCountryPrefix" style="background: #f1f5f9; color: #1e293b; font-weight: 700; font-size: 0.88rem; padding: 11px 12px; border-right: 1px solid #cbd5e1; user-select: none; font-family: monospace; display: flex; align-items: center; justify-content: center; min-width: 54px;">+91</span>
                    <input type="tel" id="inqCustPhone" placeholder="98765 43210" style="flex: 1; border: none; outline: none; padding: 11px 12px; font-size: 0.9rem; color: #0f172a; box-sizing: border-box;">
                  </div>
                </div>
              </div>

              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Message / Details</label>
                <textarea id="inqCustMsg" placeholder="Type your inquiry or message here..." style="width: 100%; height: 75px; padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; color: #0f172a; resize: vertical; box-sizing: border-box; font-family: inherit;"></textarea>
              </div>

              <button type="submit" style="background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; border: none; padding: 14px; border-radius: 14px; font-weight: 700; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35); margin-top: 4px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.2s;">
                <i class="fa fa-paper-plane"></i> Submit Official Inquiry
              </button>
            </form>

          </div>

        </div>
      </div>

      <!-- SUB-MODAL 1: Add Other Products Overlay -->
      <div id="addProductSubModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 30050; display: none; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;">
        <div style="background: #ffffff; width: 100%; max-width: 520px; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4); overflow: hidden; border: 1px solid #e2e8f0; animation: subModalBounce 0.3s ease; position: relative;">
          
          <div style="background: #0f172a; color: white; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h4 style="font-size: 1.15rem; font-weight: 800; margin: 0; color: #ffffff;">Add Other Products</h4>
              <p style="font-size: 0.8rem; color: #94a3b8; margin: 2px 0 0 0;">Select products to include in this inquiry.</p>
            </div>
            <span id="closeAddProductSubModal" style="font-size: 1.4rem; color: #94a3b8; cursor: pointer; line-height: 1;">&times;</span>
          </div>

          <div style="padding: 16px 24px;">
            <!-- Filter Search -->
            <input type="text" id="subProductSearch" placeholder="Search catalog products..." style="width: 100%; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.88rem; margin-bottom: 14px; box-sizing: border-box;">
            
            <div id="subProductListGrid" style="display: flex; flex-direction: column; gap: 8px; max-height: 52vh; overflow-y: auto; padding-right: 4px;">
              <!-- Catalog items list rendered dynamically -->
            </div>
          </div>

          <div style="padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: right; display: flex; justify-content: flex-end; gap: 12px;">
            <button type="button" id="btnCancelAddSubModal" style="background: #e2e8f0; color: #334155; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; cursor: pointer;">Cancel</button>
            <button type="button" id="btnConfirmAddProducts" style="background: #2563eb; color: white; border: none; padding: 10px 22px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; cursor: pointer; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);">Add Selected Products</button>
          </div>

        </div>
      </div>

      <!-- SUB-MODAL 2: Remove Products Overlay -->
      <div id="removeProductSubModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 30050; display: none; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;">
        <div style="background: #ffffff; width: 100%; max-width: 480px; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4); overflow: hidden; border: 1px solid #e2e8f0; animation: subModalBounce 0.3s ease; position: relative;">
          
          <div style="background: #0f172a; color: white; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h4 style="font-size: 1.15rem; font-weight: 800; margin: 0; color: #ffffff;">Remove Products</h4>
              <p style="font-size: 0.8rem; color: #94a3b8; margin: 2px 0 0 0;">Check products you wish to remove from inquiry.</p>
            </div>
            <span id="closeRemoveProductSubModal" style="font-size: 1.4rem; color: #94a3b8; cursor: pointer; line-height: 1;">&times;</span>
          </div>

          <div style="padding: 16px 24px;">
            <div id="subRemoveListGrid" style="display: flex; flex-direction: column; gap: 8px; max-height: 52vh; overflow-y: auto; padding-right: 4px;">
              <!-- Selected products to remove rendered dynamically -->
            </div>
          </div>

          <div style="padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: right; display: flex; justify-content: flex-end; gap: 12px;">
            <button type="button" id="btnCancelRemoveSubModal" style="background: #e2e8f0; color: #334155; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; cursor: pointer;">Cancel</button>
            <button type="button" id="btnConfirmRemoveProducts" style="background: #dc2626; color: white; border: none; padding: 10px 22px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; cursor: pointer; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);">Remove Selected</button>
          </div>

        </div>
      </div>

      <!-- Small Center Animated Success Toast Popup -->
      <div id="inquirySuccessToast" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); z-index: 30100; display: none; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;">
        <div style="background: #ffffff; width: 100%; max-width: 380px; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); padding: 32px 24px; text-align: center; border: 1px solid #e2e8f0; animation: successBounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative;">
          
          <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.4rem; margin: 0 auto 18px auto; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4); animation: pulseCheck 1.8s infinite alternate;">
            <i class="fa fa-check"></i>
          </div>

          <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">Inquiry Submitted!</h3>
          <p style="font-size: 0.88rem; color: #64748b; margin: 0 0 16px 0; line-height: 1.5;">Thank you, <strong id="successCustName" style="color: #0f172a;">Valued Buyer</strong>! Your request has been logged into the PlastoKast Sales CRM.</p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px 14px; display: inline-block; font-family: monospace; font-size: 0.82rem; font-weight: 700; color: #2563eb; margin-bottom: 20px;">
            Ref ID: <span id="successRefId">REQ-0000</span>
          </div>

          <div>
            <button id="closeSuccessToastBtn" style="background: #0f172a; color: white; border: none; padding: 11px 28px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);">
              Done
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  // --- Element References ---
  const modal = document.getElementById("inquiryModal");
  const closeBtn = document.getElementById("closeInquiryModal");
  const form = document.getElementById("popInquiryForm");
  const countrySelect = document.getElementById("inqCustCountry");
  const prefixSpan = document.getElementById("phoneCountryPrefix");

  const selectedProductsListEl = document.getElementById("selectedProductsList");
  const inquiryProductCountLabel = document.getElementById("inquiryProductCountLabel");
  const btnOpenAddProducts = document.getElementById("btnOpenAddProducts");
  const btnOpenRemoveProducts = document.getElementById("btnOpenRemoveProducts");

  // Sub-Modal Add
  const addProductSubModal = document.getElementById("addProductSubModal");
  const closeAddProductSubModal = document.getElementById("closeAddProductSubModal");
  const btnCancelAddSubModal = document.getElementById("btnCancelAddSubModal");
  const btnConfirmAddProducts = document.getElementById("btnConfirmAddProducts");
  const subProductSearch = document.getElementById("subProductSearch");
  const subProductListGrid = document.getElementById("subProductListGrid");

  // Sub-Modal Remove
  const removeProductSubModal = document.getElementById("removeProductSubModal");
  const closeRemoveProductSubModal = document.getElementById("closeRemoveProductSubModal");
  const btnCancelRemoveSubModal = document.getElementById("btnCancelRemoveSubModal");
  const btnConfirmRemoveProducts = document.getElementById("btnConfirmRemoveProducts");
  const subRemoveListGrid = document.getElementById("subRemoveListGrid");

  // Success Toast
  const successToast = document.getElementById("inquirySuccessToast");
  const successCustName = document.getElementById("successCustName");
  const successRefId = document.getElementById("successRefId");
  const closeSuccessToastBtn = document.getElementById("closeSuccessToastBtn");

  let autoDismissTimer = null;

  // --- State: List of currently selected products in the active inquiry ---
  let activeSelectedProducts = []; 
  let pendingAddSelection = []; // temporary selection in Add sub-modal
  let pendingRemoveSelection = []; // temporary selection in Remove sub-modal

  // --- Global Body Lock Helper Functions ---
  function disableBodyScroll() {
    document.body.classList.add("inquiry-modal-locked");
  }

  function enableBodyScroll() {
    // Only restore scroll if NO modals are currently active
    const modalOpen = modal && modal.style.display === "flex";
    const addSubOpen = addProductSubModal && addProductSubModal.style.display === "flex";
    const removeSubOpen = removeProductSubModal && removeProductSubModal.style.display === "flex";
    const successOpen = successToast && successToast.style.display === "flex";

    if (!modalOpen && !addSubOpen && !removeSubOpen && !successOpen) {
      document.body.classList.remove("inquiry-modal-locked");
    }
  }

  // Sync Country Select -> Phone Prefix
  if (countrySelect && prefixSpan) {
    countrySelect.addEventListener("change", () => {
      const opt = countrySelect.options[countrySelect.selectedIndex];
      const code = opt ? opt.getAttribute("data-code") : "+91";
      prefixSpan.textContent = code || "+91";
    });
  }

  // Strictly enforce INTEGER DIGITS ONLY (0-9) on Quantity / Units field
  const qtyInput = document.getElementById("inqCustQty");
  if (qtyInput) {
    qtyInput.addEventListener("keydown", (e) => {
      const isControlKey = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter", "Home", "End"].includes(e.key);
      const isShortcut = (e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key.toLowerCase());

      if (!isControlKey && !isShortcut && !/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    });

    qtyInput.addEventListener("input", () => {
      qtyInput.value = qtyInput.value.replace(/[^0-9]/g, "");
    });
  }

  // --- Render Selected Products Cards inside Main Inquiry Modal ---
  function renderSelectedProductsList() {
    if (!selectedProductsListEl) return;

    if (activeSelectedProducts.length === 0) {
      selectedProductsListEl.innerHTML = `
        <div style="font-size: 0.85rem; color: #94a3b8; font-style: italic; padding: 8px 0;">No products selected. Click "Add Other Products" to select.</div>
      `;
      inquiryProductCountLabel.textContent = "Selected Products (0)";
      if (btnOpenRemoveProducts) btnOpenRemoveProducts.style.display = "none";
      return;
    }

    inquiryProductCountLabel.textContent = `Selected Products (${activeSelectedProducts.length})`;

    // Show Remove button ONLY if more than 1 product is selected!
    if (btnOpenRemoveProducts) {
      btnOpenRemoveProducts.style.display = activeSelectedProducts.length > 1 ? "flex" : "none";
    }

    selectedProductsListEl.innerHTML = activeSelectedProducts.map(p => `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px 12px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="width: 40px; height: 40px; background: white; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
          <img src="${(p.images && p.images.length > 0) ? p.images[0] : 'assets/images/Logo.png'}" alt="${p.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
        </div>
        <div style="flex: 1; overflow: hidden;">
          <div style="font-weight: 700; font-size: 0.88rem; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</div>
          <div style="display: flex; gap: 8px; align-items: center; margin-top: 1px;">
            <span style="font-family: monospace; font-size: 0.72rem; color: #64748b; font-weight: 600;">${p.code || 'PK-MEDICAL'}</span>
            <span style="font-size: 0.68rem; color: #2563eb; background: #eff6ff; padding: 1px 5px; border-radius: 4px; font-weight: 700; text-transform: uppercase;">${p.categoryLabel || 'Orthopedic'}</span>
          </div>
        </div>
      </div>
    `).join("");
  }

  // --- Open Inquiry Modal Function ---
  window.openInquiryModal = function(productOrTitle) {
    if (!modal) return;

    // Automatically close Quick View modal if active
    const qm = document.getElementById("quickview-modal");
    if (qm) qm.classList.remove("active");

    // Reset form completely when opening!
    if (form) form.reset();
    if (countrySelect && prefixSpan) {
      countrySelect.value = "India";
      prefixSpan.textContent = "+91";
    }

    // Set initial product
    activeSelectedProducts = [];
    let primaryProd = null;

    if (typeof productOrTitle === "object" && productOrTitle !== null) {
      primaryProd = productOrTitle;
    } else if (typeof productOrTitle === "string" && typeof PRODUCTS_DATA !== "undefined") {
      primaryProd = PRODUCTS_DATA.find(p => p.id === productOrTitle || p.title === productOrTitle) || null;
    }

    if (primaryProd) {
      activeSelectedProducts.push(primaryProd);
    } else if (typeof PRODUCTS_DATA !== "undefined" && PRODUCTS_DATA.length > 0) {
      activeSelectedProducts.push(PRODUCTS_DATA[0]);
    }

    renderSelectedProductsList();
    disableBodyScroll();
    modal.style.display = "flex";
  };

  // Centralized Modal Reset & Close Function
  function resetAndCloseModal() {
    if (form) form.reset();
    if (countrySelect && prefixSpan) {
      countrySelect.value = "India";
      prefixSpan.textContent = "+91";
    }
    activeSelectedProducts = [];
    if (modal) modal.style.display = "none";
    enableBodyScroll();
  }

  // Close handlers for Inquiry Modal
  if (closeBtn) {
    closeBtn.addEventListener("click", resetAndCloseModal);
  }
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) resetAndCloseModal();
    });
  }

  // Esc key close handler
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (addProductSubModal && addProductSubModal.style.display === "flex") {
        closeAddSubModal();
      } else if (removeProductSubModal && removeProductSubModal.style.display === "flex") {
        closeRemoveSubModal();
      } else if (modal && modal.style.display === "flex") {
        resetAndCloseModal();
      }
    }
  });

  // --- SUB-MODAL 1: ADD OTHER PRODUCTS HANDLERS ---
  function renderSubAddProductsList() {
    if (typeof PRODUCTS_DATA === "undefined" || !subProductListGrid) return;

    const query = subProductSearch ? subProductSearch.value.toLowerCase().trim() : "";
    
    // Filter products
    const items = PRODUCTS_DATA.filter(p => 
      p.title.toLowerCase().includes(query) || 
      (p.code && p.code.toLowerCase().includes(query))
    );

    subProductListGrid.innerHTML = items.map(p => {
      const isAlreadyInInquiry = activeSelectedProducts.some(ap => ap.id === p.id);
      const isCheckedInPending = pendingAddSelection.includes(p.id) || isAlreadyInInquiry;

      return `
        <div class="sub-product-item ${isCheckedInPending ? 'selected' : ''}" onclick="toggleSubAddProductSelection('${p.id}')">
          <input type="checkbox" id="chk_add_${p.id}" ${isCheckedInPending ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px; accent-color: #2563eb;">
          <div style="width: 36px; height: 36px; background: white; border-radius: 6px; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
            <img src="${(p.images && p.images.length > 0) ? p.images[0] : 'assets/images/Logo.png'}" alt="${p.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
          </div>
          <div style="flex: 1; overflow: hidden;">
            <div style="font-weight: 700; font-size: 0.85rem; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</div>
            <div style="font-size: 0.72rem; color: #64748b; font-family: monospace;">${p.code || 'PK-MEDICAL'}</div>
          </div>
          ${isAlreadyInInquiry ? '<span style="font-size: 0.7rem; color: #059669; font-weight: 700; background: #d1fae5; padding: 2px 6px; border-radius: 4px;">Added</span>' : ''}
        </div>
      `;
    }).join("");
  }

  window.toggleSubAddProductSelection = function(id) {
    if (pendingAddSelection.includes(id)) {
      pendingAddSelection = pendingAddSelection.filter(item => item !== id);
    } else {
      pendingAddSelection.push(id);
    }
    renderSubAddProductsList();
  };

  if (btnOpenAddProducts) {
    btnOpenAddProducts.addEventListener("click", () => {
      pendingAddSelection = activeSelectedProducts.map(p => p.id);
      if (subProductSearch) subProductSearch.value = "";
      renderSubAddProductsList();
      disableBodyScroll();
      addProductSubModal.style.display = "flex";
    });
  }

  if (subProductSearch) {
    subProductSearch.addEventListener("input", renderSubAddProductsList);
  }

  function closeAddSubModal() {
    if (addProductSubModal) addProductSubModal.style.display = "none";
    enableBodyScroll();
  }

  if (closeAddProductSubModal) closeAddProductSubModal.addEventListener("click", closeAddSubModal);
  if (btnCancelAddSubModal) btnCancelAddSubModal.addEventListener("click", closeAddSubModal);

  if (btnConfirmAddProducts) {
    btnConfirmAddProducts.addEventListener("click", () => {
      if (typeof PRODUCTS_DATA !== "undefined") {
        activeSelectedProducts = PRODUCTS_DATA.filter(p => pendingAddSelection.includes(p.id));
      }
      renderSelectedProductsList();
      closeAddSubModal();
    });
  }

  // --- SUB-MODAL 2: REMOVE PRODUCTS HANDLERS ---
  function renderSubRemoveProductsList() {
    if (!subRemoveListGrid) return;

    subRemoveListGrid.innerHTML = activeSelectedProducts.map(p => {
      const isMarkedForRemoval = pendingRemoveSelection.includes(p.id);

      return `
        <div class="sub-product-item ${isMarkedForRemoval ? 'selected' : ''}" style="${isMarkedForRemoval ? 'border-color: #ef4444; background: #fef2f2;' : ''}" onclick="toggleSubRemoveProductSelection('${p.id}')">
          <input type="checkbox" id="chk_rem_${p.id}" ${isMarkedForRemoval ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px; accent-color: #dc2626;">
          <div style="width: 36px; height: 36px; background: white; border-radius: 6px; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
            <img src="${(p.images && p.images.length > 0) ? p.images[0] : 'assets/images/Logo.png'}" alt="${p.title}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
          </div>
          <div style="flex: 1; overflow: hidden;">
            <div style="font-weight: 700; font-size: 0.85rem; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</div>
            <div style="font-size: 0.72rem; color: #64748b; font-family: monospace;">${p.code || 'PK-MEDICAL'}</div>
          </div>
          ${isMarkedForRemoval ? '<span style="font-size: 0.7rem; color: #dc2626; font-weight: 700; background: #fee2e2; padding: 2px 6px; border-radius: 4px;">To Remove</span>' : ''}
        </div>
      `;
    }).join("");
  }

  window.toggleSubRemoveProductSelection = function(id) {
    if (pendingRemoveSelection.includes(id)) {
      pendingRemoveSelection = pendingRemoveSelection.filter(item => item !== id);
    } else {
      pendingRemoveSelection.push(id);
    }
    renderSubRemoveProductsList();
  };

  if (btnOpenRemoveProducts) {
    btnOpenRemoveProducts.addEventListener("click", () => {
      pendingRemoveSelection = [];
      renderSubRemoveProductsList();
      disableBodyScroll();
      removeProductSubModal.style.display = "flex";
    });
  }

  function closeRemoveSubModal() {
    if (removeProductSubModal) removeProductSubModal.style.display = "none";
    enableBodyScroll();
  }

  if (closeRemoveProductSubModal) closeRemoveProductSubModal.addEventListener("click", closeRemoveSubModal);
  if (btnCancelRemoveSubModal) btnCancelRemoveSubModal.addEventListener("click", closeRemoveSubModal);

  if (btnConfirmRemoveProducts) {
    btnConfirmRemoveProducts.addEventListener("click", () => {
      activeSelectedProducts = activeSelectedProducts.filter(p => !pendingRemoveSelection.includes(p.id));
      
      // Safety: keep at least 1 product if possible
      if (activeSelectedProducts.length === 0 && typeof PRODUCTS_DATA !== "undefined" && PRODUCTS_DATA.length > 0) {
        activeSelectedProducts.push(PRODUCTS_DATA[0]);
      }

      renderSelectedProductsList();
      closeRemoveSubModal();
    });
  }

  // --- Success Toast Handlers ---
  function closeSuccessPopup() {
    if (successToast) successToast.style.display = "none";
    if (autoDismissTimer) clearTimeout(autoDismissTimer);
    enableBodyScroll();
  }

  if (closeSuccessToastBtn) {
    closeSuccessToastBtn.addEventListener("click", closeSuccessPopup);
  }
  if (successToast) {
    successToast.addEventListener("click", (e) => {
      if (e.target === successToast) closeSuccessPopup();
    });
  }

  // --- 3. Form Submit Handler -> Sends Multi-Product Inquiry directly to Admin Panel CRM ---
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("inqCustName").value.trim();
      const email = document.getElementById("inqCustEmail").value.trim();
      const phoneRaw = document.getElementById("inqCustPhone").value.trim();
      const facility = document.getElementById("inqCustFacility").value.trim();
      const country = countrySelect ? countrySelect.value : "India";
      const prefix = prefixSpan ? prefixSpan.textContent.trim() : "+91";
      const fullPhone = phoneRaw ? `${prefix} ${phoneRaw}` : "N/A";
      const qty = document.getElementById("inqCustQty").value.trim();
      const msg = document.getElementById("inqCustMsg").value.trim();

      // Format multi-product details
      let pTitleList = "General Catalog";
      let productDetailsText = "";

      if (activeSelectedProducts.length > 0) {
        pTitleList = activeSelectedProducts.map(p => p.title).join(", ");
        productDetailsText = activeSelectedProducts.map((p, i) => `${i+1}. ${p.title} [${p.code || 'PK-MEDICAL'}] (${p.categoryLabel || 'Orthopedic'})`).join("\n");
      }

      const firstProductTitle = activeSelectedProducts.length > 0 ? activeSelectedProducts[0].title : "Product";
      const fullSubject = activeSelectedProducts.length > 1 
        ? `Bulk RFQ for ${activeSelectedProducts.length} Products (${activeSelectedProducts[0].code || ''} + more)` 
        : `Quote Request for ${firstProductTitle}`;

      const fullMessage = `PRODUCTS REQUESTED (${activeSelectedProducts.length}):\n----------------------------------------\n${productDetailsText}\n----------------------------------------\nQuantity / Units: ${qty || 'Standard Bulk Inquiry'}\nPhone/WhatsApp: ${fullPhone}\nCustomer Notes: ${msg || 'None'}`;

      const inquiryData = {
        id: 'REQ-' + Math.floor(1000 + Math.random() * 9000),
        name: name,
        email: email,
        facility: facility || 'Self',
        country: country || 'India',
        customerType: 'Distributor / Buyer',
        subject: fullSubject,
        message: fullMessage,
        status: 'Pending',
        timestamp: new Date().toISOString()
      };

      // Save to localStorage for Admin CRM
      let inquiries = [];
      try {
        const raw = localStorage.getItem("plastokast_inquiries");
        if (raw) inquiries = JSON.parse(raw);
      } catch(err) {}

      inquiries.unshift(inquiryData);
      localStorage.setItem("plastokast_inquiries", JSON.stringify(inquiries));

      // Optional email dispatcher if function exists
      if (typeof dispatchInquiryEmail === "function") {
        dispatchInquiryEmail(inquiryData);
      }

      // 1. Immediately Close the Inquiry Form Popup & reset state
      resetAndCloseModal();

      // 2. Display the Animated Success Toast Popup in middle of screen!
      if (successCustName) successCustName.textContent = name || "Valued Buyer";
      if (successRefId) successRefId.textContent = inquiryData.id;
      if (successToast) successToast.style.display = "flex";
      disableBodyScroll();

      // 3. Auto dismiss after 3 seconds
      if (autoDismissTimer) clearTimeout(autoDismissTimer);
      autoDismissTimer = setTimeout(() => {
        closeSuccessPopup();
      }, 3000);
    });
  }

  // --- 4. Intercept all Click Links / Buttons across the site ---
  document.addEventListener("click", (e) => {
    const target = e.target.closest("a, button");
    if (!target) return;

    const text = target.textContent.toLowerCase().trim();
    const id = target.id;
    const href = target.getAttribute("href") || "";

    const isQuoteBtn = id === "detail-add-btn" || 
                       target.classList.contains("btn-quote") || 
                       text.includes("request quote") || 
                       text.includes("add to inquiry list") || 
                       text.includes("request official quote") || 
                       text.includes("request sample") || 
                       text.includes("inquire now") ||
                       href.includes("contact.html?quote=");

    if (isQuoteBtn) {
      e.preventDefault();
      
      let prodObj = null;
      
      const urlParams = new URLSearchParams(window.location.search);
      const detailId = urlParams.get("id");
      if (detailId && typeof PRODUCTS_DATA !== "undefined") {
        prodObj = PRODUCTS_DATA.find(p => p.id === detailId);
      }

      if (!prodObj) {
        const card = target.closest("[data-id]");
        if (card) {
          const pid = card.getAttribute("data-id");
          if (typeof PRODUCTS_DATA !== "undefined") {
            prodObj = PRODUCTS_DATA.find(p => p.id === pid);
          }
        }
      }

      window.openInquiryModal(prodObj);
    }
  });

});
