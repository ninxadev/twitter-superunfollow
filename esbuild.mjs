import esbuild from 'esbuild'

async function buildContexts() {
    const contentContext = await esbuild.context({
        entryPoints: ['src/content/main.ts'],
        bundle: true,
        outfile: 'dist/content.js',
        target: 'es2020',
        format: 'iife',
        logLevel: 'debug',
        sourcemap: 'linked',
    })

    const popupContext = await esbuild.context({
        entryPoints: ['src/popup/popup.ts'],
        bundle: true,
        outfile: 'dist/popup.js',
        target: 'es2020',
        format: 'iife',
        logLevel: 'debug',
        sourcemap: 'linked',
    })

    const tempTabContext = await esbuild.context({
        entryPoints: ['src/temp-tab/temp-tab.ts'],
        bundle: true,
        outfile: 'dist/temp-tab.js',
        target: 'es2020',
        format: 'iife',
        logLevel: 'debug',
        sourcemap: 'linked',
    })

    const sandboxContext = await esbuild.context({
        entryPoints: ['src/sandbox/sandbox.ts'],
        bundle: true,
        outfile: 'dist/sandbox.js',
        target: 'es2020',
        format: 'iife',
        logLevel: 'debug',
        sourcemap: 'linked',
    })

    const backgroundContext = await esbuild.context({
        entryPoints: ['src/background/service-worker.ts'],
        bundle: true,
        outfile: 'dist/service-worker.js',
        target: 'es2020',
        format: 'iife',
        logLevel: 'debug',
        sourcemap: 'linked',
    })

    const cssBuild = await esbuild.context({
        entryPoints: ['src/style.css'],
        bundle: true,
        outfile: 'dist/style.css',
        target: 'es2020',
        sourcemap: 'linked',
    })

    const copyContext = await esbuild.context({
        entryPoints: [
            'manifest.json',
            'src/sandbox/sandbox.html',
            'src/popup/popup.html',
            'src/temp-tab/temp-tab.html',
        ],
        bundle: true,
        outdir: 'dist',
        entryNames: '[name]',
        loader: {
            '.json': 'copy',
            '.html': 'copy',
        },
    })

    return [
        contentContext,
        popupContext,
        tempTabContext,
        sandboxContext,
        backgroundContext,
        cssBuild,
        copyContext,
    ]
}

const watchAll = async () => {
    const contexts = await buildContexts()
    await Promise.allSettled(contexts.map((context) => context.watch()))
}

const rebuildAll = async () => {
    const contexts = await buildContexts()
    await Promise.allSettled(contexts.map((context) => context.rebuild()))
}

const disposeAll = async () => {
    const contexts = await buildContexts()
    await Promise.allSettled(contexts.map((context) => context.dispose()))
}

// const watchAll = async () => {
//     await contentContext.watch()
//     await popupContext.watch()
//     await tempTabContext.watch()
//     await sandboxContext.watch()
//     await backgroundContext.watch()
//     await cssBuild.watch()
//     await copyContext.watch()
// }

// const rebuildAll = async () => {
//     await contentContext.rebuild()
//     await popupContext.rebuild()
//     await sandboxContext.rebuild()
//     await backgroundContext.rebuild()
//     await cssBuild.rebuild()
//     await copyContext.rebuild()
// }

// const disposeAll = async () => {
//     await contentContext.dispose()
//     await sandboxContext.dispose()
//     await popupContext.dispose()
//     await backgroundContext.dispose()
//     await cssBuild.dispose()
//     await copyContext.dispose()
// }

try {
    if (process.argv.includes('--watch')) {
        await watchAll()
    } else {
        await rebuildAll()
        await disposeAll()
    }
} catch (e) {
    console.error(e)
    await disposeAll()
    process.exit(1)
}
