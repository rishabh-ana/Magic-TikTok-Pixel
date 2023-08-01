import gql from 'graphql-tag';

export const GET_SHOP_ID = gql`
query {
  shop {
    id
  }
}
`;

export const CREATE_RECURRING = gql`
mutation appSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!, $trialDays: Int) {
  appSubscriptionCreate(name: $name, lineItems: $lineItems, returnUrl: $returnUrl, trialDays: $trialDays) {
    appSubscription {
      id
    }
    confirmationUrl
    userErrors {
      field
      message
    }
  }
}
`;
