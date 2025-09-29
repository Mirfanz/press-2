import { Role } from "@prisma/client";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type UserT = {
  nik: string;
  name: string;
  image_url: string | null;
  role: Role;
  active: boolean;
  created_at: Date;
};

export type TransactionT = {
  id: string;
  income: boolean;
  title: string;
  note: string | null;
  amount: number;
  images: string[];
  created_at: Date;
};

export type TaxT<User extends boolean = false> = {
  id: string;
  month: number;
  year: number;
  amount: number;
  unpaid_count: number;
  paid_count: number;
  created_at: Date;
} & (User extends true
  ? {
      unpaid_users: UserT[];
      paid_users: UserT[];
    }
  : {});

export type InformationT = {
  id: string;
  title: string;
  note: string | null;
  images: string[];
  created_at: Date;
  author: UserT;
};
