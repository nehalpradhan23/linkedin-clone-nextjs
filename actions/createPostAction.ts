"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import generateSASToken, { containerName } from "@/lib/generateSASToken";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { BlobServiceClient } from "@azure/storage-blob";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export default async function createPostAction(formData: FormData) {
  // auth().protect()
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  // get form data =======================
  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let image_url: string | undefined = undefined;

  if (!postInput) {
    throw new Error("Post cannot be empty");
  }
  // define user ====================
  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  try {
    if (image.size > 0) {
      // 1. upload image if available -> MS blob storage
      console.log("Uploading image to Azure Blob storage...", image);

      const accountName = process.env.AZURE_STORAGE_NAME;
      const sasToken = await generateSASToken();

      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );

      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      // generate current timestamp
      const timestamp = new Date().getTime();
      const file_name = `${randomUUID()}_${timestamp}.png`;

      const blockBlobClient = containerClient.getBlockBlobClient(file_name); // to push data in container

      const imageBuffer = await image.arrayBuffer();
      const res = await blockBlobClient.uploadData(imageBuffer);
      image_url = res._response.request.url;

      console.log("File uploaded successfully!", image_url);

      // 2.create post in DB with image
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
        imageUrl: image_url,
      };
      await Post.create(body);
    } else {
      // create post in DB without image
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
      };
      await Post.create(body);
    }
  } catch (error: any) {
    throw new Error("Failed to create post", error);
  }

  // revalidate '/'
  revalidatePath("/");
}
