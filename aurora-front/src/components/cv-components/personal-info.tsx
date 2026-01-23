import Input from "@/components/input";
import React, { useState, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const ACCEPTED_IMAGE_TYPES = ".png,.jpg,.jpeg,.gif,.webp";

export default function PersonalInfo() {
  const { register, control } = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const profileImage = useWatch({ control, name: "profileImage" });

  useEffect(() => {
    // Handle different types of profileImage value
    if (!profileImage) {
      setPreviewUrl(null);
      return;
    }

    // If it's a FileList (from file input)
    if (profileImage instanceof FileList && profileImage.length > 0) {
      const file = profileImage[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    // If it's a single File object (from editing existing resume)
    if (profileImage instanceof File) {
      const url = URL.createObjectURL(profileImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    setPreviewUrl(null);
  }, [profileImage]);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <Input
          label="Name"
          type="text"
          name="name"
          placeholder="First name"
          className="border border-white/10 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-aurora-green-dark transition"
        />

        <Input
          label="Surname"
          type="text"
          name="surname"
          placeholder="Last name"
          className="border border-white/10 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
        />
      </div>

      <div className="relative">
        <label className="absolute -top-3 left-3 bg-main-dark/80 px-2 text-xs text-text-dark/80 rounded z-10">
          Photo
        </label>
        <div className="flex items-center gap-4">
          {previewUrl && (
            <div className="shrink-0">
              <img
                src={previewUrl}
                alt="Profile preview"
                className="w-16 h-16 rounded-lg object-cover border border-white/20"
              />
            </div>
          )}
          <input
            type="file"
            accept={ACCEPTED_IMAGE_TYPES}
            {...register("profileImage")}
            className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-aurora-green-dark transition"
          />
        </div>
        <p className="text-xs text-text-dark/50 mt-1">
          Accepted formats: PNG, JPG, JPEG, GIF, WebP
        </p>
      </div>

      <Input
        label="ProfileDescription"
        textArea={true}
        name="profileDescription"
        placeholder="A short professional summary"
        className="border border-white/10 rounded-xl px-4 py-3 bg-transparent min-h-[80px] focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
      />
    </div>
  );
}
