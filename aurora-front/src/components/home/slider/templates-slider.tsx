"use client";

import temp from "../../../../public/hero-picture.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import * as Dialog from "@radix-ui/react-dialog";

import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import React from "react";

export default function TemplatesSlider() {
  const images = [temp, temp, temp, temp, temp, temp, temp, temp];

  return (
    <section className="bg-main-dark p-10 relative">
      <h1 className="text-3xl font-semibold mb-6 text-center text-heading-dark select-none">
        Templates
      </h1>

      {/* Custom Arrows */}
      <div
        className="custom-prev absolute left-5 top-1/2 -translate-y-1/2 z-50
                    bg-frame-dark shadow-lg w-12 h-12 rounded-full flex items-center justify-center
                    cursor-pointer hover:bg-aurora-blue-dark transition text-text-dark border border-white/5"
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </div>

      <div
        className="custom-next absolute right-5 top-1/2 -translate-y-1/2 z-50
                    bg-frame-dark shadow-lg w-12 h-12 rounded-full flex items-center justify-center
                    cursor-pointer hover:bg-aurora-blue-dark transition text-text-dark border border-white/5"
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
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
            <Dialog.Root>
              <div className="bg-frame-dark rounded-xl shadow-lg p-4 flex flex-col items-center select-none border border-white/5">
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

                <Dialog.Trigger asChild>
                  <button className="mt-4 px-6 py-2 bg-aurora-blue-dark text-white rounded-full text-sm hover:brightness-110 transition font-medium">
                    See Template
                  </button>
                </Dialog.Trigger>
              </div>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100" />

                {/* Clicking DialogContent now also closes it because we've removed the X and simplified the container */}
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl max-h-[90vh] z-101 flex flex-col focus:outline-none cursor-zoom-out">
                  <div className="hidden">
                    <Dialog.Title>Template Full Preview</Dialog.Title>
                    <Dialog.Description>
                      Viewing a high-resolution preview of the resume template.
                    </Dialog.Description>
                  </div>

                  {/* Wrapper to handle clicking to close */}
                  <Dialog.Close asChild>
                    <div className="w-full h-full overflow-y-auto rounded-lg [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      <Image
                        src={src}
                        alt="Full Template Preview"
                        width={1000}
                        height={1400}
                        className="w-full h-auto rounded-lg"
                        unoptimized
                      />
                    </div>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
