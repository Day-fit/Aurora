"use client";

import template1 from "@/../public/template1.png";
import template2 from "../../../../public/template2.png";
import template3 from "../../../../public/template3.png";
import template4 from "../../../../public/template4.png";
import template5 from "../../../../public/template5.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import * as Dialog from "@radix-ui/react-dialog";

import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import React from "react";

export default function TemplatesSlider() {
  const images = [template1, template2, template3, template4, template5];

  return (
    <section id="templates" className="bg-main-dark p-4 sm:p-6 md:p-10 relative">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center text-heading-dark select-none">
        Templates
      </h1>

      {/* Custom Arrows - Hidden on mobile, shown on sm and up */}
      <div
        className="custom-prev absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-50
                    bg-frame-dark shadow-lg w-10 h-10 sm:w-12 sm:h-12 rounded-full hidden sm:flex items-center justify-center
                    cursor-pointer hover:bg-aurora-blue-dark active:scale-95 transition-all text-text-dark border border-white/5"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sm:w-6 sm:h-6"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </div>

      <div
        className="custom-next absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-50
                    bg-frame-dark shadow-lg w-10 h-10 sm:w-12 sm:h-12 rounded-full hidden sm:flex items-center justify-center
                    cursor-pointer hover:bg-aurora-blue-dark active:scale-95 transition-all text-text-dark border border-white/5"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sm:w-6 sm:h-6"
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
        spaceBetween={16}
        centeredSlides={false}
        breakpoints={{
          0: { slidesPerView: 1.1, spaceBetween: 12 },
          480: { slidesPerView: 1.3, spaceBetween: 16 },
          640: { slidesPerView: 1.5, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          1440: { slidesPerView: 4, spaceBetween: 25 },
        }}
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <Dialog.Root>
              <div className="bg-frame-dark rounded-xl shadow-lg p-3 sm:p-4 flex flex-col items-center select-none border border-white/5 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]">
                <div className="relative w-full h-[400px] sm:h-[480px] rounded-lg overflow-hidden">
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
                  <button className="mt-3 sm:mt-4 px-5 sm:px-6 py-2 bg-aurora-blue-dark text-white rounded-full text-sm hover:brightness-110 active:scale-95 transition-all font-medium">
                    See Template
                  </button>
                </Dialog.Trigger>
              </div>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100" />

                {/* Clicking DialogContent now also closes it because we've removed the X and simplified the container */}
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:w-[90vw] max-w-2xl max-h-[90vh] z-101 flex flex-col focus:outline-none cursor-zoom-out">
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
