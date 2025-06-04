'use client';

import { PostsRecordExtended } from '@/api/extended_types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { pb } from '@/lib/pb';
import { formatDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import {
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { PublicationDialog } from './PublicationDialog';

export function PublicationsManager() {
  const [selectedPublications, setSelectedPublications] = useState<string[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPublication, setEditingPublication] =
    useState<PostsRecordExtended | null>(null);
  const [deletingPublication, setDeletingPublication] =
    useState<PostsRecordExtended | null>(null);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['publications'],
    queryFn: async () => {
      const posts = await pb
        .collection('posts')
        .getFullList<PostsRecordExtended>({ expand: 'author' });

      if (posts.length === 0) return [];

      const postIds = posts.map(p => p.id);

      const filterString = postIds.map(id => `post="${id}"`).join(' || ');

      const allComments = await pb.collection('comments').getFullList({
        filter: filterString,
        fields: 'post'
      });

      const commentCounts = allComments.reduce(
        (acc, comment) => {
          if (comment.post) {
            acc[comment.post] = (acc[comment.post] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>
      );

      return posts.map(post => ({
        ...post,
        commentsCount: commentCounts[post.id] || 0
      }));
    }
  });

  const filteredPublications = data?.filter(publication => {
    const matchesSearch =
      publication.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      publication.author?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || publication.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' || publication.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPublications(filteredPublications?.map(p => p.id) ?? []);
    } else {
      setSelectedPublications([]);
    }
  };

  const handleSelectPublication = (publicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedPublications([...selectedPublications, publicationId]);
    } else {
      setSelectedPublications(
        selectedPublications.filter(id => id !== publicationId)
      );
    }
  };

  const handleCreatePublication = (data: any) => {
    const newPublication: PostsRecordExtended = {
      id: Date.now().toString(),
      title: data.title,
      excerpt: data.excerpt,
      author: data.author,
      status: data.status,
      category: data.category,
      created: data.publishedAt || new Date().toISOString().split('T')[0]
    };
  };

  const handleEditPublication = (data: any) => {};

  const handleDeletePublication = () => {
    if (!deletingPublication) return;

    pb.collection('posts').delete(deletingPublication.id);
    setDeletingPublication(null);
  };

  const handleBulkDelete = async () => {
    if (!selectedPublications.length) return;

    try {
      await Promise.all(
        selectedPublications.map(postId =>
          pb.collection('posts').delete(postId)
        )
      );
      refetch();
    } catch (error) {
      console.error('Error deleting posts:', error);
    }
  };

  const handleBulkStatusChange = async (
    status: 'draft' | 'published' | 'archived'
  ) => {
    if (!selectedPublications.length) return;

    try {
      await Promise.all(
        selectedPublications.map(postId =>
          pb.collection('posts').update(postId, { status })
        )
      );
      refetch();
    } catch (error) {
      console.error('Error updating post statuses:', error);
    }
  };

  const getStatusBadge = (status: PostsRecordExtended['status']) => {
    const variants = {
      draft: 'secondary',
      published: 'default',
      archived: 'outline'
    } as const;

    const colors = {
      draft: 'text-yellow-700 bg-yellow-50 border-yellow-200',
      published: 'text-green-700 bg-green-50 border-green-200',
      archived: 'text-gray-700 bg-gray-50 border-gray-200'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const categories = Array.from(new Set(data?.map(p => p.category)));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!data || data.length === 0) return <div>No data available</div>;
  return (
    <div className="space-y-6">
      {/*Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search publications..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category || ''}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Publication
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPublications.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">
            {selectedPublications.length} publication
            {selectedPublications.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange('published')}
            >
              Publish
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange('draft')}
            >
              Draft
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange('archived')}
            >
              Archive
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Publications Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedPublications.length ===
                      filteredPublications?.length &&
                    filteredPublications.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPublications?.map(publication => (
              <TableRow key={publication.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPublications.includes(publication.id)}
                    onCheckedChange={checked =>
                      handleSelectPublication(
                        publication.id,
                        checked as boolean
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{publication.title}</div>
                    <div className="max-w-[300px] truncate line-clamp-1 break-words text-sm text-muted-foreground">
                      {publication.excerpt}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{publication.expand?.author?.username}</TableCell>
                <TableCell>{getStatusBadge(publication.status)}</TableCell>
                <TableCell>
                  <Badge variant="outline">{publication.category}</Badge>
                </TableCell>
                <TableCell>{formatDate(publication.created || '')}</TableCell>
                <TableCell>{publication.commentsCount}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          window.open(`/blog/${publication.id}`, '_blank')
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setEditingPublication(publication)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeletingPublication(publication)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredPublications?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No publications found</div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      <PublicationDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreatePublication}
        title="Create Publication"
      />

      <PublicationDialog
        open={!!editingPublication}
        onOpenChange={open => !open && setEditingPublication(null)}
        onSubmit={handleEditPublication}
        title="Edit Publication"
        defaultValues={editingPublication || undefined}
      />

      <DeleteConfirmDialog
        open={!!deletingPublication}
        onOpenChange={open => !open && setDeletingPublication(null)}
        onConfirm={handleDeletePublication}
        title="Delete Publication"
        description={`Are you sure you want to delete "${deletingPublication?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
