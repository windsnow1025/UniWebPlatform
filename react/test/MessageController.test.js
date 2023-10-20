import { MessageController } from '../src/controller/MessageController';

function setupDocumentBody() {
    document.body.innerHTML = `
    <div name="message_div">
        <div class="message_div">
            <select name="role" title="role">
                <option value="user">user</option>
                <option value="assistant">assistant</option>
                <option value="system">system</option>
            </select>
            <div class="Flex-space-between">
                <div class="inFlex-FillSpace">
                    <div name="content" class="markdown-body" style="margin: 8px; padding: 8px; min-height: 24px;" contenteditable="plaintext-only"></div>
                </div>
                <div class="Flex-Column inFlex-flex-end">
                    <i name="copy_button" class="fa fa-copy" style="margin: 4px" title="Copy"></i>
                    <i name="delete_button" class="fa fa-minus-circle" style="margin: 4px" title="Delete"></i>
                </div>
            </div>
        </div>
        <div name="add_button_div" class="Flex-space-between">
            <div class="inFlex-FillSpace">
            </div>
            <div class="Flex-Column inFlex-flex-end">
                <i name="add_button" class="fa fa-plus-circle" title="Add"></i>
            </div>    
        </div>
    </div>
    `;
    return document.querySelector('div[name="message_div"]');
}

describe('MessageController', () => {
    let messageDiv;

    beforeEach(() => {
        // Set up the document body before each test
        messageDiv = setupDocumentBody();
    });

    test('should initialize with given role and content', () => {
        // Here we're testing the initial state of the controller.
        const controller = new MessageController('user', 'Hello, world!', messageDiv);

        // Check if the model has been initialized correctly
        expect(controller.model.role).toBe('user');
        expect(controller.model.content).toBe('Hello, world!');

        // Check if the view renders the initial state correctly
        // (this assumes that your render method sets some visible aspect of the view)
        expect(messageDiv.querySelector('select[name="role"]').value).toBe('user');
        expect(messageDiv.querySelector('div[name="content"]').innerHTML).toBe('Hello, world!');
    });
});
