// PlastoKast Central Cloud Database Service (Firebase Firestore)
(function() {
  const firebaseConfig = {
    apiKey: "AIzaSyD8op3Le1for74p763-am1cxY02_EJkwIE",
    authDomain: "plastokast-official.firebaseapp.com",
    projectId: "plastokast-official",
    storageBucket: "plastokast-official.firebasestorage.app",
    messagingSenderId: "497394121637",
    appId: "1:497394121637:web:dac2e28d68b8eae497864c",
    measurementId: "G-XTT61Y8GZT"
  };

  let db = null;
  let isInitialized = false;

  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      db = firebase.firestore();
      isInitialized = true;
      console.log('[PlastoKast Firebase] Initialized Firestore successfully.');
    } else {
      console.warn('[PlastoKast Firebase] Firebase SDK not loaded, using local storage fallback.');
    }
  } catch (err) {
    console.error('[PlastoKast Firebase] Initialization error:', err);
  }

  // Fallback / Cache helper for inquiries
  function getLocalInquiries() {
    try {
      const raw = localStorage.getItem('plastokast_inquiries');
      return raw ? JSON.parse(raw) : [];
    } catch(e) {
      return [];
    }
  }

  function setLocalInquiries(items) {
    try {
      localStorage.setItem('plastokast_inquiries', JSON.stringify(items));
    } catch(e) {}
  }

  // Public API exposed on window.PlastoKastDB
  window.PlastoKastDB = {
    isAvailable: function() {
      return isInitialized && db !== null;
    },

    getDb: function() {
      return db;
    },

    // Save a new inquiry to Firestore and local cache
    saveInquiry: async function(inquiryData) {
      if (!inquiryData) return;
      if (!inquiryData.id) {
        inquiryData.id = 'REQ-' + Math.floor(1000 + Math.random() * 9000);
      }
      if (!inquiryData.timestamp) {
        inquiryData.timestamp = new Date().toISOString();
      }
      if (!inquiryData.status) {
        inquiryData.status = 'Pending';
      }

      // Always update local cache immediately for zero latency
      const local = getLocalInquiries();
      const existingIdx = local.findIndex(item => item.id === inquiryData.id);
      if (existingIdx >= 0) {
        local[existingIdx] = { ...local[existingIdx], ...inquiryData };
      } else {
        local.unshift(inquiryData);
      }
      setLocalInquiries(local);

      // Save to Firebase Cloud Firestore
      if (this.isAvailable()) {
        try {
          await db.collection('inquiries').doc(inquiryData.id).set(inquiryData, { merge: true });
          console.log('[PlastoKast Firebase] Saved inquiry to Cloud Firestore:', inquiryData.id);
        } catch (err) {
          console.error('[PlastoKast Firebase] Error saving inquiry to Firestore:', err);
        }
      }
      return inquiryData;
    },

    // Listen to all inquiries in Real-Time (for CRM Admin Panel)
    onInquiriesChange: function(callback) {
      if (!this.isAvailable()) {
        // If offline or Firebase unavailable, invoke callback with local storage
        if (typeof callback === 'function') {
          callback(getLocalInquiries());
        }
        return () => {};
      }

      try {
        return db.collection('inquiries').onSnapshot((snapshot) => {
          const inquiries = [];
          snapshot.forEach(doc => {
            inquiries.push({ id: doc.id, ...doc.data() });
          });

          // Sort by timestamp descending
          inquiries.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

          // If database is completely brand new & empty, seed existing local inquiries to cloud
          if (inquiries.length === 0) {
            const local = getLocalInquiries();
            if (local.length > 0) {
              console.log('[PlastoKast Firebase] Seeding initial inquiries to Cloud Firestore...');
              local.forEach(item => {
                db.collection('inquiries').doc(item.id).set(item, { merge: true }).catch(()=>{});
              });
              if (typeof callback === 'function') callback(local);
              return;
            }
          }

          // Update local storage cache
          setLocalInquiries(inquiries);

          if (typeof callback === 'function') {
            callback(inquiries);
          }
        }, (error) => {
          console.error('[PlastoKast Firebase] Real-time inquiry listener error:', error);
          if (typeof callback === 'function') {
            callback(getLocalInquiries());
          }
        });
      } catch (err) {
        console.error('[PlastoKast Firebase] Error setting up listener:', err);
        if (typeof callback === 'function') {
          callback(getLocalInquiries());
        }
        return () => {};
      }
    },

    // Update single inquiry status or fields
    updateInquiry: async function(inquiryId, updateData) {
      // Update local storage cache
      const local = getLocalInquiries();
      const idx = local.findIndex(item => item.id === inquiryId);
      if (idx >= 0) {
        local[idx] = { ...local[idx], ...updateData };
        setLocalInquiries(local);
      }

      if (this.isAvailable()) {
        try {
          await db.collection('inquiries').doc(inquiryId).update(updateData);
          console.log('[PlastoKast Firebase] Updated inquiry in Firestore:', inquiryId);
        } catch(err) {
          console.error('[PlastoKast Firebase] Error updating inquiry in Firestore:', err);
        }
      }
    },

    // Delete multiple or single inquiries
    deleteInquiries: async function(inquiryIds) {
      if (!Array.isArray(inquiryIds)) inquiryIds = [inquiryIds];
      const idSet = new Set(inquiryIds);

      // Update local storage cache
      const local = getLocalInquiries().filter(item => !idSet.has(item.id));
      setLocalInquiries(local);

      if (this.isAvailable()) {
        try {
          const batch = db.batch();
          inquiryIds.forEach(id => {
            const docRef = db.collection('inquiries').doc(id);
            batch.delete(docRef);
          });
          await batch.commit();
          console.log('[PlastoKast Firebase] Deleted inquiries from Firestore:', inquiryIds);
        } catch(err) {
          console.error('[PlastoKast Firebase] Error deleting inquiries from Firestore:', err);
        }
      }
    },

    // -------------------------------------------------------------
    // CATALOG PRODUCTS CLOUD SYNC (Real-Time across all devices)
    // -------------------------------------------------------------
    saveProducts: async function(productsList) {
      if (!Array.isArray(productsList)) return;
      
      // Update local cache immediately
      try {
        localStorage.setItem('plastokast_products', JSON.stringify(productsList));
      } catch (e) {
        console.warn('[PlastoKast Firebase] Local storage write warning:', e);
      }

      if (typeof window !== 'undefined') {
        window.PRODUCTS_DATA = productsList;
        window.dispatchEvent(new CustomEvent('plastokast_products_updated', { detail: productsList }));
      }

      // Sync to Firebase Cloud Firestore
      if (this.isAvailable()) {
        try {
          await db.collection('catalog').doc('products').set({
            items: productsList,
            lastUpdated: new Date().toISOString()
          }, { merge: true });
          console.log('[PlastoKast Firebase] Successfully synced products catalog to Cloud Firestore.');
        } catch (err) {
          console.error('[PlastoKast Firebase] Error syncing products to Firestore:', err);
        }
      }
    },

    onProductsChange: function(callback) {
      if (!this.isAvailable()) {
        if (typeof callback === 'function') {
          const raw = localStorage.getItem('plastokast_products');
          if (raw) {
            try { callback(JSON.parse(raw)); } catch(e) {}
          }
        }
        return () => {};
      }

      try {
        return db.collection('catalog').doc('products').onSnapshot((doc) => {
          if (doc.exists) {
            const data = doc.data();
            if (data && Array.isArray(data.items) && data.items.length > 0) {
              try {
                localStorage.setItem('plastokast_products', JSON.stringify(data.items));
              } catch(e) {}

              if (typeof window !== 'undefined') {
                window.PRODUCTS_DATA = data.items;
                window.dispatchEvent(new CustomEvent('plastokast_products_updated', { detail: data.items }));
              }

              if (typeof callback === 'function') {
                callback(data.items);
              }
              return;
            }
          }

          // Initial cold start seed if Firestore empty
          if (typeof STATIC_PRODUCTS_DATA !== 'undefined' && STATIC_PRODUCTS_DATA.length > 0) {
            console.log('[PlastoKast Firebase] Seeding initial catalog to Firestore...');
            db.collection('catalog').doc('products').set({
              items: STATIC_PRODUCTS_DATA,
              lastUpdated: new Date().toISOString()
            }, { merge: true }).catch(()=>{});
            if (typeof callback === 'function') callback(STATIC_PRODUCTS_DATA);
          }
        }, (error) => {
          console.error('[PlastoKast Firebase] Products listener error:', error);
          if (typeof callback === 'function') {
            const raw = localStorage.getItem('plastokast_products');
            if (raw) {
              try { callback(JSON.parse(raw)); } catch(e) {}
            }
          }
        });
      } catch (err) {
        console.error('[PlastoKast Firebase] Error subscribing to products:', err);
        return () => {};
      }
    },

    // -------------------------------------------------------------
    // CATEGORIES CLOUD SYNC
    // -------------------------------------------------------------
    saveCategories: async function(categoriesList) {
      if (!Array.isArray(categoriesList)) return;

      try {
        localStorage.setItem('plastokast_categories', JSON.stringify(categoriesList));
      } catch(e) {}

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('plastokast_categories_updated', { detail: categoriesList }));
      }

      if (this.isAvailable()) {
        try {
          await db.collection('catalog').doc('categories').set({
            items: categoriesList,
            lastUpdated: new Date().toISOString()
          }, { merge: true });
          console.log('[PlastoKast Firebase] Successfully synced categories to Cloud Firestore.');
        } catch (err) {
          console.error('[PlastoKast Firebase] Error syncing categories to Firestore:', err);
        }
      }
    },

    onCategoriesChange: function(callback) {
      if (!this.isAvailable()) {
        if (typeof callback === 'function') {
          const raw = localStorage.getItem('plastokast_categories');
          if (raw) {
            try { callback(JSON.parse(raw)); } catch(e) {}
          }
        }
        return () => {};
      }

      try {
        return db.collection('catalog').doc('categories').onSnapshot((doc) => {
          if (doc.exists) {
            const data = doc.data();
            if (data && Array.isArray(data.items) && data.items.length > 0) {
              try {
                localStorage.setItem('plastokast_categories', JSON.stringify(data.items));
              } catch(e) {}

              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('plastokast_categories_updated', { detail: data.items }));
              }

              if (typeof callback === 'function') {
                callback(data.items);
              }
              return;
            }
          }

          if (typeof DEFAULT_CATEGORIES !== 'undefined') {
            db.collection('catalog').doc('categories').set({
              items: DEFAULT_CATEGORIES,
              lastUpdated: new Date().toISOString()
            }, { merge: true }).catch(()=>{});
            if (typeof callback === 'function') callback(DEFAULT_CATEGORIES);
          }
        }, (error) => {
          console.error('[PlastoKast Firebase] Categories listener error:', error);
        });
      } catch (err) {
        console.error('[PlastoKast Firebase] Error subscribing to categories:', err);
        return () => {};
      }
    },

    // -------------------------------------------------------------
    // FAQS CLOUD SYNC
    // -------------------------------------------------------------
    saveFaqs: async function(faqsList) {
      if (!Array.isArray(faqsList)) return;
      try {
        localStorage.setItem('plastokast_faqs_data', JSON.stringify(faqsList));
      } catch(e) {}

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('plastokast_faqs_updated', { detail: faqsList }));
      }

      if (this.isAvailable()) {
        try {
          await db.collection('content').doc('faqs').set({
            items: faqsList,
            lastUpdated: new Date().toISOString()
          }, { merge: true });
        } catch(e) {}
      }
    },

    onFaqsChange: function(callback) {
      if (!this.isAvailable()) return () => {};
      try {
        return db.collection('content').doc('faqs').onSnapshot((doc) => {
          if (doc.exists) {
            const data = doc.data();
            if (data && Array.isArray(data.items)) {
              try {
                localStorage.setItem('plastokast_faqs_data', JSON.stringify(data.items));
              } catch(e) {}
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('plastokast_faqs_updated', { detail: data.items }));
              }
              if (typeof callback === 'function') callback(data.items);
            }
          }
        });
      } catch(e) { return () => {}; }
    },

    // -------------------------------------------------------------
    // CERTIFICATES CLOUD SYNC
    // -------------------------------------------------------------
    saveCertificates: async function(certsList) {
      if (!Array.isArray(certsList)) return;
      try {
        localStorage.setItem('plastokast_certificates_data', JSON.stringify(certsList));
      } catch(e) {}

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('plastokast_certificates_updated', { detail: certsList }));
      }

      if (this.isAvailable()) {
        try {
          await db.collection('content').doc('certificates').set({
            items: certsList,
            lastUpdated: new Date().toISOString()
          }, { merge: true });
        } catch(e) {}
      }
    },

    onCertificatesChange: function(callback) {
      if (!this.isAvailable()) return () => {};
      try {
        return db.collection('content').doc('certificates').onSnapshot((doc) => {
          if (doc.exists) {
            const data = doc.data();
            if (data && Array.isArray(data.items)) {
              try {
                localStorage.setItem('plastokast_certificates_data', JSON.stringify(data.items));
              } catch(e) {}
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('plastokast_certificates_updated', { detail: data.items }));
              }
              if (typeof callback === 'function') callback(data.items);
            }
          }
        });
      } catch(e) { return () => {}; }
    }
  };
})();
