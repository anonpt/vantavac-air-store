import {Await} from 'react-router';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {CartMain} from '~/components/CartMain';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <Aside type="cart" heading={<span className="vv-cart-heading">VANTAVAC / BAG</span>}>
        <Suspense fallback={<p className="vv-cart-loading">Loading your bag…</p>}>
          <Await resolve={cart}>
            {(cart) => <CartMain cart={cart} layout="aside" />}
          </Await>
        </Suspense>
      </Aside>
      <main>{children}</main>
    </Aside.Provider>
  );
}
