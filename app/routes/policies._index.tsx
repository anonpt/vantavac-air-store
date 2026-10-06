import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/policies._index';
import type {PoliciesQuery, PolicyItemFragment} from 'storefrontapi.generated';

export async function loader({context}: Route.LoaderArgs) {
  const data: PoliciesQuery = await context.storefront.query(POLICIES_QUERY);
  
  const shopPolicies = data.shop;
  const policies: PolicyItemFragment[] = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy,
  ].filter((policy): policy is PolicyItemFragment => policy != null);

  if (!policies.length) {
    throw new Response('No policies found', {status: 404});
  }

  return {policies};
}

const policyLabel: Record<string, string> = {
  'privacy-policy': 'Privacy Policy',
  'shipping-policy': 'Shipping Policy',
  'terms-of-service': 'Terms of Service',
  'refund-policy': 'Refund & Return Policy',
  'subscription-policy': 'Subscription Policy',
};

export default function Policies() {
  const {policies} = useLoaderData<typeof loader>();

  return (
    <div className="policies">
      <Link className="policy-back" to="/">← VantaVac Air</Link>
      <p className="policy-kicker">LEGAL & CUSTOMER CARE</p>
      <h1>Store Policies</h1>
      <div className="policy-list">
        {policies.map((policy) => (
          <Link key={policy.id} to={`/policies/${policy.handle}`}>
            <span>{policyLabel[policy.handle] ?? policy.title}</span>
            <span>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
` as const;
