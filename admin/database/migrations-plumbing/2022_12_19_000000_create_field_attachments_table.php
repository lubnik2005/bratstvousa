<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Nova stores editor/file field draft uploads in these two tables. Nova ships
// this migration in vendor, but the container entrypoint only runs the
// plumbing migration path, so it must live here or every resource
// create/update 500s with "no such table: nova_pending_field_attachments".
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('nova_pending_field_attachments')) {
            Schema::create('nova_pending_field_attachments', function (Blueprint $table): void {
                $table->increments('id');
                $table->string('draft_id')->index();
                $table->string('attachment');
                $table->string('disk');
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('nova_field_attachments')) {
            Schema::create('nova_field_attachments', function (Blueprint $table): void {
                $table->increments('id');
                $table->morphs('attachable');
                $table->string('attachment');
                $table->string('disk');
                $table->string('url')->index();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('nova_pending_field_attachments');
        Schema::dropIfExists('nova_field_attachments');
    }
};
