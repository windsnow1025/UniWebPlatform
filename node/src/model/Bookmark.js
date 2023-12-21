/**
 * @typedef {Object} BookmarkParams
 * @property {string} id
 * @property {string} firstTitle
 * @property {string} secondTitle
 * @property {string} url
 * @property {string} comment
 */

class Bookmark {
  /**
   * @param {BookmarkParams} params
   */
  constructor({ id = null, firstTitle, secondTitle, url, comment}) {
    this.id = id;
    this.firstTitle = firstTitle;
    this.secondTitle = secondTitle;
    this.url = url;
    this.comment = comment;
  }
}

module.exports = Bookmark;