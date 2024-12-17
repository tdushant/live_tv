'use client';

import { useMetadata } from './MetadataContext';

export function MetadataHead() {
  const { metadata } = useMetadata();

  return (
    <>
      <title>{metadata.title}</title>
      <meta property="og:title" content={metadata.title} />
      <meta name="description" content={metadata.description} />
      <meta property="og:description" content={metadata.description} />
    </>
  );
}
