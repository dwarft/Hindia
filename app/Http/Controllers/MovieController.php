<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class MovieController extends Controller
{
    private string $baseUrl = 'https://api.themoviedb.org/3';

    public function index()
    {
        $apiKey = config('services.tmdb.key', env('TMDB_API_KEY'));

        // Cache data selama 1 jam (3600 detik)
        $data = Cache::remember('movie_stream_homepage', 3600, function () use ($apiKey) {
            
            // 1. Fetch Daftar Genre untuk Mapping Nama Genre
            $genresResponse = Http::get("{$this->baseUrl}/genre/movie/list", [
                'api_key' => $apiKey,
                'language' => 'id-ID'
            ])->json();
            
            $genreMap = collect($genresResponse['genres'] ?? [])->pluck('name', 'id');

            // 2. Fetch Trending Film (Hari Ini)
            $trendingResponse = Http::get("{$this->baseUrl}/trending/movie/day", [
                'api_key' => $apiKey,
                'language' => 'id-ID'
            ])->json();

            // 3. Fetch Popular Movies
            $popularResponse = Http::get("{$this->baseUrl}/movie/popular", [
                'api_key' => $apiKey,
                'language' => 'id-ID'
            ])->json();

            $trendingResults = $trendingResponse['results'] ?? [];
            $featuredRaw = $trendingResults[0] ?? null;

            // Format Data Hero Featured Movie
            $featuredMovie = null;
            if ($featuredRaw) {
                // Map Genre IDs ke Nama Genre
                $genreNames = collect($featuredRaw['genre_ids'] ?? [])
                    ->map(fn($id) => $genreMap->get($id, 'Movie'))
                    ->take(3)
                    ->toArray();

                $featuredMovie = [
                    'id' => $featuredRaw['id'],
                    'title' => $featuredRaw['title'] ?? $featuredRaw['original_title'],
                    'rating' => number_format($featuredRaw['vote_average'], 1),
                    'year' => substr($featuredRaw['release_date'] ?? '', 0, 4),
                    'duration' => 'HD',
                    'genre' => !empty($genreNames) ? $genreNames : ['Action', 'Sci-Fi'],
                    'description' => $featuredRaw['overview'] ?: 'Tidak ada deskripsi tersedia dalam bahasa Indonesia.',
                    'banner' => $featuredRaw['backdrop_path'] 
                        ? 'https://image.tmdb.org/t/p/original' . $featuredRaw['backdrop_path']
                        : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop',
                ];
            }

            // Format Data Katalog Film Grid
            $movies = collect($popularResponse['results'] ?? [])->map(function ($movie) use ($genreMap) {
                $firstGenreId = $movie['genre_ids'][0] ?? null;
                return [
                    'id' => $movie['id'],
                    'title' => $movie['title'] ?? $movie['original_title'],
                    'rating' => number_format($movie['vote_average'], 1),
                    'genre' => $genreMap->get($firstGenreId, 'Film'),
                    'poster' => $movie['poster_path'] 
                        ? 'https://image.tmdb.org/t/p/w500' . $movie['poster_path']
                        : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
                ];
            })->take(10)->toArray();

            return [
                'featuredMovie' => $featuredMovie,
                'movies' => $movies,
            ];
        });

        return Inertia::render('MovieStream', [
            'featuredMovie' => $data['featuredMovie'],
            'movies' => $data['movies'],
        ]);
    }

    public function show($id)
    {
        $apiKey = env('TMDB_API_KEY'); // Simpan API Key di file .env
        
        // Panggil API TMDB langsung berdasarkan $id
        $response = Http::get("https://api.themoviedb.org/3/movie/{$id}", [
            'api_key' => $apiKey,
            'language' => 'id-ID', // atau 'en-US'
            'append_to_response' => 'credits', // Untuk mengambil data sutradara & pemain
        ]);

        if ($response->failed()) {
            abort(404, 'Film tidak ditemukan');
        }

        $movieData = $response->json();

        // Mappings / Format data dari response API agar pas ke komponen Inertia
        $movie = [
            'id' => $movieData['id'],
            'title' => $movieData['title'],
            'year' => substr($movieData['release_date'] ?? '', 0, 4),
            'duration' => $movieData['runtime'] . ' menit',
            'rating' => round($movieData['vote_average'], 1),
            'genres' => collect($movieData['genres'])->pluck('name')->toArray(),
            'banner' => 'https://image.tmdb.org/t/p/original' . $movieData['backdrop_path'],
            'poster' => 'https://image.tmdb.org/t/p/w500' . $movieData['poster_path'],
            'description' => $movieData['overview'],
            'director' => collect($movieData['credits']['crew'] ?? [])->firstWhere('job', 'Director')['name'] ?? '-',
            'cast' => collect($movieData['credits']['cast'] ?? [])->take(5)->pluck('name')->toArray(),
        ];

        return Inertia::render('MovieDetail', [
            'movie' => $movie,
        ]);
    }
}