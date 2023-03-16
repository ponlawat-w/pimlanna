<script lang="ts">
  import VirtualKeyboard from './keyboards/VirtualKeyboard.svelte';
  import { isDarkMode } from './stores/theme';

  $: document.body.className = $isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark';
</script>

<VirtualKeyboard />
