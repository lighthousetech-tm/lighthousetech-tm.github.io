// 1. TAB-URI COMPACTE (ZONE / CONTRACTE / FAQ)
function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// 2. ESTIMATOR INTERVENȚIE & REVOLUT
let currentEstimateSummary = "";
let currentLang = "ro";

function updateEstimate() {
  const checked = Array.from(document.querySelectorAll('.task-cb:checked'));
  const zoneExtra = parseInt(document.querySelector('input[name="zone"]:checked').value, 10);
  const payment = document.querySelector('input[name="payment"]:checked').value;

  const revBox = document.getElementById('revolutBox');
  if (payment.includes('Revolut')) {
    revBox.classList.add('visible');
  } else {
    revBox.classList.remove('visible');
  }

  const estText = document.getElementById('estText');
  const hiddenInput = document.getElementById('hiddenEstimateInput');

  if (checked.length === 0) {
    estText.textContent = i18n[currentLang].est_empty;
    currentEstimateSummary = "";
    if (hiddenInput) hiddenInput.value = "Neselectat";
    return;
  }

  const types = checked.map(cb => cb.value);
  let pkgName = "Suport Remote";
  let basePrice = 80;
  let appliesTravel = false;

  if (types.includes('full')) {
    pkgName = "Zi Completă & Rețelistică (8 ore)";
    basePrice = 750;
    appliesTravel = true;
  } else if (types.includes('mentenanta') || checked.length >= 3) {
    pkgName = "Mentenanță Onsite (până la 4 ore)";
    basePrice = 400;
    appliesTravel = true;
  } else if (types.includes('rapid') || checked.length === 2) {
    pkgName = "Intervenție Rapidă (până la 2 ore)";
    basePrice = 250;
    appliesTravel = true;
  }

  const travelCost = appliesTravel ? zoneExtra : 0;
  const total = basePrice + travelCost;
  const zoneLabel = zoneExtra === 0 ? "Timișoara / limitrof (0 lei)" : "Arad / Lugoj (+100 lei)";

  estText.textContent = `${pkgName} — ${total} lei`;

  const tasksList = checked.map(cb => cb.dataset.label).join(", ");
  currentEstimateSummary =
    `Salut George! Am folosit estimatorul Lighthouse Tech:\n` +
    `• Servicii: ${tasksList}\n` +
    `• Pachet recomandat: ${pkgName}\n` +
    `• Zonă: ${zoneLabel}\n` +
    `• Plată preferată: ${payment}\n` +
    `• Total estimat: ${total} lei`;

  if (hiddenInput) hiddenInput.value = currentEstimateSummary.replace(/\n/g, " | ");
}

function sendEstimateWhatsApp() {
  if (!currentEstimateSummary) {
    alert(i18n[currentLang].est_alert);
    return;
  }
  const url = `https://wa.me{encodeURIComponent(currentEstimateSummary)}`;
  window.open(url, '_blank', 'noopener');
}

function copyRevTag(btn) {
  navigator.clipboard.writeText('@nitaa2saa').then(() => {
    const old = btn.textContent;
    btn.textContent = "✓ @nitaa2saa";
    setTimeout(() => btn.textContent = old, 2000);
  });
}
// 3. CONTRACTE POP-UP EDITABILE (PRINT / CTRL+P PDF)
const todayStr = new Date().toLocaleDateString('ro-RO');

