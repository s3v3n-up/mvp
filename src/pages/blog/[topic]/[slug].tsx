import { useRouter } from "next/router";

// if we navigate to localhost:3000/blog/123...
export default function BlogPost() {
    const router = useRouter();
    const { topic } = router.query;
    const { slug } = router.query;

    return <p>Post: {topic}:{slug}</p>; // ...you'll see "Post: 123"
}