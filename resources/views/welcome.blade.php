@extends('layouts.frontend', ['title' => $page->title])

@section('content')
    <div class="page-builder-content">
        @if (!empty($page->layout) && is_array($page->layout))
            @foreach ($page->layout as $row)
                <section id="{{ $row['id'] ?? '' }}" class="py-8 my-4">
                    <div class="container mx-auto px-4">
                        <div class="flex flex-wrap -mx-2">
                            @foreach ($row['columns'] ?? [] as $column)
                                <div class="{{ $column['width'] ?? 'w-full' }} px-2">
                                    @foreach ($column['components'] ?? [] as $component)
                                        {{-- Rendert automatisch resources/views/components/blocks/{type}.blade.php --}}
                                        <x-dynamic-component :component="'blocks.' . $component['type']" :data="$component['data'] ?? []" />
                                    @endforeach
                                </div>
                            @endforeach
                        </div>
                    </div>
                </section>
            @endforeach
        @else
            <div class="container mx-auto px-4 py-12 text-center text-gray-500">
                <p>Deze pagina heeft nog geen inhoud.</p>
            </div>
        @endif
    </div>
@endsection
