import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/InputBar.module.sass";

export default function InputBar() {
  return (
    <>
      <div className={styles.inputbar}>
        <input placeholder={"example text"} />
      </div>
    </>
  );
}
