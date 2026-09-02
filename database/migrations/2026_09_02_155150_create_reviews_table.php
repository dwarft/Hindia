<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('reviews', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->unsignedBigInteger('movie_id'); // ID film dari TMDB
        $table->tinyInteger('rating')->comment('Nilai 1 - 5');
        $table->text('comment');
        $table->timestamps();

        // Mencegah user mengulas film yang sama berkali-kali
        $table->unique(['user_id', 'movie_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
