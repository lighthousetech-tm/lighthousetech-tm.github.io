// 1. TAB-URI COMPACTE (ZONE / CONTRACTE / FAQ)
function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// 2. ESTIMATOR INTERVENTIE & REVOLUT
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
  let pkgName = "Suport Remote (până la 60 min / 1 PC)";
  let basePrice = 80;
  let appliesTravel = false;

  if (types.includes('full')) {
    pkgName = "Zi Completă & Rețea (8 ore)";
    basePrice = 750;
    appliesTravel = true;
  } else if (types.includes('mentenanta') || checked.length >= 3) {
    pkgName = "Mentenanță Onsite (până la 4 ore / max. 5 stații)";
    basePrice = 400;
    appliesTravel = true;
  } else if (types.includes('rapid') || checked.length === 2) {
    pkgName = "Intervenție Rapidă (până la 2 ore / 1-2 stații)";
    basePrice = 250;
    appliesTravel = true;
  }

  const travelCost = appliesTravel ? zoneExtra : 0;
  const total = basePrice + travelCost;
  const zoneLabel = zoneExtra === 0 ? "Timișoara / limitrof (0 lei)" : "Arad / Lugoj (+100 lei)";

  estText.textContent = pkgName + " — " + total + " lei (manoperă)";

  const tasksList = checked.map(cb => cb.dataset.label).join(", ");
  currentEstimateSummary =
    "Salut George! Am folosit estimatorul Lighthouse Tech:\n" +
    "• Servicii: " + tasksList + "\n" +
    "• Pachet recomandat: " + pkgName + "\n" +
    "• Zonă: " + zoneLabel + "\n" +
    "• Plată preferată: " + payment + "\n" +
    "• Total estimat manoperă: " + total + " lei";

  if (hiddenInput) hiddenInput.value = currentEstimateSummary.replace(/\n/g, " | ");
}

function sendEstimateWhatsApp() {
  if (!currentEstimateSummary) {
    alert(i18n[currentLang].est_alert);
    return;
  }
  const url = 'https://wa.me' + encodeURIComponent(currentEstimateSummary);
  window.open(url, '_blank', 'noopener');
}

