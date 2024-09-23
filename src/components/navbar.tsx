import { DropdownMenuNav } from "./dropdown-menu-nav";
import Link from "next/link";
import SearchNav from "./search-nav";
import HoverBtn from "./ui/hover-btn";

const NAV_LINKS = [
  { name: "Populars", href: "/populars" },
  { name: "Most downloaded", href: "/most-downloaded" },
  { name: "Community", href: "/community" },
  { name: "About", href: "/about" },
] as const;

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full border-b dark:border-stone-800 border-stone-300 py-2 dark:bg-stone-950 bg-stone-50">
      <div className="flex items-center justify-between xl:px-40 px-10">
        <div className="flex items-center gap-5">
          <Link
            className="text-2xl font-medium dark:text-white text-black"
            href={"/"}
          >
            wincurs.
          </Link>
          <nav>
            <ul className="flex items-center gap-5">
              {NAV_LINKS.map((links) => (
                <li key={links.name} className="mt-0.5">
                  <Link
                    className="text-sm dark:text-stone-300 dark:hover:text-white text-stone-600 hover:text-black"
                    href={links.href}
                  >
                    {links.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <SearchNav />
        <div className="flex items-center gap-5">
          <Link href={"/submit"}>
            <HoverBtn />
          </Link>
          <DropdownMenuNav />
        </div>
      </div>
    </header>
  );
}
