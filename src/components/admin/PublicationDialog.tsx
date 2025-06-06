'use client';

import type React from 'react';

import { UsersRecord } from '@/api/api_types';
import { PostsRecordExtended, UserSocials } from '@/api/extended_types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { pb } from '@/lib/pb';
import { useQuery } from '@tanstack/react-query';
import { ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const categories = [
  'Technology',
  'React',
  'Next.js',
  'CSS',
  'Accessibility',
  'Security',
  'Performance'
];

interface PublicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PublicationFormData) => void;
  title: string;
  defaultValues?: PostsRecordExtended;
}

interface PublicationFormData {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  tags: string;
  image: File | null;
  imagePreview: string;
}

export function PublicationDialog({
  open,
  onOpenChange,
  onSubmit,
  title,
  defaultValues
}: PublicationDialogProps) {
  const getInitialFormData = (): PublicationFormData => ({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    status: 'draft',
    category: '',
    tags: '',
    image: null,
    imagePreview: ''
  });

  const [formData, setFormData] =
    useState<PublicationFormData>(getInitialFormData());
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      const mapRecordToFormData = (
        record: PostsRecordExtended | undefined
      ): PublicationFormData => {
        if (!record) {
          return getInitialFormData();
        }

        const parseTags = (tagsField: string | undefined): string[] => {
          if (!tagsField) return [];
          if (typeof tagsField === 'string') {
            try {
              const parsed = JSON.parse(tagsField);
              if (Array.isArray(parsed)) {
                return parsed
                  .filter(tag => typeof tag === 'string' && tag.trim())
                  .map(tag => tag.trim());
              }
            } catch {
              return tagsField
                .split(',')
                .map(tag => tag.trim())
                .filter(Boolean);
            }
          }
          return [];
        };

        const getImagePreviewUrl = (
          currentRecord: PostsRecordExtended
        ): string => {
          if (
            !currentRecord.image ||
            !currentRecord.id ||
            typeof pb === 'undefined'
          )
            return '';
          return `${pb.baseUrl}/api/files/posts/${currentRecord.id}/${currentRecord.image}`;
        };

        return {
          title: record.title || '',
          excerpt: record.excerpt || '',
          content: record.content || '',
          author: record.author || '',
          status: record.status || 'draft',
          category: record.category || '',
          tags: parseTags(record.tags).join(', '),
          image: null,
          imagePreview: getImagePreviewUrl(record)
        };
      };

      const mappedData = mapRecordToFormData(defaultValues);
      setFormData(mappedData);
      setErrors({});
    }
  }, [defaultValues, open]);

  useEffect(() => {
    if (!open) {
      setFormData(getInitialFormData());
      setNewTag('');
      setErrors({});
    }
  }, [open]);

  const { data } = useQuery({
    queryKey: ['authors'],
    queryFn: () =>
      pb.collection('users').getFullList<UsersRecord<UserSocials>>()
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.author) newErrors.author = 'Author is required';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formDataToSend = new FormData();

        Object.keys(formData).forEach(key => {
          if (
            key !== 'image' &&
            key !== 'imagePreview' &&
            (formData as any)[key]
          ) {
            formDataToSend.append(key, (formData as any)[key]);
          }
        });

        if (formData.image) {
          formDataToSend.append('image', formData.image);
        }

        let res;
        if (!defaultValues) {
          res = await pb
            .collection('posts')
            .create<PostsRecordExtended>(formDataToSend);
        } else {
          res = await pb
            .collection('posts')
            .update(defaultValues.id, formDataToSend);
        }
      } catch (error) {
        console.error('Failed to create post:', error);
      }
    }
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();

    const currentTags = formData.tags
      ? formData.tags.split(',').map(tag => tag.trim())
      : [];

    if (trimmedTag && !currentTags.includes(trimmedTag)) {
      const updatedTags = [...currentTags, trimmedTag];

      setFormData({
        ...formData,
        tags: updatedTags.join(', ')
      });

      setNewTag('');
    }

    console.log('formData', formData);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags
        .split(',')
        .filter(tag => tag !== tagToRemove)
        .join(', ')
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        image: file,
        imagePreview: imageUrl
      });
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {defaultValues
              ? 'Edit the publication details below.'
              : 'Create a new publication by filling out the form below.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={e =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className={errors.excerpt ? 'border-destructive' : ''}
                  rows={3}
                />
                {errors.excerpt && (
                  <p className="text-sm text-destructive">{errors.excerpt}</p>
                )}
              </div>
              <div className="flex gap-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Select
                    name="author"
                    value={formData.author}
                    onValueChange={value =>
                      setFormData({ ...formData, author: value })
                    }
                  >
                    <SelectTrigger
                      className={errors.author ? 'border-destructive' : ''}
                    >
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {data?.map(author => (
                        <SelectItem key={author.id} value={author.id || ''}>
                          {author.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.author && (
                    <p className="text-sm text-destructive">{errors.author}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    name="category"
                    value={formData.category}
                    onValueChange={value =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger
                      className={errors.category ? 'border-destructive' : ''}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={value =>
                      setFormData({
                        ...formData,
                        status: value as 'draft' | 'published' | 'archived'
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Cover Image</Label>
                <div className="space-y-2">
                  {formData.imagePreview ? (
                    <div className="relative">
                      <Image
                        src={formData.imagePreview}
                        alt="Cover"
                        width={411}
                        height={116}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => {
                          if (formData.imagePreview) {
                            URL.revokeObjectURL(formData.imagePreview);
                          }
                          setFormData({
                            ...formData,
                            image: null,
                            imagePreview: ''
                          });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                      <div className="mt-2">
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <span className="text-sm text-primary hover:underline">
                            Upload an image
                          </span>
                          <input
                            name="image"
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    name="tags"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.split(',').map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              name="content"
              id="content"
              value={formData.content}
              onChange={e =>
                setFormData({ ...formData, content: e.target.value })
              }
              className={errors.content ? 'border-destructive' : ''}
              rows={10}
              placeholder="Write your publication content here..."
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {defaultValues ? 'Update Publication' : 'Create Publication'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
