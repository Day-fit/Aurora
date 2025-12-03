import Input from "@/components/input";
import React from "react";

export default function PersonalInfo() {
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
                    className="border border-white/10 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
                />
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Email address"
                    className="border border-white/10 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-aurora-blue-dark transition"
                />
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