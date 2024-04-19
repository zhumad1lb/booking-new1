"use client";
import React from "react";
import cn from "classnames";
import Button from "@/shared/ui/Button/Button";
import AuthModal from "@/features/AuthModal/ui/AuthModal";
// import { useUser } from "@/features/UserContext/ui/UserProvider";
import Input from "@/shared/ui/Input/Input";
import Dropdown from "@/shared/ui/Dropdown/Dropdown";
import Link from "next/link";
import Logo from "@/shared/ui/Icons/Logo/Logo";
import Search from "@/shared/ui/Icons/Search/Search";
import Avatar from "@/shared/ui/Icons/Avatar/avatar";

interface HeaderProps {
  isProfile: boolean;
  isHouse?: boolean;
}

export default function HeaderStudent() {
  // const { user, setUser } = useUser();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const jwt = require("jsonwebtoken");

    const decodedToken = jwt.decode(accessToken);
    console.log("decoded token: ", decodedToken);
    const userId = decodedToken?.user_id;

    if (userId) {
      localStorage.setItem("userId", userId);
    }

    const fetchName = async () => {
      try {
        const userResponse = await fetch(
          `http://studhouse.kz/api/v1/auth/user/${userId}/`
        );
        const user = await userResponse.json();
        setName(user.full_name);
        console.log("user role: ", user.role.id);
      } catch (error) {
        console.error("Ошибка при загрузке данных: ", error);
      }
    };

    fetchName();
  }, []);

  // const handleLoginClick = () => {
  //   if (!user) {
  //     setIsModalOpen(true);
  //   }
  // };

  const handleLogout = () => {
    // setUser(null);
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const options = [
    { label: "Личные данные", path: "/routs/settings" },
    { label: "Мои объявления", path: "/routs/product" },
    { label: "Выйти", onClick: handleLogout },
  ];

  return (
    <header className={cn("border-b-[1px] border-[#534949] py-[30px]")}>
      <div className="container">
        <nav className="flex justify-between items-center">
          <Link href={"/"}>
            <Logo />
          </Link>
          <div className="flex gap-[2px]">
            <Search />
            <Input
              className="text-md text-primary border-primary border-b-[2px] py-[2px] px-[4px]"
              placeholder="Поиск квартиры"
            />
          </div>

          <div className="flex items-center gap-[40px]">
            <Link href={"/routs/product"}>
              <Button className="text-md font-[500]" label="Квартиры" />
            </Link>
            <Link href={"/routs/posthouse"}>
              <Button className="text-md font-[500]" label="Подселение" />
            </Link>
            <Link href={"/routs/chat"}>
              <Button className="text-md font-[500]" label="Сообщение" />
            </Link>
            <Link href={"/routs/favourite"}>
              <Button className="text-md font-[500]" label="Избранное" />
            </Link>

            <Dropdown
              buttonStyle="text-md font-[500]"
              listStyle="flex items-center bg-white text-base py-[14px] px-[45px] flex flex-col border-white rounded-[6px] gap-[13px] w-[210px] h-fit"
              options={options}
              label={<Avatar /> || "Name"}
              // onClick={handleLogout}
            />
          </div>
        </nav>
      </div>
      {/* {isModalOpen && <AuthModal onClose={closeModal} />} */}
    </header>
  );
}
