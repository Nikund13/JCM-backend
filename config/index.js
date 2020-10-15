if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const config = {
    expireTime: process.env.JWTEXPIRE,
    secrets: {
      JWT_SECRET: process.env.JWTSECRET
    },
    db: {
      url: process.env.DBURL
    },
    port: process.env.PORT,
  }
  
  export default config 