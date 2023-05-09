"use client";
import React from "react";
import { AiFillGithub } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useRegisterModal from "../../hooks/useRegisterModal";
import axios from "axios";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Button from "../Button";
import useLoginModal from "../../hooks/useLoginModal";

const RegisterModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  }); // useForm is a hook that returns a set of methods to handle form state and validation

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true); // setIsLoading is a function that sets the isLoading state to true
    axios
      .post("/api/register", data) // axios posts the data to the /api/register endpoint
      .then((res) => {
        toast.success("Account created successfully.");
        registerModal.onClose();
        loginModal.onOpen();
      }) // if the request is successful, close the modal
      .catch((err) => {
        toast.error("Something went wrong.");
      }) // if the request is unsuccessful, log the error
      .finally(() => {
        setIsLoading(false);
      }); // setIsLoading is a function that sets the isLoading state to false
  }; // submit event handler

  const toggleModals = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [loginModal,registerModal]); // toggleModals is a function that toggles betweens the login and register modals

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Welcome to AirBnB"
        subtitle="Create an account to continue"
      />
      <Input
        id="email"
        label="Email"
        type="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="name"
        label="Name"
        type="text"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  ); // bodyContent is a variable that contains the body content of the modal

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => {signIn("google")}}
      />
      <Button
        outline
        label="Continue with Github"
        icon={AiFillGithub}
        onClick={() => signIn("github")}
      />
      <div className="text-neutral-500 text-center mt-4 font-light ">
        <p>
          Already have an account?
          <span
            onClick={toggleModals}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
