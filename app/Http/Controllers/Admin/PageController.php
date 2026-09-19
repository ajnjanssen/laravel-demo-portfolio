<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Pages/Index', [
            'pages' => Page::all(),
        ]);
    }

    public function edit(Page $page)
    {
        return Inertia::render('Admin/PageBuilder', [
            'page' => $page,
        ]);
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:255',
            'layout' => 'nullable|array',
        ]);

        $page->update([
            'title' => $validated['title'],
            'slug' => $validated['slug'] ?? $page->slug,
            'status' => $validated['status'] ?? $page->status,
            'layout' => Page::normalizeLayout($validated['layout'] ?? $page->layout ?? []),
        ]);

        return redirect()->back()->with('success', 'Pagina succesvol opgeslagen!');
    }
}