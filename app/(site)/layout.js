import '../site.css';
import { QuoteProvider } from '@/app/components/site/QuoteContext';
import SiteHeader from '@/app/components/site/SiteHeader';
import SiteFooter from '@/app/components/site/SiteFooter';
import QuoteDrawer from '@/app/components/site/QuoteDrawer';
import WhatsAppBubble from '@/app/components/site/WhatsAppBubble';

export default function SiteLayout({ children }) {
  return (
    <QuoteProvider>
      <div className="ks-site">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <WhatsAppBubble />
        <QuoteDrawer />
      </div>
    </QuoteProvider>
  );
}
