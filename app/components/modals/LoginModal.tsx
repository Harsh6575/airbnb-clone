'use client';
import React from 'react';

import { signIn } from 'next-auth/react';

import { AiFillGithub } from "react-icons/ai";

import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

import { FieldValues, SubmitHandler, useForm} from "react-hook-form";
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import Button from '../Button';
import useLoginModal from '../../hooks/useLoginModal';
import { useRouter } from 'next/navigation';
import useRegisterModal from '../../hooks/useRegisterModal';

const LoginModal = () => {

  const router = useRouter();

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    }
  }); // useForm is a hook that returns a set of methods to handle form state and validation 

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true); // setIsLoading is a function that sets the isLoading state to true 

    signIn('credentials', {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false); // setIsLoading is a function that sets the isLoading state to false

      if (callback?.ok) {
        toast.success('Logged in');
        router.refresh();
        loginModal.onClose();
      }
      if(callback?.error) {
        toast.error(callback.error);
      }
      setIsLoading(false); // setIsLoading is a function that sets the isLoading state to false 
    });
  }; // submit event handler 

  const toggleModals = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal,registerModal]); // toggleModals is a function that toggles betweens the login and register modals

  const bodyContent = (
    <div className='flex flex-col gap-4'>
      <Heading
        title='Welcome back'
        subtitle='Log in to your account'
      />
      <Input
        id='email'
        label='Email'
        type='email'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      /> 
      <Input
        id='password'
        label='Password'
        type='password'
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      /> 
    </div>
  ); // bodyContent is a variable that contains the body content of the modal 

  const footerContent = (
    <div className='flex flex-col gap-4 mt-3'>
      <hr/>
      <Button 
        outline
        label='Continue with Google'
        icon={FcGoogle}
        onClick={() => {signIn("google")}}
      />
      <Button 
        outline
        label='Continue with GitHub'
        icon={AiFillGithub}
        onClick={() => signIn("github")}
      />
      <div className="text-neutral-500 text-center mt-4 font-light ">
        <p>First time here?
          <span 
            onClick={toggleModals} 
            className="text-neutral-800 cursor-pointer hover:underline">
            Create an account
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal 
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title='Login'
      actionLabel='Continue'
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default LoginModal;