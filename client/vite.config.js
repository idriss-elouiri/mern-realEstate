import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: process.env.VITE_BACKEND_URL || 'http://localhost:3000',
=======
        target: 'https://mern-real-estate-tau.vercel.app',
>>>>>>> e73c3b528de11e35bbcba6460172c30154177689
        secure: false,
      },
    },
  },

  plugins: [react()],
});
