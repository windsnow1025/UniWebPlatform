/**
 * @typedef {Object} ConversationParams
 * @property {number || null} id
 * @property {string} title
 * @property {string} content
 */

class Markdown {
    /**
     * @param {ConversationParams} params
     */
    constructor({ id = null, title, content }) {
        this.id = id;
        this.title = title;
        this.content = content;
    }
}

module.exports = Markdown;