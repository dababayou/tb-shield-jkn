// TB-Shield JKN — Constants & Single Source of Truth
// Sesuai dengan TB-Shield-JKN-Knowledge-Brief.md & feature brief.md

export const REGIONS_DATA = {
  "Jawa Timur": {
    "Kota Surabaya": {
      "Tenggilis Mejoyo": {
        kel: ["Kendangsari", "Kutisari", "Panjang Jiwo", "Tenggilis Mejoyo"],
        fk: ["Puskesmas Tenggilis"]
      },
      "Gubeng": {
        kel: ["Airlangga", "Gubeng", "Kertajaya", "Pucang Sewu"],
        fk: ["Puskesmas Gubeng", "Puskesmas Pucang Sewu"]
      },
      "Rungkut": {
        kel: ["Kali Rungkut", "Medokan Ayu", "Rungkut Kidul"],
        fk: ["Puskesmas Kali Rungkut", "Puskesmas Medokan Ayu"]
      }
    },
    "Kota Malang": {
      "Klojen": {
        kel: ["Klojen", "Rampal Celaket", "Samaan"],
        fk: ["Puskesmas Klojen", "Puskesmas Rampal Celaket"]
      },
      "Lowokwaru": {
        kel: ["Dinoyo", "Merjosari", "Tlogomas"],
        fk: ["Puskesmas Dinoyo", "Puskesmas Mojolangu"]
      }
    }
  }
};

// 1. Skrining Risiko TBC (Skor Usulan 0 - 10)
// Gejala utama (maks 5 poin)
// Faktor risiko kesehatan (maks 3 poin)
// Tingkat paparan (maks 2 poin)
export const SCREENING_QUESTIONS = {
  gejala: [
    {
      id: "cough_2w",
      label: "Batuk selama 2 minggu atau lebih",
      points: 2,
      isCardinal: true,
      description: "Batuk terus-menerus lebih dari 14 hari merupakan gejala kardinal utama TBC dan memicu arahan rujukan medis."
    },
    {
      id: "fever_nightsweat",
      label: "Demam meriang atau berkeringat malam tanpa aktivitas fisik",
      points: 1,
      isCardinal: false,
      description: "Suhu tubuh meningkat terutama sore/malam hari disertai keringat dingin saat tidur."
    },
    {
      id: "weight_loss",
      label: "Penurunan berat badan tanpa sebab jelas / nafsu makan menurun drastis",
      points: 1,
      isCardinal: false,
      description: "Berat badan turun secara signifikan dalam 1-2 bulan terakhir."
    },
    {
      id: "hemoptysis",
      label: "Batuk bercampur darah (hemoptisis)",
      points: 1,
      isCardinal: true,
      description: "Dahak bercampur bercak darah atau batuk darah segar, merupakan tanda bahaya kardinal."
    }
  ],
  faktorRisiko: [
    {
      id: "diabetes",
      label: "Memiliki riwayat Diabetes Mellitus (kencing manis)",
      points: 1,
      description: "Gula darah tinggi menurunkan imunitas seluler, melipatgandakan risiko TBC aktif."
    },
    {
      id: "hiv",
      label: "Memiliki riwayat HIV/AIDS atau kondisi defisiensi imun",
      points: 1,
      description: "Penurunan sel CD4 membuat infeksi TBC laten sangat mudah berkembang menjadi TBC aktif."
    },
    {
      id: "low_bmi",
      label: "Indeks Massa Tubuh (IMT) di bawah 18,5 (kurang gizi / sangat kurus)",
      points: 1,
      description: "Kekurangan asupan energi & protein melemahkan pertahanan sistem imun terhadap bakteri TBC."
    }
  ],
  paparan: [
    {
      id: "household",
      label: "Tinggal satu rumah dengan pasien TBC terkonfirmasi",
      points: 1,
      description: "Tinggal bersama pasien TBC meningkatkan intensitas paparan droplet bakteri pernapasan."
    },
    {
      id: "same_room",
      label: "Tidur satu kamar dengan pasien TBC terkonfirmasi",
      points: 1,
      description: "Paparan udara tertutup dalam durasi 6-8 jam semalam sangat meningkatkan transmisi bakteri."
    }
  ]
};

