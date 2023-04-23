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
  button={KeyboardButton.getSpecialKey(SPECIAL_KEYS.LEFT_SHIFT)} on:insert on:backspace
/>{/if}<!--
-->{#each row as button}<VirtualKeyboardButton
  {button} on:insert on:backspace
/>{/each}<!--
-->{#if index == 0}<VirtualKeyboardButton
  button={KeyboardButton.getSpecialKey(SPECIAL_KEYS.BACKSPACE)} on:insert on:backspace
/>{:else if index == 2}<VirtualKeyboardButton
  button={KeyboardButton.getSpecialKey(SPECIAL_KEYS.ENTER)} on:insert on:backspace
/>{:else if index == 3}<VirtualKeyboardButton
  button={KeyboardButton.getSpecialKey(SPECIAL_KEYS.RIGHT_SHIFT)} on:insert on:backspace
/>{:else if index == 4}<VirtualKeyboardButton
  button={KeyboardButton.getSpecialKey(SPECIAL_KEYS.SPACEBAR)} on:insert on:backspace
/><VirtualKeyboardButton
  button={KeyboardButton.getSpecialKey(SPECIAL_KEYS.RIGHT_ALT)} on:insert on:backspace
/>{/if}
