import { Head, Link } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Catmull-Rom -> Bezier: menjamin kurva selalu C1-continuous (tangent nyambung
// di setiap titik), sehingga TIDAK mungkin ada tikungan/menukik tiba-tiba.
function catmullRomPath(pts) {
    if (pts.length < 2) return '';
    const get = (i) => pts[Math.max(0, Math.min(pts.length - 1, i))];
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
}

function buildSnakePath(scaleY) {
    const Y = (v) => v * scaleY;
    const totalY = 3000;
    const mainCount = 22;
    const pts = [];

    for (let i = 0; i <= mainCount; i++) {
        const t = i / mainCount;
        const yDesign = t * totalY;
        let x = 500 + Math.sin(t * Math.PI * 4) * 250;

        if (yDesign > 850 && yDesign < 1850) {
            x = Math.max(x, 690);
        } else if (yDesign > 1850 && yDesign < 1980) {
            // Zona "tenang" SEBELUM loop: berhenti berayun, konvergen lurus
            // menuju titik masuk loop (Cx=690) — supaya tidak menyilang loop.
            const p = (yDesign - 1850) / (1980 - 1850);
            x = 690 - p * (690 - 690); // tetap di 690, lurus masuk
            x = 690;
        } else if (yDesign >= 1980 && yDesign <= 2020) {
            // Titik masuk/keluar loop — dikunci lurus di Cx
            x = 690;
        } else if (yDesign > 2020 && yDesign < 2150) {
            // Zona "tenang" SESUDAH loop: keluar lurus dulu menjauh dari loop,
            // baru sinus dinyalakan lagi setelah aman — supaya tidak masuk lagi ke loop.
            const p = (yDesign - 2020) / (2150 - 2020);
            x = 690 - p * (690 - 310);
        } else if (yDesign >= 2150 && yDesign < 2950) {
            x = Math.min(x, 310);
        }

        pts.push({ x, y: Y(yDesign) });
    }

    // Loop ditempatkan tepat di zona tenang (y=2000), Cx dikunci sama
    // dengan x jalur masuk/keluar (690) — sehingga sambungannya presisi lurus,
    // tidak ada offset yang bikin garis nyelonong balik ke dalam lingkaran.
    const insertAt = pts.findIndex((p) => p.y >= Y(2000));
    const Cx = 690;
    const Cy = Y(2000);

    const loopPts = [];
    const segs = 28;
    const R = 60; // radius diperbesar sedikit + digeser Cx supaya loop full di luar jalur utama
    for (let k = 0; k <= segs; k++) {
        const angle = (k / segs) * Math.PI * 2 - Math.PI / 2;
        loopPts.push({
            x: Cx + 60 + Math.cos(angle) * R, // digeser +60 ke kanan dari garis utama
            y: Cy + Math.sin(angle) * R,
        });
    }

    pts.splice(insertAt, 0, ...loopPts);
    return { d: catmullRomPath(pts), points: pts };
}

export default function Welcome({ auth }) {
    const containerRef = useRef();
    const lineRef = useRef();
    const headRef = useRef();
    const cursorDotRef = useRef();
    const cursorRingRef = useRef();
    const [scaleY, setScaleY] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            if (!containerRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.scrollHeight;
            setScaleY((1000 * (h / w)) / 3000);
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        window.addEventListener('load', updateScale);
        if (document.fonts) document.fonts.ready.then(updateScale);
        const t = setTimeout(updateScale, 500);
        return () => {
            window.removeEventListener('resize', updateScale);
            window.removeEventListener('load', updateScale);
            clearTimeout(t);
        };
    }, []);

    // --- CURSOR KUSTOM: dot + ring mengikuti mouse dengan smoothing ---
    useEffect(() => {
        const dot = cursorDotRef.current;
        const ring = cursorRingRef.current;
        if (!dot || !ring) return;
        if (window.matchMedia('(pointer: coarse)').matches) return; // skip di HP/touch

        const moveDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' });
        const moveDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' });
        const moveRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' });
        const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' });

        const onMove = (e) => {
            moveDot(e.clientX);
            moveDotY(e.clientY);
            moveRing(e.clientX);
            moveRingY(e.clientY);
        };
        window.addEventListener('mousemove', onMove);
        gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 1 });

        const interactive = document.querySelectorAll('a, button, .reveal-card');
        const grow = () => gsap.to(ring, { scale: 2.2, duration: 0.3 });
        const shrink = () => gsap.to(ring, { scale: 1, duration: 0.3 });
        interactive.forEach((el) => {
            el.addEventListener('mouseenter', grow);
            el.addEventListener('mouseleave', shrink);
        });

        return () => {
            window.removeEventListener('mousemove', onMove);
            interactive.forEach((el) => {
                el.removeEventListener('mouseenter', grow);
                el.removeEventListener('mouseleave', shrink);
            });
        };
    }, []);

    useGSAP(() => {
        const path = lineRef.current;
        const pathLength = path.getTotalLength();

        gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        gsap.set(headRef.current, { opacity: 0 });

        // Denyut halus terus-menerus pada kepala garis
        gsap.to(headRef.current, {
            scale: 1.4,
            transformOrigin: '50% 50%',
            duration: 0.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });

        const state = { target: 0, current: 0 };

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            invalidateOnRefresh: true,
            onUpdate: (self) => { state.target = self.progress; },
        });

        const render = () => {
            state.current += (state.target - state.current) * 0.12;
            if (Math.abs(state.target - state.current) < 0.0005) state.current = state.target;

            const offset = pathLength * (1 - state.current);
            gsap.set(path, { strokeDashoffset: offset });

            if (state.current > 0.002) {
                gsap.set(headRef.current, { opacity: 1 });
                const point = path.getPointAtLength(pathLength * state.current);
                gsap.set(headRef.current, { attr: { cx: point.x, cy: point.y } });
            } else {
                gsap.set(headRef.current, { opacity: 0 });
            }
        };
        gsap.ticker.add(render);

        // Parallax bola cahaya
        gsap.utils.toArray('.parallax-item').forEach((layer) => {
            const speed = layer.dataset.speed;
            gsap.to(layer, {
                y: () => (ScrollTrigger.maxScroll(window) * speed),
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                    invalidateOnRefresh: true,
                },
            });
        });

        // Kartu muncul + efek "garis sampai" (pulse glow saat masuk viewport)
        gsap.utils.toArray('.reveal-card').forEach((card) => {
            gsap.from(card, {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            });

            ScrollTrigger.create({
                trigger: card,
                start: 'top 65%',
                end: 'bottom 35%',
                onEnter: () => {
                    gsap.timeline()
                        .to(card, { scale: 1.03, duration: 0.35, ease: 'power2.out' })
                        .to(card, {
                            boxShadow: '0 0 0 4px rgba(205,242,43,0.5), 0 20px 50px rgba(30,69,251,0.35)',
                            duration: 0.35,
                        }, '<')
                        .to(card, { scale: 1, duration: 0.5, ease: 'power2.out' })
                        .to(card, { boxShadow: '0 10px 40px rgba(30,69,251,0.2)', duration: 0.6 }, '<0.1');
                },
            });
        });

        return () => gsap.ticker.remove(render);
    }, { scope: containerRef, dependencies: [scaleY], revertOnUpdate: true });

    const { d: pathD } = buildSnakePath(scaleY);

    return (
        <div ref={containerRef} className="relative bg-white text-slate-900 min-h-[300vh] overflow-hidden cursor-none md:cursor-none">
            <Head title="Welcome - GSAP Experience" />

            {/* --- CURSOR KUSTOM --- */}
            <div ref={cursorDotRef} className="hidden md:block fixed top-0 left-0 w-2 h-2 rounded-full bg-[#1e45fb] pointer-events-none z-[999] opacity-0"></div>
            <div ref={cursorRingRef} className="hidden md:flex fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#cdf22b] pointer-events-none z-[998] opacity-0 items-center justify-center"></div>

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

            <div className="parallax-item absolute top-[4%] left-[6%] w-72 h-72 bg-[#1e45fb] rounded-full blur-[130px] opacity-[0.18] z-0" data-speed="0.2"></div>
            <div className="parallax-item absolute top-[18%] right-[8%] w-80 h-80 bg-[#cdf22b] rounded-full blur-[140px] opacity-[0.25] z-0" data-speed="-0.15"></div>
            <div className="parallax-item absolute top-[38%] left-[12%] w-64 h-64 bg-[#cdf22b] rounded-full blur-[120px] opacity-[0.2] z-0" data-speed="0.25"></div>
            <div className="parallax-item absolute top-[55%] right-[15%] w-96 h-96 bg-[#1e45fb] rounded-full blur-[150px] opacity-[0.15] z-0" data-speed="-0.1"></div>
            <div className="parallax-item absolute top-[75%] left-[20%] w-72 h-72 bg-[#1e45fb] rounded-full blur-[130px] opacity-[0.18] z-0" data-speed="0.3"></div>
            <div className="parallax-item absolute top-[90%] right-[10%] w-64 h-64 bg-[#cdf22b] rounded-full blur-[120px] opacity-[0.22] z-0" data-speed="-0.2"></div>

            <svg
                preserveAspectRatio="none"
                viewBox={`0 0 1000 ${(3000 * scaleY).toFixed(1)}`}
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

                <path
                    ref={lineRef}
                    d={pathD}
                    fill="none"
                    stroke="url(#gradient-line)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                <circle ref={headRef} r="9" fill="#cdf22b" />
            </svg>

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
                    <div className="animate-bounce mt-16 text-[#1e45fb] text-4xl">↓</div>
                </div>

                <div className="h-screen flex items-center justify-start w-full max-w-5xl">
                    <div className="reveal-card w-full md:w-1/2 p-8 bg-[#1e45fb] rounded-2xl shadow-[0_10px_40px_rgba(30,69,251,0.35)] relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#cdf22b] rounded-full blur-3xl opacity-30"></div>
                        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#cdf22b] text-[#0f2fc9] text-xs font-bold tracking-wide">01</span>
                        <h2 className="text-3xl font-bold text-white mb-4">Meliuk & Mengalir</h2>
                        <p className="text-white/80 leading-relaxed">
                            Garis kini dibangun dari kurva spline yang menjamin kelenturannya — tidak ada lagi tikungan tiba-tiba, hanya alur yang mengalir alami.
                        </p>
                    </div>
                </div>

                <div className="h-screen flex items-center justify-end w-full max-w-5xl">
                    <div className="reveal-card w-full md:w-1/2 p-8 bg-[#cdf22b] rounded-2xl shadow-[0_10px_40px_rgba(205,242,43,0.4)] relative overflow-hidden">
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#1e45fb] rounded-full blur-3xl opacity-20"></div>
                        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#1e45fb] text-white text-xs font-bold tracking-wide">02</span>
                        <h2 className="text-3xl font-bold text-[#0f2fc9] mb-4">Merespon Kehadiran</h2>
                        <p className="text-[#0f2fc9]/80 leading-relaxed">
                            Saat garis tiba di dekat kartu ini, kartunya berdenyut dengan glow ringan — sinyal visual bahwa perjalanan garis sudah sampai.
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