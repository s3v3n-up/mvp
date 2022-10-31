//third-party imports
import Image from "next/image";
import React, { useEffect, MouseEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useState, ChangeEvent } from "react";
import { Person, Phone, Badge } from "@mui/icons-material";
import { useRouter } from "next/router";

//local imports
import styles from "@/styles/Register.module.sass";
import Input from "@/components/Input";
import Button from "@/components/buttons/primaryButton";
import ImagePicker from "@/components/imagepicker";

/**
 * register data type
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} userName
 * @property {string} phoneNumber
 * @property {File | null} image
 */
interface FormData {
    firstName: string;
    lastName: string;
    userName: string;
    phoneNumber: string;
    image: File | null;
}

/**
 * *
 * @description this page lets user register an account
 *
 */
export default function Register() {

    //guard page against logged in users
    const { data: session } = useSession();
    const router = useRouter();
    useEffect(()=> {
        if(session && session.user.isFinishedSignup) {
            router.push("/");
        }
    }, [session, router]);

    //register form data state
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        userName: "",
        phoneNumber: "",
        image: null
    });

    /**
     * handle form input change
     */
    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    /**
     * handle image change
     */
    function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            image: e.target.files![0],
        });
    }

    /**
     * handle remove image
     */
    function handleRemoveSelectedImage(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        setFormData({
            ...formData,
            image: null
        });
    }

    /**
     * handle form submission
     */
    function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(formData);
    }

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <div className={styles.about}>
                    <h2>Are YOU the MVP?</h2>
                    <p>
                       Create your matches <br/>
                       Schedule your face-off<br/>
                       Put your skills to the test.
                    </p>
                    <h2>Can you be #1?</h2>
                </div>
            </div>
            <div className="flex flex-col items-center flex-auto">
                <div className={styles.imgwrapper}>
                    <Image src={"/img/logo.png"} alt={"logo"} width={263} height={184} />
                </div>
                <ImagePicker
                    onChange={handleImageChange}
                    onRemove={handleRemoveSelectedImage}
                    image={formData.image}
                />
                <div className={styles.input}>
                    <div className={styles.info}>
                        <Input
                            type="text"
                            placeholder="Enter your first name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        >
                            <Person fontSize="medium"/>
                        </Input>
                        <Input
                            type="text"
                            placeholder="Enter your last name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        >
                            <Person fontSize="medium"/>
                        </Input>
                        <Input
                            type="text"
                            placeholder="Enter your username"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                        >
                            <Badge fontSize="medium"/>
                        </Input>
                        <Input
                            type="tel"
                            placeholder="Enter your phone number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                        >
                            <Phone fontSize="medium"/>
                        </Input>
                        <Button type="submit" className={styles.signup}>
                            Sign up
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
