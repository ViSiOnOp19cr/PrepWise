import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser, isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser();

  return (
    <div className="root-layout">
      <nav className="navbar">
        <div className="nav-left">
          <Link href="/" className="nav-logo">
            <Image src="/logo.svg" alt="PrepWise Logo" width={38} height={32} />
            <h2 className="logo-text">PrepWise</h2>
          </Link>
        </div>

        <div className="nav-right">
          <div className="nav-user">
            <Image
              src="/user-avatar.png"
              alt="User Avatar"
              width={32}
              height={32}
              className="user-avatar"
            />
            <span className="user-name">{user?.name || "User"}</span>
          </div>

          <div className="nav-actions">
            <Link href="/interview" className="nav-link">
              <span className="nav-icon">🎯</span>
              <span>Practice</span>
            </Link>
            <Link href="/" className="nav-link">
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
};

export default Layout;
