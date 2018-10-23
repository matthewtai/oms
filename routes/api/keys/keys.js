console.log('this is loading');

module.exports = {
    google: {
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret
    },
    session: {
        cookieKey:process.env.cookieKey
    },
    alpha: {
        api: process.env.alphaKey
    }
};