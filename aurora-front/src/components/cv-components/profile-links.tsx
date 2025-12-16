import Input from "@/components/input";
import React from "react";

export default function ProfileLinks() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Email address"
          className="border border-white/10 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
        />
        <Input
          label="linkedIn"
          type="text"
          name="linkedIn"
          placeholder="Your linkedIn account"
          className="border border-white/10 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <Input
          label="GitHub"
          type="text"
          name="gitHub"
          placeholder="Your gitHub account"
          className="border border-white/10 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
        />
        <Input
          label="Website"
          type="text"
          name="website"
          placeholder="Your website"
          className="border border-white/10 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
        />
      </div>
    </div>
  );
}
