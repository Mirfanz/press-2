"use client";

import React from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";

import {
  BellIcon,
  BellBoldIcon,
  HomeIcon,
  HomeBoldIcon,
  UserIcon,
  UserBoldIcon,
  WalletIcon,
  WalletBoldIcon,
} from "./icons";

type Props = {};
const navItems = [
  {
    label: "Home",
    icon: {
      default: HomeIcon,
      active: HomeBoldIcon,
    },
    path: "/",
    patern: /^\/$/,
  },
  {
    label: "Inform",
    icon: {
      default: BellIcon,
      active: BellBoldIcon,
    },
    path: "/information",
    patern: /^\/information.*$/,
  },
  {
    label: "Cash",
    icon: {
      default: WalletIcon,
      active: WalletBoldIcon,
    },
    path: "/cash",
    patern: /^\/cash.*$/,
  },
  {
    label: "Account",
    icon: {
      default: UserIcon,
      active: UserBoldIcon,
    },
    path: "/account",
    patern: /^\/account.*$/,
  },
];
const Footer = (props: Props) => {
  const pathname = usePathname();

  return (
    <footer>
      <div className="bg-white py-3">
        <div className="flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              className={clsx(
                "flex w-full duration-300 flex-col gap-1 items-center justify-center",
                item.patern.test(pathname)
                  ? "text-primary-500"
                  : "text-foreground-400",
              )}
              href={item.path}
            >
              {item.patern.test(pathname) ? (
                <item.icon.active className="text-4xl" />
              ) : (
                <item.icon.default />
              )}
              <small className="text-xs">{item.label}</small>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
