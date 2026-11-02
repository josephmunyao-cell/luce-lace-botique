import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/products";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Luxe & Lace" },
      { name: "description", content: "Get in touch with Luxe & Lace boutique: visit, call, email or WhatsApp us." },
      { property: "og:title", content: "Contact Us — Luxe & Lace" },
      { property: "og:description", content: "Visit, call, email or WhatsApp our boutique." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(1, "Please enter a message").max(1000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) { setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message]))); return; }
    setErrors({}); setForm({ name: "", email: "", message: "" });
    toast.success("Thank you! We'll be in touch within 24 hours.");
  };
  return (
    <section className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-2">
      <div>
        <p className="eyebrow">We'd love to hear from you</p>
        <h1 className="mt-2 text-3xl">Contact Us</h1>
        <ul className="mt-8 space-y-5 text-sm">
          <li className="flex gap-3"><MapPin className="h-5 w-5 text-accent" /> 12 Riverside Drive, Westlands, Nairobi</li>
          <li className="flex gap-3"><Phone className="h-5 w-5 text-accent" /> +{WHATSAPP_NUMBER}</li>
          <li className="flex gap-3"><Mail className="h-5 w-5 text-accent" /> hello@luxeandlace.com</li>
          <li className="flex gap-3"><Clock className="h-5 w-5 text-accent" /> Mon–Sat, 10am – 7pm</li>
        </ul>
      </div>
      <form onSubmit={submit} className="space-y-4 bg-card p-6 shadow-luxe" noValidate>
        {(["name", "email"] as const).map((k) => (
          <label key={k} className="block text-xs uppercase tracking-widest">{k}
            <input className="field mt-1" type={k === "email" ? "email" : "text"} value={form[k]} maxLength={k === "email" ? 255 : 100} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            {errors[k] && <span className="mt-1 block normal-case tracking-normal text-destructive">{errors[k]}</span>}
          </label>
        ))}
        <label className="block text-xs uppercase tracking-widest">Message
          <textarea className="field mt-1 h-32" value={form.message} maxLength={1000} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          {errors["message"] && <span className="mt-1 block normal-case tracking-normal text-destructive">{errors["message"]}</span>}
        </label>
        <button className="btn-primary w-full">Send Message</button>
      </form>
    </section>
  );
}
