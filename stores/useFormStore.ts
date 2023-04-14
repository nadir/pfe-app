import { create } from "zustand";

type PersonalInformation = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  dateOfBirth: string;
};

type FormState = {
  activeStep: number;
  setActiveStep: (activeStep: number) => void;
  personalInformation: PersonalInformation;
  setPersonalInformation: (personalInformation: PersonalInformation) => void;
};

export const useFormStore = create<FormState>((set) => ({
  activeStep: 0,
  setActiveStep: (activeStep) => set((state) => ({ ...state, activeStep })),
  personalInformation: {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    dateOfBirth: "",
  },
  setPersonalInformation: (personalInformation) =>
    set((state) => ({ ...state, personalInformation })),
}));
