@props(['data' => []])

<div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
        <div class="max-w-md">
            <h1 class="text-5xl font-bold">{{ $data['title'] ?? 'Titel' }}</h1>
            <p class="py-6">
                {{ $data['subtitle'] ?? '' }}
            </p>
            <button class="btn btn-primary">Get Started</button>
        </div>
    </div>
</div>