const contractsData = {
  b2b: {
    title: "Contract Prestări Servicii IT (Firme / B2B)",
    html: `
      <h2>Contract de Prestări Servicii IT</h2>
      <div class="doc-sub">Nr. <input class="doc-input" style="min-width:55px" placeholder="____"> / Data: <input class="doc-input" style="min-width:90px" value="${todayStr}"></div>
      <h4>I. PĂRȚILE CONTRACTANTE</h4>
      <p><strong>1. PRESTATOR:</strong> <strong>George Niță</strong> (Lighthouse Tech), Timișoara, jud. Timiș, tel. 0767 231 199, e-mail: lighthousetech.tm@gmail.com, în calitate de Prestator,</p>
      <p><strong>2. BENEFICIAR:</strong> Societatea <input class="doc-input" style="min-width:220px" placeholder="Nume Firmă SRL">, sediul în <input class="doc-input" style="min-width:200px" placeholder="Localitate, Adresă">, CUI <input class="doc-input" style="min-width:105px" placeholder="RO________">, Reg. Com. <input class="doc-input" style="min-width:115px" placeholder="J35/____/____">, reprezentată prin <input class="doc-input" style="min-width:165px" placeholder="Nume Reprezentant">.</p>

      <h4>II. OBIECTUL CONTRACTULUI</h4>
      <p>Prestatorul execută pentru Beneficiar servicii de asistență tehnică IT, mentenanță hardware/software, configurare echipamente și/sau lucrări de rețelistică: <input class="doc-input" style="width:100%; margin-top:4px" placeholder="Descriere scurtă intervenție..."></p>

      <h4>III. PREȚUL ȘI PLATA</h4>
      <ul>
        <li>Tariful convenit este de <input class="doc-input" style="min-width:75px" placeholder="_____"> lei (conform pachetului ales + eventuală taxă deplasare 100 lei Arad/Lugoj).</li>
        <li>Pentru persoane juridice, impozitul pe venit de 10% se reține la sursă de către Beneficiar conform Codului Fiscal.</li>
        <li>Plata se face la final prin numerar sau Revolut (@nitaa2saa), pe baza Procesului-Verbal.</li>
      </ul>

      <h4>IV. GARANȚIE ȘI CONFIDENȚIALITATE</h4>
      <p>La final părțile testează împreună echipamentele și semnează Procesul-Verbal care confirmă funcționarea optimă la predare. Prestatorul păstrează confidențialitatea deplină asupra datelor Beneficiarului.</p>

      <div class="sign-grid">
        <div><strong>PRESTATOR,</strong><br>George Niță (Lighthouse Tech)<br><br>Semnătura: ___________________</div>
        <div><strong>BENEFICIAR,</strong><br><input class="doc-input" style="min-width:165px" placeholder="Nume / Firmă"><br><br>Semnătura / Ștampila: _________</div>
      </div>
    `
  },
  b2c: {
    title: "Contract & Proces-Verbal (Persoane Fizice)",
    html: `
      <h2>Contract de Prestări Servicii & Proces-Verbal</h2>
      <div class="doc-sub">Persoane Fizice • Nr. <input class="doc-input" style="min-width:55px" placeholder="____"> / Data: <input class="doc-input" style="min-width:90px" value="${todayStr}"></div>
      <h4>I. PĂRȚILE</h4>
      <p><strong>1. PRESTATOR:</strong> <strong>George Niță</strong> (Lighthouse Tech), Timișoara, tel. 0767 231 199, e-mail: lighthousetech.tm@gmail.com.</p>
      <p><strong>2. BENEFICIAR:</strong> Dl./Dna. <input class="doc-input" style="min-width:200px" placeholder="Nume și Prenume">, domiciliat(ă) în <input class="doc-input" style="min-width:200px" placeholder="Localitate, Adresă">, tel. <input class="doc-input" style="min-width:115px" placeholder="07________">.</p>

      <h4>II. SERVICII PRESTATE</h4>
      <p>Operațiuni tehnice IT efectuate (instalare/optimizare PC, configurare router Wi-Fi, instalare imprimantă, remediere software/hardware):</p>
      <p><input class="doc-input" style="width:100%" placeholder="Detalii operațiuni efectuate..."></p>

      <h4>III. TARIF ȘI ACHITARE</h4>
      <p>Valoarea intervenției: <input class="doc-input" style="min-width:75px" placeholder="_____"> lei, achitată prin:
        <label style="margin-left:8px"><input type="checkbox"> Numerar</label>
        <label style="margin-left:10px"><input type="checkbox"> Revolut (@nitaa2saa)</label>
      </p>

      <h4>IV. PROCES-VERBAL DE PREDARE-PRIMIRE</h4>
      <p>Subsemnatul(a) Beneficiar confirm că echipamentele și serviciile de mai sus au fost testate în prezența mea și funcționează în parametri optimi.</p>

      <div class="sign-grid">
        <div><strong>PRESTATOR,</strong><br>George Niță<br><br>Semnătura: ___________________</div>
        <div><strong>BENEFICIAR,</strong><br><input class="doc-input" style="min-width:165px" placeholder="Nume Beneficiar"><br><br>Semnătura: ___________________</div>
      </div>
    `
  }
};

