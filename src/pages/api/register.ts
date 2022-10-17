import { NextApiRequest, NextApiResponse } from 'next'
import { UserProfile } from '@/lib/types/User'
import { createUser, getUsers } from '@/lib/actions/user';
import { PHONE_REGEX, EMAIL_REGEX } from '@/lib/resources/constants';
import { object, string } from 'yup'


/**
 * @description = a function that handles api request for registering user
 */
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') {
        try {

            let {userName, firstName, lastName, phonenumber, email, matches} = req.body as UserProfile


            const schema = object(
                {
                    userName: string().required().min(8).max(30),
                    firstName: string().required().min(2).max(64),
                    lastName: string().required().min(2).max(64),
                    phonenumber: string().required().matches(PHONE_REGEX, "invalid input for phone number"),
                    email: string().required().matches(EMAIL_REGEX, "invalid input for email"),
                }
            )
            
            const validatedUser = await schema.validate(req.body);
            
            userName =  userName.toLowerCase();
            email = email.toLowerCase();
            firstName = firstName.charAt(0) + firstName.substring(1).toLowerCase();
            lastName = lastName.charAt(0) + lastName.substring(1).toLowerCase();
            //phonenumber = phonenumber.substring(0,3) + "-" + phonenumber.substring(3,6) + "-" + phonenumber.substring(6);

                
            // if(email === "" || !EMAIL_REGEX.test(email) || email.trim() === "") {
            //     throw {
            //         code: 400,
            //         message: "invalid input for email"
            //     }
            // }
            // if(phonenumber === "" || !PHONE_REGEX.test(phonenumber)) {
            //     throw {
            //         code: 400,
            //         message: "invalid input for phone number"
            //     }
            // }

            // if(userName === "" || userName.trim() === "" || userName.trim().length < 8 || userName.trim().length > 30){
            //     throw {
            //         code: 400,
            //         message: "invalid input for username"
            //     }
            // }
            // if(firstName === "" || firstName.trim() === "" || firstName.trim().length < 2 || firstName.trim().length > 64){
            //     throw {
            //         code: 400,
            //         message: "invalid input for first name",
            //     }
            // }
            // if(lastName === "" || lastName.trim() === "" || lastName.trim().length < 2 || lastName.trim().length > 64){
            //     throw {
            //         code: 400,
            //         message: "invalid input for first name",
            //     }
            // }

            
            const user = {
                userName,
                email,
                firstName,
                lastName,
                phonenumber,
                matches
            }
            
            const response = await createUser(user);

            res.status(response.code).json(
                {
                    response
                }
            );
             
        } catch(error : any) {
            const { code = 500, message} = error;
            res.status(code).json({
                message
                }
            );
            return;
        }
    } 
}