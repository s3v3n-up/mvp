import { useState } from "react";


const about = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [date, setDate] = useState();

    const handleChange = (event: any) => {
        setDate(event.target.value);

        console.log("value is:", event.target.value);
        console.log("type of value is:", (typeof date));
	  };

    return (
        <div>
            <input
                type="datetime-local"
                id="currentDateTime"
                name="currentDateTime"
                onChange={handleChange}
                value={date}
            />

            <h2>Value: {date}</h2>
            <h2>Type of value: {typeof date}</h2>

        </div>
    );
};



export default about;