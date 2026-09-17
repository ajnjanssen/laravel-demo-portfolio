<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="antialiased">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Mijn Portfolio | {{ $title }}</title>

    <!-- Google Fonts for Editorial Style -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
    />

    <!-- Vite Assets (Tailwind CSS + JS) -->
    @vite (["resources/css/app.css", "resources/js/app.js"])
</head>

<body class="bg-neutral-950 text-neutral-100 font-sans min-h-screen flex flex-col justify-between">
    <header class="p-6 md:p-8 max-w-7xl mx-auto w-full flex justify-between items-center">
        <h1 class="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-red-500">Alexander Janssen</h1>
        <span class="text-xs font-mono uppercase tracking-widest text-neutral-500">Portfolio</span>
    </header>

    <main class="flex-grow max-w-7xl mx-auto w-full px-6 md:px-8 py-12">
        @yield ("content")
    </main>

    <footer
        class="border-t border-neutral-800 p-6 md:p-8 max-w-7xl mx-auto w-full text-sm text-neutral-400 flex flex-col md:flex-row justify-between gap-4"
    >
        <div>
            Copyright {{ date("Y") }} <a href="#" class="hover:text-white transition-colors ml-2">LinkedIn</a> |
            <a href="#" class="hover:text-white transition-colors">Instagram</a>
        </div>

        <div>
            @if (Auth::check())
                {{ auth()->user()->first }} {{ auth()->user()->last }} |
                <a href="/console/logout" class="underline hover:text-white">Log Out</a>
                |
                <a href="/console/dashboard" class="underline hover:text-white">Dashboard</a>
            @else
                <a href="/console/login" class="hover:text-white transition-colors">Login</a>
            @endif
        </div>
    </footer>
</body>
</html>
