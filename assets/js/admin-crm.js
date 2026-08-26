document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById('crmTableBody');
  const searchInput = document.getElementById('crmSearch');
  const filterSelect = document.getElementById('crmFilterStatus');
  
  const dossierModal = document.getElementById('dossierModal');
  const closeDossier = document.getElementById('closeDossierModal');
  const dossierContent = document.getElementById('dossierContent');
  const statusSelect = document.getElementById('dossierStatusSelect');
  const saveStatusBtn = document.getElementById('btnSaveStatus');

  let currentActiveInquiryId = null;

  // 1. Load data from localStorage
  function getInquiries() {
    let data = localStorage.getItem('plastokast_inquiries');
    if (data === null) {
      // Seed default sample data ONLY on a completely fresh browser session where key has never been set
      const dummy = [
        { id: 'REQ-4592', name: 'Dr. Sarah Jenkins', email: 's.jenkins@citymed.org', facility: 'City Med', country: 'US', subject: 'Fiberglass Tapes Bulk', message: 'Need pricing for 100 boxes.', status: 'Pending', read: false, timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 'REQ-1024', name: 'Yash', email: 'yash@example.com', facility: 'Self', country: 'India', subject: 'Distributorship', message: 'I want to distribute your products in my region.', status: 'Negotiating', read: false, timestamp: new Date(Date.now() - 172800000).toISOString() },
        { id: 'REQ-8831', name: 'Global Ortho Supplies', email: 'purchasing@globalortho.com', facility: 'Global Ortho', country: 'UK', subject: 'Catalog Request', message: 'Please send latest catalog.', status: 'Won', read: false, timestamp: new Date(Date.now() - 500000000).toISOString() }
      ];
      localStorage.setItem('plastokast_inquiries', JSON.stringify(dummy));
      return dummy;
    }
    try {
      return JSON.parse(data) || [];
    } catch(e) {
      return [];
    }
  }

  let isCrmDeleteMode = false;

  const btnToggleCrmDeleteMode = document.getElementById('btnToggleCrmDeleteMode');
  const crmDeleteModeControls = document.getElementById('crmDeleteModeControls');
  const btnConfirmCrmDelete = document.getElementById('btnConfirmCrmDelete');
  const btnCancelCrmDeleteMode = document.getElementById('btnCancelCrmDeleteMode');
  const selectedCrmCount = document.getElementById('selectedCrmCount');

  const selectAllCheckbox = document.getElementById('selectAllLeadsCheckbox');
  const btnDeleteCurrentLead = document.getElementById('btnDeleteCurrentLead');

  const selectAllCheckboxMobile = document.getElementById('selectAllLeadsCheckboxMobile');

  // Update Bulk Delete button state
  function updateBulkDeleteState() {
    const checkedBoxes = document.querySelectorAll('.lead-select-checkbox:checked');
    const count = checkedBoxes.length;
    
    if (selectedCrmCount) selectedCrmCount.textContent = count;
    
    if (btnConfirmCrmDelete) {
      if (count > 0) {
        btnConfirmCrmDelete.disabled = false;
        btnConfirmCrmDelete.style.cursor = 'pointer';
        btnConfirmCrmDelete.style.background = '#ef4444';
        btnConfirmCrmDelete.style.color = '#ffffff';
        btnConfirmCrmDelete.style.borderColor = '#ef4444';
        btnConfirmCrmDelete.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
      } else {
        btnConfirmCrmDelete.disabled = true;
        btnConfirmCrmDelete.style.cursor = 'not-allowed';
        btnConfirmCrmDelete.style.background = '#f1f5f9';
        btnConfirmCrmDelete.style.color = '#94a3b8';
        btnConfirmCrmDelete.style.borderColor = '#e2e8f0';
        btnConfirmCrmDelete.style.boxShadow = 'none';
      }
    }

    const allBoxes = document.querySelectorAll('.lead-select-checkbox');
    const allChecked = allBoxes.length > 0 && checkedBoxes.length === allBoxes.length;
    if (selectAllCheckbox) selectAllCheckbox.checked = allChecked;
    if (selectAllCheckboxMobile) selectAllCheckboxMobile.checked = allChecked;
  }

  // Toggle CRM Delete Mode ON
  if (btnToggleCrmDeleteMode) {
    btnToggleCrmDeleteMode.addEventListener('click', () => {
      isCrmDeleteMode = true;
      btnToggleCrmDeleteMode.style.display = 'none';
      if (crmDeleteModeControls) crmDeleteModeControls.style.display = 'flex';
      renderTable();
    });
  }

  // Toggle CRM Delete Mode OFF (Cancel)
  if (btnCancelCrmDeleteMode) {
    btnCancelCrmDeleteMode.addEventListener('click', () => {
      isCrmDeleteMode = false;
      if (crmDeleteModeControls) crmDeleteModeControls.style.display = 'none';
      if (btnToggleCrmDeleteMode) btnToggleCrmDeleteMode.style.display = 'flex';
      if (selectAllCheckbox) selectAllCheckbox.checked = false;
      if (selectAllCheckboxMobile) selectAllCheckboxMobile.checked = false;
      renderTable();
    });
  }

  // Select All Checkbox Handlers (Desktop + Mobile)
  function handleSelectAll(isChecked) {
    document.querySelectorAll('.lead-select-checkbox').forEach(cb => {
      cb.checked = isChecked;
    });
    updateBulkDeleteState();
  }

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => handleSelectAll(e.target.checked));
  }
  if (selectAllCheckboxMobile) {
    selectAllCheckboxMobile.addEventListener('change', (e) => handleSelectAll(e.target.checked));
  }

  // Permanent Delete Single Lead
  window.deleteSingleLead = function(id) {
    const doDelete = () => {
      if (window.PlastoKastDB && typeof window.PlastoKastDB.deleteInquiries === 'function') {
        window.PlastoKastDB.deleteInquiries(id);
      } else {
        let inquiries = getInquiries();
        inquiries = inquiries.filter(i => i.id !== id);
        localStorage.setItem('plastokast_inquiries', JSON.stringify(inquiries));
      }
      
      renderTable();
      updateDashboardNotifications();
      if (window.updateLiveDemandAnalytics) window.updateLiveDemandAnalytics();
    };

    if (typeof window.confirmCustomDelete === "function") {
      window.confirmCustomDelete({
        title: "Delete Lead Inquiry?",
        message: `Are you sure you want to permanently delete lead inquiry <strong>#${id}</strong>?`,
        onConfirm: doDelete
      });
    } else {
      if (confirm(`Delete lead #${id}?`)) doDelete();
    }
  };

  // Permanent Bulk Delete Selected Leads
  window.deleteSelectedLeads = function() {
    const checkedBoxes = document.querySelectorAll('.lead-select-checkbox:checked');
    const selectedIds = Array.from(checkedBoxes).map(cb => cb.getAttribute('data-id'));
    
    if (selectedIds.length === 0) return;

    const doDelete = () => {
      if (window.PlastoKastDB && typeof window.PlastoKastDB.deleteInquiries === 'function') {
        window.PlastoKastDB.deleteInquiries(selectedIds);
      } else {
        let inquiries = getInquiries();
        inquiries = inquiries.filter(i => !selectedIds.includes(i.id));
        localStorage.setItem('plastokast_inquiries', JSON.stringify(inquiries));
      }

      isCrmDeleteMode = false;
      if (crmDeleteModeControls) crmDeleteModeControls.style.display = 'none';
      if (btnToggleCrmDeleteMode) btnToggleCrmDeleteMode.style.display = 'flex';
      if (selectAllCheckbox) selectAllCheckbox.checked = false;

      renderTable();
      updateDashboardNotifications();
      if (window.updateLiveDemandAnalytics) window.updateLiveDemandAnalytics();
    };

    if (typeof window.confirmCustomDelete === "function") {
      window.confirmCustomDelete({
        title: "Delete Selected Leads?",
        message: `Are you sure you want to permanently delete <strong>${selectedIds.length} selected lead inquiry records</strong>?`,
        onConfirm: doDelete
      });
    } else {
      if (confirm(`Delete ${selectedIds.length} leads?`)) doDelete();
    }
  };

  if (btnConfirmCrmDelete) {
    btnConfirmCrmDelete.addEventListener('click', window.deleteSelectedLeads);
  }

  if (btnDeleteCurrentLead) {
    btnDeleteCurrentLead.addEventListener('click', () => {
      if (!currentActiveInquiryId) return;
      window.deleteSingleLead(currentActiveInquiryId);
      if (dossierModal) dossierModal.classList.remove('show');
    });
  }

  // 2. Render Table and Mobile Lead Cards
  function renderTable() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const filterStatus = filterSelect ? filterSelect.value : 'All';

    // Show/Hide Checkbox Header Column
    const checkboxHeaders = document.querySelectorAll('.crm-checkbox-col');
    checkboxHeaders.forEach(th => {
      th.style.display = isCrmDeleteMode ? 'table-cell' : 'none';
    });

    const crmMobileSelectAllBar = document.getElementById('crmMobileSelectAllBar');
    if (crmMobileSelectAllBar) {
      crmMobileSelectAllBar.style.display = isCrmDeleteMode ? 'flex' : 'none';
    }
    
    let inquiries = getInquiries();
    
    // Filter
    inquiries = inquiries.filter(inq => {
      const matchSearch = (inq.name && inq.name.toLowerCase().includes(searchTerm)) || 
                          (inq.facility && inq.facility.toLowerCase().includes(searchTerm)) || 
                          (inq.id && inq.id.toLowerCase().includes(searchTerm)) ||
                          (inq.email && inq.email.toLowerCase().includes(searchTerm)) ||
                          (inq.subject && inq.subject.toLowerCase().includes(searchTerm));
      const matchStatus = filterStatus === 'All' || inq.status === filterStatus;
      return matchSearch && matchStatus;
    });
    
    // A. Render Desktop Table Body
    if (tableBody) {
      tableBody.innerHTML = '';
      if (inquiries.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="${isCrmDeleteMode ? 7 : 6}" style="padding: 28px; text-align: center; color: #64748b; font-weight: 600;">No lead inquiries found.</td></tr>`;
      } else {
        inquiries.forEach(inq => {
          const isUnread = (inq.read === false || inq.read === undefined);

          const tr = document.createElement('tr');
          tr.style.borderBottom = '1px solid #e2e8f0';
          tr.style.cursor = 'pointer';
          tr.style.transition = 'background 0.2s';
          if (isUnread) tr.style.background = '#fefcfc';
          
          tr.addEventListener('mouseenter', () => tr.style.background = isUnread ? '#fef2f2' : '#f8fafc');
          tr.addEventListener('mouseleave', () => tr.style.background = isUnread ? '#fefcfc' : 'transparent');
          tr.addEventListener('click', () => openDossier(inq.id));
          
          let badgeColor = '#475569';
          if (inq.status === 'Pending') badgeColor = '#d97706';
          if (inq.status === 'Negotiating') badgeColor = '#2563eb';
          if (inq.status === 'Won') badgeColor = '#059669';
          if (inq.status === 'Lost') badgeColor = '#dc2626';

          const dateObj = new Date(inq.timestamp);
          const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

          const unreadDotHtml = isUnread ? `<span class="unread-red-dot" title="New Unread Inquiry"></span>` : '';
          const newBadgeHtml = isUnread ? `<span style="background: #fef2f2; color: #ef4444; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 6px; border: 1px solid #fecaca; margin-left: 6px; vertical-align: middle;">NEW</span>` : '';

          tr.innerHTML = `
            <td class="crm-checkbox-col" style="padding: 16px 14px; text-align: center; display: ${isCrmDeleteMode ? 'table-cell' : 'none'};">
              <input type="checkbox" class="lead-select-checkbox" data-id="${inq.id}" style="width: 18px; height: 18px; cursor: pointer; accent-color: #ef4444;">
            </td>
            <td style="padding: 16px 20px; font-family: monospace; color: #475569; font-weight: ${isUnread ? '700' : '600'};">
              ${inq.id} ${unreadDotHtml}
            </td>
            <td style="padding: 16px 20px;">
              <div style="font-weight: ${isUnread ? '800' : '700'}; color: #0f172a; display: flex; align-items: center;">${inq.name} ${newBadgeHtml}</div>
              <div style="font-size: 0.85rem; color: #64748b;">${inq.email}</div>
            </td>
            <td style="padding: 16px 20px; color: #334155; font-weight: ${isUnread ? '600' : '500'};">${inq.subject}</td>
            <td style="padding: 16px 20px; color: #475569; font-size: 0.9rem;">${dateStr}</td>
            <td style="padding: 16px 20px;">
              <span style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; background: ${badgeColor}15; color: ${badgeColor}; border: 1px solid ${badgeColor}40;">
                ${inq.status}
              </span>
            </td>
          `;

          const cb = tr.querySelector('.lead-select-checkbox');
          if (cb) {
            cb.addEventListener('click', (e) => {
              e.stopPropagation();
              updateBulkDeleteState();
            });
          }
          
          tableBody.appendChild(tr);
        });
      }
    }

    // B. Render Mobile Lead Cards Container (#crmMobileCardsList)
    const mobileCardsList = document.getElementById('crmMobileCardsList');
    if (mobileCardsList) {
      mobileCardsList.innerHTML = '';
      if (inquiries.length === 0) {
        mobileCardsList.innerHTML = `
          <div style="text-align: center; padding: 32px 16px; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 18px; color: #64748b;">
            <i class="fa fa-inbox" style="font-size: 1.8rem; color: #94a3b8; margin-bottom: 8px; display: block;"></i>
            <div style="font-weight: 700; font-size: 0.92rem; color: #1e293b;">No Inquiries Found</div>
            <div style="font-size: 0.78rem; margin-top: 2px;">Try adjusting your search or status filter.</div>
          </div>
        `;
      } else {
        inquiries.forEach(inq => {
          const isUnread = (inq.read === false || inq.read === undefined);
          const timeAgo = formatRelativeTime(inq.timestamp);

          let badgeColor = '#475569';
          let badgeBg = '#f1f5f9';
          let badgeBorder = '#e2e8f0';
          if (inq.status === 'Pending') {
            badgeColor = '#d97706';
            badgeBg = '#fef3c7';
            badgeBorder = '#fde68a';
          } else if (inq.status === 'Negotiating') {
            badgeColor = '#2563eb';
            badgeBg = '#eff6ff';
            badgeBorder = '#bfdbfe';
          } else if (inq.status === 'Won') {
            badgeColor = '#059669';
            badgeBg = '#d1fae5';
            badgeBorder = '#a7f3d0';
          } else if (inq.status === 'Lost') {
            badgeColor = '#dc2626';
            badgeBg = '#fee2e2';
            badgeBorder = '#fecaca';
          }

          const card = document.createElement('div');
          card.className = 'crm-lead-card';
          card.style.cssText = `background: #ffffff; border: 1px solid ${isUnread ? '#fecaca' : '#e2e8f0'}; border-radius: 18px; padding: 14px 16px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03); ${isUnread ? 'border-left: 4px solid #ef4444; background: #fffcfc;' : ''}`;
          
          card.innerHTML = `
            <!-- Top Bar: ID + Status + Time -->
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                ${isCrmDeleteMode ? `<input type="checkbox" class="lead-select-checkbox lead-select-checkbox-mobile" data-id="${inq.id}" style="width: 18px; height: 18px; cursor: pointer; accent-color: #ef4444;">` : ''}
                <span style="font-family: monospace; font-weight: 800; font-size: 0.78rem; background: #f1f5f9; color: #475569; padding: 2px 7px; border-radius: 6px;">#${inq.id}</span>
                ${isUnread ? `<span style="background: #fef2f2; color: #ef4444; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 6px; border: 1px solid #fecaca;">NEW</span>` : ''}
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="display: inline-block; padding: 3px 9px; border-radius: 12px; font-size: 0.72rem; font-weight: 800; background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder};">${inq.status}</span>
              </div>
            </div>

            <!-- Client Name & Facility -->
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem; line-height: 1.3;">
                <i class="fa fa-user-circle" style="color: #3b82f6; margin-right: 4px;"></i> ${inq.name}
                ${inq.facility && inq.facility !== 'Self' ? `<span style="font-weight: 600; color: #64748b; font-size: 0.78rem;"> • ${inq.facility}</span>` : ''}
              </div>
              <span style="font-size: 0.72rem; font-weight: 600; color: #94a3b8; white-space: nowrap; flex-shrink: 0;"><i class="fa fa-clock"></i> ${timeAgo}</span>
            </div>

            <!-- Contact Snippet -->
            <div style="display: flex; gap: 10px; font-size: 0.78rem; color: #64748b; margin-top: 4px; flex-wrap: wrap;">
              ${inq.email ? `<span><i class="fa fa-envelope" style="color: #94a3b8;"></i> ${inq.email}</span>` : ''}
              ${inq.country ? `<span><i class="fa fa-map-marker-alt" style="color: #94a3b8;"></i> ${inq.country}</span>` : ''}
            </div>

            <!-- Subject Pill & Tap Arrow -->
            <div style="margin-top: 10px; padding: 8px 12px; background: #f8fafc; border-radius: 10px; border: 1px solid #f1f5f9; font-size: 0.8rem; font-weight: 600; color: #334155; display: flex; align-items: center; justify-content: space-between;">
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80%;"><i class="fa fa-tag" style="color: #6366f1; margin-right: 6px;"></i> ${inq.subject || 'RFQ Inquiry'}</span>
              <span style="color: #2563eb; font-weight: 800; font-size: 0.75rem; display: flex; align-items: center; gap: 2px;">Details <i class="fa fa-chevron-right" style="font-size: 0.65rem;"></i></span>
            </div>
          `;

          card.addEventListener('click', () => openDossier(inq.id));

          const mcb = card.querySelector('.lead-select-checkbox-mobile');
          if (mcb) {
            mcb.addEventListener('click', (e) => {
              e.stopPropagation();
              updateBulkDeleteState();
            });
          }

          mobileCardsList.appendChild(card);
        });
      }
    }

    updateBulkDeleteState();
  }

  // 3. Open Dossier
  function openDossier(id) {
    const inquiries = getInquiries();
    const inqIndex = inquiries.findIndex(i => i.id === id);
    if (inqIndex === -1) return;

    const inq = inquiries[inqIndex];
    currentActiveInquiryId = id;

    // Automatically mark lead as READ when opened!
    if (inq.read !== true) {
      inquiries[inqIndex].read = true;
      if (window.PlastoKastDB && typeof window.PlastoKastDB.updateInquiry === 'function') {
        window.PlastoKastDB.updateInquiry(inq.id, { read: true });
      } else {
        localStorage.setItem('plastokast_inquiries', JSON.stringify(inquiries));
      }
      renderTable();
      updateDashboardNotifications();
    }
    
    const dateObj = new Date(inq.timestamp);
    const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const timeAgo = formatRelativeTime(inq.timestamp);
    
    dossierContent.innerHTML = `
      <!-- Top Overview Card -->
      <div style="background: #f8fafc; padding: 18px; border-radius: 16px; border: 1px solid #e2e8f0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
          <span style="font-family: monospace; font-weight: 800; font-size: 0.85rem; background: #ffffff; color: #1e293b; padding: 4px 10px; border-radius: 8px; border: 1px solid #cbd5e1;">#${inq.id}</span>
          <span style="font-size: 0.76rem; font-weight: 700; color: #64748b;"><i class="fa fa-clock"></i> ${timeAgo} (${dateFormatted})</span>
        </div>

        <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px;">
          <i class="fa fa-user-circle" style="color: #2563eb;"></i> ${inq.name}
        </h3>

        <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem; color: #475569; margin-top: 8px;">
          ${inq.email ? `<div><i class="fa fa-envelope" style="color: #64748b; width: 18px;"></i> <a href="mailto:${inq.email}" style="color: #2563eb; font-weight: 600; text-decoration: none;">${inq.email}</a></div>` : ''}
          ${inq.phone ? `<div><i class="fa fa-phone" style="color: #64748b; width: 18px;"></i> <a href="tel:${inq.phone}" style="color: #2563eb; font-weight: 600; text-decoration: none;">${inq.phone}</a></div>` : ''}
          <div><i class="fa fa-building" style="color: #64748b; width: 18px;"></i> <strong style="color: #1e293b;">Facility:</strong> ${inq.facility || 'Individual Buyer'} ${inq.country ? `(${inq.country})` : ''}</div>
        </div>
      </div>
      
      <!-- Inquiry Message / RFQ Details Card -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 18px; border-radius: 16px;">
        <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; margin-bottom: 6px;">Inquiry Subject</div>
        <h4 style="margin: 0 0 12px 0; font-size: 1.05rem; font-weight: 800; color: #0f172a;">${inq.subject || 'Standard RFQ Request'}</h4>
        <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; margin-bottom: 6px;">Message / Specifications</div>
        <div style="white-space: pre-wrap; line-height: 1.6; color: #334155; font-size: 0.88rem; background: #f8fafc; padding: 12px 14px; border-radius: 12px; border: 1px solid #f1f5f9;">${inq.message || 'No additional message text provided.'}</div>
      </div>
    `;
    
    statusSelect.value = inq.status;
    dossierModal.classList.add('show');
  }

  // 4. Save Status
  if (saveStatusBtn) {
    saveStatusBtn.addEventListener('click', () => {
      if (!currentActiveInquiryId) return;
      
      const inquiries = getInquiries();
      const inqIndex = inquiries.findIndex(i => i.id === currentActiveInquiryId);
      
      if (inqIndex > -1) {
        const newStatus = statusSelect.value;
        inquiries[inqIndex].status = newStatus;
        if (window.PlastoKastDB && typeof window.PlastoKastDB.updateInquiry === 'function') {
          window.PlastoKastDB.updateInquiry(currentActiveInquiryId, { status: newStatus });
        } else {
          localStorage.setItem('plastokast_inquiries', JSON.stringify(inquiries));
        }
        renderTable();
        dossierModal.classList.remove('show');
      }
    });
  }

  // 5. Event Listeners & Auto-Sync
  if (searchInput) searchInput.addEventListener('input', renderTable);
  if (filterSelect) filterSelect.addEventListener('change', renderTable);
  if (closeDossier) closeDossier.addEventListener('click', () => dossierModal.classList.remove('show'));
  
  if (dossierModal) {
    dossierModal.addEventListener('click', (e) => {
      if (e.target === dossierModal) dossierModal.classList.remove('show');
    });
  }

  // 6. Live Dashboard Notification Card Manager (Reflects ONLY UNREAD Leads)
  function formatRelativeTime(dateString) {
    if (!dateString) return 'recently';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + 'm ago';
    if (diffHours < 24) return diffHours + 'h ago';
    return diffDays + 'd ago';
  }

  function updateDashboardNotifications() {
    const inquiries = getInquiries();
    // Filter inquiries to ONLY unread ones (read === false or undefined)
    const unreadInquiries = inquiries.filter(i => i.read === false || i.read === undefined);
    const count = unreadInquiries.length;

    const bellIcon = document.getElementById('dashboard-bell-icon');
    const unreadBadge = document.getElementById('dashboard-unread-badge');
    const listContainer = document.getElementById('dashboard-inquiry-list');
    const crmBadge = document.getElementById('dashboard-crm-btn-badge');

    if (unreadBadge) {
      if (count > 0) {
        unreadBadge.textContent = count + " Unread";
        unreadBadge.className = 'orb-label live-pulse-badge';
        unreadBadge.style.color = '#ef4444';
      } else {
        unreadBadge.textContent = "All Caught Up!";
        unreadBadge.className = 'orb-label';
        unreadBadge.style.color = '#10b981';
      }
    }

    if (crmBadge) {
      crmBadge.textContent = "+" + count;
      crmBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }

    if (bellIcon) {
      if (count > 0) {
        bellIcon.classList.add('live-bell-active');
      } else {
        bellIcon.classList.remove('live-bell-active');
      }
    }

    if (listContainer) {
      listContainer.innerHTML = '';
      if (unreadInquiries.length === 0) {
        listContainer.innerHTML = `
          <div style="text-align: center; padding: 10px 14px; background: rgba(255,255,255,0.12); border-radius: 12px; color: rgba(255,255,255,0.95); font-size: 0.82rem; font-weight: 600; border: 1px solid rgba(255,255,255,0.18);">
            <i class="fa fa-check-circle" style="color: #4ade80; margin-right: 6px;"></i>
            No unread inquiries. All caught up!
          </div>
        `;
      } else {
        const top3 = unreadInquiries.slice(0, 3);
        top3.forEach((inq, idx) => {
          const timeAgo = formatRelativeTime(inq.timestamp);
          const countryStr = inq.country ? ` (${inq.country})` : '';
          const item = document.createElement('div');
          item.className = 'stat-item';
          item.style.cssText = `width: 100%; display: flex; flex-direction: row; justify-content: space-between; align-items: center; cursor: pointer; padding: 10px 14px; background: rgba(255,255,255,0.14); border-radius: 14px; border: 1px solid rgba(255,255,255,0.22); margin-bottom: 6px; box-sizing: border-box; backdrop-filter: blur(10px); transition: all 0.2s ease;`;
          item.title = 'Click to view dossier';
          item.innerHTML = `
            <span style="display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.86rem; color: #ffffff; text-shadow: 0 1px 3px rgba(0,0,0,0.2);">
              <i class="fa fa-user-circle" style="font-size: 1rem; color: #fef08a;"></i> ${inq.name}${countryStr}
            </span>
            <span style="font-size: 0.74rem; font-weight: 700; color: #fef08a; background: rgba(0,0,0,0.18); padding: 3px 8px; border-radius: 8px; white-space: nowrap;">${timeAgo}</span>
          `;
          item.addEventListener('click', () => {
            if (window.switchAdminTab) window.switchAdminTab('crm');
            openDossier(inq.id);
          });
          listContainer.appendChild(item);
        });
      }
    }

    const emailBadge = document.getElementById('crmActiveAdminEmail');
    if (emailBadge && typeof getSiteSettings === 'function') {
      const s = getSiteSettings();
      emailBadge.textContent = s.adminLeadEmail || 'ankitdobariya34@gmail.com';
    }
  }

  // Expose global refresh function
  window.refreshCrmTable = () => {
    renderTable();
    updateDashboardNotifications();
    if (typeof window.updateLiveDemandAnalytics === 'function') {
      window.updateLiveDemandAnalytics();
    }
  };

  // Auto-refresh when tab comes into focus or storage changes (instant real-time sync!)
  window.addEventListener('focus', () => {
    renderTable();
    updateDashboardNotifications();
    if (typeof window.updateLiveDemandAnalytics === 'function') {
      window.updateLiveDemandAnalytics();
    }
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'plastokast_inquiries') {
      renderTable();
      updateDashboardNotifications();
      if (typeof window.updateLiveDemandAnalytics === 'function') {
        window.updateLiveDemandAnalytics();
      }
    }
  });

  // Connect Firebase Real-Time Firestore Listener for Instant Cloud Sync across Mobile & Desktop
  if (window.PlastoKastDB && typeof window.PlastoKastDB.onInquiriesChange === 'function') {
    window.PlastoKastDB.onInquiriesChange((inquiries) => {
      renderTable();
      updateDashboardNotifications();
      if (typeof window.updateLiveDemandAnalytics === 'function') {
        window.updateLiveDemandAnalytics();
      }
    });
  }

  // Also hook into status saves
  if (saveStatusBtn) {
    saveStatusBtn.addEventListener('click', () => {
      setTimeout(() => {
        updateDashboardNotifications();
        if (typeof window.updateLiveDemandAnalytics === 'function') {
          window.updateLiveDemandAnalytics();
        }
      }, 100);
    });
  }

  // Initial render
  renderTable();
  updateDashboardNotifications();
  if (typeof window.updateLiveDemandAnalytics === 'function') {
    window.updateLiveDemandAnalytics();
  }
});
