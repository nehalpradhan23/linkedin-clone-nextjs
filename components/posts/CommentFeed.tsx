"use client";
import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import TimeAgo from "react-timeago";

export const CommentFeed = ({ post }: { post: IPostDocument }) => {
  const { user } = useUser();
  const isAuthor = user?.id === post.user.userId;
  return (
    <div className="space-y-2 mt-3">
      {post.comments?.length ? (
        post.comments?.map((comment) => (
          <div className="flex space-x-1" key={comment._id}>
            <Avatar>
              <AvatarImage src={comment.user.userImage} />
              <AvatarFallback>
                {comment.user.firstName?.charAt(0)}
                {comment.user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="bg-gray-100 px-4 py-2 rounded-md w-full md:min-w-[400px]">
              <div className="flex justify-between">
                <div className="">
                  <p className="font-semibold">
                    {comment.user.firstName} {comment.user.lastName}{" "}
                    <Badge className="text-xs">{isAuthor && "Author"}</Badge>
                  </p>
                  <p className="text-xs text-gray-400">
                    @{comment.user.firstName}
                    {comment.user.firstName}-
                    {comment.user.userId.toString().slice(-4)}
                  </p>
                </div>
                <p className="text-xs text-gray-400 flex mt-1">
                  <TimeAgo date={new Date(comment.createdAt)} />
                </p>
              </div>
              <p className="mt-3 text-sm">{comment.text}</p>
            </div>
          </div>
        ))
      ) : (
        <span className="flex items-center justify-center">No comments</span>
      )}
    </div>
  );
};
