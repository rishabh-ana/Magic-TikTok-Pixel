const getDataExist = async (ctx, accessToken, shop) => {
    const queryid = JSON.stringify({
      query:
      `{
          shop {
            id
          }
        }`
    });

    const responseid = await fetch(`https://${shop}/admin/api/2020-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-Shopify-Access-Token": accessToken,
      },
      body: queryid
    });

  var confirm = '';
  const config = require('../config/httpConfig.js');
  const db = require('../database.js');
  const responseId = await responseid.json();
  const id = config.ExtractId(responseId.data.shop.id);

  return new Promise(function(resolve, reject) {
      db.query('SELECT id FROM tks WHERE id=(?)', id, (res, fie) => {
        if(res.length > 0) {
          resolve(0);
        }
        else {
            resolve(1);
        }
      });
  });
}

module.exports = getDataExist;
