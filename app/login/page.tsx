import AuthLogin from "@/app/auth/authforms/AuthLogin";
import LeftSidebarPart from "@/app/auth/auth1/LeftSidebarPart";
import FullLogo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import Link from "next/link";

export default function LoginPage() {
  return (
<<<<<<< HEAD
    <main className="relative min-h-screen overflow-hidden bg-white dark:bg-darkgray">
      <div className="grid min-h-screen grid-cols-12 gap-0">
        <aside className="relative col-span-4 hidden overflow-hidden bg-dark lg:block">
          <LeftSidebarPart />
        </aside>
        <section className="col-span-12 px-4 sm:px-12 lg:col-span-8">
          <div className="flex min-h-screen items-center justify-center px-3">
            <div className="mx-auto w-full max-w-[420px]">
              <FullLogo />
              <h1 className="my-3 text-2xl font-bold">Sign in to Hiilbox</h1>
              <p className="text-sm font-medium text-darklink">Access your fundraiser dashboard and campaigns.</p>
              <AuthLogin />
              <div className="mt-6 flex items-center justify-center gap-2 text-base font-medium text-ld">
                <p>New to Hiilbox?</p>
                <Link href="/signup" className="text-sm font-medium text-primary">Create an account</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
=======
    <main className="relative min-h-screen overflow-hidden bg-white dark:bg-[#12141a]">
      <div className="grid min-h-screen grid-cols-12 gap-0">
        
        {/* Massive Animated Sidebar (8 columns on XL) */}
        <aside className="relative col-span-12 hidden overflow-hidden bg-[#0A192F] lg:block lg:col-span-7 xl:col-span-8 border-e border-gray-800">
          <LeftSidebarPart />
        </aside>
        
        {/* Focused Sign-In Workspace (4 columns on XL) */}
        <section className="col-span-12 lg:col-span-5 xl:col-span-4 flex flex-col justify-center px-8 sm:px-16 lg:px-12 xl:px-16 bg-white dark:bg-[#12141a]">
          <div className="w-full max-w-[400px] mx-auto">
            
            <div className="mb-10">
              <div className="mb-8 scale-110 origin-left">
                <FullLogo />
              </div>
              <h1 className="text-[28px] font-extrabold text-gray-900 dark:text-white tracking-tight">
                Sign in
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Welcome back! Access your fundraiser dashboard.
              </p>
            </div>

            <AuthLogin />

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <p>New to Hiilbox?</p>
              <Link href="/signup" className="font-bold text-[#01A14B] hover:text-[#018b41] transition-colors">
                Create an account
              </Link>
            </div>
            
          </div>
        </section>

      </div>
    </main>
  );
}
>>>>>>> 35ee921e2790c0f87bc08e87dc207affc44fd2dc
