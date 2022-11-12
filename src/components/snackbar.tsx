import Snackbar from "@mui/material/Snackbar";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
    open: boolean;
    duration: number;
    onClose: () => void;
}

export default function SnackBar(props: Props) {
    return(
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={props.open}
            autoHideDuration={props.duration}
            onClose={props.onClose}
        >
            <p className="w-full bg-black p-5 drop-shadow-lg z-50 text-base">
                <span className="text-yellow-500"> ⚠️ </span>
                {props.children}
            </p>
        </Snackbar>
    );
}