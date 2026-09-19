@props(['data' => []])

<div class="py-12 text-center bg-base-200 rounded-box my-4">
    <h1 class="text-4xl font-bold font-sans">{{ $data['title'] ?? 'Titel' }}</h1>
    <p class="mt-4 text-lg text-base-content/70">{{ $data['subtitle'] ?? '' }}</p>
</div>
