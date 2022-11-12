// Third Party import
import { object, string } from "yup";

// Local imports
import { PHONE_REGEX, EMAIL_REGEX, NAME_REGEX } from "@/lib/helpers/constants";

//https://www.youtube.com/watch?v=ZG7sLbI8kL8&t=710s
// Yup validation criteria for user
export const userSchema = object({
    userName: string().required("Please enter a username")
        .min(8, "username should be at least 8 characters")
        .max(30, "username should be at max 30 characters"),
    firstName: string()
        .required("Please enter your firstname")
        .min(2, "firstname should be at least 2 characters")
        .max(64, "firstname should be at max 64 characters")
        .matches(NAME_REGEX, "Invalid input for firstname"),
    lastName: string()
        .required("Please enter your lastname")
        .min(2, "lastname should be at least 2 characters")
        .max(64, "lastname should be at max 64 characters")
        .matches(NAME_REGEX, "Invalid input for lastname"),
    phoneNumber: string()
        .required("Please enter a phone number")
        .matches(PHONE_REGEX, "invalid input for phone number"),
    image: string().required(),
    email: string()
        .required("Please enter your email")
        .matches(EMAIL_REGEX, "invalid input for email"),
});

// Yup validation criteria for firstname
export const firstNameSchema = object({
    firstName: string()
        .required("Please enter your firstname")
        .min(2, "firstname should be at least 2 characters")
        .max(64, "firstname should be at max 64 characters")
        .matches(NAME_REGEX, "Invalid input for firstname")
});

// Yup validation criteria for lastname
export const lastNameSchema = object({
    lastName: string()
        .required("Please enter your lastname")
        .min(2, "lastname should be at least 2 characters")
        .max(64, "lastname should be at max 64 characters")
        .matches(NAME_REGEX, "Invalid input for lastname")
});

// Yup validation criteria for phonenumber
export const phoneNumberSchema = object({
    phoneNumber: string()
        .required("Please enter a phone number")
        .matches(PHONE_REGEX, "invalid input for phone number"),
});