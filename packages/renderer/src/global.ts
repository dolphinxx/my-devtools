export function applyDarkMode() {
  if(window.systems.shouldUseDarkColors()) {
    document.querySelector('html')?.classList.add('dark');
  } else {
    document.querySelector('html')?.classList.remove('dark');
  }
}
