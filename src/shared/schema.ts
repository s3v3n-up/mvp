// Third Party import
import { object, string, TypeOf } from "yup";

// Local imports
import { PHONE_REGEX, EMAIL_REGEX } from "@/lib/helpers/validation";

//https://www.youtube.com/watch?v=ZG7sLbI8kL8&t=710s
// Yup validation criteria
export const userSchema = object({
    userName: string().required("Please enter a username").min(8).max(30),
    firstName: string()
        .required("Please enter your firstname")
        .min(2)
        .max(64),
    lastName: string()
        .required("Please enter your lastname")
        .min(2)
        .max(64),
    phoneNumber: string()
        .required("Please enter a phone number")
        .matches(PHONE_REGEX, "invalid input for phone number"),
    image: string().required(),
    email: string()
        .required("Please enter your email")
        .matches(EMAIL_REGEX, "invalid input for email"),
});

export type User = TypeOf<typeof userSchema>;