// 2. Skrining Risiko Ketidakpatuhan (5 Pertanyaan Hambatan)
export const ADHERENCE_QUESTIONS = [
  {
    id: "adh_1",
    indicator: "Persepsi Sehat / Urgensi Obat",
    question: "Apakah Anda merasa tidak perlu minum obat karena saat ini tubuh merasa sehat dan tidak ada gejala sakit?",
    description: "Bakteri TBC pada infeksi laten tidak menimbulkan gejala, namun tetap memerlukan TPT agar tidak menjadi sakit aktif."
  },
  {
    id: "adh_2",
    indicator: "Kecemasan Efek Samping",
    question: "Apakah Anda khawatir atau pernah mengalami rasa mual, pusing, atau takut obat akan merusak organ tubuh (seperti hati/ginjal)?",
    description: "Kekhawatiran efek samping sering kali dapat diatasi dengan pendampingan dosis dan edukasi tenaga kesehatan."
  },
  {
    id: "adh_3",
    indicator: "Hambatan Stigma & Privasi",
    question: "Apakah Anda merasa khawatir/malu jika tetangga atau orang luar mengetahui Anda sedang mengonsumsi obat pencegahan TBC?",
    description: "Stigma sosial sering menjadi penghalang utama kontak erat menyelesaikan terapi pencegahan."
  },
  {
    id: "adh_4",
    indicator: "Kompleksitas Regimen & Jadwal",
    question: "Apakah Anda sering lupa minum obat rutin, memiliki jadwal kerja/kegiatan yang padat, atau merasa jumlah obat terlalu banyak?",
    description: "Regimen singkat modern (seperti 3HP/1HP) kini tersedia di FKTP untuk mempermudah rutinitas minum obat."
  },
  {
    id: "adh_5",
    indicator: "Keterbatasan Dukungan Keluarga",
    question: "Apakah di rumah tidak ada anggota keluarga yang mengingatkan atau mendukung Anda untuk minum obat setiap hari?",
    description: "Keberadaan Pengawas Menelan Obat (PMO) keluarga terbukti meningkatkan keberhasilan terapi hingga di atas 90%."
  }
];

