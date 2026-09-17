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
        host: '0.0.0.0', // Bindt aan alle interfaces in de container
        hmr: {
            host: 'localhost', // Verbindt de browser via de localhost van je host-systeem
        },
        watch: {
            usePolling: true, // Nodig op Windows/WSL2 als file changes niet gedetecteerd worden
        },
    },
});