"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { adminLogin } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

const LOGO_WHITE = "https://qxkevpcrzpywtalzctsz.supabase.co/storage/v1/object/public/seenways-images/logo-white-transparent.png";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>();

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await adminLogin(data);
      setAuth(res.data.token, res.data.admin);
      toast.success(`Welcome back, ${res.data.admin.name}`);
      router.push("/admin");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6" dir="ltr">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <Image src={LOGO_WHITE} alt="SEENWAYS" width={160} height={32} className="h-8 w-auto object-contain mx-auto mb-3" />
          <p className="text-white/30 text-xs tracking-widest uppercase">Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2 text-white/40">Email</label>
            <input {...register("email", { required: true })} type="email" autoComplete="email"
              className="w-full bg-white/5 border border-white/10 px-4 py-4 text-sm text-white focus:outline-none focus:border-white/40 transition-colors" />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2 text-white/40">Password</label>
            <div className="relative">
              <input {...register("password", { required: true })} type={showPass ? "text" : "password"} autoComplete="current-password"
                className="w-full bg-white/5 border border-white/10 px-4 py-4 text-sm text-white focus:outline-none focus:border-white/40 transition-colors pr-12" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-white text-black py-4 text-xs tracking-widest uppercase hover:bg-gray-100 transition-colors disabled:opacity-50 mt-2">
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
      </div>
    </div>
  );
}
