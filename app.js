class FridgeApp {
    constructor() {
      this.themeToggle = document.getElementById('theme-toggle');
      this.languageSelect = document.getElementById('language-select');
      this.pageTitle = document.getElementById('page-title');
      this.addButton = document.getElementById('add-button');
      this.voiceButton = document.getElementById('voice-button');
      this.itemInput = document.getElementById('item-input');
      this.categoryPicker = document.getElementById('category-picker');
  
      this.draggedItemIndex = null;
      this.awaitingExpireUpdate = null;
  
      this.titles = {
        "en-US": {
          pageTitle: "My Fridge",
          addButton: "Add Item",
          voiceButton: "Voice Input",
          categories: {
            unsorted: "📦 Unsorted",
            dairy: "🥛 Dairy",
            vegetables: "🥦 Vegetables",
            meat: "🍖 Meat"
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
  
      this.recognitionLang = localStorage.getItem('selectedLanguage') || 'sv-SE';
      this.init();
    }
  
    init() {
      this.setupTheme();
      this.setupLanguage();
      this.setupButtons();
      this.loadItems();
      this.setupDragDrop();
    }
  
    setupTheme() {
      if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        this.themeToggle.textContent = '☀️ Light Mode';
        this.setCategoryTextColor('black');
      }
  
      this.themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        this.themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
      });
    }
  
    setCategoryTextColor(color) {
      document.querySelectorAll('.item-name').forEach(name => {
        name.style.color = color;
      });
    }
  
    setupLanguage() {
      this.languageSelect.value = this.recognitionLang;
      this.updateLanguageTexts();
  
      this.languageSelect.addEventListener('change', () => {
        this.recognitionLang = this.languageSelect.value;
        localStorage.setItem('selectedLanguage', this.recognitionLang);
        this.updateLanguageTexts();
      });
    }
  
    updateLanguageTexts() {
      const t = this.titles[this.recognitionLang];
      this.pageTitle.innerHTML = t.pageTitle;
      this.itemInput.placeholder = `${t.addButton}...`;
      this.addButton.textContent = t.addButton;
      this.voiceButton.textContent = t.voiceButton;
  
      document.getElementById('title-unsorted').innerText = t.categories.unsorted;
      document.getElementById('title-dairy').innerText = t.categories.dairy;
      document.getElementById('title-vegetables').innerText = t.categories.vegetables;
      document.getElementById('title-meat').innerText = t.categories.meat;
    }
  
    setupButtons() {
      this.addButton.addEventListener('click', () => this.addItem(this.itemInput.value));
      this.voiceButton.addEventListener('click', () => this.startVoiceRecognition());
    }
  
    startVoiceRecognition() {
      if (!('webkitSpeechRecognition' in window)) {
        alert('Speech Recognition not supported.');
        return;
      }
  
      const recognition = new webkitSpeechRecognition();
      recognition.lang = this.recognitionLang;
      this.voiceButton.classList.add('listening');
      recognition.start();
  
      recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript.trim().toLowerCase();
        transcript = this.wordToNumber(transcript);
  
        const items = this.getItems();
        const match = transcript.match(/^(.+?)\s(\d+)$/); // name + number
  
        if (match) {
          const [_, name, days] = match;
          const existingIndex = items.findIndex(item => item.name.toLowerCase() === name);
          if (existingIndex !== -1) {
            this.updateItemExpiry(existingIndex, parseInt(days));
          } else {
            this.addItem(name, parseInt(days));
          }
        } else {
          this.handleVoiceWithoutDays(transcript, items);
        }
  
        this.voiceButton.classList.remove('listening');
      };
  
      recognition.onerror = () => {
        console.error('Speech recognition error');
        this.voiceButton.classList.remove('listening');
        this.awaitingExpireUpdate = null;
      };
  
      recognition.onend = () => {
        this.voiceButton.classList.remove('listening');
      };
    }
  
    handleVoiceWithoutDays(transcript, items) {
      const existingIndex = items.findIndex(item => item.name.toLowerCase() === transcript);
  
      if (existingIndex !== -1) {
        this.awaitingExpireUpdate = existingIndex;
        alert(
          this.recognitionLang === 'sv-SE'
            ? `Säg antal dagar kvar för ${items[existingIndex].name}`
            : `Say how many days left for ${items[existingIndex].name}`
        );
      } else {
        this.addItem(transcript);
      }
    }
  
    wordToNumber(text) {
      const map = {
        'noll': 0, 'ett': 1, 'en': 1, 'två': 2, 'tre': 3, 'fyra': 4,
        'fem': 5, 'sex': 6, 'sju': 7, 'åtta': 8, 'nio': 9, 'tio': 10,
        'elva': 11, 'tolv': 12, 'tretton': 13, 'fjorton': 14,
        'femton': 15, 'sexton': 16, 'sjutton': 17, 'arton': 18, 'nitton': 19, 'tjugo': 20,
        'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
        'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
        'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14,
        'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20
      };
  
      for (let [word, number] of Object.entries(map)) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        text = text.replace(regex, number);
      }
      return text;
    }
  
    getItems() {
      return JSON.parse(localStorage.getItem('fridgeItems')) || [];
    }
  
    saveItems(items) {
      localStorage.setItem('fridgeItems', JSON.stringify(items));
    }
  
    addItem(name, days = 7) {
      if (!name.trim()) return;
  
      const items = this.getItems();
      const expires = new Date();
      expires.setDate(expires.getDate() + days);
  
      items.push({ name, category: 'unsorted', expires });
      this.saveItems(items);
      this.itemInput.value = '';
      this.loadItems();
    }
  
    updateItemExpiry(index, days) {
      const items = this.getItems();
      if (items[index]) {
        const expires = new Date();
        expires.setDate(expires.getDate() + days);
        items[index].expires = expires;
        this.saveItems(items);
        this.loadItems();
      }
    }
  
    loadItems() {
      const items = this.getItems();
      const today = new Date();
      const filteredItems = items.filter(item => {
        const expiry = new Date(item.expires);
        const diff = (expiry - today) / (1000 * 60 * 60 * 24);
        return diff >= -20;
      });
  
      this.saveItems(filteredItems);
  
      document.querySelectorAll('.category ul').forEach(ul => ul.innerHTML = '');
  
      filteredItems.forEach((item, index) => {
        this.createItemElement(item, index);
      });
    }
  
    createItemElement(item, index) {
      const li = document.createElement('li');
      li.className = 'fridge-item';
      li.setAttribute('draggable', 'true');
      li.dataset.index = index;
  
      const daysLeft = this.calculateDaysLeft(item.expires);
      let bgColor = 'white';
  
      if (daysLeft < 0) {
        bgColor = daysLeft <= -3 ? 'lightblue' : '#a52a2a';
      } else {
        const percent = Math.min(100, (7 - daysLeft) / 7 * 100);
        bgColor = `hsl(${120 - (percent * 1.2)}, 70%, 80%)`;
      }
  
      li.style.backgroundColor = bgColor;
  
      li.innerHTML = `
        <span class="item-name">${item.name}</span>
        <span class="expire" data-index="${index}">(${daysLeft}d)</span>
        <button class="delete-button" data-index="${index}">×</button>
      `;
  
      li.querySelector('.expire').addEventListener('click', (e) => this.editExpireDate(e));
      li.querySelector('.delete-button').addEventListener('click', (e) => this.deleteItem(e));
      li.addEventListener('dragstart', (e) => this.startDrag(e));
      li.addEventListener('dragend', (e) => this.endDrag(e));
      li.addEventListener('touchstart', (e) => this.touchStartDrag(e));
  
      const categoryList = document.querySelector(`#${item.category} ul`);
      if (categoryList) {
        categoryList.appendChild(li);
      }
    }
  
    calculateDaysLeft(dateString) {
      const today = new Date();
      const expiry = new Date(dateString);
      const diffTime = expiry - today;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  
    editExpireDate(event) {
      const index = event.target.dataset.index;
      const newDays = prompt(
        this.recognitionLang === 'sv-SE'
          ? 'Ange nya dagar till utgångsdatum:'
          : 'Enter new days until expiration:',
        '7'
      );
  
      if (newDays) {
        this.updateItemExpiry(index, parseInt(newDays));
      }
    }
  
    deleteItem(event) {
      const index = event.target.dataset.index;
      const items = this.getItems();
      items.splice(index, 1);
      this.saveItems(items);
      this.loadItems();
    }
  
    startDrag(event) {
      this.draggedItemIndex = event.target.dataset.index;
      this.categoryPicker.classList.remove('hidden');
      setTimeout(() => event.target.style.display = "none", 0);
    }
  
    endDrag(event) {
      event.target.style.display = "flex";
      this.categoryPicker.classList.add('hidden');
    }
  
    touchStartDrag(event) {
      this.draggedItemIndex = event.target.closest('.fridge-item').dataset.index;
      this.categoryPicker.classList.remove('hidden');
    }
  
    setupDragDrop() {
      document.querySelectorAll('.category').forEach(category => {
        category.addEventListener('dragover', (e) => e.preventDefault());
        category.addEventListener('drop', (e) => {
          e.preventDefault();
          if (this.draggedItemIndex !== null) {
            this.moveItemToCategory(this.draggedItemIndex, category.id);
            this.draggedItemIndex = null;
            this.categoryPicker.classList.add('hidden');
          }
        });
      });
  
      this.categoryPicker.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
          if (this.draggedItemIndex !== null) {
            this.moveItemToCategory(this.draggedItemIndex, button.dataset.category);
            this.draggedItemIndex = null;
            this.categoryPicker.classList.add('hidden');
          }
        });
      });
    }
  
    moveItemToCategory(index, newCategory) {
      const items = this.getItems();
      if (items[index]) {
        items[index].category = newCategory;
        this.saveItems(items);
        this.loadItems();
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => new FridgeApp());
  