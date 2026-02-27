import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";

function AuthModal({ onClose }: { onClose: () => void }) {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signUp");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
      onClose();
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-md w-full relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-display text-2xl mb-2">{flow === "signIn" ? "Welcome back" : "Create account"}</h2>
        <p className="text-white/50 text-sm mb-6">
          {flow === "signIn" ? "Sign in to track your application" : "Sign up to submit your application"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
          />
          <input name="flow" type="hidden" value={flow} />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : flow === "signIn" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          {flow === "signIn" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            className="text-white hover:underline"
          >
            {flow === "signIn" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

function ApplicationForm({ onAuthRequired }: { onAuthRequired: () => void }) {
  const { isAuthenticated } = useConvexAuth();
  const submit = useMutation(api.applications.submit);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await submit({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        twitterHandle: formData.get("twitter") as string,
        experience: formData.get("experience") as string,
        projectIdea: formData.get("projectIdea") as string,
        whyYou: formData.get("whyYou") as string,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl mb-2">Application Received</h3>
        <p className="text-white/50">We'll be in touch if you're selected to participate.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/60 text-sm mb-2">Full Name</label>
          <input
            name="name"
            type="text"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="block text-white/60 text-sm mb-2">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-white/60 text-sm mb-2">Twitter / X Handle</label>
        <input
          name="twitter"
          type="text"
          required
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
          placeholder="@yourusername"
        />
      </div>

      <div>
        <label className="block text-white/60 text-sm mb-2">Coding Experience</label>
        <select
          name="experience"
          required
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
        >
          <option value="" className="bg-[#0a0a0a]">Select your level</option>
          <option value="beginner" className="bg-[#0a0a0a]">Beginner - Learning the basics</option>
          <option value="vibe-coder" className="bg-[#0a0a0a]">Vibe Coder - I let AI do the heavy lifting</option>
          <option value="intermediate" className="bg-[#0a0a0a]">Intermediate - Comfortable building</option>
          <option value="advanced" className="bg-[#0a0a0a]">Advanced - Ship regularly</option>
        </select>
      </div>

      <div>
        <label className="block text-white/60 text-sm mb-2">What would you build?</label>
        <textarea
          name="projectIdea"
          required
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
          placeholder="Describe the startup idea you'd build on the show..."
        />
      </div>

      <div>
        <label className="block text-white/60 text-sm mb-2">Why should we pick you?</label>
        <textarea
          name="whyYou"
          required
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
          placeholder="What makes you interesting to watch? Are you chaotic? Methodical? Hilarious?"
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black font-medium py-4 rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 text-lg"
      >
        {loading ? "Submitting..." : isAuthenticated ? "Submit Application" : "Sign Up & Apply"}
      </button>

      {!isAuthenticated && (
        <p className="text-center text-white/40 text-sm">
          You'll need to create an account to submit
        </p>
      )}
    </form>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const stats = useQuery(api.applications.getStats);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Subtle grid background */}
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Gradient orb */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-white/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6">
        <div className="font-display text-lg tracking-tight">$1 STARTUP</div>
        {isLoading ? null : isAuthenticated ? (
          <button
            onClick={() => signOut()}
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            Sign In
          </button>
        )}
      </nav>

      {/* Hero */}
      <main className="relative z-10 px-6 md:px-12 pt-12 md:pt-24 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-white/70">Now accepting applications</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1.1] mb-6 animate-fade-in animation-delay-100">
            Watch vibe coders build
            <br />
            <span className="text-white/40">startups from zero to</span>
            <br />
            <span className="inline-flex items-baseline">
              <span className="text-green-400">$1</span>
              <span className="text-white/40 ml-2">revenue</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mb-12 animate-fade-in animation-delay-200">
            A YouTube series where we invite builders to create real products live on camera.
            No scripts. No polish. Just raw creation until first dollar.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 md:gap-12 mb-16 animate-fade-in animation-delay-300">
            <div>
              <div className="font-display text-3xl md:text-4xl">{stats?.total ?? "—"}</div>
              <div className="text-white/40 text-sm">Applications</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl">{stats?.accepted ?? "0"}</div>
              <div className="text-white/40 text-sm">Selected</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl">S01</div>
              <div className="text-white/40 text-sm">Coming Soon</div>
            </div>
          </div>

          {/* Concept Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20 animate-fade-in animation-delay-400">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-display text-lg mb-2">Live Building</h3>
              <p className="text-white/50 text-sm">Watch the entire process unfold. The chaos, the breakthroughs, the bugs.</p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-display text-lg mb-2">Vibe Coding</h3>
              <p className="text-white/50 text-sm">AI-assisted development. Cursor, Claude, Copilot. Whatever ships fastest.</p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-lg mb-2">Real Revenue</h3>
              <p className="text-white/50 text-sm">Not vanity metrics. Real paying customers. Even if it's just one dollar.</p>
            </div>
          </div>

          {/* Application Form Section */}
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-10 animate-fade-in animation-delay-500">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-display text-2xl md:text-3xl">Apply to Build</h2>
              <span className="bg-green-500/20 text-green-400 text-xs font-medium px-2 py-1 rounded-full">Open</span>
            </div>
            <p className="text-white/50 mb-8">Got an idea? Want to be on the show? Drop your application below.</p>

            <ApplicationForm onAuthRequired={() => setShowAuth(true)} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-white/5">
        <p className="text-center text-white/30 text-xs">
          Requested by <a href="https://twitter.com/0xPaulius" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">@0xPaulius</a> · Built by <a href="https://twitter.com/clonkbot" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">@clonkbot</a>
        </p>
      </footer>

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* Global styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
}
