const test_div = document.getElementById("test");

let decodeEntitiesInParsedCode = function(html) {
    return html.replace(/<code([^>]*)>((?:[^<]+|<(?!\/code>))+)<\/code>/g, function(match, p1, p2) {
        return '<code' + p1 + '>' + p2.replace(/&amp;/g, "&") + '</code>';
    });
}

const parsedContent = marked.parse(content);
console.log(parsedContent);
const decodedContent = decodeEntitiesInParsedCode(parsedContent);
console.log(decodedContent);
test_div.innerHTML = decodedContent;
