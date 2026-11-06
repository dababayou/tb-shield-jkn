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

// 1. Skrining Risiko TBC (Skor Maksimum 27 sesuai skoring TB.csv)
// A1. Gejala (7 pertanyaan, bobot skor Ya: 3, 3, 2, 2, 2, 1, 1 - Maks. 14 poin)
// A2. Faktor Risiko (8 pertanyaan, bobot skor Ya: 3, 2, 2, 2, 1, 1, 1, 1 - Maks. 13 poin)
// Total skor: 0 - 27
// Kategori:
// 0 – 4 : Rendah (Edukasi pencegahan, skrining ulang berkala)
// 5 – 9 : Sedang (Anjuran periksa ke faskes, rujukan tes)
// ≥ 10  : Tinggi (Rujukan prioritas untuk tes dan evaluasi pengobatan)
export const SCREENING_QUESTIONS = {
  gejala: [
    {
      id: "batuk_dahak",
      no: 1,
      label: "Batuk berdahak ≥ 2 minggu",
      points: 3,
      isCardinal: true,
      description: "Batuk berdahak terus-menerus selama dua minggu atau lebih merupakan gejala klinis utama tuberkulosis."
    },
    {
      id: "batuk_darah",
      no: 2,
      label: "Batuk disertai darah",
      points: 3,
      isCardinal: true,
      description: "Batuk bercampur bercak darah atau batuk darah segar (hemoptisis) merupakan tanda bahaya kardinal."
    },
    {
      id: "demam",
      no: 3,
      label: "Demam atau meriang > 1 bulan",
      points: 2,
      isCardinal: false,
      description: "Demam subfebris atau meriang hilang-timbul dalam durasi lama (> 1 bulan)."
    },
    {
      id: "keringat_malam",
      no: 4,
      label: "Keringat malam tanpa aktivitas",
      points: 2,
      isCardinal: false,
      description: "Keluarnya keringat dingin berlebih di malam hari tanpa melakukan aktivitas fisik berat."
    },
    {
      id: "bb_turun",
      no: 5,
      label: "Berat badan turun tanpa sebab jelas / nafsu makan turun",
      points: 2,
      isCardinal: false,
      description: "Penurunan berat badan tanpa penyebab yang jelas atau nafsu makan menurun drastis."
    },
    {
      id: "sesak_dada",
      no: 6,
      label: "Sesak napas atau nyeri dada",
      points: 1,
      isCardinal: false,
      description: "Kesulitan bernapas, napas pendek, atau rasa nyeri/tertekan pada area rongga dada."
    },
    {
      id: "lemas_lelah",
      no: 7,
      label: "Lemas atau mudah lelah",
      points: 1,
      isCardinal: false,
      description: "Kelelahan kronis, tubuh terasa lemah berkepanjangan walau telah cukup istirahat."
    }
  ],
  faktorRisiko: [
    {
      id: "kontak_tb",
      no: 8,
      label: "Kontak serumah / dekat dengan penderita TB",
      points: 3,
      description: "Tinggal satu rumah atau kontak intensif jarak dekat dengan pasien TB terkonfirmasi."
    },
    {
      id: "riwayat_tb",
      no: 9,
      label: "Pernah sakit TB atau pernah berobat TB",
      points: 2,
      description: "Riwayat diagnosis atau pernah menjalani pengobatan obat anti-TB sebelumnya."
    },
    {
      id: "hiv",
      no: 10,
      label: "Memiliki HIV",
      points: 2,
      description: "Infeksi HIV yang menyebabkan penurunan daya tahan tubuh seluler terhadap infeksi TB."
    },
    {
      id: "diabetes",
      no: 11,
      label: "Memiliki diabetes",
      points: 2,
      description: "Riwayat diabetes mellitus (kencing manis) yang menurunkan imunitas seluler."
    },
    {
      id: "merokok",
      no: 12,
      label: "Merokok",
      points: 1,
      description: "Riwayat merokok aktif yang dapat merusak silia dan pertahanan mukosa saluran napas."
    },
    {
      id: "kurang_gizi",
      no: 13,
      label: "Kurang gizi / IMT rendah",
      points: 1,
      description: "Indeks Massa Tubuh (IMT) di bawah 18,5 atau kondisi malnutrisi energi protein."
    },
    {
      id: "hunian_padat",
      no: 14,
      label: "Tinggal di hunian padat atau berventilasi buruk",
      points: 1,
      description: "Kepadatan hunian tinggi atau sirkulasi udara dan ventilasi ruangan yang kurang memadai."
    },
    {
      id: "lansia_anak",
      no: 15,
      label: "Lansia (≥ 60 tahun) atau anak < 5 tahun",
      points: 1,
      description: "Kelompok usia rentan dengan imunitas fisiologis yang lebih rentan terhadap infeksi kuman TB."
    }
  ]
};

