<script lang="ts">
  import { getKeyDict, type KeyDict } from './keyboards/mapping';
  import { isDarkMode } from './stores/theme';
  import { KeyboardSource, type InsertCharacterEvent } from './keyboards/events';
  import Characters from 'lanna-utils/dist/resources/characters';
  import DefaultKeyMappings from './keyboards/mappings/default';
  import Keyboard from './keyboards/Keyboard.svelte';
  import { writable, type Writable } from 'svelte/store';
  import { setContext } from 'svelte';

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

  const pressedKeyWritable: Writable<string> = writable();
  setContext('pressedKey', pressedKeyWritable);

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
    if (source === KeyboardSource.Physical) {
      textarea.setSelectionRange(selectionStart, selectionEnd);
    }
  };

  const updateSelection = () => {
    selectionStart = textarea.selectionStart;
    selectionEnd = textarea.selectionEnd;
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

  const onInsert = (event: CustomEvent<InsertCharacterEvent>) => insert(event.detail);
  const onBackspace = (event: CustomEvent<KeyboardSource>) => backspace(event.detail);

  const onKeyPress = (event: KeyboardEvent) => {
    const key = event.key;
    if (!keyDict[key] || !keyDict[key][rightShiftCount]) {
      return;
    }
    event.preventDefault();
    insert({ character: keyDict[key][rightShiftCount], source: KeyboardSource.Physical });
  };

  const isLeftShift = (event: KeyboardEvent) => event.key === 'Shift' && (event.location === 1);
  const isRightShift = (event: KeyboardEvent) => event.key === 'Shift' && (event.location === 0 || event.location === 2);
  const isRightAlt = (event: KeyboardEvent) => (event.key === 'Alt' || event.key === 'AltGraph') && event.location === 2;

  const onKeyDown = (event: KeyboardEvent) => {
    if (isLeftShift(event)) {
      leftShift = true;
      pressedKeyWritable.set('LeftShift');
    } else if (isRightShift(event)) {
      pressedKeyWritable.set('RightShift');
    } else if (isRightAlt(event)) {
      pressedKeyWritable.set('RightAlt');
    } else {
      pressedKeyWritable.set(event.key);
    }
  };

  const onKeyUp = (event: KeyboardEvent) => {
    if (isLeftShift(event)) {
      leftShift = false;
    } else if (isRightShift(event)) {
      event.preventDefault();
      rightShiftCount++;
    } else if (isRightAlt(event)) {
      event.preventDefault();
      insert({ character: Characters.signSakot, source: KeyboardSource.Physical });
    }
    pressedKeyWritable.set(null);
    updateSelection();
  };
</script>

<textarea bind:this={textarea}
  on:select={updateSelection} on:click={updateSelection}
  on:keypress={onKeyPress} on:keydown={onKeyDown} on:keyup={onKeyUp}
  class="form-control {dark ? 'bg-dark text-light' : 'bg-light text-dark'}"
  style="height: 25vh;"></textarea>

<Keyboard keyMappings={DefaultKeyMappings} on:insert={onInsert} on:backspace={onBackspace}
  {leftShift} bind:rightShiftCount={rightShiftCount} />
