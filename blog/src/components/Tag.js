import Script from "next/script";

const Tag = () => {
  return (
    <>
      {/* This script will be loaded only on the client-side */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-2ETY19B9MX"
        async
      />
      <Script id="google-news-subscription" strategy="afterInteractive">
        <script>
          {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-2ETY19B9MX');
  `}
        </script>
      </Script>
    </>
  );
};

export default Tag;
