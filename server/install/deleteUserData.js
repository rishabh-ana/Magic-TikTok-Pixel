const deleteUserData = async (shopid) => {
  const config = require('../config/httpConfig.js');
  const id = config.ExtractId(shopid);
  const db = require('../database.js');
  console.log(shopid);
  // db.query('DELETE FROM scripts WHERE id=(?)',id, function(result,fields){
  //     console.log('User deleted');
  // });

};

module.exports = deleteUserData;