// 3. 20 Butir Lengkap Mitos vs Fakta TBC
export const MYTHS_AND_FACTS = [
  {
    id: 1,
    category: "Penularan",
    statement: "TBC adalah penyakit keturunan.",
    type: "MITOS",
    explanation: "TBC disebabkan oleh bakteri Mycobacterium tuberculosis dan menular lewat udara melalui droplet pernapasan, bukan diwariskan secara genetik dari orang tua ke anak."
  },
  {
    id: 2,
    category: "Penularan",
    statement: "TBC menular lewat bersalaman atau berbagi alat makan.",
    type: "MITOS",
    explanation: "TBC menular melalui percikan dahak halus di udara saat penderita batuk, bersin, atau berbicara. Bakteri tidak ditularkan melalui sentuhan kulit, jabat tangan, atau piring/sendok bersama."
  },
  {
    id: 3,
    category: "Organ Tubuh",
    statement: "TBC hanya menyerang organ paru-paru.",
    type: "MITOS",
    explanation: "Paru memang paling sering terinfeksi (TBC Paru), namun bakteri TBC juga dapat menyebar ke kelenjar getah bening, tulang belakang, selaput otak (meningitis TB), ginjal, dan organ lainnya (TBC Ekstraparu)."
  },
  {
    id: 4,
    category: "Pengobatan",
    statement: "TBC bisa disembuhkan secara tuntas.",
    type: "FAKTA",
    explanation: "Dengan obat anti-TBC (OAT) standar yang diminum secara teratur dan tuntas selama minimal 6 bulan, TBC sensitif obat dapat sembuh total tanpa kekambuhan."
  },
  {
    id: 5,
    category: "Kepatuhan",
    statement: "Kalau batuk sudah reda dan badan terasa segar, obat boleh dihentikan.",
    type: "MITOS",
    explanation: "Putus obat sebelum waktunya membuat kuman yang tersisa menjadi kebal (TBC Resisten Obat / TBC RO). Pengobatan TBC RO jauh lebih berat, butuh waktu 9-24 bulan, dan biayanya sangat besar."
  },
  {
    id: 6,
    category: "Stigma Sosial",
    statement: "Penderita TBC harus dijauhi, dikucilkan, dan diasingkan dari pergaulan.",
    type: "MITOS",
    explanation: "Setelah 2 minggu pengobatan OAT teratur, daya tular kuman TBC menurun drastis hingga lebih dari 90%. Penderita tetap dapat beraktivitas aman dengan memakai masker dan menerapkan etika batuk."
  },
  {
    id: 7,
    category: "Gejala",
    statement: "Batuk berdarah adalah satu-satunya tanda seseorang terkena TBC.",
    type: "MITOS",
    explanation: "Batuk darah hanya salah satu tanda yang muncul pada tahap lanjut. Gejala umum lain meliputi batuk berdahak >2 minggu, demam meriang, keringat malam tanpa sebab, nafsu makan hilang, dan berat badan turun drastis."
  },
  {
    id: 8,
    category: "Pencegahan",
    statement: "Vaksin BCG melindungi anak-anak dari risiko TBC berat.",
    type: "FAKTA",
    explanation: "Imunisasi BCG pada bayi efektif mencegah komplikasi TBC fatal seperti TBC milier dan meningitis TBC, meskipun tetap memerlukan perlindungan lingkungan rumah yang sehat."
  },
  {
    id: 9,
    category: "Infeksi Laten",
    statement: "Orang yang terpapar kuman TBC pasti langsung jatuh sakit.",
    type: "MITOS",
    explanation: "Banyak orang mengalami Infeksi TBC Laten (ITL) di mana sistem imun mengurung bakteri sehingga kuman tidur, tidak bergejala, dan tidak menular. Namun bila daya tahan tubuh turun, kuman bisa bangun menjadi sakit TBC aktif."
  },
  {
    id: 10,
    category: "Layanan JKN",
    statement: "Pemeriksaan dan pengobatan TBC gratis di fasilitas kesehatan pemerintah.",
    type: "FAKTA",
    explanation: "Layanan pemeriksaan laboratorium dahak (TCM), rontgen, obat OAT, dan Terapi Pencegahan TBC (TPT) di Puskesmas ditanggung sepenuhnya oleh program pemerintah dan BPJS Kesehatan."
  },
  {
    id: 11,
    category: "Usia",
    statement: "TBC hanya menyerang kelompok usia dewasa dan lansia.",
    type: "MITOS",
    explanation: "Anak-anak dan balita sangat rentan tertular TBC dari orang dewasa di rumah. Karena sistem imun anak belum matang, balita berisiko tinggi mengalami komplikasi berat bila tidak segera diberi TPT."
  },
  {
    id: 12,
    category: "Faktor Risiko",
    statement: "Merokok aktif meningkatkan risiko seseorang terkena sakit TBC.",
    type: "FAKTA",
    explanation: "Asap rokok merusak silia pembersih saluran napas dan melemahkan makrofag paru-paru, melipatgandakan risiko infeksi TBC dan memperlambat kesembuhan."
  },
  {
    id: 13,
    category: "Pengobatan",
    statement: "TBC bisa sembuh tuntas hanya dengan minum jamu herbal atau air rebusan.",
    type: "MITOS",
    explanation: "Bakteri Mycobacterium tuberculosis memiliki dinding sel lilin tebal yang hanya bisa dihancurkan oleh kombinasi antibiotik bakterisidal OAT standar medis. Herbal tidak boleh menggantikan obat resep dokter."
  },
  {
    id: 14,
    category: "Komorbiditas",
    statement: "Penderita diabetes mellitus lebih berisiko terkena TBC aktif.",
    type: "FAKTA",
    explanation: "Kadar gula darah yang tidak terkontrol mengganggu fungsi sel darah putih, sehingga risiko TBC laten berkembang menjadi TBC aktif naik hingga 3 kali lipat pada pengidap diabetes."
  },
  {
    id: 15,
    category: "Ibu & Anak",
    statement: "Ibu hamil atau menyusui dengan TBC tidak boleh minum obat TBC.",
    type: "MITOS",
    explanation: "OAT lini pertama sangat aman dikonsumsi oleh ibu hamil demi melindungi janin dari infeksi kongenital. Ibu menyusui juga tetap dapat memberikan ASI dengan memakai masker medis."
  },
  {
    id: 16,
    category: "Komorbiditas",
    statement: "Orang yang hidup dengan HIV (ODHIV) lebih mudah sakit TBC aktif.",
    type: "FAKTA",
    explanation: "Penurunan sel darah putih limfosit CD4 akibat virus HIV membuat infeksi TBC menjadi salah satu infeksi oportunistik paling umum, sehingga penapisan dan pemberian TPT sangat krusial."
  },
  {
    id: 17,
    category: "Sanitasi",
    statement: "Rumah yang lembap dan minim cahaya matahari membuat kuman TBC lebih lama bertahan hidup.",
    type: "FAKTA",
    explanation: "Kuman TBC dapat bertahan hidup berjam-jam hingga berhari-hari di udara gelap dan lembap. Sebaliknya, sinar ultraviolet (UV) matahari langsung dapat membunuh bakteri TBC dalam beberapa menit."
  },
  {
    id: 18,
    category: "Diagnosis",
    statement: "Hasil rontgen paru yang tampak bersih berarti seseorang 100% bebas dari kuman TBC.",
    type: "MITOS",
    explanation: "Infeksi TBC ekstraparu dan infeksi TBC laten tahap awal tidak selalu terlihat pada rontgen dada. Konfirmasi definitif memerlukan uji Tes Cepat Molekuler (TCM), uji tuberkulin, atau evaluasi klinis dokter."
  },
  {
    id: 19,
    category: "Resistensi Obat",
    statement: "TBC resisten obat (TBC RO) mustahil disembuhkan.",
    type: "MITOS",
    explanation: "TBC resisten obat tetap dapat disembuhkan dengan regimen paduan obat TBC RO modern (seperti BPaL/BPaLM) di bawah pengawasan ketat tim dokter ahli klinis TBC di faskes rujukan."
  },
  {
    id: 20,
    category: "Pencegahan",
    statement: "Seluruh anggota keluarga yang tinggal serumah dengan pasien TBC wajib menjalani skrining.",
    type: "FAKTA",
    explanation: "Kontak serumah memiliki risiko tertinggi tertular kuman TBC. Skrining sedini mungkin dan pemberian Terapi Pencegahan TBC (TPT) efektif memutus rantai penularan di lingkungan rumah."
  }
];

