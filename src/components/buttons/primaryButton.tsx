//local import
import styles from "@/styles/Buttons.module.sass";

/**
 * *
 * @description this  a button component
 */

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
