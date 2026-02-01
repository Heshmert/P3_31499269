// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';
import path from 'path';

// Cargamos el .env de la carpeta de arriba manualmente
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  outDir: '../public',
});