import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { ImagePickerAsset } from "expo-image-picker";
import { RefObject } from "react";
import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

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

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  class_id: string;
  verified: boolean;
};

enum UserType {
  parent = "parent",
  teacher = "teacher",
  admin = "admin",
}

type loggedInUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  address: string;
  profilePicture: string;
  user_type: UserType;
};

type FormState = {
  activeStep: number;
  children: Student[];
  activeChild: number | null;
  setActiveChild: (activeChild: number | null) => void;
  setChildren: (children: Student[]) => void;
  setActiveStep: (activeStep: number) => void;
  personalInformation: PersonalInformation;
  setPersonalInformation: (personalInformation: PersonalInformation) => void;
  loginInformation: LoginInformation;
  setLoginInformation: (loginInformation: LoginInformation) => void;
  childInformation: ChildInformation;
  setChildInformation: (childInformation: ChildInformation) => void;
  proofOfEnrollment: string;
  setProofOfEnrollment: (proofOfEnrollment: string) => void;
  token: string;
  setToken: (token: string) => void;
  loggedInUser: loggedInUser;
  setLoggedInUser: (loggedInUser: loggedInUser) => void;
  logout: () => void;
  bottomSheetRef: RefObject<BottomSheetModal>;
  setBottomSheetRef: (bottomSheetRef: RefObject<BottomSheetModal>) => void;
};

export const useFormStore = create<FormState>((set) => ({
  activeStep: 0,
  loggedInUser: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phoneNumber: "",
    address: "",
    profilePicture: "",
    user_type: UserType.parent,
  },
  setLoggedInUser: (loggedInUser) =>
    set((state) => ({ ...state, loggedInUser })),
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
    set((state) => ({ ...state, token: "" }));
  },
  proofOfEnrollment: "",
  setProofOfEnrollment: (proofOfEnrollment) =>
    set((state) => ({ ...state, proofOfEnrollment })),
  children: [],
  setChildren: (children) => set((state) => ({ ...state, children })),
  activeChild: null,
  setActiveChild: (activeChild) => set((state) => ({ ...state, activeChild })),
  bottomSheetRef: { current: null },
  setBottomSheetRef: (bottomSheetRef) =>
    set((state) => ({ ...state, bottomSheetRef })),
}));
