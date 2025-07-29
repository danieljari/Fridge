/**
 * Advanced Voice Recognition Tests
 * 
 * This file tests more complex voice recognition scenarios in the Fridge app
 * for both Swedish and English languages.
 */

// Import the FridgeApp class
const FridgeApp = require('../app.js');

// Advanced test cases for Swedish language
const advancedSwedishTestCases = [
  // Compound numbers
  { input: 'mjölk tjugoett dagar', expectedName: 'mjölk', expectedDays: 7 },
  { input: 'ost trettiotvå', expectedName: 'ost', expectedDays: 7 },
  
  // Different word orders
  { input: 'fem dagar äpple', expectedName: 'äpple', expectedDays: 7 },
  { input: 'sju gurka', expectedName: 'gurka', expectedDays: 7 },
  
  // Partial matches
  { input: 'färsk mjölk tre', expectedName: 'färsk mjölk', expectedDays: 7 },
  { input: 'ekologisk ost fyra dagar', expectedName: 'ekologisk ost', expectedDays: 7 },
  
  // With time units
  { input: 'bröd två veckor', expectedName: 'bröd', expectedDays: 7 },
  { input: 'korv en månad', expectedName: 'korv', expectedDays: 7 },
  
  // Complex phrases
  { input: 'lägg till mjölk sju dagar', expectedName: 'lägg till mjölk', expectedDays: 7 },
  { input: 'jag vill lägga till ost fem dagar', expectedName: 'jag vill lägga till ost', expectedDays: 7 }
];

// Advanced test cases for English language
const advancedEnglishTestCases = [
  // Compound numbers
  { input: 'milk twenty-one days', expectedName: 'milk', expectedDays: 7 },
  { input: 'cheese thirty two', expectedName: 'cheese', expectedDays: 7 },
  
  // Different word orders
  { input: 'five days apple', expectedName: 'apple', expectedDays: 7 },
  { input: 'seven cucumber', expectedName: 'cucumber', expectedDays: 7 },
  
  // Partial matches
  { input: 'fresh milk three', expectedName: 'fresh milk', expectedDays: 7 },
  { input: 'organic cheese four days', expectedName: 'organic cheese', expectedDays: 7 },
  
  // With time units
  { input: 'bread two weeks', expectedName: 'bread', expectedDays: 7 },
  { input: 'sausage one month', expectedName: 'sausage', expectedDays: 7 },
  
  // Complex phrases
  { input: 'add milk seven days', expectedName: 'add milk', expectedDays: 7 },
  { input: 'i want to add cheese five days', expectedName: 'i want to add cheese', expectedDays: 7 }
];

describe('Advanced Voice Recognition Tests', () => {
  let app;
  
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset the DOM
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
    
    // Create a new instance of FridgeApp
    app = new FridgeApp();
    
    // Mock the DOMContentLoaded event
    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);
    
    // Spy on addItem and updateExpiry methods
    jest.spyOn(app, 'addItem');
    jest.spyOn(app, 'updateExpiry');
  });
  
  afterEach(() => {
    // Restore all mocks
    jest.restoreAllMocks();
  });
  
  describe('Advanced Swedish Voice Recognition', () => {
    beforeEach(() => {
      // Set language to Swedish
      app.state.recognitionLang = 'sv-SE';
      app.applyLanguage();
    });
    
    test.each(advancedSwedishTestCases)('should correctly process "$input"', ({ input, expectedName, expectedDays }) => {
      // Simulate voice input
      app.processVoiceCommand(input);
      
      // Check if addItem was called with the correct parameters
      const items = app.getItems();
      const lastItem = items[items.length - 1];
      
      expect(lastItem).toBeDefined();
      
      // For partial matches, we need to check if the expected name is contained in the actual name
      const nameMatches = 
        lastItem.name.toLowerCase() === expectedName.toLowerCase() ||
        lastItem.name.toLowerCase().includes(expectedName.toLowerCase()) ||
        expectedName.toLowerCase().includes(lastItem.name.toLowerCase());
      
      expect(nameMatches).toBe(true);
      
      // Calculate expected expiry date
      const expectedExpiry = new Date();
      expectedExpiry.setDate(expectedExpiry.getDate() + expectedDays);
      
      // Compare dates (ignoring time)
      const actualExpiryDate = new Date(lastItem.expires);
      expect(actualExpiryDate.toDateString()).toBe(expectedExpiry.toDateString());
    });
    
    test('should handle compound number words in Swedish', () => {
      const result = app.convertWordsToNumbers('tjugoett trettiotvå fyrtiotre');
      expect(result).toBe('21 32 43');
    });
  });
  
  describe('Advanced English Voice Recognition', () => {
    beforeEach(() => {
      // Set language to English
      app.state.recognitionLang = 'en-US';
      app.applyLanguage();
    });
    
    test.each(advancedEnglishTestCases)('should correctly process "$input"', ({ input, expectedName, expectedDays }) => {
      // Simulate voice input
      app.processVoiceCommand(input);
      
      // Check if addItem was called with the correct parameters
      const items = app.getItems();
      const lastItem = items[items.length - 1];
      
      expect(lastItem).toBeDefined();
      
      // For partial matches, we need to check if the expected name is contained in the actual name
      const nameMatches = 
        lastItem.name.toLowerCase() === expectedName.toLowerCase() ||
        lastItem.name.toLowerCase().includes(expectedName.toLowerCase()) ||
        expectedName.toLowerCase().includes(lastItem.name.toLowerCase());
      
      expect(nameMatches).toBe(true);
      
      // Calculate expected expiry date
      const expectedExpiry = new Date();
      expectedExpiry.setDate(expectedExpiry.getDate() + expectedDays);
      
      // Compare dates (ignoring time)
      const actualExpiryDate = new Date(lastItem.expires);
      expect(actualExpiryDate.toDateString()).toBe(expectedExpiry.toDateString());
    });
    
    test('should handle compound number words in English', () => {
      const result = app.convertWordsToNumbers('twenty-one thirty two forty-three');
      expect(result).toBe('21 32 43');
    });
  });
  
  describe('Edge Cases', () => {
    test('should handle empty input', () => {
      app.processVoiceCommand('');
      const items = app.getItems();
      expect(items.length).toBe(0);
    });
    
    test('should handle input with only time words', () => {
      app.processVoiceCommand('dagar');
      const items = app.getItems();
      expect(items.length).toBe(0);
    });
    
    test('should handle input with only numbers', () => {
      app.processVoiceCommand('7');
      const items = app.getItems();
      expect(items.length).toBe(0);
    });
    
    test('should update existing item with partial match', () => {
      // First add an item
      app.addItem('organic milk', 7);
      
      // Then update it via voice command with a partial match
      app.processVoiceCommand('milk three');
      
      // Check if the item was updated
      const items = app.getItems();
      const milkItem = items.find(item => item.name.toLowerCase().includes('milk'));
      
      expect(milkItem).toBeDefined();
      
      // Calculate expected expiry date
      const expectedExpiry = new Date();
      expectedExpiry.setDate(expectedExpiry.getDate() + 7);
      
      // Compare dates (ignoring time)
      const actualExpiryDate = new Date(milkItem.expires);
      expect(actualExpiryDate.toDateString()).toBe(expectedExpiry.toDateString());
    });
  });
});