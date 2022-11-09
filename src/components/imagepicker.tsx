import { ChangeEvent, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

//dynamic imports
const CameraAlt = dynamic(() => import("@mui/icons-material/CameraAlt"));
const Close = dynamic(() => import("@mui/icons-material/Close"));

/**
 * image picker component props type
 * @property {File | null} image - picker current value
 * @property {string} imageURL - image url to display if image is not selected, used for edit page
 * @property {ChangeEvent<HTMLInputElement>} onChange - function to be executed on value change
 */
interface Props {
  image: File | null;
  imageUrl?: string;
  onRemove?: (e?: any) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * image picker component for selecting image from local device
 * @param {Props} props - image picker component props
 * @return {JSX.Element} image picker jsx component
 */
export default function ImagePicker(props: Props) {

    // ref for passing click to input file picker
    const inputRef = useRef<HTMLInputElement>(null);

    /**
   * handle image picker click
   */
    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div
            className="w-40 h-40 m-auto relative cursor-pointer p-1 bg-gradient rounded-full"
            onClick={handleClick}
        >
            <button type="button" onClick={props.onRemove} className="text-white rounded-full p-1 bg-orange-500 w-fit absolute z-10 left-3/4">
                <Close fontSize="medium"/>
            </button>
            <div className="relative w-full h-full flex items-center bg-gray-300 rounded-full"> {

                // checking if image have been selected then display preview of image
                props.image ? (
                    <Image
                        src={URL.createObjectURL(props.image)}
                        alt="selected image"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center center"
                        className="rounded-full"
                    />

                //if not checking if image url is provided then display preview of image from url
                ) : props.imageUrl ? (
                    <Image
                        src={props.imageUrl}
                        alt="selected image"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center center"
                        className="rounded-full"
                    />

                // if not then display default input image
                ) : (
                    <div className="flex items-center justify-center w-full rounded-full p-3">
                        <CameraAlt fontSize="large" />
                    </div>
                )}
            </div>
            <div className="invisible">
                <input
                    type="file"
                    onChange={props.onChange}
                    accept="image/png, image/jpeg"
                    ref={inputRef}
                />
            </div>
        </div>
    );
}