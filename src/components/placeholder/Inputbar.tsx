//local import
import styles from "@/styles/Components.module.sass";

/**
 * components for input bar
 */

export default function InputBar() {
    return (
        <>
            <div className={styles.inputbar}>
                <input placeholder={"example text"} />
            </div>
        </>
    );
}
