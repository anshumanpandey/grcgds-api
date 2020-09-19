var jwt = require('express-jwt');

export default () => {
    return jwt({ secret: process.env.JWT_SECRET || 'aa', algorithms: ['HS256'] });
}