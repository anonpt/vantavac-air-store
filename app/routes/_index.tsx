import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {Image, CartForm} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';

export const meta: Route.MetaFunction = () => [
  {title: 'VantaVac Air™ | Precision Cleaning, Refined'},
  {name: 'description', content: 'VantaVac Air™ is a compact 120W cordless handheld vacuum for fast, precise everyday detailing.'},
];

export async function loader({context}: Route.LoaderArgs) {
  const {product} = await context.storefront.query(VANTAVAC_QUERY, {
    variables: {handle: 'lenovo-new-cordless-handheld-car-vacuum-wet-dry-dual-use-wireless-cleaner-high-power-battery-fast-charging-wireless-vacuum-2027'},
  });
  if (!product) throw new Response('VantaVac Air unavailable', {status: 404});
  return {product};
}

export default function Homepage() {
  const {product} = useLoaderData<typeof loader>();
  const variant = product.selectedOrFirstAvailableVariant ?? product.variants.nodes[0];
  const money = new Intl.NumberFormat('en-US',{style:'currency',currency:variant.price.currencyCode}).format(Number(variant.price.amount));
  const compare = variant.compareAtPrice ? new Intl.NumberFormat('en-US',{style:'currency',currency:variant.compareAtPrice.currencyCode}).format(Number(variant.compareAtPrice.amount)) : null;
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el=root.current;if(!el)return;
    const items=el.querySelectorAll<HTMLElement>('[data-reveal]');
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vv-in');io.unobserve(e.target)}}),{threshold:.12});
    items.forEach(i=>io.observe(i));
    const hero=el.querySelector<HTMLElement>('[data-parallax]');
    const onScroll=()=>{if(hero) hero.style.transform=`translate3d(0,${Math.min(28,scrollY*.035)}px,0)`};
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches)addEventListener('scroll',onScroll,{passive:true});
    return()=>{io.disconnect();removeEventListener('scroll',onScroll)};
  },[]);

  const add = (label:string) => <CartForm route="/cart" action={CartForm.ACTIONS.LinesAdd} inputs={{lines:[{merchandiseId:variant.id,quantity:1}]}}><button className="vv-button" type="submit" disabled={!variant.availableForSale}>{variant.availableForSale?label:'Sold out'} <span>↗</span></button></CartForm>;

  return <div className="vv" ref={root}>
    <div className="vv-announcement">COMPLIMENTARY U.S. SHIPPING <i/> 120W CORDLESS PRECISION</div>
    <nav className="vv-nav"><a className="vv-brand" href="#">VANTA<span>VAC</span><sup>®</sup></a><div className="vv-links"><a href="#design">Design</a><a href="#performance">Performance</a><a href="#details">Details</a></div><a className="vv-nav-buy" href="#buy">Acquire — {money}</a></nav>

    <main>
      <section className="vv-hero">
        <div className="vv-hero-copy" data-reveal>
          <p className="vv-overline">VANTAVAC AIR™ / 01</p>
          <h1>Precision.<br/><em>Without</em><br/>the bulk.</h1>
          <p className="vv-lead">A compact cordless instrument designed for the details your full-size vacuum was never made to reach.</p>
          <div className="vv-price"><strong>{money}</strong>{compare&&<s>{compare}</s>}<span>USD</span></div>
          <div className="vv-actions">{add('Add to cart')}<a href="#design">Discover the design ↓</a></div>
        </div>
        <div className="vv-hero-media" data-reveal><div className="vv-orbit"/><div className="vv-product" data-parallax>{product.featuredImage&&<Image data={product.featuredImage} sizes="(min-width: 900px) 58vw, 100vw" loading="eager"/>}</div><span className="vv-media-note">ENGINEERED FOR THE EVERYDAY</span></div>
      </section>

      <section className="vv-manifesto" id="design"><div data-reveal><p className="vv-overline">THE OBJECT</p><h2>Less appliance.<br/>More <em>instrument.</em></h2></div><p className="vv-manifesto-copy" data-reveal>Designed to live within reach, VantaVac Air turns the small cleanups you postpone into a ten-second reflex. No cable. No oversized machine. No ceremony.</p></section>

      <section className="vv-gallery">
        <figure className="vv-gallery-main" data-reveal>{product.images.nodes[1]&&<Image data={product.images.nodes[1]} sizes="70vw"/>}<figcaption>01 — FORM</figcaption></figure>
        <div className="vv-gallery-side"><figure data-reveal>{product.images.nodes[2]&&<Image data={product.images.nodes[2]} sizes="35vw"/>}<figcaption>02 — DETAIL</figcaption></figure><figure data-reveal>{product.images.nodes[3]&&<Image data={product.images.nodes[3]} sizes="35vw"/>}<figcaption>03 — ACCESS</figcaption></figure></div>
      </section>

      <section className="vv-dark" id="performance"><div className="vv-dark-head" data-reveal><p className="vv-overline">PERFORMANCE / CONTROL</p><h2>Small footprint.<br/><em>Serious intent.</em></h2></div><div className="vv-metrics"><div data-reveal><strong>120<span>W</span></strong><p>Rated power</p></div><div data-reveal><strong>5<span>V</span></strong><p>Low-voltage charging</p></div><div data-reveal><strong>USB<span>‑C</span></strong><p>Convenient recharge</p></div><div data-reveal><strong>0<span>CABLES</span></strong><p>Cordless freedom</p></div></div></section>

      <section className="vv-detail" id="details"><div className="vv-detail-media" data-reveal>{product.images.nodes[4]&&<Image data={product.images.nodes[4]} sizes="50vw"/>}</div><div className="vv-detail-copy" data-reveal><p className="vv-overline">BUILT FOR THE GAPS</p><h2>Go where the mess <em>actually lives.</em></h2><p>Seat seams. Console edges. Floor mats. Upholstery. Desks. Tight corners. VantaVac Air keeps focused cleaning close at hand.</p><ul><li><span>01</span>Compact handheld format</li><li><span>02</span>Bagless dust collection</li><li><span>03</span>USB Type‑C charging</li><li><span>04</span>Durable ABS body</li></ul></div></section>

      <section className="vv-use"><p className="vv-overline" data-reveal>ONE TOOL / MANY MOMENTS</p><div className="vv-use-grid"><article data-reveal><span>CAR</span><h3>Between the seats.</h3><p>Crumbs, dust and dry debris where larger tools become awkward.</p></article><article data-reveal><span>HOME</span><h3>Between the cleanups.</h3><p>Quick work on drawers, upholstery, shelves and everyday surfaces.</p></article><article data-reveal><span>DESK</span><h3>Between the keys.</h3><p>A compact format for workspaces and the details around your setup.</p></article></div></section>

      <section className="vv-buy" id="buy"><div className="vv-buy-product" data-reveal>{product.images.nodes[5]?<Image data={product.images.nodes[5]} sizes="45vw"/>:product.featuredImage&&<Image data={product.featuredImage} sizes="45vw"/>}</div><div className="vv-buy-copy" data-reveal><p className="vv-overline">VANTAVAC AIR™</p><h2>Clean car.<br/>Clear mind.</h2><p>Precision cleaning, stripped back to what matters.</p><div className="vv-price vv-price-light"><strong>{money}</strong>{compare&&<s>{compare}</s>}<span>USD</span></div>{add('Get VantaVac Air™')}<small>Complimentary standard U.S. shipping</small></div></section>

      <section className="vv-faq"><p className="vv-overline">ESSENTIAL INFORMATION</p><h2>Before it becomes yours.</h2><div><details><summary>What is VantaVac Air designed for?<b>+</b></summary><p>Fast pickup of light, dry everyday debris in car interiors, upholstery, desks and tight spaces.</p></details><details><summary>How does it charge?<b>+</b></summary><p>The current model uses USB Type‑C charging.</p></details><details><summary>Is it cordless?<b>+</b></summary><p>Yes. VantaVac Air is a rechargeable cordless handheld vacuum.</p></details><details><summary>What finish is available?<b>+</b></summary><p>The current configuration is offered in black.</p></details></div></section>
    </main>
    <footer className="vv-footer"><a className="vv-brand" href="#">VANTA<span>VAC</span><sup>®</sup></a><p>Precision cleaning for modern life.</p><small>© {new Date().getFullYear()} VantaVac. All rights reserved.</small></footer>
    <div className="vv-sticky"><div><b>VantaVac Air™</b><span>{money}</span></div>{add('Add to cart')}</div>
  </div>;
}

const VANTAVAC_QUERY = `#graphql
  query VantaVac($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id title handle description
      featuredImage {id url altText width height}
      images(first: 7) {nodes {id url altText width height}}
      selectedOrFirstAvailableVariant {
        id availableForSale
        price {amount currencyCode}
        compareAtPrice {amount currencyCode}
      }
      variants(first: 1) {nodes {id availableForSale price {amount currencyCode} compareAtPrice {amount currencyCode}}}
    }
  }` as const;
