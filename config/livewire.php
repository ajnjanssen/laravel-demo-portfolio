<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Asset URL
    |--------------------------------------------------------------------------
    |
    | By default, Livewire serves its JavaScript from /livewire/livewire.js.
    | In this project, the published asset is served from public/vendor/livewire,
    | so we point the script URL there explicitly to avoid the 404 in the browser.
    |
    */

    'asset_url' => env('LIVEWIRE_ASSET_URL', '/vendor/livewire/livewire.js'),

    'inject_assets' => true,
];
