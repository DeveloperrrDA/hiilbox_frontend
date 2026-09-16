"use client";

import Image from "next/image";

import Link from "next/link";
const Logo = () => {
  return (
    <Link href={"/dashboard"}>
      <Image
        src={"https://cdn.hiilbox.com/2026/05/Hiilbox-logo-1.webp"}
        alt="logo"
        width={40}
        height={30}
      />
    </Link>
  );
};

export default Logo;
