import type { Config } from 'tailwindcss';

const config: Config = {
  // Указываем пути ко всем файлам интерфейса (Renderer процесс)
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,html}',
    './index.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'ui-button': 'var(--ui-button-color, #3b82f6)',
        electron: {
          dark: '#1e1e1e',
          light: '#ffffff',
        }
      },
    },
  },
  plugins: [],
};

export default config;
