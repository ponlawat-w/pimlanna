<script lang="ts">
  import { KeyboardSource, type InsertCharacterEvent } from './keyboards/events';
  import Keyboard from './keyboards/Keyboard.svelte';
  import { isDarkMode } from './stores/theme';

  $: dark = $isDarkMode;
  $: document.body.className = dark ? 'bg-dark text-light' : 'bg-light text-dark';
  let textarea: HTMLTextAreaElement;
  let keyboard: Keyboard;

  const insert = event => {
    if (!textarea) {
      return;
    }
    const { selectionStart, selectionEnd } = textarea;
    const detail: InsertCharacterEvent = event.detail;
    textarea.value = textarea.value.substring(0, selectionStart)
      + detail.character
      + textarea.value.substring(selectionEnd, textarea.value.length);
    textarea.setSelectionRange(selectionStart + detail.character.length, selectionStart + detail.character.length);
    if (detail.source === KeyboardSource.Physical) {
      textarea.focus()
    }
  };
  
  const backspace = event => {
    if (!textarea || textarea.selectionStart === 0) {
      return;
    }
    const source: KeyboardSource = event.detail;
    if (source === KeyboardSource.Physical) {
      const newSelection = textarea.selectionStart - 1;
      textarea.value = textarea.value.substring(0, textarea.selectionStart - 1)
        + textarea.value.substring(textarea.selectionEnd);
      textarea.setSelectionRange(newSelection, newSelection);
      textarea.focus();
    } else if (source === KeyboardSource.Virtual) {
      textarea.value = textarea.value.substring(0, textarea.value.length - 1);
    }
  };
</script>

<textarea bind:this={textarea}
  class="form-control {dark ? 'bg-dark text-light' : 'bg-light text-dark'}"
  style="height: 25vh;"></textarea>

<Keyboard bind:this={keyboard} on:insert={insert} on:backspace={backspace} />
