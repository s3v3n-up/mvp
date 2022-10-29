//local import
import styles from "@/styles/Components.module.sass";

/**
 * components for buttons
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
