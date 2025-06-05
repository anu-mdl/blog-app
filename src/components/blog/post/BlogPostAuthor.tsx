import { UsersRecord } from '@/api/api_types';
import { UserSocials } from '@/api/extended_types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { pb } from '@/lib/pb';
import { Github, Linkedin, Twitter } from 'lucide-react';

export function BlogPostAuthor({
  author
}: {
  author: UsersRecord<UserSocials>;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={
                author?.avatar
                  ? pb.files.getURL(author, author.avatar)
                  : '/image.svg'
              }
              alt={author.username}
            />
            <AvatarFallback className="text-lg">
              {author.username?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold">About {author.username}</h3>
              <p className="text-muted-foreground mt-1">{author.bio}</p>
            </div>

            <div className="flex gap-2">
              {author.socials?.twitter && (
                <Button variant="outline" size="icon" asChild>
                  <a
                    href={`https://twitter.com/${author.socials.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4" />
                    <span className="sr-only">Twitter</span>
                  </a>
                </Button>
              )}
              {author.socials?.github && (
                <Button variant="outline" size="icon" asChild>
                  <a
                    href={`https://github.com/${author.socials.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
