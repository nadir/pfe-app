import { create } from "zustand";

type PersonalInformation = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address?: string;
};

type LoginInformation = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type FormState = {
  activeStep: number;
  setActiveStep: (activeStep: number) => void;
  personalInformation: PersonalInformation;
  setPersonalInformation: (personalInformation: PersonalInformation) => void;
  loginInformation: LoginInformation;
  setLoginInformation: (loginInformation: LoginInformation) => void;
};

export const useFormStore = create<FormState>((set) => ({
  activeStep: 0,
  setActiveStep: (activeStep) => set((state) => ({ ...state, activeStep })),
  personalInformation: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
  },
  setPersonalInformation: (personalInformation) =>
    set((state) => ({ ...state, personalInformation })),
  loginInformation: {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  },
  setLoginInformation: (loginInformation) =>
    set((state) => ({ ...state, loginInformation })),
}));
