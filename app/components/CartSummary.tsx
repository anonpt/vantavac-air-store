import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {Money, type OptimisticCart} from '@shopify/hydrogen';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className = layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';
  const checkoutUrl = cart?.checkoutUrl;

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <div className="cart-summary-label">ORDER SUMMARY</div>
      <dl className="cart-subtotal">
        <dt>Subtotal</dt>
        <dd>{cart?.cost?.subtotalAmount ? <Money data={cart.cost.subtotalAmount} /> : '-'}</dd>
      </dl>
      <p className="cart-shipping-note">Shipping and taxes are confirmed at checkout.</p>
      {checkoutUrl ? (
        <a className="cart-checkout" href={checkoutUrl} target="_self">
          CONTINUE TO CHECKOUT <span>→</span>
        </a>
      ) : null}
      <div className="cart-secure">SECURE SHOPIFY CHECKOUT</div>
    </div>
  );
}
