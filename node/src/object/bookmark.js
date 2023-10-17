class Bookmark {
    /**
     *
     * @param {string} firstTitle
     * @param {string} secondTitle
     * @param {string} url
     * @param {string} comment
     */
    constructor(firstTitle, secondTitle, url, comment) {
        this.firstTitle = firstTitle;
        this.secondTitle = secondTitle;
        this.url = url;
        this.comment = comment;
    }
}

module.exports = Bookmark;