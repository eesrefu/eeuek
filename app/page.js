import Link from 'next/link';
import SearchBox from './components/SearchBox';
import { POPULAR } from '@/lib/popular';

export default function HomePage() {
  return (
    <div className="container">
      <section className="hero">
        <h1>
          Endüstriyel soğutma ve HVAC sorularınıza
          <br />
          <span className="accent">kaynaklı</span> cevaplar
        </h1>
        <p className="sub">
          KlimaSun, Erdinç Klima'nın yapay zekâ asistanıdır. F-Gaz, evaporatif soğutma, pano
          kliması, chiller ve daha fazlasını sorun — ücretsiz, üyeliksiz, kaynak göstererek.
        </p>
        <SearchBox />
      </section>

      <section>
        <h2 className="section-title">Popüler sorular</h2>
        <div className="q-grid">
          {POPULAR.map((item) => (
            <Link key={item.slug} href={`/soru/${item.slug}`} className="q-card" prefetch={false}>
              <span className="q-icon">❄️ Soru</span>
              <span className="q-text">{item.question}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
