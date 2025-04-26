class FridgeApp {
    constructor() {
      this.elements = {
        themeToggle: document.getElementById('theme-toggle'),
        languageSelect: document.getElementById('language-select'),
        pageTitle: document.getElementById('page-title'),
        addButton: document.getElementById('add-button'),
        voiceButton: document.getElementById('voice-button'),
        itemInput: document.getElementById('item-input'),
        categoryPicker: document.getElementById('category-picker'),
        categoryLists: document.querySelectorAll('.category ul')
      };
  
      this.state = {
        draggedItemIndex: null,
        awaitingExpireUpdate: null,
        recognitionLang: localStorage.getItem('selectedLanguage') || 'sv-SE'
      };
  
      this.texts = {
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
  
      document.addEventListener('DOMContentLoaded', () => this.init());
    }
  
    /** --------------------------- INIT --------------------------- */
    init = () => {
      this.applyTheme();
      this.applyLanguage();
      this.bindUIActions();
      this.loadItems();
    };
  
    /** ----------------------- THEME HANDLING --------------------- */
    applyTheme = () => {
      const theme = localStorage.getItem('theme') || 'light';
      document.body.classList.toggle('dark', theme === 'dark');
      this.elements.themeToggle.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    };
  
    toggleTheme = () => {
      const isDark = document.body.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      this.elements.themeToggle.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    };
  
    /** ---------------------- LANGUAGE HANDLING ------------------- */
    applyLanguage = () => {
      const t = this.texts[this.state.recognitionLang];
      this.elements.languageSelect.value = this.state.recognitionLang;
      this.elements.pageTitle.textContent = t.pageTitle;
      this.elements.addButton.textContent = t.addButton;
      this.elements.voiceButton.textContent = t.voiceButton;
      this.elements.itemInput.placeholder = `${t.addButton}...`;
  
      document.getElementById('title-unsorted').innerText = t.categories.unsorted;
      document.getElementById('title-dairy').innerText = t.categories.dairy;
      document.getElementById('title-vegetables').innerText = t.categories.vegetables;
      document.getElementById('title-meat').innerText = t.categories.meat;
    };
  
    changeLanguage = () => {
      this.state.recognitionLang = this.elements.languageSelect.value;
      localStorage.setItem('selectedLanguage', this.state.recognitionLang);
      this.applyLanguage();
    };
  
    /** ------------------------- BIND UI EVENTS ------------------ */
    bindUIActions = () => {
      this.elements.themeToggle.addEventListener('click', this.toggleTheme);
      this.elements.languageSelect.addEventListener('change', this.changeLanguage);
      this.elements.addButton.addEventListener('click', () => this.addItem(this.elements.itemInput.value));
      this.elements.voiceButton.addEventListener('click', this.startVoiceRecognition);
  
      document.querySelectorAll('.category').forEach(category => {
        category.addEventListener('dragover', (e) => e.preventDefault());
        category.addEventListener('drop', (e) => this.handleDrop(e, category.id));
      });
  
      this.elements.categoryPicker.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => this.handleDrop(null, button.dataset.category));
      });
    };
  
    /** ---------------------- ITEM OPERATIONS -------------------- */
    getItems = () => JSON.parse(localStorage.getItem('fridgeItems')) || [];
  
    saveItems = (items) => localStorage.setItem('fridgeItems', JSON.stringify(items));
  
    loadItems = () => {
      const items = this.getItems().filter(item => this.calculateDaysLeft(item.expires) >= -20);
      this.saveItems(items);
      this.elements.categoryLists.forEach(ul => ul.innerHTML = '');
      items.forEach((item, index) => this.renderItem(item, index));
    };
  
    addItem = (name, days = 7) => {
      if (!name.trim()) return;
      const items = this.getItems();
      const expires = new Date();
      expires.setDate(expires.getDate() + days);
      items.push({ name, category: 'unsorted', expires });
      this.saveItems(items);
      this.elements.itemInput.value = '';
      this.loadItems();
    };
  
    updateExpiry = (index, days) => {
      const items = this.getItems();
      if (items[index]) {
        const expires = new Date();
        expires.setDate(expires.getDate() + days);
        items[index].expires = expires;
        this.saveItems(items);
        this.loadItems();
      }
    };
  
    /** ----------------------- ITEM RENDERING -------------------- */
    renderItem = (item, index) => {
      const li = document.createElement('li');
      li.className = 'fridge-item';
      li.draggable = true;
      li.dataset.index = index;
      const daysLeft = this.calculateDaysLeft(item.expires);
      li.style.backgroundColor = this.getItemColor(daysLeft);
  
      li.innerHTML = `
        <span class="item-name">${item.name}</span>
        <span class="expire" data-index="${index}">(${daysLeft}d)</span>
        <button class="delete-button" data-index="${index}">×</button>
      `;
  
      li.querySelector('.expire').addEventListener('click', (e) => this.promptUpdateDays(e));
      li.querySelector('.delete-button').addEventListener('click', (e) => this.deleteItem(e));
      li.addEventListener('dragstart', (e) => this.startDrag(e));
      li.addEventListener('dragend', (e) => this.endDrag(e));
      li.addEventListener('touchstart', (e) => this.touchStartDrag(e));
  
      document.querySelector(`#${item.category} ul`).appendChild(li);
    };
  
    deleteItem = (event) => {
      const index = event.target.dataset.index;
      const items = this.getItems();
      items.splice(index, 1);
      this.saveItems(items);
      this.loadItems();
    };
  
    promptUpdateDays = (event) => {
      const index = event.target.dataset.index;
      const newDays = prompt(this.state.recognitionLang === 'sv-SE' ? 'Ange nya dagar:' : 'Enter new days:', '7');
      if (newDays) this.updateExpiry(index, parseInt(newDays));
    };
  
    calculateDaysLeft = (dateString) => {
      const today = new Date();
      const expiry = new Date(dateString);
      return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    };
  
    getItemColor = (daysLeft) => {
      if (daysLeft < 0) return daysLeft <= -3 ? 'lightblue' : '#a52a2a';
      const percent = Math.min(100, (7 - daysLeft) / 7 * 100);
      return `hsl(${120 - (percent * 1.2)}, 70%, 80%)`;
    };
  
    /** ------------------- DRAG & DROP LOGIC --------------------- */
    startDrag = (event) => {
      this.state.draggedItemIndex = event.target.dataset.index;
      this.elements.categoryPicker.classList.remove('hidden');
      setTimeout(() => event.target.style.display = "none", 0);
    };
  
    endDrag = (event) => {
      event.target.style.display = "flex";
      this.elements.categoryPicker.classList.add('hidden');
    };
  
    touchStartDrag = (event) => {
      this.state.draggedItemIndex = event.target.closest('.fridge-item').dataset.index;
      this.elements.categoryPicker.classList.remove('hidden');
    };
  
    handleDrop = (event, newCategory) => {
      if (this.state.draggedItemIndex !== null) {
        const items = this.getItems();
        items[this.state.draggedItemIndex].category = newCategory;
        this.saveItems(items);
        this.loadItems();
        this.state.draggedItemIndex = null;
        this.elements.categoryPicker.classList.add('hidden');
      }
    };
  
    /** -------------------- VOICE RECOGNITION -------------------- */
    startVoiceRecognition = () => {
      if (!('webkitSpeechRecognition' in window)) {
        alert('Speech Recognition not supported.');
        return;
      }
  
      const recognition = new webkitSpeechRecognition();
      recognition.lang = this.state.recognitionLang;
      this.elements.voiceButton.classList.add('listening');
      recognition.start();
  
      recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript.trim().toLowerCase();
        transcript = this.convertWordsToNumbers(transcript);
        this.processVoiceCommand(transcript);
        this.elements.voiceButton.classList.remove('listening');
      };
  
      recognition.onerror = recognition.onend = () => {
        this.elements.voiceButton.classList.remove('listening');
        this.state.awaitingExpireUpdate = null;
      };
    };
  
    processVoiceCommand = (transcript) => {
      const items = this.getItems();
      const match = transcript.match(/^(.+?)\s(\d+)$/);
  
      if (match) {
        const [_, name, days] = match;
        const existing = items.findIndex(item => item.name.toLowerCase() === name);
        existing !== -1 ? this.updateExpiry(existing, parseInt(days)) : this.addItem(name, parseInt(days));
      } else {
        this.handlePartialVoice(transcript, items);
      }
    };
  
    handlePartialVoice = (transcript, items) => {
      const existing = items.findIndex(item => item.name.toLowerCase() === transcript);
      if (existing !== -1) {
        this.state.awaitingExpireUpdate = existing;
        alert(this.state.recognitionLang === 'sv-SE'
          ? `Säg antal dagar kvar för ${items[existing].name}`
          : `Say how many days left for ${items[existing].name}`);
      } else {
        this.addItem(transcript);
      }
    };
  
    convertWordsToNumbers = (text) => {
      const map = {
        'noll': 0, 'ett': 1, 'en': 1, 'två': 2, 'tre': 3, 'fyra': 4,
        'fem': 5, 'sex': 6, 'sju': 7, 'åtta': 8, 'nio': 9, 'tio': 10,
        'elva': 11, 'tolv': 12, 'tretton': 13, 'fjorton': 14, 'femton': 15,
        'sexton': 16, 'sjutton': 17, 'arton': 18, 'nitton': 19, 'tjugo': 20,
        'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11,
        'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
        'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
        'twenty': 20
      };
  
      for (const [word, num] of Object.entries(map)) {
        text = text.replace(new RegExp(`\\b${word}\\b`, 'gi'), num);
      }
      return text;
    };
  }
  
  // Launch the App
  new FridgeApp();
  