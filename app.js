document.addEventListener('DOMContentLoaded', function () {
    const languageSelect = document.getElementById('language-select');
    const pageTitle = document.getElementById('page-title');
    const addButton = document.getElementById('add-button');
    const voiceButton = document.getElementById('voice-button');
    const itemInput = document.getElementById('item-input');
    const categoryPicker = document.getElementById('category-picker');
  
    const titles = {
      "en-US": {
        pageTitle: "My Fridge",
        addButton: "Add Item",
        voiceButton: "Voice Input",
        categories: {
            unsorted: "📦 Unsorted",
            dairy: "🥛 Dairy",
            vegetables: "🥦 Vegetables",
            meat: "🍖 Meat",
      }
    },
      "sv-SE": {
        pageTitle: "Min Kyl",
        addButton: "Lägg till",
        voiceButton: "Röstinmatning",
        categories: {
            unsorted: "📦 Okategoriserat",
            dairy: "🥛 Mejeri",
            vegetables: "🥦 Grönsaker",
            meat: "🍖 Kött"
          }
        }
    };
  
    let draggedItemIndex = null;
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
        itemInput.placeholder = t.addButton + '...';
        addButton.textContent = t.addButton;
        voiceButton.textContent = t.voiceButton;
      
       
        document.getElementById('title-unsorted').innerHTML = t.categories.unsorted;
        document.getElementById('title-dairy').innerHTML = t.categories.dairy;
        document.getElementById('title-vegetables').innerHTML = t.categories.vegetables;
        document.getElementById('title-meat').innerHTML = t.categories.meat;
    }
      
  
    addButton.addEventListener('click', () => addItem(itemInput.value));
    voiceButton.addEventListener('click', startVoiceRecognition);
  
    function startVoiceRecognition() {
      if (!('webkitSpeechRecognition' in window)) {
        alert('Speech Recognition not supported.');
        return;
      }
  
      const recognition = new webkitSpeechRecognition();
      recognition.lang = recognitionLang;
      voiceButton.classList.add('listening');
  
      recognition.start();
  
      recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        addItem(transcript);
        voiceButton.classList.remove('listening');
      };
  
      recognition.onerror = function (event) {
        console.error('Speech recognition error', event);
        voiceButton.classList.remove('listening');
      };
  
      recognition.onend = function () {
        voiceButton.classList.remove('listening');
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
    }
  
    function addItem(name) {
      if (!name.trim()) return;
  
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
  
      const items = JSON.parse(localStorage.getItem('fridgeItems')) || [];
      items.push({ name, category: 'unsorted', expires });
      localStorage.setItem('fridgeItems', JSON.stringify(items));
  
      itemInput.value = '';
      loadItems();
    }
  
    function createItemElement(item, index) {
      const li = document.createElement('li');
      li.className = 'fridge-item';
      li.setAttribute('draggable', 'true');
      li.dataset.index = index;
  
      const daysLeft = calculateDaysLeft(item.expires);
      let bgColor = 'white';
      if (daysLeft < 0) {
        bgColor = daysLeft <= -3 ? 'lightblue' : '#a52a2a'; // expired 3 days = blue, otherwise brown
      } else {
        const percent = Math.min(100, (7 - daysLeft) / 7 * 100);
        bgColor = `hsl(${120 - (percent * 1.2)}, 70%, 80%)`; // green to red
      }
  
      li.style.backgroundColor = bgColor;
  
      li.innerHTML = `
        ${item.name}
        <span class="expire" data-index="${index}">(${daysLeft}d)</span>
        <button class="delete-button" data-index="${index}">×</button>
      `;
  
      li.querySelector('.expire').addEventListener('click', editExpireDate);
      li.querySelector('.delete-button').addEventListener('click', deleteItem);
  
      li.addEventListener('dragstart', (e) => {
        draggedItemIndex = e.target.dataset.index;
        categoryPicker.classList.remove('hidden');
        setTimeout(() => {
          e.target.style.display = "none";
        }, 0);
      });
  
      li.addEventListener('dragend', (e) => {
        e.target.style.display = "flex";
        categoryPicker.classList.add('hidden');
      });
  
      li.addEventListener('touchstart', (e) => {
        draggedItemIndex = e.target.closest('.fridge-item').dataset.index;
        categoryPicker.classList.remove('hidden');
      });
  
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
      const newDays = prompt(recognitionLang === 'sv-SE' ? 'Ange nya dagar till utgångsdatum:' : 'Enter new days until expiration:', '7');
      if (newDays) {
        const items = JSON.parse(localStorage.getItem('fridgeItems')) || [];
        const expires = new Date();
        expires.setDate(expires.getDate() + parseInt(newDays));
        items[index].expires = expires;
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
  
    // Drop and Picker
    document.querySelectorAll('.category').forEach(category => {
      category.addEventListener('dragover', (e) => e.preventDefault());
  
      category.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItemIndex === null) return;
        moveItemToCategory(draggedItemIndex, category.id);
        draggedItemIndex = null;
        categoryPicker.classList.add('hidden');
      });
    });
  
    categoryPicker.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', (e) => {
        if (draggedItemIndex === null) return;
        moveItemToCategory(draggedItemIndex, button.dataset.category);
        draggedItemIndex = null;
        categoryPicker.classList.add('hidden');
      });
    });
  
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
  