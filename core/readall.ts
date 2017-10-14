import * as fs from 'fs'
const sourceDirname = __dirname + '/src'
const distDirname   = __dirname + '/dist'

const result = fs.readdirSync(sourceDirname)

interface FileStorage {
    name: string 
    path: string 
}

let files: Array<FileStorage> = new Array();

export const analyseDirRecursively = (dirname: string, include?: RegExp): Array<FileStorage> => {

    const result : Array<FileStorage> = new Array()
    if (!include) include = /.+/
    const filenames = fs.readdirSync(dirname)
    const files = filenames.filter(fName => {
        const __relFilename = `${dirname}/${fName}`
        const isFile = fs.lstatSync(__relFilename).isFile()
        const isTS   = /\.ts/.test(fName)
        const isSpec = include.test(fName)
        if (isFile && !isTS && isSpec) {
            result.push({
                name: fName,
                path: dirname 
            })
        }
    })
    const directories = filenames.filter(fName => {
        const __relFilename = `${dirname}/${fName}`
        return fs.lstatSync(__relFilename).isDirectory()
    })

    directories.forEach(__dir => {
        const __tmpDir = dirname + `/${__dir}`
        const __res = analyseDirRecursively(__tmpDir)
        if (!__res[0]) return 
        __res.forEach(r => result.push(r))
    })

    return result 
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

export const trimDirname = (arr: Array<FileStorage>, root: string) : Array<FileStorage> => {
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

const fArr = analyseDirRecursively(sourceDirname)
const nArr = trimDirname(fArr, sourceDirname)
compileFiles(nArr)

