import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Buttons.module.sass";

export default function PrimaryButton() {
    return (
        <>
            <div className={styles.primarybutton}>
                <button type="button" placeholder="button">
          primary button
                </button>
            </div>
        </>
    );
}
