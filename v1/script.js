const VERSION = '2565082700';

new Vue({
  el: '#app',
  data: {
    language: 'nod',
    strings: [],
    fonts: {},
    currentFontCode: null,
    keys: {},
    rshift: 0,
    maxRshift: 0,
    fontSize: '2em',
    textAlign: 'left'
  },
  computed: {
    globalClass: function() {
      if (!this.fonts[this.currentFontCode]) {
        return null;
      }
      return this.fonts[this.currentFontCode].className;
    },
    specialBtnClass: function() {
      return this.rshift ? {'btn-danger': true} : {'btn-secondary': true};
    },
    textAreaStyle: function() {
      return {
        'font-size': this.fontSize,
        'text-align': this.textAlign
      };
    }
  },
  methods: {
    str: function(key) {
      if (this.strings[this.language] && this.strings[this.language].strings[key]) {
        return this.strings[this.language].strings[key];
      }
      return `[[${key}]]`;
    },
    setLanguage: function(lang) {
      this.language = lang;
    },
    checkThemeMode: function() {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
      } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
    },
    loadKeys: async function(url = './data/keys.csv?v=' + VERSION) {
      const data = (await axios.get(url)).data.split('\n').map(row => row.split(','));
      const headers = data.splice(0, 1)[0].map(x => x.trim());

      for (let i = 0; i < data.length; i++) {
        if (data[i].length != headers.length) {
          continue;
        }
        const row = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = data[i][j];
        }

        const char = row['UNICODE'].replace(/\\u([a-fA-F0-9]*)/g, (g, m1) => String.fromCharCode(parseInt(m1, 16)));
        const name = row['NAME'];
        const description = row['DESCRIPTION'];
        const thai = row['THAI'];
        const key = row['KEY'];
        const rshift = row['RSHIFT'];

        if (!this.keys[key]) {
          this.keys[key] = {};
        }
        this.keys[key][rshift] = {
          char: char,
          name: name,
          description: description,
          thai: thai,
        };
        this.maxRshift = Math.max(this.maxRshift, rshift);
      }
    },
    getTextareaElement: function() {
      return document.getElementById('main-textarea');
    },
    addToTextarea: function(char) {
      const $textarea = this.getTextareaElement();
      const selectionStart = $textarea.selectionStart;
      const selectionEnd = $textarea.selectionEnd;
      $textarea.value = $textarea.value.substr(0, selectionStart)
        + char + $textarea.value.substr(selectionEnd, $textarea.value.length);
      $textarea.setSelectionRange(selectionStart + char.length, selectionStart + char.length);
    },
    keydown: function() {},
    keyup: function(e) {
      if (e.key === 'Shift' && (e.location === 0 || e.location === 2)) {
        e.preventDefault();
        this.special();
      } else if ((e.key === 'Alt' || e.key === 'AltGraph') && e.location === 2) {
        e.preventDefault();
        this.sakot();
      }
    },
    keypress: function(e) {
      const eventKey = e.key;
      if (this.keys[eventKey]) {
        const key = this.keys[eventKey][this.rshift] ? this.keys[eventKey][this.rshift] : this.keys[eventKey][0];
        if (!key) {
          return;
        }
        e.preventDefault();
        this.rshift = 0;
        this.addToTextarea(key.char);
      }
    },
    copy: function() {
      const tempTextarea = document.createElement('textarea');
      tempTextarea.setAttribute('readonly', true);
      tempTextarea.setAttribute('contenteditable', true);
      tempTextarea.style.position = 'fixed';
      tempTextarea.value = this.getTextareaElement().value;
      document.body.appendChild(tempTextarea);
      tempTextarea.focus();
      tempTextarea.select();
  
      const range = document.createRange();
      range.selectNodeContents(tempTextarea);
  
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
  
      tempTextarea.setSelectionRange(0, tempTextarea.value.length);
      document.execCommand('copy');

      tempTextarea.remove();
    },
    sakot: function() {
      this.addToTextarea(this.keys.RA[0].char);
    },
    special: function() {
      this.rshift = this.rshift >= this.maxRshift ? 0 : this.rshift + 1;
    },
    focus: function() {
      this.getTextareaElement().focus();
    },
    setFontSize: function(newFontSize) {
      this.fontSize = newFontSize;
    },
    setTextAlign: function(newTextAlign) {
      this.textAlign = newTextAlign;
    },
    fontSizeClass: function(elementSize) {
      return {
        'btn-light': elementSize !== this.fontSize,
        'btn-primary': elementSize === this.fontSize
      }
    },
    textAlignClass: function(elementValue) {
      return {
        'btn-light': elementValue !== this.textAlign,
        'btn-primary': elementValue === this.textAlign
      }
    }
  },
  watch: {
    language: function() {
      localStorage.setItem('language', this.language);
    },
    keyboard: function() {
      localStorage.setItem('keyboard', this.keyboard);
    },
    currentFontCode: function() {
      localStorage.setItem('font', this.currentFontCode);
    },
    fontSize: function() {
      localStorage.setItem('fontSize', this.fontSize);
    },
    textAlign: function() {
      localStorage.setItem('textAlign', this.textAlign);
    }
  },
  mounted: async function() {
    this.strings = (await axios.get('./data/strings.json?v=' + VERSION)).data;

    this.fonts = (await axios.get('./data/fonts.json?v=' + VERSION)).data;
    
    this.loadKeys();

    const localStorageLanguage = localStorage.getItem('language');
    const localStorageFont = localStorage.getItem('font');
    const localStorageFontSize = localStorage.getItem('fontSize');
    const localStorageTextAlign = localStorage.getItem('textAlign');
    if (localStorageLanguage) {
      this.setLanguage(localStorageLanguage);
    }
    if (localStorageFont) {
      this.currentFontCode = localStorageFont;
    } else {
      this.currentFontCode = Object.keys(this.fonts).filter(k => this.fonts[k].default)[0];
    }
    if (localStorageFontSize) {
      this.fontSize = localStorageFontSize;
    }
    if (localStorageTextAlign) {
      this.textAlign = localStorageTextAlign;
    }

    this.getTextareaElement().focus();
    this.checkThemeMode();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
      this.checkThemeMode();
    }.bind(this));
  }
});
