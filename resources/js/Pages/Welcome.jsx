import { Head, Link } from '@inertiajs/react';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Welcome({ auth }) {
    const containerRef = useRef();
    const lineRef = useRef();
    const headRef = useRef();

    useGSAP(() => {
    // 1. ANIMASI GARIS "ULAR" MENGGAMBAR DARI ATAS KE BAWAH
    const path = lineRef.current;
    const pathLength = path.getTotalLength();

    gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
    });

    gsap.set(headRef.current, { opacity: 0 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true, // <-- WAJIB: hitung ulang saat refresh
        }
    });

    tl.to(path, { strokeDashoffset: 0, ease: "none" }, 0)
      .to(headRef.current, { opacity: 1, duration: 0.05 }, 0);

    ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true, // <-- sama, di trigger kedua
        onUpdate: (self) => {
            const point = path.getPointAtLength(pathLength * self.progress);
            gsap.set(headRef.current, { attr: { cx: point.x, cy: point.y } });
        }
    });

    // ... (parallax & reveal-card tetap sama)

}, { scope: containerRef });

// Tambahkan effect terpisah: refresh paksa setelah font & gambar selesai load,
// dan setiap kali ukuran window berubah.
useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    // tunggu semua font web selesai dimuat (Tailwind/Google Fonts dsb)
    if (document.fonts) {
        document.fonts.ready.then(refresh);
    }

    // tunggu semua resource (gambar dll) selesai load
    window.addEventListener('load', refresh);
    window.addEventListener('resize', refresh);

    // fallback: refresh sekali lagi setelah delay singkat (jaga-jaga layout shift)
    const t = setTimeout(refresh, 500);

    return () => {
        window.removeEventListener('load', refresh);
        window.removeEventListener('resize', refresh);
        clearTimeout(t);
    };
}, []);

    return (
        <div ref={containerRef} className="relative bg-white text-slate-900 min-h-[300vh] overflow-hidden">
            <Head title="Welcome - GSAP Experience" />

            {/* --- MENU NAVIGASI --- */}
            <header className="fixed top-0 right-0 p-6 z-50">
                <nav className="flex gap-4 items-center bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#1e45fb]/10 shadow-sm">
                    {auth?.user ? (
                        <Link href={route('dashboard')} className="font-semibold text-[#1e45fb] hover:text-[#0f2fc9] transition">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="font-semibold text-slate-500 hover:text-[#1e45fb] transition">
                                Log in
                            </Link>
                            <Link href={route('register')} className="font-semibold text-white bg-[#1e45fb] hover:bg-[#0f2fc9] px-4 py-1.5 rounded-full transition shadow-[0_4px_14px_rgba(30,69,251,0.35)]">
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            {/* --- BOLA CAHAYA PARALLAX (lebih banyak, biru & lime bergantian) --- */}
            <div className="parallax-item absolute top-[4%] left-[6%] w-72 h-72 bg-[#1e45fb] rounded-full blur-[130px] opacity-[0.18] z-0" data-speed="0.2"></div>
            <div className="parallax-item absolute top-[18%] right-[8%] w-80 h-80 bg-[#cdf22b] rounded-full blur-[140px] opacity-[0.25] z-0" data-speed="-0.15"></div>
            <div className="parallax-item absolute top-[38%] left-[12%] w-64 h-64 bg-[#cdf22b] rounded-full blur-[120px] opacity-[0.2] z-0" data-speed="0.25"></div>
            <div className="parallax-item absolute top-[55%] right-[15%] w-96 h-96 bg-[#1e45fb] rounded-full blur-[150px] opacity-[0.15] z-0" data-speed="-0.1"></div>
            <div className="parallax-item absolute top-[75%] left-[20%] w-72 h-72 bg-[#1e45fb] rounded-full blur-[130px] opacity-[0.18] z-0" data-speed="0.3"></div>
            <div className="parallax-item absolute top-[90%] right-[10%] w-64 h-64 bg-[#cdf22b] rounded-full blur-[120px] opacity-[0.22] z-0" data-speed="-0.2"></div>

            {/* --- GARIS SVG "ULAR": dari pojok kiri-atas paling atas, meliuk, melingkar 360° di tengah, lalu ke kanan-bawah --- */}
            <svg
                preserveAspectRatio="none"
                viewBox="0 0 1000 3000"
                className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
            >
                <defs>
                    <linearGradient id="gradient-line" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1e45fb" />
                        <stop offset="35%" stopColor="#4d6bff" />
                        <stop offset="55%" stopColor="#cdf22b" />
                        <stop offset="75%" stopColor="#1e45fb" />
                        <stop offset="100%" stopColor="#cdf22b" />
                    </linearGradient>

                    <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="10" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/*
                    RUTE ULAR:
                    - Mulai: pojok kiri-atas, paling atas halaman (50,50)
                    - Meliuk turun ke arah tengah
                    - Melingkar penuh 360° di sekitar titik (500,1400) — "badan ular melingkar"
                    - Lanjut meliuk tidak beraturan ke kanan-bawah
                    - Berakhir di pojok kanan-bawah halaman
                */}
                <path
                    ref={lineRef}
                    d="M 50 50
                       C 350 150, 650 350, 600 650
                       C 560 900, 350 1000, 350 1250
                       C 350 1450, 500 1550, 650 1400
                       C 700 1300, 650 1150, 500 1150
                       C 400 1150, 350 1250, 400 1400
                       C 450 1550, 650 1600, 800 1550
                       C 950 1500, 950 1700, 850 1900
                       C 750 2100, 500 2150, 400 2350
                       C 300 2550, 450 2650, 600 2800
                       C 700 2900, 850 2850, 950 2950"
                    fill="none"
                    stroke="url(#gradient-line)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    filter="url(#neon-glow)"
                />

                {/* "Kepala ular" — titik terang yang mengikuti ujung garis saat di-scroll */}
                <circle ref={headRef} r="12" fill="#cdf22b" filter="url(#neon-glow)" />
            </svg>

            {/* --- KONTEN HALAMAN --- */}
            <div className="relative z-20 container mx-auto px-6 flex flex-col items-center">

                <div className="h-screen flex flex-col items-center justify-center text-center">
                    <span className="parallax-item inline-block mb-4 px-4 py-1 rounded-full bg-[#cdf22b]/20 border border-[#cdf22b]/40 text-[#0f2fc9] text-sm font-semibold tracking-wide" data-speed="-0.15">
                        REACT × LARAVEL × GSAP
                    </span>
                    <h1
                        className="parallax-item text-6xl md:text-8xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#1e45fb] via-[#4d6bff] to-[#cdf22b] mb-6"
                        data-speed="-0.2"
                    >
                        Scroll ke Bawah
                    </h1>
                    <p
                        className="parallax-item text-xl text-slate-600 max-w-lg bg-white/80 p-4 rounded-xl backdrop-blur-sm border border-[#1e45fb]/10 shadow-[0_8px_30px_rgba(30,69,251,0.08)]"
                        data-speed="-0.1"
                    >
                        Rasakan keajaiban interaksi antara komponen React, kekuatan Laravel, dan kelancaran animasi GSAP.
                    </p>
                    <div className="animate-bounce mt-16 text-[#1e45fb] text-4xl">
                        ↓
                    </div>
                </div>

                <div className="h-screen flex items-center justify-start w-full max-w-5xl">
                    <div className="reveal-card w-full md:w-1/2 p-8 bg-white border-2 border-[#1e45fb]/15 rounded-2xl shadow-[0_10px_40px_rgba(30,69,251,0.15)] relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#cdf22b] rounded-full blur-3xl opacity-30"></div>
                        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#1e45fb] text-white text-xs font-bold tracking-wide">01</span>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Melingkar Seperti Ular</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Garis neon mengikuti rute tidak beraturan dari pojok kiri-atas paling atas halaman, meliuk menuju tengah, lalu membentuk lingkaran penuh 360° layaknya ular yang melingkarkan tubuhnya sebelum melanjutkan perjalanan.
                        </p>
                    </div>
                </div>

                <div className="h-screen flex items-center justify-end w-full max-w-5xl">
                    <div className="reveal-card w-full md:w-1/2 p-8 bg-white border-2 border-[#cdf22b]/40 rounded-2xl shadow-[0_10px_40px_rgba(205,242,43,0.25)] relative overflow-hidden">
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#1e45fb] rounded-full blur-3xl opacity-20"></div>
                        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#cdf22b] text-[#0f2fc9] text-xs font-bold tracking-wide">02</span>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Glow & Parallax Berwarna</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Bola-bola cahaya biru dan lime tersebar di banyak titik dengan kecepatan berbeda, memberi kedalaman dan warna yang lebih hidup tanpa menghilangkan nuansa putih yang bersih.
                        </p>
                    </div>
                </div>

                <div className="h-64 flex flex-col items-center justify-center w-full gap-3">
                    <div className="w-24 h-1 rounded-full bg-gradient-to-r from-[#1e45fb] to-[#cdf22b]"></div>
                    <h3 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#1e45fb] to-[#cdf22b]">
                        Keren Sekali, Bukan?
                    </h3>
                </div>

            </div>
        </div>
    );
}