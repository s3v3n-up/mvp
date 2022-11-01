//https://medium.com/hackernoon/5-ways-to-animate-a-reactjs-app-in-2019-56eb9af6e3bf
//https://www.npmjs.com/package/react-confetti

//third-part import
import Confetti from "react-confetti";
import Image from "next/image";
import Link from "next/link";

//local import
import styles from "./Results.module.sass";

//using react-animation
import { tada,flash } from "react-animations";
import styled, { keyframes } from "styled-components";

//tada animation styles
const Tada = styled.div`animation: 2s ${keyframes`${tada}`} infinite`;

//flash animation styles
const Flash = styled.div`animation: 2s ${keyframes`${flash}`} infinite`;

/**
 *
 * @description this a component for win page
 */
export default function Win() {
    return (
        <>
            <Confetti
                numberOfPieces={40}
                recycle={true}
                className={styles.confetti}
            />
            <div className={styles.result}>
                <div>
                    <Tada><Image src={"/icons/trophy.png"} width={150} height={250} alt={"icon"}></Image> </Tada>
                </div>
                <Flash><p>Winner!!</p></Flash>
                <div className={styles.return}>
                    <Link href={"/"}>
                        <a>Home</a>
                    </Link>
                </div>
            </div>
        </>
    );
}
