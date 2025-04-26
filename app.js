document.addEventListener('DOMContentLoaded', function () {
    const languageSelect = document.getElementById('language-select');
    const pageTitle = document.getElementById('page-title');
    const addButton = document.getElementById('add-button');
    const voiceButton = document.getElementById('voice-button');
    const itemInput = document.getElementById('item-input');
    let draggedItem = null;
  
    const titles = {
      "en-US": {
        pageTitle: "🥶 My NOT Smart Fridge (EN)",
        placeholder: "Add fridge item...",
        addButton: "➕ Add Item",
        voiceButton: "🎤 Speak Item",
        unsorted: "📦 Uncategorized",
        dairy: "🥛 Dairy",
        vegetables: "🥦 Vegetables",
        meat: "🍖 Meat",
      },
      "sv-SE": {
        pageTitle: "🥶 Min INTE Smarta Kyl (SE)",
        placeholder: "Lägg till kylvara...",
        addButton: "➕ Lägg till",
        voiceButton: "🎤 Säg vara",
        unsorted: "📦 Okategoriserat",
        dairy: "🥛 Mejeri",
        vegetables: "🥦 Grönsaker",
        meat: "🍖 Kött",
      }
    };
  
    let recognitionLang = localStorage.getItem('selectedLanguage') || 'sv-SE';
    languageSelect.value = recognitionLang;
    updateLanguageTexts();
  
    languageSelect.addEventListener('change', () => {
      recognitionLang = languageSelect.value;
      localStorage.setItem('selectedLanguage', recognitionLang);
      updateLanguageTexts();
    });
  
    function updateLanguageTexts() {
      const t = titles[recognitionLang];
      pageTitle.innerHTML = t.pageTitle;
      itemInput.placeholder = t.placeholder;
      addButton.textContent = t.addButton;
      voiceButton.textContent = t.voiceButton;
      document.getElementById('title-unsorted').innerText = t.unsorted;
      document.getElementById('title-dairy').innerText = t.dairy;
      document.getElementById('title-vegetables').innerText = t.vegetables;
      document.getElementById('title-meat').innerText = t.meat;
    }
  
    addButton.addEventListener('click', () => {
      addItem(itemInput.value);
    });
  
    voiceButton.addEventListener('click', startVoiceRecognition);
  
    function startVoiceRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Speech Recognition not supported.');
        return;
      }
  
      const recognition = new SpeechRecognition();
      recognition.lang = recognitionLang;
      recognition.start();
  
      recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        addItem(transcript);
      };
  
      recognition.onerror = function (event) {
        console.error('Speech recognition error', event);
      };
    }
  
    function loadItems() {
      const items = JSON.parse(localStorage.getItem('fridgeItems')) || [];
      const today = new Date();
  
      const filteredItems = items.filter(item => {
        const expiry = new Date(item.expires);
        const diff = (expiry - today) / (1000 * 60 * 60 * 24);
        return diff >= -20;
      });
  
      localStorage.setItem('fridgeItems', JSON.stringify(filteredItems));
  
      document.querySelectorAll('.category ul').forEach(ul => ul.innerHTML = '');
  
      filteredItems.forEach((item, index) => {
        createItemElement(item, index);
      });
  
      setupDragAndDrop();
    }
  
    function addItem(name) {
      if (!name.trim()) return;
  
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
  
      const items = JSON.parse(localStorage.getItem('fridgeItems')) || [];
      items.push({ id: Date.now(), name, category: 'unsorted', expires: expires.toISOString() });
      localStorage.setItem('fridgeItems', JSON.stringify(items));
  
      itemInput.value = '';
      loadItems();
    }
  
    function createItemElement(item, index) {
      const li = document.createElement('li');
      li.className = 'fridge-item';
      li.setAttribute('draggable', 'true');
      li.dataset.index = index;
      li.innerHTML = `
        ${item.name}
        <span class="expire" data-index="${index}">(${calculateDaysLeft(item.expires)} days left)</span>
        <button class="delete-button" data-index="${index}">×</button>
      `;
  
      const daysLeft = calculateDaysLeft(item.expires);
      if (daysLeft > 5) {
        li.classList.add('green');
      } else if (daysLeft > 2) {
        li.classList.add('yellow');
      } else {
        li.classList.add('red');
      }
  
      li.querySelector('.expire').addEventListener('click', editExpireDate);
      li.querySelector('.delete-button').addEventListener('click', deleteItem);
      li.addEventListener('dragstart', dragStart);
  
      const categoryList = document.querySelector(`#${item.category} ul`);
      if (categoryList) {
        categoryList.appendChild(li);
      }
    }
  
    function calculateDaysLeft(dateString) {
      const today = new Date();
      const expiry = new Date(dateString);
      const diffTime = expiry - today;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  
    function editExpireDate(event) {
      const index = event.target.dataset.index;
      const newDays = prompt(recognitionLang === 'sv-SE' ? 'Ange nya dagar tills utgångsdatum:' : 'Enter new days until expiration:', '7');
      if (newDays) {
        const items = JSON.parse(localStorage.getItem('fridgeItems')) || [];
        const expires = new Date();
        expires.setDate(expires.getDate() + parseInt(newDays));
        items[index].expires = expires.toISOString();
        localStorage.setItem('fridgeItems', JSON.stringify(items));
        loadItems();
      }
    }
  
    function deleteItem(event) {
      const index = event.target.dataset.index;
      const items = JSON.parse(localStorage.getItem('fridgeItems')) || [];
      items.splice(index, 1);
      localStorage.setItem('fridgeItems', JSON.stringify(items));
      loadItems();
    }
  
    function dragStart(e) {
      draggedItem = e.target;
    }
  
    function setupDragAndDrop() {
      document.querySelectorAll('.category ul').forEach(ul => {
        ul.addEventListener('dragover', (e) => e.preventDefault());
        ul.addEventListener('drop', (e) => {
          e.preventDefault();
          const categoryId = e.target.closest('.category').id;
          if (draggedItem && categoryId) {
            moveItemToCategory(draggedItem.dataset.index, categoryId);
          }
        });
      });
    }
  
    function moveItemToCategory(index, newCategory) {
      const items = JSON.parse(localStorage.getItem('fridgeItems')) || [];
      if (items[index]) {
        items[index].category = newCategory;
        localStorage.setItem('fridgeItems', JSON.stringify(items));
        loadItems();
      }
    }
  
    loadItems();
  });
  