<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MovieController extends Controller
{
    public function index()
    {
        // Data Dummy Hero / Featured Movie
        $featuredMovie = [
            'title' => 'Cyberpunk 2077: Edgerunners',
            'rating' => '9.8',
            'year' => '2024',
            'duration' => '2j 15m',
            'genre' => ['Action', 'Sci-Fi', 'Cyberpunk'],
            'description' => 'Seorang anak jalanan yang mencoba bertahan hidup di kota masa depan yang terobsesi dengan teknologi dan modifikasi tubuh.',
            'banner' => 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop'
        ];

        // Data Dummy Katalog Film
        $movies = [
            [
                'id' => 1,
                'title' => 'Dune: Part Two',
                'rating' => '8.6',
                'genre' => 'Sci-Fi',
                'poster' => 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop'
            ],
            [
                'id' => 2,
                'title' => 'Interstellar',
                'rating' => '8.7',
                'genre' => 'Adventure',
                'poster' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'
            ],
            [
                'id' => 3,
                'title' => 'Spider-Man: Across the Spider-Verse',
                'rating' => '8.9',
                'genre' => 'Animation',
                'poster' => 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=600&auto=format&fit=crop'
            ],
            [
                'id' => 4,
                'title' => 'Oppenheimer',
                'rating' => '8.9',
                'genre' => 'Biography',
                'poster' => 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop'
            ],
            [
                'id' => 5,
                'title' => 'Blade Runner 2049',
                'rating' => '8.0',
                'genre' => 'Sci-Fi',
                'poster' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop'
            ]
        ];

        // Merender komponen React melalui Inertia.js
        return Inertia::render('MovieStream', [
            'featuredMovie' => $featuredMovie,
            'movies' => $movies,
        ]);
    }
}