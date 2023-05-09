"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {};

const Logo = (props: Props) => {
  const router = useRouter();
  return (
    <Image
        src='/images/logo.png'
        alt='logo'
        width="100"
        height="100"
        className="hidden md:block cursor-pointer"
        onClick={() => router.push("/")}
    />
  )
};

export default Logo;
