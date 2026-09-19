@props(['data' => []])

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
    @php
        $projects = \App\Models\Project::latest()
            ->take($data['limit'] ?? 6)
            ->get();
    @endphp

    @forelse ($projects as $project)
        <div class="card bg-base-100 shadow-xl border border-base-300">
            @if ($project->image)
                <figure><img src="/storage/{{ $project->image }}" alt="{{ $project->title }}" /></figure>
            @endif
            <div class="card-body">
                <h2 class="card-title">{{ $project->title }}</h2>
                <p class="text-sm line-clamp-2">{{ $project->content }}</p>
                <div class="card-actions justify-end mt-4">
                    <a href="/project/{{ $project->slug }}" class="btn btn-primary btn-sm">Bekijk Project</a>
                </div>
            </div>
        </div>
    @empty
        <p class="text-gray-500">Nog geen projecten gevonden.</p>
    @endforelse
</div>
