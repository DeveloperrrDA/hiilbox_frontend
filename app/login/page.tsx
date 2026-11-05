import AuthLogin from "@/app/auth/authforms/AuthLogin";
import LeftSidebarPart from "@/app/auth/auth1/LeftSidebarPart";

export default function LoginPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#021f12]">
      
      {/* Full-Screen Ambient Background Glows & Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#022A15] via-[#044A25] to-[#022A15] opacity-90 z-0" />
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[#01A14B]/30 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#008f40]/20 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Main Grid Workspace - Locked to Screen Height */}
      <div className="relative z-10 w-full h-full grid grid-cols-12 gap-0 px-4 sm:px-8 lg:px-12 xl:px-24">
        
        {/* Left Side: Animated Ecosystem + Typography */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-8 relative h-full">
          <LeftSidebarPart />
        </div>
        
        {/* Right Side: Floating White Form Box */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4 flex items-center justify-center h-full p-4 z-20">
          <div className="w-full max-w-[440px] bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/10">
            
            {/* Form Header */}
            <div className="mb-8">
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

            <AuthLogin />

            {/* Footer Registration Link */}
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-600">
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