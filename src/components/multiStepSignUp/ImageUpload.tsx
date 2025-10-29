"use client";

import { useState, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  previewUrl: string;
  label: string;
  compact?: boolean;
}

export function ImageUpload({
  onUploadComplete,
  previewUrl,
  label,
  compact = false,
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

  const clearImage = () => {
    onUploadComplete("");
  };

  // Compact version for Step2Form
  if (compact) {
    return (
      <div className="space-y-2">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-16 h-16 rounded-lg object-cover border-2 border-primary/20"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg hover:bg-destructive/90 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
              dragOver
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25 hover:border-primary/50"
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

            <div
              className="flex items-center justify-center p-3"
              onClick={handleBrowseClick}
            >
              <div className="text-center">
                <Upload className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            </div>
          </motion.div>
        )}
        {isUploading && (
          <div className="text-xs text-muted-foreground text-center">
            Uploading...
          </div>
        )}
      </div>
    );
  }

  // Original version (for reference or other uses)
  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25"
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
            <div className="flex gap-2 justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleBrowseClick}
                disabled={isUploading}
              >
                Change Image
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={clearImage}
                disabled={isUploading}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="cursor-pointer" onClick={handleBrowseClick}>
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
              <div className="text-muted-foreground">
                {isUploading ? "Uploading..." : label}
              </div>
              <Button type="button" variant="outline" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Browse Files"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
