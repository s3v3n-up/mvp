// Navbar.stories.ts|tsx

import PrimaryButton from "@/components/button/primaryButton";

const config = {
    title: "Primary",
    component: PrimaryButton,
};

export default config;

export const PrimaryButtonStory = () => (
    <PrimaryButton />
);