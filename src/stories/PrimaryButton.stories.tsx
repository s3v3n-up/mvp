// Button.stories.ts|tsx

import PrimaryButton from "@/components/buttons/primaryButton";

const config = {
    title: "Primary",
    component: PrimaryButton,
};

export default config;

export const PrimaryButtonStory = () => (
    <PrimaryButton/>
);