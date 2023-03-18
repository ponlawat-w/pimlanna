<script lang="ts">
  import { KeyboardButton, type KeyboardLayout } from './template';
  import { ThaiKedmanee } from './layout';
  import VirtualKeyboardRow from './VirtualKeyboardRow.svelte';
  import type { KeyMapping } from './mapping';

  export let keyMappings: KeyMapping[] = [];

  let keyboardLayout: KeyboardLayout;
  $: keyboardLayout = KeyboardButton.getKeyboardLayout(keyMappings, ThaiKedmanee);
</script>

<div class="container-fluid d-block text-center">
  {#each keyboardLayout as row, index}
    <VirtualKeyboardRow {row} {index} on:insert on:backspace />
  {/each}
</div>
