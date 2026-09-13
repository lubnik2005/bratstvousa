<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Nova's notification center polls /nova-api/nova-notifications on every
// authenticated page. Nova ships this migration in vendor, but the container
// entrypoint only runs the plumbing migration path, so it must live here.
// This folds together Nova's two vendor migrations (create + add soft deletes).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nova_notifications', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->morphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nova_notifications');
    }
};
