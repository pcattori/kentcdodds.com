import {unstable_vitePlugin as remix} from '@remix-run/dev'
import {createLogger, defineConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import {flatRoutes} from 'remix-flat-routes'

export default defineConfig(() => {
  return {
    customLogger: customLogger(),
    plugins: [
      remix({
        ignoredRouteFiles: ['**/*'],
        routes: async defineRoutes => {
          return flatRoutes('routes', defineRoutes, {
            ignoredRouteFiles: [
              '.*',
              '**/*.css',
              '**/*.test.{js,jsx,ts,tsx}',
              '**/__*.*',
            ],
          })
        },
      }),
      tsconfigPaths(),
    ],
    build: {
      rollupOptions: {
        external: [/node:.*/, 'stream', 'crypto'],
      },
    },
  }
})

function customLogger() {
  const logger = createLogger()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const loggerWarn = logger.warn

  const dotServerDynamicImportRE =
    /\.server.*is dynamically imported by.*but also statically imported by/

  logger.warn = (msg, options) => {
    if (dotServerDynamicImportRE.test(msg)) return
    loggerWarn(msg, options)
  }
  return logger
}
