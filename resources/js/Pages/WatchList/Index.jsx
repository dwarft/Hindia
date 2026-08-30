import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Heart, Trash2, Star, PlayCircle, Film } from 'lucide-react';

export default function Index({ watchlists = [] }) {
    
    const handleRemove = (id) => {
        if (confirm('Hapus film ini dari daftar favoritmu?')) {
            router.delete(route('watchlist.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-slate-100 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" /> Favorit Saya
                </h2>
            }
        >
            <Head title="Watchlist Saya - StreamX" />

            <div className="py-6 bg-slate-950 min-h-screen text-slate-100 space-y-6 px-4 sm:px-6 lg:px-8">
                
                {/* Header Sub-title */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-100">Daftar Tontonan / Watchlist</h3>
                        <p className="text-xs text-slate-400">Film-film yang kamu simpan untuk ditonton nanti</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
                        Total: {watchlists.length} Film
                    </span>
                </div>

                {/* Grid Watchlist */}
                {watchlists.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                        {watchlists.map((item) => (
                            <div
                                key={item.id}
                                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
                            >
                                {/* Poster */}
                                <div className="aspect-[2/3] w-full overflow-hidden relative">
                                    <img
                                        src={item.poster_path || 'https://via.placeholder.com/500x750?text=No+Cover'}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                                    
                                    {/* Tombol Hapus */}
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md text-slate-400 hover:text-red-400 hover:bg-slate-900 border border-slate-800 transition-all z-10"
                                        title="Hapus dari Watchlist"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {/* Rating */}
                                    {item.vote_average && (
                                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md text-amber-400 px-2 py-1 rounded-lg text-xs font-bold border border-slate-800">
                                            <Star className="w-3 h-3 fill-amber-400" /> {item.vote_average}
                                        </div>
                                    )}
                                </div>

                                {/* Info & Quick Action */}
                                <div className="p-3.5 space-y-2">
                                    <h4 className="font-bold text-sm text-slate-100 line-clamp-1">
                                        {item.title}
                                    </h4>
                                    
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>{item.release_date || 'N/A'}</span>
                                        <Link
                                            href={`/movie/${item.movie_id}`}
                                            className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold transition-colors"
                                        >
                                            <PlayCircle className="w-4 h-4" /> Tonton
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State jika belum ada watchlist */
                    <div className="py-20 text-center space-y-4 bg-slate-900/40 rounded-3xl border border-slate-800/80 max-w-lg mx-auto my-8">
                        <div className="w-16 h-16 bg-red-600/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                            <Heart className="w-8 h-8" />
                        </div>
                        <div className="space-y-1 px-4">
                            <h4 className="text-lg font-bold text-slate-200">Watchlist Kamu Masih Kosong</h4>
                            <p className="text-slate-400 text-xs max-w-sm mx-auto">
                                Belum ada film yang kamu simpan. Jelajahi katalog film dan klik ikon hati untuk menyimpannya di sini.
                            </p>
                        </div>
                        <div className="pt-2">
                            <Link
                                href="/movies"
                                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-red-600/30"
                            >
                                <Film className="w-4 h-4" /> Jelajahi Katalog Film
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}