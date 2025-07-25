


















// // allnames.js
// // Render all names in a column/list view with search and language support

// document.addEventListener('DOMContentLoaded', () => {
//   const allNamesList = document.getElementById('namesContainer');
//   const searchInput = document.getElementById('searchInput');
//   const toggleLangSelect = document.getElementById('toggleLang');
//   let namesData = [];
//   let currentLang = localStorage.getItem('lang') || 'en';

//   // Set select value on page load
//   if (toggleLangSelect) {
//     toggleLangSelect.value = currentLang;
//   }

//   // Restore scroll position if available
//   const scrollY = localStorage.getItem('allNamesScroll');
//   if (scrollY) {
//     setTimeout(() => {
//       window.scrollTo(0, parseInt(scrollY, 10));
//       localStorage.removeItem('allNamesScroll');
//     }, 100);
//   }

//   // Fetch names from JSON
//   fetch('../json/names.json')
//     .then(res => res.json())
//     .then(data => {
//       namesData = data;
//       renderAllNames(namesData);
//     });

//   // Render all names in a column/list
//   function renderAllNames(names) {
//     allNamesList.innerHTML = '';
//     if (names.length === 0) {
//       allNamesList.innerHTML = currentLang === 'en' ? '<p>No names found.</p>' : '<p>کوئی نام نہیں ملا۔</p>';
//       return;
//     }
//     const ul = document.createElement('ul');
//     ul.className = 'all-names-ul';
//     names.forEach(name => {
//       const li = document.createElement('li');
//       li.className = 'all-names-li';
//       li.innerHTML = `
//        <div class="name-card">
//         <div class="accordion-toggle">
//             <h2 class="name">${name.name_en}</h2>
//         </div>
//         <div class="accordion-content">
//           <p class="meaning">${name.meaning_en}</p>
//           <button class="details-btn" data-id="${name.id}">More Details</button>
//         </div>
//       </div>`;
//       // Set flag for back navigation
//       li.querySelector('.details-btn').addEventListener('click', function() {
//         localStorage.setItem('fromAllNamesList', 'true');
//       });
//       ul.appendChild(li);
//     });
//     allNamesList.appendChild(ul);
//   }

//   // Search functionality
//   searchInput.addEventListener('input', function() {
//     const filter = this.value.toLowerCase();
//     const filtered = namesData.filter(name =>
//       name.name_en.toLowerCase().includes(filter) ||
//       name.name_ur.includes(filter) ||
//       name.meaning_en.toLowerCase().includes(filter) ||
//       name.meaning_ur.includes(filter)
//     );
//     renderAllNames(filtered);
//   });

//   // Language toggle event for <select>
//   if (toggleLangSelect) {
//     toggleLangSelect.addEventListener('change', function() {
//       currentLang = this.value;
//       localStorage.setItem('lang', currentLang);
//       renderAllNames(namesData);
//       setLanguage(currentLang);
//     });
//   }

//   // Theme dropdown
//   document.querySelectorAll('.theme-option').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const theme = btn.getAttribute('data-theme');
//       if (theme === 'dark') {
//         document.body.classList.add('dark-mode');
//         localStorage.setItem('theme', 'dark');
//       } else {
//         document.body.classList.remove('dark-mode');
//         localStorage.setItem('theme', 'light');
//       }
//     });
//   });

//   // Hamburger menu
//   const navToggle = document.getElementById('navToggle');
//   const navLinks = document.querySelector('.nav-links');
//   navToggle.addEventListener('click', () => {
//     navLinks.classList.toggle('open');
//   });

//   // Set language on page load
//   function setLanguage(lang) {
//     // Change logo
//     const logo = document.querySelector('.logo');
//     logo.textContent = lang === 'en' ? logo.getAttribute('data-en') : logo.getAttribute('data-ur');
//     // Change search placeholder
//     searchInput.placeholder = lang === 'en' ? 'Search Names' : 'نام تلاش کریں';
//     // Change footer
//     const footerP = document.querySelector('footer p');
//     footerP.textContent = lang === 'en' ? footerP.getAttribute('data-en') : footerP.getAttribute('data-ur');
//   }

//   // On page load, set theme
//   if (localStorage.getItem('theme') === 'dark') {
//     document.body.classList.add('dark-mode');
//   }

//   // Alphabet filter functionality
//   const alphabetButtons = document.querySelectorAll('.alphabet-btn');
//   if (alphabetButtons.length > 0) {
//     alphabetButtons.forEach(btn => {
//       btn.addEventListener('click', function() {
//         const letter = this.getAttribute('data-letter');
//         let filtered;
//         if (currentLang === 'ur') {
//           filtered = namesData.filter(name => {
//             // Remove whitespace and normalize for Urdu
//             const urName = (name.name_ur || '').replace(/\s/g, '').normalize('NFC');
//             const urLetter = (letter || '').replace(/\s/g, '').normalize('NFC');
//             return urName.startsWith(urLetter);
//           });
//         } else {
//           filtered = namesData.filter(name => name.name_en.toLowerCase().startsWith(letter.toLowerCase()));
//         }
//         renderAllNames(filtered);
//       });
//     });
//   }
// });
