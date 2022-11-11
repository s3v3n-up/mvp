import { useState } from "react";

/**
 * useLocalStorage hook to store values in local storage
 * @param key local storage key
 * @param initialValue initial value of the state
 * @returns [state, setState]
 * ref: https://usehooks.com/useLocalStorage/
 */
export default function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            if (typeof window === "undefined") {
                return initialValue;
            }
            const item = window.localStorage.getItem(key);

            return item ? JSON.parse(item) : initialValue;
        } catch (error) {

            return initialValue;
        }
    });

    // function to update the state and local storage value
    const setValue = (value: T | ((val: T) => T)) => {
        try {

            //if new value has type function run the function inside setState, else setState to new value
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            if (valueToStore === null) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
            setStoredValue(valueToStore);
        } catch (error) {
            throw new Error()
        }
    };

    return [storedValue, setValue];
}