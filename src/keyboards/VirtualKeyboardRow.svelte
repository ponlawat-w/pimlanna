<script lang="ts">
  import VirtualKeyboardButton from './VirtualKeyboardButton.svelte';
  import { KeyboardButton, SPECIAL_KEYS, type KeyboardRow } from './template';

  export let row: KeyboardRow;
  export let index: number;
</script>

{#if index > 0}
  <br>
{/if}
{#if index > 0 && index < 3}
  <div class="d-inline-flex" style="width: 7%;">&nbsp;</div>
{/if}
{#if index == 3}<VirtualKeyboardButton
  button={KeyboardButton.getSpecialKey(SPECIAL_KEYS.LEFT_SHIFT)}
/>{/if}<!--
-->{#each row as button}<VirtualKeyboardButton
  {button}
/>{/each}<!--
-->{#if index == 0}<VirtualKeyboardButton
  button={KeyboardButton.getSpecialKey(SPECIAL_KEYS.BACKSPACE)}
/>{:else if index == 2}<VirtualKeyboardButton
  button={KeyboardButton.getSpecialKey(SPECIAL_KEYS.ENTER)}
/>{:else if index == 3}<VirtualKeyboardButton
  button={KeyboardButton.getSpecialKey(SPECIAL_KEYS.RIGHT_SHIFT)}
/>{:else if index == 4}<VirtualKeyboardButton
  button={KeyboardButton.getSpecialKey(SPECIAL_KEYS.SPACEBAR)}
/><VirtualKeyboardButton
  button={KeyboardButton.getSpecialKey(SPECIAL_KEYS.RIGHT_ALT)}
/>{/if}
