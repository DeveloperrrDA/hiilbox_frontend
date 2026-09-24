import Image from "next/image";
import Link from "next/link";

export default function ThemeFooter() {
  return (
    <footer className="bg-[#111c2d] text-white">
      <div className="container-1218 grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div className="lg:col-span-2">
          <Image src="https://cdn.hiilbox.com/2026/05/Hiilbox-logo-1.webp" alt="Hiilbox" width={150} height={50} style={{ width: "auto", height: "50px" }} className="brightness-0 invert" />
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#a8b6c5]">Hiilbox is a trusted Somali crowdfunding platform helping people raise funds for medical needs, education, emergencies, community projects, and charitable causes through secure and transparent fundraising.</p>
        </div>
        <div>
          <h3 className="font-bold">Fundraise</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[#a8b6c5]">
            <Link href="/signup" className="hover:text-[#01A14B]">Start a fundraiser</Link>
            <Link href="/campaigns" className="hover:text-[#01A14B]">Explore campaigns</Link>
            <Link href="/campaigns" className="hover:text-[#01A14B]">Donate</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Resources</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[#a8b6c5]">
            <Link href="/" className="hover:text-[#01A14B]">About us</Link>
            <Link href="/" className="hover:text-[#01A14B]">How it works</Link>
            <Link href="/" className="hover:text-[#01A14B]">Contact</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[#2c394b]">
        <div className="container-1218 flex flex-col gap-2 py-7 text-xs text-[#8fa0b2] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Hiilbox. All rights reserved.</span>
          <span>Secure crowdfunding for stronger communities.</span>
        </div>
      </div>
    </footer>
  );
}
