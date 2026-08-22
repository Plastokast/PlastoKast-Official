function initAdminCatalog() {
  const catalogGrid = document.getElementById('catalogGrid');
  const catalogSearch = document.getElementById('catalogSearch');
  const catalogFilterCategory = document.getElementById('catalogFilterCategory');
  const btnAddNewProduct = document.getElementById('btnAddNewProduct');
  
  // Delete Mode Controls
  const btnToggleDeleteMode = document.getElementById('btnToggleDeleteMode');
  const deleteModeControls = document.getElementById('deleteModeControls');
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');
  const btnCancelDeleteMode = document.getElementById('btnCancelDeleteMode');
  const selectedCountSpan = document.getElementById('selectedCount');
  
  // Metric Counters
  const statTotalProducts = document.getElementById('statTotalProducts');
  const statCategories = document.getElementById('statCategories');

  // Modal Inputs
  const productModal = document.getElementById('productModal');
  const closeProductModal = document.getElementById('closeProductModal');
  const editProductTitle = document.getElementById('editProductTitle');
  const editProductCode = document.getElementById('editProductCode');
  const editProductCategory = document.getElementById('editProductCategory');
  const editProductCategoryLabel = document.getElementById('editProductCategoryLabel');
  const editProductImage1 = document.getElementById('editProductImage1');
  const editProductDesc = document.getElementById('editProductDesc');
  const editProductFeatures = document.getElementById('editProductFeatures');
  const editProductSizes = document.getElementById('editProductSizes');
  const editProductSpecs = document.getElementById('editProductSpecs');
  const btnSaveProduct = document.getElementById('btnSaveProduct');
  const btnDeleteSingleProduct = document.getElementById('btnDeleteSingleProduct');

  // Selection & Mode State
  let isDeleteMode = false;
  const selectedProductIds = new Set();

  // Load catalog items from localStorage if available, or fallback to default PRODUCTS_DATA
  let catalogItems = [];
  function loadCatalogData() {
    const saved = localStorage.getItem('plastokast_products');
    if (saved && saved !== '[]') {
      try {
        catalogItems = JSON.parse(saved);
      } catch (err) {
        catalogItems = typeof PRODUCTS_DATA !== 'undefined' ? JSON.parse(JSON.stringify(PRODUCTS_DATA)) : [];
      }
    } else if (typeof PRODUCTS_DATA !== 'undefined') {
      catalogItems = JSON.parse(JSON.stringify(PRODUCTS_DATA));
      localStorage.setItem('plastokast_products', JSON.stringify(catalogItems));
    }
  }

  loadCatalogData();

  // Expose global refresh catalog function
  window.refreshCatalog = () => {
    loadCatalogData();
    updateMetrics();
    renderCatalog();
  };

  let currentEditProductId = null;

  // 1. Calculate & Render Executive Summary Metrics
  function updateMetrics() {
    if (statTotalProducts) statTotalProducts.textContent = catalogItems.length;
    
    const activeCats = typeof getCategoriesData === 'function' ? getCategoriesData() : [];
    if (statCategories) statCategories.textContent = activeCats.length;
  }

  // 2. Update Confirm Delete Button UI State
  function updateDeleteButtonState() {
    if (!btnConfirmDelete) return;
    
    const count = selectedProductIds.size;
    if (selectedCountSpan) selectedCountSpan.textContent = count;

    if (count > 0) {
      btnConfirmDelete.disabled = false;
      btnConfirmDelete.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      btnConfirmDelete.style.color = '#ffffff';
      btnConfirmDelete.style.borderColor = 'transparent';
      btnConfirmDelete.style.cursor = 'pointer';
      btnConfirmDelete.style.boxShadow = '0 4px 14px rgba(239, 68, 68, 0.35)';
    } else {
      btnConfirmDelete.disabled = true;
      btnConfirmDelete.style.background = '#f1f5f9';
      btnConfirmDelete.style.color = '#94a3b8';
      btnConfirmDelete.style.borderColor = '#e2e8f0';
      btnConfirmDelete.style.cursor = 'not-allowed';
      btnConfirmDelete.style.boxShadow = 'none';
    }
  }

  // 3. Render Product Cards Grid
  function renderCatalog() {
    if (!catalogGrid) return;
    
    const searchTerm = catalogSearch ? catalogSearch.value.toLowerCase() : '';
    const selectedCat = catalogFilterCategory ? catalogFilterCategory.value : 'All';
    
    // Filter
    const filtered = catalogItems.filter(prod => {
      const matchSearch = prod.title.toLowerCase().includes(searchTerm) || 
                          prod.code.toLowerCase().includes(searchTerm) || 
                          (prod.categoryLabel && prod.categoryLabel.toLowerCase().includes(searchTerm));
      const matchCat = selectedCat === 'All' || prod.category === selectedCat;
      return matchSearch && matchCat;
    });
    
    catalogGrid.innerHTML = '';
    
    if (filtered.length === 0) {
      catalogGrid.innerHTML = '<div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: #64748b; background: white; border-radius: 24px; border: 1px solid #e2e8f0;">No products match your search or filter criteria.</div>';
      return;
    }
    
    filtered.forEach(prod => {
      const isSelected = selectedProductIds.has(prod.id);
      
      const card = document.createElement('div');
      card.className = 'admin-card';
      card.style.padding = '0';
      card.style.overflow = 'hidden';
      card.style.cursor = 'pointer';
      card.style.transition = 'all 0.25s ease';
      card.style.background = '#ffffff';
      card.style.border = isSelected ? '2px solid #ef4444' : '1px solid #e2e8f0';
      card.style.borderRadius = '16px';
      card.style.boxShadow = isSelected ? '0 4px 15px rgba(239, 68, 68, 0.15)' : '0 2px 8px rgba(0,0,0,0.02)';
      card.style.maxWidth = '220px';
      card.style.width = '100%';
      
      card.addEventListener('mouseenter', () => {
        if (!isSelected) {
          card.style.transform = 'translateY(-4px)';
          card.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
          card.style.borderColor = '#cbd5e1';
        }
      });
      card.addEventListener('mouseleave', () => {
        if (!isSelected) {
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
          card.style.borderColor = '#e2e8f0';
        }
      });
      
      // Click interaction: In Delete Mode, toggle selection. In normal mode, open modal.
      card.addEventListener('click', (e) => {
        if (isDeleteMode) {
          if (selectedProductIds.has(prod.id)) {
            selectedProductIds.delete(prod.id);
          } else {
            selectedProductIds.add(prod.id);
          }
          renderCatalog();
        } else {
          openProductModal(prod.id);
        }
      });
      
      const imageSrc = (prod.images && prod.images.length > 0) ? prod.images[0] : 'https://via.placeholder.com/300x200?text=No+Image';

      // Checkbox visible ONLY when in Delete Mode
      const checkboxHTML = isDeleteMode ? `
        <input type="checkbox" class="product-checkbox" data-id="${prod.id}" ${isSelected ? 'checked' : ''} style="position: absolute; top: 10px; left: 10px; width: 20px; height: 20px; cursor: pointer; accent-color: #ef4444; z-index: 10;">
      ` : '';

      card.innerHTML = `
        <div style="height: 140px; padding: 12px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: center; box-sizing: border-box; position: relative;">
          ${checkboxHTML}
          <img src="${imageSrc}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px; display: block;" alt="${prod.title}">
        </div>
        <div style="padding: 12px 14px;">
          <h3 style="font-size: 0.95rem; color: #0f172a; font-weight: 700; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${prod.title}">${prod.title}</h3>
          <div style="font-family: monospace; font-size: 0.78rem; color: #64748b; font-weight: 600;">${prod.code}</div>
        </div>
      `;
      
      catalogGrid.appendChild(card);
    });
    
    updateDeleteButtonState();
  }

  // Active product images state (array of image URLs / paths)
  let activeProductImages = [];
  let selectedPhotoIndex = 0; // Currently selected photo index (default: 0 Primary Cover)

  // Render Product Images Grid & Selected Photo URL Management Box
  function renderProductGallery() {
    const gridContainer = document.getElementById('productImagesGrid');
    const selectedTitleBadge = document.getElementById('selectedPhotoTitleBadge');
    const selectedUrlInput = document.getElementById('selectedPhotoUrlInput');
    const selectedActions = document.getElementById('selectedPhotoActions');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = '';
    
    if (activeProductImages.length === 0) {
      gridContainer.innerHTML = `<div style="grid-column: 1 / -1; color: #94a3b8; font-size: 0.85rem; font-style: italic; text-align: center; padding: 16px; background: #ffffff; border-radius: 12px; border: 1px dashed #cbd5e1;">No images added yet. Use '+ Add new sub-photo URL' below to add a photo.</div>`;
      if (selectedPhotoUrlInput) selectedPhotoUrlInput.value = '';
      if (selectedTitleBadge) selectedTitleBadge.innerHTML = `<i class="fa fa-image"></i> No Photo Selected`;
      if (selectedActions) selectedActions.innerHTML = '';
      return;
    }

    // Ensure selectedPhotoIndex is valid
    if (selectedPhotoIndex >= activeProductImages.length) {
      selectedPhotoIndex = activeProductImages.length - 1;
    }
    if (selectedPhotoIndex < 0) selectedPhotoIndex = 0;

    // 1. FIRST IN ORDER: Render Top Visual Photo Cards Grid
    activeProductImages.forEach((imgUrl, idx) => {
      const isPrimary = idx === 0;
      const isSelected = idx === selectedPhotoIndex;

      const card = document.createElement('div');
      card.style.cssText = `
        position: relative;
        background: #ffffff;
        border: ${isSelected ? '2.5px solid #2563eb' : (isPrimary ? '2px solid #93c5fd' : '1.5px solid #cbd5e1')};
        border-radius: 12px;
        overflow: hidden;
        box-shadow: ${isSelected ? '0 6px 16px rgba(37,99,235,0.22)' : '0 2px 6px rgba(0,0,0,0.04)'};
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: all 0.2s;
        transform: ${isSelected ? 'translateY(-2px)' : 'none'};
      `;
      
      card.innerHTML = `
        <div style="width: 100%; height: 95px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
          <img src="${imgUrl}" class="grid-thumb-img" data-idx="${idx}" alt="Photo ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='media/pk_cast_colored_v73.jpg?v=73'">
          ${isPrimary ? `<span style="position: absolute; top: 4px; left: 4px; background: #2563eb; color: white; font-size: 0.6rem; font-weight: 800; padding: 2px 6px; border-radius: 6px; text-transform: uppercase;">PRIMARY</span>` : `<span style="position: absolute; top: 4px; left: 4px; background: rgba(15,23,42,0.7); color: white; font-size: 0.6rem; font-weight: 700; padding: 2px 6px; border-radius: 6px;">Sub-Photo ${idx}</span>`}
          ${isSelected ? `<span style="position: absolute; top: 4px; right: 4px; background: #2563eb; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; box-shadow: 0 2px 6px rgba(0,0,0,0.2);"><i class="fa fa-check"></i></span>` : ''}
        </div>
        <div style="padding: 5px 6px; width: 100%; background: ${isSelected ? '#eff6ff' : '#ffffff'}; text-align: center; border-top: 1px solid #f1f5f9;">
          <span style="font-size: 0.7rem; font-weight: 700; color: ${isSelected ? '#2563eb' : '#475569'};">${isSelected ? '● Selected' : (isPrimary ? 'Main Cover' : 'Sub-Photo ' + idx)}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        selectedPhotoIndex = idx;
        renderProductGallery();
      });
      
      gridContainer.appendChild(card);
    });

    // 2. UNDER THAT: Render Selected Photo Details & URL Input Underneath
    const currentSelectedUrl = activeProductImages[selectedPhotoIndex] || '';
    const isSelectedPrimary = selectedPhotoIndex === 0;

    if (selectedTitleBadge) {
      selectedTitleBadge.innerHTML = `<i class="fa fa-link"></i> URL Option for Selected Photo: <strong style="text-decoration: underline;">${isSelectedPrimary ? 'Primary Cover' : 'Sub-Photo ' + selectedPhotoIndex}</strong>`;
    }

    if (selectedUrlInput) {
      selectedUrlInput.value = currentSelectedUrl;
    }

    if (selectedActions) {
      selectedActions.innerHTML = '';
      
      // 1. Browse & Change Photo File for Selected Photo
      const btnChangeSelectedFile = document.createElement('button');
      btnChangeSelectedFile.type = 'button';
      btnChangeSelectedFile.style.cssText = 'background: #2563eb; color: #ffffff; border: none; padding: 5px 12px; border-radius: 8px; font-weight: 700; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 4px; box-shadow: 0 2px 8px rgba(37,99,235,0.2);';
      btnChangeSelectedFile.innerHTML = '<i class="fa fa-folder-open"></i> Browse & Change Photo';
      btnChangeSelectedFile.addEventListener('click', () => {
        const fileEl = document.getElementById('replaceSelectedFileInput');
        if (fileEl) fileEl.click();
      });
      selectedActions.appendChild(btnChangeSelectedFile);

      // 2. Set Primary option for sub-photos
      if (!isSelectedPrimary) {
        const btnSetPrimary = document.createElement('button');
        btnSetPrimary.type = 'button';
        btnSetPrimary.style.cssText = 'background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 5px 12px; border-radius: 8px; font-weight: 700; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 4px;';
        btnSetPrimary.innerHTML = '<i class="fa fa-star"></i> Set as Primary';
        btnSetPrimary.addEventListener('click', () => {
          const [movedImg] = activeProductImages.splice(selectedPhotoIndex, 1);
          activeProductImages.unshift(movedImg);
          selectedPhotoIndex = 0;
          renderProductGallery();
        });
        selectedActions.appendChild(btnSetPrimary);
      }

      // 3. Remove Photo option
      const btnRemoveSelected = document.createElement('button');
      btnRemoveSelected.type = 'button';
      btnRemoveSelected.style.cssText = 'background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; padding: 5px 12px; border-radius: 8px; font-weight: 700; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 4px;';
      btnRemoveSelected.innerHTML = '<i class="fa fa-trash"></i> Remove Photo';
      btnRemoveSelected.addEventListener('click', () => {
        activeProductImages.splice(selectedPhotoIndex, 1);
        if (selectedPhotoIndex >= activeProductImages.length) {
          selectedPhotoIndex = Math.max(0, activeProductImages.length - 1);
        }
        renderProductGallery();
      });
      selectedActions.appendChild(btnRemoveSelected);
    }
  }

  // File replacement handler for selected photo
  const replaceSelectedFileInput = document.getElementById('replaceSelectedFileInput');
  if (replaceSelectedFileInput) {
    replaceSelectedFileInput.addEventListener('change', (e) => {
      if (!e.target.files || !e.target.files[0]) return;
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (activeProductImages.length === 0) {
          activeProductImages.push(event.target.result);
          selectedPhotoIndex = 0;
        } else {
          activeProductImages[selectedPhotoIndex] = event.target.result;
        }
        renderProductGallery();
      };
      reader.readAsDataURL(file);
      replaceSelectedFileInput.value = '';
    });
  }

  // Add New Photo file upload handler
  const btnAddNewPhoto = document.getElementById('btnAddNewPhoto');
  const addNewPhotoFileInput = document.getElementById('addNewPhotoFileInput');
  if (btnAddNewPhoto && addNewPhotoFileInput) {
    btnAddNewPhoto.addEventListener('click', () => {
      addNewPhotoFileInput.click();
    });

    addNewPhotoFileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          activeProductImages.push(event.target.result);
          selectedPhotoIndex = activeProductImages.length - 1; // Auto select newly added photo
          renderProductGallery();
        };
        reader.readAsDataURL(file);
      });
      addNewPhotoFileInput.value = '';
    });
  }

  // Handle typing inside selectedPhotoUrlInput
  const selectedPhotoUrlInput = document.getElementById('selectedPhotoUrlInput');
  if (selectedPhotoUrlInput) {
    selectedPhotoUrlInput.addEventListener('input', (e) => {
      if (activeProductImages.length === 0) return;
      const newUrl = selectedPhotoUrlInput.value.trim();
      activeProductImages[selectedPhotoIndex] = newUrl;
      const thumbImg = document.querySelector(`.grid-thumb-img[data-idx="${selectedPhotoIndex}"]`);
      if (thumbImg) thumbImg.src = newUrl || 'media/pk_cast_colored_v73.jpg?v=73';
    });
  }

  // Handle Add New Quick URL
  const quickUrlInput = document.getElementById('quickImageUrlInput');
  const btnAddQuickUrl = document.getElementById('btnAddQuickUrl');

  if (btnAddQuickUrl && quickUrlInput) {
    btnAddQuickUrl.addEventListener('click', () => {
      const url = quickUrlInput.value.trim();
      if (url) {
        activeProductImages.push(url);
        selectedPhotoIndex = activeProductImages.length - 1; // Auto select the new photo
        renderProductGallery();
        quickUrlInput.value = '';
      }
    });

    quickUrlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnAddQuickUrl.click();
      }
    });
  }

  // Attributes Editor State
  let featuresState = [];
  let sizesState = [];
  let specsState = [];

  // Render Features Bullet List Editor
  function renderFeaturesEditor() {
    const container = document.getElementById('featuresListEditor');
    if (!container) return;
    container.innerHTML = '';

    if (featuresState.length === 0) {
      container.innerHTML = `<div style="color: #94a3b8; font-size: 0.82rem; font-style: italic; padding: 8px;">No feature bullets added yet. Click 'Add Feature Bullet' above.</div>`;
      return;
    }

    featuresState.forEach((feat, idx) => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; gap: 8px; align-items: center;';
      row.innerHTML = `
        <span style="color: #2563eb; font-size: 0.9rem;"><i class="fa fa-check-circle"></i></span>
        <input type="text" class="feature-item-input" data-idx="${idx}" value="${(feat || '').replace(/"/g, '&quot;')}" placeholder="Feature detail..." style="flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem; color: #0f172a; outline: none;">
        <button type="button" class="btn-remove-feature" data-idx="${idx}" style="background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; padding: 8px 10px; border-radius: 8px; font-weight: 700; font-size: 0.78rem; cursor: pointer;"><i class="fa fa-trash"></i></button>
      `;
      container.appendChild(row);
    });

    container.querySelectorAll('.feature-item-input').forEach(input => {
      input.addEventListener('input', () => {
        const idx = parseInt(input.getAttribute('data-idx'));
        featuresState[idx] = input.value;
        syncFallbackTextareas();
        renderLiveSitePreview();
      });
    });

    container.querySelectorAll('.btn-remove-feature').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        featuresState.splice(idx, 1);
        renderFeaturesEditor();
        syncFallbackTextareas();
        renderLiveSitePreview();
      });
    });
  }

  // Add Feature Button handler
  const btnAddFeatureRow = document.getElementById('btnAddFeatureRow');
  if (btnAddFeatureRow) {
    btnAddFeatureRow.addEventListener('click', () => {
      featuresState.push('');
      renderFeaturesEditor();
      const inputs = document.querySelectorAll('.feature-item-input');
      if (inputs.length > 0) inputs[inputs.length - 1].focus();
    });
  }

  // Render Sizes Pills Editor
  function renderSizesEditor() {
    const container = document.getElementById('sizesPillBadges');
    if (!container) return;
    container.innerHTML = '';

    if (sizesState.length === 0) {
      container.innerHTML = `<span style="color: #94a3b8; font-size: 0.82rem; font-style: italic;">No sizes added yet. Enter a size below and click 'Add Size Tag'.</span>`;
      return;
    }

    sizesState.forEach((sizeText, idx) => {
      const pill = document.createElement('div');
      pill.style.cssText = 'background: #f3e8ff; color: #6b21a8; border: 1px solid #d8b4fe; padding: 4px 10px; border-radius: 16px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 6px;';
      pill.innerHTML = `
        <span>${sizeText}</span>
        <button type="button" class="btn-remove-size-pill" data-idx="${idx}" style="background: transparent; border: none; color: #6b21a8; font-weight: 800; cursor: pointer; font-size: 0.85rem; padding: 0;">&times;</button>
      `;
      container.appendChild(pill);
    });

    container.querySelectorAll('.btn-remove-size-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        sizesState.splice(idx, 1);
        renderSizesEditor();
        syncFallbackTextareas();
        renderLiveSitePreview();
      });
    });
  }

  // Add Size Tag Button handler
  const newSizeTagInput = document.getElementById('newSizeTagInput');
  const btnAddSizeTag = document.getElementById('btnAddSizeTag');
  if (btnAddSizeTag && newSizeTagInput) {
    btnAddSizeTag.addEventListener('click', () => {
      const val = newSizeTagInput.value.trim();
      if (val) {
        sizesState.push(val);
        renderSizesEditor();
        syncFallbackTextareas();
        renderLiveSitePreview();
        newSizeTagInput.value = '';
      }
    });

    newSizeTagInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnAddSizeTag.click();
      }
    });
  }

  // Render Specs Table Editor
  function renderSpecsEditor() {
    const container = document.getElementById('specsTableEditor');
    if (!container) return;
    container.innerHTML = '';

    if (specsState.length === 0) {
      container.innerHTML = `<div style="color: #94a3b8; font-size: 0.82rem; font-style: italic; padding: 8px;">No specifications added yet. Click 'Add Spec Row' above.</div>`;
      return;
    }

    specsState.forEach((spec, idx) => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; gap: 8px; align-items: center;';
      row.innerHTML = `
        <input type="text" class="spec-key-input" data-idx="${idx}" value="${(spec.key || '').replace(/"/g, '&quot;')}" placeholder="Spec Name (e.g. Material)" style="width: 35%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.83rem; font-weight: 700; color: #0f172a; outline: none;">
        <span style="color: #94a3b8; font-weight: 700;">:</span>
        <input type="text" class="spec-val-input" data-idx="${idx}" value="${(spec.val || '').replace(/"/g, '&quot;')}" placeholder="Spec Value (e.g. Fiberglass Fabric)" style="flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.83rem; color: #0f172a; outline: none;">
        <button type="button" class="btn-remove-spec" data-idx="${idx}" style="background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; padding: 8px 10px; border-radius: 8px; font-weight: 700; font-size: 0.78rem; cursor: pointer;"><i class="fa fa-trash"></i></button>
      `;
      container.appendChild(row);
    });

    container.querySelectorAll('.spec-key-input').forEach(input => {
      input.addEventListener('input', () => {
        const idx = parseInt(input.getAttribute('data-idx'));
        specsState[idx].key = input.value;
        syncFallbackTextareas();
        renderLiveSitePreview();
      });
    });

    container.querySelectorAll('.spec-val-input').forEach(input => {
      input.addEventListener('input', () => {
        const idx = parseInt(input.getAttribute('data-idx'));
        specsState[idx].val = input.value;
        syncFallbackTextareas();
        renderLiveSitePreview();
      });
    });

    container.querySelectorAll('.btn-remove-spec').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        specsState.splice(idx, 1);
        renderSpecsEditor();
        syncFallbackTextareas();
        renderLiveSitePreview();
      });
    });
  }

  // Add Spec Row Button handler
  const btnAddSpecRow = document.getElementById('btnAddSpecRow');
  if (btnAddSpecRow) {
    btnAddSpecRow.addEventListener('click', () => {
      specsState.push({ key: '', val: '' });
      renderSpecsEditor();
      const inputs = document.querySelectorAll('.spec-key-input');
      if (inputs.length > 0) inputs[inputs.length - 1].focus();
    });
  }

  // Keep hidden textareas synced with structured state
  function syncFallbackTextareas() {
    if (editProductFeatures) editProductFeatures.value = featuresState.filter(Boolean).join('\n');
    if (editProductSizes) editProductSizes.value = sizesState.filter(Boolean).join('\n');
    if (editProductSpecs) {
      editProductSpecs.value = specsState
        .filter(s => s.key.trim())
        .map(s => `${s.key.trim()}: ${s.val.trim()}`)
        .join('\n');
    }
  }

  // 4. Open Modal in Edit Mode
  function openProductModal(id) {
    const prod = catalogItems.find(p => p.id === id);
    if (!prod) return;
    
    currentEditProductId = id;
    
    const titleEl = document.getElementById('productModalTitle');
    if (titleEl) titleEl.textContent = 'Edit Product';
    
    if (btnDeleteSingleProduct) btnDeleteSingleProduct.style.display = 'flex';
    
    editProductTitle.value = prod.title || '';
    editProductCode.value = prod.code || '';
    editProductCategory.value = prod.category || '';
    editProductCategoryLabel.value = prod.categoryLabel || '';
    
    refreshCategoryDropdowns();
    if (editProductCategorySelect && prod.category) {
      editProductCategorySelect.value = prod.category;
    }

    activeProductImages = Array.isArray(prod.images) ? [...prod.images] : (prod.images ? [prod.images] : ['media/pk_cast_colored_v73.jpg?v=73']);
    selectedPhotoIndex = 0;
    renderProductGallery();

    editProductDesc.value = prod.desc || '';
    
    // Populate Features State
    featuresState = (prod.features && Array.isArray(prod.features)) ? [...prod.features] : [];
    renderFeaturesEditor();

    // Populate Sizes State
    sizesState = (prod.sizes && Array.isArray(prod.sizes)) ? [...prod.sizes] : [];
    renderSizesEditor();

    // Populate Specs State
    specsState = [];
    if (prod.specs && typeof prod.specs === 'object') {
      specsState = Object.entries(prod.specs).map(([k, v]) => ({ key: k, val: String(v) }));
    }
    renderSpecsEditor();
    syncFallbackTextareas();

    productModal.classList.add('show');
  }

  // 5. Trigger Modal in Create Mode (Clean Blank Form)
  if (btnAddNewProduct) {
    btnAddNewProduct.addEventListener('click', () => {
      currentEditProductId = null; // null triggers creation mode
      
      const titleEl = document.getElementById('productModalTitle');
      if (titleEl) titleEl.textContent = 'Add New Product';
      
      if (btnDeleteSingleProduct) btnDeleteSingleProduct.style.display = 'none';
      
      editProductTitle.value = '';
      editProductCode.value = 'PK-NEW-' + Math.floor(1000 + Math.random() * 9000);
      
      refreshCategoryDropdowns();
      if (editProductCategorySelect && activeCategories.length > 0) {
        editProductCategorySelect.value = activeCategories[0].slug;
        editProductCategory.value = activeCategories[0].slug;
        editProductCategoryLabel.value = activeCategories[0].label;
      } else {
        editProductCategory.value = '';
        editProductCategoryLabel.value = '';
      }
      
      // Start with completely blank photo gallery
      activeProductImages = [];
      selectedPhotoIndex = 0;
      renderProductGallery();

      // Start with completely blank text overview, features, sizes, and specs
      editProductDesc.value = '';
      featuresState = [];
      renderFeaturesEditor();

      sizesState = [];
      renderSizesEditor();

      specsState = [];
      renderSpecsEditor();
      syncFallbackTextareas();

      productModal.classList.add('show');
    });
  }

  // Helper to downscale and compress base64 images to prevent localStorage QuotaExceededError
  function compressImageDataUrl(dataUrl, maxDim = 900, quality = 0.82) {
    return new Promise((resolve) => {
      if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
        resolve(dataUrl);
        return;
      }
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  // 6. Save Changes (Edit or Add)
  if (btnSaveProduct) {
    btnSaveProduct.addEventListener('click', async (e) => {
      if (e) e.preventDefault();
      
      const origBtnHtml = btnSaveProduct.innerHTML;
      btnSaveProduct.disabled = true;
      btnSaveProduct.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Saving...';

      try {
        const newSpecs = {};
        const specLines = (editProductSpecs.value || '').split('\n');
        specLines.forEach(line => {
          const colonIdx = line.indexOf(':');
          if (colonIdx > -1) {
            const k = line.substring(0, colonIdx).trim();
            const v = line.substring(colonIdx + 1).trim();
            if (k) newSpecs[k] = v;
          }
        });

        // Downscale large Base64 images asynchronously to avoid localStorage quota crash
        const processedImages = await Promise.all(
          activeProductImages.map(img => compressImageDataUrl(img))
        );

        const finalImages = processedImages.length > 0 ? processedImages : ['media/pk_cast_colored_v73.jpg?v=73'];
        const titleVal = (editProductTitle.value || '').trim() || 'Untitled Product';
        const codeVal = (editProductCode.value || '').trim() || ('PK-GEN-' + Math.floor(1000 + Math.random() * 9000));
        const catSlugVal = (editProductCategory.value || '').trim() || 'general';
        const catLabelVal = (editProductCategoryLabel.value || '').trim() || 'General';

        if (currentEditProductId === null) {
          // Create brand new product
          const newProduct = {
            id: 'pk-custom-' + Date.now(),
            code: codeVal,
            title: titleVal,
            category: catSlugVal,
            categoryLabel: catLabelVal,
            images: finalImages,
            desc: editProductDesc.value || '',
            features: (editProductFeatures.value || '').split('\n').map(s => s.trim()).filter(Boolean),
            sizes: (editProductSizes.value || '').split('\n').map(s => s.trim()).filter(Boolean),
            specs: newSpecs
          };
          catalogItems.unshift(newProduct);
        } else {
          // Edit existing product
          let index = catalogItems.findIndex(p => String(p.id) === String(currentEditProductId));
          if (index === -1) {
            index = catalogItems.findIndex(p => p.code === codeVal);
          }

          if (index > -1) {
            catalogItems[index].title = titleVal;
            catalogItems[index].code = codeVal;
            catalogItems[index].category = catSlugVal;
            catalogItems[index].categoryLabel = catLabelVal;
            catalogItems[index].images = finalImages;
            catalogItems[index].desc = editProductDesc.value || '';
            catalogItems[index].features = (editProductFeatures.value || '').split('\n').map(s => s.trim()).filter(Boolean);
            catalogItems[index].sizes = (editProductSizes.value || '').split('\n').map(s => s.trim()).filter(Boolean);
            catalogItems[index].specs = newSpecs;
          } else {
            const fallbackProduct = {
              id: currentEditProductId || ('pk-custom-' + Date.now()),
              code: codeVal,
              title: titleVal,
              category: catSlugVal,
              categoryLabel: catLabelVal,
              images: finalImages,
              desc: editProductDesc.value || '',
              features: (editProductFeatures.value || '').split('\n').map(s => s.trim()).filter(Boolean),
              sizes: (editProductSizes.value || '').split('\n').map(s => s.trim()).filter(Boolean),
              specs: newSpecs
            };
            catalogItems.unshift(fallbackProduct);
          }
        }
        
        try {
          localStorage.setItem('plastokast_products', JSON.stringify(catalogItems));
        } catch (quotaErr) {
          console.warn('localStorage QuotaExceededError, compressing images aggressively...', quotaErr);
          catalogItems.forEach(p => {
            if (p.images && Array.isArray(p.images)) {
              p.images = p.images.map(img => (typeof img === 'string' && img.length > 300000) ? 'media/pk_cast_colored_v73.jpg?v=73' : img);
            }
          });
          localStorage.setItem('plastokast_products', JSON.stringify(catalogItems));
        }

        updateMetrics();
        renderCatalog();

        btnSaveProduct.innerHTML = '<i class="fa fa-check"></i> Saved Successfully!';
        btnSaveProduct.style.background = '#22c55e';

        setTimeout(() => {
          btnSaveProduct.disabled = false;
          btnSaveProduct.innerHTML = origBtnHtml;
          btnSaveProduct.style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
          if (productModal) productModal.classList.remove('show');
        }, 300);

      } catch (err) {
        console.error('Error saving product:', err);
        alert('Could not save product: ' + err.message);
        btnSaveProduct.disabled = false;
        btnSaveProduct.innerHTML = origBtnHtml;
      }
    });
  }

  // 7. Toggle Delete Mode (Show Checkboxes)
  if (btnToggleDeleteMode) {
    btnToggleDeleteMode.addEventListener('click', () => {
      isDeleteMode = true;
      btnToggleDeleteMode.style.display = 'none';
      if (deleteModeControls) deleteModeControls.style.display = 'flex';
      renderCatalog();
    });
  }

  // 8. Cancel Delete Mode (Hide Checkboxes & Clear Selection)
  if (btnCancelDeleteMode) {
    btnCancelDeleteMode.addEventListener('click', () => {
      isDeleteMode = false;
      selectedProductIds.clear();
      if (deleteModeControls) deleteModeControls.style.display = 'none';
      if (btnToggleDeleteMode) btnToggleDeleteMode.style.display = 'flex';
      renderCatalog();
    });
  }

  // 9. Confirm Delete Selected Items Handler
  if (btnConfirmDelete) {
    btnConfirmDelete.addEventListener('click', () => {
      const count = selectedProductIds.size;
      if (count === 0) return;
      
      const confirmDelete = confirm(`Are you sure you want to permanently delete ${count} selected product(s)?`);
      if (confirmDelete) {
        catalogItems = catalogItems.filter(p => !selectedProductIds.has(p.id));
        selectedProductIds.clear();
        isDeleteMode = false;
        if (deleteModeControls) deleteModeControls.style.display = 'none';
        if (btnToggleDeleteMode) btnToggleDeleteMode.style.display = 'flex';
        
        localStorage.setItem('plastokast_products', JSON.stringify(catalogItems));
        updateMetrics();
        renderCatalog();
      }
    });
  }

  // 10. Single Delete Product Handler in Modal
  if (btnDeleteSingleProduct) {
    btnDeleteSingleProduct.addEventListener('click', () => {
      if (!currentEditProductId) return;
      
      const prod = catalogItems.find(p => p.id === currentEditProductId);
      const prodName = prod ? prod.title : 'this product';
      
      const confirmDelete = confirm(`Are you sure you want to delete "${prodName}"?`);
      if (confirmDelete) {
        catalogItems = catalogItems.filter(p => p.id !== currentEditProductId);
        selectedProductIds.delete(currentEditProductId);
        localStorage.setItem('plastokast_products', JSON.stringify(catalogItems));
        productModal.classList.remove('show');
        updateMetrics();
        renderCatalog();
      }
    });
  }

  // 11. Event Listeners
  if (catalogSearch) {
    catalogSearch.addEventListener('input', renderCatalog);
  }
  
  if (catalogFilterCategory) {
    catalogFilterCategory.addEventListener('change', renderCatalog);
  }
  
  if (closeProductModal) {
    closeProductModal.addEventListener('click', () => productModal.classList.remove('show'));
  }
  
  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) productModal.classList.remove('show');
    });
  }

  // 12. Dynamic Category Management & Selector Logic
  const editProductCategorySelect = document.getElementById('editProductCategorySelect');
  const categoryManagerModal = document.getElementById('categoryManagerModal');
  const closeCategoryManagerModal = document.getElementById('closeCategoryManagerModal');
  const btnCloseCategoryManager = document.getElementById('btnCloseCategoryManager');
  const btnOpenCatManagerFromEditModal = document.getElementById('btnOpenCatManagerFromEditModal');
  const categoryManagerList = document.getElementById('categoryManagerList');
  const newCategoryNameInput = document.getElementById('newCategoryNameInput');
  const btnAddNewCategorySubmit = document.getElementById('btnAddNewCategorySubmit');

  let activeCategories = typeof getCategoriesData === 'function' ? getCategoriesData() : [];

  function refreshCategoryDropdowns() {
    activeCategories = typeof getCategoriesData === 'function' ? getCategoriesData() : activeCategories;
    
    // Populate Toolbar Filter dropdown
    if (catalogFilterCategory) {
      const currentVal = catalogFilterCategory.value || 'All';
      catalogFilterCategory.innerHTML = `<option value="All">All Categories</option>` + 
        activeCategories.map(c => `<option value="${c.slug}">${c.label}</option>`).join('');
      catalogFilterCategory.value = activeCategories.some(c => c.slug === currentVal) ? currentVal : 'All';
    }

    // Populate Product Edit/Create Modal Category Selector dropdown
    if (editProductCategorySelect) {
      const currentSlug = editProductCategory ? editProductCategory.value : '';
      editProductCategorySelect.innerHTML = activeCategories.map(c => `
        <option value="${c.slug}" data-label="${c.label}">${c.label}</option>
      `).join('');

      if (currentSlug && activeCategories.some(c => c.slug === currentSlug)) {
        editProductCategorySelect.value = currentSlug;
      } else if (activeCategories.length > 0) {
        editProductCategorySelect.value = activeCategories[0].slug;
        if (editProductCategory) editProductCategory.value = activeCategories[0].slug;
        if (editProductCategoryLabel) editProductCategoryLabel.value = activeCategories[0].label;
      }
    }
  }

  if (catalogFilterCategory) {
    catalogFilterCategory.addEventListener('change', () => {
      if (typeof refreshCatalog === 'function') refreshCatalog();
    });
  }

  if (editProductCategorySelect) {
    editProductCategorySelect.addEventListener('change', () => {
      const selectedOpt = editProductCategorySelect.options[editProductCategorySelect.selectedIndex];
      if (selectedOpt) {
        if (editProductCategory) editProductCategory.value = selectedOpt.value;
        if (editProductCategoryLabel) editProductCategoryLabel.value = selectedOpt.getAttribute('data-label') || selectedOpt.text;
      }
    });
  }

  // Global Category Management Working State & Prompt State
  let modalCategories = [];
  let currentPromptMode = 'add'; // 'add' or 'edit'
  let currentEditCategoryIndex = -1;

  window.openCategoryManagerModal = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const modal = document.getElementById('categoryManagerModal');
    if (!modal) return;

    activeCategories = typeof getCategoriesData === 'function' ? getCategoriesData() : activeCategories;
    // Deep clone working copy
    modalCategories = JSON.parse(JSON.stringify(activeCategories));
    
    renderCategoryManagerList();

    modal.classList.add('show');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
  };

  window.closeCategoryManagerModal = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    const modal = document.getElementById('categoryManagerModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.style.opacity = '0';
      modal.style.visibility = 'hidden';
    }
  };

  if (categoryManagerModal) {
    categoryManagerModal.addEventListener('click', (e) => {
      if (e.target === categoryManagerModal) window.closeCategoryManagerModal();
    });
  }

  // Helper auto-slug generator
  function slugify(text) {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  // Render Category Manager List (Clean Names + Dedicated Edit & Delete Buttons)
  function renderCategoryManagerList() {
    const categoryListTarget = document.getElementById('categoryManagerList');
    const totalCountEl = document.getElementById('modalCategoryTotalCount');
    if (!categoryListTarget) return;

    if (totalCountEl) {
      totalCountEl.textContent = `${modalCategories.length} Categor${modalCategories.length === 1 ? 'y' : 'ies'}`;
    }
    
    categoryListTarget.innerHTML = '';

    if (!modalCategories || modalCategories.length === 0) {
      categoryListTarget.innerHTML = `<div style="text-align: center; color: #94a3b8; font-size: 0.9rem; padding: 32px; background: #f8fafc; border-radius: 16px; border: 1.5px dashed #cbd5e1;">No categories added yet. Click <strong>+ Add Category</strong> above to create one!</div>`;
      return;
    }

    modalCategories.forEach((cat, index) => {
      const row = document.createElement('div');
      row.style.cssText = 'background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 12px 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.02);';

      row.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;">
          <span style="width: 34px; height: 34px; border-radius: 10px; background: #f3e8ff; color: #8b5cf6; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 800; flex-shrink: 0;">#${index + 1}</span>
          <span style="font-weight: 700; font-size: 1rem; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${cat.label}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
          <button type="button" class="btn-edit-cat-row" data-idx="${index}" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 7px 14px; border-radius: 10px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;" title="Edit Category Name">
            <i class="fa fa-pencil"></i> Edit
          </button>
          <button type="button" class="btn-delete-cat-row" data-idx="${index}" style="background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; padding: 7px 14px; border-radius: 10px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;" title="Delete Category">
            <i class="fa fa-trash"></i> Delete
          </button>
        </div>
      `;

      // Bind Edit button
      const editBtn = row.querySelector('.btn-edit-cat-row');
      editBtn.addEventListener('click', () => {
        window.openEditCategoryPopup(index);
      });

      // Bind Delete button
      const delBtn = row.querySelector('.btn-delete-cat-row');
      delBtn.addEventListener('click', () => {
        const catToDelete = modalCategories[index];
        const confirmDelete = confirm(`Are you sure you want to delete the category "${catToDelete.label || 'Unnamed'}"?`);
        if (confirmDelete) {
          modalCategories.splice(index, 1);
          renderCategoryManagerList();
        }
      });

      categoryListTarget.appendChild(row);
    });
  }
  window.renderCategoryManagerList = renderCategoryManagerList;

  // Sub-Popup Modal Handlers: Add Category & Edit Category
  window.openAddCategoryPopup = function() {
    currentPromptMode = 'add';
    currentEditCategoryIndex = -1;

    const modal = document.getElementById('categoryPromptModal');
    const title = document.getElementById('categoryPromptModalTitle');
    const subtitle = document.getElementById('categoryPromptModalSubtitle');
    const input = document.getElementById('categoryPromptInput');
    const btnText = document.getElementById('categoryPromptBtnText');

    if (title) title.innerHTML = '<i class="fa fa-plus-circle" style="color: #8b5cf6;"></i> Add New Category';
    if (subtitle) subtitle.textContent = 'Enter the name of your product category.';
    if (btnText) btnText.textContent = 'Add Category';
    if (input) {
      input.value = '';
      input.placeholder = 'e.g. Surgical Gloves, Casting Tapes...';
    }

    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'flex';
      modal.style.opacity = '1';
      modal.style.visibility = 'visible';
      setTimeout(() => { if (input) input.focus(); }, 100);
    }
  };

  window.openEditCategoryPopup = function(index) {
    if (!modalCategories[index]) return;
    currentPromptMode = 'edit';
    currentEditCategoryIndex = index;

    const cat = modalCategories[index];
    const modal = document.getElementById('categoryPromptModal');
    const title = document.getElementById('categoryPromptModalTitle');
    const subtitle = document.getElementById('categoryPromptModalSubtitle');
    const input = document.getElementById('categoryPromptInput');
    const btnText = document.getElementById('categoryPromptBtnText');

    if (title) title.innerHTML = '<i class="fa fa-pencil" style="color: #2563eb;"></i> Edit Category Name';
    if (subtitle) subtitle.textContent = `Update name for category #${index + 1}.`;
    if (btnText) btnText.textContent = 'Save Changes';
    if (input) {
      input.value = cat.label || '';
    }

    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'flex';
      modal.style.opacity = '1';
      modal.style.visibility = 'visible';
      setTimeout(() => { 
        if (input) {
          input.focus();
          input.select();
        }
      }, 100);
    }
  };

  window.closeCategoryPromptModal = function() {
    const modal = document.getElementById('categoryPromptModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.style.opacity = '0';
      modal.style.visibility = 'hidden';
    }
  };

  const promptModal = document.getElementById('categoryPromptModal');
  if (promptModal) {
    promptModal.addEventListener('click', (e) => {
      if (e.target === promptModal) window.closeCategoryPromptModal();
    });
  }

  // Submit Prompt Handler
  function handleCategoryPromptSubmit() {
    const input = document.getElementById('categoryPromptInput');
    if (!input) return;
    const catName = input.value.trim();
    if (!catName) {
      alert('Please enter a valid category name.');
      input.focus();
      return;
    }

    if (currentPromptMode === 'add') {
      const generatedSlug = slugify(catName);
      if (modalCategories.some(c => c.slug === generatedSlug)) {
        alert('A category with this name or slug already exists.');
        return;
      }
      modalCategories.push({
        slug: generatedSlug,
        label: catName
      });
    } else if (currentPromptMode === 'edit') {
      if (currentEditCategoryIndex >= 0 && modalCategories[currentEditCategoryIndex]) {
        modalCategories[currentEditCategoryIndex].label = catName;
      }
    }

    window.closeCategoryPromptModal();
    renderCategoryManagerList();
  }

  const btnSubmitPrompt = document.getElementById('btnSubmitCategoryPrompt');
  if (btnSubmitPrompt) {
    btnSubmitPrompt.addEventListener('click', handleCategoryPromptSubmit);
  }

  const inputPrompt = document.getElementById('categoryPromptInput');
  if (inputPrompt) {
    inputPrompt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCategoryPromptSubmit();
      }
    });
  }

  // Save & Finish Category Manager: Persist all changes and update products
  window.saveAndFinishCategoryManager = function() {
    if (!modalCategories || modalCategories.length === 0) {
      alert('Please have at least one category before saving.');
      return;
    }

    // Validate that no category name is empty
    for (let i = 0; i < modalCategories.length; i++) {
      if (!modalCategories[i].label || !modalCategories[i].label.trim()) {
        alert(`Category #${i + 1} name cannot be empty. Please enter a valid name.`);
        return;
      }
      modalCategories[i].label = modalCategories[i].label.trim();
      if (!modalCategories[i].slug) {
        modalCategories[i].slug = slugify(modalCategories[i].label);
      }
    }

    // Create mapping of slug to new label
    const slugToNewLabelMap = {};
    modalCategories.forEach(c => {
      slugToNewLabelMap[c.slug] = c.label;
    });

    // Update activeCategories
    activeCategories = JSON.parse(JSON.stringify(modalCategories));

    // Save Categories to localStorage
    if (typeof saveCategoriesData === 'function') {
      saveCategoriesData(activeCategories);
    } else {
      localStorage.setItem('plastokast_categories', JSON.stringify(activeCategories));
    }

    // Sync product items category labels if they changed
    loadCatalogData();
    let productsUpdated = false;
    if (catalogItems && Array.isArray(catalogItems) && catalogItems.length > 0) {
      catalogItems.forEach(prod => {
        if (prod.category && slugToNewLabelMap[prod.category]) {
          if (prod.categoryLabel !== slugToNewLabelMap[prod.category]) {
            prod.categoryLabel = slugToNewLabelMap[prod.category];
            productsUpdated = true;
          }
        }
      });

      if (productsUpdated) {
        localStorage.setItem('plastokast_products', JSON.stringify(catalogItems));
      }
    }

    // Refresh all UI elements
    refreshCategoryDropdowns();
    updateMetrics();
    renderCatalog();

    // Close Modal
    window.closeCategoryManagerModal();
  };

  // Initial render
  refreshCategoryDropdowns();
  updateMetrics();
  renderCatalog();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdminCatalog);
} else {
  initAdminCatalog();
}
