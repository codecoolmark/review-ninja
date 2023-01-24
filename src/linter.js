import { ESLint } from "eslint"

export const lintFiles = (options, files) => {
    const linter = new ESLint({
        useEslintrc: false, 
        baseConfig: {
            extends: "eslint:recommended",
            plugins: ['custom-rules'],
            rules: {
                'custom-rules/consistent-semicolons': 'error'
            },
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
        },
        plugins: {
            'custom-rules':  {
                rules: {
                    'consistent-semicolons': {
                        meta: {
                            type: 'error'
                        },
                        create: (context) => { 
                            let usesSemicolons = false
                            const sourceCode = context.getSourceCode()
                            let missingSemicolons = false

                            const isSemicolon = (token) => token.type === 'Punctuator' && token?.value === ';'
                            const endsWithSemicolon = (node) => isSemicolon(sourceCode.getLastToken(node))
                            
                            return {
                                'Program': function(node) {
                                    usesSemicolons = node.tokens.some(isSemicolon)
                                },
                                'onCodePathEnd': function(codePath, node) {
                                    if (node.type === 'Program') {
                                        if (usesSemicolons && missingSemicolons) {
                                            context.report({
                                                node: node, 
                                                message: 'inconsistent use of semicolons',
                                            })                                            
                                        }
                                    }
                                },
                                'ExpressionStatement, BlockStatement > VariableDeclaration': function(node) {
                                    missingSemicolons = missingSemicolons || !endsWithSemicolon(node)
                                }
                            }
                        }
                    }
                }
            }
        }
    })

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