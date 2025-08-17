import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBi79vA2god6khEWReMp2oUyUN_9ojkKA8",
  authDomain: "islamic-names-website.firebaseapp.com",
  projectId: "islamic-names-website",
  storageBucket: "islamic-names-website.firebasestorage.app",
  messagingSenderId: "1047190063212",
  appId: "1:1047190063212:web:8ae012321185e15c457049",
  measurementId: "G-E2X1E5YRZC",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elements
const spinner = document.getElementById("loading-spinner");
const container = document.getElementById("nameDetailsContainer");
const content = document.getElementById("content");
const btnEn = document.getElementById("btn-en");
const btnUr = document.getElementById("btn-ur");
const btnBoth = document.getElementById("btn-both");
const btnPdf = document.getElementById("btn-pdf");

let record = null; // Firestore data will be stored here

const labels = {
  en: {
    id: "ID",
    name: "Name",
    alt: "Alternative Spellings",
    meaning: "Meaning",
    gender: "Gender",
    origin: "Origin",
    quranic: "Quranic",
    related: "Related Names",
    pronunciation: "Pronunciation",
    reference: "Islamic Reference",
    description: "Note",
  },
  ur: {
    id: "آئی ڈی",
    name: "نام",
    alt: "متبادل ہجّے",
    meaning: "معنی",
    gender: "جنس",
    origin: "ماخذ",
    quranic: "قرآنی نسبت",
    related: "متعلقہ نام",
    pronunciation: "ادائیگی",
    reference: "اسلامی حوالہ",
    description: "نوٹ",
  },
};


// Async function to load Firestore data and use it in the card
async function loadNameDetails() {
  const params = new URLSearchParams(window.location.search);
  const nameId = params.get("id");

  if (nameId) {
    const docRef = doc(db, "names", nameId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (docSnap.exists()) {
          record = docSnap.data();
          setPressed(btnBoth);
          render("both");
          spinner.style.display = "none";
          container.style.display = "block";
          document.querySelector(".footer-bottom").style.display = "block";
        }
      } else {
        spinner.innerHTML = "<h2>کوئی ریکارڈ نہیں ملا</h2>";
      }
    } catch (error) {
      setTimeout(() => {
        console.error("Error loading document:", error);
        spinner.style.display = "none";
        const errorMessage = document.getElementById('errorMessage')
        errorMessage.style.display = "block";
        errorMessage.innerHTML = "<h3>🚫Something went wrong🚫</h3>"
      }, 5000);
    }
  } else {
    document.body.innerHTML = "<h2>URL میں کوئی ID موجود نہیں</h2>";
  }
}

// Load data
loadNameDetails();

function row(label, value) {
  return `<div class="row"><div class="label">${label}</div><div class="value">${value}</div></div>`;
}
function list(items) {
  if (!Array.isArray(items)) return "<ul><li>—</li></ul>";
  return `<ul>${items.map((i) => `<li> ${i}</li>`).join("")}</ul>`;
}

function column(lang) {
  if (!record) return "";
  const L = labels[lang];
  const rtlClass = lang === "ur" ? "rtl" : "";
  const isQ =
    lang === "en" ? record.is_quranic_en || [] : record.is_quranic_ur || [];
  const name = lang === "en" ? record.name_en || [] : record.name_ur || [];
  const alt =
    lang === "en"
      ? record.alternative_spellings_en || []
      : record.alternative_spellings_ur || [];
  const meaning =
    lang === "en" ? record.meaning_en || [] : record.meaning_ur || [];
  const related =
    lang === "en"
      ? record.related_names_en || []
      : record.related_names_ur || [];
  const gender =
    lang === "en" ? record.gender_en || [] : record.gender_ur || [];
  const origin =
    lang === "en" ? record.origin_en || [] : record.origin_ur || [];
  const pron =
    lang === "en"
      ? record.pronunciation_en || []
      : record.pronunciation_ur || [];
  const ref =
    lang === "en"
      ? record.islamic_reference_en || []
      : record.islamic_reference_ur || [];
  const desc =
    lang === "en" ? record.description_en || [] : record.description_ur || [];

  return `
    <section class="column ${rtlClass}" lang="${lang}" dir="${lang === "ur" ? "rtl" : "ltr"
    }">
      <div class="name">
        <h2>${name}</h2>
        <span class="badge">Islam4Everyone.com</span>
      </div>
      <div class="meta">
        <span class="chip">${lang === "en" ? "Language: English" : "زبان: اردو"
    }</span>
      </div>
      ${row(L.meaning, meaning)}
      ${row(L.pronunciation, pron)}
      ${row(L.origin, origin)}
      ${row(L.gender, gender)}
      ${row(L.quranic, isQ)}
      ${row(L.alt, list(alt))}
      ${row(L.related, list(related))}
      ${row(L.reference, ref)}
      ${row(L.description, desc)}
    </section>
  `;
}

function setPressed(target) {
  [btnEn, btnUr, btnBoth].forEach((b) =>
    b.setAttribute("aria-pressed", "false")
  );
  target.setAttribute("aria-pressed", "true");
}

function render(mode) {
  if (!record) return;
  if (mode === "en") {
    content.className = "grid";
    content.innerHTML = column("en");
    document.documentElement.setAttribute("lang", "en");
    document.documentElement.setAttribute("dir", "ltr");
  } else if (mode === "ur") {
    content.className = "grid";
    content.innerHTML = column("ur");
    document.documentElement.setAttribute("lang", "ur");
    document.documentElement.setAttribute("dir", "rtl");
  } else {
    content.className = "grid two";
    content.innerHTML = column("en") + column("ur");
    document.documentElement.setAttribute("lang", "en");
    document.documentElement.setAttribute("dir", "ltr");
  }
}

btnEn.addEventListener("click", () => {
  setPressed(btnEn);
  render("en");
});
btnUr.addEventListener("click", () => {
  setPressed(btnUr);
  render("ur");
});
btnBoth.addEventListener("click", () => {
  setPressed(btnBoth);
  render("both");
});

// 📄 Download PDF Button
btnPdf.addEventListener("click", () => {
  if (!record) return alert("Data not loaded yet!");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;

  function addElementToPDF(element, isFirstPage) {
    const clone = element.cloneNode(true);
    clone.style.width = "950px";
    clone.style.maxWidth = "1000px";
    clone.style.margin = "0";
    document.body.appendChild(clone);

    return html2canvas(clone, {
      backgroundColor:
        getComputedStyle(document.body).backgroundColor || "#ffffffff",
      scale: 2,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      document.body.removeChild(clone);
      const imgData = canvas.toDataURL("image/png");
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;

      let imgWidth = maxWidth;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      if (imgHeight > maxHeight) {
        imgHeight = maxHeight;
        imgWidth = (canvas.width * imgHeight) / canvas.height;
      }
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
      if (!isFirstPage) pdf.addPage();
      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    });
  }

  const columns = document.querySelectorAll("#content .column");
  if (columns.length > 1) {
    addElementToPDF(columns[0], true)
      .then(() => addElementToPDF(columns[1], false))
      .then(() => pdf.save(`${record.name_en || record.name_ur}.pdf`));
  } else {
    addElementToPDF(columns[0], true).then(() =>
      pdf.save(`${record.name_en || record.name_ur}.pdf`)
    );
  }
});
