import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
    server: {
        host: '0.0.0.0', // Zorgt dat Vite luistert buiten de container
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost', // Zegt tegen je browser op localhost:8000 dat hij moet verbinden met localhost:5173
        },
        watch: {
            usePolling: true, // Zorgt dat Windows bestandswijzigingen direct doorgeeft
        },
    },
});