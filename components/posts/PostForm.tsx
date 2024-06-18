"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import createPostAction from "@/actions/createPostAction";
import { toast } from "sonner";
import Image from "next/image";

function PostForm() {
  const ref = useRef<HTMLFormElement>(null); // form ref
  const fileInputRef = useRef<HTMLInputElement>(null); // image ref
  const { user } = useUser();
  const [preview, setPreview] = useState<string | null>(null);

  // ================================================
  const handlePostAction = async (formData: FormData) => {
    const formDataCopy = formData;
    ref.current?.reset();
    // check for empty ===============
    const text = formDataCopy.get("postInput") as string;
    if (!text.trim()) {
      throw new Error("Post can't be empty");
    }
    setPreview(null);
    try {
      // create post =============
      await createPostAction(formDataCopy);
    } catch (error) {
      console.log("Error creating post");
    }
  };

  // ================================================
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  // ===================================================
  return (
    <div className="mb-2">
      <form
        ref={ref}
        action={(formData) => {
          // handle form submission with server action
          const promise = handlePostAction(formData);
          // toast notification
          toast.promise(promise, {
            loading: "Creating post...",
            success: "Post created successfully",
            error: "Failed to create post",
          });
        }}
        className="p-3 bg-white rounded-lg"
      >
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {/* text input ======================= */}
          <input
            type="text"
            name="postInput"
            placeholder="Write your post here"
            className="flex-1 outline-none rounded-md py-3 px-4 border"
          />

          {/* add image ======================*/}
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
          <button type="submit" hidden>
            Post
          </button>
        </div>
        {/* preview image conditional check */}
        {preview && (
          <div className="mt-3 h-[300px] object-contain overflow-hidden border">
            <Image
              width={500}
              height={500}
              src={preview}
              alt="Preview"
              className="w-full object-contain h-full"
            />
          </div>
        )}
        {/* add image button */}
        <div className="flex justify-end mt-2 space-x-2">
          <Button
            type="button"
            variant={preview ? "secondary" : "outline"}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="mr-2" size={16} color="currentColor" />
            {preview ? "Change Image" : "Add Image"}
          </Button>
          {/* add a remove preview button */}
          {preview && (
            <Button
              variant="outline"
              type="button"
              onClick={() => setPreview(null)}
            >
              <XIcon className="mr-2" size={16} color="currentColor" />
              Remove image
            </Button>
          )}
        </div>
      </form>
      <hr className="mt-2 border-gray-300" />
    </div>
  );
}

export default PostForm;
