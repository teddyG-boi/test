import type { FC, ReactNode } from "react";

interface FooterLinkProps {
  href: string;
  children: ReactNode;
}

const FooterLink: FC<FooterLinkProps> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group w-full rounded-full bg-transparent px-2 text-sm text-white/50 transition-colors duration-300 ease-in-out hover:text-white/90"
  >
    {children}
  </a>
);

const FooterLinks = () => {
  return (
    <div className="hidden cursor-pointer flex-row justify-center space-x-4 lg:flex">
      <FooterLink href="https://gpt.caelumai.io/privacypolicy">Privacy</FooterLink>
      <FooterLink href="https://gpt.caelumai.io/terms">Terms</FooterLink>
    </div>
  );
};

export default FooterLinks;
