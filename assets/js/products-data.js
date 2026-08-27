/* PlastoKast™ Official Product Catalog Database (Client-Side Storage Replica)
   - Synchronized with Official PlastoKast PDF Catalog
   - Version: 4
*/

const STATIC_PRODUCTS_DATA = [
  {
    id: "pk-tkr-kit",
    code: "PK-KIT-002",
    title: "TKR / THR Customised Disposable Kit",
    category: "surgical-consumables",
    categoryLabel: "SURGICAL DRAPES & CONSUMABLES",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426800/plastokast_live/products/pk_tkr_kit.jpg"
    ],
    desc: "Complete customized orthopedic surgical disposable kit for TKR / THR procedures.",
    sizes: [
      "Complete Surgical Procedure Pack"
    ],
    features: [
      "Includes Knee O Drape / Hip U Drape, Iodine Incision Drape 56x45",
      "Includes Cling Drape, 4x Plain Sheets, 4x Mops, Suture, Skin Stapler",
      "Includes 10% Iodine Solution 100ml, Yankur Suction/Cautery Pencil",
      "Includes 4 Pairs Encore Ortho Gloves & 4x Reinforced Surgeon Gowns"
    ],
    specs: {
      "Kit Components": "Drapes, Gowns, Sheets, Suction Pencil, Skin Stapler, Gloves & Solution",
      "Application": "Total Knee / Total Hip Replacement Surgeries",
      "Sterility": "Sterile EO Industrial Custom Pack"
    }
  },
  {
    id: "plastokast-fiberglass-tape",
    code: "PK-CT-001",
    title: "PK Cast (Fiberglass Bandage)",
    category: "casting-tapes",
    categoryLabel: "Casting Tapes",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426801/plastokast_live/products/pk_cast_colored_v73.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426802/plastokast_live/products/pk_cast_all_packets_v73.jpg"
    ],
    desc: "Superior handling is an outstanding feature of PK Cast. Its high conformability and the benefits of a new resin formulation guarantee problem-free application and superb anatomically moulded casts.",
    sizes: [
      '2" inch (Length : 3.6 mtr.)',
      '3" inch (Length : 3.6 mtr.)',
      '4" inch (Length : 3.6 mtr.)',
      '5" inch (Length : 3.6 mtr.)',
      '6" inch (Length : 3.6 mtr.)'
    ],
    features: [
      "Superior handling and outstanding application conformability",
      "New resin formulation for problem-free application",
      "Guarantees superb anatomically moulded casts",
      "High conformability around joint curves & contours",
      "Available in 2\", 3\", 4\", 5\", 6\" inch (Length: 3.6 mtr.)"
    ],
    specs: {
      "Product Name": "PK Cast (Fiberglass Bandage)",
      "Available Sizes": "2\", 3\", 4\", 5\", 6\" inch",
      "Length": "3.6 mtr.",
      "Material": "Fiberglass mesh with advanced polyurethane resin matrix",
      "Application": "Orthopedic fracture immobilization & casting"
    }
  },
  {
    id: "pk-cast-graphics",
    code: "PK-CG-002",
    title: "PK Cast Graphics (Fiberglass Bandage)",
    category: "casting-tapes",
    categoryLabel: "Casting Tapes",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426802/plastokast_live/products/pk_graphics_camo_v73.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426803/plastokast_live/products/pk_graphics_cartoon_v73.jpg"
    ],
    desc: "Add personality and color to casts with our exiting patterns. In addition to helping relieve patient anxiety and making casts more enjoyable to wear, the finished cast is strong, lightweight and durable. Patterns are colorfast and will not interfere with radiographic viewing.",
    sizes: [
      '2", 3", 4", 5" inch (Length : 3.6 mtr.)'
    ],
    features: [
      "Add personality and color to casts with exciting patterns",
      "Helps relieve patient anxiety and makes casts enjoyable to wear",
      "Finished cast is strong, lightweight and durable",
      "Colorfast patterns will not interfere with radiographic viewing",
      "Available in 2\", 3\", 4\", 5\" inch (Length : 3.6 mtr.)"
    ],
    specs: {
      "Available Sizes": '2", 3", 4", 5" inch',
      "Length": "3.6 mtr.",
      "Material": "Printed Fiberglass mesh with polyurethane resin matrix",
      "Features": "Colorfast patterns, Radiolucent, High strength"
    }
  },
  {
    id: "pk-cast-kit",
    code: "PK-CK-001",
    title: "PK Cast Fibreglass Bandage Kit",
    category: "casting-tapes",
    categoryLabel: "Casting Tapes & Kits",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426804/plastokast_live/products/pk_cast_kit_main_v89.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426805/plastokast_live/products/pk_cast_kit_4in_v89.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426806/plastokast_live/products/pk_cast_kit_5in_v89.jpg"
    ],
    desc: "The PK Cast Kit offers a complete and convenient solution for orthopedic casting needs.",
    sizes: [
      '4" in (10 cm x 360 cm)',
      '5" in (12.5 cm x 360 cm)'
    ],
    features: [
      "Complete & convenient all-in-one solution for orthopedic casting needs",
      "Kit contains: 2 Rolls of Fiberglass Bandage, 1 Cast Padding Roll, 1 Stockinet Roll & 2 Pairs of Gloves",
      "Ready-to-use surgical procedure kit for hospitals & orthopedic clinics",
      "Available sizes: 4\" in (10cm x 360cm) and 5\" in (12.5cm x 360cm)"
    ],
    specs: {
      "Kit Contents": "2 Rolls Fiberglass Bandage, 1 Cast Padding Roll, 1 Stockinet Roll, 2 Pairs Gloves",
      "Available Box Sizes": '4" in (10 cm x 360 cm), 5" in (12.5 cm x 360 cm)',
      "Application": "Complete Orthopedic Casting Procedure Solution"
    }
  },
    {
    id: "pk-finger-splint",
    code: "PK-EQ-002",
    title: "PK Finger Splint",
    category: "splints",
    categoryLabel: "Orthopedic Splints",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426807/plastokast_live/products/pk_finger_splint_main_v130.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426807/plastokast_live/products/pk_spoon_splint_v130.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426808/plastokast_live/products/pk_mallet_splint_v130.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426809/plastokast_live/products/pk_capener_splint_v130.jpg"
    ],
    desc: "PlastoKast PK Finger Splints provide ergonomic immobilization and anatomical support for distal and proximal interphalangeal finger joint injuries, sprains, fractures, and tendon repairs.",
    sizes: [
      "Spoon Splint",
      "Mallet Splint (Small, Medium, Large)",
      "Capener Splint"
    ],
    features: [
      "Anatomical design provides firm immobilization for finger fractures, sprains & tendon injuries",
      "Includes Spoon Splint, Mallet Splint (S/M/L) and dynamic Capener Splint options",
      "Lightweight aluminum and padded foam construction for maximum patient comfort",
      "Easy to apply, adjust, and maintain in orthopedic clinic & emergency rehabilitation"
    ],
    specs: {
      "Splint Variants": "Spoon Splint, Mallet Splint, Capener Splint",
      "Available Sizes": "Small, Medium, Large (Mallet Splint)",
      "Material Composition": "Padded Malleable Aluminum & Elastic Strapping",
      "Clinical Indications": "Finger joint fractures, mallet finger, PIP joint extension, sprains"
    }
  },
    {
    id: "plastokast-under-cast-padding",
    code: "PK-PR-001",
    title: "PK Cast Padding Roll",
    category: "liners-accessories",
    categoryLabel: "Cast Liners & Accessories",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426810/plastokast_live/products/pk_padding_rolls_v73.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426810/plastokast_live/products/pk_padding_pouches_v73.jpg"
    ],
    desc: "PK Synthetic Cast Padding roll is a non-absorbent synthetic material that does not hold moisture against the skin. Its conformable stretch allows narrow widths around small anatomies without cutting and tearing.",
    sizes: [
      "10 cm x 3 mtr",
      "15 cm x 3 mtr"
    ],
    features: [
      "Non-absorbent synthetic material that does not hold moisture against skin",
      "Conformable stretch allows narrow widths around small anatomies without cutting & tearing",
      "Protects skin from friction and pressure points under casting tapes",
      "Smooth, uniform soft roll cushioning",
      "Available in 10 cm x 3 mtr and 15 cm x 3 mtr"
    ],
    specs: {
      "Available Sizes": "10 cm x 3 mtr, 15 cm x 3 mtr",
      "Material": "Non-absorbent synthetic hydrophobic fibers",
      "Moisture Absorption": "0% (Hydrophobic skin protection)",
      "Application": "Orthopedic under-cast skin padding"
    }
  },
  {
    id: "plastokast-tubular-stockinette",
    code: "PK-ST-001",
    title: "PK Premium Cotton Stockinet",
    category: "liners-accessories",
    categoryLabel: "Cast Liners & Accessories",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426811/plastokast_live/products/pk_stockinet_main_v73.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426812/plastokast_live/products/pk_stockinet_white_v73.jpg"
    ],
    desc: "Orthopedic Cotton Stockinette consists of a high-grade absorbent cotton that is an ideal under cast layer. It stretches to three times its width to conform to complex anatomies.",
    sizes: [
      '2", 3", 4" inch (Length : 1 mtr & 10 mtr.)'
    ],
    features: [
      "Consists of high-grade absorbent cotton as an ideal under cast layer",
      "Stretches to three times its width to conform to complex anatomies",
      "Seamless circular knit prevents pressure seam marks",
      "Absorbs perspiration under rigid orthopedic casts",
      "Available in 2\", 3\", 4\" inch (Length : 1 mtr & 10 mtr.)"
    ],
    specs: {
      "Available Sizes": '2", 3", 4" inch',
      "Length": "1 mtr & 10 mtr.",
      "Material": "100% High-grade absorbent cotton yarn",
      "Stretch": "Stretches up to 3x (300%) widthwise"
    }
  },
  {
    id: "pk-waterproof-soft-roll",
    code: "PK-WR-001",
    title: "PK Waterproof Soft Roll",
    category: "liners-accessories",
    categoryLabel: "Cast Liners & Accessories",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426812/plastokast_live/products/pk_waterproof_roll_main_v75.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426813/plastokast_live/products/pk_waterproof_pouch_v75.jpg"
    ],
    desc: "The waterproof soft roll offers water-resistance property as well. The open knit structure of the Nylon accelerate drainage after submerging in water. The patient's body temperature will then evaporate residual moisture quickly through the airy mesh structure. In this way, cast and skin dry quickly and skin feels dry in about 90 minutes atter daily hygiene.",
    sizes: [
      "10 cm (Length: 3 mtr.)"
    ],
    features: [
      "Waterproof soft roll offers water-resistance property for daily bathing",
      "Open knit structure of Nylon accelerates drainage after submerging in water",
      "Body temperature evaporates residual moisture quickly through airy mesh",
      "Cast and skin dry quickly — skin feels dry in ~90 minutes after daily hygiene",
      "Available in 10 cm (Length: 3 mtr.)"
    ],
    specs: {
      "Available Sizes": "10 cm",
      "Length": "3 mtr.",
      "Material": "Open-knit hydrophobic Nylon mesh structure",
      "Drying Time": "Skin feels dry in ~90 minutes after hygiene"
    }
  },
  {
    id: "pk-gamjee-roll",
    code: "PK-GR-001",
    title: "PK Cast Gamjee Roll",
    category: "liners-accessories",
    categoryLabel: "Cast Liners & Accessories",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426814/plastokast_live/products/pk_gamjee_roll_main_v77.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426815/plastokast_live/products/pk_gamjee_pouch_v77.jpg"
    ],
    desc: "PK Cast Gamjee Roll is a soft cotton roll or bundle used in wound care, such as surgery. It comprises three layers of gauze, absorbent cotton, and gauge wrapped around each other. It helps to provide a secure cover around the wound and helps in easy and comfortable recovery.",
    sizes: [
      '4", 6" inch (Length: 3 mtr.)'
    ],
    features: [
      "Comprises three layers of gauze, absorbent cotton, and gauze wrapped around each other",
      "Soft cotton roll used in post-op surgical wound care",
      "Provides secure cover around wound for comfortable recovery",
      "Available in Premium and Regular clinical quality grades",
      "Available sizes: 4\", 6\" inch (Length: 3 mtr.)"
    ],
    specs: {
      "Available Sizes": '4", 6" inch',
      "Length": "3 mtr.",
      "Quality Grades": "Premium / Regular",
      "Layer Structure": "3-layer core (Gauze, Absorbent Cotton, Gauze)"
    }
  },
  {
    id: "pk-cast-shoe",
    code: "PK-CS-001",
    title: "PK Cast Shoes",
    category: "liners-accessories",
    categoryLabel: "Cast Liners & Accessories",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426816/plastokast_live/products/pk_cast_shoe_main_v79.jpg"
    ],
    desc: "Light weight tapered sole. Sturdy construction. Easy to wear & remove better patient compliance prevents soiling of the cast. It is used to support, protect, or aid in the use of cast, orthosis (brace), or prosthesis.",
    sizes: [
      "Small",
      "Medium",
      "Large",
      "X-Large"
    ],
    features: [
      "Light weight tapered sole for comfortable gait",
      "Sturdy construction provides durable protection",
      "Easy to wear & remove for better patient compliance",
      "Prevents soiling and damage of the orthopedic cast",
      "Used to support, protect, or aid in the use of cast, orthosis (brace), or prosthesis",
      "Available in Small, Medium, Large, X-Large"
    ],
    specs: {
      "Available Sizes": "Small, Medium, Large, X-Large",
      "Sole Type": "Light weight tapered sole",
      "Construction": "Sturdy protective build",
      "Function": "Protects cast, orthosis, or prosthesis"
    }
  },
  {
    id: "pk-crepe-bandage",
    code: "PK-EAB-001",
    title: "PK Elastic Adhesive Bandage",
    category: "pop-bandages",
    categoryLabel: "Plaster & POP Bandages",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426816/plastokast_live/products/pk_eab_box_main_v81.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426817/plastokast_live/products/pk_eab_tubs_v81.jpg"
    ],
    desc: "EAB Bandage is a lightweight, ideal-sized bandage that is comfortable and easy to wrap. It has non-fraying edges and is suitable for orthopaedic usage. It is easy to use and maintain",
    sizes: [
      '4" Inch (Length: 1 mtr & 4 mtr.)'
    ],
    features: [
      "Lightweight, ideal-sized bandage that is comfortable and easy to wrap",
      "Non-fraying edges suitable for orthopaedic usage & joint stabilization",
      "Available in Acrylic Gum and White Gum adhesive options",
      "Easy to use, apply, and maintain in clinical & sports applications",
      "Available size: 4\" Inch (Length: 1 mtr & 4 mtr.)"
    ],
    specs: {
      "Available Sizes": '4" Inch',
      "Length Options": "1 mtr & 4 mtr.",
      "Adhesive Options": "Acrylic Gum / White Gum",
      "Feature": "Non-fraying edges, lightweight & comfortable"
    }
  },
  {
    id: "pk-electric-cutter",
    code: "PK-EQ-001",
    title: "Electric Plaster Cutter",
    category: "clinical-equipment",
    categoryLabel: "Clinical & Surgical Equipment",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426818/plastokast_live/products/pk_electric_cutter_main_v94.jpg"
    ],
    desc: "High-performance medical electric plaster saw designed for safe, fast, and effortless removal of synthetic and plaster casts.",
    sizes: [
      "Standard Clinical Unit (Includes Replacement Saw Blades)"
    ],
    features: [
      "High-speed oscillating motor cuts cast material without cutting soft tissue",
      "Ergonomic handle designed for low vibration, comfortable grip, and minimal noise",
      "Includes heavy-duty stainless steel oscillating saw blades for synthetic & POP casts",
      "Hospital-grade power cord and safety switch for orthopedic clinical use"
    ],
    specs: {
      "Motor Speed": "12,000 - 18,000 oscillations/min",
      "Safety Mechanism": "Soft-tissue protective oscillating blade",
      "Blades Included": "Stainless steel & alloy saw blades for POP and Synthetic casts",
      "Power Cord": "Heavy-duty clinical grade power cable"
    }
  },
  {
    id: "pk-skin-stapler",
    code: "PK-EQ-009",
    title: "PK Skin Stapler",
    category: "clinical-equipment",
    categoryLabel: "Clinical & Surgical Equipment",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426819/plastokast_live/products/pk_skin_stapler_main_v115.jpg"
    ],
    desc: "PK Skin Stapler is a sterile, single patient use instrument designed to deliver rectangular, stainless steel staples for routine wound closure.",
    sizes: [
      "Standard 35-Staple Pre-loaded Dispenser"
    ],
    features: [
      "Pre-loaded with 35 medical grade 316L stainless steel staples",
      "Clear staple counter window shows remaining staples",
      "Ergonomic handle design for precise single-hand placement",
      "Sterilized by Ethylene Oxide (EO)"
    ],
    specs: {
      "Staple Material": "316L Medical Grade Stainless Steel",
      "Staple Count": "35 Rectangular Staples",
      "Sterility": "Sterile EO Single-Use"
    }
  },
  {
    id: "pk-knee-o-drape",
    code: "PK-EQ-003",
    title: "PK Knee O Drape",
    category: "surgical-consumables",
    categoryLabel: "Surgical Drapes & Consumables",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426820/plastokast_live/products/pk_knee_o_drape_main_v99.jpg"
    ],
    desc: "Knee O Drape Ultra of size 350cm*240cm, reinforced with premium SSMMS absorbent fabric and latex-free material having a centre hole of 5 cm aperture, supported with tube holder for tube and cord organizer.",
    sizes: [
      "350 cm x 240 cm (Aperture: 5 cm)"
    ],
    features: [
      "Reinforced with premium SSMMS absorbent fabric & latex-free fluid control material",
      "Features 5 cm elasticized circular aperture for secure limb isolation",
      "Built-in integrated tube holders & cord organizers for surgical theater management",
      "Complete sterile pack includes Knee O Drape, Head Sheet, Leggings, Strapes & Wrap",
      "Ethylene Oxide (EO) Sterilized for orthopedic knee surgery procedures"
    ],
    specs: {
      "Drape Size": "350 cm x 240 cm",
      "Aperture Size": "5 cm circular aperture",
      "Material": "SSMMS Absorbent Fabric + PE Film",
      "Pack Contents": "1x Knee O Drape, 1x Head Sheet (160x100cm), 1x Leggings, 4x Strapes, 1x Wrap",
      "Sterility": "Sterile EO Single Patient Use"
    }
  },
  {
    id: "pk-bilateral-knee-o-drape",
    code: "PK-EQ-004",
    title: "PK Bilateral Knee O Drape",
    category: "surgical-consumables",
    categoryLabel: "Surgical Drapes & Consumables",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426821/plastokast_live/products/pk_bilateral_knee_drape_main_v102.jpg"
    ],
    desc: "Bilateral Knee O Drape of size 350cm * 250cm reinforced with laminated spunlace absorbent fabric and 2 latex free material having centre hole of 5 cm aperture, supported with tube holder for tube and cord organiser.",
    sizes: [
      "350 cm x 250 cm (2 Apertures: 5 cm)"
    ],
    features: [
      "Dual-aperture design for simultaneous bilateral knee surgical procedures",
      "Reinforced with laminated spunlace absorbent fabric & 2 latex-free fluid control zones",
      "Dual 5 cm circular apertures provide firm and secure bilateral limb isolation",
      "Built-in integrated tube holders & cord organizers for theater cable management",
      "Complete sterile pack includes Bilateral Drape, Leggings, Strapes & Wrap"
    ],
    specs: {
      "Drape Size": "350 cm x 250 cm",
      "Aperture Count & Size": "2 Apertures (5 cm circular each)",
      "Material Composition": "Laminated Spunlace Absorbent Fabric & PE Film",
      "Pack Contents": "1x Bilateral Drape, 1x Leggings, 4x Strapes, 1x Wrap",
      "Sterility": "Sterile EO Single Patient Use"
    }
  },
  {
    id: "pk-lamino-spinal-drape",
    code: "PK-EQ-005",
    title: "PK Lamino Spinal Drape",
    category: "surgical-consumables",
    categoryLabel: "Surgical Drapes & Consumables",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426821/plastokast_live/products/pk_lamino_spinal_drape_main_v107.jpg"
    ],
    desc: "Lamino Spinal drape of size 340cm * 160cm, having fenestration size of 35 cm * 17 cm with incise film and adhesive tape around fenestration, reinforced with spunlace absorbent around fenestration, backdrop reinforced for better protection from fluid penetration and concentration, supported with 2 pockets for placing instruments, tube holders for the tube, and a cord organizer.",
    sizes: [
      "340 cm x 160 cm (Incise Fenestration: 35 cm x 17 cm)"
    ],
    features: [
      "Incise film & adhesive tape around 35 cm x 17 cm fenestration for sterile operative field",
      "Spunlace absorbent reinforcement around fenestration for superior fluid control",
      "Backdrop fluid barrier reinforcement protects surgical team from penetration & concentration",
      "Integrated 2 instrument pockets, dual tube holders & cord organizer for cable management",
      "Complete sterile pack includes Lamino Spinal Drape, Strapes & Wrap"
    ],
    specs: {
      "Drape Size": "340 cm x 160 cm",
      "Incise Fenestration Size": "35 cm x 17 cm with incise film & adhesive tape",
      "Material Composition": "SSMMS Fabric & Spunlace Absorbent Reinforcement",
      "Special Features": "2 Instrument pockets, cable holders & cord organizers",
      "Pack Contents": "1x Lamino Spinal Drape, 4x Strapes, 1x Wrap",
      "Sterility": "Sterile EO Single Patient Use"
    }
  },
  {
    id: "pk-hip-u-drape",
    code: "PK-EQ-006",
    title: "PK Hip U Drape",
    category: "surgical-consumables",
    categoryLabel: "Surgical Drapes & Consumables",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426822/plastokast_live/products/pk_hip_u_drape_main_v106.jpg"
    ],
    desc: "Hip U Drape of size 300cm * 160cm having U Split 10cm * 80cm with adhesive around U split, reinforced with laminated spunlace absorbent around the split, help to manage fluid absorbency, supported with tube holder for tube and cord organiser.",
    sizes: [
      "300 cm x 160 cm (U Split: 10 cm x 80 cm, 25 cm Round Cut)"
    ],
    features: [
      "U-Split 10 cm x 80 cm design with surrounding surgical adhesive for anatomical hip contouring",
      "Reinforced with laminated spunlace absorbent fabric around the U-split for high-volume fluid management",
      "Integrated dual side pockets for secure surgical tool and instrument placement",
      "Built-in tube holders & cord organizers for theater cable & suction line control",
      "Complete sterile pack includes Hip U Drape, Head Sheet (240x200cm), Leggings, Strapes & Wrap"
    ],
    specs: {
      "Drape Size": "300 cm x 160 cm",
      "U-Split Size": "10 cm x 80 cm with 25 cm round cut & adhesive",
      "Material Composition": "SSMMS Fabric & Laminated Spunlace Absorbent Reinforcement",
      "Special Features": "Dual side pockets, tube holders & cord organizers",
      "Pack Contents": "1x Hip U Drape, 1x Head Sheet (240x200cm), 1x Leggings, 4x Strapes, 1x Wrap",
      "Sterility": "Sterile EO Single Patient Use"
    }
  },
  {
    id: "pk-iodine-incise-drape",
    code: "PK-EQ-007",
    title: "PK Iodine Incise Drape",
    category: "surgical-consumables",
    categoryLabel: "Surgical Drapes & Consumables",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426823/plastokast_live/products/pk_iodine_incise_drape_main_v110.jpg"
    ],
    desc: "Iodine incision drapes are used to prevent surgical site infection. Iodine Incise drape is a sterile, adhesive, transparent, antistatic, non-glare incision drape in polyurethane film which makes clearly visible the incision site. Iodine Incise Drape reduces the entry of microorganisms into the wound and prevents lateral migration of bacteria into the wound itself.",
    sizes: [
      "56 cm x 45 cm",
      "35 cm x 34 cm"
    ],
    features: [
      "Impregnated with antimicrobial iodine for continuous suppression of surgical site bacteria",
      "Transparent, non-glare polyurethane film ensures clear visibility of anatomical incision landmarks",
      "Strong, skin-friendly hypoallergenic adhesive prevents edge lifting during extended operations",
      "Conformable, breathable, and antistatic design reduces lateral migration of microorganisms into wounds",
      "Available in 56 cm x 45 cm and 35 cm x 34 cm clinical sizes for various surgical procedures"
    ],
    specs: {
      "Available Sizes": "56 cm x 45 cm, 35 cm x 34 cm",
      "Antimicrobial Agent": "Iodine Impregnated Polyurethane Film",
      "Film Type": "Transparent, Antistatic, Non-Glare Polyurethane",
      "Clinical Indication": "Surgical Site Infection (SSI) prevention during operative procedures",
      "Sterility": "Sterile EO Single Patient Use"
    }
  },
  {
    id: "pk-cling-drape",
    code: "PK-EQ-008",
    title: "PK Cling Drape",
    category: "surgical-consumables",
    categoryLabel: "Surgical Drapes & Consumables",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426824/plastokast_live/products/pk_cling_drape_main_v112.jpg"
    ],
    desc: "Transparent natural colour low density PE film, used to drape extremities during surgical procedures.",
    sizes: [
      "Standard Extremity Draping Roll"
    ],
    features: [
      "Manufactured from premium transparent natural color low-density polyethylene (LDPE) film",
      "Conformable cling properties provide tight, anti-slip limb isolation during extremity surgery",
      "Impenetrable fluid barrier prevents cross-contamination and liquid penetration in surgical fields",
      "Individual sterile peel-pouch packaging for sterile operating room handling",
      "Ethylene Oxide (EO) Sterilized for orthopedic and extremity procedures"
    ],
    specs: {
      "Material Composition": "Transparent Natural Color Low-Density PE (LDPE) Film",
      "Clinical Application": "Extremity isolation and sterile limb draping during surgical procedures",
      "Film Clarity": "High-transparency clear film",
      "Sterility": "Sterile EO Single Patient Use"
    }
  },
  {
    id: "pk-shoulder-arthroscopy-drape",
    code: "PK-EQ-009",
    title: "PK Shoulder Arthroscopy Drape",
    category: "surgical-consumables",
    categoryLabel: "Surgical Drapes & Consumables",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426824/plastokast_live/products/pk_shoulder_arthroscopy_drape_main_v117.jpg"
    ],
    desc: "The shoulder arthroscopy drape is a specialized medical drape designed for use in shoulder arthroscopy procedures. This drape is tailored to provide a sterile environment, facilitate access to the shoulder joint, and ensure patient safety during surgical interventions.",
    sizes: [
      "160 cm x 250 cm (U-Cut: 15 cm x 35 cm)"
    ],
    features: [
      "Anatomical shoulder U-cut aperture (15 cm x 35 cm) for optimal surgical site exposure",
      "Integrated high-capacity fluid collection pouch with dual drain port for high-volume irrigation",
      "Heavy-duty SSMMS non-woven fabric with PE film laminate for maximum liquid repellency",
      "Built-in cable holders and cord organizers for arthroscopic suction lines & camera cables",
      "Complete sterile pack includes Shoulder U Drape, Head Sheet (160x150cm), Leggings, Strapes & Wrap"
    ],
    specs: {
      "Drape Size": "160 cm x 250 cm",
      "U-Cut Aperture": "15 cm x 35 cm with adhesive seal",
      "Material Composition": "SSMMS Fabric & PE Film Fluid Impenetrable Laminate",
      "Fluid Management": "Integrated collection pouch with dual drainage ports",
      "Pack Contents": "1x Shoulder U Drape, 1x Head Sheet (160x150cm), 1x Legging, 4x Strapes, 1x Wrap",
      "Sterility": "Sterile EO Single Patient Use"
    }
  },
  {
    id: "pk-knee-arthroscopy-drape",
    code: "PK-EQ-010",
    title: "PK Knee Arthroscopy Drape",
    category: "surgical-consumables",
    categoryLabel: "Surgical Drapes & Consumables",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426825/plastokast_live/products/pk_knee_arthroscopy_drape_main_v119.jpg"
    ],
    desc: "Knee Arthroscopy Drape Ultra of size 320cm * 240cm, reinforced with latex-free material having a center hole of 2.5-inch diameter, backdrop reinforced, to prevent fluid penetration and concentration. Attached with a fluid collection pouch having a suction port. Supported with tube holder for tube and cord organizer.",
    sizes: [
      "320 cm x 240 cm (Center Hole: 2.5 inch diameter)"
    ],
    features: [
      "Elasticized 2.5-inch elastomeric fenestration for snug, leak-proof leg isolation during knee arthroscopy",
      "Integrated heavy-duty fluid collection pouch with built-in suction drain port for high-volume irrigation control",
      "Absorbent backdrop reinforcement around fenestration prevents fluid run-off and liquid penetration",
      "Built-in tube holders & cord organizers for theater cable & suction line management",
      "Complete sterile pack includes Arthroscopy Drape (240x320cm), Leggings, Strapes & Wrap"
    ],
    specs: {
      "Drape Size": "320 cm x 240 cm",
      "Fenestration Size": "2.5 inch (6.35 cm) elasticized round hole",
      "Material Composition": "SSMMS Non-Woven Fabric & PE Film Fluid Impenetrable Laminate",
      "Fluid Management": "Integrated pouch with suction port & absorbent backdrop",
      "Pack Contents": "1x Arthroscopy Drape, 1x Legging, 4x Strapes, 1x Wrap",
      "Sterility": "Sterile EO Single Patient Use"
    }
  },
  {
    id: "pk-premium-plain-sheet",
    code: "PK-EQ-011",
    title: "PK Premium Plain Sheet",
    category: "surgical-consumables",
    categoryLabel: "Surgical Drapes & Consumables",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426826/plastokast_live/products/pk_premium_plain_sheet_main_v121.jpg"
    ],
    desc: "Plain Sheet Sterile Premium Sheet is comfortable, hygienic and cost-effective bedding with soft to touch. They are made of soft high quality polymer. Sterile bed sheets offer moisture barrier which provides additional skin protection.",
    sizes: [
      "1200 mm x 2100 mm (120 cm x 210 cm)"
    ],
    features: [
      "Manufactured from soft, high-quality hydrophobic polymer fabric for patient comfort",
      "Provides an impenetrable moisture barrier against liquid, blood, and bodily fluid soak-through",
      "Hygienic, hypoallergenic, and lint-free composition protects sensitive skin during surgical procedures",
      "Cost-effective sterile protective sheet for operating tables, examination couches, and patient beds",
      "Individual sterile EO packaging for operating theater contamination control"
    ],
    specs: {
      "Sheet Size": "1200 mm x 2100 mm (120 cm x 210 cm)",
      "Material Composition": "High-Quality Soft Hydrophobic Polymer Non-Woven",
      "Fluid Protection": "Impenetrable Liquid & Moisture Barrier",
      "Clinical Indication": "Sterile patient bedding, operating table & procedure coverage",
      "Sterility": "Sterile EO Single Patient Use"
    }
  },
  {
    id: "pk-reinforce-gowns",
    code: "PK-EQ-012",
    title: "PK Reinforce Gowns",
    category: "surgical-consumables",
    categoryLabel: "Surgical Drapes & Consumables",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426827/plastokast_live/products/pk_reinforce_gowns_main_v123.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426827/plastokast_live/products/pk_reinforce_gowns_sub_v123.jpg"
    ],
    desc: "Reinforce Surgical Gowns are suitable for use in general and major surgeries like orthopedic and urology procedures. It prevents the bacterial transfer between the surgeon and the patient. It reduces the occurring of possible contamination and infection between the patient and the surgical team.",
    sizes: [
      "Large / Extra Large (Standard Surgical Fit)"
    ],
    features: [
      "Reinforced critical zones (chest & sleeves) with fluid-impenetrable PE film laminate",
      "Manufactured from heavy-duty 5-layer SSMMS non-woven fabric for superior barrier protection",
      "Low-linting properties prevent particulate contamination in sterile operating theaters",
      "Ergonomic raglan sleeve cut with soft knit cuffs for unrestricted mobility during long surgeries",
      "Complete sterile pack includes 1x Reinforced Gown and 2x Sterile Absorbent Hand Towels"
    ],
    specs: {
      "Material Composition": "5-Layer SSMMS Non-Woven Fabric & Impervious PE Laminate",
      "Reinforcement Zones": "Chest & Sleeves Impervious Fluid Barrier",
      "Clinical Indication": "General, Orthopedic, Urology & High-Fluid Major Surgical Procedures",
      "Pack Contents": "1x Reinforced Surgical Gown, 2x Absorbent Hand Towels",
      "Sterility": "Sterile EO Single Patient Use"
    }
  },
  {
    id: "pk-c-arm-cover",
    code: "PK-EQ-013",
    title: "PK C-Arm Cover",
    category: "surgical-consumables",
    categoryLabel: "Surgical Drapes & Consumables",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426828/plastokast_live/products/pk_c_arm_cover_main_v125.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426829/plastokast_live/products/pk_c_arm_cover_sub_v127.jpg"
    ],
    desc: "C-Arm Drape are made from LDPE material, helps to protect the equipment and manage visibility of equipment.",
    sizes: [
      "Standard Equipment Fit (High-Clarity LDPE Film)"
    ],
    features: [
      "Ultra-clear transparent LDPE film provides uncompromised optical clarity & equipment visibility",
      "Sterile protective barrier sheath safeguards sensitive C-Arm fluoroscopy equipment & image intensifiers",
      "Prevents cross-contamination, blood splash, and surgical fluid ingress into electronic equipment",
      "Flexible, tear-resistant polymer drape conforms easily around C-Arm tube heads & receivers",
      "Sterile EO individual peel-pouch packaging for sterile field setup in orthopedics & radiology"
    ],
    specs: {
      "Material Composition": "Medical-Grade Ultra-Clear LDPE Polyethylene Film",
      "Optical Clarity": "High-Transparency Sheath for Unobscured Equipment Controls",
      "Clinical Indication": "Sterile Equipment Draping for C-Arm Fluoroscopy & Mobile X-Ray Systems",
      "Barrier Protection": "Complete Impervious Shield against Fluids, Blood & Particulates",
      "Sterility": "Sterile EO Single Patient Use"
    }
  },
  {
    id: "pk-camera-cover",
    code: "PK-EQ-014",
    title: "PK Camera Cover",
    category: "surgical-consumables",
    categoryLabel: "Surgical Drapes & Consumables",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426829/plastokast_live/products/pk_camera_cover_main_v128.jpg",
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426830/plastokast_live/products/pk_camera_cover_sub_v128.jpg"
    ],
    desc: "Endoscopy / Camera Drape are made from LDPE material, helps to protect the equipment and manage visibility of equipment.",
    sizes: [
      "16.5 cm x 200 cm"
    ],
    features: [
      "Manufactured from ultra-clear high-density LDPE sheath film for maximum optical clarity & flexible handling",
      "Specially designed elastomeric quick-connect ring for secure, fluid-tight locking onto laparoscopic & endoscopic camera heads",
      "Protects costly endoscopic cameras, fiber-optic cords, and light leads from blood, fluid splash & thermal damage",
      "Extends 200 cm in length for full sterile barrier coverage across surgical camera cords",
      "Individually EO sterile peel-pouch package for rapid OR setup in laparoscopic, arthroscopic & endoscopic surgeries"
    ],
    specs: {
      "Cover Dimensions": "16.5 cm x 200 cm",
      "Material Composition": "Medical-Grade High-Clarity LDPE Sheath & Elastomeric Ring",
      "Ring Connector": "Quick-Lock Elasticized Blue Ring Interface",
      "Clinical Indication": "Sterile Draping for Laparoscopic, Arthroscopic & Endoscopic Cameras & Light Leads",
      "Sterility": "Sterile EO Single Patient Use"
    }
  },
  {
    id: "plastokast-cotton-crepe-bandage",
    code: "PK-CB-001",
    title: "Cotton Crepe Bandage B.P.",
    category: "pop-bandages",
    categoryLabel: "Plaster & POP Bandages",
    availability: "In Stock",
    images: [
      "https://res.cloudinary.com/ez2q6f97/image/upload/v1787426831/plastokast_live/products/pk_cotton_crepe_all_v86.jpg"
    ],
    desc: "PlastoKast Elastic Crepe Bandage, a highly effective solution for treating muscle damage and sprains. These bandages boast exceptional elasticity, allowing for optimal support and compression during the healing process. Designed to minimize movement, the bandage adheres firmly to the skin or joint surface, ensuring maximum stability and comfort.",
    sizes: [
      '2", 3", 4", 6" inch (Length: 4 mtr.)'
    ],
    features: [
      "Highly effective solution for treating muscle damage, strains, and joint sprains",
      "Boasts exceptional elasticity for optimal support and uniform compression",
      "Designed to minimize joint movement and adhere firmly to skin or joint surface",
      "Ensures maximum stability, warmth, and comfortable recovery",
      "Available sizes: 2\", 3\", 4\", 6\" inch (Length: 4 mtr.)"
    ],
    specs: {
      "Available Sizes": '2", 3", 4", 6" inch',
      "Length": "4 mtr.",
      "Material": "Cotton Crepe Bandage B.P.",
      "Indication": "Muscle damage, sprains, joint support & post-cast compression"
    }
  }
];

