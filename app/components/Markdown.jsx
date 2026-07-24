import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Asistan cevaplarını (Markdown + LaTeX) güvenli şekilde HTML'e dönüştürür.
// - remark-gfm: başlık, liste, tablo, kalın/italik vb.
// - remark-math + rehype-katex: $...$ ve $$...$$ matematik ifadeleri.
// Ham HTML çalıştırılmaz (rehype-raw yok) — XSS güvenli.
export default function Markdown({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {children || ''}
    </ReactMarkdown>
  );
}
