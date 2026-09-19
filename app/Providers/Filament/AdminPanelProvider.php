<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use App\Filament\Admin\Resources\PageResource;
use App\Models\Page;
use Filament\Navigation\NavigationBuilder;
use Filament\Navigation\NavigationGroup;
use Filament\Navigation\NavigationItem;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets\AccountWidget;
use Filament\Widgets\FilamentInfoWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public static function getPageNavigationItems(?int $parentId = null): array
    {
        $pages = Page::query()
            ->where('parent_id', $parentId)
            ->orderBy('title')
            ->get();

        $items = [];

        foreach ($pages as $page) {
            $item = NavigationItem::make($page->title)
                ->icon('heroicon-o-document-text')
                ->url(fn () => route('filament.admin.resources.pages.edit', ['record' => $page]));

            $children = static::getPageNavigationItems((int) $page->id);

            if (! empty($children)) {
                $item->childItems($children);
            }

            $items[] = $item;
        }

        return $items;
    }

    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('admin')
            ->path('admin')
            ->brandName('Portfolio CMS')
            ->login()
            ->colors([
                'primary' => Color::Amber,
            ])
            ->resources([
                PageResource::class,
            ])
            ->discoverPages(in: app_path('Filament/Admin/Pages'), for: 'App\Filament\Admin\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->navigation(function (NavigationBuilder $builder): NavigationBuilder {
                return $builder->items([
                    NavigationItem::make('Pages')
                        ->group('Content')
                        ->icon('heroicon-o-document-text')
                        ->url(fn () => route('filament.admin.resources.pages.index'))
                        ->childItems(static::getPageNavigationItems()),
                ]);
            })
            ->navigationGroups([
                NavigationGroup::make('Dashboard')
                    ->collapsed(),
                NavigationGroup::make('Content'),
                NavigationGroup::make('Settings')
                    ->collapsed(),
            ])
            ->discoverWidgets(in: app_path('Filament/Admin/Widgets'), for: 'App\Filament\Admin\Widgets')
            ->widgets([
                AccountWidget::class,
                FilamentInfoWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
