import { ESLint } from "eslint";

export const lintFiles = (options, files) => {
    const linter = new ESLint({useEslintrc: false, baseConfig: {
        extends: "eslint:recommended",
        parserOptions: {
            files: ['**'],
            sourceType: 'module',
            ecmaVersion: 'latest',
        },
        env: {
            browser: true,
            node: true,
            es6: true
        },
    }})
    return linter.lintFiles(files).then(results => results.flatMap(toResult))
}

const toResult  = (eslintResult) => {
    return eslintResult.messages.map(message => { 
        return { 
            resultType: `eslint:${message.ruleId}`,
            file: eslintResult.filePath,
            message: message.message, 
            line: message.line, 
            column: message.column, 
            endLine: message.endLine, 
            basedOn: message
        }
    })
}