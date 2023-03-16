<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { KeyboardSource, type InsertCharacterEvent } from './events';
  import VirtualKeyboard from './VirtualKeyboard.svelte';

  const dispatch = createEventDispatcher();

  const insert = character => dispatch('insert', { character, source: KeyboardSource.Virtual } as InsertCharacterEvent);
  const backspace = () => dispatch('backspace', KeyboardSource.Virtual);
</script>

<div class="keyboard">
  <VirtualKeyboard />
</div>

<style>
  .keyboard {
    display: block;
    width: 100%;
    position: fixed;
    bottom: 0;
  }
</style>
