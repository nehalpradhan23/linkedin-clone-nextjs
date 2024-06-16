"use client";

import { IPostDocument } from "@/mongodb/models/post";
import { SignedIn, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { MessageCircle, Repeat2, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LikePostRequestBody } from "@/app/api/posts/[post_id]/like/route";
import { UnlikePostRequestBody } from "@/app/api/posts/[post_id]/unlike/route";
import CommentForm from "./CommentForm";
import { CommentFeed } from "./CommentFeed";

function PostOptions({ post }: { post: IPostDocument }) {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  useEffect(() => {
    // check if post is already liked ====================
    if (user?.id && post.likes?.includes(user.id)) {
      setLiked(true);
    }
  }, [post, user]);

  // =====================================================
  const likeOrUnlikePost = async () => {
    if (!user?.id) {
      throw new Error("User not Authenticated");
    }
    const originalLiked = liked;
    const originalLikes = likes;

    const newLikes = liked
      ? likes?.filter((like) => like !== user.id)
      : [...(likes ?? []), user.id];

    const body: LikePostRequestBody | UnlikePostRequestBody = {
      userId: user.id,
    };

    setLiked(!liked);
    setLikes(newLikes);

    const response = await fetch(
      `/api/posts/${post._id}/${liked ? "unlike" : "like"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) {
      setLiked(originalLiked);
      setLikes(originalLikes);
      throw new Error("Failed to like or unlike post");
    }

    const fetchLikesResponse = await fetch(`/api/posts/${post._id}/like`);
    if (!fetchLikesResponse.ok) {
      setLiked(originalLiked);
      setLikes(originalLikes);
      throw new Error("Failed to fetch likes");
    }

    // get  new likes ========
    const newLikesData = await fetchLikesResponse.json();
    setLikes(newLikesData);
  };
  // =====================================================
  return (
    <div>
      <div className="flex justify-between p-4">
        {/* likes count -------------------- */}
        <div className="">
          {likes && likes.length > 0 && (
            <p className="text-xs text-gray-500 cursor-pointer hover:underline">
              {likes.length} likes
            </p>
          )}
        </div>
        {/* comments count -------------------------- */}
        <div className="">
          {post?.comments && post.comments.length > 0 && (
            <p
              onClick={() => setIsCommentOpen(!isCommentOpen)}
              className="text-xs text-gray-500 cursor-pointer hover:underline"
            >
              {post.comments.length} comments
            </p>
          )}
        </div>
      </div>
      {/* buttons =================== */}
      <div className="flex p-2 justify-between px-2 border-t">
        <Button
          variant="ghost"
          className="postButton"
          onClick={likeOrUnlikePost}
        >
          <ThumbsUpIcon
            className={cn("mr-1", liked && "text-blue-500 fill-blue-500")}
          />
          Like
        </Button>
        <Button
          variant="ghost"
          className="postButton"
          onClick={() => setIsCommentOpen(!isCommentOpen)}
        >
          <MessageCircle
            className={cn(
              "mr-1",
              isCommentOpen && "text-gray-500 fill-gray-500"
            )}
          />
          Comment
        </Button>
        {/* <Button variant='ghost' className="postButton">
          <Repeat2 className="mr-1"/>
          Repost
        </Button>
        <Button variant='ghost' className="postButton">
          <Repeat2 className="mr-1"/>
          Send
        </Button> */}
      </div>
      {/* comment input =============================== */}
      {isCommentOpen && (
        <div className="p-4">
          <SignedIn>{/* <CommentForm post={post} /> */}</SignedIn>
          <CommentFeed post={post} />
        </div>
      )}
    </div>
  );
}

export default PostOptions;
