// local import
import styles from "@/styles/MatchEdit.module.sass";
import { AccessTime,AddLocationAlt } from "@mui/icons-material";

/**
 * @description displays Match Edit page
*/
export default function MatchEdit(){
    return(
        <div className={styles.container}>
            <form>
                {/* Header for Sport */}
                <h1>sport</h1>
                <div>
                    {/* Sub Header for Match Type */}
                    <h3>Address</h3>
                    <div className={styles.address}>
                        <AddLocationAlt />
                        <input name="location" placeholder="Address"/>
                    </div>
                </div>
                <div>
                    {/* Sub Header for Date and Time */}
                    <h3>Date and Time</h3>
                    <div className={styles.date}>
                        <AccessTime/>
                        <input name="date" type="datetime-local"/>
                    </div>
                </div>
                <div>
                    {/* Sub Header for Description */}
                    <h3>Description</h3>
                    {/* container for text area */}
                    <div>
                        <textarea
                            className={styles.description}
                            required
                            rows={3}
                            name="description"
                        ></textarea>
                    </div>
                </div>
                <div>
                    {/* button for delete */}
                    <button type="button" className={styles.delete}>Delete</button>
                    {/* button for save */}
                    <button type="submit" className={styles.save} >Save</button>
                </div>
            </form>
        </div>
    );
}
