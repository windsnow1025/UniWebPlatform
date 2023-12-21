/**
 * @typedef {Object} ConversationParams
 * @property {number} id
 * @property {number} user_id
 * @property {string} name
 * @property {string} conversation
 */

class Conversation {
  /**
   * @param {ConversationParams} params
   */
  constructor({ id = null, user_id, name, conversation }) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
    this.conversation = conversation;
  }
}

module.exports = Conversation;