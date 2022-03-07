const hapiJwt = require('@hapi/jwt');

exports.jwtAuthentication = async (server) =>{
    
    await server.register(hapiJwt);

    server.auth.strategy('my_jwt_strategy', 'jwt', {
        keys: process.env.SECRET_KEY,
        verify: {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400, // 4 hours
            timeSkewSec: 15
        },
        validate: (artifacts, request, h) => {
            
            request.user = artifacts.decoded.payload.user;

            return {
                isValid: true,
                credentials: { user: artifacts.decoded.payload.user }
            };
        }
    });

    server.auth.default('my_jwt_strategy');

};