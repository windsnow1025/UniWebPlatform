import '../src/config.js';
import { expect } from 'chai';
import sinon from 'sinon';
import ConversationDAO from '../src/dao/ConversationDAO.js';
import DatabaseConnection from '../src/db/DatabaseConnection.js';

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
      const stub = sinon.stub(DatabaseConnection, 'poolQuery').resolves();

      await ConversationDAO.insert(mockConversation);

      expect(stub.calledOnce).to.be.true;
      expect(stub.calledWith(sinon.match.string, [
        mockConversation.user_id,
        mockConversation.name,
        mockConversation.conversation
      ])).to.be.true;

      stub.restore();
    });
  });

  // Additional tests...
});
