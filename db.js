import appConfig from "./config";
const pg = require("pg");

export const connect = (config = appConfig) => {
  const client = new pg.Client(appConfig.db.url)
  client.connect().then(() => console.log("db connected"))
  // public_con = client
  return client
};

// console.log("=-=-=-url", client);
//
// export public_con;
// const query = new pg.Client(appConfig.db.url)
// console.log("=-=-=-=--query", query);
// export const query;
