const FridgeApp = require('../app.js');

describe('Date Parsing Tests', () => {
  let app;

  beforeEach(() => {
    // Mock localStorage
    global.localStorage = {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };

    // Mock document
    global.document = {
      addEventListener: jest.fn(),
      getElementById: jest.fn(() => ({
        textContent: '',
        innerText: '',
        value: '',
        placeholder: '',
        classList: { add: jest.fn(), remove: jest.fn(), toggle: jest.fn() },
        addEventListener: jest.fn()
      })),
      querySelectorAll: jest.fn(() => []),
      querySelector: jest.fn(() => ({
        appendChild: jest.fn(),
        addEventListener: jest.fn()
      }))
    };

    app = new FridgeApp();
  });

  describe('Numeric Date Parsing', () => {
    test('should parse ISO format dates (2025-07-30)', () => {
      const result = app.parseDate('2025-07-30');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(6); // July is month 6 (0-indexed)
      expect(result.getDate()).toBe(30);
    });

    test('should parse European format dates (30-07)', () => {
      const result = app.parseDate('30-07');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(30);
    });

    test('should parse slash format dates (30/07)', () => {
      const result = app.parseDate('30/07');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(30);
    });

    test('should parse dot format dates (30.07)', () => {
      const result = app.parseDate('30.07');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(30);
    });

    test('should handle ambiguous dates correctly (assume day-month)', () => {
      const result = app.parseDate('05-03');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(2); // March
      expect(result.getDate()).toBe(5);
    });

    test('should handle unambiguous dates (day > 12)', () => {
      const result = app.parseDate('15-03');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(2); // March
      expect(result.getDate()).toBe(15);
    });
  });

  describe('Swedish Textual Date Parsing', () => {
    beforeEach(() => {
      app.state.recognitionLang = 'sv-SE';
    });

    test('should parse Swedish month names', () => {
      const result = app.parseDate('30 juli');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(30);
    });

    test('should parse Swedish month abbreviations', () => {
      const result = app.parseDate('30 jul');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(30);
    });

    test('should parse Swedish ordinals', () => {
      const result = app.parseDate('trettonde juli');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(13);
    });

    test('should parse Swedish ordinal abbreviations', () => {
      const result = app.parseDate('30:e juli');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(30);
    });

    test('should parse complex Swedish dates', () => {
      const result = app.parseDate('tjugoförsta december');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(11); // December
      expect(result.getDate()).toBe(21);
    });

    test('should parse Swedish relative dates - idag', () => {
      const result = app.parseDate('idag');
      const today = new Date();
      expect(result).toBeInstanceOf(Date);
      expect(result.toDateString()).toBe(today.toDateString());
    });

    test('should parse Swedish relative dates - imorgon', () => {
      const result = app.parseDate('imorgon');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(result).toBeInstanceOf(Date);
      expect(result.toDateString()).toBe(tomorrow.toDateString());
    });

    test('should parse Swedish relative dates - övermorgon', () => {
      const result = app.parseDate('övermorgon');
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      expect(result).toBeInstanceOf(Date);
      expect(result.toDateString()).toBe(dayAfterTomorrow.toDateString());
    });
  });

  describe('English Textual Date Parsing', () => {
    beforeEach(() => {
      app.state.recognitionLang = 'en-US';
    });

    test('should parse English month names', () => {
      const result = app.parseDate('30 july');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(30);
    });

    test('should parse English month abbreviations', () => {
      const result = app.parseDate('30 jul');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(30);
    });

    test('should parse English ordinals', () => {
      const result = app.parseDate('thirteenth july');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(13);
    });

    test('should parse English ordinal abbreviations', () => {
      const result = app.parseDate('30th july');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(6); // July
      expect(result.getDate()).toBe(30);
    });

    test('should parse complex English dates', () => {
      const result = app.parseDate('twenty-first december');
      expect(result).toBeInstanceOf(Date);
      expect(result.getMonth()).toBe(11); // December
      expect(result.getDate()).toBe(21);
    });

    test('should parse English relative dates - today', () => {
      const result = app.parseDate('today');
      const today = new Date();
      expect(result).toBeInstanceOf(Date);
      expect(result.toDateString()).toBe(today.toDateString());
    });

    test('should parse English relative dates - tomorrow', () => {
      const result = app.parseDate('tomorrow');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(result).toBeInstanceOf(Date);
      expect(result.toDateString()).toBe(tomorrow.toDateString());
    });
  });

  describe('Item Name Extraction', () => {
    test('should extract item name from date string (Swedish)', () => {
      app.state.recognitionLang = 'sv-SE';
      const result = app.extractItemName('mjölk 30 juli');
      expect(result).toBe('mjölk');
    });

    test('should extract item name from date string (English)', () => {
      app.state.recognitionLang = 'en-US';
      const result = app.extractItemName('milk 30 july');
      expect(result).toBe('milk');
    });

    test('should extract item name from numeric date', () => {
      const result = app.extractItemName('milk 2025-07-30');
      expect(result).toBe('milk');
    });

    test('should extract item name from relative date (Swedish)', () => {
      app.state.recognitionLang = 'sv-SE';
      const result = app.extractItemName('mjölk imorgon');
      expect(result).toBe('mjölk');
    });

    test('should extract item name from relative date (English)', () => {
      app.state.recognitionLang = 'en-US';
      const result = app.extractItemName('milk tomorrow');
      expect(result).toBe('milk');
    });
  });

  describe('Voice Command Integration', () => {
    beforeEach(() => {
      // Mock the saveItems and loadItems methods
      app.saveItems = jest.fn();
      app.loadItems = jest.fn();
      app.getItems = jest.fn(() => []);
    });

    test('should process voice command with Swedish date', () => {
      app.state.recognitionLang = 'sv-SE';
      app.processVoiceCommand('mjölk 30 juli');
      
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should process voice command with English date', () => {
      app.state.recognitionLang = 'en-US';
      app.processVoiceCommand('milk 30 july');
      
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should process voice command with numeric date', () => {
      app.processVoiceCommand('milk 2025-07-30');
      
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should update existing item with new date', () => {
      const existingItems = [{ name: 'milk', category: 'dairy', expires: new Date() }];
      app.getItems = jest.fn(() => existingItems);
      
      app.processVoiceCommand('milk 2025-07-30');
      
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });
  });

  describe('Date Display Formatting', () => {
    test('should format expired dates correctly', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const result = app.formatExpiryDisplay(yesterday);
      expect(result.class).toBe('expired');
      expect(result.daysLeft).toBe('1 days ago');
    });

    test('should format today dates correctly', () => {
      const today = new Date();
      
      const result = app.formatExpiryDisplay(today);
      expect(result.class).toBe('expiring');
      expect(result.daysLeft).toBe('Today');
    });

    test('should format tomorrow dates correctly', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const result = app.formatExpiryDisplay(tomorrow);
      expect(result.class).toBe('expiring');
      expect(result.daysLeft).toBe('Tomorrow');
    });

    test('should format future dates correctly', () => {
      const future = new Date();
      future.setDate(future.getDate() + 5);
      
      const result = app.formatExpiryDisplay(future);
      expect(result.class).toBe('normal');
      expect(result.daysLeft).toBe('5 days');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should return null for invalid dates', () => {
      const result = app.parseDate('invalid date string');
      expect(result).toBeNull();
    });

    test('should handle empty strings', () => {
      const result = app.parseDate('');
      expect(result).toBeNull();
    });

    test('should handle dates with invalid day/month combinations', () => {
      const result = app.parseDate('32-13'); // Invalid day and month
      expect(result).toBeNull();
    });

    test('should extract empty name gracefully', () => {
      const result = app.extractItemName('2025-07-30');
      expect(result).toBe('');
    });
  });
});