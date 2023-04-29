import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { ImagePickerAsset } from "expo-image-picker";

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

type ChildInformation = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  class: string;
};

type FormState = {
  activeStep: number;
  setActiveStep: (activeStep: number) => void;
  personalInformation: PersonalInformation;
  setPersonalInformation: (personalInformation: PersonalInformation) => void;
  loginInformation: LoginInformation;
  setLoginInformation: (loginInformation: LoginInformation) => void;
  childInformation: ChildInformation;
  setChildInformation: (childInformation: ChildInformation) => void;
  proofOfEnrollment: string;
  setProofOfEnrollment: (proofOfEnrollment: string) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
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
  childInformation: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    class: "",
  },
  setChildInformation: (childInformation) =>
    set((state) => ({ ...state, childInformation })),
  token: "",
  setToken: (token) => set((state) => ({ ...state, token })),
  logout: async () => {
    await SecureStore.deleteItemAsync("token");
    set((state) => ({ ...state, token: null }));
  },
  proofOfEnrollment: "",
  setProofOfEnrollment: (proofOfEnrollment) =>
    set((state) => ({ ...state, proofOfEnrollment })),
}));
