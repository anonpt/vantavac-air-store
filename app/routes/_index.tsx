import {Await, useLoaderData, useRouteLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {Image, CartForm} from '@shopify/hydrogen';
import {Suspense, useEffect, useRef, type ReactNode} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';
import {useAside} from '~/components/Aside';

export const meta: Route.MetaFunction = () => [
  {title: 'VantaVac Air™ | Cordless Precision Cleaning'},
  {name: 'description', content: 'Compact 120W cordless cleaning for car interiors, upholstery and tight spaces.'},
];

export async function loader({context}: Route.LoaderArgs) {
  const {product} = await context.storefront.query(VANTAVAC_QUERY);
  if (!product) throw new Response('VantaVac Air unavailable', {status: 404});
  return {product};
}

export default function Homepage() {
  const {product} = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<RootLoader>('root');
  const {open} = useAside();
  const root = useRef<HTMLDivElement>(null);
  const variant = product.selectedOrFirstAvailableVariant ?? product.variants.nodes[0];

  const formatMoney = (amount: string, currencyCode: string) =>
    new Intl.NumberFormat('en-US', {style: 'currency', currency: currencyCode}).format(Number(amount));

  const price = formatMoney(variant.price.amount, variant.price.currencyCode);
  const compare = variant.compareAtPrice
    ? formatMoney(variant.compareAtPrice.amount, variant.compareAtPrice.currencyCode)
    : null;

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reveals = el.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }),
      {threshold: 0.12},
    );

    reveals.forEach((item) => observer.observe(item));

    const visual = el.querySelector<HTMLElement>('[data-parallax]');
    const onScroll = () => {
      if (!visual) return;
      visual.style.transform = `translate3d(0,${Math.min(34, window.scrollY * 0.028)}px,0)`;
    };

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('scroll', onScroll, {passive: true});
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const buyButton = (label: string) => (
    <SingleItemPurchaseButton
      cartPromise={rootData?.cart}
      variantId={variant.id}
      available={variant.availableForSale}
      label={label}
      onOpenCart={() => open('cart')}
    />
  );

  return (
    <div className="lux" ref={root}>
      <div className="lux-announcement">U.S. DELIVERY <i /> CORDLESS <i /> 120W RATED POWER</div>

      <header className="lux-header">
        <a className="lux-brand" href="/" aria-label="VantaVac Air home">
          VantaVac <b>AIR</b>
        </a>
        <nav className="lux-nav" aria-label="Main navigation">
          <a href="#why">Why VantaVac</a>
          <a href="#design">Design</a>
          <a href="#included">What's included</a>
          <a href="#faq">FAQ</a>
        </nav>
        <button className="lux-bag" type="button" onClick={() => open('cart')}>
          Bag <BagCount cartPromise={rootData?.cart} />
        </button>
      </header>

      <main>
        <section className="lux-hero">
          <div className="lux-glow" aria-hidden="true" />
          <div className="lux-copy" data-reveal>
            <p className="lux-kicker">PRECISION CLEANING · CORDLESS FREEDOM</p>
            <h1>POWERFUL<br/>CLEANING.<br/><span>ANYWHERE.</span></h1>
            <p className="lux-sub">
              Compact cordless power for the crumbs, dust, hair and tight spaces
              that make a full-size vacuum feel excessive.
            </p>

            <div className="lux-price">
              <strong>{price}</strong>
              {compare && <s>{compare}</s>}
              <small>USD</small>
            </div>

            <div className="lux-actions">
              {buyButton('GET VANTAVAC AIR')}
              <a href="#design">SEE IT IN DETAIL <span>↓</span></a>
            </div>

            <div className="lux-mini-proof">
              <span>USB-C charging</span>
              <span>Bagless design</span>
              <span>Black finish</span>
            </div>
          </div>

          <div className="lux-product" data-reveal>
            <div className="lux-product-inner" data-parallax>
              {product.featuredImage && (
                <Image
                  data={product.featuredImage}
                  sizes="(min-width: 900px) 54vw, 92vw"
                  loading="eager"
                />
              )}
            </div>
            <span className="lux-orbit lux-orbit-a" aria-hidden="true" />
            <span className="lux-orbit lux-orbit-b" aria-hidden="true" />
            <span className="lux-serial">VVA-120 / BLACK / USB-C</span>
          </div>
        </section>

        <section className="lux-proof" id="why">
          <article><span>01</span><strong>CORDLESS</strong><small>No cable. No setup ritual.</small></article>
          <article><span>02</span><strong>COMPACT</strong><small>Made for car interiors.</small></article>
          <article><span>03</span><strong>120W</strong><small>Rated power for quick cleanups.</small></article>
          <article><span>04</span><strong>USB-C</strong><small>Convenient recharging.</small></article>
        </section>

        <section className="lux-story" id="design">
          <div className="lux-story-copy" data-reveal>
            <p className="lux-kicker">DESIGNED FOR THE DETAILS</p>
            <h2>Your car shouldn't need a <span>full-size vacuum.</span></h2>
            <p>
              VantaVac Air stays close enough to become a habit. Pick it up,
              handle the mess, empty the dust container and move on.
            </p>
          </div>
          <div className="lux-story-image" data-reveal>
            {product.images.nodes[1] && <Image data={product.images.nodes[1]} sizes="50vw" />}
          </div>
        </section>

        <section className="lux-cinema">
          <div className="lux-cinema-copy" data-reveal>
            <p className="lux-kicker">LESS SETUP. MORE CLEAN.</p>
            <h2>Built to disappear into your routine.</h2>
            <p>Seats. Consoles. Floor mats. Sofas. Desks. Corners.</p>
          </div>
          <div className="lux-cinema-grid">
            <figure data-reveal>
              {product.images.nodes[2] && <Image data={product.images.nodes[2]} sizes="50vw" />}
              <figcaption>PRECISION ATTACHMENT</figcaption>
            </figure>
            <figure data-reveal>
              {product.images.nodes[3] && <Image data={product.images.nodes[3]} sizes="50vw" />}
              <figcaption>PORTABLE FORM</figcaption>
            </figure>
          </div>
        </section>

        <section className="lux-specs">
          <div className="lux-specs-head" data-reveal>
            <p className="lux-kicker">ESSENTIAL ENGINEERING</p>
            <h2>Nothing loud.<br/>Everything useful.</h2>
          </div>
          <div className="lux-spec-list" data-reveal>
            <div><span>Rated power</span><b>120W</b></div>
            <div><span>Voltage</span><b>5V</b></div>
            <div><span>Charging</span><b>USB Type-C</b></div>
            <div><span>Dust system</span><b>Bagless</b></div>
            <div><span>Body</span><b>ABS</b></div>
            <div><span>Finish</span><b>Black</b></div>
          </div>
        </section>

        <section className="lux-included" id="included">
          <p className="lux-kicker" data-reveal>IN THE BOX</p>
          <h2 data-reveal>Ready for every corner.</h2>
          <div className="lux-grid">
            <article data-reveal><span>01</span><h3>VantaVac Air</h3><p>Compact cordless handheld vacuum.</p></article>
            <article data-reveal><span>02</span><h3>Narrow nozzle</h3><p>For gaps, seams and hard-to-reach areas.</p></article>
            <article data-reveal><span>03</span><h3>Detail attachment</h3><p>For focused everyday cleaning.</p></article>
            <article data-reveal><span>04</span><h3>USB-C charging</h3><p>Simple charging without a bulky dock.</p></article>
          </div>
        </section>

        <section className="lux-purchase">
          <div className="lux-purchase-image" data-reveal>
            {product.images.nodes[5]
              ? <Image data={product.images.nodes[5]} sizes="48vw" />
              : product.featuredImage && <Image data={product.featuredImage} sizes="48vw" />}
          </div>
          <div className="lux-purchase-copy" data-reveal>
            <p className="lux-kicker">VANTAVAC AIR™</p>
            <h2>A cleaner car is one click away.</h2>
            <p>Compact. Cordless. Ready when the mess happens.</p>
            <div className="lux-price">
              <strong>{price}</strong>
              {compare && <s>{compare}</s>}
            </div>
            {buyButton('ADD TO BAG')}
            <small>Secure Shopify checkout</small>
          </div>
        </section>

        <section className="lux-faq" id="faq">
          <p className="lux-kicker">QUESTIONS, ANSWERED</p>
          <h2>FAQ</h2>
          <details><summary>What is VantaVac Air designed to clean?<span>+</span></summary><p>Light dry debris such as crumbs, dust and hair in car interiors, upholstery, desks and tight spaces.</p></details>
          <details><summary>How does it charge?<span>+</span></summary><p>The current model uses USB Type-C charging.</p></details>
          <details><summary>Is it cordless?<span>+</span></summary><p>Yes. It is a rechargeable cordless handheld vacuum.</p></details>
          <details><summary>What color is available?<span>+</span></summary><p>The current product configuration is black.</p></details>
        </section>
      </main>

      <footer className="lux-footer">
        <div className="lux-footer-brand">
          <a className="lux-brand" href="/">VantaVac <b>AIR</b></a>
          <p>Precision cleaning for modern life.</p>
        </div>
        <nav className="lux-footer-links" aria-label="Store policies">
          <a href="/policies/privacy-policy">Privacy</a>
          <a href="/policies/refund-policy">Returns</a>
          <a href="/policies/shipping-policy">Shipping</a>
          <a href="/policies/terms-of-service">Terms</a>
          <a href="mailto:luisfilipesilva2010@gmail.com">Support</a>
        </nav>
        <small>© {new Date().getFullYear()} VantaVac</small>
      </footer>

      <div className="lux-sticky">
        <div><b>VantaVac Air™</b><span>{price}</span></div>
        {buyButton('ADD TO BAG')}
      </div>
    </div>
  );
}

