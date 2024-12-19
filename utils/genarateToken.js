const Jwt = require("jsonwebtoken");


class GenarateTokens {
    createTokens = async (user) => {
        try {
            const payload = {
                _id: user._id,
                userName: user.userName,
                role: user.role,
            };
            const accessToken = Jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY,{
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
            });

            return{accessToken};
        } catch (error) {
            throw error;
        }
    };

}

const genarateTokensInstance = new GenarateTokens();
module.exports = genarateTokensInstance;