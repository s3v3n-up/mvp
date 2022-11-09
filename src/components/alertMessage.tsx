/**
 * props type for alert message component
 * @property {string} message - alert message
 * @property {string} type - alert type {"success"| "error" | "loading"}
 */
interface Props {
    message: string;
    type: "success" | "error" | "loading" | "default";
}

/**
 * component to display a message base on status
 * pass in message you want to display and one of message type (error | success | loading)
 * @param {Props} props alert message
 * @returns {JSX.Element} alert message jsx component
 */
export default function AlertMessage(props: Props) {
    const classes = {
        success: "bg-green-100 border-green-400 text-green-700",
        error: "bg-red-100 border-red-400 text-red-700",
        loading: "bg-blue-100 border-blue-400 text-blue-700",
        default: "bg-black text-white bg-opacity-100",
    };

    return (
        <div className={`w-full rounded-md p-5 ${classes[props.type]}`}>
            <p className="font-bold w-full">{props.message}</p>
        </div>
    );
}