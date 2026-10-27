<?php

namespace Tests\Feature;

use App\Models\NewsArticle;
use App\Nova\Traits\SharedFields;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FeaturedImageThumbnailsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['filesystems.default' => 'local']);
        Storage::fake('local');
    }

    public function test_upload_stores_original_and_webp_thumbnail_using_gd(): void
    {
        $request = Request::create('/', 'POST', [], [], [
            'featured_image' => UploadedFile::fake()->image('news.jpg', 960, 640),
        ]);
        $field = collect(SharedFields::articleFields())->firstWhere('attribute', 'featured_image');

        $result = ($field->storageCallback)(
            $request, new NewsArticle, 'featured_image', 'featured_image', 'local', 'upfiles/news'
        );

        $path = $result['featured_image'];
        Storage::disk('local')->assertExists($path);
        $this->assertThumbnail(SharedFields::featuredImageThumbnailPath($path));
    }

    public function test_backfill_supports_dry_run_and_skips_existing_thumbnails(): void
    {
        config(['database.connections.d1' => ['driver' => 'sqlite', 'database' => ':memory:']]);
        DB::purge('d1');
        DB::forgetExtension('d1');
        Schema::connection('d1')->create('news_articles', function (Blueprint $table) {
            $table->id();
            $table->string('featured_image');
        });
        $path = UploadedFile::fake()->image('news.jpg', 960, 640)->store('upfiles/news', 'local');
        DB::connection('d1')->table('news_articles')->insert(['featured_image' => $path]);
        $thumbnailPath = SharedFields::featuredImageThumbnailPath($path);

        $this->artisan('media:generate-featured-thumbnails', ['--dry-run' => true])->assertSuccessful();
        Storage::disk('local')->assertMissing($thumbnailPath);

        $this->artisan('media:generate-featured-thumbnails')->assertSuccessful();
        $this->assertThumbnail($thumbnailPath);

        $this->artisan('media:generate-featured-thumbnails')
            ->expectsOutput('Created 0; skipped 1 existing thumbnails; failed 0.')
            ->assertSuccessful();
    }

    private function assertThumbnail(string $path): void
    {
        Storage::disk('local')->assertExists($path);
        $info = getimagesize(Storage::disk('local')->path($path));
        $this->assertSame('image/webp', $info['mime']);
        $this->assertSame(480, $info[0]);
        $this->assertSame(320, $info[1]);
    }
}
