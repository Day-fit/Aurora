import Input from "@/components/input";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function PersonalInfo() {
  const { register } = useFormContext();
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Age"
          type="number"
          name="age"
          placeholder="Your age"
          options={{ valueAsNumber: true }}
          className="border border-white/10 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
        />
        <div className="relative">
          <label className="absolute -top-3 left-3 bg-main-dark/80 px-2 text-xs text-text-dark/80 rounded">
            Photo
          </label>
          <input
            type="file"
            {...register("profileImage")}
            className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-aurora-green-dark transition"
          />
        </div>
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
