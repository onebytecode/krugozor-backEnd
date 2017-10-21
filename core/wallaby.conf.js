module.exports = (wallaby) => {
    return {
        tests: [
            '**/*.spec.ts'
        ],
        compilers: {
            '**/*.spec.ts': wallaby.compilers.babel()
        }
    }
}