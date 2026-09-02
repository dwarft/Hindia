
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Star, Heart, ArrowLeft, Play, X, Clock, Calendar, Film } from 'lucide-react';

export default function Show({ movie, isWatchlisted }) {
    const [showTrailer, setShowTrailer] = useState(false);
    const [inWatchlist, setInWatchlist] = useState(isWatchlisted);
    const { auth } = usePage().props;
    const { data, setData, post, processing, reset, errors } = useForm({
        movie_id: movie.id,
        rating: 5,
        comment: '',
    });

    const submitReview = (e) => {
        e.preventDefault();
        post(route('reviews.store'), {
            onSuccess: () => reset('comment'),
        });
    };

    // Ambil trailer youtube dari data
    const trailerKey = movie.videos?.results?.find(v => v.type === 'Trailer')?.key || movie.videos?.results[0]?.key;

    // Poster & Backdrop URL
    const backdropUrl = movie.backdrop_path 
        ? (movie.backdrop_path.startsWith('http') ? movie.backdrop_path : `https://image.tmdb.org/t/p/original${movie.backdrop_path}`)
        : 'https://via.placeholder.com/1280x720';

    const posterUrl = movie.poster_path 
        ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
        : 'https://via.placeholder.com/500x750';

    // Toggle Watchlist
    const handleWatchlistToggle = () => {
        setInWatchlist(!inWatchlist);
        router.post(route('watchlist.toggle'), {
            movie_id: movie.id,
            title: movie.title,
            poster_path: posterUrl,
            vote_average: movie.vote_average ? round(movie.vote_average, 1) : null,
            release_date: movie.release_date ? movie.release_date.substring(0, 4) : 'N/A',
        }, {
            preserveScroll: true,
        });
    };

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link href="/movies" className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h2 className="text-xl font-bold text-slate-100 truncate">
                        {movie.title}
                    </h2>
                </div>
            }
        >
            <Head title={`${movie.title} - StreamX`} />

            <div className="bg-slate-950 min-h-screen text-slate-100 pb-12">
                
                {/* 1. BACKDROP HERO BANNER */}
                <div className="relative w-full h-[400px] sm:h-[500px] overflow-hidden">
                    <img 
                        src={backdropUrl} 
                        alt={movie.title}
                        className="w-full h-full object-cover object-top opacity-40 blur-xs" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent" />
                </div>

                {/* 2. MAIN CONTENT OVERLAY */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10 space-y-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        
                        {/* Poster Image */}
                        <div className="w-48 sm:w-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 mx-auto md:mx-0">
                            <img src={posterUrl} alt={movie.title} className="w-full h-auto object-cover" />
                        </div>

                        {/* Movie Details */}
                        <div className="flex-1 space-y-5 text-center md:text-left">
                            <div className="space-y-2">
                                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                                    {movie.title}
                                </h1>
                                
                                {/* Meta Badges */}
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-300 pt-1">
                                    <span className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                                        <Star className="w-3.5 h-3.5 fill-amber-400" /> 
                                        {movie.vote_average ? round(movie.vote_average, 1) : 'N/A'}
                                    </span>
                                    {movie.release_date && (
                                        <span className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {movie.release_date.substring(0, 4)}
                                        </span>
                                    )}
                                    {movie.runtime && (
                                        <span className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            {movie.runtime} Menit
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Genres */}
                            {movie.genres && (
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    {movie.genres.map((g, idx) => (
                                        <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800">
                                            {g.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Overview */}
                            <div className="space-y-1.5">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Sinopsis</h3>
                                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                                    {movie.overview || 'Belum ada deskripsi sinopsis untuk film ini.'}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                                {trailerKey && (
                                    <button
                                        onClick={() => setShowTrailer(true)}
                                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-red-600/30 hover:scale-105"
                                    >
                                        <Play className="w-4 h-4 fill-white" /> Putar Trailer
                                    </button>
                                )}

                                <button
                                    onClick={handleWatchlistToggle}
                                    className={`inline-flex items-center gap-2 font-semibold px-5 py-3 rounded-xl text-sm transition-all border ${
                                        inWatchlist
                                            ? 'bg-slate-900 text-red-400 border-red-500/40 hover:bg-red-500/10'
                                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    <Heart className={`w-4 h-4 ${inWatchlist ? 'fill-red-500 text-red-500' : ''}`} />
                                    {inWatchlist ? 'Tersimpan di Watchlist' : 'Tambah ke Watchlist'}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* 3. MODAL YOUTUBE TRAILER */}
                {showTrailer && trailerKey && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                            <div className="flex items-center justify-between p-4 border-b border-slate-800">
                                <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                                    <Film className="w-4 h-4 text-red-500" /> Trailer: {movie.title}
                                </h3>
                                <button
                                    onClick={() => setShowTrailer(false)}
                                    className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="aspect-video w-full">
                                <iframe
                                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                                    title="YouTube Video Player"
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <div className="mt-12 space-y-8 bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-800">
            <h3 className="text-xl font-bold text-white">Ulasan Komunitas</h3>

            {/* Form Input Ulasan */}
            <form onSubmit={submitReview} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2">Beri Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setData('rating', star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`w-6 h-6 ${
                                        star <= data.rating
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-slate-600'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <textarea
                        value={data.comment}
                        onChange={(e) => setData('comment', e.target.value)}
                        placeholder="Tulis pendapatmu tentang film ini..."
                        rows="3"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    />
                    {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                    {processing ? 'Kirim...' : 'Kirim Ulasan'}
                </button>
            </form>

            {/* Daftar Ulasan */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
                {reviews.length === 0 ? (
                    <p className="text-xs text-slate-500">Belum ada ulasan untuk film ini. Jadilah yang pertama!</p>
                ) : (
                    reviews.map((rev) => (
                        <div key={rev.id} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-slate-200">{rev.user.name}</span>
                                    <div className="flex items-center text-amber-400 text-xs">
                                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                                        {rev.rating}/5
                                    </div>
                                </div>
                                {rev.user_id === auth.user.id && (
                                    <button
                                        onClick={() => route('reviews.destroy', rev.id)}
                                        className="text-slate-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-slate-300">{rev.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
        </AuthenticatedLayout>
    );
}