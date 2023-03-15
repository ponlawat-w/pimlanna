<script lang="ts">
  import { isDarkMode } from "../stores/theme";
  import type { KeyboardButton } from "./template";

  export let button: KeyboardButton;

  $: darkMode = $isDarkMode;

  const latin = button.latin;
  $: taitham = button.getCurrentTaitham();
  $: taithamShifted = button.getCurrentShiftedTaitham();
  $: current = button.getCurrent();
</script>

<button type="button" class="btn btn-outline-secondary {darkMode ? 'text-light' : 'text-dark'}">
  <span class="latin d-none d-lg-block">
    {latin}
  </span>
  <span class="taitham d-none d-lg-block">
    {taitham}
  </span>
  <span class="taitham-shifted d-none d-lg-block">
    {taithamShifted}
  </span>
  <span class="taitham-small d-none d-lg-none">
    {current}
  </span>
</button>

<style>
  button {
    padding: 0;
    width: 7%;
    height: 2em;
    position: relative;
    touch-action: manipulation;
  }

  @media (max-width: 575.98px) {
    button span {
      font-size: 0.8em;
    }
  }

  @media (min-width: 992px) {
    button {
      height: 4em;
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