function copyRevTag(btn) {
  navigator.clipboard.writeText('@nitaa2saa').then(() => {
    const old = btn.textContent;
    btn.textContent = "Copiat: @nitaa2saa";
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
      <h4>III. PREȚUL, MATERIALELE ȘI PLATA</h4>
      <ul>
        <li>Tariful convenit pentru manoperă este de <input class="doc-input" style="min-width:75px" placeholder="_____"> lei (conform pachetului ales + eventuală taxă deplasare 100 lei Arad/Lugoj). Prelungirea duratei pachetului se taxează cu +100 lei/oră onsite (+80 lei/oră remote), doar cu acordul prealabil al Beneficiarului.</li>
        <li>Materialele consumabile și componentele (cabluri UTP, mufe RJ45, pat cablu, prize, echipamente) nu sunt incluse în manoperă. Acestea sunt asigurate de Beneficiar înainte de intervenție sau achitate în avans către Prestator pentru achiziție pe baza bonului/facturii.</li>
        <li>Pentru persoane juridice, impozitul pe venit de 10% se reține la sursă de către Beneficiar conform Codului Fiscal. Plata se face la final prin numerar sau Revolut (@nitaa2saa), pe baza Procesului-Verbal.</li>
      </ul>
      <h4>IV. GARANȚIE ȘI CONFIDENȚIALITATE</h4>
      <p>La final părțile testează împreună echipamentele și semnează Procesul-Verbal care confirmă funcționarea optimă la predare. Prestatorul oferă <strong>garanție 30 de zile pentru manopera efectuată</strong> (remediere gratuită dacă problema reapare) și păstrează confidențialitatea deplină asupra datelor Beneficiarului.</p>
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
      <h4>III. TARIF, MATERIALE ȘI ACHITARE</h4>
      <p>Valoarea manoperei: <input class="doc-input" style="min-width:75px" placeholder="_____"> lei (ore suplimentare doar cu acordul Beneficiarului: +100 lei/oră onsite, +80 lei/oră remote). Eventualele materiale necesare sunt asigurate de Beneficiar sau achitate în avans pe bază de bon fiscal.</p>
      <p>Achitată prin:
        <label style="margin-left:8px"><input type="checkbox"> Numerar</label>
        <label style="margin-left:10px"><input type="checkbox"> Revolut (@nitaa2saa)</label>
      </p>
      <h4>IV. GARANȚIE ȘI PROCES-VERBAL DE PREDARE-PRIMIRE</h4>
      <p>Subsemnatul(a) Beneficiar confirm că echipamentele și serviciile de mai sus au fost testate în prezența mea și funcționează în parametri optimi. Lucrările beneficiază de <strong>garanție 30 de zile pe manoperă</strong>.</p>
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
// 5. TRADUCERI COMPLETE (RO / EN / FR - FARA EMOJI)
const i18n = {
  ro: {
    pg_home: "Acasă", pg_prices: "Tarife & Estimator", pg_contact: "Contracte & Contact",
    rem_bar_txt: "Ai nevoie de <strong>Suport Remote (80 lei / 60 min)</strong>? Descarcă aplicația:",
    next_prices: "Mergi la Tarife & Estimator →", next_contact: "Mergi la Contracte & Contact →",
    hero_badge: "Suport IT Timișoara, Arad & Lugoj",
    hero_title: "Tehnologia te ține în <span>direcția corectă.</span>",
    hero_sub: "Calculatoare, rețelistică, imprimante și asistență remote — intervenții rapide, tarife transparente și zero abonamente lunare, oferite de George Niță.",
    hero_cta1: "Vezi Tarife & Estimator", hero_email: "Trimite E-mail",
    exp_title: "EXPERIENȚĂ ȘI GARANȚIE",
    exp_sub: "Intervenții executate responsabil, cu testare completă la predare și acoperire legală.",
    t1_title: "Peste 10 ani experiență în IT",
    t1_desc: "George Niță — specialist IT cu peste un deceniu de practică în diagnosticare hardware, optimizare sisteme Windows, rețelistică LAN/Wi-Fi și mentenanță pentru birouri și utilizatori rezidențiali.",
    t2_title: "Garanție 30 de zile pe manoperă",
    t2_desc: "Orice intervenție este testată împreună cu tine înainte de predare. Dacă aceeași problemă reapare în termen de 30 de zile, remedierea este complet gratuită.",
    t3_title: "Intervenție în 2–4 ore în Timișoara",
    t3_desc: "Pentru urgențe în Timișoara și localitățile limitrofe ajung în 2–4 ore de la confirmare. Deplasările în Arad și Lugoj se programează în maximum 24 de ore.",
    port_title: "LUCRĂRI RECENTE & PORTOFOLIU",
    port_sub: "Exemple reale de proiecte și intervenții realizate pentru firme mici și utilizatori.",
    p1_tag: "Rețelistică & Birou Nou • Timișoara",
    p1_title: "Infrastructură LAN & Wi-Fi pentru birou cu 12 posturi",
    p1_desc: "Montaj pat cablu, trasare cabluri UTP Cat6, mufare RJ45, configurare switch și router Wi-Fi dual-band cu rețea separată pentru clienți.",
    p1_meta: "Pachet aplicat: Zi Completă & Rețea (8 ore)",
    p2_tag: "Mentenanță Hardware • Dumbrăvița",
    p2_title: "Optimizare și upgrade SSD pentru 6 stații de lucru",
    p2_desc: "Curățare profesională de praf, înlocuire pastă termoconductoare, clonare sistem pe SSD-uri noi și configurare backup automat pentru un cabinet de contabilitate.",
    p2_meta: "Pachet aplicat: Mentenanță Onsite (4 ore)",
    p3_tag: "Imprimante & Rețea • Arad",
    p3_title: "Configurare imprimante multifuncționale în rețea",
    p3_desc: "Alocare IP-uri statice, configurare scanare directă în folderele partajate pe 8 calculatoare și instalare drivere pentru 3 echipamente de birou.",
    p3_meta: "Pachet aplicat: Intervenție Rapidă + deplasare Arad",
    p4_tag: "Asistență Remote • Național",
    p4_title: "Devirusare, securizare și configurare e-mail business",
    p4_desc: "Conectare securizată prin AnyDesk, eliminare programe nedorite, actualizare drivere și configurare clienți de e-mail Outlook/Thunderbird pentru PFA.",
    p4_meta: "Pachet aplicat: Suport Remote (60 min)",
    prc_title: "SERVICII & TARIFE LA CERERE", prc_sub: "Fără abonamente lunare. Plătești doar pentru intervenția de care ai nevoie.",
    pop_tag: "Cel mai popular",
    c1_title: "SUPORT REMOTE", c1_sub: "/ sesiune până la 60 min (1 PC)", c1_pill: "De la distanță • 0 lei deplasare",
    c1_f1: "Diagnosticare securizată AnyDesk / TeamViewer", c1_f2: "Instalare programe, drivere și configurare e-mail", c1_f3: "Prelungire: +80 lei / oră suplimentară", c1_f4: "Plată în avans prin Revolut (@nitaa2saa)", c1_btn: "Solicită remote",
    c2_title: "INTERVENȚIE RAPIDĂ", c2_sub: "/ până la 2 ore (1–2 stații)", c2_pill: "Timișoara 0 lei • +100 lei Arad/Lugoj",
    c2_f1: "Sosire în 2–4 ore în Timișoara și limitrof", c2_f2: "Diagnosticare și remediere pentru 1–2 PC-uri", c2_f3: "Instalare imprimante și periferice de birou", c2_f4: "Ora suplimentară: +100 lei / oră", c2_btn: "Rezervă 2 ore",
    c3_title: "MENTENANȚĂ ONSITE", c3_sub: "/ până la 4 ore (până la 5 stații)", c3_pill: "Timișoara 0 lei • +100 lei Arad/Lugoj",
    c3_f1: "Curățare hardware și optimizare până la 5 PC-uri", c3_f2: "Configurare routere Wi-Fi, switch-uri și rețea LAN", c3_f3: "Configurare backup date și partajare fișiere", c3_f4: "Ora suplimentară: +100 lei / oră", c3_btn: "Rezervă 4 ore",
    c4_title: "ZI COMPLETĂ & REȚEA", c4_sub: "/ zi 8 ore (birou complet)", c4_pill: "Timișoara 0 lei • +100 lei Arad/Lugoj",
    c4_f1: "Montare pat cablu, trasare cabluri UTP și mufare", c4_f2: "Configurare completă rețea LAN, Wi-Fi și stații", c4_f3: "Materialele consumabile nu sunt incluse", c4_f4: "Bonus inclus: 1 sesiune Suport Remote gratuită", c4_btn: "Rezervă o zi",
    term_mat: "<strong>Materiale și consumabile</strong>Tarifele afișate reprezintă manopera. Cablurile UTP, mufele RJ45, patul de cablu, prizele sau componentele hardware trebuie asigurate de client înainte de intervenție sau achitate în avans pentru achiziție pe baza bonului/facturii.",
    term_extra: "<strong>Ore suplimentare și garanție</strong>Dacă lucrarea depășește durata pachetului ales, prelungirea se face doar cu acordul tău (+80 lei/oră remote, +100 lei/oră onsite). Toate lucrările beneficiază de 30 de zile garanție pe manoperă.",
    bonus_txt: "<strong>BONUS LA PACHETUL DE 8 ORE:</strong> Primești gratuit o intervenție de Suport Remote (60 min) pentru reglaje ulterioare.",
    est_title: "ESTIMATOR INTERVENȚIE", est_sub: "Bifează ce ai nevoie și află imediat pachetul recomandat și costul estimat.",
    chk_1: "Suport software / e-mail de la distanță (până la 60 min)", tag_1: "80 lei",
    chk_2: "Diagnosticare PC (1–2 stații) sau instalare imprimantă", chk_3: "Optimizare până la 5 PC-uri / configurare Wi-Fi & LAN", chk_4: "Tras cabluri, pat cablu, mufare / configurare birou nou",
    zone_grp: "Zonă intervenție", zone_tm: "Timișoara și limitrof (0 lei deplasare)", zone_al: "Arad / Lugoj (+100 lei deplasare)",
    pay_grp: "Plată preferată", pay_cash: "Numerar (Cash)",
    rev_title: "Plată rapidă Revolut — George Niță (@nitaa2saa)", rev_sub: "Scanează codul QR sau folosește linkul direct pentru transfer:", rev_copy: "Copiază @nitaa2saa",
    est_rec: "Recomandare estimată (manoperă):", est_empty: "Alege cel puțin o opțiune", est_alert: "Te rog bifează cel puțin o opțiune în estimator.",
    btn_wa_est: "Trimite pe WhatsApp", email_toggle: "Preferi să trimiți cererea pe e-mail? Apasă aici",
    ph_name: "Numele tău / Firma", ph_contact: "E-mail sau nr. WhatsApp", ph_details: "Descrie pe scurt problema, numărul de calculatoare și localitatea...", form_btn: "Trimite cererea pe e-mail",
    info_title: "INFORMAȚII UTILE & CONTRACTE", info_sub: "Selectează secțiunea dorită pentru detalii despre deplasare, acte și garanție.",
    tab_1: "Zone acoperite & Timp sosire", tab_2: "Modele contracte (PDF)", tab_3: "Întrebări frecvente",
    z1_badge: "DEPLASARE GRATUITĂ (2–4 ORE)", z1_title: "Timișoara & limitrof", z2_badge: "DEPLASARE +100 LEI (MAX. 24 ORE)", z2_title: "Arad & Lugoj",
    z2_desc: "Arad, Lugoj și localitățile limitrofe (taxă unică de transport per vizită, programare în cel mult 24 de ore).",
    ctr_desc: "Deschide modelul, completează datele direct pe ecran și salvează ca PDF sau printează cu <strong>Ctrl + P</strong>.",
    ctr_b2b: "Contract Firme / B2B", ctr_b2c: "Contract / Proces-Verbal Persoane Fizice",
    q1_t: "Cum se face plata și ce documente primesc?", q1_d: "Colaborăm legal pe bază de contract de prestări servicii (atât cu firmele, unde impozitul de 10% se reține la sursă, cât și cu persoanele fizice). Plata se face numerar sau prin Revolut (@nitaa2saa), iar la final semnăm procesul-verbal.",
    q2_t: "Care este garanția intervenției?", q2_d: "La finalul lucrării testăm împreună echipamentele și semnăm procesul-verbal. Toate lucrările au garanție 30 de zile pe manoperă — dacă problema reapare, revenim și o remediem gratuit.",
    q3_t: "Cum funcționează Suportul Remote (80 lei) și cât durează?", q3_d: "Tariful de 80 lei acoperă o sesiune de până la 60 de minute pe un calculator (prin AnyDesk sau TeamViewer) și se achită în avans prin Revolut (@nitaa2saa). Dacă intervenția necesită mai mult timp, prelungirea se face doar cu acordul tău (+80 lei/oră).",
    q4_t: "Materialele (cabluri, mufe, pat cablu) sunt incluse în preț?", q4_d: "Nu, tarifele afișate acoperă exclusiv manopera. Materialele necesare trebuie asigurate de client înainte de intervenție sau achitate în avans pentru achiziție pe baza bonului/facturii.",
    ab_badge: "Peste 10 ani experiență IT", ab_title: "George Niță — Specialist IT",
    ab_desc: "Ofer firmelor mici și utilizatorilor din Timișoara, Arad și Lugoj sprijin tehnic prompt, transparent și fără abonamente lunare inutile — atât pe partea de hardware și rețelistică, cât și software.",
    ab_vcard: "Salvează contactul (0767 231 199)", gdpr_btn: "Politică GDPR"
  },
  en: {
    pg_home: "Home", pg_prices: "Pricing & Estimator", pg_contact: "Contracts & Contact",
    rem_bar_txt: "Need <strong>Remote Support (80 lei / 60 min)</strong>? Download tool:",
    next_prices: "Go to Pricing & Estimator →", next_contact: "Go to Contracts & Contact →",
    hero_badge: "IT Support Timișoara, Arad & Lugoj",
    hero_title: "Technology keeps you on the <span>right course.</span>",
    hero_sub: "Computers, networking, printers and remote support — fast, transparent and with no monthly subscriptions, by George Niță.",
    hero_cta1: "View Pricing & Estimator", hero_email: "Send E-mail",
    exp_title: "EXPERIENCE & WARRANTY",
    exp_sub: "Responsible IT interventions, full testing upon handover and legal documentation.",
    t1_title: "10+ years of IT experience",
    t1_desc: "George Niță — IT specialist with over a decade of hands-on experience in hardware diagnostics, Windows optimization, LAN/Wi-Fi networking and office maintenance.",
    t2_title: "30-day workmanship warranty",
    t2_desc: "Every intervention is tested together before handover. If the same issue reoccurs within 30 days, we fix it completely free of charge.",
    t3_title: "2–4 hour response in Timișoara",
    t3_desc: "For urgent calls in Timișoara and nearby villages we arrive within 2–4 hours. Visits to Arad and Lugoj are scheduled within 24 hours.",
    port_title: "RECENT WORK & PORTFOLIO",
    port_sub: "Real examples of projects and interventions delivered for small businesses and home users.",
    p1_tag: "Networking & New Office • Timișoara",
    p1_title: "LAN & Wi-Fi infrastructure for a 12-workstation office",
    p1_desc: "Cable duct mounting, Cat6 UTP cabling, RJ45 crimping, switch setup and dual-band Wi-Fi router with guest network separation.",
    p1_meta: "Package used: Full Day & Networking (8 hours)",
    p2_tag: "Hardware Maintenance • Dumbrăvița",
    p2_title: "Optimization and SSD upgrade for 6 workstations",
    p2_desc: "Internal dust cleaning, thermal paste replacement, OS cloning onto new SSDs and automated backup setup for an accounting office.",
    p2_meta: "Package used: On-site Maintenance (4 hours)",
    p3_tag: "Printers & Network • Arad",
    p3_title: "Network multifunction printers configuration",
    p3_desc: "Static IP assignment, scan-to-folder configuration across 8 computers and driver setup for 3 office printers.",
    p3_meta: "Package used: Quick Intervention + Arad travel",
    p4_tag: "Remote Support • Nationwide",
    p4_title: "Malware removal, security hardening & business email",
    p4_desc: "Secure AnyDesk connection, unwanted software cleanup, driver updates and Outlook/Thunderbird configuration for freelancers.",
    p4_meta: "Package used: Remote Support (60 min)",
    prc_title: "ON-DEMAND SERVICES & PRICING", prc_sub: "No monthly subscriptions. Pay only when you need help.",
    pop_tag: "Most popular",
    c1_title: "REMOTE SUPPORT", c1_sub: "/ session up to 60 min (1 PC)", c1_pill: "Remote • 0 lei travel fee",
    c1_f1: "Secure AnyDesk / TeamViewer diagnostics", c1_f2: "Software, drivers & email setup", c1_f3: "Extension: +80 lei / extra hour", c1_f4: "Prepaid via Revolut (@nitaa2saa)", c1_btn: "Request remote",
    c2_title: "QUICK INTERVENTION", c2_sub: "/ up to 2 hours (1–2 PCs)", c2_pill: "Timișoara 0 lei • +100 lei Arad/Lugoj",
    c2_f1: "Arrival within 2–4 hours in Timișoara area", c2_f2: "On-site diagnostics & repair for 1–2 PCs", c2_f3: "Printers & office peripherals setup", c2_f4: "Extra time: +100 lei / hour", c2_btn: "Book 2 hours",
    c3_title: "ON-SITE MAINTENANCE", c3_sub: "/ up to 4 hours (up to 5 PCs)", c3_pill: "Timișoara 0 lei • +100 lei Arad/Lugoj",
    c3_f1: "Hardware cleaning & optimization up to 5 PCs", c3_f2: "Wi-Fi routers, switches & LAN setup", c3_f3: "Data backup & local file sharing setup", c3_f4: "Extra time: +100 lei / hour", c3_btn: "Book 4 hours",
    c4_title: "FULL DAY & NETWORKING", c4_sub: "/ 8-hour day (full office)", c4_pill: "Timișoara 0 lei • +100 lei Arad/Lugoj",
    c4_f1: "Cable ducts, UTP cabling & RJ45 crimping", c4_f2: "Complete LAN, Wi-Fi & workstation setup", c4_f3: "Consumable materials are not included", c4_f4: "Bonus: 1 free Remote Support session", c4_btn: "Book full day",
    term_mat: "<strong>Materials & consumables</strong>Listed prices cover labor only. Cables, RJ45 plugs, cable ducts, sockets or hardware parts must be provided by the client beforehand or paid in advance for purchase against receipt/invoice.",
    term_extra: "<strong>Extra hours & warranty</strong>If work exceeds the chosen package duration, extra hours apply only with your prior consent (+80 lei/h remote, +100 lei/h on-site). All work includes a 30-day labor warranty.",
    bonus_txt: "<strong>8-HOUR PACKAGE BONUS:</strong> Get 1 free Remote Support session (60 min) for follow-up adjustments.",
    est_title: "INTERVENTION ESTIMATOR", est_sub: "Select what you need and get an instant package recommendation and estimate.",
    chk_1: "Remote software / email support (up to 60 min)", tag_1: "80 lei",
    chk_2: "PC diagnostics (1–2 PCs) or printer installation", chk_3: "Optimization up to 5 PCs / Wi-Fi & LAN setup", chk_4: "Cabling, cable ducts, crimping / new office setup",
    zone_grp: "Service area", zone_tm: "Timișoara & surroundings (0 lei travel)", zone_al: "Arad / Lugoj (+100 lei travel fee)",
    pay_grp: "Preferred payment", pay_cash: "Cash",
    rev_title: "Fast Revolut Payment — George Niță (@nitaa2saa)", rev_sub: "Scan the QR code or use the direct link to transfer:", rev_copy: "Copy @nitaa2saa",
    est_rec: "Estimated recommendation (labor):", est_empty: "Select at least one option", est_alert: "Please check at least one option in the estimator.",
    btn_wa_est: "Send via WhatsApp", email_toggle: "Prefer sending your request by email? Click here",
    ph_name: "Your Name / Company", ph_contact: "Email or WhatsApp number", ph_details: "Briefly describe the issue, number of PCs and city...", form_btn: "Send quote request by email",
    info_title: "USEFUL INFO & CONTRACTS", info_sub: "Choose a section for travel areas, legal documents and warranty.",
    tab_1: "Covered areas & Arrival", tab_2: "Contract templates (PDF)", tab_3: "FAQ",
    z1_badge: "FREE TRAVEL (2–4 HOURS)", z1_title: "Timișoara & surroundings", z2_badge: "+100 LEI TRAVEL (MAX. 24H)", z2_title: "Arad & Lugoj",
    z2_desc: "Arad, Lugoj and surrounding villages (one-time transport fee per visit, scheduled within 24 hours).",
    ctr_desc: "Open the template, fill in details directly on screen and save as PDF or print with <strong>Ctrl + P</strong>.",
    ctr_b2b: "Business / B2B Contract", ctr_b2c: "Individual Service & Handover Form",
    q1_t: "How do payments and paperwork work?", q1_d: "We work legally based on a service contract (for both companies and individuals). Payment can be made in cash or via Revolut (@nitaa2saa), followed by a handover report.",
    q2_t: "What is the warranty for the work?", q2_d: "At the end of the intervention we test all equipment together and sign the handover report. All work includes a 30-day workmanship warranty.",
    q3_t: "How does Remote Support (80 lei) work and how long is it?", q3_d: "The 80 lei fee covers a session of up to 60 minutes on 1 PC via AnyDesk or TeamViewer, prepaid via Revolut (@nitaa2saa). Extra time is billed at +80 lei/hour only with your consent.",
    q4_t: "Are materials (cables, plugs, ducts) included?", q4_d: "No, listed prices cover labor only. Required materials must be supplied by the client before the visit or paid in advance for purchase against receipt/invoice.",
    ab_badge: "10+ years of IT experience", ab_title: "George Niță — IT Specialist",
    ab_desc: "I provide small businesses and home users in Timișoara, Arad and Lugoj with fast, transparent IT support without unnecessary monthly subscriptions — covering hardware, networking and software.",
    ab_vcard: "Save contact (0767 231 199)", gdpr_btn: "GDPR Policy"
  },
  fr: {
    pg_home: "Accueil", pg_prices: "Tarifs & Estimateur", pg_contact: "Contrats & Contact",
    rem_bar_txt: "Besoin de <strong>Support à Distance (80 lei / 60 min)</strong> ? Téléchargez :",
    next_prices: "Voir Tarifs & Estimateur →", next_contact: "Voir Contrats & Contact →",
    hero_badge: "Support IT Timișoara, Arad & Lugoj",
    hero_title: "La technologie vous garde dans la <span>bonne direction.</span>",
    hero_sub: "Ordinateurs, réseaux, imprimantes et assistance à distance — rapide, transparent et sans abonnement mensuel, par George Niță.",
    hero_cta1: "Voir Tarifs & Estimateur", hero_email: "Envoyer un E-mail",
    exp_title: "EXPÉRIENCE & GARANTIE",
    exp_sub: "Interventions réalisées avec soin, tests complets avant remise et cadre légal.",
    t1_title: "Plus de 10 ans d'expérience IT",
    t1_desc: "George Niță — spécialiste IT avec plus d'une décennie d'expérience en diagnostic matériel, optimisation Windows, réseaux LAN/Wi-Fi et maintenance.",
    t2_title: "Garantie de 30 jours sur la main-d'œuvre",
    t2_desc: "Chaque intervention est testée avec vous avant remise. Si le même problème réapparaît sous 30 jours, la réparation est gratuite.",
    t3_title: "Intervention sous 2–4h à Timișoara",
    t3_desc: "Pour les urgences à Timișoara et environs, arrivée sous 2–4 heures. Déplacements à Arad et Lugoj planifiés sous 24 heures.",
    port_title: "RÉALISATIONS RÉCENTES & PORTFOLIO",
    port_sub: "Exemples concrets de projets réalisés pour petites entreprises et particuliers.",
    p1_tag: "Réseau & Nouveau Bureau • Timișoara",
    p1_title: "Infrastructure LAN & Wi-Fi pour bureau de 12 postes",
    p1_desc: "Pose de goulottes, câblage Cat6, sertissage RJ45, configuration switch et routeur Wi-Fi double bande avec réseau invités.",
    p1_meta: "Forfait appliqué : Journée Complète & Réseau (8h)",
    p2_tag: "Maintenance Matérielle • Dumbrăvița",
p2_title: "Optimisation et mise à niveau SSD pour 6 postes",
p2_desc: "Nettoyage interne, remplacement pâte thermique, clonage système sur SSD neufs et sauvegarde automatique pour cabinet comptable.",
p2_meta: "Forfait appliqué : Maintenance sur Site (4h)",
p3_tag: "Imprimantes & Réseau • Arad",
p3_title: "Configuration d'imprimantes multifonctions en réseau",
p3_desc: "Attribution d'IP fixes, numérisation vers dossiers partagés sur 8 PC et installation des pilotes pour 3 imprimantes.",
p3_meta: "Forfait appliqué : Intervention Rapide + déplacement Arad",
p4_tag: "Support à Distance • National",
p4_title: "Désinfection, sécurisation et messagerie professionnelle",
p4_desc: "Connexion sécurisée via AnyDesk, suppression logiciels indésirables, mise à jour pilotes et configuration Outlook/Thunderbird.",
p4_meta: "Forfait appliqué : Support à Distance (60 min)",
prc_title: "SERVICES & TARIFS À LA DEMANDE", prc_sub: "Sans abonnement mensuel. Payez uniquement en cas de besoin.",
pop_tag: "Le plus populaire",
c1_title: "SUPPORT À DISTANCE", c1_sub: "/ session jusqu'à 60 min (1 PC)", c1_pill: "À distance • 0 lei déplacement",
c1_f1: "Diagnostic sécurisé AnyDesk / TeamViewer", c1_f2: "Installation logiciels, pilotes et e-mails", c1_f3: "Prolongation : +80 lei / heure supp.", c1_f4: "Paiement d'avance Revolut (@nitaa2saa)", c1_btn: "Demander à distance",
c2_title: "INTERVENTION RAPIDE", c2_sub: "/ jusqu'à 2 heures (1–2 postes)", c2_pill: "Timișoara 0 lei • +100 lei Arad/Lugoj",
c2_f1: "Arrivée sous 2–4h à Timișoara et environs", c2_f2: "Diagnostic et dépannage pour 1–2 PC", c2_f3: "Installation imprimantes et périphériques", c2_f4: "Heure supplémentaire : +100 lei / heure", c2_btn: "Réserver 2 heures",
c3_title: "MAINTENANCE SUR SITE", c3_sub: "/ jusqu'à 4 heures (jusqu'à 5 postes)", c3_pill: "Timișoara 0 lei • +100 lei Arad/Lugoj",
c3_f1: "Nettoyage et optimisation jusqu'à 5 PC", c3_f2: "Configuration routeurs Wi-Fi, switchs et LAN", c3_f3: "Sauvegarde de données et partage de fichiers", c3_f4: "Heure supplémentaire : +100 lei / heure", c3_btn: "Réserver 4 heures",
c4_title: "JOURNÉE COMPLÈTE & RÉSEAU", c4_sub: "/ journée 8h (bureau complet)", c4_pill: "Timișoara 0 lei • +100 lei Arad/Lugoj",
c4_f1: "Goulottes, câblage UTP et sertissage RJ45", c4_f2: "Configuration complète LAN, Wi-Fi et postes", c4_f3: "Matériaux consommables non inclus", c4_f4: "Bonus inclus : 1 session à distance gratuite", c4_btn: "Réserver la journée",
term_mat: "Matériaux et consommablesLes tarifs affichés couvrent uniquement la main-d'œuvre. Câbles, prises RJ45, goulottes ou pièces doivent être fournis par le client avant l'intervention ou payés d'avance sur justificatif.",
term_extra: "Heures supplémentaires et garantieToute prolongation se fait uniquement avec votre accord (+80 lei/h à distance, +100 lei/h sur site). Toutes les interventions bénéficient d'une garantie de 30 jours sur la main-d'œuvre.",
bonus_txt: "BONUS FORFAIT 8 HEURES : Bénéficiez d'une session Support à Distance (60 min) gratuite pour les réglages ultérieurs.",
est_title: "ESTIMATEUR D'INTERVENTION", est_sub: "Cochez vos besoins et obtenez immédiatement une estimation.",
chk_1: "Support logiciel / e-mail à distance (jusqu'à 60 min)", tag_1: "80 lei",
chk_2: "Diagnostic PC (1–2 postes) ou installation imprimante", chk_3: "Optimisation jusqu'à 5 PC / configuration Wi-Fi & LAN", chk_4: "Câblage, goulottes, sertissage / nouveau bureau",
zone_grp: "Zone d'intervention", zone_tm: "Timișoara et environs (0 lei déplacement)", zone_al: "Arad / Lugoj (+100 lei déplacement)",
pay_grp: "Mode de paiement préféré", pay_cash: "Espèces (Cash)",
rev_title: "Paiement rapide Revolut — George Niță (@nitaa2saa)", rev_sub: "Scannez le code QR ou utilisez le lien direct :", rev_copy: "Copier @nitaa2saa",
est_rec: "Recommandation estimée (main-d'œuvre) :", est_empty: "Choisissez au moins une option", est_alert: "Veuillez sélectionner au moins une option dans l'estimateur.",
btn_wa_est: "Envoyer sur WhatsApp", email_toggle: "Vous préférez envoyer par e-mail ? Cliquez ici",
ph_name: "Votre nom / Entreprise", ph_contact: "E-mail ou numéro WhatsApp", ph_details: "Décrivez brièvement le problème, le nombre de PC et la ville...", form_btn: "Envoyer la demande par e-mail",
info_title: "INFOS UTILES & CONTRATS", info_sub: "Sélectionnez une rubrique pour les zones, contrats et garantie.",
tab_1: "Zones couvertes & Délais", tab_2: "Modèles de contrats (PDF)", tab_3: "Questions fréquentes",
z1_badge: "DÉPLACEMENT GRATUIT (2–4H)", z1_title: "Timișoara & environs", z2_badge: "DÉPLACEMENT +100 LEI (MAX. 24H)", z2_title: "Arad & Lugoj",
z2_desc: "Arad, Lugoj et communes voisines (frais de transport uniques par visite, sous 24 heures).",
ctr_desc: "Ouvrez le modèle, remplissez les champs à l'écran et enregistrez en PDF ou imprimez avec Ctrl + P.",
ctr_b2b: "Contrat Entreprises / B2B", ctr_b2c: "Contrat / Procès-Verbal Particuliers",
q1_t: "Comment se font le paiement et les documents ?", q1_d: "Nous travaillons légalement sur la base d'un contrat de prestation de services (entreprises et particuliers). Paiement en espèces ou via Revolut (@nitaa2saa), suivi d'un procès-verbal.",
q2_t: "Quelle est la garantie de l'intervention ?", q2_d: "À la fin de l'intervention, nous testons ensemble tous les équipements et signons le procès-verbal. Garantie de 30 jours sur la main-d'œuvre.",
q3_t: "Comment fonctionne le Support à Distance (80 lei) ?", q3_d: "Le tarif de 80 lei couvre jusqu'à 60 minutes sur 1 PC via AnyDesk ou TeamViewer, payable d'avance via Revolut (@nitaa2saa). Prolongation à +80 lei/h avec votre accord.",
q4_t: "Les matériaux (câbles, prises, goulottes) sont-ils inclus ?", q4_d: "Non, les tarifs couvrent la main-d'œuvre. Les matériaux doivent être fournis par le client avant l'intervention ou payés d'avance sur facture/ticket.",
ab_badge: "Plus de 10 ans d'expérience IT", ab_title: "George Niță — Spécialiste IT",
ab_desc: "J'offre aux petites entreprises et particuliers de Timișoara, Arad et Lugoj un support technique rapide, transparent et sans abonnement mensuel inutile — matériel, réseau et logiciel.",
ab_vcard: "Enregistrer le contact (0767 231 199)", gdpr_btn: "Politique RGPD"
}
};
function setLang(lang, btn) {
currentLang = lang;
localStorage.setItem('lt_lang', lang);
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
if (document.getElementById('estText')) updateEstimate();
}
// 6. INITIALIZARE LIMBĂ & WHATSAPP CU SERVICIU PRE-COMPLETAT
function openWhatsAppChat(message) {
  const encoded = encodeURIComponent(message);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const url = isMobile
    ? 'whatsapp://send?phone=40767231199&text=' + encoded
    : 'https://whatsapp.com' + encoded;
  window.location.href = url;
}

function sendEstimateWhatsApp() {
  if (!currentEstimateSummary) {
    alert(i18n[currentLang].est_alert);
    return;
  }
  openWhatsAppChat(currentEstimateSummary);
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('lt_lang') || 'ro';
  const btn = Array.from(document.querySelectorAll('.lang-btn')).find(b => b.textContent.trim().toLowerCase() === saved);
  if (btn) setLang(saved, btn);

  const greetings = {
    ro: {
      pkg: "Salut George! Doresc să rezerv serviciul: ",
      general: "Salut George! Am o întrebare legată de serviciile IT Lighthouse Tech."
    },
    en: {
      pkg: "Hi George! I would like to book the service: ",
      general: "Hi George! I have a question regarding Lighthouse Tech IT services."
    },
    fr: {
      pkg: "Bonjour George ! Je souhaite réserver le service : ",
      general: "Bonjour George ! J'ai une question concernant les services IT Lighthouse Tech."
    }
  };

  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(link => {
    link.removeAttribute('target');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const dict = greetings[currentLang] || greetings.ro;
      const card = link.closest('.price-card');

      if (card) {
        const title = card.querySelector('h3')?.textContent.trim() || "";
        const price = card.querySelector('.price-val')?.textContent.trim() || "";
        const sub = card.querySelector('.price-sub')?.textContent.trim() || "";
        openWhatsAppChat(`${dict.pkg}${title} (${price} ${sub}).`);
      } else {
        openWhatsAppChat(dict.general);
      }
    });
  });
});
