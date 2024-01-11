/**
 * @typedef {Object} MarkdownParams
 * @property {number || null} id
 * @property {string} title
 * @property {string} content
 */

class Markdown {
    /**
     * @param {MarkdownParams} params
     */
    constructor({ id = null, title, content }) {
        this.id = id;
        this.title = title;
        this.content = content;
    }
}

module.exports = Markdown;