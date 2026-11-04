
import ThemeShell from "@/components/theme/ThemeShell";
import BlogPage from "../frontend-pages/blog/page";

export { metadata } from "../frontend-pages/blog/page";

export default function Blog() {
  return (
    <ThemeShell>
      <BlogPage />
    </ThemeShell>
  );
}