// 2. Skrining Risiko Kepatuhan TPT (sesuai skoring tpt.csv)
// 17 Pertanyaan (B1 - B17) mencakup 6 faktor hambatan:
// Pengetahuan, Akses, Ekonomi, Dukungan Sosial, Stigma, Perilaku dan Kondisi
// Skor per pertanyaan: 0, 1, atau 2 (Maks. 34 poin)
// Skor tinggi mengindikasikan hambatan kepatuhan / risiko drop-out tinggi
export const ADHERENCE_QUESTIONS = [
  // Pengetahuan (B1 - B3)
  {
    id: "b1",
    no: "B1",
    factor: "Pengetahuan",
    question: "Apakah tahu TB bisa sembuh dengan obat?",
    options: [
      { label: "Tahu", points: 0 },
      { label: "Ragu", points: 1 },
      { label: "Tidak", points: 2 }
    ]
  },
  {
    id: "b2",
    no: "B2",
    factor: "Pengetahuan",
    question: "Apakah tahu obat harus diminum ± 6 bulan tanpa putus?",
    options: [
      { label: "Tahu", points: 0 },
      { label: "Ragu", points: 1 },
      { label: "Tidak", points: 2 }
    ]
  },
  {
    id: "b3",
    no: "B3",
    factor: "Pengetahuan",
    question: "Apakah tahu bahaya putus obat (kuman kebal obat)?",
    options: [
      { label: "Tahu", points: 0 },
      { label: "Ragu", points: 1 },
      { label: "Tidak", points: 2 }
    ]
  },
  // Akses (B4 - B6)
  {
    id: "b4",
    no: "B4",
    factor: "Akses",
    question: "Jarak/waktu tempuh ke faskes",
    options: [
      { label: "< 30 menit", points: 0 },
      { label: "30–60 menit", points: 1 },
      { label: "> 60 menit", points: 2 }
    ]
  },
  {
    id: "b5",
    no: "B5",
    factor: "Akses",
    question: "Apakah transportasi sulit atau mahal?",
    options: [
      { label: "Tidak", points: 0 },
      { label: "Kadang", points: 1 },
      { label: "Ya", points: 2 }
    ]
  },
  {
    id: "b6",
    no: "B6",
    factor: "Akses",
    question: "Apakah jam kerja bentrok dengan jam layanan faskes?",
    options: [
      { label: "Tidak", points: 0 },
      { label: "Kadang", points: 1 },
      { label: "Ya", points: 2 }
    ]
  },
  // Ekonomi (B7 - B9)
  {
    id: "b7",
    no: "B7",
    factor: "Ekonomi",
    question: "Apakah mampu membiayai transport dan pemeriksaan?",
    options: [
      { label: "Mampu", points: 0 },
      { label: "Terbatas", points: 1 },
      { label: "Tidak", points: 2 }
    ]
  },
  {
    id: "b8",
    no: "B8",
    factor: "Ekonomi",
    question: "Apakah akan kehilangan penghasilan jika sering izin berobat?",
    options: [
      { label: "Tidak", points: 0 },
      { label: "Sebagian", points: 1 },
      { label: "Ya", points: 2 }
    ]
  },
  {
    id: "b9",
    no: "B9",
    factor: "Ekonomi",
    question: "Punya jaminan kesehatan (BPJS) aktif?",
    options: [
      { label: "Ya", points: 0 },
      { label: "Tidak aktif", points: 1 },
      { label: "Tidak punya", points: 2 }
    ]
  },
  // Dukungan sosial (B10 - B11)
  {
    id: "b10",
    no: "B10",
    factor: "Dukungan sosial",
    question: "Ada keluarga atau orang yang mau mendampingi minum obat (PMO)?",
    options: [
      { label: "Ada", points: 0 },
      { label: "Belum pasti", points: 1 },
      { label: "Tidak ada", points: 2 }
    ]
  },
  {
    id: "b11",
    no: "B11",
    factor: "Dukungan sosial",
    question: "Tinggal sendiri atau sering berpindah tempat?",
    options: [
      { label: "Tidak", points: 0 },
      { label: "Kadang", points: 1 },
      { label: "Ya", points: 2 }
    ]
  },
  // Stigma (B12 - B13)
  {
    id: "b12",
    no: "B12",
    factor: "Stigma",
    question: "Apakah malu atau takut orang lain tahu menderita TB?",
    options: [
      { label: "Tidak", points: 0 },
      { label: "Sedikit", points: 1 },
      { label: "Sangat", points: 2 }
    ]
  },
  {
    id: "b13",
    no: "B13",
    factor: "Stigma",
    question: "Takut dijauhi keluarga, tetangga, atau tempat kerja?",
    options: [
      { label: "Tidak", points: 0 },
      { label: "Sedikit", points: 1 },
      { label: "Sangat", points: 2 }
    ]
  },
  // Perilaku dan kondisi (B14 - B17)
  {
    id: "b14",
    no: "B14",
    factor: "Perilaku dan kondisi",
    question: "Pernah putus atau berhenti minum obat jangka panjang sebelumnya?",
    options: [
      { label: "Tidak", points: 0 },
      { label: "Pernah sekali", points: 1 },
      { label: "Lebih dari sekali", points: 2 }
    ]
  },
  {
    id: "b15",
    no: "B15",
    factor: "Perilaku dan kondisi",
    question: "Khawatir efek samping obat?",
    options: [
      { label: "Tidak", points: 0 },
      { label: "Sedikit", points: 1 },
      { label: "Sangat", points: 2 }
    ]
  },
  {
    id: "b16",
    no: "B16",
    factor: "Perilaku dan kondisi",
    question: "Sering lupa minum obat atau mudah bosan?",
    options: [
      { label: "Tidak", points: 0 },
      { label: "Kadang", points: 1 },
      { label: "Sering", points: 2 }
    ]
  },
  {
    id: "b17",
    no: "B17",
    factor: "Perilaku dan kondisi",
    question: "Ada kebiasaan/kondisi lain (alkohol, napza, gangguan mental, penyakit penyerta)?",
    options: [
      { label: "Tidak", points: 0 },
      { label: "Ada satu", points: 1 },
      { label: "Lebih dari satu", points: 2 }
    ]
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
    gejalaAktif: ["demam", "bb_turun"],
    faktorAktif: ["kontak_tb"],
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
    skor: 3,
    kategoriRisiko: "Rendah",
    gejalaAktif: [],
    faktorAktif: ["diabetes", "merokok"],
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
    skor: 13,
    kategoriRisiko: "Tinggi",
    gejalaAktif: ["batuk_dahak", "batuk_darah", "bb_turun"],
    faktorAktif: ["kontak_tb", "diabetes"],
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
