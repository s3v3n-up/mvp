//https://medium.com/hackernoon/5-ways-to-animate-a-reactjs-app-in-2019-56eb9af6e3bf

//third-party import
import Image from "next/image";
import Link from "next/link";

//local-import
import styles from "./Results.module.sass";

//using react-animations
import { zoomIn, shake } from "react-animations";
import styled, { keyframes } from "styled-components";

//zoomIn animation styles
const ZoomIn = styled.div`animation: 2s ${keyframes`${zoomIn}`} infinite`;

//shake animation styles
const Shake = styled.div`animation: 2s ${keyframes`${shake}`} infinite`;

/**
 *
 * @description this a component for draw page
 */
export default function Draw() {
    return (
        <>
            <div className={styles.result}>
                <div>
                    <Shake><Image src={"/icons/hand.png"} width={300} height={200} alt={"icon"}></Image></Shake>
                </div>
                <ZoomIn><p>Its a draw</p></ZoomIn>
                <div className={styles.return}>
                    <Link href={"/"}>
                        <a>Home</a>
                    </Link>
                </div>
            </div>
        </>
    );
}