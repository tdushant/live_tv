import './globals.css';
import './neotv-player.css';
import { Inter } from 'next/font/google';
import GoogleTag from './googleTag';
import { MetadataProvider } from './components/utilies/MetadataContext';
import { MetadataHead } from './components/utilies/MetadataHead';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // Initial server-side metadata
  const initialMetadata = {
    title: 'NeoTV+ | Free AD Supported TV',
    description: 'Neo TV+ is live TV streaming app. Watch Free TV on your Smart TV or Mobile.',
  };

  return (
    <MetadataProvider initialMetadata={initialMetadata}>
      <html lang="en">
        <head>
          <link rel="canonical" href="https://livetv.neotvapp.com/" />
          <link
            href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="website" />
          <MetadataHead />
		  <meta property="og:url" content="https://livetv.neotvapp.com/" />
		  <meta property="og:site_name" content="NeoTV+ | Free AD Supported TV | FAST TV application offer live tv channels in India." />
		  <meta property="og:image" content="https://neotvapp.com/wp-content/uploads/2024/09/neo-tv-banner.jpg" />
		  <meta property="og:image:width" content="1639" />
		  <meta property="og:image:height" content="765" />
		  <meta property="og:image:type" content="image/jpeg" />
		  <meta name="twitter:card" content="summary_large_image" />
        </head>
        <body className={inter.className}>
          <GoogleTag />
          {children}
        </body>
      </html>
    </MetadataProvider>
  );
}