function openContract(type) {
  const data = contractsData[type];
  document.getElementById('contractModalTitle').textContent = data.title;
  document.getElementById('contractBody').innerHTML = data.html;
  openModal('contractModal');
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal('contractModal');
    closeModal('gdprModal');
  }
});

// 4. DESCĂRCARE CONTACT vCARD (.VCF)
function downloadVCard() {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "N:Niță;George;;;",
    "FN:George Niță — Lighthouse Tech",
    "ORG:Lighthouse Tech",
    "TITLE:Specialist IT",
    "TEL;TYPE=CELL,VOICE:+40767231199",
    "EMAIL;TYPE=INTERNET:lighthousetech.tm@gmail.com",
    "ADR;TYPE=WORK:;;Timișoara;;;Romania",
    "END:VCARD"
  ].join("\n");

  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "George_Nita_Lighthouse_Tech.vcf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
// 5. TRADUCERI COMPLETE 100% (RO / EN / FR)
const i18n = {
  ro: {
    nav_pricing: "Servicii & Tarife", nav_estimator: "Estimator", nav_info: "Zone & Contracte", nav_about: "Contact",
    hero_badge: "⚡ Suport IT Timișoara, Arad & Lugoj",
    hero_title: "Tehnologia te ține în <span>direcția corectă.</span>",
    hero_sub: "Calculatoare, rețelistică, imprimante și asistență remote — rapid, transparent și fără abonamente lunare, oferite de George Niță.",
    hero_cta1: "Calculează intervenția", hero_email: "✉️ E-mail",
    prc_title: "SERVICII & TARIFE LA CERERE", prc_sub: "Fără abonamente lunare. Plătești doar când ai nevoie.",
    pop_tag: "Cel mai popular",
    c1_title: "💻 SUPORT REMOTE", c1_sub: "/ intervenție", c1_pill: "🌐 De la distanță (0 lei deplasare)",
    c1_f1: "Diagnosticare AnyDesk / TeamViewer", c1_f2: "Instalare programe, drivere și e-mail", c1_f3: "Plată în avans Revolut (@nitaa2saa)", c1_btn: "Solicită remote",
    c2_title: "🖨️ INTERVENȚIE RAPIDĂ", c2_sub: "/ până la 2 ore", c2_pill: "🚗 Timișoara inclus • +100 lei Arad/Lugoj",
    c2_f1: "Diagnosticare și remediere PC la sediu", c2_f2: "Instalare imprimante și periferice", c2_f3: "Deplasare +100 lei pentru Arad / Lugoj", c2_btn: "Rezervă 2 ore",
    c3_title: "⚙️ MENTENANȚĂ ONSITE", c3_sub: "/ până la 4 ore", c3_pill: "🚗 Timișoara inclus • +100 lei Arad/Lugoj",
    c3_f1: "Curățare și optimizare calculatoare", c3_f2: "Configurare routere Wi-Fi și rețea", c3_f3: "Deplasare +100 lei pentru Arad / Lugoj", c3_btn: "Rezervă 4 ore",
    c4_title: "🌐 ZI COMPLETĂ & REȚEA", c4_sub: "/ zi (8 ore)", c4_pill: "🚗 Timișoara inclus • +100 lei Arad/Lugoj",
    c4_f1: "Montare pat cablu, tras cabluri și mufare", c4_f2: "Configurare completă LAN & Wi-Fi", c4_f3: "🎁 Bonus: 1 intervenție remote gratuită", c4_btn: "Rezervă o zi",
    bonus_txt: "<strong>🎁 BONUS LA 8 ORE:</strong> Primești gratuit o intervenție de Suport Remote pentru reglaje ulterioare.",
    est_title: "ESTIMATOR INTERVENȚIE", est_sub: "Bifează ce ai nevoie și află imediat costul estimat.",
    chk_1: "Suport software / e-mail de la distanță", tag_1: "de la 80 lei",
    chk_2: "Optimizare / curățare PC-uri sau imprimante", chk_3: "Configurare router Wi-Fi / rețea existentă", chk_4: "Tras cabluri, pat cablu, mufare / birou nou",
    zone_grp: "Zonă intervenție", zone_tm: "📍 Timișoara și limitrof (0 lei deplasare)", zone_al: "📍 Arad / Lugoj (+100 lei deplasare)",
    pay_grp: "Plată preferată", pay_cash: "💵 Numerar (Cash)",
    rev_title: "💳 Plată rapidă Revolut — George Niță (@nitaa2saa)", rev_sub: "Scanează codul QR sau apasă butonul pentru plată directă:", rev_copy: "📋 Copiază @nitaa2saa",
    est_rec: "Recomandare estimată:", est_empty: "Alege cel puțin o opțiune", est_alert: "Te rog bifează cel puțin o opțiune în estimator.",
    btn_wa_est: "💬 Trimite pe WhatsApp", email_toggle: "✉️ Preferi să trimiți cererea pe e-mail? Apasă aici",
    ph_name: "Numele tău / Firma", ph_contact: "E-mail sau nr. WhatsApp", ph_details: "Descrie pe scurt problema și localitatea...", form_btn: "📩 Trimite cererea pe e-mail",
    info_title: "INFORMAȚII UTILE & CONTRACTE", info_sub: "Selectează secțiunea dorită",
    tab_1: "📍 Zone acoperite", tab_2: "📄 Modele contracte (PDF)", tab_3: "❓ Cum colaborăm",
    z1_badge: "DEPLASARE GRATUITĂ", z1_title: "Timișoara & limitrof", z2_badge: "DEPLASARE +100 LEI", z2_title: "Arad & Lugoj",
    z2_desc: "Arad, Lugoj și localitățile limitrofe (taxă unică de transport per vizită).",
    ctr_desc: "Deschide modelul, completează datele direct pe ecran și salvează ca PDF sau printează cu <strong>Ctrl + P</strong>.",
    ctr_b2b: "📄 Contract Firme / B2B", ctr_b2c: "📄 Contract / Proces-Verbal Persoane Fizice",
    q1_t: "Cum se face plata și ce documente primesc?", q1_d: "Colaborăm legal pe bază de contract de prestări servicii (atât cu firmele, unde impozitul de 10% se reține la sursă, cât și cu persoanele fizice). Plata se face numerar sau prin Revolut (@nitaa2saa), iar la final semnăm procesul-verbal.",
    q2_t: "Care este garanția intervenției?", q2_d: "La finalul lucrării testăm împreună echipamentele. Semnarea procesului-verbal confirmă funcționarea optimă la predare.",
    q3_t: "Cum funcționează Suportul Remote (80 lei)?", q3_d: "Se achită în avans prin Revolut (@nitaa2saa), apoi ne conectăm securizat prin AnyDesk sau TeamViewer.",
    ab_badge: "Peste 10 ani experiență IT", ab_title: "George Niță — Specialist IT",
    ab_desc: "Ofer firmelor mici și utilizatorilor din Timișoara, Arad și Lugoj sprijin tehnic prompt, transparent și fără abonamente lunare inutile — atât pe partea de hardware și rețelistică, cât și software.",
    ab_vcard: "📲 Salvează contactul (0767 231 199)", gdpr_btn: "🔒 Politică GDPR"
  },
  en: {
    nav_pricing: "Services & Pricing", nav_estimator: "Estimator", nav_info: "Areas & Contracts", nav_about: "Contact",
    hero_badge: "⚡ IT Support Timișoara, Arad & Lugoj",
    hero_title: "Technology keeps you on the <span>right course.</span>",
    hero_sub: "Computers, networking, printers and remote support — fast, transparent and with no monthly subscriptions, by George Niță.",
    hero_cta1: "Estimate intervention", hero_email: "✉️ E-mail",
    prc_title: "ON-DEMAND SERVICES & PRICING", prc_sub: "No monthly subscriptions. Pay only when you need help.",
    pop_tag: "Most popular",
    c1_title: "💻 REMOTE SUPPORT", c1_sub: "/ session", c1_pill: "🌐 Remote (0 lei travel fee)",
    c1_f1: "Fast AnyDesk / TeamViewer diagnostics", c1_f2: "Software, drivers & email setup", c1_f3: "Prepaid via Revolut (@nitaa2saa)", c1_btn: "Request remote",
    c2_title: "🖨️ QUICK INTERVENTION", c2_sub: "/ up to 2 hours", c2_pill: "🚗 Timișoara included • +100 lei Arad/Lugoj",
    c2_f1: "On-site PC diagnostics & troubleshooting", c2_f2: "Printers & peripherals installation", c2_f3: "+100 lei travel fee for Arad / Lugoj", c2_btn: "Book 2 hours",
    c3_title: "⚙️ ON-SITE MAINTENANCE", c3_sub: "/ up to 4 hours", c3_pill: "🚗 Timișoara included • +100 lei Arad/Lugoj",
    c3_f1: "PC cleaning & performance optimization", c3_f2: "Wi-Fi routers & local network setup", c3_f3: "+100 lei travel fee for Arad / Lugoj", c3_btn: "Book 4 hours",
    c4_title: "🌐 FULL DAY & NETWORKING", c4_sub: "/ day (8 hours)", c4_pill: "🚗 Timișoara included • +100 lei Arad/Lugoj",
    c4_f1: "Cable ducts, cabling & RJ45 crimping", c4_f2: "Complete LAN & Wi-Fi infrastructure setup", c4_f3: "🎁 Bonus: 1 free remote session", c4_btn: "Book full day",
    bonus_txt: "<strong>🎁 8-HOUR BONUS:</strong> Get 1 free Remote Support session for follow-up adjustments.",
    est_title: "INTERVENTION ESTIMATOR", est_sub: "Select what you need and get an instant cost estimate.",
    chk_1: "Remote software / email support", tag_1: "from 80 lei",
    chk_2: "PC optimization / cleaning or printers setup", chk_3: "Wi-Fi router / existing network configuration", chk_4: "Cabling, cable ducts, crimping / new office setup",
    zone_grp: "Service area", zone_tm: "📍 Timișoara & surroundings (0 lei travel)", zone_al: "📍 Arad / Lugoj (+100 lei travel fee)",
    pay_grp: "Preferred payment", pay_cash: "💵 Cash",
    rev_title: "💳 Fast Revolut Payment — George Niță (@nitaa2saa)", rev_sub: "Scan the QR code or click the button to pay directly:", rev_copy: "📋 Copy @nitaa2saa",
    est_rec: "Estimated recommendation:", est_empty: "Select at least one option", est_alert: "Please check at least one option in the estimator.",
    btn_wa_est: "💬 Send via WhatsApp", email_toggle: "✉️ Prefer sending your request by email? Click here",
    ph_name: "Your Name / Company", ph_contact: "Email or WhatsApp number", ph_details: "Briefly describe the issue and location...", form_btn: "📩 Send quote request by email",
    info_title: "USEFUL INFO & CONTRACTS", info_sub: "Choose a section",
    tab_1: "📍 Covered areas", tab_2: "📄 Contract templates (PDF)", tab_3: "❓ How we work",
    z1_badge: "FREE TRAVEL", z1_title: "Timișoara & surroundings", z2_badge: "+100 LEI TRAVEL", z2_title: "Arad & Lugoj",
    z2_desc: "Arad, Lugoj and surrounding villages (one-time transport fee per visit).",
    ctr_desc: "Open the template, fill in details directly on screen and save as PDF or print with <strong>Ctrl + P</strong>.",
    ctr_b2b: "📄 Business / B2B Contract", ctr_b2c: "📄 Individual Service & Handover Form",
    q1_t: "How do payments and paperwork work?", q1_d: "We work legally based on a service contract (for both companies and individuals). Payment can be made in cash or via Revolut (@nitaa2saa), followed by a handover report.",
    q2_t: "What is the warranty for the work?", q2_d: "At the end of the intervention we test all equipment together. Signing the handover report confirms optimal operation.",
    q3_t: "How does Remote Support (80 lei) work?", q3_d: "Paid in advance via Revolut (@nitaa2saa), then we connect securely via AnyDesk or TeamViewer.",
    ab_badge: "10+ years of IT experience", ab_title: "George Niță — IT Specialist",
    ab_desc: "I provide small businesses and home users in Timișoara, Arad and Lugoj with fast, transparent IT support without unnecessary monthly subscriptions — covering hardware, networking and software.",
    ab_vcard: "📲 Save contact (0767 231 199)", gdpr_btn: "🔒 GDPR Policy"
  },
  fr: {
    nav_pricing: "Services & Tarifs", nav_estimator: "Estimateur", nav_info: "Zones & Contrats", nav_about: "Contact",
    hero_badge: "⚡ Support IT Timișoara, Arad & Lugoj",
    hero_title: "La technologie vous garde dans la <span>bonne direction.</span>",
    hero_sub: "Ordinateurs, réseaux, imprimantes et assistance à distance — rapide, transparent et sans abonnement mensuel, par George Niță.",
    hero_cta1: "Estimer l'intervention", hero_email: "✉️ E-mail",
    prc_title: "SERVICES & TARIFS À LA DEMANDE", prc_sub: "Sans abonnement mensuel. Payez uniquement en cas de besoin.",
    pop_tag: "Le plus populaire",
    c1_title: "💻 SUPPORT À DISTANCE", c1_sub: "/ intervention", c1_pill: "🌐 À distance (0 lei déplacement)",
    c1_f1: "Diagnostic rapide AnyDesk / TeamViewer", c1_f2: "Installation logiciels, pilotes et e-mails", c1_f3: "Paiement d'avance Revolut (@nitaa2saa)", c1_btn: "Demander à distance",
    c2_title: "🖨️ INTERVENTION RAPIDE", c2_sub: "/ jusqu'à 2 heures", c2_pill: "🚗 Timișoara inclus • +100 lei Arad/Lugoj",
    c2_f1: "Diagnostic et dépannage PC sur site", c2_f2: "Installation imprimantes et périphériques", c2_f3: "Déplacement +100 lei pour Arad / Lugoj", c2_btn: "Réserver 2 heures",
    c3_title: "⚙️ MAINTENANCE SUR SITE", c3_sub: "/ jusqu'à 4 heures", c3_pill: "🚗 Timișoara inclus • +100 lei Arad/Lugoj",
    c3_f1: "Nettoyage et optimisation des PC", c3_f2: "Configuration routeurs Wi-Fi et réseau", c3_f3: "Déplacement +100 lei pour Arad / Lugoj", c3_btn: "Réserver 4 heures",
    c4_title: "🌐 JOURNÉE COMPLÈTE & RÉSEAU", c4_sub: "/ jour (8 heures)", c4_pill: "🚗 Timișoara inclus • +100 lei Arad/Lugoj",
    c4_f1: "Goulottes, câblage et sertissage RJ45", c4_f2: "Configuration complète LAN & Wi-Fi", c4_f3: "🎁 Bonus : 1 session à distance gratuite", c4_btn: "Réserver la journée",
    bonus_txt: "<strong>🎁 BONUS 8 HEURES :</strong> Bénéficiez d'une intervention à distance gratuite pour les réglages ultérieurs.",
    est_title: "ESTIMATEUR D'INTERVENTION", est_sub: "Cochez vos besoins et obtenez immédiatement une estimation.",
    chk_1: "Support logiciel / e-mail à distance", tag_1: "dès 80 lei",
    chk_2: "Optimisation / nettoyage PC ou imprimantes", chk_3: "Configuration routeur Wi-Fi / réseau existant", chk_4: "Câblage, goulottes, sertissage / nouveau bureau",
    zone_grp: "Zone d'intervention", zone_tm: "📍 Timișoara et environs (0 lei déplacement)", zone_al: "📍 Arad / Lugoj (+100 lei déplacement)",
    pay_grp: "Mode de paiement préféré", pay_cash: "💵 Espèces (Cash)",
    rev_title: "💳 Paiement rapide Revolut — George Niță (@nitaa2saa)", rev_sub: "Scannez le code QR ou cliquez sur le bouton pour payer :", rev_copy: "📋 Copier @nitaa2saa",
    est_rec: "Recommandation estimée :", est_empty: "Choisissez au moins une option", est_alert: "Veuillez sélectionner au moins une option dans l'estimateur.",
    btn_wa_est: "💬 Envoyer sur WhatsApp", email_toggle: "✉️ Vous préférez envoyer par e-mail ? Cliquez ici",
    ph_name: "Votre nom / Entreprise", ph_contact: "E-mail ou numéro WhatsApp", ph_details: "Décrivez brièvement le problème et la ville...", form_btn: "📩 Envoyer la demande par e-mail",
    info_title: "INFOS UTILES & CONTRATS", info_sub: "Sélectionnez une rubrique",
    tab_1: "📍 Zones couvertes", tab_2: "📄 Modèles de contrats (PDF)", tab_3: "❓ Comment nous travaillons",
    z1_badge: "DÉPLACEMENT GRATUIT", z1_title: "Timișoara & environs", z2_badge: "DÉPLACEMENT +100 LEI", z2_title: "Arad & Lugoj",
    z2_desc: "Arad, Lugoj et communes voisines (frais de transport uniques par visite).",
    ctr_desc: "Ouvrez le modèle, remplissez les champs à l'écran et enregistrez en PDF ou imprimez avec <strong>Ctrl + P</strong>.",
    ctr_b2b: "📄 Contrat Entreprises / B2B", ctr_b2c: "📄 Contrat / Procès-Verbal Particuliers",
    q1_t: "Comment se font le paiement et les documents ?", q1_d: "Nous travaillons légalement sur la base d'un contrat de prestation de services (entreprises et particuliers). Paiement en espèces ou via Revolut (@nitaa2saa), suivi d'un procès-verbal.",
    q2_t: "Quelle est la garantie de l'intervention ?", q2_d: "À la fin de l'intervention, nous testons ensemble tous les équipements. La signature du procès-verbal confirme le bon fonctionnement.",
    q3_t: "Comment fonctionne le Support à Distance (80 lei) ?", q3_d: "Paiement d'avance via Revolut (@nitaa2saa), puis connexion sécurisée via AnyDesk ou TeamViewer.",
    ab_badge: "Plus de 10 ans d'expérience IT", ab_title: "George Niță — Spécialiste IT",
    ab_desc: "J'offre aux petites entreprises et particuliers de Timișoara, Arad et Lugoj un support technique rapide, transparent et sans abonnement mensuel inutile — matériel, réseau et logiciel.",
    ab_vcard: "📲 Enregistrer le contact (0767 231 199)", gdpr_btn: "🔒 Politique RGPD"
  }
};

