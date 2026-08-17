import { useRef, useState, Link } from 'react';
import { Play, Plus, Star, Search, Bell, Flame } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function MovieStream({ featuredMovie, movies }) {
    const container = useRef();
    const heroContent = useRef();
    const movieCardsRef = useRef([]);

    const [activeTab, setActiveTab] = useState('Trending');

    useGSAP(() => {
        if (!featuredMovie) return;

        // Animasi Hero Section
        const tl = gsap.timeline();

        tl.fromTo(
            heroContent.current.children,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
        );

        // Animasi Stagger Kartu Film
        if (movieCardsRef.current.length > 0) {
            gsap.fromTo(
                movieCardsRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out', delay: 0.3 }
            );
        }
    }, { scope: container, dependencies: [featuredMovie, movies] });

    if (!featuredMovie) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <p>Memuat data film dari TMDB...</p>
            </div>
        );
    }

    return (
        <div ref={container} className="min-h-screen bg-slate-950 text-white font-sans selection:bg-red-500 selection:text-white">
            
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 py-5 bg-gradient-to-b from-slate-950/90 to-transparent backdrop-blur-md">
                <div className="flex items-center gap-10">
                    <h1 className="text-2xl font-black tracking-wider text-red-600 uppercase cursor-pointer">
                        STREAM<span className="text-white">X</span>
                    </h1>
                    <ul className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
                        {['Beranda', 'Film', 'Serial TV', 'Populer', 'Daftar Saya'].map((item) => (
                            <li key={item} className="hover:text-red-500 transition-colors cursor-pointer">{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center gap-5">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cari film, genre..." 
                            className="bg-slate-900/80 border border-slate-800 text-sm rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:border-red-500 transition-all w-48 focus:w-64"
                        />
                    </div>
                    <button className="p-2 bg-slate-900/80 rounded-full text-slate-300 hover:text-white border border-slate-800">
                        <Bell className="w-4 h-4" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-indigo-600 flex items-center justify-center font-bold text-sm cursor-pointer ring-2 ring-red-500/50">
                        U
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-[85vh] w-full flex items-end pb-16 px-6 sm:px-12">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={featuredMovie.banner} 
                        alt={featuredMovie.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
                </div>

                <div ref={heroContent} className="relative z-10 max-w-2xl space-y-4">
                    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-red-500">
                        <span className="flex items-center gap-1 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                            <Flame className="w-3.5 h-3.5" /> Trending #1 TMDB
                        </span>
                        <span className="text-slate-400">{featuredMovie.year}</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                        {featuredMovie.title}
                    </h1>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                            <Star className="w-4 h-4 fill-amber-400" />
                            {featuredMovie.rating}
                        </div>
                        <div className="flex gap-2 ml-4">
                            {featuredMovie.genre.map((g) => (
                                <span key={g} className="text-xs bg-slate-900/80 border border-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full">
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>

                    <p className="text-slate-300 text-sm sm:text-base line-clamp-3 leading-relaxed">
                        {featuredMovie.description}
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/30">
                            <Play className="w-5 h-5 fill-white" /> Tonton Sekarang
                        </button>
                        <button className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold px-5 py-3 rounded-xl transition-all backdrop-blur-md">
                            <Plus className="w-5 h-5" /> Tambah Favorit
                        </button>
                    </div>
                </div>
            </section>

            {/* Content List Section */}
            <main className="px-6 sm:px-12 py-8 space-y-8 relative z-20">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-6">
                        {['Trending', 'Rilis Terbaru', 'Rating Tertinggi'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-sm font-semibold transition-all relative ${
                                    activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Movie Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {movies.map((movie, index) => (
                        <div
                            key={movie.id}
                            ref={(el) => (movieCardsRef.current[index] = el)}
                            className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-slate-700 transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-xl"
                        >
                            <div className="aspect-[2/3] w-full overflow-hidden relative">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                                
                                <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-950/70 backdrop-blur-md border border-slate-800 px-2 py-1 rounded-lg text-xs font-bold text-amber-400">
                                    <Star className="w-3 h-3 fill-amber-400" />
                                    {movie.rating}
                                </div>
                            </div>

                            <div className="p-4 space-y-1">
                                <span className="text-[11px] font-semibold text-red-500 uppercase tracking-wider">
                                    {movie.genre}
                                </span>
                                <h3 className="font-bold text-sm text-slate-100 truncate group-hover:text-red-400 transition-colors">
                                    {movie.title}
                                </h3>
                            </div>
                            <Link to={`/movie/${movie.id}`} className="play-button">
                              Tonton Sekarang
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}