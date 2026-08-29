
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Search, Star, PlayCircle, Filter, Sparkles, Film } from 'lucide-react';

export default function Index({ movies = [], genres = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');

    // Data dummy fallback jika belum terkoneksi ke backend TMDB
    const dummyMovies = [
        {
            id: 157336,
            title: 'Interstellar',
            release_date: '2014',
            vote_average: 8.4,
            genre: 'Sci-Fi',
            poster_path: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
            backdrop_path: 'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo6LEe22y-8.jpg',
            overview: 'Petualangan sekelompok penjelajah yang menggunakan lubang cacing untuk memastikan kelangsungan hidup umat manusia.'
        },
        {
            id: 155,
            title: 'The Dark Knight',
            release_date: '2008',
            vote_average: 8.5,
            genre: 'Action',
            poster_path: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            backdrop_path: 'https://image.tmdb.org/t/p/original/nMK481YrD2ZqwhBv2MySuobERvU.jpg',
            overview: 'Batman menghadapi musuh terbesarnya, Joker, yang ingin menghancurkan kedamaian di kota Gotham.'
        },
        {
            id: 27205,
            title: 'Inception',
            release_date: '2010',
            vote_average: 8.3,
            genre: 'Sci-Fi',
            poster_path: 'https://image.tmdb.org/t/p/w500/oYuLEW9W2vBBCgoy2otRIiqfGvI.jpg',
            backdrop_path: 'https://image.tmdb.org/t/p/original/8s4h9friP6Ci3adRGmZACd2gO1b.jpg',
            overview: 'Seorang pencuri yang mencuri rahasia perusahaan melalui penggunaan teknologi berbagi mimpi.'
        },
        {
            id: 438631,
            title: 'Dune',
            release_date: '2021',
            vote_average: 7.8,
            genre: 'Adventure',
            poster_path: 'https://image.tmdb.org/t/p/w500/d5NGoEVF8qUOiPyCjG2kSLMhYya.jpg',
            backdrop_path: 'https://image.tmdb.org/t/p/original/eeEiyzG0v6N2x8627ftTx25Z24F.jpg',
            overview: 'Putra dari keluarga bangsawan dipercayakan dengan perlindungan aset paling berharga di galaksi.'
        }
    ];

    const displayMovies = movies.length > 0 ? movies : dummyMovies;
    const heroMovie = displayMovies[0];

    // Filter Logic Sederhana di Client-Side
    const filteredMovies = displayMovies.filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });

    const categoryList = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Horror'];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-slate-100">
                    Katalog Film
                </h2>
            }
        >
            <Head title="Katalog Film - StreamX" />

            <div className="py-6 bg-slate-950 min-h-screen text-slate-100 space-y-8 px-4 sm:px-6 lg:px-8">
                
                {/* 1. HERO FEATURED BANNER */}
                {heroMovie && (
                    <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 group">
                        <img 
                            src={heroMovie.backdrop_path} 
                            alt={heroMovie.title} 
                            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-6 sm:p-10 space-y-3 max-w-2xl z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-600/80 text-white backdrop-blur-md">
                                <Sparkles className="w-3.5 h-3.5" /> Trending Minggu Ini
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                                {heroMovie.title}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                                {heroMovie.overview}
                            </p>
                            <div className="pt-2 flex items-center gap-4">
                                <Link
                                    href={`/movie/${heroMovie.id}`}
                                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95"
                                >
                                    <PlayCircle className="w-5 h-5" /> Tonton Sekarang
                                </Link>
                                <span className="flex items-center gap-1 text-amber-400 font-bold text-sm bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800">
                                    <Star className="w-4 h-4 fill-amber-400" /> {heroMovie.vote_average}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. SEARCH & FILTER BAR */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                    
                    {/* Input Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari judul film..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                        />
                    </div>

                    {/* Filter Category Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                        <Filter className="w-4 h-4 text-slate-500 hidden lg:block mr-1" />
                        {categoryList.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedGenre(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                    selectedGenre === cat
                                        ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. MOVIE GRID */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                            <Film className="w-5 h-5 text-red-500" /> Rekomendasi Untukmu
                        </h3>
                        <span className="text-xs text-slate-400">
                            Menampilkan {filteredMovies.length} film
                        </span>
                    </div>

                    {filteredMovies.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                            {filteredMovies.map((movie) => (
                                <Link
                                    key={movie.id}
                                    href={`/movie/${movie.id}`}
                                    className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-red-600/10 flex flex-col"
                                >
                                    {/* Poster Image */}
                                    <div className="aspect-[2/3] w-full overflow-hidden relative">
                                        <img
                                            src={movie.poster_path}
                                            alt={movie.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="p-3 bg-red-600 rounded-full text-white shadow-lg shadow-red-600/50 scale-75 group-hover:scale-100 transition-transform">
                                                <PlayCircle className="w-8 h-8" />
                                            </div>
                                        </div>
                                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md text-amber-400 px-2 py-1 rounded-lg text-xs font-bold border border-slate-800">
                                            <Star className="w-3 h-3 fill-amber-400" /> {movie.vote_average}
                                        </div>
                                    </div>

                                    {/* Movie Info */}
                                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-1">
                                        <h4 className="font-bold text-sm text-slate-100 group-hover:text-red-400 transition-colors line-clamp-1">
                                            {movie.title}
                                        </h4>
                                        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                                            <span>{movie.release_date}</span>
                                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                                                {movie.genre || 'Film'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
                            <Film className="w-12 h-12 text-slate-600 mx-auto" />
                            <p className="text-slate-400 text-sm">Film yang kamu cari tidak ditemukan.</p>
                        </div>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}