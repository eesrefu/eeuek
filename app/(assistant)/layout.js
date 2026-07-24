import '../site.css';
import 'katex/dist/katex.min.css';
import { QuoteProvider } from '@/app/components/site/QuoteContext';
import SiteHeader from '@/app/components/site/SiteHeader';
import SiteFooter from '@/app/components/site/SiteFooter';
import QuoteDrawer from '@/app/components/site/QuoteDrawer';
import WhatsAppBubble from '@/app/components/site/WhatsAppBubble';

// Asistan sayfaları da ana sitenin navy/amber kabuğunu kullanır.
export default function AssistantLayout({ children }) {
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
