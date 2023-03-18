<script lang="ts">
  import { isDarkMode } from './stores/theme';
  import { KeyboardSource, type InsertCharacterEvent } from './keyboards/events';
  import DefaultKeyMappings from './keyboards/mappings/default';
  import Keyboard from './keyboards/Keyboard.svelte';

  $: dark = $isDarkMode;
  $: document.body.className = dark ? 'bg-dark text-light' : 'bg-light text-dark';
  let textarea: HTMLTextAreaElement;
  let keyboard: Keyboard;

  let selectionStart: number = 0;
  let selectionEnd: number = 0;

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

  const insert = (event: CustomEvent<InsertCharacterEvent>) => {
    if (!textarea) {
      return;
    }
    const detail: InsertCharacterEvent = event.detail;
    const { selectionStart, selectionEnd } = getSelection(detail.source);
    textarea.value = textarea.value.substring(0, selectionStart)
      + detail.character
      + textarea.value.substring(selectionEnd, textarea.value.length);
    applyNewSelection(selectionStart + detail.character.length, selectionStart + detail.character.length, detail.source);
  };
  
  const backspace = (event: CustomEvent<KeyboardSource>) => {
    if (!textarea) {
      return;
    }
    const source: KeyboardSource = event.detail;
    const { selectionStart, selectionEnd } = getSelection(source);
    if (selectionEnd === 0) {
      return;
    }
    const newSelection = selectionStart - 1;
    textarea.value = textarea.value.substring(0, selectionStart - 1)
      + textarea.value.substring(selectionEnd);
    applyNewSelection(newSelection, newSelection, source);
  };
</script>

<textarea bind:this={textarea} on:select={updateSelection} on:click={updateSelection} on:keyup={updateSelection}
  class="form-control {dark ? 'bg-dark text-light' : 'bg-light text-dark'}"
  style="height: 25vh;"></textarea>

<Keyboard bind:this={keyboard} on:insert={insert} on:backspace={backspace} keyMappings={DefaultKeyMappings} />