// 4. Katalog Resep Imunonutrisi Pangan Lokal
export const IMMUNONUTRITION_RECIPES = [
  {
    id: "kelor_telur",
    title: "Telur Orak Daun Kelor Segar",
    ingredientType: "Daun Kelor + Telur Ayam",
    tags: ["L-Arginine", "Zinc", "Protein Tinggi", "Antioksidan"],
    prepTime: "10 menit",
    portion: "1-2 porsi",
    calories: "185 kkal",
    targetNutrients: {
      protein: "14g",
      zinc: "2.1mg",
      arginine: "1.2g",
      vitD: "44 IU"
    },
    whyGoodForTB: "L-Arginine pada daun kelor dan telur memicu produksi Nitric Oxide (NO) di dalam makrofag untuk melumpuhkan bakteri Mycobacterium tuberculosis secara intraseluler.",
    ingredients: [
      "2 butir telur ayam (atau telur bebek)",
      "1 mangkuk daun kelor muda (cuci bersih, petik tanpa tangkai)",
      "2 siung bawang putih (cincang halus)",
      "1 siung bawang merah (iris tipis)",
      "1 sendok teh minyak kelapa / jagung",
      "Garam dan merica secukupnya"
    ],
    instructions: [
      "Petik daun kelor muda dan cuci bersih dengan air mengalir.",
      "Kocok lepas telur dalam mangkuk, tambahkan sedikit garam dan merica bubuk.",
      "Panaskan 1 sendok teh minyak di wajan, tumis bawang merah dan bawang putih hingga harum.",
      "Masukkan daun kelor, aduk cepat selama 30-45 detik agar warna hijau dan nutrisinya tetap terjaga.",
      "Tuangkan kocokan telur, aduk perlahan (scramble) hingga matang merata, lalu angkat dan sajikan selagi hangat."
    ]
  },
  {
    id: "bubur_kembung",
    title: "Bubur Ikan Kembung + Tepung Ikan Gurih",
    ingredientType: "Tepung Ikan Kembung + Beras",
    tags: ["Vitamin D3", "Omega-3", "Protein Hewani", "Mudah Cerna"],
    prepTime: "25 menit",
    portion: "2 porsi",
    calories: "290 kkal",
    targetNutrients: {
      protein: "22g",
      zinc: "1.8mg",
      arginine: "1.5g",
      vitD: "380 IU"
    },
    whyGoodForTB: "Ikan kembung merupakan sumber Vitamin D3 lokal termurah dan terkaya (bahkan melebihi salmon). Vitamin D3 menstimulasi produksi peptida antimikroba (cathelicidin LL-37) dalam sel darah putih.",
    ingredients: [
      "1 cangkir nasi atau 1/2 cangkir beras pulen",
      "1 ekor ikan kembung segar (kukus dan suwir dagingnya) atau 2 sendok makan tepung ikan kembung",
      "1/2 batang wortel (cincang dadu kecil)",
      "2 gelas air kaldu ayam atau kaldu sayur",
      "1 batang daun bawang dan seledri cincang",
      "Bawang goreng dan garam secukupnya"
    ],
    instructions: [
      "Masak beras/nasi bersama air kaldu dan wortel cincang dengan api sedang hingga menjadi bubur lembut.",
      "Masukkan suwiran ikan kembung kukus atau tepung ikan kembung, aduk rata agar meresap ke dalam bubur.",
      "Tambahkan garam, merica, dan irisan seledri.",
      "Aduk selama 3 menit hingga aroma sedap tercium.",
      "Angkat, tuang ke mangkuk, dan taburi bawang goreng di atasnya. Sangat cocok untuk anak-anak, lansia, maupun saat nafsu makan menurun."
    ]
  },
  {
    id: "tumis_jamur",
    title: "Tumis Jamur Tiram + Telur Rebus Gurih",
    ingredientType: "Jamur Tiram + Telur Rebus",
    tags: ["Beta-Glukan", "Vitamin D Alami", "Zinc", "Serat Sehat"],
    prepTime: "15 menit",
    portion: "2 porsi",
    calories: "170 kkal",
    targetNutrients: {
      protein: "13g",
      zinc: "1.6mg",
      arginine: "0.9g",
      vitD: "120 IU"
    },
    whyGoodForTB: "Jamur tiram kaya akan beta-glukan yang bertindak sebagai imunomodulator, memperkuat respon pertahanan tubuh dan aktivitas sel Natural Killer (NK) terhadap infeksi paru.",
    ingredients: [
      "200 gram jamur tiram (cuci bersih, peras perlahan, dan suwir-suwir)",
      "2 butir telur ayam (rebus matang selama 9 menit, kupas)",
      "3 siung bawang merah dan 2 siung bawang putih (iris tipis)",
      "1 buah cabai merah besar (buang biji, iris serong)",
      "1 sendok makan kecap manis rendah gula dan 1 sendok teh kecap asin",
      "1 sendok teh minyak untuk menumis"
    ],
    instructions: [
      "Panaskan sedikit minyak, tumis bawang merah, bawang putih, dan cabai merah hingga layu dan harum.",
      "Masukkan jamur tiram suwir, tambahkan kecap manis, kecap asin, dan sedikit air jika perlu.",
      "Aduk cepat selama 3-4 menit sampai jamur matang dan bumbu meresap sempurna.",
      "Belah telur rebus menjadi dua bagian, tata di atas piring bersama tumisan jamur tiram hangat.",
      "Sajikan bersama nasi merah atau nasi putih hangat."
    ]
  },
  {
    id: "sup_kelor_telurpuyuh",
    title: "Sup Bening Daun Kelor & Telur Puyuh",
    ingredientType: "Daun Kelor + Telur Puyuh",
    tags: ["Mikronutrien", "Zat Besi", "Vitamin A", "Segar & Ringan"],
    prepTime: "12 menit",
    portion: "2-3 porsi",
    calories: "145 kkal",
    targetNutrients: {
      protein: "10g",
      zinc: "1.4mg",
      arginine: "0.8g",
      vitD: "65 IU"
    },
    whyGoodForTB: "Kombinasi zat besi dan vitamin A dari daun kelor membantu mencegah anemia yang kerap terjadi pada pasien atau kontak erat TBC dengan gizi kurang.",
    ingredients: [
      "2 mangkuk daun kelor segar",
      "6 butir telur puyuh rebus (kupas)",
      "1 buah jagung manis pipil",
      "3 siung bawang merah (iris tipis)",
      "1 ruas kunci atau temu mangga (memarkan)",
      "700 ml air bersih",
      "Garam dan sedikit gula secukupnya"
    ],
    instructions: [
      "Didihkan air bersama bawang merah iris dan temu kunci.",
      "Masukkan jagung manis pipil, rebus hingga jagung empuk (sekitar 4 menit).",
      "Masukkan telur puyuh rebus dan bumbui dengan garam serta sedikit gula.",
      "Terakhir, masukkan daun kelor muda, matikan api segera setelah mendidih kembali (jangan terlalu lama dimasak agar vitamin C tidak rusak).",
      "Sajikan kuah bening segar selagi hangat."
    ]
  }
];

