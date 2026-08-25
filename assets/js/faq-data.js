/**
 * faq-data.js
 * PlastoKast FAQ Data & Persistence Engine
 * Supports local storage persistence, event synchronization, and admin CRUD
 */

const DEFAULT_FAQS = [
  {
    id: "faq-1",
    question: "How long does PK Cast™ (Fiberglass Bandage) take to set and bear weight?",
    answer: "Once activated with room temperature water (20°C–25°C) for 2 to 3 seconds, <strong>PK Cast™</strong> begins setting within <strong>3 to 5 minutes</strong>. It achieves full anatomical rigidity and weight-bearing strength within <strong>20 to 30 minutes</strong>, compared to traditional plaster-of-paris casts which require 24 to 48 hours to cure completely.",
    category: "Casting & Bandages",
    order: 1,
    enabled: true
  },
  {
    id: "faq-2",
    question: "What is the difference between PK Cast™ Rigid and PK Soft Cast™?",
    answer: "<strong>PK Cast™ (Rigid)</strong> provides absolute rigid immobilization for primary fractures, acute bone trauma, and post-surgical stabilization. In contrast, <strong>PK Soft Cast™ (Semi-Rigid)</strong> provides flexible functional stabilization with soft edges that allow controlled physiological movement, making it ideal for sports medicine, pediatric orthopedics, soft tissue injuries, and removable functional braces.",
    category: "Casting & Bandages",
    order: 2,
    enabled: true
  },
  {
    id: "faq-3",
    question: "Are PK Cast™ and PK Cast Graphics™ radiolucent for X-ray examinations?",
    answer: "Yes, 100%. All PlastoKast™ casting products—including <strong>PK Cast Graphics™</strong> with colored and cartoon patterns—are completely radiolucent. Orthopedic specialists can clearly visualize bone union, callus formation, and anatomical alignment on standard radiographic X-rays without needing to cut or remove the cast.",
    category: "Diagnostics & Safety",
    order: 3,
    enabled: true
  },
  {
    id: "faq-4",
    question: "What is included in the PK Cast™ Fibreglass Bandage Kit?",
    answer: "The <strong>PK Cast™ Kit</strong> (available in 4\" and 5\" widths) is an all-in-one procedural pack engineered for orthopedic clinics and hospital trauma rooms. Each individual kit contains: 2 Rolls of PK Cast™ Fiberglass Casting Bandage, 1 Roll of High-Grade Cast Padding, 1 Roll of Tubular Cotton Stockinet, and 2 Pairs of Nitrile Application Gloves.",
    category: "Procedure Kits",
    order: 4,
    enabled: true
  },
  {
    id: "faq-5",
    question: "How does the PK Splint™ roll & pre-cut system work for emergency trauma?",
    answer: "<strong>PK Splint™</strong> features a multi-layer synthetic substrate enclosed in a soft, non-woven hydro-repellent padding. It requires no separate padding application. Simply immerse in water, squeeze out excess, apply to the fractured extremity, and mold in place using an elastic bandage. Available in both customizable roll form (with an airtight reseal clip) and pre-cut lengths.",
    category: "Splints & Emergency",
    order: 5,
    enabled: true
  }
];

const FAQ_STORAGE_KEY = "plastokast_faqs_data";

function getFaqsData() {
  const saved = localStorage.getItem(FAQ_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    } catch (e) {
      console.warn("Failed to parse saved FAQs from localStorage, using defaults", e);
    }
  }
  localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(DEFAULT_FAQS));
  return DEFAULT_FAQS;
}

function saveFaqsData(faqs) {
  if (!Array.isArray(faqs)) return;
  localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(faqs));
  window.dispatchEvent(new CustomEvent("plastokast_faqs_updated", { detail: faqs }));
}

function addFaq(faqItem) {
  const list = getFaqsData();
  if (!faqItem.id) {
    faqItem.id = "faq-" + Date.now();
  }
  if (faqItem.enabled === undefined) faqItem.enabled = true;
  if (!faqItem.order) faqItem.order = list.length + 1;
  list.push(faqItem);
  saveFaqsData(list);
  return faqItem;
}

function updateFaq(id, updatedFields) {
  const list = getFaqsData();
  const idx = list.findIndex(f => f.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updatedFields };
    saveFaqsData(list);
    return list[idx];
  }
  return null;
}

function deleteFaq(id) {
  let list = getFaqsData();
  list = list.filter(f => f.id !== id);
  saveFaqsData(list);
  return list;
}

function toggleFaqStatus(id) {
  const list = getFaqsData();
  const item = list.find(f => f.id === id);
  if (item) {
    item.enabled = !item.enabled;
    saveFaqsData(list);
    return item.enabled;
  }
  return null;
}

function resetFaqsToDefault() {
  localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(DEFAULT_FAQS));
  window.dispatchEvent(new CustomEvent("plastokast_faqs_updated", { detail: DEFAULT_FAQS }));
  return DEFAULT_FAQS;
}
