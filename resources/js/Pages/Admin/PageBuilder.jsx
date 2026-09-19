import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function PageBuilder({ page }) {
    const [layout, setLayout] = useState(page.layout || []);
    const [title, setTitle] = useState(page.title || '');

    const addRow = () => {
        const newRow = {
            id: 'row-' + Date.now(),
            columns: [
                {
                    width: 'w-full',
                    components: []
                }
            ]
        };
        setLayout([...layout, newRow]);
    };

    const addComponent = (rowIndex, colIndex, type) => {
        const updatedLayout = structuredClone(layout);
        const defaultData = type === 'hero' 
            ? { title: 'Welkom op mijn portfolio', subtitle: 'Software Engineer' }
            : type === 'projects-grid' 
            ? { limit: 6 }
            : { content: 'Voer hier je tekst in...' };

        updatedLayout[rowIndex].columns[colIndex].components.push({
            type,
            data: defaultData
        });

        setLayout(updatedLayout);
    };

    // Data van een specifiek component updaten
    const updateComponentData = (rowIndex, colIndex, compIndex, field, value) => {
        const updatedLayout = structuredClone(layout);
        updatedLayout[rowIndex].columns[colIndex].components[compIndex].data[field] = value;
        setLayout(updatedLayout);
    };

    const removeComponent = (rowIndex, colIndex, compIndex) => {
        const updatedLayout = structuredClone(layout);
        updatedLayout[rowIndex].columns[colIndex].components.splice(compIndex, 1);
        setLayout(updatedLayout);
    };

    const handleSave = (e) => {
        e.preventDefault();
        router.post(`/console/pages/edit/${page.id}`, {
            title,
            layout
        });
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Page Builder: <span className="text-blue-600">{page.title}</span>
                    </h1>
                    <button 
                        onClick={handleSave} 
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-md transition"
                    >
                        Opslaan
                    </button>
                </div>

                {/* Pagina Titel */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pagina Titel</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>

                {/* Layout Builder Section */}
                <div className="space-y-6">
                    {layout.map((row, rIdx) => (
                        <div key={row.id || rIdx} className="border-2 border-dashed border-gray-300 p-4 rounded-lg ">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-mono uppercase tracking-wider text-gray-500">Sectie {rIdx + 1}</span>
                                <button 
                                    onClick={() => setLayout(layout.filter((_, i) => i !== rIdx))} 
                                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                >
                                    Verwijder Sectie
                                </button>
                            </div>

                            {/* Columns */}
                            {row.columns.map((col, cIdx) => (
                                <div key={cIdx} className="bg-white p-4 rounded border border-gray-200">
                                    <div className="space-y-4 mb-4">
                                        {col.components.map((comp, compIdx) => (
                                            <div key={compIdx} className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg">
                                                <div className="flex justify-between items-center mb-3 pb-2 border-b border-blue-100">
                                                    <span className="font-bold text-blue-900 uppercase text-xs">{comp.type}</span>
                                                    <button 
                                                        onClick={() => removeComponent(rIdx, cIdx, compIdx)}
                                                        className="text-red-500 text-xs hover:underline font-medium"
                                                    >
                                                        Verwijder Block
                                                    </button>
                                                </div>

                                                {/* Dynamic Form Input per Component Type */}
                                                {comp.type === 'hero' && (
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Titel</label>
                                                            <input 
                                                                type="text"
                                                                value={comp.data.title || ''}
                                                                onChange={(e) => updateComponentData(rIdx, cIdx, compIdx, 'title', e.target.value)}
                                                                className="w-full text-sm border border-gray-300 p-2 rounded bg-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Subtitel</label>
                                                            <input 
                                                                type="text"
                                                                value={comp.data.subtitle || ''}
                                                                onChange={(e) => updateComponentData(rIdx, cIdx, compIdx, 'subtitle', e.target.value)}
                                                                className="w-full text-sm border border-gray-300 p-2 rounded bg-white"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {comp.type === 'projects-grid' && (
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Aantal projecten tonen</label>
                                                        <input 
                                                            type="number"
                                                            value={comp.data.limit || 6}
                                                            onChange={(e) => updateComponentData(rIdx, cIdx, compIdx, 'limit', parseInt(e.target.value) || 0)}
                                                            className="w-32 text-sm border border-gray-300 p-2 rounded bg-white"
                                                        />
                                                    </div>
                                                )}

                                                {comp.type === 'text-block' && (
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">Inhoud (HTML / Tekst)</label>
                                                        <textarea 
                                                            rows={4}
                                                            value={comp.data.content || ''}
                                                            onChange={(e) => updateComponentData(rIdx, cIdx, compIdx, 'content', e.target.value)}
                                                            className="w-full text-sm border border-gray-300 p-2 rounded bg-white font-mono"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Component Toevoegen Buttons */}
                                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                                        <button 
                                            type="button"
                                            onClick={() => addComponent(rIdx, cIdx, 'hero')}
                                            className="text-xs -100 hover:-200 px-3 py-1.5 rounded text-gray-700 font-medium border border-gray-300"
                                        >
                                            + Hero Block
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => addComponent(rIdx, cIdx, 'projects-grid')}
                                            className="text-xs -100 hover:-200 px-3 py-1.5 rounded text-gray-700 font-medium border border-gray-300"
                                        >
                                            + Projects Grid
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => addComponent(rIdx, cIdx, 'text-block')}
                                            className="text-xs -100 hover:-200 px-3 py-1.5 rounded text-gray-700 font-medium border border-gray-300"
                                        >
                                            + Text Block
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Rij Toevoegen Knop */}
                <button 
                    type="button"
                    onClick={addRow}
                    className="mt-6 w-full py-3 border-2 border-dashed border-blue-400 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
                >
                    + Nieuwe Sectie Toevoegen
                </button>
            </div>
        </div>
    );
}