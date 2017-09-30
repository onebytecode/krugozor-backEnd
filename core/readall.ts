import * as fs from 'fs'
const sourceDirname = __dirname + '/src'
const distDirname   = __dirname + '/dist'

const result = fs.readdirSync(sourceDirname)

interface FileStorage {
    name: string 
    path: string 
}

let files: Array<FileStorage> = new Array();

const analyzeDirRecursively = (dirname: string) => {
    const result = fs.readdirSync(dirname)
    if (result.length === 0) return 
    const _files: Array<FileStorage> = result.map(filename => filterFiles(filename, dirname))
    const directories = result.filter(filename => {
        const __tmpfile = dirname + `/${filename}`
        return fs.lstatSync(__tmpfile).isDirectory()
    })
    files = files.concat(_files).filter(__fn => __fn)
    directories.forEach(__dir => {
        analyzeDirRecursively(dirname + `/${__dir}`)
    })
}

const filterFiles = (filename: string, dirname: string) : FileStorage => {
    const __tmpfile = dirname + `/${filename}`
    const isFile = fs.lstatSync(__tmpfile).isFile()
    const isTS   = /\.ts/.test(filename)
    if (isFile && !isTS) {
        const __result = {
            name: filename,
            path: dirname 
        }
        return __result 
    }
}

const trimDirname = (arr: Array<FileStorage>, root: string) : Array<FileStorage> => {
    const rootLength: number = root.length 
    const result = arr.map(__fs => {
        __fs.path = __fs.path.substring(rootLength)
        return __fs
    })

    return result
}

const compileFiles = (arr: Array<FileStorage>) => {
    arr.forEach(__el => {
        const relFile = __el.path + '/' + __el.name
        const nFile = sourceDirname + relFile
        const sFile = distDirname + relFile 
        const rStream = fs.createReadStream(nFile)
        const wStream = fs.createWriteStream(sFile)
        rStream.pipe(wStream)
    })
}

analyzeDirRecursively(sourceDirname)
const nArr = trimDirname(files, sourceDirname)
compileFiles(nArr)

