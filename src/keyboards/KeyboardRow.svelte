<script lang="ts">
  import KeyboardButton from './KeyboardButton.svelte';
  import type { KeyboardRow } from './template';

  export let row: KeyboardRow;
</script>

{#each row as button}
  <KeyboardButton {button} />
{/each}
