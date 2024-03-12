/**
 * @typedef {Object} MessageParams
 * @property {number || null} id
 * @property {string} username
 * @property {string} content
 */

class Message {
    /**
     * @param {MessageParams} params
     */
    constructor({ id = null, username, content }) {
        this.id = id;
        this.username = username;
        this.content = content;
    }
}

export default Message;