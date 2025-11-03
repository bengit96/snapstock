"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { LogoIcon } from "@/components/common/logo";
import type { User } from "@/lib/types";

interface HeaderProps {
  user?: User | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3">
              <LogoIcon className="h-9 w-9 text-purple-600" />
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            {user?.email && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Welcome, {user.email}
              </p>
            )}
          </div>

          {user && (
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
