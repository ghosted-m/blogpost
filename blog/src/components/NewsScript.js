import Script from 'next/script';

const NewsScript = () => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://news.google.com/swg/js/v1/swg-basic.js"
        async
      />
      <Script
        id="google-news-subscription"
        strategy="afterInteractive"
      >
        {`
          (self.SWG_BASIC = self.SWG_BASIC || []).push(basicSubscriptions => {
            basicSubscriptions.init({
              type: "NewsArticle",
              isPartOfType: ["Product"],
              isPartOfProductId: "CAowk8fCDA:openaccess",
              clientOptions: { theme: "light", lang: "en-GB" },
            });
          });
        `}
      </Script>
    </>
  );
};

export default NewsScript;