function BagCount({cartPromise}: {cartPromise?: Promise<CartApiQueryFragment | null>}) {
  if (!cartPromise) return <span>0</span>;
  return (
    <Suspense fallback={<span>0</span>}>
      <Await resolve={cartPromise}>{(cart) => <span>{cart?.totalQuantity ?? 0}</span>}</Await>
    </Suspense>
  );
}

function SingleItemPurchaseButton({
  cartPromise,
  variantId,
  available,
  label,
  onOpenCart,
}: {
  cartPromise?: Promise<CartApiQueryFragment | null>;
  variantId: string;
  available: boolean;
  label: string;
  onOpenCart: () => void;
}) {
  const button = (children: ReactNode) => (
    <button className="lux-btn" type="submit" disabled={!available} onClick={onOpenCart}>
      <span>{available ? children : 'SOLD OUT'}</span><span>→</span>
    </button>
  );

  if (!cartPromise) {
    return (
      <CartForm route="/cart" action={CartForm.ACTIONS.LinesAdd} inputs={{lines: [{merchandiseId: variantId, quantity: 1}]}}>
        {button(label)}
      </CartForm>
    );
  }

  return (
    <Suspense fallback={button(label)}>
      <Await resolve={cartPromise}>
        {(cart) => {
          const existing = cart?.lines?.nodes?.find((line) => line.merchandise.id === variantId);
          return existing ? (
            <CartForm route="/cart" action={CartForm.ACTIONS.LinesUpdate} inputs={{lines: [{id: existing.id, quantity: 1}]}}>
              {button(label)}
            </CartForm>
          ) : (
            <CartForm route="/cart" action={CartForm.ACTIONS.LinesAdd} inputs={{lines: [{merchandiseId: variantId, quantity: 1}]}}>
              {button(label)}
            </CartForm>
          );
        }}
      </Await>
    </Suspense>
  );
}

const VANTAVAC_QUERY = `#graphql
  query VantaVac($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product(id: "gid://shopify/Product/11247166390615") {
      id
      title
      handle
      featuredImage { id url altText width height }
      images(first: 7) { nodes { id url altText width height } }
      selectedOrFirstAvailableVariant {
        id
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      }
      variants(first: 1) {
        nodes {
          id
          availableForSale
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
        }
      }
    }
  }` as const;
