import { MessageController } from '../src/controller/MessageController';
import { JSDOM } from 'jsdom';

const dom = new JSDOM();
global.document = dom.window.document;

describe('MessageController initialization', () => {
    let messageContainer;
    beforeEach(() => {
        messageContainer = document.createElement('div');
        messageContainer.innerHTML = `
      <select name="role"></select>
      <div name="content"></div>
    `;
    });

    test('initializes MessageModel correctly', () => {
        const role = 'user';
        const content = 'Hello';

        const messageController = new MessageController(role, content, messageContainer);

        expect(messageController.model.role).toBe(role);
        expect(messageController.model.content).toBe(content);
    });

});
