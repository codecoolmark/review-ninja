import { filterTree } from './files.js'
import { lintFiles } from './linter.js'

export const checkProject = async (options) => {
    const filesToCheck = await findFilesToCheck(options)
    const lintErrors = await lintFiles(options, filesToCheck)
    const results = groupResults(lintErrors)
    return results
}

const findFilesToCheck = async (options) => {
    const files = await filterTree(options.projectPath, 
        (fullPath, file) => file.name.endsWith('.js') && !fullPath.startsWith('node_modules'))
    return files
}

const groupResults = (results) => {
    const occurenciesByResultType = {}

    results.forEach(result => {
        if (!occurenciesByResultType[result.resultType]) {
            occurenciesByResultType[result.resultType] = []
        }

        occurenciesByResultType[result.resultType].push(result)
    })

    return occurenciesByResultType
}


