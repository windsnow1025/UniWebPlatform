import { applyTheme } from "../manager/ThemeManager.js";
const theme = localStorage.getItem("theme");
applyTheme(theme);


import '/public/css/markdown.css';
import {MarkdownService} from "../service/MarkdownService";
import {parseLaTeX, parseMarkdown} from "../util/MarkdownParser";

const id = new URLSearchParams(window.location.search).get('id');

const markdown = new MarkdownService(id);

const markdown_div = document.querySelector('#markdown-div');

await markdown.fetchMarkdown();
document.title = markdown.title;
markdown_div.innerHTML = parseMarkdown(markdown.content);

const edit_button = document.querySelector('#edit-button');
const confirm_button = document.querySelector('#confirm-button');
const update_button = document.querySelector('#update-button');
const delete_button = document.querySelector('#delete-button');

edit_button.addEventListener('click', () => {
    markdown_div.innerHTML = markdown.content;

    markdown_div.contentEditable = "plaintext-only";
    edit_button.classList.add('hide');
    confirm_button.classList.remove('hide');
});
confirm_button.addEventListener('click', () => {
    markdown.content = markdown_div.innerHTML;
    markdown_div.innerHTML = parseMarkdown(markdown.content);
    parseLaTeX(markdown_div);

    markdown_div.contentEditable = false;
    edit_button.classList.remove('hide');
    confirm_button.classList.add('hide');
});
update_button.addEventListener('click', async () => {
    await markdown.updateMarkdown();
});
delete_button.addEventListener('click', async () => {
    await markdown.deleteMarkdown();
});