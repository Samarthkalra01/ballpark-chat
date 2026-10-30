import Script from "next/script";

/**
 * Microsoft Clarity analytics (heatmaps + session recordings).
 * Loads only when NEXT_PUBLIC_CLARITY_PROJECT_ID is set, so local/dev
 * builds without the var don't send any data. The project id is public
 * (it ships in the browser), hence the NEXT_PUBLIC_ prefix.
 */
export function Clarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  if (!projectId) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");`}
    </Script>
  );
}
