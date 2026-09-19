<?php

namespace App\Filament\Admin\Resources;

use App\Filament\Admin\Resources\PageResource\Pages\CreatePage;
use App\Filament\Admin\Resources\PageResource\Pages\EditPage;
use App\Filament\Admin\Resources\PageResource\Pages\ListPages;
use App\Models\Page;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PageResource extends Resource
{
    protected static ?string $model = Page::class;

    protected static ?string $navigationIcon = "heroicon-o-document-text";

    protected static ?string $navigationLabel = "Pages";

    protected static ?string $modelLabel = "Page";

    protected static ?string $pluralModelLabel = "Pages";

    public static function canAccess(): bool
    {
        return true;
    }

    public static function shouldRegisterNavigation(array $parameters = []): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Grid::make(2)
                    ->schema([
                        TextInput::make("title")
                            ->label("Title")
                            ->required()
                            ->maxLength(255),

                        TextInput::make("slug")
                            ->label("Slug")
                            ->required()
                            ->maxLength(255)
                            ->unique(Page::class, "slug", ignoreRecord: true),

                        Select::make("parent_id")
                            ->label("Parent page")
                            ->relationship("parent", "title")
                            ->searchable()
                            ->preload()
                            ->nullable(),

                        Select::make("status")
                            ->label("Status")
                            ->options([
                                "draft" => "Draft",
                                "published" => "Published",
                                "archived" => "Archived",
                            ])
                            ->default("draft")
                            ->required(),
                    ]),

                Repeater::make("layout")
                    ->label("Content sections")
                    ->schema([
                        Repeater::make("columns")
                            ->label("Columns")
                            ->schema([
                                Select::make("width")
                                    ->label("Column width")
                                    ->options([
                                        "w-full" => "Full width",
                                        "w-1/2" => "Half width",
                                        "w-1/3" => "Third width",
                                        "w-2/3" => "Two thirds",
                                    ])
                                    ->default("w-full")
                                    ->required(),

                                Repeater::make("components")
                                    ->label("Components")
                                    ->schema([
                                        Select::make("type")
                                            ->label("Component")
                                            ->options([
                                                "hero" => "Hero",
                                                "text-block" => "Text block",
                                                "projects-grid" => "Projects grid",
                                                "media" => "Media block",
                                            ])
                                            ->required(),

                                        TextInput::make("data.title")
                                            ->label("Title")
                                            ->nullable(),

                                        TextInput::make("data.subtitle")
                                            ->label("Subtitle")
                                            ->nullable(),

                                        Textarea::make("data.content")
                                            ->label("Content")
                                            ->rows(5)
                                            ->nullable(),

                                        TextInput::make("data.limit")
                                            ->label("Project count")
                                            ->numeric()
                                            ->default(6)
                                            ->nullable(),

                                        TextInput::make("data.image_url")
                                            ->label("Media URL")
                                            ->url()
                                            ->nullable(),

                                        TextInput::make("data.image_alt")
                                            ->label("Image alt text")
                                            ->nullable(),
                                    ])
                                    ->collapsible()
                                    ->default([]),
                            ])
                            ->collapsible()
                            ->default([
                                ["width" => "w-full", "components" => []],
                            ]),
                    ])
                    ->collapsible()
                    ->default([]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make("title")
                    ->searchable()
                    ->sortable(),
                TextColumn::make("slug")
                    ->searchable(),
                TextColumn::make("status")
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        "published" => "success",
                        "archived" => "warning",
                        default => "gray",
                    }),
                TextColumn::make("parent.title")
                    ->label("Parent")
                    ->sortable()
                    ->searchable(),
            ])
            ->filters([])
            ->actions([
                Tables\Actions\Action::make('openBuilder')
                    ->label('Open builder')
                    ->icon('heroicon-o-puzzle-piece')
                    ->color('primary')
                    ->url(fn (Page $record) => route('admin.pages.builder', ['page' => $record]))
                    ->openUrlInNewTab(false),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            "index" => ListPages::route("/"),
            "create" => CreatePage::route("/create"),
        ];
    }

    public static function getNavigationGroup(): ?string
    {
        return "Content";
    }
}