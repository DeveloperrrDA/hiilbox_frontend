
import { NextResponse } from "next/server";

const BLOG_API =
  "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1/blogs";

export async function GET() {
  try {
    const response = await fetch(
      `${BLOG_API}?page=1&per_page=100`,
      { next: { revalidate: 60 } }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        { success: false, data: [], message: "Failed to load blogs" },
        { status: response.ok ? 502 : response.status }
      );
    }

    const posts = result.data.map((blog: any) => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      coverImg: blog.featured_image || "/images/blog/blog-img1.jpg",
      createdAt: blog.create_date,
      category: blog.category?.join(", ") || "Blog",
      author: {
        id: blog.id,
        name: blog.author || "Hiilbox",
        avatar: "",
      },
      featured: false,
      published: true,
      comments: [],
      view: 0,
      share: 0,
    }));

    return NextResponse.json({
      success: true,
      data: posts,
      total: result.total,
    });
  } catch (error) {
    console.error("Public blogs API error:", error);

    return NextResponse.json(
      { success: false, data: [], message: "Unable to load blogs" },
      { status: 500 }
    );
  }
}
