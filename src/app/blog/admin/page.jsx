import { redirect } from 'next/navigation';

/** The blog is managed from the admin panel now. */
export default function BlogAdminPage() {
  redirect('https://admin.islahbd.com/blog');
}
