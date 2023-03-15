import { readable } from 'svelte/store';

const getIfUserUseDarkMode = (): boolean => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

export const isDarkMode = readable(getIfUserUseDarkMode(), set => {
  const listener = () => {
    set(getIfUserUseDarkMode());
  };
  const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
  matchMedia.addEventListener('change', listener);
  return () => {
    matchMedia.removeEventListener('change', listener);
  };
});
