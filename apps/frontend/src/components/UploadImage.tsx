"use client"
import { BACKEND_URL, CLOUDFRONT_URL } from "@/utils";
import axios from "axios";
import { useState } from "react"

export function UploadImage({ onImageAdded, image }: {
    onImageAdded: (image: string) => void;
    image?: string;
}) {
    const [uploading, setUploading] = useState(false);

    async function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        setUploading(true);
        try {
            const file = e.target.files[0];
            const response = await axios.get(`${BACKEND_URL}/v1/user/presignedUrl`, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            const presignedUrl = response.data.preSignedUrl;
            const formData = new FormData();
            formData.set("bucket", response.data.fields["bucket"])
            formData.set("X-Amz-Algorithm", response.data.fields["X-Amz-Algorithm"]);
            formData.set("X-Amz-Credential", response.data.fields["X-Amz-Credential"]);
            formData.set("X-Amz-Algorithm", response.data.fields["X-Amz-Algorithm"]);
            formData.set("X-Amz-Date", response.data.fields["X-Amz-Date"]);
            formData.set("key", response.data.fields["key"]);
            formData.set("Policy", response.data.fields["Policy"]);
            formData.set("X-Amz-Signature", response.data.fields["X-Amz-Signature"]);
            formData.set("X-Amz-Algorithm", response.data.fields["X-Amz-Algorithm"]);
            formData.append("file", file);
            const awsResponse = await axios.post(presignedUrl, formData);
            console.log(awsResponse)
            onImageAdded(`${CLOUDFRONT_URL}/${response.data.fields["key"]}`);
        } catch(e) {
            console.log(e)
        }
        setUploading(false);
    }

    if (image) {
        return (
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <img 
                    className="relative rounded-lg w-full h-48 object-cover shadow-lg" 
                    src={image} 
                    alt="Uploaded image"
                />
            </div>
        );
    }

    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-full h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {uploading ? (
                        <div className="text-sm text-high-contrast">Loading...</div>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-0.5 mb-4">
                                <div className="w-full h-full rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-high-contrast">Upload Image</span>
                            <input 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                type="file" 
                                onChange={onFileSelect}
                                accept="image/*"
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}