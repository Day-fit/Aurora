"use client";

import { useEffect, useState } from "react";
import { CvCard } from "@/components/cv-components/cv-card";
import { CvHeader } from "@/components/cv-components/cv-header";
import { CvEmptyState } from "@/components/cv-components/cv-empty-state";
import { LanguageType } from "@/lib/types/language";

interface ResumeData {
  id: string;
  title: string;
  name: string;
  surname: string;
  previewImage?: string | null;
  language?: LanguageType | null;
}

export function CvListClient() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResumes() {
      try {
        const response = await fetch("/api/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            endpoint: "/api/v1/core/resume/getAll",
            method: "GET",
            service: "CORE",
          }),
        });

        const data = await response.json();

        // Check the actual response status, not just response.ok
        if (response.status === 401 || response.status === 403) {
          setError("Authentication required. Please log in again.");
          setResumes([]);
        } else if (!response.ok) {
          setError("Failed to load resumes");
          setResumes([]);
        } else if (Array.isArray(data)) {
          setResumes(data);
        } else {
          setResumes([]);
        }
      } catch (err) {
        console.error("Failed to fetch resumes:", err);
        setError("Failed to load resumes");
        setResumes([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResumes();
  }, []);

  if (isLoading) {
    return (
      <section className="rounded-xl p-4 sm:p-10 md:p-16 h-full min-h-[calc(60vh-80px)]">
        <div className="bg-main-dark/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 md:p-12 flex flex-col md:flex-row gap-10 text-text-dark shadow-2xl items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-green-dark"></div>
            <p className="text-text-dark/70">Loading your resumes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl p-4 sm:p-10 md:p-16 h-full min-h-[calc(60vh-80px)]">
        <div className="bg-main-dark/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 md:p-12 flex flex-col gap-6 text-text-dark shadow-2xl items-center justify-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-aurora-blue-dark text-white rounded-lg hover:bg-aurora-blue-dark/80 transition"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const hasResumes = resumes.length > 0;

  return (
    <section className="rounded-xl p-4 sm:p-10 md:p-16 h-full min-h-[calc(60vh-80px)]">
      <div className="bg-main-dark/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 md:p-12 flex flex-col md:flex-row gap-10 text-text-dark shadow-2xl items-center justify-center">
        {!hasResumes ? (
          <CvEmptyState />
        ) : (
          <div className="flex flex-col w-full gap-6 sm:gap-10">
            <CvHeader />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
              {resumes.map((cv) => (
                <CvCard key={cv.id} id={cv.id} data={cv} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
