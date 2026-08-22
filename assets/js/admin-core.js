document.addEventListener('DOMContentLoaded', () => {

  // Handle Sidebar Navigation
  const navItems = document.querySelectorAll('.sidebar .nav-item[data-target]');
  const viewSections = document.querySelectorAll('.main-content .view-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // 1. Remove active class from all nav items
      navItems.forEach(nav => nav.classList.remove('active'));
      
      // 2. Add active class to clicked item
      item.classList.add('active');
      
      // 3. Hide all views
      viewSections.forEach(view => view.classList.remove('active'));
      
      // 4. Show target view
      const targetId = item.getAttribute('data-target');
      const targetView = document.getElementById(targetId);
      if (targetView) {
        targetView.classList.add('active');
        if (targetId === 'view-crm' && typeof window.refreshCrmTable === 'function') {
          window.refreshCrmTable();
        } else if (targetId === 'view-catalog' && typeof window.refreshCatalog === 'function') {
          window.refreshCatalog();
        } else if (targetId === 'view-certificates' && typeof window.refreshCertificates === 'function') {
          window.refreshCertificates();
        }
      }
    });
  });

  // Populate Live Banner Date
  const bannerLiveDate = document.getElementById('bannerLiveDate');
  if (bannerLiveDate) {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
    bannerLiveDate.textContent = now.toLocaleDateString('en-US', options);
  }

  // --- Chart Interactivity ---
  const chartArea = document.querySelector('.card-chart .chart-area');
  
  // 1. Create Modal in DOM
  const modalHTML = `
    <div class="chart-modal" id="chartModal">
      <div class="chart-modal-content">
        <i class="fa fa-times chart-modal-close" id="closeChartModal"></i>
        <div class="chart-header" style="margin-bottom: 40px;">
          <h2 style="font-size: 2rem;">Detailed Inquiry Volume</h2>
          <div class="chart-legend">
            <span><span class="legend-dot peach"></span> Hospitals</span>
            <span><span class="legend-dot purple"></span> Distributors</span>
          </div>
        </div>
        <div class="chart-area" id="modalChartArea" style="flex: 1; min-height: 400px;">
          <!-- Cloned chart will go here -->
        </div>
      </div>
    </div>
    <div class="chart-hover-info" id="chartTooltip"></div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const chartModal = document.getElementById('chartModal');
  const closeBtn = document.getElementById('closeChartModal');
  const modalChartArea = document.getElementById('modalChartArea');
  const tooltip = document.getElementById('chartTooltip');

  // 2. Open Modal on Click
  if (chartArea) {
    chartArea.addEventListener('click', () => {
      modalChartArea.innerHTML = chartArea.innerHTML; // Clone the chart visually
      chartModal.classList.add('show');
      setupHoverEffects(modalChartArea); // Setup hover for the big chart
    });
  }

  // 3. Close Modal
  if (closeBtn) {
    closeBtn.addEventListener('click', () => chartModal.classList.remove('show'));
  }
  if (chartModal) {
    chartModal.addEventListener('click', (e) => {
      if (e.target === chartModal) chartModal.classList.remove('show');
    });
  }

  // 4. Hover Tooltips Logic
  function setupHoverEffects(container) {
    if (!container) return;
    const bars = container.querySelectorAll('.bar');
    bars.forEach(bar => {
      bar.addEventListener('mouseenter', (e) => {
        const heightStr = bar.style.height;
        const percent = parseInt(heightStr) || 0;
        const type = bar.classList.contains('peach') ? 'Hospitals' : 'Distributors';
        const value = Math.floor(percent * 5); 
        
        if (tooltip) {
          tooltip.innerHTML = `${type}: <strong>${value}</strong>`;
          tooltip.classList.add('show');
        }
      });

      bar.addEventListener('mousemove', (e) => {
        if (tooltip) {
          tooltip.style.left = e.pageX + 'px';
          tooltip.style.top = e.pageY + 'px';
        }
      });

      bar.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.classList.remove('show');
      });
    });
  }

  if (chartArea) {
    setupHoverEffects(chartArea);
  }

  // --- 5. Donut Ring Interactive Hover & Detailed Analytics Popup Modal ---
  const donutSegments = document.querySelectorAll('.donut-segment');
  const legendHoverItems = document.querySelectorAll('.legend-hover-item');
  const donutCenterLeads = document.getElementById('donutCenterLeads');
  const donutCenterTitle = document.getElementById('donutCenterTitle');
  const demandAnalyticsModal = document.getElementById('demandAnalyticsModal');

  // Global functions for modal opening/closing
  window.openDemandAnalyticsModal = function() {
    const modal = document.getElementById('demandAnalyticsModal');
    if (modal) {
      modal.classList.add('show');
    }
  };

  window.closeDemandAnalyticsModal = function() {
    const modal = document.getElementById('demandAnalyticsModal');
    if (modal) {
      modal.classList.remove('show');
    }
  };

  if (donutSegments.length > 0) {
    donutSegments.forEach((segment) => {
      segment.addEventListener('mouseenter', () => {
        donutSegments.forEach(s => s.setAttribute('stroke-width', '32'));
        segment.setAttribute('stroke-width', '38');

        const title = segment.getAttribute('data-title');
        const leads = segment.getAttribute('data-leads');
        const percent = segment.getAttribute('data-percent') || '';
        const rank = segment.getAttribute('data-rank');
        const color = segment.getAttribute('data-color');
        const donutCenterInfo = document.getElementById('donutCenterInfo');
        const donutCenterIcon = document.getElementById('donutCenterIcon');

        if (donutCenterLeads) {
          donutCenterLeads.textContent = `${leads} (${percent})`;
          donutCenterLeads.style.color = color;
        }
        if (donutCenterTitle) {
          donutCenterTitle.textContent = `${rank}: ${title}`;
        }
        if (donutCenterIcon) {
          donutCenterIcon.style.color = color;
        }
        if (donutCenterInfo) {
          donutCenterInfo.style.borderColor = color;
          donutCenterInfo.style.background = '#ffffff';
          donutCenterInfo.style.boxShadow = `0 4px 14px ${color}22`;
        }
      });

      segment.addEventListener('mouseleave', () => {
        segment.setAttribute('stroke-width', '32');
        if (typeof window.updateLiveDemandAnalytics === 'function') {
          window.updateLiveDemandAnalytics();
        }
      });
    });

    if (legendHoverItems.length > 0) {
      legendHoverItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          const idx = parseInt(item.getAttribute('data-segment')) || 0;
          if (donutSegments[idx]) {
            const event = new Event('mouseenter');
            donutSegments[idx].dispatchEvent(event);
            item.style.background = '#eff6ff';
            item.style.borderColor = '#bfdbfe';
          }
        });

        item.addEventListener('mouseleave', () => {
          const idx = parseInt(item.getAttribute('data-segment')) || 0;
          if (donutSegments[idx]) {
            donutSegments[idx].setAttribute('stroke-width', '32');
            item.style.background = '#f8fafc';
            item.style.borderColor = '#e2e8f0';
            if (typeof window.updateLiveDemandAnalytics === 'function') {
              window.updateLiveDemandAnalytics();
            }
          }
        });
      });
    }
  }

  // Click handler for modal backdrop close
  if (demandAnalyticsModal) {
    demandAnalyticsModal.addEventListener('click', (e) => {
      if (e.target === demandAnalyticsModal || e.target.id === 'closeDemandAnalyticsModal') {
        demandAnalyticsModal.classList.remove('show');
      }
    });
  }

  // --- 6. Demand Analytics Modal Filter & Custom Date Range Logic ---
  const demandPeriodFilter = document.getElementById('demandPeriodFilter');
  const demandBuyerFilter = document.getElementById('demandBuyerFilter');
  const demandRegionFilter = document.getElementById('demandRegionFilter');
  const customDateRangeBox = document.getElementById('customDateRangeBox');
  const btnApplyCustomDate = document.getElementById('btnApplyCustomDate');
  const demandFilterSummaryBadge = document.getElementById('demandFilterSummaryBadge');
  const demandStartDate = document.getElementById('demandStartDate');
  const demandEndDate = document.getElementById('demandEndDate');

  function updateDemandModalFilterState() {
    if (!demandPeriodFilter || !demandFilterSummaryBadge) return;

    const periodVal = demandPeriodFilter.value;
    const regionText = demandRegionFilter ? demandRegionFilter.options[demandRegionFilter.selectedIndex].text : 'Global Markets';

    if (periodVal === 'custom') {
      if (customDateRangeBox) customDateRangeBox.style.display = 'flex';
      const sDate = demandStartDate?.value || '2026-08-01';
      const eDate = demandEndDate?.value || '2026-08-15';
      demandFilterSummaryBadge.innerHTML = `<i class="fa fa-filter"></i> Active Filter: <strong>Custom Range (${sDate} to ${eDate})</strong> | ${regionText}`;
    } else {
      if (customDateRangeBox) customDateRangeBox.style.display = 'none';
      const periodText = demandPeriodFilter.options[demandPeriodFilter.selectedIndex].text;
      demandFilterSummaryBadge.innerHTML = `<i class="fa fa-filter"></i> Active Filter: <strong>${periodText}</strong> | ${regionText}`;
    }

    if (typeof window.updateLiveDemandAnalytics === 'function') {
      window.updateLiveDemandAnalytics();
    }
  }

  if (demandPeriodFilter) demandPeriodFilter.addEventListener('change', updateDemandModalFilterState);
  if (demandRegionFilter) demandRegionFilter.addEventListener('change', updateDemandModalFilterState);
  if (btnApplyCustomDate) btnApplyCustomDate.addEventListener('click', updateDemandModalFilterState);
  if (demandStartDate) demandStartDate.addEventListener('change', updateDemandModalFilterState);
  if (demandEndDate) demandEndDate.addEventListener('change', updateDemandModalFilterState);

  // --- 7. Instant RFQ Price & Freight Estimator Modal Logic ---
  window.openQuickQuoteModal = function() {
    const modal = document.getElementById('quickQuoteModal');
    if (modal) modal.classList.add('show');
  };

  window.closeQuickQuoteModal = function() {
    const modal = document.getElementById('quickQuoteModal');
    if (modal) modal.classList.remove('show');
  };

  const quoteProductSelect = document.getElementById('quoteProductSelect');
  const quoteQtyInput = document.getElementById('quoteQtyInput');
  const quoteQtyDisplay = document.getElementById('quoteQtyDisplay');
  const quoteUnitPrice = document.getElementById('quoteUnitPrice');
  const quoteDiscount = document.getElementById('quoteDiscount');
  const quoteTotalPrice = document.getElementById('quoteTotalPrice');
  const quickQuoteModal = document.getElementById('quickQuoteModal');

  function calculateQuickQuote() {
    if (!quoteProductSelect || !quoteQtyInput) return;
    const selectedOpt = quoteProductSelect.options[quoteProductSelect.selectedIndex];
    const basePrice = parseFloat(selectedOpt.getAttribute('data-price')) || 4.50;
    const qty = parseInt(quoteQtyInput.value) || 2500;

    let discountPct = 0;
    if (qty >= 20000) discountPct = 0.20;
    else if (qty >= 10000) discountPct = 0.15;
    else if (qty >= 2500) discountPct = 0.10;
    else if (qty >= 1000) discountPct = 0.05;

    const finalUnitPrice = basePrice * (1 - discountPct);
    const total = qty * finalUnitPrice;

    if (quoteQtyDisplay) quoteQtyDisplay.textContent = `${qty.toLocaleString()} Rolls`;
    if (quoteUnitPrice) quoteUnitPrice.textContent = `$${basePrice.toFixed(2)} / roll`;
    if (quoteDiscount) quoteDiscount.textContent = discountPct > 0 ? `${(discountPct * 100)}% Bulk Discount Applied` : 'Standard FOB Pricing';
    if (quoteTotalPrice) quoteTotalPrice.textContent = `$${Math.round(total).toLocaleString()} USD`;
  }

  if (quoteProductSelect) quoteProductSelect.addEventListener('change', calculateQuickQuote);
  if (quoteQtyInput) quoteQtyInput.addEventListener('input', calculateQuickQuote);
  if (quickQuoteModal) {
    quickQuoteModal.addEventListener('click', (e) => {
      if (e.target === quickQuoteModal || e.target.id === 'closeQuickQuoteModal') {
        quickQuoteModal.classList.remove('show');
      }
    });
  }

  // --- 8. REAL-TIME LIVE DEMAND ANALYTICS CALCULATION ENGINE (PURE REAL DATA) ---
  window.updateLiveDemandAnalytics = function() {
    let inquiries = [];
    try {
      const raw = localStorage.getItem('plastokast_inquiries');
      if (raw) inquiries = JSON.parse(raw);
    } catch(err) {}

    // Filter inquiries by period & region if filters exist
    const periodVal = demandPeriodFilter ? demandPeriodFilter.value : 'ytd';
    const regionVal = demandRegionFilter ? demandRegionFilter.value : 'global';
    const now = new Date();

    if (inquiries.length > 0) {
      inquiries = inquiries.filter(inq => {
        // Region check
        if (regionVal !== 'global') {
          const country = (inq.country || '').toLowerCase();
          if (regionVal === 'in' && !country.includes('in') && !country.includes('india')) return false;
          if (regionVal === 'us' && !country.includes('us') && !country.includes('usa')) return false;
          if (regionVal === 'ae' && !country.includes('ae') && !country.includes('uae') && !country.includes('dubai')) return false;
          if (regionVal === 'uk' && !country.includes('uk') && !country.includes('britain') && !country.includes('england')) return false;
        }

        // Period check
        if (inq.timestamp) {
          const inqDate = new Date(inq.timestamp);
          if (periodVal === 'today') {
            if (inqDate.toDateString() !== now.toDateString()) return false;
          } else if (periodVal === '7d') {
            if ((now - inqDate) > (7 * 86400000)) return false;
          } else if (periodVal === '30d') {
            if ((now - inqDate) > (30 * 86400000)) return false;
          } else if (periodVal === 'custom') {
            const sVal = demandStartDate ? new Date(demandStartDate.value + 'T00:00:00') : null;
            const eVal = demandEndDate ? new Date(demandEndDate.value + 'T23:59:59') : null;
            if (sVal && inqDate < sVal) return false;
            if (eVal && inqDate > eVal) return false;
          }
        }
        return true;
      });
    }

    let castCount = 0;
    let splintCount = 0;
    let plasterCount = 0;
    let paddingCount = 0;

    if (inquiries.length > 0) {
      inquiries.forEach(inq => {
        const text = ((inq.subject || '') + ' ' + (inq.message || '') + ' ' + (inq.name || '') + ' ' + (JSON.stringify(inq.products || []))).toLowerCase();
        let matched = false;

        if (text.includes('cast') || text.includes('fiberglass') || text.includes('tape') || text.includes('req-4592')) {
          castCount += 1;
          matched = true;
        }
        if (text.includes('splint') || text.includes('padded') || text.includes('req-1024')) {
          splintCount += 1;
          matched = true;
        }
        if (text.includes('plaster') || text.includes('pop') || text.includes('paris') || text.includes('bandage') || text.includes('req-8831')) {
          plasterCount += 1;
          matched = true;
        }
        if (text.includes('padding') || text.includes('consumable') || text.includes('under') || text.includes('cotton')) {
          paddingCount += 1;
          matched = true;
        }

        if (!matched) {
          castCount += 1;
        }
      });
    }

    const liveCastLeads = castCount;
    const liveSplintLeads = splintCount;
    const livePlasterLeads = plasterCount;
    const livePaddingLeads = paddingCount;

    const totalLeads = liveCastLeads + liveSplintLeads + livePlasterLeads + livePaddingLeads;

    const castPct = totalLeads > 0 ? Math.round((liveCastLeads / totalLeads) * 100) : 0;
    const splintPct = totalLeads > 0 ? Math.round((liveSplintLeads / totalLeads) * 100) : 0;
    const plasterPct = totalLeads > 0 ? Math.round((livePlasterLeads / totalLeads) * 100) : 0;
    const paddingPct = totalLeads > 0 ? Math.max(0, 100 - (castPct + splintPct + plasterPct)) : 0;

    const productsData = [
      { key: 'cast', title: 'PK Cast™ (Fiberglass Casting Tapes)', leads: liveCastLeads, pct: castPct, color: '#3b82f6', rankColor: '#dbeafe', rankTextColor: '#2563eb' },
      { key: 'splint', title: 'PK Splint™ (Pre-padded Splints)', leads: liveSplintLeads, pct: splintPct, color: '#8b5cf6', rankColor: '#f3e8ff', rankTextColor: '#9333ea' },
      { key: 'plaster', title: 'PK Plaster™ (POP Bandages)', leads: livePlasterLeads, pct: plasterPct, color: '#ec4899', rankColor: '#fce7f3', rankTextColor: '#db2777' },
      { key: 'padding', title: 'PK Padding & Consumables', leads: livePaddingLeads, pct: paddingPct, color: '#10b981', rankColor: '#d1fae5', rankTextColor: '#059669' }
    ];

    productsData.sort((a, b) => b.leads - a.leads);
    productsData.forEach((p, idx) => p.rank = idx + 1);

    const seg0 = document.getElementById('donutSeg0');
    const seg1 = document.getElementById('donutSeg1');
    const seg2 = document.getElementById('donutSeg2');
    const seg3 = document.getElementById('donutSeg3');

    const segments = [seg0, seg1, seg2, seg3];
    const totalCircumference = 439.82;
    let cumulativeDash = 0;

    productsData.forEach((p, i) => {
      if (segments[i]) {
        const segLen = totalLeads > 0 ? (p.pct / 100) * totalCircumference : 0;
        segments[i].setAttribute('stroke-dasharray', `${segLen.toFixed(1)} ${totalCircumference.toFixed(1)}`);
        segments[i].setAttribute('stroke-dashoffset', (-cumulativeDash).toFixed(1));
        segments[i].setAttribute('stroke', p.color);
        segments[i].setAttribute('data-title', p.title);
        segments[i].setAttribute('data-leads', `${p.leads} Lead${p.leads === 1 ? '' : 's'}`);
        segments[i].setAttribute('data-percent', `${p.pct}%`);
        segments[i].setAttribute('data-rank', `Rank #${p.rank}`);
        segments[i].setAttribute('data-color', p.color);
        cumulativeDash += segLen;
      }
    });

    const donutCenterLeads = document.getElementById('donutCenterLeads');
    const donutCenterTitle = document.getElementById('donutCenterTitle');
    const modalHoverLeads = document.getElementById('modalHoverLeads');
    const modalHoverTitle = document.getElementById('modalHoverTitle');
    const modalDonutIcon = document.getElementById('modalDonutIcon');
    const donutCenterIcon = document.getElementById('donutCenterIcon');
    const modalHoverInfoCard = document.getElementById('modalHoverInfoCard');
    const donutCenterInfo = document.getElementById('donutCenterInfo');

    const leadText = totalLeads > 0 ? `${productsData[0].leads} Lead${productsData[0].leads === 1 ? '' : 's'} (${productsData[0].pct}%)` : '0 Leads';
    const rankTextTitle = totalLeads > 0 ? `Rank #1: ${productsData[0].title.split(' ')[0]} ${productsData[0].title.split(' ')[1]}` : 'No Active RFQs';
    const leadColor = totalLeads > 0 ? productsData[0].color : '#3b82f6';

    if (donutCenterLeads) {
      donutCenterLeads.textContent = leadText;
      donutCenterLeads.style.color = leadColor;
    }
    if (donutCenterTitle) {
      donutCenterTitle.textContent = rankTextTitle;
    }

    if (modalHoverLeads) {
      modalHoverLeads.textContent = leadText;
      modalHoverLeads.style.color = leadColor;
    }
    if (modalHoverTitle) {
      modalHoverTitle.textContent = rankTextTitle;
    }

    if (modalDonutIcon) modalDonutIcon.style.color = leadColor;
    if (donutCenterIcon) donutCenterIcon.style.color = leadColor;

    if (modalHoverInfoCard) {
      modalHoverInfoCard.style.borderColor = '#e2e8f0';
      modalHoverInfoCard.style.background = '#f8fafc';
      modalHoverInfoCard.style.boxShadow = 'none';
    }
    if (donutCenterInfo) {
      donutCenterInfo.style.borderColor = '#e2e8f0';
      donutCenterInfo.style.background = '#f8fafc';
      donutCenterInfo.style.boxShadow = 'none';
    }

    // Outer Card Legend List (#demandRankList)
    const rankListContainer = document.getElementById('demandRankList');
    if (rankListContainer) {
      rankListContainer.innerHTML = productsData.map((p, idx) => `
        <div class="legend-hover-item" data-segment="${idx}" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; transition: all 0.25s ease; cursor: pointer;">
          <span style="font-size: 0.82rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; margin-right: 12px;">
            <span style="background: ${p.rankColor}; color: ${p.rankTextColor}; font-size: 0.7rem; font-weight: 800; padding: 2px 6px; border-radius: 6px; flex-shrink: 0;">#${p.rank}</span>
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${p.color}; display: inline-block; flex-shrink: 0;"></span>
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</span>
          </span>
          <span style="font-size: 0.85rem; font-weight: 800; color: ${p.color}; flex-shrink: 0; white-space: nowrap;">${p.leads} Lead${p.leads === 1 ? '' : 's'} (${p.pct}%)</span>
        </div>
      `).join('');
    }

    // Modal Product Line Ranked Cards List (Clean 1-Line Layout!)
    const modalProductLineCards = document.getElementById('modalProductLineCards');
    if (modalProductLineCards) {
      modalProductLineCards.innerHTML = productsData.map(p => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-radius: 16px; background: #f8fafc; border: 1px solid #e2e8f0; min-height: 52px; transition: all 0.25s ease;">
          <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
            <span style="background: ${p.rankColor}; color: ${p.rankTextColor}; font-size: 0.75rem; font-weight: 800; padding: 3px 8px; border-radius: 8px; flex-shrink: 0;">#${p.rank}</span>
            <span style="width: 10px; height: 10px; border-radius: 50%; background: ${p.color}; display: inline-block; flex-shrink: 0;"></span>
            <span style="font-size: 0.92rem; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</span>
          </div>
          <span style="font-size: 0.95rem; font-weight: 800; color: ${p.color}; white-space: nowrap; flex-shrink: 0; margin-left: 16px;">${p.leads} Lead${p.leads === 1 ? '' : 's'} (${p.pct}%)</span>
        </div>
      `).join('');
    }

    // Render All Catalog Products Lead Demand Breakdown Table (KEEP ALL BLUE!)
    const modalCatalogTableBody = document.getElementById('modalCatalogTableBody');
    const modalCatalogCountPill = document.getElementById('modalCatalogCountPill');

    const catalogList = (typeof STATIC_PRODUCTS_DATA !== 'undefined') ? STATIC_PRODUCTS_DATA : [];
    if (modalCatalogCountPill) {
      modalCatalogCountPill.textContent = `${catalogList.length > 0 ? catalogList.length : 4} Catalog Products`;
    }

    if (modalCatalogTableBody) {
      if (catalogList.length > 0) {
        // Calculate 100% pure unscaled real leads for each catalog product item
        const itemMetrics = catalogList.map(item => {
          let itemCount = 0;
          inquiries.forEach(inq => {
            const code = (item.code || '').toLowerCase();
            const title = (item.title || '').toLowerCase();
            const id = (item.id || '').toLowerCase();
            
            let matched = false;
            if (Array.isArray(inq.products)) {
              matched = inq.products.some(p => {
                const pStr = (typeof p === 'string' ? p : (p.code || p.title || p.id || '')).toLowerCase();
                return (code && pStr.includes(code)) || (title && pStr.includes(title)) || (id && pStr.includes(id));
              });
            }

            if (!matched) {
              const txt = ((inq.subject || '') + ' ' + (inq.message || '') + ' ' + (inq.product || '') + ' ' + (inq.name || '')).toLowerCase();
              if ((code && txt.includes(code)) || (title && txt.includes(title)) || (id && txt.includes(id))) {
                matched = true;
              }
            }

            if (matched) {
              itemCount += 1;
            }
          });

          return {
            code: item.code,
            title: item.title,
            categoryLabel: item.categoryLabel || item.category,
            category: item.category,
            count: itemCount
          };
        });

        const catTotal = itemMetrics.reduce((sum, m) => sum + m.count, 0);
        itemMetrics.sort((a, b) => b.count - a.count);

        modalCatalogTableBody.innerHTML = itemMetrics.map((m, idx) => {
          const sharePct = catTotal > 0 ? Math.round((m.count / catTotal) * 100) : 0;
          const barColor = '#3b82f6';
          const rankBg = '#dbeafe';
          const rankText = '#2563eb';

          return `
            <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseenter="this.style.background='#f8fafc'" onmouseleave="this.style.background='transparent'">
              <td style="padding: 12px 16px; font-weight: 700; color: #0f172a;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: ${rankBg}; color: ${rankText}; font-size: 0.75rem; font-weight: 800; padding: 2px 7px; border-radius: 8px;">#${idx + 1}</span>
                  <span style="width: 9px; height: 9px; border-radius: 50%; background: ${barColor}; display: inline-block; flex-shrink: 0;"></span>
                  <span style="font-weight: 700; color: #1e293b; font-size: 0.88rem;">${m.title}</span>
                </div>
              </td>
              <td style="padding: 12px 16px; color: #64748b; font-weight: 600; font-size: 0.84rem;">${m.categoryLabel}</td>
              <td style="padding: 12px 16px; font-weight: 800; color: ${barColor};">${m.count} Lead${m.count === 1 ? '' : 's'}</td>
              <td style="padding: 12px 16px; font-weight: 800; color: ${barColor};">${sharePct}%</td>
              <td style="padding: 12px 16px;">
                <div style="width: 100%; max-width: 130px; background: #f1f5f9; height: 8px; border-radius: 4px; overflow: hidden;">
                  <div style="width: ${Math.max(6, sharePct)}%; height: 100%; background: ${barColor}; border-radius: 4px; transition: all 0.3s ease;"></div>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      } else {
        // Fallback Product Lines Table
        modalCatalogTableBody.innerHTML = productsData.map(p => `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 16px; font-weight: 700; color: #0f172a;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background: #dbeafe; color: #2563eb; font-size: 0.75rem; font-weight: 800; padding: 2px 7px; border-radius: 8px;">#${p.rank}</span>
                <span style="width: 9px; height: 9px; border-radius: 50%; background: #3b82f6; display: inline-block; flex-shrink: 0;"></span>
                <span style="font-weight: 700; color: #1e293b; font-size: 0.88rem;">${p.title}</span>
              </div>
            </td>
            <td style="padding: 12px 16px; color: #64748b; font-weight: 600;">Orthopedic Line</td>
            <td style="padding: 12px 16px; font-weight: 800; color: #3b82f6;">${p.leads} Lead${p.leads === 1 ? '' : 's'}</td>
            <td style="padding: 12px 16px; font-weight: 800; color: #3b82f6;">${p.pct}%</td>
            <td style="padding: 12px 16px;">
              <div style="width: 100%; max-width: 130px; background: #f1f5f9; height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="width: ${Math.max(6, p.pct)}%; height: 100%; background: #3b82f6; border-radius: 4px;"></div>
              </div>
            </td>
          </tr>
        `).join('');
      }
    }
  };

  // Initial call & bind window storage listener
  window.updateLiveDemandAnalytics();
  window.addEventListener('storage', window.updateLiveDemandAnalytics);

});
