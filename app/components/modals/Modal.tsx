"use client";
import React, { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}; // an interface is a type that describes an object shape and its properties and methods (if any) 

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]); // useEffect is a hook that runs a function when a component is mounted or updated 

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }; // if the modal is disabled, return nothing

    // useCallback is a hook that returns a memoized version of the callback that only changes if one of the dependencies has changed

    setShowModal(false); // setShowModal is a function that sets the showModal state to false 

    setTimeout(() => {
      onClose();
    }, 300);
    // setTimeout is a function that calls a function or evaluates an expression after a specified number of milliseconds
  }, [onClose, disabled]); // close event handler with a delay of 300ms 

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }; // if the modal is disabled, return nothing

    onSubmit(); // onSubmit is a function that calls the onSubmit prop 

  }, [onSubmit, disabled]); // submit event handler 

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }; // if the modal is disabled or there is no secondary action, return nothing

    secondaryAction(); // secondaryAction is a function that calls the secondaryAction prop

  }, [disabled, secondaryAction]); // secondary action event handler 

  if (!isOpen) {
    return null;
  } // if the modal is not open, return nothing

  return (
    <>
      <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
        <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto">
          {/* content */}
          <div
            className={`translate duration-300 h-full
                ${showModal ? "translate-y-0" : "translate-y-full"}
                ${showModal ? "opacity-100" : "opacity-0"}
                `}
          >
            <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none ">
              {/* header */}
              <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
                <button
                  className="p-1 border-0 hover:opacity-70 transition absolute left-9"
                  onClick={handleClose}
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-lg font-semibold">{title}</div>
              </div>
              {/* body */}
              <div className="relative p-6 flex-auto">{body}</div>
              {/* footer */}
              <div className="flex flex-col gap-2 p-6">
                <div className="flex flex-col items-center gap-4 w-full">
                  {secondaryActionLabel && secondaryAction && (
                    <Button
                      outline
                      label={secondaryActionLabel}
                      onClick={handleSecondaryAction}
                      disabled={disabled}
                    />
                  )}
                  <Button
                    label={actionLabel}
                    onClick={handleSubmit}
                    disabled={disabled}
                  />
                </div>
                {footer }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
