import { brand } from "@/theme/brand.config";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__copy" suppressHydrationWarning>
          &copy; {new Date().getFullYear()} {brand.company.name} - {brand.company.tagline}
        </span>
        <span className="footer__meta">
          Recipes curated by AI. No ads, no life-story preambles.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
