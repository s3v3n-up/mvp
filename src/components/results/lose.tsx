//https://medium.com/hackernoon/5-ways-to-animate-a-reactjs-app-in-2019-56eb9af6e3bf

//third-party import
import Image from "next/image";
import Link from "next/link";

//using react-animations
import { bounce, hinge, headShake } from "react-animations";
import styled, { keyframes } from "styled-components";

//local-import
import styles from "./Results.module.sass";

//bounce animation
const Bounce = styled.div`animation: 2s ${keyframes`${bounce}`} infinite`;

//hinge animation
const Hinge = styled.div`animation: 2s ${keyframes`${hinge}`} infinite`;

//headshake animation
const HeadShake = styled.div`animation: 2s ${keyframes`${headShake}`} infinite`;

/**
 *
 * @description this a component for lose page
 */
export default function Lose() {
    return (
        <>
            <div className={styles.result}>
                <div>
                    <Hinge><Image src={"/icons/skull.png"} width={154} height={188} alt={"icon"}></Image></Hinge>
                </div>
                <Bounce><p>You lose</p></Bounce>
                <HeadShake><h3>Better luck next time!</h3></HeadShake>
                <div className={styles.return}>
                    <Link href={"/"}>
                        <a>Home</a>
                    </Link>
                </div>
            </div>

        </>
    );
}