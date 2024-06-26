"use client";
import React, { useState } from "react";
import cn from "classnames";
import axios from "axios";
import Button from "@/shared/ui/Button/Button";
import Input from "@/shared/ui/Input/Input";
import { BASE_URL } from "@/shared/api/BASE";

interface ModalI {
  onClose: () => void;
  active?: boolean;
}

interface UserData {
  role: number;
  login: string;
  full_name: string;
  password: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
}

const AuthModal = ({ onClose, active }: ModalI) => {
  const [username, setUsername] = useState("");
  const [activate, setActivate] = useState<string>("");
  const [showActivation, setShowActivation] = useState<boolean>(false);
  const [mail, setMain] = React.useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const modalRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      if (isRegistering) {
        const registerResponse = await fetch(
          "http://studhouse.kz/api/v1/auth/user/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              role: 1,
              login: username,
              full_name: username,
              password: password,
              is_active: true,
              is_staff: true,
              is_superuser: true,
            }),
          }
        );

        if (!registerResponse.ok) {
          throw new Error("Registration failed");
        }
        setShowActivation(true);

        const registerData = await registerResponse.json();

        localStorage.setItem("accessToken", registerData.jwt);
        window.location.reload();
        onClose();
      }

      const loginResponse = await fetch(
        "http://studhouse.kz/api/v1/jwt/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: username,
            password: password,
          }),
        }
      );

      if (!loginResponse.ok) {
        throw new Error("Login failed");
        alert("login error");
      }

      const loginData = await loginResponse.json();
      localStorage.setItem("accessToken", loginData.access);
      window.location.reload();
      onClose();
    } catch (error: any) {
      setErrorMessage(error.message || "Произошла ошибка");
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handleActivationSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/user/activate_user/`,
        {
          code: activate,
        }
      );
      if (response.data.is_active) {
      } else {
        setErrorMessage("Неверный код активации");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Произошла ошибка");
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleRoleChange = (event: any) => {
    setSelectedRole(event.target.value);
  };

  return (
    <div className="fixed z-[1000] inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white p-8 border-[1px] rounded-[15px] w-[580px] h-fit"
        ref={modalRef}
      >
        <div className="flex flex-col justify-between py-[20px]">
          <div className="flex justify-between mb-[30px]">
            <Button
              className={cn(!isRegistering ? "active" : "", "text-lg w-full", {
                "border-b-4 border-blue rounded-[3px]": !isRegistering,
              })}
              onClick={() => setIsRegistering(false)}
              label="Войти"
            />
            <Button
              className={cn(isRegistering ? "active" : "", "text-lg w-full", {
                "border-b-4 border-blue rounded-[3px]": isRegistering,
              })}
              onClick={() => setIsRegistering(true)}
              label="Регистрация"
            />
          </div>

          <form
            className="flex flex-col justify-between"
            onSubmit={handleSubmit}
          >
            <label className="mb-[30px]">
              <p className="text-[18px] font-[500]">Почта</p>
              <Input
                className="w-full h-[50px] py-[10px] px-[20px] border bg-[#F7F7F7] rounded-[12px] focus:outline-none"
                style={{ color: "#A8A2A2" }}
                name="username"
                placeholder="Введите электронную почту"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label className="mb-[20px]">
              <p className="text-[18px] font-[500]">Пароль</p>
              <Input
                className="w-full h-[50px] py-[10px] px-[20px] border bg-[#F7F7F7] rounded-[12px] focus:outline-none"
                style={{ color: "#A8A2A2" }}
                name="password"
                placeholder="Введите пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {isRegistering && !showActivation && (
              <div className="mb-[100px] flex items-center">
                <input
                  type="checkbox"
                  id="studentRole"
                  checked={selectedRole === "student"}
                  onChange={() => {
                    setSelectedRole(
                      selectedRole === "student" ? "" : "student"
                    );
                  }}
                />
                <label htmlFor="studentRole" className="ml-[10px]">
                  Студент
                </label>
              </div>
            )}

            {showActivation && isRegistering && (
              <label className="mb-[20px]">
                <p className="text-[18px] font-[500]">Код активации</p>
                <Input
                  className="w-full h-[50px] py-[10px] px-[20px] border bg-[#F7F7F7] rounded-[12px] focus:outline-none"
                  style={{ color: "#A8A2A2" }}
                  name="activate"
                  placeholder="Введите код активации"
                  type="text"
                  value={activate}
                  onChange={(e) => setActivate(e.target.value)}
                  required
                />
              </label>
            )}

            <div className="error-message">{errorMessage}</div>
            <Button
              className="bg-blue rounded-[5px] py-[10px] text-white text-[22px] font-500"
              type="submit"
              onClick={() => setShowActivation(true)}
              label={isRegistering ? "Зарегистрироваться" : "Войти"}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const EditAdvertisementPage = ({ match }) => {
//   const [advertisement, setAdvertisement] = useState({
//     title: '',
//     description: '',
//     price: '',
//     location: '',
//     paymentTime: '',
//     floor: 0,
//     typeOfHouse: '',
//     numberOfRooms: 0,
//     square: 0,
//     isSold: false,
//     isArchived: false,
//     haveWifi: false,
//     haveTV: false,
//     haveWashingMachine: false,
//     haveParking: false,
//     haveConditioner: false,
//     nearbyTradeCenter: false,
//     nearbyHospital: false,
//     nearbySchool: false,
//     nearbyGym: false,
//     uploaded_images: [],
//   });

//   useEffect(() => {
//     const fetchAdvertisement = async () => {
//       try {
//         const response = await axios.get(`http://studhouse.kz/api/v1/advertisement/${match.params.id}`);
//         setAdvertisement(response.data);
//       } catch (error) {
//         console.error('Error fetching advertisement:', error);
//       }
//     };
//     fetchAdvertisement();
//   }, [match.params.id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setAdvertisement((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`http://studhouse.kz/api/v1/advertisement/${match.params.id}`, advertisement);
//     } catch (error) {
//       console.error('Error updating advertisement:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Edit Advertisement</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Title:
//           <input type="text" name="title" value={advertisement.title} onChange={handleChange} />
//         </label>
//         <button type="submit">Save Changes</button>
//       </form>
//     </div>
//   );
// };

// export default EditAdvertisementPage;
