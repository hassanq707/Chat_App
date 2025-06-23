import jwt from "jsonwebtoken";

function setUser(userId) {
    return jwt.sign( {userId} ,process.env.JWT_SECRET_KEY);
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        return null; 
    }
}

export{
    setUser,
    getUser
};