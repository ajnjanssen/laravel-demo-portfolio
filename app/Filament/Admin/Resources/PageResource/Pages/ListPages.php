<?php

namespace App\Filament\Admin\Resources\PageResource\Pages;

use App\Filament\Admin\Resources\PageResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPages extends ListRecords
{
    protected static string $resource = PageResource::class;

    public static function shouldRegisterNavigation(array $parameters = []): bool
    {
        return false;
    }

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->url(PageResource::getUrl('create'))
                ->openUrlInNewTab(false),
        ];
    }
}
