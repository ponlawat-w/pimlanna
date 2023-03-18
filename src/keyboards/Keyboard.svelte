<script lang="ts">
  import { onDestroy, setContext } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import { isDarkMode } from '../stores/theme';
  import type { KeyMapping } from './mapping';
  import VirtualKeyboard from './VirtualKeyboard.svelte';

  export let keyMappings: KeyMapping[] = [];

  let maxRightShift: number = 0;
  $: maxRightShift = keyMappings.reduce<number>((prev, curr) => curr.rShiftCount > prev ? curr.rShiftCount : prev, 0);

  const leftShift = writable<boolean>(false);
  setContext<Writable<boolean>>('leftShift', leftShift);

  const rightShift = writable<number>(0,);
  setContext<Writable<number>>('rightShift', rightShift);
  const unsubscribeRightShift = rightShift.subscribe(x => {
    if (x > maxRightShift) {
      rightShift.set(0);
    }
  });

  const resetShifts = () => {
    leftShift.set(false);
    rightShift.set(0);
  };

  $: dark = isDarkMode;

  onDestroy(() => {
    unsubscribeRightShift();
  });
</script>

<div class="keyboard" class:dark={dark}>
  <VirtualKeyboard on:insert on:backspace {keyMappings}
    on:insert={resetShifts} on:backspace={resetShifts}  />
</div>

<style>
  .keyboard {
    display: block;
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: #ededed;
    box-shadow: 0 -5px 20px #000000;
  }

  .keyboard.dark {
    background-color: #101010;
  }
</style>
