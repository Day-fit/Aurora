import React from "react";
import { useFormContext } from "react-hook-form";
import Input from "@/components/input";
export default function FormStyling() {
  const { register } = useFormContext();
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <Input
          name="title"
          label="Title"
          type="text"
          placeholder="Your CV title"
        />
        <div className="relative">
          <label className="absolute -top-3 left-3 bg-main-dark/80 px-2 text-xs text-text-dark/80 rounded">
            Template
          </label>
          <select
            className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-text-dark focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition cursor-pointer  "
            {...register("template", { required: true })}
          >
            <option value="1" className="bg-main-dark text-text-dark">
              Template 1
            </option>
            <option value="2" className="bg-main-dark text-text-dark">
              Template 2
            </option>
            <option value="3" className="bg-main-dark text-text-dark">
              Template 3
            </option>
            <option value="4" className="bg-main-dark text-text-dark">
              Template 4
            </option>
            <option value="5" className="bg-main-dark text-text-dark">
              Template 5
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