function setLang(lang, btn) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const dict = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.innerHTML = dict[key];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (dict[key]) el.placeholder = dict[key];
  });
  updateEstimate();
}
// PĂSTRARE LIMBĂ ÎNTRE PAGINI + TRADUCERE MENIU PAGINI
Object.assign(i18n.ro, { pg_home: "🏠 Acasă", pg_prices: "💳 Tarife & Estimator", pg_contact: "📄 Contracte & Contact", rem_bar_txt: "🖥️ Ai nevoie de <strong>Suport Remote (80 lei)</strong>? Descarcă programul:", next_prices: "Mergi la Tarife & Estimator →", next_contact: "Mergi la Contracte & Contact →" });
Object.assign(i18n.en, { pg_home: "🏠 Home", pg_prices: "💳 Pricing & Estimator", pg_contact: "📄 Contracts & Contact", rem_bar_txt: "🖥️ Need <strong>Remote Support (80 lei)</strong>? Download tool:", next_prices: "Go to Pricing & Estimator →", next_contact: "Go to Contracts & Contact →" });
Object.assign(i18n.fr, { pg_home: "🏠 Accueil", pg_prices: "💳 Tarifs & Estimateur", pg_contact: "📄 Contrats & Contact", rem_bar_txt: "🖥️ Besoin de <strong>Support à Distance (80 lei)</strong> ? Téléchargez :", next_prices: "Voir Tarifs & Estimateur →", next_contact: "Voir Contrats & Contact →" });

