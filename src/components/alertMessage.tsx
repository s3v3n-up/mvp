/**
 * props type for alert message component
 * @property {string} message - alert message
 * @property {string} type - alert type {"success"| "error" | "loading"}
 */
interface Props {
    message: string;
    type: "success" | "error" | "loading";
}

/**
 * component to display a message base on status
 * pass in message you want to display and one of message type (error | success | loading)
 * @prop {string} message - alert message
 * @prop {string} type - alert type {"success"| "error" | "loading"}
 * @returns {JSX.Element} alert message jsx component
 */
export default function AlertMessage(props: Props) {

    //different alert message styles based on type
    const classes = {
        success: "bg-green-100 border-green-400 text-green-700",
        error: "bg-red-100 border-red-400 text-red-700",
        loading: "bg-blue-100 border-blue-400 text-blue-700",
    };

    return (
        <div className={`w-full rounded-md p-5 ${classes[props.type]}`}>
            <p className="font-bold w-full">{props.message}</p>
        </div>
    );
}