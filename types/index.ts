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
