"use client";

import { Button } from "@heroui/button";
import React from "react";
import { Avatar } from "@heroui/avatar";
import { FaPencil } from "react-icons/fa6";

import { useAuth } from "../auth-provider";
import Navbar from "../navbar";
import { LogoutIcon } from "../icons";

type Props = {};

const Account = (props: Props) => {
  const auth = useAuth();

  return (
    <main>
      <div className="sticky top-0">
        <Navbar
          endContent={
            <Button isIconOnly size="sm" variant="light" onPress={auth.logout}>
              <LogoutIcon className="text-foreground-100" size={24} />
            </Button>
          }
          title="ACCOUNT"
        />
        <div className="bg-primary p-6 pt-2 shadow-2xl shadow-primary rounded-b-3xl">
          <div className="flex gap-4 items-center">
            <Avatar
              className=""
              imgProps={{ src: auth.user?.image_url || undefined }}
              size="lg"
            />
            <div className="">
              <h4 className="text-foreground-100 font-medium text-lg">
                {auth.user?.name}
              </h4>
              <p className="text-sm text-foreground-300">
                {auth.user?.nik.toUpperCase()} | {auth.user?.role}
              </p>
            </div>
            <Button
              isIconOnly
              className="ms-auto text-foreground-100"
              variant="flat"
            >
              <FaPencil />
            </Button>
          </div>
        </div>
      </div>
      <div className="container py-4">
        <p className="text-justify">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quidem, ipsa
          repudiandae nesciunt eligendi deleniti doloremque ab velit quod! Fuga
          dolorem laborum doloremque ipsum iste expedita odit voluptate. Harum
          corporis porro ex consequatur, est sunt sit ad illo eaque laborum ea
          dignissimos ut excepturi iste dicta aut sapiente cum dolores, debitis
          perferendis hic deserunt tempore. Corrupti est accusantium ea?
          Temporibus delectus incidunt repellendus dolor nostrum repellat
          quaerat sed, cumque deserunt! Fuga sequi dolorum natus facilis
          doloremque quam distinctio modi repellendus officia ex! Dignissimos
          aut deleniti vitae itaque obcaecati culpa laudantium fugit! Magnam
          veniam voluptate impedit dolor praesentium dolores molestiae atque
          corrupti quisquam, ducimus enim saepe et vero dolorem id ullam quae
          sed at modi, provident cumque quaerat dolore mollitia repudiandae.
          Illum at eos dolore odio! Mollitia quos dicta autem distinctio
          architecto eaque reiciendis quae voluptatibus? Enim accusamus
          laudantium, dolores eveniet cum blanditiis laborum adipisci cumque
          inventore laboriosam esse alias suscipit voluptatem veniam eaque eius
          impedit non officiis provident? Ex, sit doloribus quisquam fuga
          itaque, quibusdam dicta aliquam vel obcaecati quas illo illum
          necessitatibus. Non illo est ipsum nesciunt iste voluptates. Illo
          ipsam ullam corporis odit distinctio aliquid quaerat, quas animi velit
          excepturi voluptate ducimus iure quae! Labore, deserunt sequi! Maiores
          quis voluptatem ducimus dicta consequatur deserunt dignissimos odio
          officiis asperiores ratione nulla magnam ipsam quibusdam in harum aut
          aliquid doloribus voluptas facilis quos, nam quae mollitia quia? Quia
          architecto ab incidunt nisi totam dolores, optio deleniti beatae
          doloremque adipisci ex recusandae autem obcaecati aliquid neque maxime
          sint, quae voluptates culpa provident odio dolorum officia? Eos
          perspiciatis voluptatibus asperiores eveniet delectus sit earum in
          autem, sed officia ipsum incidunt ad inventore cumque rem dignissimos.
          Suscipit similique sed cum fugiat! Consequatur, harum. Cum odio,
          inventore ipsam perspiciatis veniam quae illo facere minima alias rem
          iste sapiente voluptate, facilis optio fugiat! Commodi, reprehenderit
          earum?
        </p>
      </div>
    </main>
  );
};

export default Account;
