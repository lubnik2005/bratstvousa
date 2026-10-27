<?php

namespace App\Console\Commands;

use App\Models\BibleEducationNewsArticle;
use App\Models\ChildrensNewsArticle;
use App\Models\FamilyNewsArticle;
use App\Models\MusicNewsArticle;
use App\Models\NewsArticle;
use App\Models\YouthNewsArticle;
use App\Nova\Traits\SharedFields;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Spatie\Image\Enums\ImageDriver;
use Spatie\Image\Image;
use Throwable;

class GenerateFeaturedImageThumbnails extends Command
{
    protected $signature = 'media:generate-featured-thumbnails {--dry-run : Report images without writing thumbnails}';

    protected $description = 'Generate WebP thumbnails for existing news featured images.';

    public function handle(): int
    {
        $disk = config('filesystems.default');
        $created = 0;
        $failed = 0;
        $skipped = 0;

        foreach ($this->articleModels() as $model) {
            // All news content is in D1, including legacy models that still
            // inherit the default (plumbing) connection.
            $articleModel = (new $model)->setConnection('d1');
            $connection = $articleModel->getConnectionName();

            if (! Schema::connection($connection)->hasTable($articleModel->getTable())) {
                $this->warn("Skipping missing table {$articleModel->getTable()}.");

                continue;
            }

            $articleModel->newQuery()->whereNotNull('featured_image')->orderBy('id')->each(function ($article) use ($disk, &$created, &$failed, &$skipped) {
                $path = $article->featured_image;
                if (! is_string($path) || $path === '') {
                    return;
                }

                $thumbnailPath = SharedFields::featuredImageThumbnailPath($path);
                if (Storage::disk($disk)->exists($thumbnailPath)) {
                    $skipped++;

                    return;
                }

                if ($this->option('dry-run')) {
                    $this->line("Would create {$thumbnailPath}");

                    return;
                }

                $sourcePath = tempnam(sys_get_temp_dir(), 'featured-source-');
                $thumbnailFile = tempnam(sys_get_temp_dir(), 'featured-thumbnail-');

                try {
                    file_put_contents($sourcePath, Storage::disk($disk)->get($path));
                    Image::useImageDriver(ImageDriver::Gd)
                        ->loadFile($sourcePath)->width(480)->format('webp')->save($thumbnailFile);
                    Storage::disk($disk)->put($thumbnailPath, file_get_contents($thumbnailFile), [
                        'ContentType' => 'image/webp',
                        'CacheControl' => 'public, max-age=31536000, immutable',
                    ]);
                    $created++;
                } catch (Throwable $exception) {
                    $failed++;
                    report($exception);
                    $this->error("Failed: {$path}");
                } finally {
                    @unlink($sourcePath);
                    @unlink($thumbnailFile);
                }
            });
        }

        $this->info("Created {$created}; skipped {$skipped} existing thumbnails; failed {$failed}.");

        return $failed === 0 ? self::SUCCESS : self::FAILURE;
    }

    /** @return array<class-string<Model>> */
    private function articleModels(): array
    {
        return [
            NewsArticle::class,
            YouthNewsArticle::class,
            ChildrensNewsArticle::class,
            FamilyNewsArticle::class,
            MusicNewsArticle::class,
            BibleEducationNewsArticle::class,
        ];
    }
}
