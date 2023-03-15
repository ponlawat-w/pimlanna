<script lang="ts">
  import Keyboard from './keyboards/Keyboard.svelte';
  import { isDarkMode } from './stores/theme';

  $: document.body.className = $isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark';
</script>

<Keyboard />
