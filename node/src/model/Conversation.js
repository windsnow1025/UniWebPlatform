/**
 * @typedef {Object} ConversationMessage
 * @property {string} role
 * @property {string} content
 */

/**
 * @typedef {Object} ConversationParams
 * @property {number || null} id
 * @property {number} user_id
 * @property {string} name
 * @property {ConversationMessage[]} messages
 */

class Conversation {
  /**
   * @param {ConversationParams} params
   */
  constructor({ id = null, user_id, name, messages = null }) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
    this.messages = messages;
  }
}

export default Conversation;