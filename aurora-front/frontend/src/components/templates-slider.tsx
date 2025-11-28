"use client";

import temp from "@/../public/hero-picture.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";

export default function TemplatesSlider() {
    const images = [temp, temp, temp, temp, temp, temp, temp, temp];

    return (
        <section className="bg-[#f3f3f3] p-10 relative">
            <h1 className="text-3xl font-semibold mb-6 text-center select-none">Templates</h1>

            {/* Custom Arrows */}
            <div className="custom-prev absolute left-5 top-1/2 -translate-y-1/2 z-50
                bg-white shadow-lg w-12 h-12 rounded-full flex items-center justify-center
                cursor-pointer hover:bg-gray-100 transition">
                <svg width="24" height="24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </div>

            <div className="custom-next absolute right-5 top-1/2 -translate-y-1/2 z-50
                bg-white shadow-lg w-12 h-12 rounded-full flex items-center justify-center
                cursor-pointer hover:bg-gray-100 transition">
                <svg width="24" height="24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </div>

            <Swiper
                modules={[Navigation]}
                navigation={{
                    nextEl: ".custom-next",
                    prevEl: ".custom-prev",
                }}
                loop
                spaceBetween={25}
                centeredSlides={false}
                breakpoints={{
                    0: { slidesPerView: 1 },
                    640: { slidesPerView: 1.3 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1440: { slidesPerView: 4 },
                }}
            >
                {images.map((src, i) => (
                    <SwiperSlide key={i}>
                        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center select-none">
                            <div className="relative w-full h-[480px] rounded-lg overflow-hidden">
                                <Image
                                    src={src}
                                    alt={`Slide ${i}`}
                                    fill
                                    className="object-cover"
                                    priority={i === 0}
                                    unoptimized
                                />
                            </div>

                            <button className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-700 transition">
                                See Template
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
