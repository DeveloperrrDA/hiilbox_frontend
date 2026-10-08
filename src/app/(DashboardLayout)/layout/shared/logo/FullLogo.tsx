"use client";
import Image from "next/image";
import Link from "next/link";
const FullLogo = () => {
  return (
    <Link href={"/"}>
      {/* Dark Logo   */}
      <Image
        src={"https://cdn.hiilbox.com/2026/05/Hiilbox-logo-1.webp"}
        alt="logo"
        width={152}
        height= {29}
        className="block dark:hidden rtl:scale-x-[-1] width:auto height:auto"
      />
      {/* Light Logo  */}
      <Image
        src={"https://cdn.hiilbox.com/2026/05/Hiilbox-logo-1.webp"}
        alt="logo"
        width={152}
        height={29}
        className="hidden dark:block rtl:scale-x-[-1] width:auto height:auto"
      />
    </Link>
  );
};

export default FullLogo;
