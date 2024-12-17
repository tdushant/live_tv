"use client"

import { useEffect } from "react";

const GoogleTag = () => {
  useEffect(() => {
    // Add the Google Tag Manager script
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-32WEG1HCMW";
    document.head.appendChild(script1);

    // Add the inline Google Tag configuration script
    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-32WEG1HCMW');
    `;
    document.head.appendChild(script2);

    return () => {
      // Cleanup scripts to prevent duplication
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  return null;
};

export default GoogleTag;
