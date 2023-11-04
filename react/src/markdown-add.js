import { applyTheme } from "./theme.js";
const theme = localStorage.getItem("theme");
applyTheme(theme);


import '/public/css/markdown.css';
import {Markdown} from "./class/markdown";
import {parseMarkdown} from "./parse";

const markdown = new Markdown(null);

const markdown_div = document.querySelector('#markdown-div');

const edit_button = document.querySelector('#edit-button');
const confirm_button = document.querySelector('#confirm-button');
const add_button = document.querySelector('#add-button');

edit_button.addEventListener('click', () => {
    markdown_div.innerHTML = markdown.content;

    markdown_div.contentEditable = "plaintext-only";
    edit_button.classList.add('hide');
    confirm_button.classList.remove('hide');
});
confirm_button.addEventListener('click', () => {
    markdown.content = markdown_div.innerHTML;
    markdown_div.innerHTML = parseMarkdown(markdown.content);

    markdown_div.contentEditable = false;
    edit_button.classList.remove('hide');
    confirm_button.classList.add('hide');
});
add_button.addEventListener('click', async () => {
    await markdown.addMarkdown();
});