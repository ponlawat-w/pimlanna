new Vue({
  el: '#app',
  data: {
    language: 'nod',
    strings: [],
    fonts: {},
    currentFontCode: null,
    keyboard: 'th',
    thEnMappings: {},
    keyData: [],
    keyMaps: {},
    keyOthers: [],
    combine: null,
    keys: []
  },
  computed: {
    globalClass: function() {
      if (!this.fonts[this.currentFontCode]) {
        return null;
      }
      return this.fonts[this.currentFontCode].className;
    },
    keySet: function() {
      let result = '';
      if (this.combine) {
        result += this.combine + '(';
      }
      result += this.keys.join(',');
      if (this.combine) {
        result += ')';
      }
      return result;
    },
    specialBtnClass: function() {
      return this.combine === 'a' ? {'btn-dark': true} : {'btn-secondary': true};
    },
    sakotBtnClass: function() {
      return this.combine === 's' ? {'btn-danger': true} : {'btn-primary': true};
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
    loadKeys: async function(url = './data/keys.csv') {
      const data = (await axios.get(url)).data.split('\n').map(row => row.split(';'));
      const headers = data.splice(0, 1)[0];

      this.keyData = [];
      this.keyMaps = {};
      this.keyOthers = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].length != headers.length) {
          continue;
        }
        const row = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = data[i][j];
        }
        row['UNICODE'] = row['UNICODE'].replace(/\\u([a-fA-F0-9]*)/g, (g, m1) => String.fromCharCode(parseInt(m1, 16)));
        this.keyData.push(row);
        if (row['KEYCODES']) {
          this.keyMaps[row['KEYCODES']] = row['UNICODE'];
        } else {
          this.keyOthers.push(row['UNICODE']);
        }
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
    addKeyset: function(keySet, e) {
      if (this.keyMaps[keySet]) {
        e.preventDefault();
        this.addToTextarea(this.keyMaps[keySet]);
        return true;
      }
      return false;
    },
    getCombiningKey: function(e) {
      if (e.keyCode === 18 && e.location === 2) { // right alt
        return 'a';
      } else if (e.keyCode === 69) { // e
        return 'e';
      }
      return null;
    },
    toKeyCode: function(code) {
      return this.keyboard === 'th' ? this.thEnMappings[code] : code;
    },
    clearKey: function() {
      this.combine = null;
      this.keys = [];
    },
    keydown: function(e) {
      if (this.combine) {
        e.preventDefault();
      } else {
        this.combine = this.getCombiningKey(e);
      }
    },
    keyup: function(e) {
      if (this.combine && ((this.combine === this.getCombiningKey(e)) || (this.combine === 's'))) {
        if (this.combine === 's') {
          const key = this.toKeyCode(e.key.charCodeAt(0));
          if (key) {
            this.keys.push(key);
            this.combine = 'a';
          }
        }

        if (!this.addKeyset(this.keySet, e) && this.combine === 'a' && this.keys.length) {
          const charCode = this.keys.pop();
          if (this.keyMaps[charCode]) {
            this.addToTextarea('\u1A60' + this.keyMaps[charCode]);
          }
        }
        this.clearKey();
      } else if (this.combine) {
        const key = this.toKeyCode(e.key.charCodeAt(0));
        if (key) {
          this.keys.push(key);
        }
      }
    },
    keypress: function(e) {
      if (!this.combine) {
        this.addKeyset(this.toKeyCode(e.which), e);
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
      this.combine = 's';
      this.getTextareaElement().focus();
    },
    special: function() {
      if (this.combine === 'a') {
        this.keyup({
          keyCode: 18,
          location: 2,
          preventDefault: () => {}
        });
      } else {
        this.combine = 'a';
      }
      this.getTextareaElement().focus();
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
    }
  },
  mounted: async function() {
    this.strings = (await axios.get('./data/strings.json')).data;

    this.fonts = (await axios.get('./data/fonts.json')).data;
    
    this.loadKeys();

    const thEnMappings = (await axios.get('./data/th-en-layout.csv')).data.split('\n')
      .filter(x => x).map(x => x.split(';').map(y => y.trim()))
      .filter(x => x.length === 2);
    for (let i = 0; i < thEnMappings.length; i++) {
      this.thEnMappings[thEnMappings[i][0]] = thEnMappings[i][1];
    }

    const localStorageLanguage = localStorage.getItem('language');
    const localStorageKeyboard = localStorage.getItem('keyboard');
    const localStorageFont = localStorage.getItem('font');
    if (localStorageLanguage) {
      this.setLanguage(localStorageLanguage);
    }
    if (localStorageKeyboard) {
      this.keyboard = localStorageKeyboard;
    }
    if (localStorageFont) {
      this.currentFontCode = localStorageFont;
    } else {
      this.currentFontCode = Object.keys(this.fonts).filter(k => this.fonts[k].default)[0];
    }

    this.getTextareaElement().focus();
    this.checkThemeMode();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
      this.checkThemeMode();
    }.bind(this));
  }
});
