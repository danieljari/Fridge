/**
 * Voice Recognition Ordinal Date Tests
 * 
 * This file tests voice recognition functionality specifically for ordinal dates
 * in both Swedish and English languages, ensuring all ordinals from 1st to 31st work correctly.
 */

const FridgeApp = require('../app.js');

describe('Voice Recognition Ordinal Date Tests', () => {
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
    
    // Mock the saveItems and loadItems methods
    app.saveItems = jest.fn();
    app.loadItems = jest.fn();
    app.getItems = jest.fn(() => []);
  });

  describe('Swedish Ordinal Voice Recognition', () => {
    beforeEach(() => {
      app.state.recognitionLang = 'sv-SE';
    });

    test('should recognize "första mars" (1st March)', () => {
      app.processVoiceCommand('mjölk första mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "andra mars" (2nd March)', () => {
      app.processVoiceCommand('mjölk andra mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tredje mars" (3rd March)', () => {
      app.processVoiceCommand('mjölk tredje mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "fjärde mars" (4th March)', () => {
      app.processVoiceCommand('mjölk fjärde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "femte mars" (5th March)', () => {
      app.processVoiceCommand('mjölk femte mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "sjätte mars" (6th March)', () => {
      app.processVoiceCommand('mjölk sjätte mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "sjunde mars" (7th March)', () => {
      app.processVoiceCommand('mjölk sjunde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "åttonde mars" (8th March)', () => {
      app.processVoiceCommand('mjölk åttonde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "nionde mars" (9th March)', () => {
      app.processVoiceCommand('mjölk nionde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tionde mars" (10th March)', () => {
      app.processVoiceCommand('mjölk tionde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "elfte mars" (11th March)', () => {
      app.processVoiceCommand('mjölk elfte mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tolfte mars" (12th March)', () => {
      app.processVoiceCommand('mjölk tolfte mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tolvte mars" (12th March - alternative)', () => {
      app.processVoiceCommand('mjölk tolvte mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "trettonde mars" (13th March)', () => {
      app.processVoiceCommand('mjölk trettonde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "fjortonde mars" (14th March)', () => {
      app.processVoiceCommand('mjölk fjortonde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "femtonde mars" (15th March)', () => {
      app.processVoiceCommand('mjölk femtonde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "sextonde mars" (16th March)', () => {
      app.processVoiceCommand('mjölk sextonde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "sjuttonde mars" (17th March)', () => {
      app.processVoiceCommand('mjölk sjuttonde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "artonde mars" (18th March)', () => {
      app.processVoiceCommand('mjölk artonde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "nittonde mars" (19th March)', () => {
      app.processVoiceCommand('mjölk nittonde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tjugonde mars" (20th March)', () => {
      app.processVoiceCommand('mjölk tjugonde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tjugoförsta mars" (21st March)', () => {
      app.processVoiceCommand('mjölk tjugoförsta mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tjugoandra mars" (22nd March)', () => {
      app.processVoiceCommand('mjölk tjugoandra mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tjugotredje mars" (23rd March)', () => {
      app.processVoiceCommand('mjölk tjugotredje mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tjugofjärde mars" (24th March)', () => {
      app.processVoiceCommand('mjölk tjugofjärde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tjugofemte mars" (25th March)', () => {
      app.processVoiceCommand('mjölk tjugofemte mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tjugosjätte mars" (26th March)', () => {
      app.processVoiceCommand('mjölk tjugosjätte mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tjugosjunde mars" (27th March)', () => {
      app.processVoiceCommand('mjölk tjugosjunde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tjugoåttonde mars" (28th March)', () => {
      app.processVoiceCommand('mjölk tjugoåttonde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tjugonionde mars" (29th March)', () => {
      app.processVoiceCommand('mjölk tjugonionde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "trettionde mars" (30th March)', () => {
      app.processVoiceCommand('mjölk trettionde mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "trettioförsta mars" (31st March)', () => {
      app.processVoiceCommand('mjölk trettioförsta mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    // Test abbreviated forms
    test('should recognize "1:a mars" (1st March abbreviated)', () => {
      app.processVoiceCommand('mjölk 1:a mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "3:e mars" (3rd March abbreviated)', () => {
      app.processVoiceCommand('mjölk 3:e mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "31:a mars" (31st March abbreviated)', () => {
      app.processVoiceCommand('mjölk 31:a mars');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });
  });

  describe('English Ordinal Voice Recognition', () => {
    beforeEach(() => {
      app.state.recognitionLang = 'en-US';
    });

    test('should recognize "first march" (1st March)', () => {
      app.processVoiceCommand('milk first march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "second march" (2nd March)', () => {
      app.processVoiceCommand('milk second march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "third march" (3rd March)', () => {
      app.processVoiceCommand('milk third march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "fourth march" (4th March)', () => {
      app.processVoiceCommand('milk fourth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "fifth march" (5th March)', () => {
      app.processVoiceCommand('milk fifth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "sixth march" (6th March)', () => {
      app.processVoiceCommand('milk sixth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "seventh march" (7th March)', () => {
      app.processVoiceCommand('milk seventh march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "eighth march" (8th March)', () => {
      app.processVoiceCommand('milk eighth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "ninth march" (9th March)', () => {
      app.processVoiceCommand('milk ninth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "tenth march" (10th March)', () => {
      app.processVoiceCommand('milk tenth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "eleventh march" (11th March)', () => {
      app.processVoiceCommand('milk eleventh march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "twelfth march" (12th March)', () => {
      app.processVoiceCommand('milk twelfth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "thirteenth march" (13th March)', () => {
      app.processVoiceCommand('milk thirteenth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "fourteenth march" (14th March)', () => {
      app.processVoiceCommand('milk fourteenth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "fifteenth march" (15th March)', () => {
      app.processVoiceCommand('milk fifteenth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "sixteenth march" (16th March)', () => {
      app.processVoiceCommand('milk sixteenth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "seventeenth march" (17th March)', () => {
      app.processVoiceCommand('milk seventeenth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "eighteenth march" (18th March)', () => {
      app.processVoiceCommand('milk eighteenth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "nineteenth march" (19th March)', () => {
      app.processVoiceCommand('milk nineteenth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "twentieth march" (20th March)', () => {
      app.processVoiceCommand('milk twentieth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "twenty-first march" (21st March)', () => {
      app.processVoiceCommand('milk twenty-first march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "twenty-second march" (22nd March)', () => {
      app.processVoiceCommand('milk twenty-second march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "twenty-third march" (23rd March)', () => {
      app.processVoiceCommand('milk twenty-third march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "twenty-fourth march" (24th March)', () => {
      app.processVoiceCommand('milk twenty-fourth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "twenty-fifth march" (25th March)', () => {
      app.processVoiceCommand('milk twenty-fifth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "twenty-sixth march" (26th March)', () => {
      app.processVoiceCommand('milk twenty-sixth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "twenty-seventh march" (27th March)', () => {
      app.processVoiceCommand('milk twenty-seventh march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "twenty-eighth march" (28th March)', () => {
      app.processVoiceCommand('milk twenty-eighth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "twenty-ninth march" (29th March)', () => {
      app.processVoiceCommand('milk twenty-ninth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "thirtieth march" (30th March)', () => {
      app.processVoiceCommand('milk thirtieth march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "thirty-first march" (31st March)', () => {
      app.processVoiceCommand('milk thirty-first march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    // Test abbreviated forms
    test('should recognize "1st march" (1st March abbreviated)', () => {
      app.processVoiceCommand('milk 1st march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "2nd march" (2nd March abbreviated)', () => {
      app.processVoiceCommand('milk 2nd march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "3rd march" (3rd March abbreviated)', () => {
      app.processVoiceCommand('milk 3rd march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });

    test('should recognize "31st march" (31st March abbreviated)', () => {
      app.processVoiceCommand('milk 31st march');
      expect(app.saveItems).toHaveBeenCalled();
      expect(app.loadItems).toHaveBeenCalled();
    });
  });

  describe('Date Parsing Accuracy Tests', () => {
    test('should correctly parse Swedish ordinal dates', () => {
      app.state.recognitionLang = 'sv-SE';
      
      const testCases = [
        { input: 'första mars', expectedDay: 1, expectedMonth: 2 }, // March is month 2 (0-indexed)
        { input: 'femte april', expectedDay: 5, expectedMonth: 3 },
        { input: 'tjugoförsta december', expectedDay: 21, expectedMonth: 11 },
        { input: 'trettioförsta januari', expectedDay: 31, expectedMonth: 0 }
      ];

      testCases.forEach(({ input, expectedDay, expectedMonth }) => {
        const result = app.parseDate(input);
        expect(result).toBeInstanceOf(Date);
        expect(result.getDate()).toBe(expectedDay);
        expect(result.getMonth()).toBe(expectedMonth);
      });
    });

    test('should correctly parse English ordinal dates', () => {
      app.state.recognitionLang = 'en-US';
      
      const testCases = [
        { input: 'first march', expectedDay: 1, expectedMonth: 2 },
        { input: 'fifth april', expectedDay: 5, expectedMonth: 3 },
        { input: 'twenty-first december', expectedDay: 21, expectedMonth: 11 },
        { input: 'thirty-first january', expectedDay: 31, expectedMonth: 0 }
      ];

      testCases.forEach(({ input, expectedDay, expectedMonth }) => {
        const result = app.parseDate(input);
        expect(result).toBeInstanceOf(Date);
        expect(result.getDate()).toBe(expectedDay);
        expect(result.getMonth()).toBe(expectedMonth);
      });
    });
  });

  describe('Item Name Extraction from Ordinal Dates', () => {
    test('should extract item names from Swedish ordinal date commands', () => {
      app.state.recognitionLang = 'sv-SE';
      
      const testCases = [
        { input: 'mjölk första mars', expectedName: 'mjölk' },
        { input: 'bröd femte april', expectedName: 'bröd' },
        { input: 'ost tjugoförsta december', expectedName: 'ost' },
        { input: 'äpplen trettioförsta januari', expectedName: 'äpplen' }
      ];

      testCases.forEach(({ input, expectedName }) => {
        const result = app.extractItemName(input);
        expect(result).toBe(expectedName);
      });
    });

    test('should extract item names from English ordinal date commands', () => {
      app.state.recognitionLang = 'en-US';
      
      const testCases = [
        { input: 'milk first march', expectedName: 'milk' },
        { input: 'bread fifth april', expectedName: 'bread' },
        { input: 'cheese twenty-first december', expectedName: 'cheese' },
        { input: 'apples thirty-first january', expectedName: 'apples' }
      ];

      testCases.forEach(({ input, expectedName }) => {
        const result = app.extractItemName(input);
        expect(result).toBe(expectedName);
      });
    });
  });
});