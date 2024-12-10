/// <reference types="vitest" />
import mergeWith from 'lodash-es/mergeWith.js';
import { resolve } from 'path';
import {
  defineConfig,
  type AliasOptions as ViteAliasOptions,
  type UserConfig as ViteConfig,
} from 'vite';
import dts from 'vite-plugin-dts';
import { copyProtectedPackagesPlugin } from './copyPlugin';
import { getShortName } from './package';
import { readPackageJson } from './packageJson';
import { listRegisteredPackages } from './packageRegistry';

// re-export to prevent making TypeScript angry from re-alias
export type { ViteConfig };

export interface PackageViteConfig extends ViteConfig {
  iotAppKitPackage: {
    /**
     * Specify the name of the directory containing the package.
     *
     * @example __dirname
     */
    dirname: string;
  };
}

/**
 * Use and extend the default iot-app-kit Vite configuration.
 *
 * // TODO: Document issue with importing TypeScript code
 * // from different a monorepo package into vite.config.ts.
 */
export function definePackageConfig(
  /**
   * Define package-specific Vite config settings to recursively merge with the
   * base configuration.
   */
  { iotAppKitPackage: { dirname }, ...customViteConfig }: PackageViteConfig
): ViteConfig {
  const packageJson = readPackageJson(resolve(dirname, './package.json'));

  const allPackages = listRegisteredPackages();
  const protectedPackages = listRegisteredPackages({
    filter: { scope: 'protected' },
  });

  const packageAliases = protectedPackages.reduce<ViteAliasOptions>(
    (acc, protectedPackage) => {
      const protectedPackageShortName = getShortName(protectedPackage.name);

      return {
        ...acc,
        [protectedPackage.name]: resolve(
          dirname,
          `../${protectedPackageShortName}/src`
        ),
      } satisfies ViteAliasOptions;
    },
    {}
  );

  // Package-specific configuration is recursively merged with the base
  // configuration defined here to provide packages flexibility in their
  // build process within the constraints defined by the library.
  const mergedConfig = mergeWith(
    customViteConfig,
    {
      resolve: {
        // Provide Vite the location of the source code of protected packages
        // during development. This allows the compiler to optimize the import
        // and transformation of shared packaged during development activities,
        // such as unit testing and running Storybook, when the source code is
        // used directly.
        alias: { ...packageAliases },

        // Provide Vite the flag used to signal it source reference the source
        // code of dependent packages directly during development. The flag is
        // also utilized in a package's package.json file to configure the
        // `exports` setting to point to the source code during development, or
        // the dist otherwise. This flag is additionally referenced in the base
        // tsconfig.json used by all packages (i.e., tsconfig.base.json) to
        // "activate" the flag during development.
        conditions: ['@iot-app-kit/development'],
      },

      test: {
        // Vitest must know the location of any aliases
        alias: { ...packageAliases },
        // performance optimization
        pool: 'threads',
        // It is recommended to colocate Vitest tests with the source code.
        include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        // Do not require vitest to be imported into test files
        globals: true,
        // Do not process CSS files for tests.
        css: false,
        // Use happy-dom over jsdom for faster unit tests.
        environment: 'happy-dom',
        setupFiles: ['jest-extended/all'],
      },

      build: {
        // Every package should be built into a `dist` directory contained
        // within the package being built.
        outDir: 'dist',
        // Use library setting to avoid optimizations meant for applications.
        lib: {
          // Every package should define a root index file at the defined
          // location.
          //
          // TODO: Enable packages to expose multiple entry points to enable
          // consumers, including ourselves, to effectively perform
          // code-splitting.
          entry: './src/index.ts',
        },
        // Vite does not respect the sourceMap setting defined in
        // tsconfig.json.
        sourcemap: true,
        rollupOptions: {
          // We bundle both ESM and CJS modules to ensure the maximum
          // compatability with the majority of build tools and runtimes.
          output: [
            {
              dir: 'dist/esm',
              format: 'esm',
              // The directory and file structure is preserved during
              // transpilation, instead of bundling the code into a single
              // file. Some build tools are not able to effectively tree-shake
              // unused library code when it is bundled into a single file.
              // This results in the bundle size of the consumer being larger
              // then necessary. By not bundling our code, the consumer is
              // more in control of what they bundle from our library.
              preserveModules: true,
              preserveModulesRoot: 'src',
              // Retain the actual name of the file during transpilation.
              entryFileNames: '[name].js',
            },
            {
              dir: 'dist/cjs',
              format: 'cjs',
              preserveModules: true,
              preserveModulesRoot: 'src',
              entryFileNames: '[name].cjs.js',
            },
          ],
          external: [
            // Prevent node_modules from being compiled and included in the
            // the package's dist.
            /node_modules/,

            // Prevent the package from compiling the source code of aliased
            // protected packages.
            ...allPackages.map(({ name }) => name),
          ],
        },
      },

      plugins: [
        // Vite doesn't generate declaration files automatically and does not
        // care about what's defined in the package.json. we need to use a
        // plugin to generate the types.
        dts({
          tsconfigPath: resolve(dirname, './tsconfig.json'),
          // The dts plugin does use all of the settings of the tsconfig.json
          // file it is using to build the declaration files. The following
          // options need to be set to be set. Consistency across packages
          // enables us to avoid package-specific configuration of these
          // options.
          include: ['src'],
          outDir: ['dist/esm', 'dist/cjs'],
          // All of the code being distributed by a package should be contained
          // within the package's `src` directory.
          exclude: [
            './src/**/*.spec.*',
            './src/**/*.test.*',
            './src/**/__mocks__',
          ],
        }),
        copyProtectedPackagesPlugin({ dir: dirname, packageJson }),
      ],
    } satisfies ViteConfig,
    // _.merge does not concat arrays, so we use _.mergeWith instead with a
    // custom resolver.
    (baseConfigValue: unknown, customConfigValue: unknown) => {
      if (Array.isArray(baseConfigValue)) {
        return baseConfigValue.concat(customConfigValue);
      }
    }
  );

  return defineConfig(mergedConfig);
}
