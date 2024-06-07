"use client";

import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { MessageCircle, Repeat2, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const likeOrUnlikePost = async () => {};
  // =====================================================
  return (
    <div>
      <div className="flex justify-between p-4">
        {/* likes -------------------- */}
        <div className="">
          {likes && likes.length > 0 && (
            <p className="text-xs text-gray-50 cursor-pointer hover:underline">
              {likes.length} likes
            </p>
          )}
        </div>
        {/* comments -------------------------- */}
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
          {/* {user?.id && <CommentForm postId={postId} />}
          <CommentFeed post={post} /> */}
        </div>
      )}
    </div>
  );
}

export default PostOptions;
