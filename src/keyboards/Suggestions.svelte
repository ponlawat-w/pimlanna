<script lang="ts">
  import { Lexicon, Suggestion } from 'lanna-utils';
  import type { SuggestionResult } from 'lanna-utils/dist/suggest';
  import { createEventDispatcher } from 'svelte';
  import type { SuggestionEvent } from './suggestions';

  export let input: string = '';
  const dispatch = createEventDispatcher<{ suggest: SuggestionEvent }>();

  let suggestionDiv: HTMLDivElement;

  const suggestion = new Suggestion(new Lexicon());
  suggestion.returnCount = 20;
  
  let results: SuggestionResult[] = [];
  $: results = input ? suggestion.suggest(input).filter(x => Math.abs(x.text.length - input.length) < 5) : [];

  const getSuggestionButtons = (): HTMLButtonElement[] => {
    if (!suggestionDiv) {
      return [];
    }
    return [...suggestionDiv.children].filter(x => x.tagName.toUpperCase() === 'BUTTON') as HTMLButtonElement[];
  };
  const getFocusIndex = (suggestionButtons: HTMLButtonElement[]): number => {
    for (let i = 0; i < suggestionButtons.length; i++)
    if (suggestionButtons[i] === document.activeElement) {
      return i;
    }
    return -1;
  }

  const keydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
    }
  }

  const keyup = (event: KeyboardEvent) => {
    const children: HTMLButtonElement[] = getSuggestionButtons();
    let focusIndex = getFocusIndex(children);
    if (focusIndex < 0) {
      return;
    }

    let changeFocus = false;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusIndex--;
      changeFocus = true;
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusIndex++;
      changeFocus = true;
    }

    if (changeFocus && children[focusIndex]) {
      children[focusIndex].focus();
      children[focusIndex].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  const keypress = (event: KeyboardEvent) => {
    const children: HTMLButtonElement[] = getSuggestionButtons();
    const focusIndex = getFocusIndex(children);
    if (focusIndex < 0) {
      return;
    }
    if (focusIndex >= results.length) {
      return;
    }

    dispatch('suggest', { ...results[focusIndex], keypress: event });
  };
</script>

<style>
  .suggestions {
    white-space: nowrap;
    overflow-x: scroll;
  }
</style>

{#if results.length}
  <div class="suggestions" on:keydown={keydown} on:keyup={keyup} on:keypress={keypress} bind:this={suggestionDiv}>
    {#each results as result}
      <button type="button" class="btn btn-light px-3" on:click={() => dispatch('suggest', result)}>
        {result.text}
      </button>
    {/each}
  </div>
{/if}
