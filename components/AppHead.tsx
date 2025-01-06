import Head from "next/head";

interface AppHeadProps {
  title?: string;
  ogTitle?: string;
}

const AppHead = ({ title = "CaelumGPT", ogTitle }: AppHeadProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="Assemble, configure, and deploy autonomous AI Agents in your browser." />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="CaelumGPT 🤖" />
      <meta
        name="twitter:description"
        content="Assemble, configure, and deploy autonomous AI Agents in your browser."
      />
      <meta name="twitter:image" content="https://gpt.caelumai.io/banner.png" />
      <meta name="twitter:site" content="@caelumgpt" />
      <meta name="twitter:creator" content="@caelumgpt" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://gpt.caelumai.io/" />
      <meta property="og:image" content="https://gpt.caelumai.io/banner.png" />
      <meta property="og:title" content={ogTitle || title} />
      <meta
        property="og:description"
        content="Assemble, configure, and deploy autonomous AI Agents in your browser."
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default AppHead;
