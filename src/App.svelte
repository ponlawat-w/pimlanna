<script lang="ts">
  import { Characters } from 'lanna-utils';
  import { getKeyDict, type KeyDict } from './keyboards/mapping';
  import { isDarkMode } from './stores/theme';
  import { KeyboardSource, type InsertCharacterEvent } from './keyboards/events';
  import { onMount, setContext } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import DefaultKeyMappings from './keyboards/mappings/default';
  import Keyboard from './keyboards/Keyboard.svelte';
  import type { SuggestionEvent } from './keyboards/suggestions';

  $: dark = $isDarkMode;
  $: document.body.className = dark ? 'bg-dark text-light' : 'bg-light text-dark';
  let textarea: HTMLTextAreaElement;

  let leftShift: boolean = false;
  let rightShiftCount: number = 0;
  const maxRightShift = DefaultKeyMappings.reduce<number>((prev, curr) => curr.rShiftCount > prev ? curr.rShiftCount : prev, 0);
  $: if (rightShiftCount > maxRightShift) {
    rightShiftCount = 0;
  }

  const keyDict: KeyDict = getKeyDict(DefaultKeyMappings);

  let selectionStart: number = 0;
  let selectionEnd: number = 0;
  let keyDownOnMultiselection: boolean = false;
  let lastKeyboardSource: KeyboardSource;

  let suggestion: boolean = true;
  let suggestionSelectionStart: number = 0;
  let suggestionInput: string = '';
  $: suggestionInput = textarea ? textarea.value.substring(suggestionSelectionStart, selectionEnd) : '';

  let onScreenKeyboard: boolean = true;

  const pressedKeysWritable: Writable<string[]> = writable([]);
  setContext('pressedKeys', pressedKeysWritable);

  const getSelection = (source: KeyboardSource): { selectionStart: number, selectionEnd: number } => {
    if (source === KeyboardSource.Physical) {
      return { selectionStart: textarea.selectionStart, selectionEnd: textarea.selectionEnd };
    } else if (source === KeyboardSource.Virtual) {
      return { selectionStart, selectionEnd };
    }
  }

  const applyNewSelection = (start: number, end: number, source: KeyboardSource) => {
    selectionStart = start;
    selectionEnd = end;
    lastKeyboardSource = source;
    if (source === KeyboardSource.Physical) {
      textarea.setSelectionRange(selectionStart, selectionEnd);
    }
  };

  const updateSelection = (resetSuggestion: boolean = false) => {
    selectionStart = textarea.selectionStart;
    selectionEnd = textarea.selectionEnd;
    if (resetSuggestion) {
      suggestionSelectionStart = selectionStart;
    }
  };

  const insert = (event: InsertCharacterEvent) => {
    if (!textarea) {
      return;
    }
    const { selectionStart, selectionEnd } = getSelection(event.source);
    textarea.value = textarea.value.substring(0, selectionStart)
      + event.character
      + textarea.value.substring(selectionEnd, textarea.value.length);
    applyNewSelection(selectionStart + event.character.length, selectionStart + event.character.length, event.source);
    updateSelection(keyDownOnMultiselection);
    rightShiftCount = 0;
  };

  const backspace = (source: KeyboardSource) => {
    if (!textarea) {
      return;
    }
    const { selectionStart, selectionEnd } = getSelection(source);
    if (selectionEnd === 0) {
      return;
    }
    const newSelection = selectionStart - 1;
    textarea.value = textarea.value.substring(0, selectionStart - 1)
      + textarea.value.substring(selectionEnd);
    applyNewSelection(newSelection, newSelection, source);
  }

  const suggested = (event: CustomEvent<SuggestionEvent>) => {
    textarea.value = textarea.value.substring(0, suggestionSelectionStart)
      + event.detail.text
      + textarea.value.substring(suggestionSelectionStart + suggestionInput.length, textarea.value.length);
    updateSelection(true);
    if (lastKeyboardSource === KeyboardSource.Physical) {
      textarea.focus();
    }
    pressedKeysWritable.set([]);
    if (event.detail.keypress) {
      onKeyPress(event.detail.keypress);
    }
  };

  const onInsert = (event: CustomEvent<InsertCharacterEvent>) => insert(event.detail);
  const onBackspace = (event: CustomEvent<KeyboardSource>) => backspace(event.detail);

  const isLeftShift = (event: KeyboardEvent) => event.key === 'Shift' && (event.location === 1);
  const isRightShift = (event: KeyboardEvent) => event.key === 'Shift' && (event.location === 0 || event.location === 2);
  const isRightAlt = (event: KeyboardEvent) => (event.key === 'Alt' || event.key === 'AltGraph') && event.location === 2;

  const onKeyPress = (event: KeyboardEvent) => {
    const key = event.key;
    if (!keyDict[key] || !keyDict[key][rightShiftCount]) {
      return;
    }
    event.preventDefault();
    insert({ character: keyDict[key][rightShiftCount], source: KeyboardSource.Physical });
  };

  let pressedCount: number = 0;

  const onKeyDown = (event: KeyboardEvent) => {
    pressedCount++;
    let key: string;
    if (isLeftShift(event)) {
      key = 'LeftShift';
      leftShift = true;
    } else if (isRightShift(event)) {
      key = 'RightShift';
    } else if (isRightAlt(event)) {
      key = 'RightAlt';
    } else {
      key = event.key;
    }

    if (key) {
      pressedKeysWritable.update(x => [...x, key]);
    }

    keyDownOnMultiselection = selectionStart !== selectionEnd;
  };

  const onKeyUp = (event: KeyboardEvent) => {
    pressedCount--;
    let key: string;
    if (isLeftShift(event)) {
      key = 'LeftShift';
      leftShift = false;
    } else if (isRightShift(event)) {
      key = 'RightShift';
      event.preventDefault();
      rightShiftCount++;
    } else if (isRightAlt(event)) {
      key = 'RightAlt';
      event.preventDefault();
      insert({ character: Characters.signSakot, source: KeyboardSource.Physical });
    } else {
      key = event.key;
    }

    const isArrow = event.key.startsWith('Arrow');
    const multiDeletion = keyDownOnMultiselection && (event.key === 'Backspace' || event.key === 'Delete');
    updateSelection(isArrow || multiDeletion);

    if (
      (event.key === ' ') ||
      (event.key === 'Enter') ||
      (event.key === 'Backspace' && suggestionSelectionStart > selectionStart)
    ) {
      suggestionSelectionStart = selectionStart;
    }

    if (!pressedCount || key === 'LeftShift' || key === 'RightShift') {
      pressedKeysWritable.set([]);
    } else if (key) {
      pressedKeysWritable.update(x => x.filter(x => x !== key));
    }
  };

  const copyText = () => {
    if (!navigator.clipboard) {
      return alert('Browser does not support clipboard function, please manually copy.');
    }
    navigator.clipboard.writeText(textarea.value);
  };

  onMount(() => {
    textarea.focus();
  });
