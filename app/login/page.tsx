import AuthLogin from "@/app/auth/authforms/AuthLogin";
import LeftSidebarPart from "@/app/auth/auth1/LeftSidebarPart";

export default function LoginPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-white lg:bg-[#021f12]">
      
      {/* Full-Screen Ambient Background Glows & Gradients (Desktop Only) */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-[#022A15] via-[#044A25] to-[#022A15] opacity-90 z-0" />
      <div className="hidden lg:block absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#01A14B]/30 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="hidden lg:block absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#008f40]/20 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Main Grid Workspace */}
      <div className="relative z-10 w-full h-full grid grid-cols-12 gap-0 lg:px-12 xl:px-24">
        
        {/* Left Side: Animated Ecosystem + Typography (Desktop Only) */}
        <div className="hidden lg:block col-span-12 lg:col-span-7 xl:col-span-8 relative h-full">
          <LeftSidebarPart />
        </div>
        
        {/* Right Side: Form (Full White on Mobile, Floating Box on Desktop) */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4 flex items-center justify-center h-full z-20">
          <div className="w-full h-full lg:h-auto lg:max-w-[440px] bg-white lg:rounded-3xl p-8 sm:p-12 lg:p-10 lg:shadow-[0_20px_60px_rgba(0,0,0,0.4)] lg:border border-white/10 flex flex-col justify-center overflow-y-auto">
            
            {/* Form Header */}
            <div className="mb-8 shrink-0">
              <div className="mb-6 scale-110 origin-left">
                <img 
                  src="https://cdn.hiilbox.com/2026/05/Hiilbox-logo-1.webp" 
                  alt="Hiilbox" 
                  className="h-8 w-auto object-contain" 
                />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Sign in
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Welcome back! Access your fundraiser dashboard.
              </p>
            </div>

            <div className="shrink-0">
              <AuthLogin />
            </div>

            {/* Footer Registration Link */}
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-600 shrink-0">
              <p>New to Hiilbox?</p>
              <a href="/signup" className="font-bold text-[#01A14B] hover:text-[#018b41] transition-colors">
                Create an account
              </a>
            </div>
            
          </div>
        </div>

      </div>
    </main>
  );
}