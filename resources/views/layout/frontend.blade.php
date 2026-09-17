<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="antialiased">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Mijn Portfolio | {{ $title }}</title>

    <!-- Google Fonts for Editorial Style -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Syne:wght@700;800&display=swap"
        rel="stylesheet" />

    <!-- Vite Assets (Tailwind CSS + JS) -->
    @vite (["resources/css/app.css", "resources/js/app.js"])
</head>

<body class="bg-base-100">
    <header class="p-6">
        <h1 class=" font-sans font-bold text-3xl text-base-content">Alexander Janssen</h1>
        <span class="text-xs font-mono uppercase tracking-widest text-base-content">Portfolio</span>
    </header>

    <main class="p-6">
        @yield ("content")
    </main>

    <footer class="p-6 bottom-0 w-full bg-base-300 text-base-content flex justify-between items-center">
        <div>
            Copyright {{ date('Y') }} <a href="#"
                class="transition-colors ml-2 text-base-content">LinkedIn</a>
            |
            <a href="#" class="text-base-content transition-colors">Instagram</a>
        </div>

        <div>
            @if (Auth::check())
                {{ auth()->user()->first }} {{ auth()->user()->last }} |
                <a href="/console/logout" class="underline hover:text-base-content transition-colors">Log Out</a>
                |
                <a href="/console/dashboard" class="underline hover:text-base-content transition-colors">Dashboard</a>
            @else
                <a href="/console/login" class="hover:text-base-content transition-colors">Login</a>
            @endif
        </div>
    </footer>
</body>

</html>
