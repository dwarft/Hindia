import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Film, PlayCircle, Heart, ShieldCheck, Zap, ChevronRight } from 'lucide-react';

export default function Dashboard({ auth, watchlistCount = 0 }) {
    const user = auth.user;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-bold leading-tight text-slate-100">
                    Dashboard Pengguna
                </h2>
            }
        >
            <Head title="Dashboard - StreamX" />

            <div className="py-8 bg-slate-950 min-h-screen text-slate-100">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Welcome Banner */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-900/40 via-slate-900 to-indigo-950/50 p-8 border border-slate-800 shadow-2xl">
                        <div className="relative z-10 space-y-3 max-w-xl">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                                <Zap className="w-3.5 h-3.5" /> Akun VIP Aktif
                            </span>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                Selamat datang kembali, <span className="text-red-500">{user.name}</span>!
                            </h1>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Nikmati ribuan film dan serial TV kualitas 4K HDR tanpa iklan. Siapkan camilan dan mulai streaming sekarang.
                            </p>
                            <div className="pt-2">
                                <Link
                                    href="/movies"
                                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95"
                                >
                                    <PlayCircle className="w-4 h-4" /> Eksplor Katalog Film
                                </Link>
                            </div>
                        </div>

                        {/* Aksesori Dekorasi Visual */}
                        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg backdrop-blur-sm">
                            <div className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">
                                <Film className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Ditonton</p>
                                <p className="text-2xl font-bold text-white">24 Film</p>
                            </div>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg backdrop-blur-sm">
    <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl border border-pink-500/20">
        <Heart className="w-6 h-6" />
    </div>
    <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daftar Favorit</p>
        <p className="text-2xl font-bold text-white">{watchlistCount} Judul</p>
    </div>
</div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-lg backdrop-blur-sm">
                            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Langganan</p>
                                <p className="text-2xl font-bold text-emerald-400">Premium 4K</p>
                            </div>
                        </div>
                    </div>

                    {/* Informasi Akun & Quick Links */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Info Card */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                                Ringkasan Akun
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-slate-400 text-xs">Nama Lengkap</p>
                                    <p className="font-semibold text-slate-200">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs">Alamat Email</p>
                                    <p className="font-semibold text-slate-200">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs">Metode Pembayaran</p>
                                    <p className="font-semibold text-slate-200">Mandiri Auto-Debit (•••• 8821)</p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <Link
                                    href={route('profile.edit')}
                                    className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-xl border border-slate-700 transition-colors"
                                >
                                    Pengaturan Profil
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity / Recommendations Placeholder */}
                        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h3 className="text-base font-bold text-white">
                                    Lanjutkan Menonton
                                </h3>
                                <Link href="/movies" className="text-xs font-semibold text-red-500 hover:text-red-400 flex items-center gap-1">
                                    Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {/* Dummy Watch History Item */}
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src="https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" alt="Poster" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-100">Interstellar</h4>
                                            <p className="text-xs text-slate-400">Tersisa 42 menit • Sci-Fi</p>
                                        </div>
                                    </div>
                                    <Link 
                                        href="/movie/157336" 
                                        className="p-2 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                                    >
                                        <PlayCircle className="w-5 h-5" />
                                    </Link>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src="https://image.tmdb.org/t/p/w200/8m1M38YgBch9oQyIflV3pW3rRk0.jpg" alt="Poster" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-100">The Dark Knight</h4>
                                            <p className="text-xs text-slate-400">Tersisa 15 menit • Action</p>
                                        </div>
                                    </div>
                                    <Link 
                                        href="/movie/155" 
                                        className="p-2 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                                    >
                                        <PlayCircle className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rekomendasi Untukmu */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="text-base font-bold text-white">
                                Rekomendasi Untukmu
                            </h3>
                            <Link href="/movies" className="text-xs font-semibold text-red-500 hover:text-red-400 flex items-center gap-1">
                                Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                            
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {[
                                { id: 155, title: 'The Dark Knight', poster: '8m1M38YgBch9oQyIflV3pW3rRk0.jpg', rating: 8.9 },
                                { id: 157336, title: 'Interstellar', poster: 'gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', rating: 8.6 },
                                { id: 27205, title: 'Inception', poster: '9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', rating: 8.8 },
                                { id: 550, title: 'Fight Club', poster: 'pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', rating: 8.4 },
                                { id: 680, title: 'Pulp Fiction', poster: 'd5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', rating: 8.5 },
                            ].map((movie) => (
                                <Link
                                    key={movie.id}
                                    href={`/movie/${movie.id}`}
                                    className="group relative rounded-xl overflow-hidden bg-slate-800 aspect-[2/3] shadow-lg hover:scale-[1.03] transition-transform"
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w300/${movie.poster}`}
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                        <p className="text-xs font-bold text-white line-clamp-2">{movie.title}</p>
                                        <p className="text-[10px] text-amber-400 font-semibold mt-1">★ {movie.rating}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}