import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function AnimatedBox() {
    // useRef untuk menargetkan elemen HTML
    const container = useRef();
    const box = useRef();

    useGSAP(() => {
        // Animasi: Menggeser ke kanan 200px dan berputar 360 derajat
        gsap.to(box.current, {
            x: 200,
            rotation: 360,
            duration: 2,
            ease: "power2.inOut",
            repeat: -1, // -1 berarti animasi akan diulang selamanya
            yoyo: true  // Animasi akan bolak-balik (maju-mundur)
        });
    }, { scope: container }); // Scope membatasi animasi hanya di dalam container ini

    // Laravel Breeze sudah include TailwindCSS, jadi class ini otomatis berfungsi
    return (
        
            
                GSAP
            
        
    );
}