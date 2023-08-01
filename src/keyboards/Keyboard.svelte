<script lang="ts">
  import { setContext } from 'svelte';
  import { writable, type Writable } from 'svelte/store';
  import { isDarkMode } from '../stores/theme';
  import type { KeyMapping } from './mapping';
  import VirtualKeyboard from './VirtualKeyboard.svelte';
  import Suggestions from './Suggestions.svelte';

  export let keyMappings: KeyMapping[] = [];
  export let leftShift: boolean;
  export let onScreenKeyboard: boolean = true;
  export let rightShiftCount: number;
  export let suggestion: boolean = true;
  export let suggestionInput: string = '';

  const leftShiftWritable = writable<boolean>(false);
  setContext<Writable<boolean>>('leftShift', leftShiftWritable);
  $: leftShiftWritable.set(leftShift);

  const rightShiftWritable = writable<number>(0,);
  setContext<Writable<number>>('rightShift', rightShiftWritable);
  $: rightShiftWritable.set(rightShiftCount);
  $: rightShiftCount = $rightShiftWritable;

  const resetShifts = () => {
    leftShiftWritable.set(false);
    rightShiftWritable.set(0);
  };

  $: dark = $isDarkMode;
</script>

<div class="keyboard" class:dark={dark}>
  {#if suggestion}<Suggestions input={suggestionInput} on:suggest />{/if}
  {#if onScreenKeyboard}
    <VirtualKeyboard on:insert on:backspace {keyMappings}
      on:insert={resetShifts} on:backspace={resetShifts}  />
  {/if}
</div>

<style>
  .keyboard {
    display: block;
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: #ededed;
    box-shadow: 0 -5px 20px #000000;
    background-color: #efefef;
  }

  .keyboard.dark {
    background-color: #101010;
  }
</style>