// 5. Mock Data Pasien & Kontak Erat Awal (Synthesized Data)
export const INITIAL_CONTACTS = [
  {
    id: "ct-001",
    nama: "Siti Rahayu",
    jk: "Perempuan",
    age: 34,
    nik: "3578010101900021",
    bp: "0001234567890",
    kel: "Kendangsari",
    rw: "03",
    rt: "05",
    fk: "Puskesmas Tenggilis",
    hubungan: "Serumah dengan pasien",
    skriningDate: "-",
    skor: 0,
    kategoriRisiko: "Belum Skrining",
    gejalaAktif: [],
    faktorAktif: [],
    imt: null,
    kategoriIMT: "Belum Dihitung",
    status: "Terdaftar",
    ticket: null,
    adherenceScore: 0,
    adherenceCategory: "Belum Dievaluasi",
    alerts: []
  },
  {
    id: "ct-002",
    nama: "Agus Prasetyo",
    jk: "Laki-laki",
    age: 47,
    nik: "3578010202780033",
    bp: "0001234567891",
    kel: "Kutisari",
    rw: "02",
    rt: "01",
    fk: "Puskesmas Tenggilis",
    hubungan: "Serumah dengan pasien",
    skriningDate: "2026-11-05",
    skor: 7,
    kategoriRisiko: "Sedang",
    gejalaAktif: ["fever_nightsweat", "weight_loss"],
    faktorAktif: ["household", "diabetes", "low_bmi"],
    imt: 17.8,
    kategoriIMT: "Kurus",
    status: "Terdaftar",
    ticket: null,
    ticketStatus: null,
    adherenceScore: 0,
    adherenceCategory: "Belum Dievaluasi",
    alerts: []
  },
  {
    id: "ct-003",
    nama: "Dewi Lestari",
    jk: "Perempuan",
    age: 29,
    nik: "3578010303950044",
    bp: "0001234567892",
    kel: "Airlangga",
    rw: "04",
    rt: "02",
    fk: "Puskesmas Gubeng",
    hubungan: "Kontak dekat (rekan kerja)",
    skriningDate: "2026-11-03",
    skor: 1,
    kategoriRisiko: "Rendah",
    gejalaAktif: [],
    faktorAktif: ["diabetes"],
    imt: 22.1,
    kategoriIMT: "Normal",
    status: "Terdaftar",
    ticket: null,
    adherenceScore: 0,
    adherenceCategory: "Risiko Rendah",
    alerts: []
  },
  {
    id: "ct-004",
    nama: "Hendra Wijaya",
    jk: "Laki-laki",
    age: 52,
    nik: "3578010404720055",
    bp: "0001234567893",
    kel: "Gubeng",
    rw: "01",
    rt: "03",
    fk: "Puskesmas Gubeng",
    hubungan: "Serumah dengan pasien",
    skriningDate: "2026-11-06",
    skor: 9,
    kategoriRisiko: "Tinggi",
    gejalaAktif: ["cough_2w", "hemoptysis", "weight_loss"],
    faktorAktif: ["household", "same_room", "diabetes"],
    imt: 16.9,
    kategoriIMT: "Sangat Kurus",
    status: "Terdaftar",
    ticket: null,
    ticketStatus: null,
    adherenceScore: 0,
    adherenceCategory: "Belum Dievaluasi",
    alerts: [
      {
        id: "alt-01",
        date: "2026-11-06 09:30",
        type: "Tanda Bahaya: Mata/Kulit Kuning (Ikterus)",
        status: "Aktif - Memerlukan Panggilan Petugas",
        notes: "Pasien mengeluhkan sklera mata menguning dan mual setelah minum obat TPT."
      }
    ]
  }
];