</script>

<div class="float-start">
  <div class="form-check form-check-inline form-switch">
    <input class="form-check-input" type="checkbox" role="switch" id="suggestion-switch" bind:checked={suggestion}>
    <label class="form-check-label" for="suggestion-switch">
      ᨲ᩠ᩅᩫᨩ᩠ᩅ᩠᩵ᨿᨻᩥᨾᩛ᩺
    </label>
  </div>
  <div class="form-check form-check-inline form-switch">
    <input class="form-check-input" type="checkbox" role="switch" id="on-screen-switch" bind:checked={onScreenKeyboard}>
    <label class="form-check-label" for="on-screen-switch">
      ᨸᩯ᩠᩶ᨶᨷᩫ᩠ᨶᨧᩬᩴ
    </label>
  </div>
</div>
<div class="float-end">
  <button class="btn btn-sm btn-outline-success" tabindex="-1" on:click={copyText}>
    ᨣᩬ᩶ᨷᨸᩦ᩶
  </button>
</div>

<textarea bind:this={textarea}
  on:select={() => updateSelection(false)} on:click={() => updateSelection(true)}
  on:blur={() => pressedKeysWritable.set([])}
  on:keypress={onKeyPress} on:keydown={onKeyDown} on:keyup={onKeyUp}
  class="form-control {dark ? 'bg-dark text-light' : 'bg-light text-dark'}"
  style="height: 25vh;"></textarea>

<Keyboard keyMappings={DefaultKeyMappings} on:insert={onInsert} on:backspace={onBackspace} on:suggest={suggested}
  {onScreenKeyboard} {suggestion} {suggestionInput} {leftShift} bind:rightShiftCount={rightShiftCount} />