// Helper functions for data management
function getProductsData() {
  const local = localStorage.getItem("plastokast_products");
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse local products, resetting to static catalog.", e);
    }
  }
  return STATIC_PRODUCTS_DATA;
}

// Default Categories List
const DEFAULT_CATEGORIES = [
  { slug: "casting-tapes", label: "Casting Tapes" },
  { slug: "splints", label: "Orthopedic Splints" },
  { slug: "pop-bandages", label: "Plaster (POP) Bandages" },
  { slug: "liners-accessories", label: "Cast Liners & Accessories" },
  { slug: "surgical-consumables", label: "Surgical Consumables" },
  { slug: "clinical-equipment", label: "Clinical Equipment" }
];

function getCategoriesData() {
  const local = localStorage.getItem("plastokast_categories");
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch(e) {}
  }
  return DEFAULT_CATEGORIES;
}

window.getCategoriesData = getCategoriesData;
window.saveCategoriesData = function(categories) {
  if (window.PlastoKastDB && typeof window.PlastoKastDB.saveCategories === "function") {
    window.PlastoKastDB.saveCategories(categories);
  } else {
    localStorage.setItem("plastokast_categories", JSON.stringify(categories));
  }
};

// Global Reactive Products Data Reference
var PRODUCTS_DATA = getProductsData();
window.PRODUCTS_DATA = PRODUCTS_DATA;

// Auto-subscribe to Cloud Firestore in real time
function initCloudCatalogSync() {
  if (window.PlastoKastDB) {
    if (typeof window.PlastoKastDB.onProductsChange === "function") {
      window.PlastoKastDB.onProductsChange((cloudProducts) => {
        if (Array.isArray(cloudProducts) && cloudProducts.length > 0) {
          PRODUCTS_DATA = cloudProducts;
          window.PRODUCTS_DATA = cloudProducts;
        }
      });
    }
    if (typeof window.PlastoKastDB.onCategoriesChange === "function") {
      window.PlastoKastDB.onCategoriesChange((cloudCats) => {
        if (Array.isArray(cloudCats) && cloudCats.length > 0) {
          try {
            localStorage.setItem("plastokast_categories", JSON.stringify(cloudCats));
          } catch(e) {}
        }
      });
    }
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCloudCatalogSync);
  } else {
    initCloudCatalogSync();
  }
}
