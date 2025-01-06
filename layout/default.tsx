import clsx from "clsx";
import Head from "next/head";
import { type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
}

const DefaultLayout = (props: LayoutProps) => {
  const description = "Assemble, configure, and deploy autonomous AI Agents in your browser.";

  return (
    <div
      className={clsx(
        "flex flex-col bg-gradient-to-b from-[#2B2B2B] to-[#1F1F1F]",
        props.centered && "items-center justify-center"
      )}
    >
      <Head>
        <title>CaelumGPT</title>
        <meta name="description" content={description} />
        <meta name="twitter:site" content="@CaelumGPT" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CaelumGPT 🤖" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://gpt.caelumai.io/banner.png" />
        <meta name="twitter:image:width" content="1280" />
        <meta name="twitter:image:height" content="640" />
        <meta property="og:title" content="CaelumGPT: Autonomous AI in your browser 🤖" />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://gpt.caelumai.io/" />
        <meta property="og:image" content="https://gpt.caelumai.io/banner.png" />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="640" />
        <meta property="og:type" content="website" />
        <meta
          name="google-site-verification"
          content="sG4QDkC8g2oxKSopgJdIe2hQ_SaJDaEaBjwCXZNkNWA"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={clsx("min-w-screen min-h-screen", props.className)}>{props.children}</div>
    </div>
  );
};

export default DefaultLayout;
