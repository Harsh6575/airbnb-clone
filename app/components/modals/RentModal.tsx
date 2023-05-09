"use client";
import React, { useMemo, useState } from "react";
import Modal from "./Modal";
import useRentModal from "../../hooks/useRentModal";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
// import Map from "../Map";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: "",
      price: 1,
      title: "",
      description: "",
    },
  }); // useForm is a hook that is used to handle the form data and validation of the form data in the process of listing a home on Airbnb

  const category = watch("category"); // category is a variable that is used to store the category of the home that is being listed on Airbnb

  const location = watch("location"); // location is a variable that is used to store the location of the home that is being listed on Airbnb

  const guestCount = watch("guestCount"); // guestCount is a variable that is used to store the number of guests that can be accommodated in the home that is being listed on Airbnb

  const roomCount = watch("roomCount"); // roomCount is a variable that is used to store the number of rooms that are available in the home that is being listed on Airbnb

  const bathroomCount = watch("bathroomCount"); // bathroomCount is a variable that is used to store the number of bathrooms that are available in the home that is being listed on Airbnb

  const imageSrc = watch("imageSrc"); // imageSrc is a variable that is used to store the image of the home that is being listed on Airbnb

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  // setCustomValue is a function that is used to set the value of a field in the form data in the process of listing a home on Airbnb

  const onBack = () => {
    setStep((value) => value - 1);
  }; // onBack is a function that sets the step state to the previous step in the process of listing a home on Airbnb

  const onNext = () => {
    setStep((value) => value + 1);
  }; // onNext is a function that sets the step state to the next step in the process of listing a home on Airbnb

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if(step !== STEPS.PRICE) {
      return onNext();
    }
    setIsLoading(true); 

    axios.post("/api/listings", data).then(() => {
      toast.success("Listing created!");
       router.refresh();
       reset();
       setStep(STEPS.CATEGORY);
       rentModal.onClose();
    }).catch(() => {
      toast.error("Something went wrong!");
    }).finally(() => {
      setIsLoading(false);
    });
  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return "Create";
    } // if the steps state is equal to the last step in the process of listing a home on Airbnb, the actionLabel variable is set to 'Create'

    return "Next";
  }, [step]); // actionLabel is a variable that is used to determine the label of the button that is used to submit the form

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    } // if the steps state is equal to the first step in the process of listing a home on Airbnb, the secondaryActionLabel variable is set to 'Cancel'

    return "Back";
  }, [step]); // secondaryActionLabel is a variable that is used to determine the label of the button that is used to go back to the previous step in the process of listing a home on Airbnb

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categories &&
          categories.map((item) => (
            <div key={item.label} className="col-span-1">
              <CategoryInput
                label={item.label}
                icon={item.icon}
                onClick={(category) => {
                  setCustomValue("category", category);
                }}
                selected={category === item.label}
              />
            </div>
          ))}
      </div>
    </div>
  ); //body content is variable so it is declared as a let variable and it is used to store the content of the modal

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your place located?"
          subtitle="Help guest find you!"
        />
        <CountrySelect
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics of your place"
          subtitle="What amenities do you have?"
        />
        <Counter
          title="Guests"
          subtitle="How many guests can your place accommodate?"
          value={watch("guestCount")}
          onChange={(value) => setCustomValue("guestCount", value)}
        />
        <hr />
        <Counter
          title="Rooms"
          subtitle="How many Rooms does your place have?"
          value={watch("roomCount")}
          onChange={(value) => setCustomValue("roomCount", value)}
        />
        <hr />
        <Counter
          title="Bathrooms"
          subtitle="How many Bathrooms does your place have?"
          value={watch("bathroomCount")}
          onChange={(value) => setCustomValue("bathroomCount", value)}
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add some photos of your place"
          subtitle="Show guests what your place looks like"
        />
        <ImageUpload
          value={imageSrc}
          onChange={(value) => setCustomValue("imageSrc", value)}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short and sweet works best"
        />
        <Input
          label="Title"
          id="title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          label="Description"
          id="description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, Set your price "
          subtitle="How much do you charge per night?"
        />
        <Input
          label="Price"
          id="price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  return (
    <Modal
      title="Airbnb Your Home"
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default RentModal;
