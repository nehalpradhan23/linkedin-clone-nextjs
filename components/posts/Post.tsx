"use client";
import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import ReactTimeago from "react-timeago";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import deletePostAction from "@/actions/deletePostAction";

function Post({ post }: { post: IPostDocument }) {
  const { user } = useUser();
  const isAuthor = user?.id === post.user.userId;
  // ===============================================
  return (
    <div className="bg-white rounded-md border">
      <div className="p-4 flex space-x-2">
        {/* user image */}
        <div className="">
          <Avatar>
            <AvatarImage src={post.user.userImage} />
            <AvatarFallback>
              {post.user.firstName?.charAt(0)}
              {post.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        {/* name, username and time ======== */}
        <div className="flex justify-between flex-1">
          <div className="">
            <p className="font-semibold">
              {post.user.firstName} {post.user.lastName}{" "}
              {isAuthor && (
                <Badge variant={"secondary"} className="ml-2">
                  Author
                </Badge>
              )}
            </p>
            <p className="text-xs text-gray-400">
              @{post.user.firstName}
              {post.user.firstName}-{post.user.userId.toString().slice(-4)}
            </p>
            <p className="text-xs text-gray-400">
              <ReactTimeago date={new Date(post.createdAt)} />
            </p>
          </div>
          {/* delete post if author button ==================== */}
          {isAuthor && (
            <Button
              variant={"outline"}
              className="hover:bg-red-400"
              onClick={() => {
                const promise = deletePostAction(post._id);
                // toast
              }}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
