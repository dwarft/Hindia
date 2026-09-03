
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Star, Filter, Film } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Explore({ movies = [], genres = [], filters = {} }) {
    const [search, setSearch] = useState(filters.query || '');
    const [selectedGenre, setSelectedGenre] = useState(filters.genre || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'popularity.desc');

    // Live search menggunakan debounce 500ms
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.query || '')) {
                applyFilters({ query: search });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const applyFilters = (newFilters) => {
        router.get(
            route('movies.explore'),
            {
                query: search,
                genre: selectedGenre,
                sort_by: sortBy,
                ...newFilters,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleGenreChange = (e) => {
        const value = e.target.value;
        setSelectedGenre(value);
        applyFilters({ genre: value, query: '' }); // reset query jika filter genre
        setSearch('');
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        applyFilters({ sort_by: value });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-slate-100">
                    Eksplorasi Film
                </h2>
            }
        >
            <Head title="Eksplorasi Film - StreamX" />

            <div className="py-8 bg-slate-950 min-h-screen text-slate-100">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Control Bar: Input Search & Dropdown Filter */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row gap-4 justify-between items-center">
                        
                        {/* Search Input */}
                        <div className="relative w-full md:w-1/2">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari judul film..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                            />
                        </div>

                        {/* Filter Options */}
                        <div className="flex w-full md:w-auto gap-3">
                            <select
                                value={selectedGenre}
                                onChange={handleGenreChange}
                                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-300 focus:border-red-500 outline-none cursor-pointer"
                            >
                                <option value="">Semua Genre</option>
                                {genres.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={sortBy}
                                onChange={handleSortChange}
                                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-300 focus:border-red-500 outline-none cursor-pointer"
                            >
                                <option value="popularity.desc">Paling Populer</option>
                                <option value="vote_average.desc">Rating Tertinggi</option>
                                <option value="primary_release_date.desc">Rilis Terbaru</option>
                            </select>
                        </div>
                    </div>

                    {/* Hasil Grid Film */}
                    <div>
                        {movies.length === 0 ? (
                            <div className="text-center py-20 space-y-3">
                                <Film className="w-12 h-12 text-slate-600 mx-auto" />
                                <p className="text-slate-400 font-medium">Tidak ada film yang ditemukan.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                                {movies.map((movie) => (
                                    <Link
                                        key={movie.id}
                                        href={`/movie/${movie.id}`}
                                        className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 aspect-[2/3] shadow-lg hover:scale-[1.03] transition-transform"
                                    >
                                        <img
                                            src={
                                                movie.poster_path
                                                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                                                    : 'https://via.placeholder.com/300x450?text=No+Cover'
                                            }
                                            alt={movie.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                            <p className="text-sm font-bold text-white line-clamp-2">{movie.title}</p>
                                            <p className="text-xs text-amber-400 font-semibold mt-1 flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}