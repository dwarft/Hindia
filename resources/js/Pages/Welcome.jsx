import { Head, Link } from '@inertiajs/react';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Mendaftarkan plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function Welcome({ auth }) {
    const containerRef = useRef();
    const lineRef = useRef();

    useGSAP(() => {
        // 1. ANIMASI GARIS (DRAWING LINE)
        const path = lineRef.current;
        const pathLength = path.getTotalLength(); 

        gsap.set(path, { 
            strokeDasharray: pathLength, 
            strokeDashoffset: pathLength 
        });

        gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1, // Smoothing scroll
            }
        });

        // 2. EFEK PARALLAX BOLA CAHAYA DAN TEKS
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

        // 3. EFEK KARTU MUNCUL
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

    return (
        <div ref={containerRef} className="relative bg-slate-950 text-white min-h-[300vh] overflow-hidden">
            <Head title="Welcome - GSAP Experience" />

            {/* --- MENU NAVIGASI --- */}
            <header className="fixed top-0 right-0 p-6 z-50">
                <nav className="flex gap-4">
                    {auth?.user ? (
                        <Link href={route('dashboard')} className="font-semibold text-white/70 hover:text-white transition">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="font-semibold text-white/70 hover:text-white transition">
                                Log in
                            </Link>
                            <Link href={route('register')} className="font-semibold text-white/70 hover:text-white transition">
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            {/* --- BOLA CAHAYA PARALLAX --- */}
            <div className="parallax-item absolute top-[10%] left-[10%] w-64 h-64 bg-purple-600 rounded-full mix-blend-screen blur-[120px] opacity-50 z-0" data-speed="0.2"></div>
            <div className="parallax-item absolute top-[40%] right-[10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen blur-[120px] opacity-40 z-0" data-speed="-0.1"></div>
            <div className="parallax-item absolute top-[70%] left-[20%] w-72 h-72 bg-pink-600 rounded-full mix-blend-screen blur-[120px] opacity-30 z-0" data-speed="0.3"></div>

            {/* --- GARIS SVG ZIG-ZAG 360 DERAJAT --- */}
            <svg preserveAspectRatio="none" viewBox="0 0 1000 1000" className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 opacity-90">
                <defs>
                    <linearGradient id="gradient-line" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" /> 
                        <stop offset="50%" stopColor="#a855f7" /> 
                        <stop offset="100%" stopColor="#ec4899" /> 
                    </linearGradient>
                    
                    {/* Filter untuk efek bercahaya (Neon Glow) */}
                    <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="blur" /> {/* Diduplikasi agar cahaya lebih terang */}
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                
                <path 
                    ref={lineRef}
                    /* 
                       M -50 50       = Mulai dari kiri atas (sedikit di luar layar)
                       C 400 50, 800 200, 800 400 = Meluncur ke kanan bawah
                       C 800 700, 200 700, 200 450 = Berputar (looping) ke arah bawah-kiri lalu naik
                       C 200 200, 950 200, 800 650 = Menyelesaikan putaran ke atas, menyilang ke kanan bawah
                       C 700 900, 400 900, 1050 1050 = Melengkung elegan ke kanan bawah layar 
                    */
                    d="M -50 50 C 400 50, 800 200, 800 400 C 800 700, 200 700, 200 450 C 200 200, 950 200, 800 650 C 700 900, 400 900, 1050 1050" 
                    fill="none" 
                    stroke="url(#gradient-line)" 
                    strokeWidth="16"  /* Ditebalkan dari 4 menjadi 16 */
                    strokeLinecap="round" 
                    vectorEffect="non-scaling-stroke"
                    filter="url(#neon-glow)" /* Menambahkan efek Glow */
                />
            </svg>

            {/* --- KONTEN HALAMAN --- */}
            <div className="relative z-20 container mx-auto px-6 flex flex-col items-center">
                
                <div className="h-screen flex flex-col items-center justify-center text-center">
                    <h1 className="parallax-item text-6xl md:text-8xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-6 drop-shadow-lg" data-speed="-0.2">
                        Scroll ke Bawah
                    </h1>
                    <p className="parallax-item text-xl text-gray-400 max-w-lg bg-black/30 p-4 rounded-xl backdrop-blur-sm" data-speed="-0.1">
                        Rasakan keajaiban interaksi antara komponen React, kekuatan Laravel, dan kelancaran animasi GSAP.
                    </p>
                    <div className="animate-bounce mt-16 text-gray-500 text-4xl">
                        ↓
                    </div>
                </div>

                <div className="h-screen flex items-center justify-start w-full max-w-5xl">
                    <div className="reveal-card w-full md:w-1/2 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                        <h2 className="text-3xl font-bold text-white mb-4">Melingkar 360°</h2>
                        <p className="text-gray-400 leading-relaxed">
                            Coba *scroll* ke atas dan ke bawah di area ini. Anda akan melihat garis neon menebal dan membentuk putaran 360 derajat yang menyilang secara presisi, layaknya lintasan *rollercoaster*.
                        </p>
                    </div>
                </div>

                <div className="h-screen flex items-center justify-end w-full max-w-5xl">
                    <div className="reveal-card w-full md:w-1/2 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(236,72,153,0.1)]">
                        <h2 className="text-3xl font-bold text-white mb-4">Glow & Parallax</h2>
                        <p className="text-gray-400 leading-relaxed">
                            Dipadukan dengan garis yang bersinar layaknya tabung neon dan bola cahaya di belakangnya yang bergerak dengan kecepatan berbeda, menciptakan komposisi dimensi yang memanjakan mata.
                        </p>
                    </div>
                </div>

                <div className="h-64 flex items-center justify-center w-full">
                    <h3 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400 drop-shadow-md">
                        Keren Sekali, Bukan?
                    </h3>
                </div>

            </div>
        </div>
    );
}