<script lang="ts">
  import { KeyboardButton } from './template';
  import { ThaiKedmanee } from './layout';
  import DefaultKeyMappings from './mappings/default';
  import VirtualKeyboardRow from './VirtualKeyboardRow.svelte';

  const keyboardLayout = KeyboardButton.getKeyboardLayout(DefaultKeyMappings, ThaiKedmanee);
</script>

<div class="container-fluid d-block text-center">
  {#each keyboardLayout as row, index}
    <VirtualKeyboardRow {row} {index} />
  {/each}
</div>
