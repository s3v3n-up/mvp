// Button.stories.ts|tsx

import PrimaryButton from "@/components/buttons/primaryButton";

const config = {
    title: "Primary",
    component: PrimaryButton,
};

export default config;

export const PrimaryButtonStory = () => (
    <PrimaryButton
        type="button"
        className="bg-red-300"
        onClick={() => console.log("clicked")}
    />
);