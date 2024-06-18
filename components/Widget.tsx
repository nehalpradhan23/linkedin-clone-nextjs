import { ExternalLink, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function Widget() {
  return (
    <div className="ml-6 bg-white px-2 rounded-md py-4">
      <div className="flex justify-center py-4">
        <div className="rounded-full h-24 w-24 relative overflow-hidden">
          <Image
            src="/myImage.JPG"
            alt="my image"
            height={200}
            width={200}
            className="h-full object-cover"
          />
        </div>
      </div>
      {/* links ===========================*/}
      <div className="space-y-2 flex flex-col items-center justify-center">
        <div className="flex items-center gap-1 justify-center">
          <Link
            className="underline text-blue-600 hover:text-gray-600"
            href={"https://nehal-pradhan-portfolio.vercel.app/"}
            target="_blank"
          >
            My Portfolio
          </Link>
          <ExternalLink className="h-4" />
        </div>
        <div className="flex gap-2">
          <span>Github:</span>
          <Link
            className="underline text-blue-600 hover:text-gray-600"
            href={"https://github.com/nehalpradhan23"}
            target="_blank"
          >
            nehalpradhan23
          </Link>
        </div>
        <div className="flex gap-2">
          <span>Linkedin:</span>
          <Link
            className="underline text-blue-600 hover:text-gray-600"
            href={"https://www.linkedin.com/in/nehalpradhan22/"}
            target="_blank"
          >
            nehal pradhan
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Widget;
