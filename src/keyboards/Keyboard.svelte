<script lang="ts">
  import { KeyboardButton } from './template';
  import { ThaiKedmanee } from './layout';
  import DefaultKeyMappings from './mappings/default';
  import KeyboardRow from './KeyboardRow.svelte';

  const keyboardLayout = KeyboardButton.getKeyboardLayout(DefaultKeyMappings, ThaiKedmanee);
</script>

{#each keyboardLayout as row}
<div class="container">
  <KeyboardRow {row} />
</div>
{/each}
