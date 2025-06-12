'use client';

import { pocketbaseClient } from '@/api/pocketbase-client';
import { PublicationsManager } from '@/components/admin/PublicationsManager';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center mt-6">
      <div className="space-y-6 w-[80%]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight ">Publications</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and articles
          </p>
        </div>
        <PublicationsManager />
      </div>
    </div>
  );
}
