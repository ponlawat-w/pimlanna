<script lang="ts">
    import { Lexicon, Suggestion } from 'lanna-utils';
    import type { SuggestionResult } from 'lanna-utils/dist/suggest';
    import { createEventDispatcher } from 'svelte';

    export let input: string = '';
    const dispatch = createEventDispatcher<{ suggest: string }>();

    const suggestion = new Suggestion(new Lexicon());
    suggestion.returnCount = 20;
    
    let results: SuggestionResult[] = [];
    $: results = input ? suggestion.suggest(input) : [];
</script>

<style>
    .suggestions {
        white-space: nowrap;
        overflow-x: scroll;
    }
</style>

<div class="suggestions">
    {#each results as result}
        <button type="button" class="btn btn-light px-3" on:click={() => dispatch('suggest', result.text)}>
            {result.text}
        </button>
    {/each}
</div>
