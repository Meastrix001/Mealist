import Link from "next/link";
import { brand } from "@/theme/brand.config";
import SavedLink from "./SavedLink";

const Navbar = () => {
  return (
    <nav className="navigation">
      <div className="container navigation__inner">
        <Link href="/" className="navigation__logo" aria-label={`${brand.company.name} home`}>
          <span className="navigation__logo-mark">{brand.company.name}</span>
        </Link>
        <div className="navigation__links">
          <Link href="/" className="navigation__link">
            All recipes
          </Link>
          <SavedLink />
          <Link href="/about" className="navigation__link">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
