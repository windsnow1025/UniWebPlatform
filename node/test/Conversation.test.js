require('../src/config.js');
const ConversationDAO = require('../src/dao/ConversationDAO.js');
const DatabaseConnection = require('../src/db/DatabaseConnection.js');

describe('ConversationDAO', () => {
  describe('insert()', () => {
    it('should insert a conversation', async () => {
      const mockConversation = {
        user_id: 1,
        name: 'Test',
        conversation: JSON.stringify([
          { role: 'user', content: 'Say this is a test.' },
          { role: 'assistant', content: 'This is a test.' }
        ])
      };

      // Jest mocking
      const mockPoolQuery = jest.spyOn(DatabaseConnection, 'poolQuery');
      mockPoolQuery.mockResolvedValue();

      await ConversationDAO.insert(mockConversation);

      expect(mockPoolQuery).toHaveBeenCalledTimes(1);
      expect(mockPoolQuery).toHaveBeenCalledWith(
        expect.any(String),
        [
          mockConversation.user_id,
          mockConversation.name,
          mockConversation.conversation
        ]
      );

      mockPoolQuery.mockRestore();
    });
  });

  // Additional tests...
});
