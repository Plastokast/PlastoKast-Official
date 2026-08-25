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
    }
  };
})();
