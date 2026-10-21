
import React from "react";
import type { Metadata } from "next";
import ThemeShell from "@/components/theme/ThemeShell";
import FrontEndBreadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/FrontBreadcrumb";
import PurchaseTemp from "@/app/components/front-pages/homepage/PurchaseTemp";
import BlogPost from "@/app/components/front-pages/blog/BlogPost";

export const metadata: Metadata = {
  title: "Blog | HiilBox",
};

const BlogPage = () => {
  return (
    <ThemeShell>
      <main className="min-h-screen bg-white dark:bg-dark">
        <FrontEndBreadcrumb
          title="Latest blog & news"
          link="Blog Page"
        />

        <div className="bg-lightgray dark:bg-darkgray">
          <BlogPost />
        </div>

        <PurchaseTemp />
      </main>
    </ThemeShell>
  );
};

export default BlogPage;
