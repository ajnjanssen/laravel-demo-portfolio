import React, { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';

const componentLibrary = {
    hero: {
        label: 'Hero block',
        defaultData: {
            title: 'Welcome to my portfolio',
            subtitle: 'Designing thoughtful products and digital experiences.',
        },
    },
    'text-block': {
        label: 'Text block',
        defaultData: {
            content: 'Write your content here...',
        },
    },
    'projects-grid': {
        label: 'Projects grid',
        defaultData: {
            limit: 6,
        },
    },
    media: {
        label: 'Media block',
        defaultData: {
            image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
            image_alt: 'Project preview',
        },
    },
};

const getColumnWidths = (count) => {
    switch (count) {
        case 1:
            return ['w-full'];
        case 2:
            return ['w-1/2', 'w-1/2'];
        case 3:
            return ['w-1/3', 'w-1/3', 'w-1/3'];
        case 4:
            return ['w-1/4', 'w-1/4', 'w-1/4', 'w-1/4'];
        default:
            return Array.from({ length: count }, () => 'w-full');
    }
};

const normalizeLayout = (layout = []) => {
    if (!Array.isArray(layout) || layout.length === 0) {
        return [];
    }

    return layout.map((section, sectionIndex) => {
        const columnCount = Math.max(1, Number(section?.column_count ?? section?.columns?.length ?? 1));
        const rawColumns = Array.isArray(section?.columns) ? section.columns : [];
        const widthMap = getColumnWidths(columnCount);

        const columns = Array.from({ length: Math.max(columnCount, rawColumns.length) }, (_, index) => {
            const existing = rawColumns[index] ?? {};
            const components = Array.isArray(existing.components) ? existing.components : [];

            return {
                id: existing.id ?? `column-${sectionIndex + 1}-${index + 1}`,
                width: existing.width ?? widthMap[index] ?? 'w-full',
                components: components.map((component) => ({
                    type: component.type ?? 'text-block',
                    data: component.data ?? {},
                })),
            };
        });

        return {
            id: section.id ?? `section-${sectionIndex + 1}`,
            column_count: Math.max(columnCount, columns.length),
            columns,
        };
    });
};

const getDefaultComponentData = (type) => {
    const definition = componentLibrary[type] ?? componentLibrary['text-block'];
    return { ...definition.defaultData };
};

const renderComponentSummary = (component) => {
    const type = component?.type ?? 'text-block';
    const data = component?.data ?? {};

    if (type === 'hero') {
        return {
            label: 'Hero',
            description: `${data.title || 'Untitled hero'} — ${data.subtitle || 'No subtitle'}`,
        };
    }

    if (type === 'projects-grid') {
        return {
            label: 'Projects grid',
            description: `Show ${data.limit ?? 6} projects`,
        };
    }

    if (type === 'media') {
        return {
            label: 'Media',
            description: data.image_alt || 'Image block',
        };
    }

    return {
        label: 'Text block',
        description: (data.content || 'No content yet').slice(0, 80),
    };
};

export default function PageBuilder({ page }) {
    const [layout, setLayout] = useState(() => normalizeLayout(page.layout || []));
    const [title, setTitle] = useState(page.title || '');
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [saving, setSaving] = useState(false);

    const normalizedLayout = useMemo(() => normalizeLayout(layout), [layout]);

    const updateLayout = (nextLayout) => setLayout(normalizeLayout(nextLayout));

    const addSection = () => {
        const next = [
            ...normalizedLayout,
            {
                id: `section-${Date.now()}`,
                column_count: 1,
                columns: [
                    {
                        id: `column-${Date.now()}-1`,
                        width: 'w-full',
                        components: [],
                    },
                ],
            },
        ];

        updateLayout(next);
    };

    const removeSection = (rowIndex) => {
        const next = normalizedLayout.filter((_, index) => index !== rowIndex);
        updateLayout(next);
    };

    const changeSectionColumnCount = (rowIndex, count) => {
        const next = structuredClone(normalizedLayout);
        const section = next[rowIndex];
        const safeCount = Math.max(1, Number(count || 1));

        section.column_count = safeCount;
        section.columns = Array.from({ length: safeCount }, (_, columnIndex) => {
            const current = section.columns[columnIndex] ?? {};
            return {
                id: current.id ?? `column-${rowIndex + 1}-${columnIndex + 1}`,
                width: current.width ?? getColumnWidths(safeCount)[columnIndex] ?? 'w-full',
                components: current.components ?? [],
            };
        });

        updateLayout(next);
    };

    const addComponent = (rowIndex, colIndex, type) => {
        const next = structuredClone(normalizedLayout);
        const section = next[rowIndex];
        const column = section.columns[colIndex];

        column.components.push({
            type,
            data: getDefaultComponentData(type),
        });

        setSelectedComponent({ rowIndex, colIndex, compIndex: column.components.length - 1, component: column.components[column.components.length - 1] });
        updateLayout(next);
    };

    const updateComponentData = (rowIndex, colIndex, compIndex, field, value) => {
        const next = structuredClone(normalizedLayout);
        const component = next[rowIndex].columns[colIndex].components[compIndex];

        if (component) {
            component.data[field] = value;
        }

        setSelectedComponent((current) => {
            if (!current || current.rowIndex !== rowIndex || current.colIndex !== colIndex || current.compIndex !== compIndex) {
                return current;
            }

            return {
                ...current,
                component,
            };
        });

        updateLayout(next);
    };

    const removeComponent = (rowIndex, colIndex, compIndex) => {
        const next = structuredClone(normalizedLayout);
        next[rowIndex].columns[colIndex].components.splice(compIndex, 1);

        if (selectedComponent && selectedComponent.rowIndex === rowIndex && selectedComponent.colIndex === colIndex && selectedComponent.compIndex === compIndex) {
            setSelectedComponent(null);
        }

        updateLayout(next);
    };

    const handleSave = (event) => {
        event.preventDefault();
        setSaving(true);

        router.post(`/console/pages/edit/${page.id}`, {
            title,
            layout: normalizedLayout,
        }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    const selectedPreview = selectedComponent?.component ?? null;

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            <div className="mx-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Page builder</p>
                        <h1 className="mt-2 text-2xl font-bold text-slate-900">{title || 'Untitled page'}</h1>
                    </div>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save page'}
                    </button>
                </div>

                <div className="grid gap-8 p-6 grid-cols-[1fr_2fr] ">
                    <div className="space-y-6">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <label className="mb-2 block text-sm font-medium text-slate-700">Page title</label>
                            <input
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-blue-400"
                                placeholder="Enter page title"
                            />
                        </div>

                        {normalizedLayout.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                                <p className="text-lg font-semibold text-slate-700">No sections yet</p>
                                <p className="mt-2 text-sm text-slate-500">Add a section to start building the page.</p>
                                <button
                                    type="button"
                                    onClick={addSection}
                                    className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                                >
                                    Add first section
                                </button>
                            </div>
                        )}

                        {normalizedLayout.map((section, rowIndex) => (
                            <div key={section.id || rowIndex} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Section {rowIndex + 1}</span>
                                        <select
                                            value={section.column_count ?? 1}
                                            onChange={(event) => changeSectionColumnCount(rowIndex, event.target.value)}
                                            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700"
                                        >
                                            {[1, 2, 3, 4].map((option) => (
                                                <option key={option} value={option}>{option} column{option > 1 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeSection(rowIndex)}
                                        className="text-sm font-medium text-red-600 hover:text-red-500"
                                    >
                                        Remove section
                                    </button>
                                </div>

                                <div className="grid">
                                    {section.columns.map((column, colIndex) => (
                                        <div key={column.id || colIndex} className={`${column.width} min-h-[200px] rounded-xl border border-slate-200 bg-slate-50 p-3`}>
                                            <div className="mb-3 flex items-center justify-between">
                                                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Column {colIndex + 1}</span>
                                                <select
                                                    value={column.width}
                                                    onChange={(event) => {
                                                        const next = structuredClone(normalizedLayout);
                                                        next[rowIndex].columns[colIndex].width = event.target.value;
                                                        updateLayout(next);
                                                    }}
                                                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700"
                                                >
                                                    {['w-full', 'w-1/2', 'w-1/3', 'w-1/4'].map((option) => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-3">
                                                {column.components.length === 0 && (
                                                    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-3 text-center text-xs text-slate-500">
                                                        Empty column
                                                    </div>
                                                )}

                                                {column.components.map((component, compIndex) => {
                                                    const summary = renderComponentSummary(component);
                                                    return (
                                                        <button
                                                            key={`${component.type}-${compIndex}`}
                                                            type="button"
                                                            onClick={() => setSelectedComponent({ rowIndex, colIndex, compIndex, component })}
                                                            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-300 hover:bg-blue-50"
                                                        >
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{summary.label}</span>
                                                                <span className="text-xs text-slate-400">#{compIndex + 1}</span>
                                                            </div>
                                                            <p className="mt-2 text-sm text-slate-700">{summary.description}</p>
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-4 space-y-2">
                                                {Object.entries(componentLibrary).map(([type, config]) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => addComponent(rowIndex, colIndex, type)}
                                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                                                    >
                                                        + {config.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addSection}
                            className="w-full rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                            + Add section
                        </button>
                    </div>

                    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Preview</h2>

                        {!selectedPreview ? (
                            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                                Select a component to edit the content and preview it live.
                            </div>
                        ) : (
                            <div className="mt-6 space-y-4">
                                <div className="rounded-xl border border-slate-200 bg-white p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">{renderComponentSummary(selectedPreview).label}</p>

                                    {selectedPreview.type === 'hero' && (
                                        <div className="mt-3 space-y-3">
                                            <input
                                                value={selectedPreview.data.title ?? ''}
                                                onChange={(event) => updateComponentData(selectedComponent.rowIndex, selectedComponent.colIndex, selectedComponent.compIndex, 'title', event.target.value)}
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm !bg-slate-100"
                                                placeholder="Title"
                                            />
                                            <input
                                                value={selectedPreview.data.subtitle ?? ''}
                                                onChange={(event) => updateComponentData(selectedComponent.rowIndex, selectedComponent.colIndex, selectedComponent.compIndex, 'subtitle', event.target.value)}
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm !bg-slate-100"
                                                placeholder="Subtitle"
                                            />
                                        </div>
                                    )}

                                    {selectedPreview.type === 'text-block' && (
                                        <textarea
                                            rows={6}
                                            value={selectedPreview.data.content ?? ''}
                                            onChange={(event) => updateComponentData(selectedComponent.rowIndex, selectedComponent.colIndex, selectedComponent.compIndex, 'content', event.target.value)}
                                            className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                            placeholder="Content"
                                        />
                                    )}

                                    {selectedPreview.type === 'projects-grid' && (
                                        <div className="mt-3">
                                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Project count</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={selectedPreview.data.limit ?? 6}
                                                onChange={(event) => updateComponentData(selectedComponent.rowIndex, selectedComponent.colIndex, selectedComponent.compIndex, 'limit', Number(event.target.value || 1))}
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                            />
                                        </div>
                                    )}

                                    {selectedPreview.type === 'media' && (
                                        <div className="mt-3 space-y-3">
                                            <input
                                                value={selectedPreview.data.image_url ?? ''}
                                                onChange={(event) => updateComponentData(selectedComponent.rowIndex, selectedComponent.colIndex, selectedComponent.compIndex, 'image_url', event.target.value)}
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                                placeholder="Image URL"
                                            />
                                            <input
                                                value={selectedPreview.data.image_alt ?? ''}
                                                onChange={(event) => updateComponentData(selectedComponent.rowIndex, selectedComponent.colIndex, selectedComponent.compIndex, 'image_alt', event.target.value)}
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                                placeholder="Image alt text"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Live preview</p>
                                    {selectedPreview.type === 'hero' && (
                                        <div className="mt-3 rounded-xl bg-slate-900 p-6 text-white">
                                            <h3 className="text-2xl font-bold">{selectedPreview.data.title || 'Hero title'}</h3>
                                            <p className="mt-2 text-sm text-slate-300">{selectedPreview.data.subtitle || 'Hero subtitle'}</p>
                                        </div>
                                    )}

                                    {selectedPreview.type === 'text-block' && (
                                        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                                            {selectedPreview.data.content || 'Write text here...'}
                                        </div>
                                    )}

                                    {selectedPreview.type === 'projects-grid' && (
                                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                                            {Array.from({ length: Math.max(1, Number(selectedPreview.data.limit ?? 6)) }).map((_, index) => (
                                                <div key={index} className="rounded-xl border border-slate-200 bg-slate-100 p-3 text-xs text-slate-600">
                                                    Project {index + 1}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {selectedPreview.type === 'media' && (
                                        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                            <img
                                                src={selectedPreview.data.image_url || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72'}
                                                alt={selectedPreview.data.image_alt || 'Media preview'}
                                                className="h-40 w-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeComponent(selectedComponent.rowIndex, selectedComponent.colIndex, selectedComponent.compIndex)}
                                    className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                                >
                                    Remove block
                                </button>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}