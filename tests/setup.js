// Mock localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// Mock SpeechRecognition
class SpeechRecognitionMock {
  constructor() {
    this.lang = '';
    this.onresult = null;
    this.onerror = null;
    this.onend = null;
  }

  start() {
    // This will be overridden in tests
  }
}

// Set up global mocks
global.localStorage = new LocalStorageMock();
global.webkitSpeechRecognition = SpeechRecognitionMock;

// Mock DOM elements
document.body.innerHTML = `
<h1 id="page-title">Min Kyl</h1>
<div class="input-section">
  <select id="language-select">
    <option value="sv-SE">🇸🇪 Svenska</option>
    <option value="en-US">🇬🇧 English</option>
  </select>
  <input type="text" id="item-input" placeholder="Lägg till kylvara...">
  <button id="add-button">➕ Lägg till</button>
  <button id="voice-button">🎤 Säg vara</button>
  <button id="theme-toggle">🌙 Dark Mode</button> 
</div>
<div id="fridge-container">
  <div class="category" id="unsorted">
    <h2 id="title-unsorted">📦 Okategoriserat</h2>
    <ul></ul>
  </div>
  <div class="category" id="dairy">
    <h2 id="title-dairy">🥛 Mejeri</h2>
    <ul></ul>
  </div>
  <div class="category" id="vegetables">
    <h2 id="title-vegetables">🥦 Grönsaker</h2>
    <ul></ul>
  </div>
  <div class="category" id="meat">
    <h2 id="title-meat">🍖 Kött</h2>
    <ul></ul>
  </div>
</div>
<div id="category-picker" class="hidden">
  <button data-category="unsorted">📦</button>
  <button data-category="dairy">🥛</button>
  <button data-category="vegetables">🥦</button>
  <button data-category="meat">🍖</button>
</div>
`;

// Mock Date for consistent testing
const FIXED_DATE = new Date('2023-01-01T12:00:00Z');
const OriginalDate = global.Date;
global.Date = class extends OriginalDate {
  constructor(...args) {
    if (args.length === 0) {
      super(FIXED_DATE);
      return;
    }
    super(...args);
  }
};

// Helper to trigger DOM events
global.triggerEvent = (element, eventName) => {
  const event = document.createEvent('HTMLEvents');
  event.initEvent(eventName, true, false);
  element.dispatchEvent(event);
};

// Helper to simulate speech recognition result
global.simulateSpeechResult = (app, transcript) => {
  const recognitionInstance = new webkitSpeechRecognition();
  app.elements.voiceButton.classList.add('listening');
  
  // Override the start method to immediately trigger a result
  recognitionInstance.start = function() {
    if (this.onresult) {
      const mockEvent = {
        results: [
          [
            {
              transcript: transcript,
              confidence: 0.9
            }
          ]
        ]
      };
      this.onresult(mockEvent);
    }
    
    if (this.onend) {
      this.onend();
    }
  };
  
  // Replace the original method with our mock
  const originalStartVoiceRecognition = app.startVoiceRecognition;
  app.startVoiceRecognition = function() {
    this.elements.voiceButton.classList.add('listening');
    app.processVoiceCommand(transcript);
    this.elements.voiceButton.classList.remove('listening');
  };
  
  // Trigger the voice button click
  app.elements.voiceButton.click();
  
  // Restore the original method
  app.startVoiceRecognition = originalStartVoiceRecognition;
};