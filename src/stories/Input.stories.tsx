// InputBar.stories.ts|tsx

import Input from "@/components/Input";

const config = {
    title: "Input",
    component: Input,
};

export default config;

export const InputBarStory = () => (
    <Input
        placeholder="Search"
        value="value"
        onChange={(e) => console.log(e.target.value)}
        readonly
    />
);