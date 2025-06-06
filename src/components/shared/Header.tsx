'use client';
// TODO: добавить страничку authors
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Search,
  Menu,
  Sun,
  Moon,
  Settings,
  LogOut,
  BookOpen,
  Home,
  PenTool,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import PocketBase from 'pocketbase';
import { usePathname, useRouter } from 'next/navigation';
import { pocketbaseClient } from '@/api/pocketbase-client';
import { pb } from '@/lib/pb';
import Cookies from 'js-cookie';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Blog', href: '/blog', icon: BookOpen }
  //   { name: 'Authors', href: '/authors', icon: Users },
];

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const user = pocketbaseClient().authStore.model;

  const handleSignOut = async () => {
    pocketbaseClient().authStore.clear();
    Cookies.remove('pb_auth_client');
    router.push('/');
    router.refresh();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/blog?search=${encodeURIComponent(query)}`;
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200',
        isScrolled && 'shadow-sm'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl"
            >
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <PenTool className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:inline-block">SomeBlog</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map(item => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));

                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn('gap-2', isActive && 'bg-secondary/80')}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery);
                    setIsSearchFocused(false);
                  }
                }}
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="hidden sm:inline-flex"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={
                            user.avatar
                              ? pb.files.getURL(user, user.avatar)
                              : '/image.svg'
                          }
                          alt={user.username}
                        />
                        <AvatarFallback>
                          {user.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/blog/admin" className="cursor-pointer">
                          <PenTool className="mr-2 h-4 w-4" />
                          <span>Admin</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  asChild
                  className="hidden sm:inline-flex"
                >
                  <Link href="/auth/sign-in">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search articles..."
                      className="pl-10"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleSearch(e.currentTarget.value);
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    />
                  </div>

                  <nav className="space-y-2">
                    {navigationItems.map(item => {
                      const Icon = item.icon;
                      const isActive =
                        pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-secondary text-secondary-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium">Theme</span>
                    {mounted ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setTheme(theme === 'light' ? 'dark' : 'light')
                        }
                      >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hidden sm:inline-flex"
                      >
                        <div className="h-5 w-5" />
                      </Button>
                    )}
                  </div>

                  {!user && (
                    <div className="space-y-2 pt-4 border-t">
                      <Button variant="outline" className="w-full" asChild>
                        <Link
                          href="/signin"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign in
                        </Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link
                          href="/signup"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
