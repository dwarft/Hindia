<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('watchlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('movie_id'); // ID film (dari API)
            $table->string('title');
            $table->string('poster_path')->nullable();
            $table->string('vote_average')->nullable();
            $table->string('release_date')->nullable();
            $table->timestamps();

            // Memastikan 1 user tidak bisa menyimpan film yang sama berulang kali
            $table->unique(['user_id', 'movie_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('watchlists');
    }
};