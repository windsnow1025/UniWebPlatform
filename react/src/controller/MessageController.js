import { MessageModel } from '../model/MessageModel.js';
import { MessageView } from '../view/MessageView.js';

export class MessageController {
    constructor(role, content, message_div) {
        this.model = new MessageModel(role, content);
        this.view = new MessageView();

        this.view.init(message_div);

        this.view.bindRoleChange(this.onRoleChange.bind(this));
        this.view.bindContentFocus(this.onContentFocus.bind(this));
        this.view.bindContentBlur(this.onContentBlur.bind(this));

        this.view.render({ role: this.model.role, content: this.model.content });
    }

    onRoleChange(role) {
        // View -> Model
        this.model.role = role;
    }

    onContentFocus() {
        // Model -> View
        this.view.render({ content: this.model.content, parseContent: false });
    }

    onContentBlur(content) {
        // View -> Model
        this.model.content = content;
        // Model -> View
        this.view.render({ content: this.model.content });
    }

}
