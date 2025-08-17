// ✅ 1. CONNECTION WITH FIREBASE

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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

const resultsContainer = document.getElementById("resultsContainer");
const alphabetContainer = document.getElementById("alphabetContainer");
const resultUpperContainer = document.getElementById("resultUpperContainer");

// ✅ 2. FETCH NAMES FOR MAIN SECTION (cards)
async function fetchNames() {
  try {
    const card = document.getElementById("namesSection");
    // const loader = document.getElementsById("loading-spinner");
    const resultsSection = document.getElementById("resultsContainer"); 
    const resultUpper = document.getElementById("resultUpperContainer");

    if (!card || !loader || !resultsSection || !resultUpper) {
      console.error("Required elements not found");
      return;
    }

    resultsSection.style.display = "none";
    alphabetContainer.style.display = "none";

    // Fetch data
    const names = await getDocs(collection(db, "names"));

    // End: hide loader, show results, set large height
    // loader.style.display = "none";
    document.getElementsByClassName("loader")[0].style.display = "none";
    resultsSection.style.display = "block";
    alphabetContainer.style.display = "block";

    // Render cards
    names.forEach((name) => {
      const { name_en, name_ur, meaning_en, meaning_ur } = name.data();

      card.innerHTML += `
        <div class="name-card">
          <div class="accordion-toggle">
            <h2 class="name">${name_en}</h2>
            <p class="meaning">${meaning_en}</p>
            <hr />
            <span class="ur_content" dir="rtl">
              <h2 class="name">${name_ur}</h2>
              <p class="meaning">${meaning_ur}</p>
            </span>
          </div>
          <a class="details-btn" id="${name.id}" href="htmls/nameDetails.html?id=${name.id}">More Details</a>
        </div>`;
    });
  } catch (error) {
    console.error("Error fetching names:", error);
}
}
fetchNames();


// ✅ 3. SEARCH FUNCTIONALITY
const namesArray = [];

async function loadNamesToArray() {
  try {
    const snapshot = await getDocs(collection(db, "names"));
    snapshot.forEach((doc) => {
      const data = doc.data();
      namesArray.push({
        id: doc.id,
        name_en: data.name_en.toLowerCase(),
        name_ur: data.name_ur.toLowerCase(),
        meaning_en: data.meaning_en,
        meaning_ur: data.meaning_ur,
      });
    });
  } catch (error) {
    console.error("Error loading names for search:", error);
  }
}
await loadNamesToArray(); // load data at start

const resultsList = document.getElementById("resultsList");
const searchInput = document.getElementById("searchInput");

if (resultsList && searchInput) {
  searchInput.addEventListener("keyup", function () {
    const searchValue = this.value.toLowerCase();
    resultsList.innerHTML = "";

    if (searchValue) {
      const filtered = namesArray.filter((item) =>
        item.name_en.includes(searchValue) || item.name_ur.includes(searchValue)
      );

      filtered.forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.textContent = `${item.name_en} | ${item.name_ur}`;
        a.className = 'details-btn';
        a.href = `htmls/nameDetails.html?id=${item.id}`;
        li.appendChild(a);
        resultsList.appendChild(li);

        
      });

      if (filtered.length === 0) {
        resultsList.innerHTML = "<li>No names found</li>";
      }
    }else {
      fetchAllNames();
    }
  });
}

// ✅ 4. SEARCH FUNCTIONALITY ALL NAMES PAGE
const namesCard = document.getElementById("resultsContainer");
const allNamesSearchInput = document.getElementById("allNamesSearchInput");

if (namesCard && allNamesSearchInput) {
  allNamesSearchInput.addEventListener("keyup", function () {
    const searchValue = this.value.toLowerCase();
    namesCard.innerHTML = "";
    
    if (searchValue) {
      const filtered = namesArray.filter((item) =>
        item.name_en.includes(searchValue) || item.name_ur.includes(searchValue)
    );
    
    if (filtered.length === 0) {
      namesCard.innerHTML = `<h2><p class="name-card">No names found for "<strong>${searchValue}</strong>".</p></h2>`;
        return;
      }

      filtered.forEach((item) => {
        const card = document.createElement("div");
        card.className = "name-card";
        card.innerHTML = `
        <h2 class="name">${item.name_en}</h2> |
        <span class="ur_content" dir="rtl">
        <h2 class="name">${item.name_ur}</h2>
        </span>
        <a class="details-btn" id="${item.id}" href="/htmls/nameDetails.html?id=${item.id}">More Details</a>
        `;
        namesCard.appendChild(card);
      });
      
    } else {
      document.getElementById('alphabetContainer').style.display = 'none'
      fetchAllNames();
    }
  });
}


// ✅ 5. FETCH & DISPLAY ALL NAMES IN A SECTION

async function fetchAllNames() {
  try {
    const names = await getDocs(collection(db, "names"));
    const namesCard = document.getElementById("resultsContainer");
    namesCard.innerHTML = "";

    names.forEach((doc) => {
      const data = doc.data();
      namesCard.innerHTML += `
        <div class="name-card">
          <h2 class="name">${data.name_en}</h2> |
          <span class="ur_content" dir="rtl">
            <h2 class="name">${data.name_ur}</h2>
          </span>
          <a class="details-btn" id="${doc.id}" href="/htmls/nameDetails.html?id=${doc.id}" >More Details</a>
        </div>`;
    });
  } catch (error) {
    console.error("Error fetching all names:", error);
  }
}
fetchAllNames();

// ✅ 6. HANDLE CLICK ON DETAILS BUTTON

const detailsBtn = document.querySelectorAll(".name card");
detailsBtn.forEach(btn => {
  btn.addEventListener("click", function (event) {
    if (event.target.classList.contains("details-btn")) {
      const nameId = event.target.getAttribute("id");
      if (nameId) {
        window.location.href = `../htmls/nameDetails.html?id=${nameId}`;
      }
    }
  });
});


// ✅ 7. ALPHABET FILTERING



const allBtn = document.createElement("button");
allBtn.textContent = "All";
allBtn.className = "alphabet-btn";
allBtn.addEventListener("click", () => fetchAllNames());
alphabetContainer.appendChild(allBtn);

// A-Z buttons generate karo
for (let i = 65; i <= 90; i++) {
  const letter = String.fromCharCode(i);
  const button = document.createElement("button");
  button.textContent = letter;
  button.className = "alphabet-btn";
  button.addEventListener("click", () => filterNamesByAlphabet(letter));
  alphabetContainer.appendChild(button);
}

// Filter function
function filterNamesByAlphabet(letter) {
  resultsContainer.innerHTML = "";

  const filtered = namesArray.filter((item) =>
    item.name_en.toUpperCase().startsWith(letter)
  );

  if (filtered.length === 0) {
    resultsContainer.innerHTML = `<h2><p class="name-card">No names found for "<strong>${letter}</strong>".</p></h2>`;
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement("div");
    card.className = "name-card";
    card.innerHTML = `
      <h2 class="name">${item.name_en}</h2> |
      <span class="ur_content" dir="rtl">
      <h2 class="name">${item.name_ur}</h2>
      </span>
      <a class="details-btn" id="${item.id}" href="/htmls/nameDetails.html?id=${item.id}">More Details</a>
    `;
    resultsContainer.appendChild(card);
  });
}
