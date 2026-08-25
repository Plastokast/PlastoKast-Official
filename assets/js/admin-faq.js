/**
 * admin-faq.js
 * PlastoKast Admin FAQ & Knowledge Base Management Controller
 */

function initAdminFaqs() {
  const faqContainer = document.getElementById("adminFaqContainer");
  const statTotalFaqs = document.getElementById("statTotalFaqs");
  const statActiveFaqs = document.getElementById("statActiveFaqs");
  const faqSearchInput = document.getElementById("faqSearchInput");
  const faqStatusFilter = document.getElementById("faqStatusFilter");

  let currentEditingFaqId = null;

  function updateFaqMetrics(faqs) {
    const list = faqs || getFaqsData();
    if (statTotalFaqs) statTotalFaqs.textContent = list.length;
    if (statActiveFaqs) {
      const activeCount = list.filter(f => f.enabled !== false).length;
      statActiveFaqs.textContent = activeCount;
    }
  }

  function renderFaqsTable() {
    if (!faqContainer) return;
    const faqs = getFaqsData();
    updateFaqMetrics(faqs);

    const query = (faqSearchInput ? faqSearchInput.value : "").toLowerCase().trim();
    const filter = faqStatusFilter ? faqStatusFilter.value : "all";

    const filtered = faqs.filter(f => {
      const matchQuery = (f.question || "").toLowerCase().includes(query) ||
                         (f.answer || "").toLowerCase().includes(query) ||
                         (f.category || "").toLowerCase().includes(query);
      if (!matchQuery) return false;
      if (filter === "active") return f.enabled !== false;
      if (filter === "inactive") return f.enabled === false;
      return true;
    });

    if (filtered.length === 0) {
      faqContainer.innerHTML = `
        <div style="text-align: center; padding: 56px 24px; background: #ffffff; border-radius: 24px; border: 2px dashed #cbd5e1; grid-column: 1 / -1; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
          <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px auto; font-size: 1.8rem; color: #014E9E; border: 1.5px solid #bfdbfe;">
            <i class="fa fa-question-circle"></i>
          </div>
          <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 1.25rem; font-weight: 800;">No FAQ Items Found</h3>
          <p style="margin: 0 0 20px 0; color: #64748b; font-size: 0.88rem; max-width: 420px; margin-left: auto; margin-right: auto;">No questions match your search query or filter status.</p>
          <button type="button" onclick="window.openFaqModal()" style="background: linear-gradient(135deg, #014E9E, #0284c7); color: #ffffff; border: none; padding: 12px 26px; border-radius: 14px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 14px rgba(1, 78, 158, 0.3);">
            <i class="fa fa-plus"></i> Add New Question
          </button>
        </div>
      `;
      return;
    }

    faqContainer.innerHTML = filtered.map((faq, index) => {
      const isEnabled = faq.enabled !== false;
      return `
        <div class="admin-faq-card" style="background: #ffffff; border-radius: 20px; border: 1.5px solid #e2e8f0; padding: 22px; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03); display: flex; flex-direction: column; gap: 14px; position: relative;" data-id="${faq.id}">
          
          <!-- Top Row: Category Tag & Status Switch -->
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
            <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 12px; border-radius: 50px; background: #eff6ff; color: #014E9E; border: 1px solid #bfdbfe;">
              <i class="fa fa-tag" style="margin-right: 4px;"></i> ${faq.category || 'General'}
            </span>

            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 0.78rem; font-weight: 700; color: ${isEnabled ? '#16a34a' : '#94a3b8'};">
                ${isEnabled ? 'Active' : 'Hidden'}
              </span>
              <label class="switch-toggle" style="position: relative; display: inline-block; width: 44px; height: 24px; margin: 0;">
                <input type="checkbox" ${isEnabled ? 'checked' : ''} onchange="window.toggleAdminFaqStatus('${faq.id}')" style="opacity: 0; width: 0; height: 0;">
                <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${isEnabled ? '#014E9E' : '#cbd5e1'}; transition: 0.3s; border-radius: 34px;">
                  <span style="position: absolute; content: ''; height: 18px; width: 18px; left: ${isEnabled ? '23px' : '3px'}; bottom: 3px; background-color: white; transition: 0.3s; border-radius: 50%;"></span>
                </span>
              </label>
            </div>
          </div>

          <!-- Question Title -->
          <h4 style="font-size: 1.08rem; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.4;">
            <i class="fa fa-question-circle" style="color: #014E9E; margin-right: 6px;"></i> ${faq.question}
          </h4>

          <!-- Answer Body Preview -->
          <div style="font-size: 0.86rem; color: #475569; line-height: 1.55; background: #f8fafc; padding: 14px 16px; border-radius: 14px; border: 1px solid #f1f5f9; max-height: 140px; overflow-y: auto;">
            ${faq.answer}
          </div>

          <!-- Actions Toolbar -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 12px; border-top: 1px solid #f1f5f9;">
            <span style="font-size: 0.78rem; color: #94a3b8; font-weight: 600;">
              Order: #${faq.order || (index + 1)}
            </span>
            <div style="display: flex; gap: 8px;">
              <button type="button" onclick="window.editAdminFaq('${faq.id}')" style="background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; padding: 7px 14px; border-radius: 10px; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa fa-pencil"></i> Edit
              </button>
              <button type="button" onclick="window.deleteAdminFaq('${faq.id}')" style="background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; padding: 7px 14px; border-radius: 10px; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <i class="fa fa-trash"></i> Delete
              </button>
            </div>
          </div>

        </div>
      `;
    }).join('');
  }

  // Window methods for global HTML triggers
  window.refreshFaqs = renderFaqsTable;

  window.openFaqModal = function() {
    currentEditingFaqId = null;
    const modal = document.getElementById("adminFaqModal");
    const form = document.getElementById("adminFaqForm");
    const modalTitle = document.getElementById("adminFaqModalTitle");
    if (!modal || !form) return;

    form.reset();
    document.getElementById("faqModalId").value = "";
    if (modalTitle) modalTitle.textContent = "Add New FAQ Question";
    modal.classList.add("show", "active");
    modal.style.display = "flex";
  };

  window.closeFaqModal = function() {
    const modal = document.getElementById("adminFaqModal");
    if (modal) {
      modal.classList.remove("show", "active");
      modal.style.display = "none";
    }
  };

  window.editAdminFaq = function(id) {
    const list = getFaqsData();
    const item = list.find(f => f.id === id);
    if (!item) return;

    currentEditingFaqId = id;
    const modal = document.getElementById("adminFaqModal");
    const modalTitle = document.getElementById("adminFaqModalTitle");

    document.getElementById("faqModalId").value = item.id;
    document.getElementById("faqModalQuestion").value = item.question || "";
    document.getElementById("faqModalAnswer").value = item.answer || "";
    document.getElementById("faqModalCategory").value = item.category || "General";
    document.getElementById("faqModalOrder").value = item.order || 1;
    document.getElementById("faqModalEnabled").checked = item.enabled !== false;

    if (modalTitle) modalTitle.textContent = "Edit FAQ Question";
    if (modal) {
      modal.classList.add("show", "active");
      modal.style.display = "flex";
    }
  };

  window.toggleAdminFaqStatus = function(id) {
    toggleFaqStatus(id);
    renderFaqsTable();
  };

  window.deleteAdminFaq = function(id) {
    const list = getFaqsData();
    const item = list.find(f => f.id === id);
    const qTitle = item ? `"${item.question}"` : "this FAQ item";

    if (typeof window.confirmCustomDelete === "function") {
      window.confirmCustomDelete({
        title: "Delete FAQ Question?",
        message: `Are you sure you want to permanently delete <strong>${qTitle}</strong> from the website FAQ Desk?`,
        onConfirm: () => {
          deleteFaq(id);
          renderFaqsTable();
        }
      });
    } else {
      if (confirm(`Delete ${qTitle}?`)) {
        deleteFaq(id);
        renderFaqsTable();
      }
    }
  };

  // Form submit handler
  const faqForm = document.getElementById("adminFaqForm");
  if (faqForm) {
    faqForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("faqModalId").value;
      const question = document.getElementById("faqModalQuestion").value.trim();
      const answer = document.getElementById("faqModalAnswer").value.trim();
      const category = document.getElementById("faqModalCategory").value.trim() || "General";
      const order = parseInt(document.getElementById("faqModalOrder").value, 10) || 1;
      const enabled = document.getElementById("faqModalEnabled").checked;

      if (!question || !answer) {
        alert("Please provide both a Question and an Answer.");
        return;
      }

      if (id) {
        updateFaq(id, { question, answer, category, order, enabled });
      } else {
        addFaq({
          id: "faq-" + Date.now(),
          question,
          answer,
          category,
          order,
          enabled
        });
      }

      window.closeFaqModal();
      renderFaqsTable();
    });
  }

  // Search & Filter event listeners
  if (faqSearchInput) {
    faqSearchInput.addEventListener("input", renderFaqsTable);
  }
  if (faqStatusFilter) {
    faqStatusFilter.addEventListener("change", renderFaqsTable);
  }

  renderFaqsTable();
}

// Auto init on load
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAdminFaqs);
  } else {
    initAdminFaqs();
  }
}
