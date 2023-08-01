const { ExtractId, HTTP_API } = require("../config/httpConfig");
const Store = require("../model/store");

const checkCharge = async (id) => {
  const user = await Store.findByPk(id);
  if (user.type === 1 || user.status == "ACTIVE" || user.status == "active") {
    await Store.update({ status: "active" }, { where: { id: id } });
    return "active";
  }
  const results = await fetch(
    `https://${user.shop}/admin/api/${
      process.env.API_VERSION
    }/recurring_application_charges/${ExtractId(user.charge_id)}.json`,
    {
      headers: {
        "X-Shopify-Access-Token": user.token,
      },
    }
  );
  const res = await results.json();
  await Store.update(
    { status: res.recurring_application_charge.status },
    { where: { id: id } }
  );
  //not active
  if (res.recurring_application_charge.status != "active") {
    const query = JSON.stringify({
      query: `mutation {
        appSubscriptionCreate(
            name: "Unlimited"
            returnUrl: "${HTTP_API}?host=${user.host}&shop=${user.shop}"
            trialDays: 1
            test:false
            lineItems: [
            {
              plan: {
                appRecurringPricingDetails: {
                    price: { amount: 9.95, currencyCode: USD }
                }
              }
            }
            ]
          ) {
              userErrors {
                field
                message
              }
              confirmationUrl
              appSubscription {
                id
                status
              }
          }
      }`,
    });
    const response = await fetch(
      `https://${user.shop}/admin/api/2021-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": user.token,
        },
        body: query,
      }
    );
    const responseJson = await response.json();
    await Store.update(
      {
        charge_id: responseJson.data.appSubscriptionCreate.appSubscription.id,
      },
      { where: { id: id } }
    );
    return responseJson.data.appSubscriptionCreate.confirmationUrl;
  } else {
    return "active";
  }
};

module.exports = checkCharge;
