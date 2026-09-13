<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Nova records an action_event for every create/update/delete performed
// through a resource. Nova ships this migration in vendor, but the container
// entrypoint only runs the plumbing migration path, so it must live here.
// This folds together Nova's two vendor migrations (create + add original/changes).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('action_events', function (Blueprint $table): void {
            $table->id();
            $table->char('batch_id', 36);
            $table->unsignedBigInteger('user_id')->index();
            $table->string('name');
            $table->morphs('actionable');
            $table->morphs('target');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id')->nullable();
            $table->text('fields');
            $table->string('status', 25)->default('running');
            $table->text('exception');
            $table->mediumText('original')->nullable();
            $table->mediumText('changes')->nullable();
            $table->timestamps();

            $table->index(['batch_id', 'model_type', 'model_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('action_events');
    }
};
