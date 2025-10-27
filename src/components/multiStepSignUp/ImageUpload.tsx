"use client";

import { useState, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  previewUrl: string;
  label: string;
}

export function ImageUpload({
  onUploadComplete,
  previewUrl,
  label,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Generate unique ID for each ImageUpload instance
  const uniqueId = useId();
  const fileInputId = `file-upload-${uniqueId}`;

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=c96a27f51a67e29bd7e8fbbdf52e996b`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    console.log(data.data);

    return data.data.display_url;
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadToImgBB(file);
      onUploadComplete(imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleBrowseClick = () => {
    const fileInput = document.getElementById(fileInputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
        } ${isUploading ? "opacity-50" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          id={fileInputId}
          accept="image/*"
          onChange={handleFileInput}
          disabled={isUploading}
          className="hidden"
        />

        {previewUrl ? (
          <div className="space-y-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="mx-auto h-32 w-32 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleBrowseClick}
              disabled={isUploading}
            >
              Change Image
            </Button>
          </div>
        ) : (
          <div className="cursor-pointer">
            <div className="space-y-2">
              <div className="text-gray-600">
                {isUploading ? "Uploading..." : label}
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={handleBrowseClick}
              >
                {isUploading ? "Uploading..." : "Browse Files"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
