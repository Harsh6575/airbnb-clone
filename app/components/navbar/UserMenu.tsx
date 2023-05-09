"use client";
import React, { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { SafeUser } from "../../types";

import Avatar from "../Avatar";
import MenuItems from "./MenuItems";

import useRegisterModal from "../../hooks/useRegisterModal";
import useLoginModal from "../../hooks/useLoginModal";
import useRentModal from "../../hooks/useRentModal";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {

  const router = useRouter(); // router is a variable that contains the useRouter hook

  const registerModal = useRegisterModal(); // registerModal is a variable that contains the useRegisterModal hook
  const loginModal = useLoginModal(); // loginModal is a variable that contains the useLoginModal hook
  const rentModal = useRentModal(); // rentModal is a variable that contains the useRentModal hook

  const [isOpen, setIsOpen] = useState(false); // isOpen is a variable that contains the useState hook

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []); // toggleOpen is a function that sets the isOpen state to the opposite of its current value

  const onRent = useCallback(()=>{
    if(!currentUser){
      return loginModal.onOpen();
    }; // if the user is not logged in, open the login modal when the user clicks on the "Airbnb your home" button in the navbar 

    // if the user is logged in, redirect the user to the on rent modal
    rentModal.onOpen();
  },[loginModal, currentUser, rentModal]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={() => {onRent()}}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          Airbnb your home
        </div>
        <div
          onClick={() => {
            toggleOpen();
          }}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image}/>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItems onClick={() => {router.push('/trips')}} label="My Trips" />

                <MenuItems onClick={() => {router.push('/favorites')}} label="My Favorites" />
                <MenuItems onClick={() => {router.push('/reservations')}} label="My Reservations" />
                <MenuItems onClick={() => {router.push('/properties')}} label="My Properties" />
                <hr/>
                <MenuItems onClick={() => {rentModal.onOpen()}} label="Airbnb my home" />
                <MenuItems onClick={() => {signOut()}} label="Logout" />
              </>
            ) : (
              <>
                <MenuItems
                  onClick={() => {
                    loginModal.onOpen();
                  }}
                  label="Login"
                />
                <MenuItems
                  onClick={() => {
                    registerModal.onOpen();
                  }}
                  label="SignUp"
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
