//third-party imports
import Image from "next/image";
import React, { useEffect, MouseEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useState, ChangeEvent } from "react";
import { Person, Phone, Badge } from "@mui/icons-material";
import { useRouter } from "next/router";
import axios from "axios";

//local imports
import styles from "@/styles/Register.module.sass";
import Input from "@/components/Input";
import Button from "@/components/buttons/primaryButton";
import ImagePicker from "@/components/imagepicker";
import AlertMessage from "@/components/alertMessage";

/**
 * register data type
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} userName
 * @property {string} phoneNumber
 * @property {File | null} image
 */
interface RegisterData {
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

    //guard page against logged and unauthenticated in users
    const { data: session } = useSession();
    const router = useRouter();
    useEffect(()=> {
        if(session && session.user.isFinishedSignup) {
            router.push("/");
        }

        if (!session) {
            router.push("/login");
        }
    }, [session, router]);

    //register form data state
    const [formData, setFormData] = useState<RegisterData>({
        firstName: "",
        lastName: "",
        userName: "",
        phoneNumber: "",
        image: null
    });

    //form submission state
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
     * handle image submit
     */
    async function handleImageSubmit() {
        const data = new FormData();
        data.append("files", formData.image!);
        try {
            const res = await axios.post("/api/file", data);
            const { data: { data: { url: imageUrl } } } = res;

            return imageUrl;
        } catch(error) {
            throw new Error("error uploading image");
        }
    }

    /**
     * handle form submission
     */
    async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        try {
            setLoading(true);
            const imageUrl = await handleImageSubmit();
            console.log(formData);
            const res = await axios.post("/api/user/create", {
                ...formData,
                email: session!.user.email,
                image: imageUrl,
                matches: []
            });
            const { ok, error } = res.data;
            if (!ok) {
                throw error;
            } else {
                router.push("/");
            }
        } catch(err: any) {
            if (err!.response) {
                setError(err.response.data.message);
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
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
                <div className={styles.input}>
                    <form className={styles.info} onSubmit={handleFormSubmit}>
                        <ImagePicker
                            onChange={handleImageChange}
                            onRemove={handleRemoveSelectedImage}
                            image={formData.image}
                        />
                        { error && <AlertMessage message={error} type="error"/> }
                        { loading && <AlertMessage message="Loading..." type="loading"/> }
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
                    </form>
                </div>
            </div>
        </div>
    );
}