<script lang="ts">
  import { createEventDispatcher, getContext } from 'svelte';
  import { isDarkMode } from '../stores/theme';
  import { KeyboardSource, type KeyboardEvents } from './events';
  import { Characters } from 'lanna-utils';
  import type { KeyboardButton, SpecialButtonKey } from './template';
  import type { Writable } from 'svelte/store';

  export let button: KeyboardButton;
  const dispatch = createEventDispatcher<KeyboardEvents>();

  const source = KeyboardSource.Virtual;

  $: darkMode = $isDarkMode;

  const leftShiftContext = getContext<Writable<boolean>>('leftShift');
  let leftShift: boolean;
  $: leftShift = $leftShiftContext;

  const rightShiftContext = getContext<Writable<number>>('rightShift');
  let rightShift: number;
  $: rightShift = $rightShiftContext;

  const pressedKeyContext = getContext<Writable<string[]>>('pressedKeys');
  let isPressed: boolean;
  $: isPressed = $pressedKeyContext.indexOf(button.key) > -1 || $pressedKeyContext.indexOf(button.keyShifted) > -1;

  const display = button.display;
  const latin = button.latin;
  $: taitham = button.getCurrentTaitham(rightShift);
  $: taithamShifted = button.getCurrentShiftedTaitham(rightShift);
  $: current = button.getCurrent(leftShift, rightShift);

  const onClick = () => {
    if (!button) {
      return;
    }
    if (button.special) {
      const key = button.key as SpecialButtonKey;
      switch (key) {
        case 'Backspace': return dispatch('backspace', source);
        case 'Enter': return dispatch('insert', { character: '\n', source });
        case 'LeftShift': return leftShiftContext.update(x => !x);
        case 'RightAlt': return dispatch('insert', { character: Characters.signSakot, source });
        case 'RightShift': return rightShiftContext.update(x => x + 1);
        case ' ': return dispatch('insert', { character: ' ', source });
      }
    }
    return dispatch('insert', { character: current, source });
  };
</script>

<button
  type="button"
  class="btn btn-outline-secondary"
  class:text-light={(darkMode && !isPressed) || (!darkMode && isPressed)}
  class:text-dark={!darkMode && !isPressed}
  class:bg-secondary={isPressed}
  class:bg-danger={button.key === 'RightShift' && rightShift > 0}
  class:dark={darkMode}
  style:width="{button.width}%"
  on:click={onClick}
>
  {#if display}
    <span class:text-light={button.key === 'RightShift' && rightShift > 0}>
      {display}
      {#if button.key === 'RightShift' && rightShift > 0}
        {rightShift}
      {/if}
    </span>
  {:else}
    <span class="latin d-none d-lg-block text-secondary">
      {latin}
    </span>
    <span class="taitham d-none d-lg-block {leftShift ? 'text-secondary' : ''}">
      {taitham}
    </span>
    <span class="taitham-shifted d-none d-lg-block {!leftShift ? 'text-secondary' : ''}">
      {taithamShifted}
    </span>
    <span class="taitham-small d-block d-lg-none">
      {current}
    </span>
  {/if}
</button>

<style>
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0;
    height: 2em;
    touch-action: manipulation;
    border-radius: 0;
    background-color: #e0e0e0;
  }

  button:hover {
    background-color: #d0d0d0;
  }

  button:active {
    background-color: #c4c4c4;
  }

  button.dark {
    background-color: #151515;
  }

  button.dark:hover {
    background-color: #606060;
  }

  button.dark:active {
    background-color: #060606;
  }

  @media (max-width: 575.98px) {
    button span {
      font-size: 0.8em;
    }
  }

  @media (min-width: 992px) {
    button {
      font-size: 0.85em;
      height: 3.8em;
    }
  }

  button span {
    position: absolute;
  }

  .latin {
    top: 0.25em;
    left: 0.25em;
  }

  .taitham {
    font-size: 1.2em;
    font-weight: bold;
    right: 0.5em;
    bottom: 0.15em;
  }

  .taitham-shifted {
    font-size: 1.2em;
    font-weight: bold;
    right: 0.5em;
    top: 0;
  }

  .taitham-small {
    font-weight: bold;
    top: 0;
    left: 2px;
  }
</style>
