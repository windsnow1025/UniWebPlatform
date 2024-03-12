import jwt from "jsonwebtoken";
import UserDAO from "../dao/UserDAO.js";

/**
 * @param {string} username
 * @returns {Promise<*>}
 */
async function getTokenFromUsername(username) {
  return jwt.sign({sub: username}, process.env.JWT_SECRET, {expiresIn: '144h'});
}

/**
 * @param {string} token
 * @returns {Promise<null|*>}
 */
async function getUserIdFromToken(token) {
  const username = await getUsernameFromToken(token);
  if (!username) {
    return null;
  }
  return await UserDAO.selectIdByUsername(username);
}

/**
 * @param {string} token
 * @param {string} role
 * @returns {Promise<string|null>}
 */
async function getUsernameFromToken(token, role = "normal") {
  const adminUsername = "windsnow1025@gmail.com";

  try {
    const username =  await jwt.verify(token, process.env.JWT_SECRET).sub;
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