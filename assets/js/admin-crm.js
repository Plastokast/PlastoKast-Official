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

    if (selectAllCheckbox) {
      const allBoxes = document.querySelectorAll('.lead-select-checkbox');
      selectAllCheckbox.checked = allBoxes.length > 0 && checkedBoxes.length === allBoxes.length;
    }
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
      renderTable();
    });
  }

  // Select All Checkbox Handler
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      document.querySelectorAll('.lead-select-checkbox').forEach(cb => {
        cb.checked = isChecked;
      });
      updateBulkDeleteState();
    });
  }

  // Permanent Delete Single Lead
  window.deleteSingleLead = function(id) {
    if (!confirm(`Are you sure you want to permanently delete lead inquiry ${id}?\n\nThis action cannot be undone.`)) return;
    
    let inquiries = getInquiries();
    inquiries = inquiries.filter(i => i.id !== id);
    localStorage.setItem('plastokast_inquiries', JSON.stringify(inquiries));
    
    renderTable();
    updateDashboardNotifications();
    if (window.updateLiveDemandAnalytics) window.updateLiveDemandAnalytics();
  };

  // Permanent Bulk Delete Selected Leads
  window.deleteSelectedLeads = function() {
    const checkedBoxes = document.querySelectorAll('.lead-select-checkbox:checked');
    const selectedIds = Array.from(checkedBoxes).map(cb => cb.getAttribute('data-id'));
    
    if (selectedIds.length === 0) return;

    if (!confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected lead inquiry records?\n\nThis action cannot be undone.`)) return;

    let inquiries = getInquiries();
    inquiries = inquiries.filter(i => !selectedIds.includes(i.id));
    localStorage.setItem('plastokast_inquiries', JSON.stringify(inquiries));

    isCrmDeleteMode = false;
    if (crmDeleteModeControls) crmDeleteModeControls.style.display = 'none';
    if (btnToggleCrmDeleteMode) btnToggleCrmDeleteMode.style.display = 'flex';
    if (selectAllCheckbox) selectAllCheckbox.checked = false;

    renderTable();
    updateDashboardNotifications();
    if (window.updateLiveDemandAnalytics) window.updateLiveDemandAnalytics();
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

  // 2. Render Table
  function renderTable() {
    if (!tableBody) return;
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const filterStatus = filterSelect ? filterSelect.value : 'All';

    // Show/Hide Checkbox Header Column
    const checkboxHeaders = document.querySelectorAll('.crm-checkbox-col');
    checkboxHeaders.forEach(th => {
      th.style.display = isCrmDeleteMode ? 'table-cell' : 'none';
    });
    
    let inquiries = getInquiries();
    
    // Filter
    inquiries = inquiries.filter(inq => {
      const matchSearch = inq.name.toLowerCase().includes(searchTerm) || (inq.facility && inq.facility.toLowerCase().includes(searchTerm)) || inq.id.toLowerCase().includes(searchTerm);
      const matchStatus = filterStatus === 'All' || inq.status === filterStatus;
      return matchSearch && matchStatus;
    });
    
    tableBody.innerHTML = '';
    
    if (inquiries.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="${isCrmDeleteMode ? 7 : 6}" style="padding: 24px; text-align: center; color: #64748b; font-weight: 600;">No lead inquiries found.</td></tr>`;
      updateBulkDeleteState();
      return;
    }
    
    inquiries.forEach(inq => {
      const isUnread = (inq.read === false || inq.read === undefined);

      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid #e2e8f0';
      tr.style.cursor = 'pointer';
      tr.style.transition = 'background 0.2s';
      if (isUnread) {
        tr.style.background = '#fefcfc';
      }
      
      tr.addEventListener('mouseenter', () => tr.style.background = isUnread ? '#fef2f2' : '#f8fafc');
      tr.addEventListener('mouseleave', () => tr.style.background = isUnread ? '#fefcfc' : 'transparent');
      
      // Click row to open dossier
      tr.addEventListener('click', () => openDossier(inq.id));
      
      // Status Badge Color
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

      // Prevent dossier popup when clicking checkbox
      const cb = tr.querySelector('.lead-select-checkbox');
      if (cb) {
        cb.addEventListener('click', (e) => {
          e.stopPropagation();
          updateBulkDeleteState();
        });
      }
      
      tableBody.appendChild(tr);
    });

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
      localStorage.setItem('plastokast_inquiries', JSON.stringify(inquiries));
      renderTable();
      updateDashboardNotifications();
    }
    
    const dateObj = new Date(inq.timestamp);
    
    dossierContent.innerHTML = `
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; color: var(--card-navy);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <strong>${inq.id}</strong>
          <span style="color: #64748b; font-size: 0.9rem;">${dateObj.toLocaleString()}</span>
        </div>
        <h3 style="font-size: 1.2rem; margin-bottom: 5px;">${inq.name}</h3>
        <p style="margin-bottom: 5px;"><i class="fa fa-envelope"></i> ${inq.email}</p>
        <p style="margin-bottom: 5px;"><i class="fa fa-building"></i> ${inq.facility || 'N/A'} (${inq.country || 'N/A'})</p>
      </div>
      
      <div style="background: white; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; color: var(--card-navy);">
        <h4 style="margin-bottom: 8px; font-size: 1rem;">Subject: ${inq.subject}</h4>
        <p style="white-space: pre-wrap; line-height: 1.5; color: #475569;">${inq.message || 'No message provided.'}</p>
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
        inquiries[inqIndex].status = statusSelect.value;
        localStorage.setItem('plastokast_inquiries', JSON.stringify(inquiries));
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
          <div style="text-align: center; padding: 15px; color: rgba(255,255,255,0.85); font-size: 0.88rem;">
            <i class="fa fa-check-circle" style="font-size: 2rem; color: #10b981; margin-bottom: 6px; display: block;"></i>
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
          item.style.cssText = `flex-direction: row; justify-content: space-between; align-items: center; cursor: pointer; ${idx < top3.length - 1 ? 'border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 8px;' : ''}`;
          item.title = 'Click to view dossier';
          item.innerHTML = `
            <span style="display: flex; align-items: center; gap: 8px; opacity: 1; font-weight: 600;"><i class="fa fa-user-circle"></i> ${inq.name}${countryStr}</span>
            <span style="font-size: 0.75rem; opacity: 0.85;">${timeAgo}</span>
          `;
          item.addEventListener('click', () => {
            if (window.switchAdminTab) window.switchAdminTab('crm');
            openDossier(inq.id);
          });
          listContainer.appendChild(item);
        });
      }
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
