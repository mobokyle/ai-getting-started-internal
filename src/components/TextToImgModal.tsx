import dotenv from "dotenv";

dotenv.config({ path: `.env.local` });

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";

export default function TextToImgModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const [imgSrc, setImgSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMessage] = useState("");

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      // Adjust the request to match the DALL·E API specifications
      const response = await fetch("/api/dalletxt2img", { // Replace with your actual DALL·E API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: e.target.elements.prompt.value, // Make sure to get the value from the input correctly
          n: 1,
          size: "1024x1024",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Assuming the API returns an array of images
        setImgSrc(data.data[0].url); // Adjust according to the actual response structure
        setLoading(false);
      } else {
        throw new Error(data.error || "An error occurred while generating the image.");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0 bg-gray-950 bg-opacity-75" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6 w-full max-w-3xl">
              <form onSubmit={onSubmit} className="space-y-6">
                <input
                  name="prompt"
                  className="w-full flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm focus:outline-none sm:text-sm sm:leading-6"
                  placeholder="Describe the image you want"
                />
                <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Generate
                </button>
              </form>
              {imgSrc && !loading && (
                <Image
                  width={1024}
                  height={1024}
                  src={imgSrc}
                  alt="Generated Image"
                  className="w-full h-full object-contain"
                />
              )}
              {loading && (
                <p className="flex items-center justify-center mt-4">
                  {/* Loading spinner */}
                </p>
              )}
              {errorMsg && (
                <p className="text-sm text-red-500">{errorMsg}</p>
              )}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}