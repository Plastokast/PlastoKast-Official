/**
 * certificates-data.js
 * PlastoKast Certificates Data & Persistence Engine
 */

const DEFAULT_CERTIFICATES = [
  {
    id: "iso-13485",
    title: "ISO 13485 : 2016",
    subtitle: "Medical Devices ? Quality Management System (Certificate of Compliance)",
    icon: "fa-hospital-o",
    shortDesc: "Medical Devices Quality Management System international standard.",
    standard: "ISO 13485:2016",
    regNo: "RQMD91/12561",
    authority: "International Certification Services Pvt. Ltd. (ICS)",
    accreditation: "NABCB (QMS 009) & Member of Multilateral IAF",
    org: "PLASTOKAST",
    address: "Ground Floor, Common Plot, Om Shree Sadguru Nityanand Co-operative Housing Society, Laxmikant Asharam Road, Katargram, Surat - 395004, Gujarat, India",
    issueDate: "13th July, 2026 (Registered: 11th July, 2026)",
    validUntil: "10th July, 2029",
    status: "Active Verified",
    scope: "Manufacture And Supply Of Medical Device Such As Fiberglass Cast Bandage, Cast Padding Roll, Gamjee Roll, Crepe Bandage, Cast Shoes, Manual Cast Cutter, Cotton Cast Stockinett, Elastic Adhesive Bandage, Knee O Drape, Hip U Drape, Lamino Spinal Drape, Arthroscopy Drape, Cling Drape, Skin Stapler, Surgical Gown, Camera Cover, C-Arm Cover, Plain Plastic Sheet, Iodine Incision Drape And Finger Splints.",
    image: "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426832/plastokast_live/branding/iso-13485-certificate.jpg",
    enabled: true
  },
  {
    id: "cdsco",
    title: "CDSCO Registered",
    subtitle: "Central Drugs Standard Control Organisation (Ministry of Health, Govt. of India)",
    icon: "fa-university",
    shortDesc: "Central Drugs Standard Control Organisation ? Ministry of Health, Govt. of India.",
    standard: "Medical Devices Rules (MDR) 2017",
    regNo: "",
    authority: "Central Drugs Standard Control Organisation (CDSCO)",
    accreditation: "Directorate General of Health Services (DGHS), India",
    org: "PLASTOKAST",
    address: "Ground Floor, Common Plot, Om Shree Sadguru Nityanand Co-operative Housing Society, Laxmikant Asharam Road, Katargram, Surat - 395004, Gujarat, India",
    issueDate: "",
    validUntil: "",
    status: "Active Regulatory Compliance (Class A & B Devices)",
    scope: "Manufacture and supply of medical devices such as fiberglass casting bandages, pre-padded splint systems, cast padding rolls, cotton stockinettes, surgical drapes, and orthopedic consumables.",
    image: "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426832/plastokast_live/branding/cdsco-certificate.jpg",
    enabled: true
  },
  {
    id: "who-gmp",
    title: "WHO-GMP Standard",
    subtitle: "World Health Organization ? Good Manufacturing Practices",
    icon: "fa-shield",
    shortDesc: "World Health Organization Good Manufacturing Practices quality compliance.",
    standard: "WHO Guidelines for Good Manufacturing Practices (TRS Standards)",
    regNo: "",
    authority: "Food & Drugs Control Administration (FDCA)",
    accreditation: "WHO Technical Report Series (TRS Guidelines)",
    org: "PLASTOKAST",
    address: "Ground Floor, Common Plot, Om Shree Sadguru Nityanand Co-operative Housing Society, Laxmikant Asharam Road, Katargram, Surat - 395004, Gujarat, India",
    issueDate: "",
    validUntil: "",
    status: "Active GMP Quality Compliance",
    scope: "Manufacture of sterile and non-sterile medical devices, polyurethane synthetic casting tapes, splinting systems, and orthopedic consumables.",
    image: "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426833/plastokast_live/branding/who-gmp-certificate.jpg",
    enabled: true
  }
];

const CERT_STORAGE_KEY = "plastokast_certificates_data";

function getCertificatesData() {
  const saved = localStorage.getItem(CERT_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse saved certificates from localStorage, using defaults", e);
    }
  }
  localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(DEFAULT_CERTIFICATES));
  return JSON.parse(JSON.stringify(DEFAULT_CERTIFICATES));
}

function saveCertificatesData(certificates) {
  localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(certificates));
  window.dispatchEvent(new CustomEvent("plastokast_certificates_updated", { detail: certificates }));
}

function addCertificate(cert) {
  const list = getCertificatesData();
  if (!cert.id) {
    cert.id = "cert-" + Date.now();
  }
  if (typeof cert.enabled === "undefined") {
    cert.enabled = true;
  }
  list.push(cert);
  saveCertificatesData(list);
  return cert;
}

function updateCertificate(id, updatedFields) {
  const list = getCertificatesData();
  const index = list.findIndex(c => c.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...updatedFields };
    saveCertificatesData(list);
    return list[index];
  }
  return null;
}

function deleteCertificate(id) {
  let list = getCertificatesData();
  list = list.filter(c => c.id !== id);
  saveCertificatesData(list);
  return list;
}

function toggleCertificateEnabled(id) {
  const list = getCertificatesData();
  const cert = list.find(c => c.id === id);
  if (cert) {
    cert.enabled = !cert.enabled;
    saveCertificatesData(list);
    return cert.enabled;
  }
  return false;
}

function resetCertificatesToDefault() {
  localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(DEFAULT_CERTIFICATES));
  window.dispatchEvent(new CustomEvent("plastokast_certificates_updated", { detail: DEFAULT_CERTIFICATES }));
  return JSON.parse(JSON.stringify(DEFAULT_CERTIFICATES));
}

window.DEFAULT_CERTIFICATES = DEFAULT_CERTIFICATES;
window.getCertificatesData = getCertificatesData;
window.saveCertificatesData = saveCertificatesData;
window.addCertificate = addCertificate;
window.updateCertificate = updateCertificate;
window.deleteCertificate = deleteCertificate;
window.toggleCertificateEnabled = toggleCertificateEnabled;
window.resetCertificatesToDefault = resetCertificatesToDefault;
