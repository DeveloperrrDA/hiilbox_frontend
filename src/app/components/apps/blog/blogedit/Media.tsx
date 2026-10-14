'use client'
import { Card } from "@/components/ui/card";
import { BlogContext } from '@/app/context/BlogContext';
import { useContext } from "react";
import FileUploadMotion from "@/app/components/animatedComponents/FileUploadMotion";
import CardBox from "@/app/components/shared/CardBox";

const Media = () => {
  const { posts } = useContext(BlogContext);
  const coverImage = posts.length > 0 ? posts[0].coverImg : null;

  return (
    <>
      <CardBox>
        <h5 className="card-title mb-4">Cover Image</h5>
        <FileUploadMotion />
      </CardBox>
    </>
  );
};

export default Media;
