"use client";
import { Button } from "@heroui/button";
import React from "react";
import { FaBarsStaggered } from "react-icons/fa6";
type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="bg-foreground-100 py-2">
      <div className="container">
        <div className="flex items-center">
          <h3 className="text-lg font-bold me-auto">PRESS</h3>
          <Button isIconOnly size="md">
            <FaBarsStaggered className="text-lg" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
