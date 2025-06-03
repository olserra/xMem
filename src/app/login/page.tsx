"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSent(false);
        const res = await signIn("email", { email, redirect: false });
        if (res?.error) setError(res.error);
        else setSent(true);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 px-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gradient-to-tr from-teal-400 to-indigo-500 rounded-full p-3 mb-2 shadow-lg animate-pulse">
                        <Sparkles size={36} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">xmem</h1>
                    <p className="text-slate-300 text-sm">Memory Orchestrator for LLMs</p>
                </div>
                <div className="bg-white/90 rounded-2xl shadow-2xl p-8 backdrop-blur-md border border-slate-200">
                    <h2 className="text-xl font-bold mb-6 text-center text-slate-800">Sign in to your account</h2>
                    <button
                        className="w-full py-2 px-4 mb-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow cursor-pointer"
                        onClick={() => signIn("google")}
                    >
                        Continue with Google
                    </button>
                    <div className="text-center text-slate-400 my-4">or</div>
                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                        <input
                            type="email"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white shadow-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            disabled={loading || sent}
                        />
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-semibold shadow cursor-pointer"
                            disabled={loading || sent}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2"><span className="animate-spin">⏳</span> Sending...</span>
                            ) : sent ? "Check your email" : "Continue with Email"}
                        </button>
                    </form>
                    {error && <div className="text-red-600 mt-4 text-center font-medium animate-pulse">{error}</div>}
                    {sent && (
                        <div className="text-green-600 mt-4 text-center font-medium animate-pulse">
                            Check your email for a magic link!<br />
                            <span className="text-xs text-slate-500">(If using Ethereal, open the Ethereal dashboard)</span>
                        </div>
                    )}
                </div>
                <div className="mt-6 text-center">
                    <a href="/" className="text-indigo-400 hover:underline text-sm">&larr; Back to Home</a>
                </div>
            </div>
        </div>
    );
} 