// 6. Petugas FKTP Puskesmas Demo Accounts
export const DEMO_STAFF = {
  "TNG-01": {
    pin: "482913",
    nama: "Ns. Ratna Dewi, S.Kep (Kader & Koordinator TB)",
    fk: "Puskesmas Tenggilis",
    nip: "198804152011012003"
  },
  "GBG-01": {
    pin: "715204",
    nama: "dr. Ahmad Fauzi (Dokter Penanggung Jawab TB)",
    fk: "Puskesmas Gubeng",
    nip: "198309102009021004"
  }
};

// 7. Initial Audit Log Entries
export const INITIAL_AUDIT_LOGS = [
  {
    id: "aud-001",
    time: "11:15:20",
    date: "2026-11-06",
    staff: "Puskesmas Tenggilis",
    action: "Verifikasi Tiket Rujukan Digital #H4MK",
    status: "Sukses (Tervalidasi)"
  },
  {
    id: "aud-002",
    time: "10:45:12",
    date: "2026-11-06",
    staff: "Puskesmas Gubeng",
    action: "Patient Safety Alert Diterima #alt-01 (Ikterus)",
    status: "Peringatan Merah Masuk"
  },
  {
    id: "aud-003",
    time: "09:20:00",
    date: "2026-11-06",
    staff: "Puskesmas Tenggilis",
    action: "Login Sesi Petugas Ns. Ratna Dewi (TNG-01)",
    status: "Sukses Otentikasi"
  }
];
