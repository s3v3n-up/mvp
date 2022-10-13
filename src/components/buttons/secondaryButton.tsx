import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Buttons.module.sass"

export default function SecondaryButton() {
  return (
    <>
      <div className={styles.secondarybutton}>
        <button type="button" placeholder="button">
            secondary button
        </button>
      </div>
    </>
  );
}
