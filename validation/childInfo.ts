import { parse, isValid } from "date-fns";
import * as yup from "yup";

export const childInfoSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First Name is required")
    // allow spaces and letters only even ones with accents
    .matches(/^[a-zA-Z ]+$/, "First Name is invalid"),
  lastName: yup
    .string()
    .required("Last Name is required")
    .matches(/^[a-zA-Z ]+$/, "Last Name is invalid"),

  // dd/mm/yyyy date of birth
  dateOfBirth: yup
    .string()
    .required("Date of birth is required")
    .test("date-of-birth", "Date of birth is invalid", (value) => {
      const date = parse(value, "dd/MM/yyyy", new Date());
      if (!isValid(date)) return false;
      // check if date is future
      if (date > new Date()) return false;
      // check if date is before 1900
      if (date.getFullYear() < 1900) return false;
      return true;
    }),
  class: yup.number().required("Class is required"),
});

export type ChildInfo = yup.InferType<typeof childInfoSchema>;
