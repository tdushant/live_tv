"use client";

import Script from "next/script";

export default function GoogleIMAScript() {
	return (
        <Script
            src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"
            strategy="beforeInteractive"
        />
	);
}
