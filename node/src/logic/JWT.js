import jwt from "jsonwebtoken";
import UserDAO from "../dao/UserDAO.js";

function getTokenFromUsername(username) {
  return jwt.sign(
    {sub: username},
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '14d'
    }
  );
}

async function getUserIdFromToken(token) {
  const username = getUsernameFromToken(token);
  if (!username) {
    return null;
  }
  return await UserDAO.selectIdByUsername(username);
}

function getUsernameFromToken(token, role = "normal") {
  const adminUsername = "windsnow1025@gmail.com";

  try {
    const username = jwt.verify(token, process.env.JWT_SECRET).sub;
    if (role === "admin" && username !== adminUsername) {
      return null;
    }
    return username;
  } catch (err) {
    return null;
  }
}

export default {
  getTokenFromUsername,
  getUserIdFromToken,
  getUsernameFromToken
};