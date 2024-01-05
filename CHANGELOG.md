# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [18.0.0](https://github.com/yargs/yargs/compare/v17.7.2...v18.0.0) (2024-01-05)


### ⚠ BREAKING CHANGES

* **node:** require Node >= 16.15.1

### Features

* **locale:** adds hebrew translation ([#2357](https://github.com/yargs/yargs/issues/2357)) ([4266485](https://github.com/yargs/yargs/commit/4266485b20e9b0f3a7f196e84c6d8284b04642cd))


### Bug Fixes

* **build:** update typescript / eslint / rollup deps fixing bundling of yargs ([#2384](https://github.com/yargs/yargs/issues/2384)) ([d92984d](https://github.com/yargs/yargs/commit/d92984def0442b247848e3527527f35f1a2abbbe))
* coerce should play well with parser configuration ([#2308](https://github.com/yargs/yargs/issues/2308)) ([8343c66](https://github.com/yargs/yargs/commit/8343c66eac10fbe60e85fc17adfe07eadd45cb35))
* exit after async handler done ([#2313](https://github.com/yargs/yargs/issues/2313)) ([e326cde](https://github.com/yargs/yargs/commit/e326cde53173e82407bf5e79cfdd58a199bcb909))


### Build System

* **node:** require Node &gt;= 16.15.1 ([d92984d](https://github.com/yargs/yargs/commit/d92984def0442b247848e3527527f35f1a2abbbe))

## [17.7.2](https://github.com/yargs/yargs/compare/v17.7.1...v17.7.2) (2023-04-27)


### Bug Fixes

* do not crash completion when having negated options ([#2322](https://github.com/yargs/yargs/issues/2322)) ([7f42848](https://github.com/yargs/yargs/commit/7f428485e75e9b1b0db1320216d1c31469770563))

## [17.7.1](https://github.com/yargs/yargs/compare/v17.7.0...v17.7.1) (2023-02-21)


### Bug Fixes

* address display bug with default sub-commands ([#2303](https://github.com/yargs/yargs/issues/2303)) ([9aa2490](https://github.com/yargs/yargs/commit/9aa24908ae4e857161d5084613a402f9dc4895a7))

## [17.7.0](https://github.com/yargs/yargs/compare/v17.6.2...v17.7.0) (2023-02-13)


### Features

* add method to hide option extras ([#2156](https://github.com/yargs/yargs/issues/2156)) ([2c144c4](https://github.com/yargs/yargs/commit/2c144c4ea534646df26d6177f73ce917105c6c09))
* convert line break to whitespace for the description of the option ([#2271](https://github.com/yargs/yargs/issues/2271)) ([4cb41dc](https://github.com/yargs/yargs/commit/4cb41dc80aaa730a2abd15bd3118ecd9f4ebe876))


### Bug Fixes

* copy the description of the option to its alias in completion ([#2269](https://github.com/yargs/yargs/issues/2269)) ([f37ee6f](https://github.com/yargs/yargs/commit/f37ee6f7da386a1244bf0a0c21b9572f2bb3131b))

## [17.6.2](https://github.com/yargs/yargs/compare/v17.6.1...v17.6.2) (2022-11-03)


### Bug Fixes

* **deps:** update dependency yargs-parser to v21.1.1 ([#2231](https://github.com/yargs/yargs/issues/2231)) ([75b4d52](https://github.com/yargs/yargs/commit/75b4d5222f8f0152790b9ca0718fa5314c9a1c6b))
* **lang:** typo in Finnish unknown argument singular form ([#2222](https://github.com/yargs/yargs/issues/2222)) ([a6dfd0a](https://github.com/yargs/yargs/commit/a6dfd0a8f7f2c58a2e8b7dde0142cc1a12c4e027))

## [17.6.1](https://github.com/yargs/yargs/compare/v17.6.0...v17.6.1) (2022-11-02)


### Bug Fixes

* **lang:** fix "Not enough non-option arguments" message for the Czech language ([#2242](https://github.com/yargs/yargs/issues/2242)) ([3987b13](https://github.com/yargs/yargs/commit/3987b13e31f669d79836cc6ed84105e9be0f9482))

## [17.6.0](https://github.com/yargs/yargs/compare/v17.5.1...v17.6.0) (2022-10-01)


### Features

* **lang:** Czech locale ([#2220](https://github.com/yargs/yargs/issues/2220)) ([5895cf1](https://github.com/yargs/yargs/commit/5895cf1ba1dcd5158d284d0c589f5f0caff8b739))
* **usage:** add YARGS_DISABLE_WRAP env variable to disable wrap ([#2210](https://github.com/yargs/yargs/issues/2210)) ([b680ace](https://github.com/yargs/yargs/commit/b680ace2994dcf14d1a1a928aefd3fe8006b2198))


### Bug Fixes

* **deno:** use 'globalThis' instead of 'window' ([#2186](https://github.com/yargs/yargs/issues/2186)) ([#2215](https://github.com/yargs/yargs/issues/2215)) ([561fc7a](https://github.com/yargs/yargs/commit/561fc7a787228b226e0ba76ab674456cbd30cd37))
* **deps:** cliui with forced strip-ansi update ([#2241](https://github.com/yargs/yargs/issues/2241)) ([38e8df1](https://github.com/yargs/yargs/commit/38e8df10f0f020ae794329610354521f8458fc41))
* dont clobber description for multiple option calls ([#2171](https://github.com/yargs/yargs/issues/2171)) ([f91d9b3](https://github.com/yargs/yargs/commit/f91d9b334ad9cfce79a89c08ff210c622b7c528f))
* **typescript:** address warning with objectKeys ([394f5f8](https://github.com/yargs/yargs/commit/394f5f86d15a9bb319276518d36cb560d7cb6322))

### [17.5.1](https://github.com/yargs/yargs/compare/v17.5.0...v17.5.1) (2022-05-16)


### Bug Fixes

* add missing entries to published files ([#2185](https://github.com/yargs/yargs/issues/2185)) ([5685382](https://github.com/yargs/yargs/commit/5685382d18dc05f2ec66098d90ab16f31b622753))
* address bug when strict and async middleware used together ([#2164](https://github.com/yargs/yargs/issues/2164)) ([cbc2eb7](https://github.com/yargs/yargs/commit/cbc2eb726efc1d688ad484e8cbe4d233b212a046))
* **completion:** correct zsh installation instructions ([22e9af2](https://github.com/yargs/yargs/commit/22e9af28bb7a7101aeeac80b5bfd0c18f7e6226f))
* handle multiple node_modules folders determining mainFilename for ESM ([#2123](https://github.com/yargs/yargs/issues/2123)) ([e0823dd](https://github.com/yargs/yargs/commit/e0823dd7e6ced7eaf1d7d1e67f77374f4ef5cbce))
* **lang:** add missing terms to Russian translation ([#2181](https://github.com/yargs/yargs/issues/2181)) ([1c331f2](https://github.com/yargs/yargs/commit/1c331f22c71496e3d50cf103a1b21f4a05d97aac))
* prevent infinite loop with empty locale ([#2179](https://github.com/yargs/yargs/issues/2179)) ([b672e70](https://github.com/yargs/yargs/commit/b672e709e4fc45f50d77f54e42025a5fa7c66a42))
* veriadic arguments override array provided in config (the same as multiple dash arguments). ([4dac5b8](https://github.com/yargs/yargs/commit/4dac5b8c2f03488c31d40f075075d2ac43134412))

## [17.5.0](https://github.com/yargs/yargs/compare/v17.4.1...v17.5.0) (2022-05-11)


### Features

* add browser.d.ts and check for existence of Error.captureStackTrace() ([#2144](https://github.com/yargs/yargs/issues/2144)) ([6192990](https://github.com/yargs/yargs/commit/6192990509cf793c4b10b88884d626893dee89df))


### Bug Fixes

* **completion:** support for default flags ([db35423](https://github.com/yargs/yargs/commit/db354232705623bbcd8fad362f6a4d6d59650be5))
* import yargs/yargs in esm projects ([#2151](https://github.com/yargs/yargs/issues/2151)) ([95aed1c](https://github.com/yargs/yargs/commit/95aed1c175ec82e585003883bda1b6b75d5493ce))

### [17.4.1](https://github.com/yargs/yargs/compare/v17.4.0...v17.4.1) (2022-04-09)


### Bug Fixes

* coerce pollutes argv ([#2161](https://github.com/yargs/yargs/issues/2161)) ([2d1136d](https://github.com/yargs/yargs/commit/2d1136d303ea805685a973ded62f52efd49b78b9))
* **completion:** don't show positional args choices with option choices ([#2148](https://github.com/yargs/yargs/issues/2148)) ([b58b5bc](https://github.com/yargs/yargs/commit/b58b5bc2cda7fc15acf559ae4a6a0eda0be06044))
* hide hidden options from completion ([#2143](https://github.com/yargs/yargs/issues/2143)) ([e086dfa](https://github.com/yargs/yargs/commit/e086dfad7ff11956b1e8779c00cf2351a4cc3b03)), closes [#2142](https://github.com/yargs/yargs/issues/2142)
* show message when showHelpOnFail is chained globally ([#2154](https://github.com/yargs/yargs/issues/2154)) ([ad9fcac](https://github.com/yargs/yargs/commit/ad9fcacb001a7eb842924408f3a06865a7c7a3b6))

## [17.4.0](https://github.com/yargs/yargs/compare/v17.3.1...v17.4.0) (2022-03-19)


### Features

* **completion:** choices will now work for all possible aliases of an option and not just the default long option ([30edd50](https://github.com/yargs/yargs/commit/30edd5067111b2b59387dcc47f4e7af93b9054f3))
* **completion:** positional arguments completion ([#2090](https://github.com/yargs/yargs/issues/2090)) ([00e4ebb](https://github.com/yargs/yargs/commit/00e4ebbe3acd438e73fdb101e75b4f879eb6d345))


### Bug Fixes

* **completion:** changed the check for option arguments to match options that begin with '-', instead of '--', to include short options ([30edd50](https://github.com/yargs/yargs/commit/30edd5067111b2b59387dcc47f4e7af93b9054f3))
* **completion:** fix for completions that contain non-leading hyphens ([30edd50](https://github.com/yargs/yargs/commit/30edd5067111b2b59387dcc47f4e7af93b9054f3))
* failed command usage string is missing arg descriptions and optional args ([#2105](https://github.com/yargs/yargs/issues/2105)) ([d6e342d](https://github.com/yargs/yargs/commit/d6e342d8ef2c488f438c32770ba2209cf8223342))
* wrap unknown args in quotes ([#2092](https://github.com/yargs/yargs/issues/2092)) ([6a29778](https://github.com/yargs/yargs/commit/6a2977867bd58dbd8bb550f7b0b4c4c298835597))

### [17.3.1](https://github.com/yargs/yargs/compare/v17.3.0...v17.3.1) (2021-12-23)


### Bug Fixes

* **translations:** correct Korean translation ([#2095](https://github.com/yargs/yargs/issues/2095)) ([c7c2b9e](https://github.com/yargs/yargs/commit/c7c2b9eb340754ddac7bdd1687c7951332c5ebba))

## [17.3.0](https://github.com/yargs/yargs/compare/v17.2.1...v17.3.0) (2021-11-30)


### Features

* fallback to default bash completion ([74c0ba5](https://github.com/yargs/yargs/commit/74c0ba5cfcc59afa5538de821fad70e1a76a354e))


### Bug Fixes

* avoid legacy accessors ([#2013](https://github.com/yargs/yargs/issues/2013)) ([adb0d11](https://github.com/yargs/yargs/commit/adb0d11e02c613af3d9427b3028cc192703a3869))
* **deps:** update dependency yargs-parser to v21 ([#2063](https://github.com/yargs/yargs/issues/2063)) ([76c1951](https://github.com/yargs/yargs/commit/76c19518d74ca94c0edcd450e5c0ef9efeee369d))
* don't fail if "fileURLToPath(import.meta.url)" throws ([3a44796](https://github.com/yargs/yargs/commit/3a44796c84e3cb60769841d5883448a396227ade))
* re-add options to check callback ([#2079](https://github.com/yargs/yargs/issues/2079)) ([e75319d](https://github.com/yargs/yargs/commit/e75319d99142a048b0abe9856499730fd4bc004c))

### [17.2.1](https://www.github.com/yargs/yargs/compare/v17.2.0...v17.2.1) (2021-09-25)


### Bug Fixes

* **docs:** stop advertising .argv property ([#2036](https://www.github.com/yargs/yargs/issues/2036)) ([4f5ecc1](https://www.github.com/yargs/yargs/commit/4f5ecc1427ed6c83f23ea90ee6da75ce0c332f7a)), closes [#2035](https://www.github.com/yargs/yargs/issues/2035)

## [17.2.0](https://www.github.com/yargs/yargs/compare/v17.1.1...v17.2.0) (2021-09-23)


### Features

* autocomplete choices for options ([#2018](https://www.github.com/yargs/yargs/issues/2018)) ([01b2c6a](https://www.github.com/yargs/yargs/commit/01b2c6a99167d826d3d1e6f6b94f18382a17d47e))
* **locales:** Added Uzbek translation ([#2024](https://www.github.com/yargs/yargs/issues/2024)) ([ee047b9](https://www.github.com/yargs/yargs/commit/ee047b9cd6260ce90d845e7e687228e617c8a30d))


### Bug Fixes

* boolean option should work with strict ([#1996](https://www.github.com/yargs/yargs/issues/1996)) ([e9379e2](https://www.github.com/yargs/yargs/commit/e9379e27d49820f4db842f22cda6410bbe2bff10))
* cast error types as TypeScript 4.4 infers them as unknown instead of any ([#2016](https://www.github.com/yargs/yargs/issues/2016)) ([01b2c6a](https://www.github.com/yargs/yargs/commit/01b2c6a99167d826d3d1e6f6b94f18382a17d47e))
* conflicts and strip-dashed ([#1998](https://www.github.com/yargs/yargs/issues/1998)) ([59a86fb](https://www.github.com/yargs/yargs/commit/59a86fb83cfeb8533c6dd446c73cf4166cc455f2))
* emit warning on version name collision ([#1986](https://www.github.com/yargs/yargs/issues/1986)) ([d0e8292](https://www.github.com/yargs/yargs/commit/d0e829239580bd44873bbde65de2ed7671aa2ab0))
* help command spacing when scriptName is empty ([#1994](https://www.github.com/yargs/yargs/issues/1994)) ([d33e997](https://www.github.com/yargs/yargs/commit/d33e9972291406490cd8fdad0b3589be234e0f12))

### [17.1.1](https://www.github.com/yargs/yargs/compare/v17.1.0...v17.1.1) (2021-08-13)


### Bug Fixes

* positional array defaults should not be combined with provided values ([#2006](https://www.github.com/yargs/yargs/issues/2006)) ([832222d](https://www.github.com/yargs/yargs/commit/832222d7777da49e5c9da6c5801c2dd90d7fa6a2))

## [17.1.0](https://www.github.com/yargs/yargs/compare/v17.0.1...v17.1.0) (2021-08-04)


### Features

* update Levenshtein to Damerau-Levenshtein ([#1973](https://www.github.com/yargs/yargs/issues/1973)) ([d2c121b](https://www.github.com/yargs/yargs/commit/d2c121b00f2e1eb2ea8cc3a23a5039b3a4425bea))


### Bug Fixes

* coerce middleware should be applied once ([#1978](https://www.github.com/yargs/yargs/issues/1978)) ([14bd6be](https://www.github.com/yargs/yargs/commit/14bd6bebc3027ae929106b20dd198b9dccdeec31))
* implies should not fail when implied key's value is 0, false or empty string ([#1985](https://www.github.com/yargs/yargs/issues/1985)) ([8010472](https://www.github.com/yargs/yargs/commit/80104727d5f2ec4c5b491c1bdec4c94b2db95d9c))
* positionals should not overwrite options ([#1992](https://www.github.com/yargs/yargs/issues/1992)) ([9d84309](https://www.github.com/yargs/yargs/commit/9d84309e53ce1d30b1c61035ed5c78827a89df86))
* strict should fail unknown arguments ([#1977](https://www.github.com/yargs/yargs/issues/1977)) ([c804f0d](https://www.github.com/yargs/yargs/commit/c804f0db78e56b44341cc7a91878c27b1b68b9f2))
* wrap(null) no longer causes strange indentation behavior ([#1988](https://www.github.com/yargs/yargs/issues/1988)) ([e1871aa](https://www.github.com/yargs/yargs/commit/e1871aa792de219b221179417d410931af70d405))

### [17.0.1](https://www.github.com/yargs/yargs/compare/v17.0.0...v17.0.1) (2021-05-03)


### Bug Fixes

* **build:** Node 12 is now minimum version ([#1936](https://www.github.com/yargs/yargs/issues/1936)) ([0924566](https://www.github.com/yargs/yargs/commit/09245666e57facb140e0b45a9e45ca704883e5dd))

## [17.0.0](https://www.github.com/yargs/yargs/compare/v16.2.0...v17.0.0) (2021-05-02)


### ⚠ BREAKING CHANGES

* **node:** drop Node 10 (#1919)
* implicitly private methods are now actually private
* deprecated reset() method is now private (call yargs() instead).
* **yargs-factory:** refactor yargs-factory to use class (#1895)
* .positional() now allowed at root level of yargs.
* **coerce:** coerce is now applied before validation.
* **async:** yargs now returns a promise if async or check are asynchronous.
* **middleware:** global middleware now applied when no command is configured.
* #1823 contains the following breaking API changes:
    * now returns a promise if handler is async.
    * onFinishCommand removed, in favor of being able to await promise.
    * getCompletion now invokes callback with err and `completions, returns promise of completions.

### Features

* add commands alias (similar to options function) ([#1850](https://www.github.com/yargs/yargs/issues/1850)) ([00b74ad](https://www.github.com/yargs/yargs/commit/00b74adcb30ab89b4450ef7105ef1ad32d820ebf))
* add parseSync/parseAsync method ([#1898](https://www.github.com/yargs/yargs/issues/1898)) ([6130ad8](https://www.github.com/yargs/yargs/commit/6130ad89b85dc49e34190e596e14a2fd3e668781))
* add support for `showVersion`, similar to `showHelp` ([#1831](https://www.github.com/yargs/yargs/issues/1831)) ([1a1e2d5](https://www.github.com/yargs/yargs/commit/1a1e2d554dca3566bc174584394419be0120d207))
* adds support for async builder ([#1888](https://www.github.com/yargs/yargs/issues/1888)) ([ade29b8](https://www.github.com/yargs/yargs/commit/ade29b864abecaa8c4f8dcc3493f5eb24fb73d84)), closes [#1042](https://www.github.com/yargs/yargs/issues/1042)
* allow calling standard completion function from custom one ([#1855](https://www.github.com/yargs/yargs/issues/1855)) ([31765cb](https://www.github.com/yargs/yargs/commit/31765cbdce812ee5c16aaae70ab523a2c7e0fcec))
* allow default completion to be referenced and modified, in custom completion ([#1878](https://www.github.com/yargs/yargs/issues/1878)) ([01619f6](https://www.github.com/yargs/yargs/commit/01619f6191a3ab16bf6b77456d4e9dfa80533907))
* **async:** add support for async check and coerce ([#1872](https://www.github.com/yargs/yargs/issues/1872)) ([8b95f57](https://www.github.com/yargs/yargs/commit/8b95f57bb2a49b098c6bf23cea88c6f900a34f89))
* improve support for async/await ([#1823](https://www.github.com/yargs/yargs/issues/1823)) ([169b815](https://www.github.com/yargs/yargs/commit/169b815df7ae190965f04030f28adc3ab92bb4b5))
* **locale:** add Ukrainian locale ([#1893](https://www.github.com/yargs/yargs/issues/1893)) ([c872dfc](https://www.github.com/yargs/yargs/commit/c872dfc1d87ebaa7fcc79801f649318a16195495))
* **middleware:** async middleware can now be used before validation. ([e0f9363](https://www.github.com/yargs/yargs/commit/e0f93636e04fa7e02a2c3b1fe465b6a14aa1f06d))
* **middleware:** global middleware now applied when no command is configured. ([e0f9363](https://www.github.com/yargs/yargs/commit/e0f93636e04fa7e02a2c3b1fe465b6a14aa1f06d))
* **node:** drop Node 10 ([#1919](https://www.github.com/yargs/yargs/issues/1919)) ([5edeb9e](https://www.github.com/yargs/yargs/commit/5edeb9ea17b1f0190a3590508f2e7911b5f70659))


### Bug Fixes

* always cache help message when running commands ([#1865](https://www.github.com/yargs/yargs/issues/1865)) ([d57ca77](https://www.github.com/yargs/yargs/commit/d57ca7751d533d7e0f216cd9fbf7c2b0ec98f791)), closes [#1853](https://www.github.com/yargs/yargs/issues/1853)
* **async:** don't call parse callback until async ops complete ([#1896](https://www.github.com/yargs/yargs/issues/1896)) ([a93f5ff](https://www.github.com/yargs/yargs/commit/a93f5ff35d7c09b01e0ca93d7d855d2b26593165)), closes [#1888](https://www.github.com/yargs/yargs/issues/1888)
* **builder:** apply default builder for showHelp/getHelp ([#1913](https://www.github.com/yargs/yargs/issues/1913)) ([395bb67](https://www.github.com/yargs/yargs/commit/395bb67749787d269cabe80ffc3133c2f6958aeb)), closes [#1912](https://www.github.com/yargs/yargs/issues/1912)
* **builder:** nested builder is now awaited ([#1925](https://www.github.com/yargs/yargs/issues/1925)) ([b5accd6](https://www.github.com/yargs/yargs/commit/b5accd64ccbd3ffb800517fb40d0f59382515fbb))
* **coerce:** options using coerce now displayed in help ([#1911](https://www.github.com/yargs/yargs/issues/1911)) ([d2128cc](https://www.github.com/yargs/yargs/commit/d2128cc4ffd411eed7111e6a3c561948330e4f6f)), closes [#1909](https://www.github.com/yargs/yargs/issues/1909)
* completion script name clashing on bash ([#1903](https://www.github.com/yargs/yargs/issues/1903)) ([8f62d9a](https://www.github.com/yargs/yargs/commit/8f62d9a9e8bebf86f988c100ad3c417dc32b2471))
* **deno:** use actual names for keys instead of inferring ([#1891](https://www.github.com/yargs/yargs/issues/1891)) ([b96ef01](https://www.github.com/yargs/yargs/commit/b96ef01b16bc5377b79d7914dd5495068037fe7b))
* exclude positionals from default completion ([#1881](https://www.github.com/yargs/yargs/issues/1881)) ([0175677](https://www.github.com/yargs/yargs/commit/0175677b79ffe50a9c5477631288ae10120b8a32))
* https://github.com/yargs/yargs/issues/1841#issuecomment-804770453 ([b96ef01](https://www.github.com/yargs/yargs/commit/b96ef01b16bc5377b79d7914dd5495068037fe7b))
* showHelp() and .getHelp() now return same output for commands as --help ([#1826](https://www.github.com/yargs/yargs/issues/1826)) ([36abf26](https://www.github.com/yargs/yargs/commit/36abf26919b5a19f3adec08598539851c34b7086))
* zsh completion is now autoloadable ([#1856](https://www.github.com/yargs/yargs/issues/1856)) ([d731f9f](https://www.github.com/yargs/yargs/commit/d731f9f9adbc11f918e918443c5bff4149fc6681))


### Code Refactoring

* **coerce:** coerce is now applied before validation. ([8b95f57](https://www.github.com/yargs/yargs/commit/8b95f57bb2a49b098c6bf23cea88c6f900a34f89))
* deprecated reset() method is now private (call yargs() instead). ([376f892](https://www.github.com/yargs/yargs/commit/376f89242733dcd4ecb8040685c40ae1d622931d))
* implicitly private methods are now actually private ([376f892](https://www.github.com/yargs/yargs/commit/376f89242733dcd4ecb8040685c40ae1d622931d))
* **yargs-factory:** refactor yargs-factory to use class ([#1895](https://www.github.com/yargs/yargs/issues/1895)) ([376f892](https://www.github.com/yargs/yargs/commit/376f89242733dcd4ecb8040685c40ae1d622931d))

## [16.2.0](https://www.github.com/yargs/yargs/compare/v16.1.1...v16.2.0) (2020-12-05)


### Features

* command() now accepts an array of modules ([f415388](https://www.github.com/yargs/yargs/commit/f415388cc454d02786c65c50dd6c7a0cf9d8b842))


### Bug Fixes

* add package.json to module exports ([#1818](https://www.github.com/yargs/yargs/issues/1818)) ([d783a49](https://www.github.com/yargs/yargs/commit/d783a49a7f21c9bbd4eec2990268f3244c4d5662)), closes [#1817](https://www.github.com/yargs/yargs/issues/1817)

### [16.1.1](https://www.github.com/yargs/yargs/compare/v16.1.0...v16.1.1) (2020-11-15)


### Bug Fixes

* expose helpers for legacy versions of Node.js ([#1801](https://www.github.com/yargs/yargs/issues/1801)) ([107deaa](https://www.github.com/yargs/yargs/commit/107deaa4f68b7bc3f2386041e1f4fe0272b29c0a))
* **deno:** get yargs working on deno@1.5.x ([#1799](https://www.github.com/yargs/yargs/issues/1799)) ([cb01c98](https://www.github.com/yargs/yargs/commit/cb01c98c44e30f55c2dc9434caef524ae433d9a4))

## [16.1.0](https://www.github.com/yargs/yargs/compare/v16.0.3...v16.1.0) (2020-10-15)


### Features

* expose hideBin helper for CJS ([#1768](https://www.github.com/yargs/yargs/issues/1768)) ([63e1173](https://www.github.com/yargs/yargs/commit/63e1173bb47dc651c151973a16ef659082a9ae66))


### Bug Fixes

* **deno:** update types for deno ^1.4.0 ([#1772](https://www.github.com/yargs/yargs/issues/1772)) ([0801752](https://www.github.com/yargs/yargs/commit/080175207d281be63edf90adfe4f0568700b0bf5))
* **exports:** node 13.0-13.6 require a string fallback ([#1776](https://www.github.com/yargs/yargs/issues/1776)) ([b45c43a](https://www.github.com/yargs/yargs/commit/b45c43a5f64b565c3794f9792150eaeec4e00b69))
* **modules:** module path was incorrect ([#1759](https://www.github.com/yargs/yargs/issues/1759)) ([95a4a0a](https://www.github.com/yargs/yargs/commit/95a4a0ac573cfe158e6e4bc8c8682ebd1644a198))
* **positional:** positional strings no longer drop decimals ([#1761](https://www.github.com/yargs/yargs/issues/1761)) ([e1a300f](https://www.github.com/yargs/yargs/commit/e1a300f1293ad821c900284616337f080b207980))
* make positionals in -- count towards validation ([#1752](https://www.github.com/yargs/yargs/issues/1752)) ([eb2b29d](https://www.github.com/yargs/yargs/commit/eb2b29d34f1a41e0fd6c4e841960e5bfc329dc3c))

### [16.0.3](https://www.github.com/yargs/yargs/compare/v16.0.2...v16.0.3) (2020-09-10)


### Bug Fixes

* move yargs.cjs to yargs to fix Node 10 imports ([#1747](https://www.github.com/yargs/yargs/issues/1747)) ([5bfb85b](https://www.github.com/yargs/yargs/commit/5bfb85b33b85db8a44b5f7a700a8e4dbaf022df0))

### [16.0.2](https://www.github.com/yargs/yargs/compare/v16.0.1...v16.0.2) (2020-09-09)


### Bug Fixes

* **typescript:** yargs-parser was breaking @types/yargs ([#1745](https://www.github.com/yargs/yargs/issues/1745)) ([2253284](https://www.github.com/yargs/yargs/commit/2253284b233cceabd8db677b81c5bf1755eef230))

### [16.0.1](https://www.github.com/yargs/yargs/compare/v16.0.0...v16.0.1) (2020-09-09)


### Bug Fixes

* code was not passed to process.exit ([#1742](https://www.github.com/yargs/yargs/issues/1742)) ([d1a9930](https://www.github.com/yargs/yargs/commit/d1a993035a2f76c138460052cf19425f9684b637))

## [16.0.0](https://www.github.com/yargs/yargs/compare/v15.4.2...v16.0.0) (2020-09-09)


### ⚠ BREAKING CHANGES

* tweaks to ESM/Deno API surface: now exports yargs function by default; getProcessArgvWithoutBin becomes hideBin; types now exported for Deno.
* find-up replaced with escalade; export map added (limits importable files in Node >= 12); yarser-parser@19.x.x (new decamelize/camelcase implementation).
* **usage:** single character aliases are now shown first in help output
* rebase helper is no longer provided on yargs instance.
* drop support for EOL Node 8 (#1686)

### Features

* adds strictOptions() ([#1738](https://www.github.com/yargs/yargs/issues/1738)) ([b215fba](https://www.github.com/yargs/yargs/commit/b215fba0ed6e124e5aad6cf22c8d5875661c63a3))
* **helpers:** rebase, Parser, applyExtends now blessed helpers ([#1733](https://www.github.com/yargs/yargs/issues/1733)) ([c7debe8](https://www.github.com/yargs/yargs/commit/c7debe8eb1e5bc6ea20b5ed68026c56e5ebec9e1))
* adds support for ESM and Deno ([#1708](https://www.github.com/yargs/yargs/issues/1708)) ([ac6d5d1](https://www.github.com/yargs/yargs/commit/ac6d5d105a75711fe703f6a39dad5181b383d6c6))
* drop support for EOL Node 8 ([#1686](https://www.github.com/yargs/yargs/issues/1686)) ([863937f](https://www.github.com/yargs/yargs/commit/863937f23c3102f804cdea78ee3097e28c7c289f))
* i18n for ESM and Deno ([#1735](https://www.github.com/yargs/yargs/issues/1735)) ([c71783a](https://www.github.com/yargs/yargs/commit/c71783a5a898a0c0e92ac501c939a3ec411ac0c1))
* tweaks to API surface based on user feedback ([#1726](https://www.github.com/yargs/yargs/issues/1726)) ([4151fee](https://www.github.com/yargs/yargs/commit/4151fee4c33a97d26bc40de7e623e5b0eb87e9bb))
* **usage:** single char aliases first in help ([#1574](https://www.github.com/yargs/yargs/issues/1574)) ([a552990](https://www.github.com/yargs/yargs/commit/a552990c120646c2d85a5c9b628e1ce92a68e797))


### Bug Fixes

* **yargs:** add missing command(module) signature ([#1707](https://www.github.com/yargs/yargs/issues/1707)) ([0f81024](https://www.github.com/yargs/yargs/commit/0f810245494ccf13a35b7786d021b30fc95ecad5)), closes [#1704](https://www.github.com/yargs/yargs/issues/1704)

[Older CHANGELOG Entries](https://github.com/yargs/yargs/blob/main/docs/CHANGELOG-historical.md)
