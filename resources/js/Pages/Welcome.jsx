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
        const path = lineRef.current;
        const pathLength = path.getTotalLength();

        gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
        });
        gsap.set(headRef.current, { opacity: 0 });

        // SATU ScrollTrigger untuk garis + kepala ular sekaligus,
        // supaya keduanya selalu sinkron persis (tidak ada lagi delay antar-elemen).
        // scrub kecil (0.3) = tetap halus mengikuti scroll, tapi jauh lebih responsif
        // dibanding scrub:1 sebelumnya (yang menyebabkan jeda 1 detik terasa berat di desktop).
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const offset = pathLength * (1 - self.progress);
                gsap.set(path, { strokeDashoffset: offset });

                if (self.progress > 0.002) {
                    gsap.set(headRef.current, { opacity: 1 });
                    const point = path.getPointAtLength(pathLength * self.progress);
                    gsap.set(headRef.current, { attr: { cx: point.x, cy: point.y } });
                } else {
                    gsap.set(headRef.current, { opacity: 0 });
                }
            }
        });

        // EFEK PARALLAX BOLA CAHAYA DAN TEKS
        gsap.utils.toArray('.parallax-item').forEach(layer => {
            const speed = layer.dataset.speed;
            gsap.to(layer, {
                y: () => (ScrollTrigger.maxScroll(window) * speed),
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                    invalidateOnRefresh: true
                }
            });
        });

        // EFEK KARTU MUNCUL
        gsap.utils.toArray('.reveal-card').forEach(card => {
            gsap.from(card, {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });

    }, { scope: containerRef });

    // Refresh paksa setelah font & gambar selesai load, dan saat resize
    useEffect(() => {
        const refresh = () => ScrollTrigger.refresh();
        if (document.fonts) document.fonts.ready.then(refresh);
        window.addEventListener('load', refresh);
        window.addEventListener('resize', refresh);
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

            {/* --- BOLA CAHAYA PARALLAX --- */}
            <div className="parallax-item absolute top-[4%] left-[6%] w-72 h-72 bg-[#1e45fb] rounded-full blur-[130px] opacity-[0.18] z-0" data-speed="0.2"></div>
            <div className="parallax-item absolute top-[18%] right-[8%] w-80 h-80 bg-[#cdf22b] rounded-full blur-[140px] opacity-[0.25] z-0" data-speed="-0.15"></div>
            <div className="parallax-item absolute top-[38%] left-[12%] w-64 h-64 bg-[#cdf22b] rounded-full blur-[120px] opacity-[0.2] z-0" data-speed="0.25"></div>
            <div className="parallax-item absolute top-[55%] right-[15%] w-96 h-96 bg-[#1e45fb] rounded-full blur-[150px] opacity-[0.15] z-0" data-speed="-0.1"></div>
            <div className="parallax-item absolute top-[75%] left-[20%] w-72 h-72 bg-[#1e45fb] rounded-full blur-[130px] opacity-[0.18] z-0" data-speed="0.3"></div>
            <div className="parallax-item absolute top-[90%] right-[10%] w-64 h-64 bg-[#cdf22b] rounded-full blur-[120px] opacity-[0.22] z-0" data-speed="-0.2"></div>

            {/* --- GARIS SVG: rute halus, satu loop 360° penuh, tanpa glow --- */}
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
                </defs>

                {/*
                    Rute baru: arah selalu maju (tidak ada zig-zag mundur),
                    loop di tengah dibentuk dari 4 kurva lingkaran presisi (matematis 360° penuh),
                    lanjutan ke bawah pakai lengkungan besar yang menyambung mulus (tangent-continuous).
                */}
                <path
                    ref={lineRef}
                    d="M 80 40
                       C 300 60, 520 220, 540 500
                       C 560 700, 520 880, 500 1030
                       C 593.9 1030, 670 1106.1, 670 1200
                       C 670 1293.9, 593.9 1370, 500 1370
                       C 406.1 1370, 330 1293.9, 330 1200
                       C 330 1106.1, 406.1 1030, 500 1030
                       C 640 1060, 820 1180, 830 1450
                       C 840 1650, 680 1750, 700 1950
                       C 720 2150, 900 2250, 880 2500
                       C 860 2700, 700 2800, 950 2950"
                    fill="none"
                    stroke="url(#gradient-line)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />

                <circle ref={headRef} r="10" fill="#cdf22b" />
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

                {/* CARD 1 — dominan #1e45fb */}
                <div className="h-screen flex items-center justify-start w-full max-w-5xl">
                    <div className="reveal-card w-full md:w-1/2 p-8 bg-[#1e45fb] rounded-2xl shadow-[0_10px_40px_rgba(30,69,251,0.35)] relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#cdf22b] rounded-full blur-3xl opacity-30"></div>
                        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#cdf22b] text-[#0f2fc9] text-xs font-bold tracking-wide">01</span>
                        <h2 className="text-3xl font-bold text-white mb-4">Melingkar Seperti Ular</h2>
                        <p className="text-white/80 leading-relaxed">
                            Garis neon mengikuti rute yang selalu maju dari pojok kiri-atas halaman, meliuk menuju tengah, lalu membentuk lingkaran penuh 360° dengan mulus sebelum melanjutkan perjalanan ke bawah.
                        </p>
                    </div>
                </div>

                {/* CARD 2 — dominan #cdf22b */}
                <div className="h-screen flex items-center justify-end w-full max-w-5xl">
                    <div className="reveal-card w-full md:w-1/2 p-8 bg-[#cdf22b] rounded-2xl shadow-[0_10px_40px_rgba(205,242,43,0.4)] relative overflow-hidden">
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#1e45fb] rounded-full blur-3xl opacity-20"></div>
                        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#1e45fb] text-white text-xs font-bold tracking-wide">02</span>
                        <h2 className="text-3xl font-bold text-[#0f2fc9] mb-4">Parallax Responsif</h2>
                        <p className="text-[#0f2fc9]/80 leading-relaxed">
                            Garis dan bola cahaya kini selalu sinkron dengan posisi scroll di perangkat apa pun — tidak ada lagi jeda antara animasi dan gerakan mouse atau sentuhan.
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