const origSetLang = setLang;
setLang = function(lang, btn) {
  localStorage.setItem('lt_lang', lang);
  origSetLang(lang, btn);
};
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('lt_lang') || 'ro';
  const btn = Array.from(document.querySelectorAll('.lang-btn')).find(b => b.textContent.trim().toLowerCase() === saved);
  if (btn) origSetLang(saved, btn);
});
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href*="wa.me/"]').forEach(link => {
    const parts = link.href.split('?text=');
    const msg = parts[1] ? `&text=${parts[1]}` : '';
    link.href = `https://whatsapp.com{msg}`;
  });
});

sendEstimateWhatsApp = function() {
  if (!currentEstimateSummary) {
    alert(i18n[currentLang].est_alert);
    return;
  }
  const url = `https://whatsapp.com{encodeURIComponent(currentEstimateSummary)}`;
  window.open(url, '_blank', 'noopener');
};
// REPARARE WHATSAPP PE MOBIL & DESKTOP
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    const parsed = new URL(link.href);
    const msg = parsed.searchParams.get('text');
    link.href = msg
      ? 'https://whatsapp.com' + encodeURIComponent(msg)
      : 'https://whatsapp.com';
    link.removeAttribute('target');
  });
});

sendEstimateWhatsApp = function() {
  if (!currentEstimateSummary) {
    alert(i18n[currentLang].est_alert);
    return;
  }
  window.location.href = 'https://whatsapp.com' + encodeURIComponent(currentEstimateSummary);
};
