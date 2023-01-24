import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

export const filterTree = (path, predicate) => {
   return readdir(path, {withFileTypes: true})
    .then(files => Promise.all(files
            .filter(file => predicate(join(path, file.name), file) || file.isDirectory())
            .map(file => { 
                if (file.isDirectory()) {
                    return filterTree(join(path, file.name), predicate, join(path, file.name))
                }
                return Promise.resolve([join(path, file.name)])
    }))
    .then(listOfLists => listOfLists.flatMap(list => list)))
}