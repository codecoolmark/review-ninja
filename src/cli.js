import { Command } from 'commander'
import { checkProject } from './app.js';
import mustache from 'mustache';

const commandline = new Command()

const formatResult = ([type, messages]) => {
    const fileLinkTemplate = '{{{file}}}:{{line}}:{{column}}'
    const maxFileLinkLength = Math.max(0, ...messages.map(msg => mustache.render(fileLinkTemplate, msg).length))
    const pad = () => (text, render) => {
        if (text === '{{> fileLink}}') {
            return render(text).padEnd(maxFileLinkLength, ' ')
        }
        return render(text)
    }
    const viewData = {type, messages, pad}
    const template = `{{type}}: found {{messages.length}} occurences
    {{#messages}}
    {{#pad}}{{> fileLink}}{{/pad}} {{{message}}}
    {{/messages}}`
    return mustache.render(template, viewData, {fileLink: fileLinkTemplate})
}

commandline
    .argument('<path to repository>', 'Path to the students repository')
    .action(repoPath => {
        checkProject({projectPath: repoPath})
            .then(results => Object.entries(results).sort(([, messagesA], [, messagesB]) => messagesB.length - messagesA.length).map(formatResult))
            .then(lines => lines.forEach(line => console.log(line)))
    });
commandline.parse()