import UserInformation from "@/components/UserInformation";
import PostForm from "@/components/posts/PostForm";
import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";

export const revalidate = 0;

export default async function Home() {
  await connectDB();
  const posts = await Post.getAllPosts();
  console.log(posts);

  return (
    <div className="grid grid-cols-8 mt-5 sm:px-5">
      <section className="hidden md:inline md:col-span-2">
        {/* user info */}
        <UserInformation />
      </section>
      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full">
        {/* post form */}
        <PostForm />
        {/* post feed */}
      </section>
      <section className="hidden xl:inline justify-center col-span-2">
        <div className="bg-red-300">hello</div>
        {/* widget */}
      </section>
    </div>
  );
}
