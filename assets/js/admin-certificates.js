/**
 * admin-certificates.js
 * PlastoKast Admin Certificates & Quality Standards Management Controller
 */

function initAdminCertificates() {
  const certContainer = document.getElementById("adminCertificatesContainer");
  const statTotalCertificates = document.getElementById("statTotalCertificates");
  const statActiveCertificates = document.getElementById("statActiveCertificates");
  const certSearchInput = document.getElementById("certSearchInput");
  const certStatusFilter = document.getElementById("certStatusFilter");

  let currentEditingCertId = null;

  function updateCertMetrics(certs) {
    const list = certs || getCertificatesData();
    if (statTotalCertificates) statTotalCertificates.textContent = list.length;
    if (statActiveCertificates) {
      const activeCount = list.filter(c => c.enabled !== false).length;
      statActiveCertificates.textContent = activeCount;
    }
  }

  function renderCertificatesTable() {
    if (!certContainer) return;
    const certs = getCertificatesData();
    updateCertMetrics(certs);

    const query = (certSearchInput ? certSearchInput.value : "").toLowerCase().trim();
    const filter = certStatusFilter ? certStatusFilter.value : "all";

    const filtered = certs.filter(c => {
      const matchQuery = (c.title || "").toLowerCase().includes(query) ||
                         (c.subtitle || "").toLowerCase().includes(query) ||
                         (c.standard || "").toLowerCase().includes(query) ||
                         (c.authority || "").toLowerCase().includes(query);
      if (!matchQuery) return false;
      if (filter === "active") return c.enabled !== false;
      if (filter === "inactive") return c.enabled === false;
      return true;
    });

    if (filtered.length === 0) {
      certContainer.innerHTML = `
        <div style="text-align: center; padding: 56px 24px; background: #ffffff; border-radius: 24px; border: 2px dashed #cbd5e1; grid-column: 1 / -1; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
          <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px auto; font-size: 1.8rem; color: #014E9E; border: 1.5px solid #bfdbfe;">
            <i class="fa fa-certificate"></i>
          </div>
          <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 1.25rem; font-weight: 800;">No Quality Certificates Found</h3>
          <p style="margin: 0 0 20px 0; color: #64748b; font-size: 0.88rem; max-width: 420px; margin-left: auto; margin-right: auto;">No standards or certificates match your search query or filter status.</p>
          <button type="button" onclick="window.openCertificateModal()" style="background: linear-gradient(135deg, #014E9E, #0284c7); color: #ffffff; border: none; padding: 12px 26px; border-radius: 14px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 14px rgba(1, 78, 158, 0.3);">
            <i class="fa fa-plus"></i> Add New Certificate
          </button>
        </div>
      `;
      return;
    }

    certContainer.innerHTML = filtered.map((cert) => {
      const isEnabled = cert.enabled !== false;
      return `
        <div class="admin-cert-card" style="background: #ffffff; border-radius: 24px; border: 1.5px solid #e2e8f0; padding: 24px; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.04); display: flex; flex-direction: column; gap: 18px; position: relative; transition: all 0.25s ease;" data-id="${cert.id}">
          
          <!-- Top Card Header: Icon Avatar + Title + Status Switch -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 54px; height: 54px; border-radius: 16px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1.5px solid #bfdbfe; color: #014E9E; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; box-shadow: 0 4px 12px rgba(1, 78, 158, 0.08);">
                <i class="fa ${cert.icon || 'fa-certificate'}"></i>
              </div>
              <div>
                <h4 style="margin: 0; font-size: 1.18rem; font-weight: 800; color: #0f172a; letter-spacing: -0.2px;">${cert.title}</h4>
                <p style="margin: 3px 0 0 0; font-size: 0.82rem; color: #0284c7; font-weight: 600; line-height: 1.3;">${cert.subtitle || ''}</p>
              </div>
            </div>

            <!-- iOS-style Status Toggle Badge -->
            <button type="button" onclick="window.toggleAdminCertStatus('${cert.id}')" title="${isEnabled ? 'Click to hide from website' : 'Click to show on website'}" style="background: ${isEnabled ? '#ecfdf5' : '#f8fafc'}; border: 1.5px solid ${isEnabled ? '#a7f3d0' : '#e2e8f0'}; padding: 6px 12px; border-radius: 20px; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; flex-shrink: 0;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${isEnabled ? '#10b981' : '#94a3b8'};"></span>
              <span style="font-size: 0.75rem; font-weight: 700; color: ${isEnabled ? '#047857' : '#64748b'}; text-transform: uppercase; letter-spacing: 0.3px;">
                ${isEnabled ? 'Active' : 'Hidden'}
              </span>
              <i class="fa ${isEnabled ? 'fa-toggle-on' : 'fa-toggle-off'}" style="font-size: 1.1rem; color: ${isEnabled ? '#10b981' : '#94a3b8'}; margin-left: 2px;"></i>
            </button>
          </div>

          <!-- Certificate Image Frame (HD Preview) -->
          <div style="width: 100%; height: 180px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; border: 1.5px solid #e2e8f0; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative; box-shadow: inset 0 2px 6px rgba(0,0,0,0.02);">
            ${cert.image ? `
              <img src="${cert.image}" alt="${cert.title}" style="max-width: 92%; max-height: 92%; object-fit: contain; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.06)); transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
              <a href="${cert.image}" target="_blank" style="position: absolute; bottom: 10px; right: 10px; background: rgba(15,23,42,0.82); backdrop-filter: blur(6px); color: #fff; padding: 5px 12px; border-radius: 10px; font-size: 0.75rem; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.2s;" onmouseover="this.style.background='#014E9E'" onmouseout="this.style.background='rgba(15,23,42,0.82)'">
                <i class="fa fa-expand"></i> View HD Photo
              </a>
            ` : `
              <div style="color: #94a3b8; font-size: 0.85rem; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <i class="fa fa-picture-o" style="font-size: 2rem; color: #cbd5e1;"></i>
                <span style="font-weight: 600;">No Image Linked</span>
              </div>
            `}
          </div>

          <!-- Structured Metadata Box -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; font-size: 0.82rem;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #e2e8f0; padding-bottom: 6px;">
              <span style="color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                <i class="fa fa-bookmark-o" style="color: #0284c7;"></i> Standard:
              </span>
              <span style="color: #0f172a; font-weight: 800; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 6px; font-size: 0.78rem;">
                ${cert.standard || 'General Compliance'}
              </span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px dashed #e2e8f0; padding-bottom: 6px;">
              <span style="color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                <i class="fa fa-university" style="color: #64748b;"></i> Authority:
              </span>
              <span style="color: #1e293b; font-weight: 700; text-align: right; max-width: 62%; line-height: 1.3;">
                ${cert.authority || 'Regulatory Body'}
              </span>
            </div>

            ${cert.regNo ? `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #e2e8f0; padding-bottom: 6px;">
              <span style="color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                <i class="fa fa-id-card-o" style="color: #014E9E;"></i> Reg No:
              </span>
              <span style="color: #014E9E; font-weight: 800; font-family: monospace; font-size: 0.85rem; background: #eff6ff; padding: 2px 8px; border-radius: 6px;">
                ${cert.regNo}
              </span>
            </div>
            ` : ''}

            ${cert.validUntil ? `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #e2e8f0; padding-bottom: 6px;">
              <span style="color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                <i class="fa fa-calendar-check-o" style="color: #16a34a;"></i> Valid Until:
              </span>
              <span style="color: #16a34a; font-weight: 700; font-size: 0.8rem;">
                ${cert.validUntil}
              </span>
            </div>
            ` : ''}

            ${cert.status ? `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                <i class="fa fa-shield" style="color: #16a34a;"></i> Status:
              </span>
              <span style="color: #15803d; font-weight: 700; font-size: 0.78rem;">
                ${cert.status}
              </span>
            </div>
            ` : ''}

          </div>

          <!-- Bottom Action Buttons: Edit + Delete -->
          <div style="display: flex; align-items: center; gap: 10px; margin-top: auto; border-top: 1px solid #f1f5f9; padding-top: 16px;">
            <button type="button" onclick="window.editAdminCert('${cert.id}')" style="flex: 1; background: linear-gradient(135deg, #014E9E 0%, #0284c7 100%); color: #ffffff; border: none; padding: 11px 18px; border-radius: 12px; font-size: 0.88rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(1, 78, 158, 0.25); transition: all 0.2s;" onmouseover="this.style.boxShadow='0 6px 18px rgba(1, 78, 158, 0.35)'" onmouseout="this.style.boxShadow='0 4px 14px rgba(1, 78, 158, 0.25)'">
              <i class="fa fa-pencil"></i> Edit Details
            </button>

            <button type="button" onclick="window.deleteAdminCert('${cert.id}')" style="background: #fee2e2; color: #b91c1c; border: 1.5px solid #fecaca; padding: 11px 14px; border-radius: 12px; font-size: 0.95rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" title="Delete this certificate permanently" onmouseover="this.style.background='#fecaca'" onmouseout="this.style.background='#fee2e2'">
              <i class="fa fa-trash-o"></i>
            </button>
          </div>

        </div>
      `;
    }).join('');
  }

  // --- Modal Add / Edit Operations ---
  const certModal = document.getElementById("certManagerModal");
  const certModalTitle = document.getElementById("certModalTitle");
  const certForm = document.getElementById("certManagerForm");

  window.openCertificateModal = function(certId) {
    if (!certModal) return;
    currentEditingCertId = certId || null;

    if (certId) {
      const certs = getCertificatesData();
      const cert = certs.find(c => c.id === certId);
      if (cert) {
        certModalTitle.textContent = "Edit Quality Certificate";
        document.getElementById("certFormId").value = cert.id;
        document.getElementById("certFormTitle").value = cert.title || "";
        document.getElementById("certFormSubtitle").value = cert.subtitle || "";
        document.getElementById("certFormIcon").value = cert.icon || "fa-certificate";
        document.getElementById("certFormShortDesc").value = cert.shortDesc || "";
        document.getElementById("certFormStandard").value = cert.standard || "";
        document.getElementById("certFormRegNo").value = cert.regNo || "";
        document.getElementById("certFormAuthority").value = cert.authority || "";
        document.getElementById("certFormAccreditation").value = cert.accreditation || "";
        document.getElementById("certFormOrg").value = cert.org || "PLASTOKAST";
        document.getElementById("certFormAddress").value = cert.address || "Ground Floor, Common Plot, Om Shree Sadguru Nityanand Co-operative Housing Society, Laxmikant Asharam Road, Katargram, Surat - 395004, Gujarat, India";
        document.getElementById("certFormIssueDate").value = cert.issueDate || "";
        document.getElementById("certFormValidUntil").value = cert.validUntil || "";
        document.getElementById("certFormStatus").value = cert.status || "Active Regulatory Compliance";
        document.getElementById("certFormScope").value = cert.scope || "";
        document.getElementById("certFormImage").value = cert.image || "";
        document.getElementById("certFormEnabled").checked = cert.enabled !== false;
      }
    } else {
      certModalTitle.textContent = "Add New Quality Certificate";
      if (certForm) certForm.reset();
      document.getElementById("certFormId").value = "";
      document.getElementById("certFormOrg").value = "PLASTOKAST";
      document.getElementById("certFormAddress").value = "Ground Floor, Common Plot, Om Shree Sadguru Nityanand Co-operative Housing Society, Laxmikant Asharam Road, Katargram, Surat - 395004, Gujarat, India";
      document.getElementById("certFormStatus").value = "Active Regulatory Compliance";
      document.getElementById("certFormIcon").value = "fa-certificate";
      document.getElementById("certFormEnabled").checked = true;
    }

    certModal.classList.add("show");
  };

  window.closeCertificateModal = function() {
    if (certModal) certModal.classList.remove("show");
  };

  window.editAdminCert = function(id) {
    window.openCertificateModal(id);
  };

  window.deleteAdminCert = function(id) {
    const certs = getCertificatesData();
    const cert = certs.find(c => c.id === id);
    if (!cert) return;

    if (confirm(`Are you sure you want to delete certificate "${cert.title}"? This will immediately remove it from the About Us Quality Standards section.`)) {
      deleteCertificate(id);
      renderCertificatesTable();
    }
  };

  window.toggleAdminCertStatus = function(id) {
    toggleCertificateEnabled(id);
    renderCertificatesTable();
  };

  window.resetCertificatesDefaults = function() {
    if (confirm("Reset all certificates to default factory configuration? Any custom certificates will be replaced.")) {
      resetCertificatesToDefault();
      renderCertificatesTable();
    }
  };

  // Form Submit Handler
  if (certForm) {
    certForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("certFormId").value;
      const certData = {
        title: document.getElementById("certFormTitle").value.trim(),
        subtitle: document.getElementById("certFormSubtitle").value.trim(),
        icon: document.getElementById("certFormIcon").value.trim() || "fa-certificate",
        shortDesc: document.getElementById("certFormShortDesc").value.trim(),
        standard: document.getElementById("certFormStandard").value.trim(),
        regNo: document.getElementById("certFormRegNo").value.trim(),
        authority: document.getElementById("certFormAuthority").value.trim(),
        accreditation: document.getElementById("certFormAccreditation").value.trim(),
        org: document.getElementById("certFormOrg").value.trim() || "PLASTOKAST",
        address: document.getElementById("certFormAddress").value.trim(),
        issueDate: document.getElementById("certFormIssueDate").value.trim(),
        validUntil: document.getElementById("certFormValidUntil").value.trim(),
        status: document.getElementById("certFormStatus").value.trim(),
        scope: document.getElementById("certFormScope").value.trim(),
        image: document.getElementById("certFormImage").value.trim(),
        enabled: document.getElementById("certFormEnabled").checked
      };

      if (!certData.title) {
        alert("Please enter a Certificate Title");
        return;
      }

      if (id) {
        updateCertificate(id, certData);
      } else {
        addCertificate(certData);
      }

      window.closeCertificateModal();
      renderCertificatesTable();
    });
  }

  // Handle Photo File Upload to Base64 in Modal
  const certFileInput = document.getElementById("certFormFileInput");
  if (certFileInput) {
    certFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          document.getElementById("certFormImage").value = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Search & Filter listeners
  if (certSearchInput) certSearchInput.addEventListener("input", renderCertificatesTable);
  if (certStatusFilter) certStatusFilter.addEventListener("change", renderCertificatesTable);

  // Initial Table Render
  renderCertificatesTable();

  // Expose global refresh
  window.refreshCertificates = renderCertificatesTable;
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof initAdminCertificates === "function") {
    initAdminCertificates();
  }
});
