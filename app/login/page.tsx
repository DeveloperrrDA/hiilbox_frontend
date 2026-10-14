import AuthLogin from "@/app/auth/authforms/AuthLogin";
import LeftSidebarPart from "@/app/auth/auth1/LeftSidebarPart";
import FullLogo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import Link from "next/link";

export default function LoginPage() {
  return (
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
