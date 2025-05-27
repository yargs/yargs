# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [18.0.0](https://github.com/yargs/yargs/compare/v17.7.2...v18.0.0) (2025-05-26)


### ⚠ BREAKING CHANGES

* command names are not derived from modules passed to `command`.
* singleton usage of yargs yargs.foo, yargs().argv, has been removed.
* minimum node.js versions now `^20.19.0 || ^22.12.0 || >=23`.
* yargs is now ESM first

### Features

* commandDir now works with ESM files ([#2461](https://github.com/yargs/yargs/issues/2461)) ([27eec18](https://github.com/yargs/yargs/commit/27eec188dad09656fe2e8dd42b529a5d98fea794))
* **locale:** adds hebrew translation ([#2357](https://github.com/yargs/yargs/issues/2357)) ([4266485](https://github.com/yargs/yargs/commit/4266485b20e9b0f3a7f196e84c6d8284b04642cd))
* yargs is now ESM first ([d90af45](https://github.com/yargs/yargs/commit/d90af45f18db093396b41196830b04e6930aa542))
* **zsh:** Add default completion as fallback ([#2331](https://github.com/yargs/yargs/issues/2331)) ([e02c91b](https://github.com/yargs/yargs/commit/e02c91b861380eccf743ac9c5c27c6895366e320))


### Bug Fixes

* addDirectory do not support absolute command dir ([#2465](https://github.com/yargs/yargs/issues/2465)) ([3a40a78](https://github.com/yargs/yargs/commit/3a40a787edc5784b8134af022948b30c707001ba))
* allows ESM modules commands to be extensible using visit option ([#2468](https://github.com/yargs/yargs/issues/2468)) ([200e1aa](https://github.com/yargs/yargs/commit/200e1aae95aeac71fc084aabf449fa95edf63300))
* **browser:** fix shims so that yargs continues working in browser context ([#2457](https://github.com/yargs/yargs/issues/2457)) ([4ae5f57](https://github.com/yargs/yargs/commit/4ae5f5742e2ce7bd9d7b18f3de25c90a938e5cc3))
* **build:** address problems with typescript compilation ([#2445](https://github.com/yargs/yargs/issues/2445)) ([8d72fb3](https://github.com/yargs/yargs/commit/8d72fb3968498447df52e994e259920c9fefc2b5))
* coerce should play well with parser configuration ([#2308](https://github.com/yargs/yargs/issues/2308)) ([8343c66](https://github.com/yargs/yargs/commit/8343c66eac10fbe60e85fc17adfe07eadd45cb35))
* **deps:** update dependency yargs-parser to v22 ([#2470](https://github.com/yargs/yargs/issues/2470)) ([639130d](https://github.com/yargs/yargs/commit/639130d332066c204776c263b4217ac265a0a861))
* exit after async handler done ([#2313](https://github.com/yargs/yargs/issues/2313)) ([e326cde](https://github.com/yargs/yargs/commit/e326cde53173e82407bf5e79cfdd58a199bcb909))
* handle spaces in bash completion ([#2452](https://github.com/yargs/yargs/issues/2452)) ([83b7788](https://github.com/yargs/yargs/commit/83b7788a09576feb2ca1c8aa762431a8a4d6a186))
* parser-configuration should work well with generated completion script ([#2332](https://github.com/yargs/yargs/issues/2332)) ([888db19](https://github.com/yargs/yargs/commit/888db19ccebcb5065a7aa415445e41cb15411c50))
* propagate Dictionary including undefined in value type ([#2393](https://github.com/yargs/yargs/issues/2393)) ([2b2f7f5](https://github.com/yargs/yargs/commit/2b2f7f5611ec6b4229ca609041b0fc8ffc393d14))
* **zsh:** completion no longer requires double tab when using autoloaded ([0dd8fe4](https://github.com/yargs/yargs/commit/0dd8fe42ce98401fa54fd2458bf248bb38cb064d))


### Code Refactoring

* command names are not derived from modules passed to `command`. ([d90af45](https://github.com/yargs/yargs/commit/d90af45f18db093396b41196830b04e6930aa542))
* singleton usage of yargs yargs.foo, yargs().argv, has been removed. ([d90af45](https://github.com/yargs/yargs/commit/d90af45f18db093396b41196830b04e6930aa542))


### Build System

* minimum node.js versions now `^20.19.0 || ^22.12.0 || &gt;=23`. ([d90af45](https://github.com/yargs/yargs/commit/d90af45f18db093396b41196830b04e6930aa542))

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

## [15.4.0](https://www.github.com/yargs/yargs/compare/v15.3.1...v15.4.0) (2020-06-30)


### Features

* adds deprecation option for commands ([027a636](https://www.github.com/yargs/yargs/commit/027a6365b737e13116811a8ef43670196e1fa00a))
* support array of examples ([#1682](https://www.github.com/yargs/yargs/issues/1682)) ([225ab82](https://www.github.com/yargs/yargs/commit/225ab8271938bed3a48d23175f3d580ce8cd1306))


### Bug Fixes

* **docs:** describe usage of `.check()` in more detail ([932cd11](https://www.github.com/yargs/yargs/commit/932cd1177e93f5cc99edfe57a4028e30717bf8fb))
* **i18n:** Japanese translation phrasing ([#1619](https://www.github.com/yargs/yargs/issues/1619)) ([0894175](https://www.github.com/yargs/yargs/commit/089417550ef5a5b8ce3578dd2a989191300b64cd))
* **strict mode:** report default command unknown arguments ([#1626](https://www.github.com/yargs/yargs/issues/1626)) ([69f29a9](https://www.github.com/yargs/yargs/commit/69f29a9cd429d4bb99481238305390107ac75b02))
* **usage:** translate 'options' group only when displaying help ([#1600](https://www.github.com/yargs/yargs/issues/1600)) ([e60b39b](https://www.github.com/yargs/yargs/commit/e60b39b9d3a912c06db43f87c86ba894142b6c1c))


### Reverts

* Revert "chore(deps): update dependency eslint to v7 (#1656)" (#1673) ([34949f8](https://www.github.com/yargs/yargs/commit/34949f89ee7cdf88f7b315659df4b5f62f714842)), closes [#1656](https://www.github.com/yargs/yargs/issues/1656) [#1673](https://www.github.com/yargs/yargs/issues/1673)

### [15.3.1](https://www.github.com/yargs/yargs/compare/v15.3.0...v15.3.1) (2020-03-16)


### Bug Fixes

* \_\_proto\_\_ will now be replaced with \_\_\_proto\_\_\_ in parse ([#258](https://www.github.com/yargs/yargs-parser/issues/258)), patching a potential 
prototype pollution vulnerability. This was reported by the Snyk Security Research Team. ([63810ca](https://www.github.com/yargs/yargs-parser/commit/63810ca1ae1a24b08293a4d971e70e058c7a41e2))

## [15.3.0](https://www.github.com/yargs/yargs/compare/v15.2.0...v15.3.0) (2020-03-08)


### Features

* **yargs-parser:** introduce single-digit boolean aliases ([#1576](https://www.github.com/yargs/yargs/issues/1576)) ([3af7f04](https://www.github.com/yargs/yargs/commit/3af7f04cdbfcbd4b3f432aca5144d43f21958c39))
* add usage for single-digit boolean aliases ([#1580](https://www.github.com/yargs/yargs/issues/1580)) ([6014e39](https://www.github.com/yargs/yargs/commit/6014e39bca3a1e8445aa0fb2a435f6181e344c45))


### Bug Fixes

* address ambiguity between nargs of 1 and requiresArg ([#1572](https://www.github.com/yargs/yargs/issues/1572)) ([a5edc32](https://www.github.com/yargs/yargs/commit/a5edc328ecb3f90d1ba09cfe70a0040f68adf50a))

## [15.2.0](https://www.github.com/yargs/yargs/compare/v15.1.0...v15.2.0) (2020-03-01)


### ⚠ BREAKING CHANGES

* **deps:** yargs-parser@17.0.0 no longer implicitly creates arrays out of boolean
arguments when duplicates are provided

### Features

* **completion:** takes negated flags into account when boolean-negation is set ([#1509](https://www.github.com/yargs/yargs/issues/1509)) ([7293ad5](https://www.github.com/yargs/yargs/commit/7293ad50d20ea0fb7dd1ac9b925e90e1bd95dea8))
* **deps:** pull in yargs-parser@17.0.0 ([#1553](https://www.github.com/yargs/yargs/issues/1553)) ([b9409da](https://www.github.com/yargs/yargs/commit/b9409da199ebca515a848489c206b807fab2e65d))
* deprecateOption ([#1559](https://www.github.com/yargs/yargs/issues/1559)) ([8aae333](https://www.github.com/yargs/yargs/commit/8aae3332251d09fa136db17ef4a40d83fa052bc4))
* display appropriate $0 for electron apps ([#1536](https://www.github.com/yargs/yargs/issues/1536)) ([d0e4379](https://www.github.com/yargs/yargs/commit/d0e437912917d6a66bb5128992fa2f566a5f830b))
* introduces strictCommands() subset of strict mode ([#1540](https://www.github.com/yargs/yargs/issues/1540)) ([1d4cca3](https://www.github.com/yargs/yargs/commit/1d4cca395a98b395e6318f0505fc73bef8b01350))
* **deps:** yargs-parser with 'greedy-array' configuration ([#1569](https://www.github.com/yargs/yargs/issues/1569)) ([a03a320](https://www.github.com/yargs/yargs/commit/a03a320dbf5c0ce33d829a857fc04a651c0bb53e))


### Bug Fixes

* help always displayed for the first command parsed having an async handler ([#1535](https://www.github.com/yargs/yargs/issues/1535)) ([d585b30](https://www.github.com/yargs/yargs/commit/d585b303a43746201b05c9c9fda94a444634df33))
* **deps:** fix enumeration for normalized path arguments ([#1567](https://www.github.com/yargs/yargs/issues/1567)) ([0b5b1b0](https://www.github.com/yargs/yargs/commit/0b5b1b0e5f4f9baf393c48e9cc2bc85c1b67a47a))
* **locales:** only translate default option group name ([acc16de](https://www.github.com/yargs/yargs/commit/acc16de6b846ea7332db753646a9cec76b589162))
* **locales:** remove extra space in French for 'default' ([#1564](https://www.github.com/yargs/yargs/issues/1564)) ([ecfc2c4](https://www.github.com/yargs/yargs/commit/ecfc2c474575c6cdbc6d273c94c13181bd1dbaa6))
* **translations:** add French translation for unknown command ([#1563](https://www.github.com/yargs/yargs/issues/1563)) ([18b0b75](https://www.github.com/yargs/yargs/commit/18b0b752424bf560271e670ff95a0f90c8386787))
* **translations:** fix pluralization in error messages. ([#1557](https://www.github.com/yargs/yargs/issues/1557)) ([94fa38c](https://www.github.com/yargs/yargs/commit/94fa38cbab8d86943e87bf41d368ed56dffa6835))
* **yargs:** correct support of bundled electron apps ([#1554](https://www.github.com/yargs/yargs/issues/1554)) ([a0b61ac](https://www.github.com/yargs/yargs/commit/a0b61ac21e2b554aa73dbf1a66d4a7af94047c2f))

## [15.1.0](https://www.github.com/yargs/yargs/compare/v15.0.2...v15.1.0) (2020-01-02)


### Features

* **lang:** add Finnish localization (language code fi) ([222c8fe](https://www.github.com/yargs/yargs/commit/222c8fef2e2ad46e314c337dec96940f896bec35))
* complete short options with a single dash ([#1507](https://www.github.com/yargs/yargs/issues/1507)) ([99011ab](https://www.github.com/yargs/yargs/commit/99011ab5ba90232506ece0a17e59e2001a1ab562))
* onFinishCommand handler ([#1473](https://www.github.com/yargs/yargs/issues/1473)) ([fe380cd](https://www.github.com/yargs/yargs/commit/fe380cd356aa33aef0449facd59c22cab8930ac9))


### Bug Fixes

* getCompletion() was not working for options ([#1495](https://www.github.com/yargs/yargs/issues/1495)) ([463feb2](https://www.github.com/yargs/yargs/commit/463feb2870158eb9df670222b0f0a40a05cf18d0))
* misspelling of package.json `engines` field ([0891d0e](https://www.github.com/yargs/yargs/commit/0891d0ed35b30c83a6d9e9f6a5c5f84d13c546a0))
* populate positionals when unknown-options-as-args is set ([#1508](https://www.github.com/yargs/yargs/issues/1508)) ([bb0f2eb](https://www.github.com/yargs/yargs/commit/bb0f2eb996fa4e19d330b31a01c2036cafa99a7e)), closes [#1444](https://www.github.com/yargs/yargs/issues/1444)
* show 2 dashes on help for single digit option key or alias ([#1493](https://www.github.com/yargs/yargs/issues/1493)) ([63b3dd3](https://www.github.com/yargs/yargs/commit/63b3dd31a455d428902220c1992ae930e18aff5c))
* **docs:** use recommended cjs import syntax for ts examples ([#1513](https://www.github.com/yargs/yargs/issues/1513)) ([f9a18bf](https://www.github.com/yargs/yargs/commit/f9a18bfd624a5013108084f690cd8a1de794c430))

### [15.0.2](https://www.github.com/yargs/yargs/compare/v15.0.1...v15.0.2) (2019-11-19)


### Bug Fixes

* temporary fix for libraries that call Object.freeze() ([#1483](https://www.github.com/yargs/yargs/issues/1483)) ([99c2dc8](https://www.github.com/yargs/yargs/commit/99c2dc850e67c606644f8b0c0bca1a59c87dcbcd))

### [15.0.1](https://www.github.com/yargs/yargs/compare/v15.0.0...v15.0.1) (2019-11-16)


### Bug Fixes

* **deps:** cliui, find-up, and string-width, all drop Node 6 support ([#1479](https://www.github.com/yargs/yargs/issues/1479)) ([6a9ebe2](https://www.github.com/yargs/yargs/commit/6a9ebe2d955e3e979e76c07ffbb1c17fef64cb49))

## [15.0.0](https://www.github.com/yargs/yargs/compare/v14.2.0...v15.0.0) (2019-11-10)


### ⚠ BREAKING CHANGES

* **deps:** yargs-parser now throws on invalid combinations of config (#1470)
* yargs-parser@16.0.0 drops support for Node 6
* drop Node 6 support (#1461)
* remove package.json-based parserConfiguration (#1460)

### Features

* **deps:** yargs-parser now throws on invalid combinations of config ([#1470](https://www.github.com/yargs/yargs/issues/1470)) ([c10c38c](https://www.github.com/yargs/yargs/commit/c10c38cca04298f96b55a7e374a9a134abefffa7))
* expose `Parser` from `require('yargs/yargs')` ([#1477](https://www.github.com/yargs/yargs/issues/1477)) ([1840ba2](https://www.github.com/yargs/yargs/commit/1840ba22f1a24c0ece8e32bbd31db4134a080aee))


### Bug Fixes

* **docs:** 
cript import to prevent a future major release warning ([#1441](https://www.github.com/yargs/yargs/issues/1441)) ([b1b156a](https://www.github.com/yargs/yargs/commit/b1b156a3eb4ddd6803fbbd56c611a77919293000))
* stop-parse was not being respected by commands ([#1459](https://www.github.com/yargs/yargs/issues/1459)) ([12c82e6](https://www.github.com/yargs/yargs/commit/12c82e62663e928148a7ee2f51629aa26a0f9bb2))
* update to yargs-parser with fix for array default values ([#1463](https://www.github.com/yargs/yargs/issues/1463)) ([ebee59d](https://www.github.com/yargs/yargs/commit/ebee59d9022da538410e69a5c025019ed46d13d2))
* **docs:** update boolean description and examples in docs ([#1474](https://www.github.com/yargs/yargs/issues/1474)) ([afd5b48](https://www.github.com/yargs/yargs/commit/afd5b4871bfeb90d58351ac56c5c44a83ef033e6))


### Miscellaneous Chores

* drop Node 6 support ([#1461](https://www.github.com/yargs/yargs/issues/1461)) ([2ba8ce0](https://www.github.com/yargs/yargs/commit/2ba8ce05e8fefbeffc6cb7488d9ebf6e86cceb1d))


### Code Refactoring

* remove package.json-based parserConfiguration ([#1460](https://www.github.com/yargs/yargs/issues/1460)) ([0d3642b](https://www.github.com/yargs/yargs/commit/0d3642b6f829b637938774c0c6ce5f6bfe1afa51))

## [14.2.0](https://github.com/yargs/yargs/compare/v14.1.0...v14.2.0) (2019-10-07)


### Bug Fixes

* async middleware was called twice ([#1422](https://github.com/yargs/yargs/issues/1422)) ([9a42b63](https://github.com/yargs/yargs/commit/9a42b63))
* fix promise check to accept any spec conform object ([#1424](https://github.com/yargs/yargs/issues/1424)) ([0be43d2](https://github.com/yargs/yargs/commit/0be43d2))
* groups were not being maintained for nested commands ([#1430](https://github.com/yargs/yargs/issues/1430)) ([d38650e](https://github.com/yargs/yargs/commit/d38650e))
* **docs:** broken markdown link ([#1426](https://github.com/yargs/yargs/issues/1426)) ([236e24e](https://github.com/yargs/yargs/commit/236e24e))
* support merging deeply nested configuration ([#1423](https://github.com/yargs/yargs/issues/1423)) ([bae66fe](https://github.com/yargs/yargs/commit/bae66fe))


### Features

* **deps:** introduce yargs-parser with support for unknown-options-as-args ([#1440](https://github.com/yargs/yargs/issues/1440)) ([4d21520](https://github.com/yargs/yargs/commit/4d21520))

## [14.1.0](https://github.com/yargs/yargs/compare/v14.0.0...v14.1.0) (2019-09-06)


### Bug Fixes

* **docs:** fix incorrect parserConfiguration documentation ([2a99124](https://github.com/yargs/yargs/commit/2a99124))
* detect zsh when zsh isnt run as a login prompt ([#1395](https://github.com/yargs/yargs/issues/1395)) ([8792d13](https://github.com/yargs/yargs/commit/8792d13))
* populate correct value on yargs.parsed and stop warning on access ([#1412](https://github.com/yargs/yargs/issues/1412)) ([bb0eb52](https://github.com/yargs/yargs/commit/bb0eb52))
* showCompletionScript was logging script twice ([#1388](https://github.com/yargs/yargs/issues/1388)) ([07c8537](https://github.com/yargs/yargs/commit/07c8537))
* strict() should not ignore hyphenated arguments ([#1414](https://github.com/yargs/yargs/issues/1414)) ([b774b5e](https://github.com/yargs/yargs/commit/b774b5e))
* **docs:** formalize existing callback argument to showHelp ([#1386](https://github.com/yargs/yargs/issues/1386)) ([d217764](https://github.com/yargs/yargs/commit/d217764))


### Features

* make it possible to merge configurations when extending other config. ([#1411](https://github.com/yargs/yargs/issues/1411)) ([5d7ad98](https://github.com/yargs/yargs/commit/5d7ad98))


## [14.0.0](https://github.com/yargs/yargs/compare/v13.3.0...v14.0.0) (2019-07-30)


### ⚠ BREAKING CHANGES

* we now only officially support yargs.$0 parameter and discourage direct access to yargs.parsed
* previously to this fix methods like `yargs.getOptions()` contained the state of the last command to execute.
* do not allow additional positionals in strict mode

### Bug Fixes

* calling parse multiple times now appropriately maintains state ([#1137](https://github.com/yargs/yargs/issues/1137)) ([#1369](https://github.com/yargs/yargs/issues/1369)) ([026b151](https://github.com/yargs/yargs/commit/026b151))
* prefer user supplied script name in usage ([#1383](https://github.com/yargs/yargs/issues/1383)) ([28c74b9](https://github.com/yargs/yargs/commit/28c74b9))
* **deps:** use decamelize from npm instead of vendored copy ([#1377](https://github.com/yargs/yargs/issues/1377)) ([015eeb9](https://github.com/yargs/yargs/commit/015eeb9))
* **examples:** fix usage-options.js to reflect current API ([#1375](https://github.com/yargs/yargs/issues/1375)) ([6e5b76b](https://github.com/yargs/yargs/commit/6e5b76b))
* do not allow additional positionals in strict mode ([35d777c](https://github.com/yargs/yargs/commit/35d777c))
* properties accessed on singleton now reflect current state of instance ([#1366](https://github.com/yargs/yargs/issues/1366)) ([409d35b](https://github.com/yargs/yargs/commit/409d35b))
* tolerate null prototype for config objects with `extends` ([#1376](https://github.com/yargs/yargs/issues/1376)) ([3d26d11](https://github.com/yargs/yargs/commit/3d26d11)), closes [#1372](https://github.com/yargs/yargs/issues/1372)
* yargs.parsed now populated before returning, when yargs.parse() called with no args (#1382) ([e3981fd](https://github.com/yargs/yargs/commit/e3981fd)), closes [#1382](https://github.com/yargs/yargs/issues/1382)

### Features

* adds support for multiple epilog messages ([#1384](https://github.com/yargs/yargs/issues/1384)) ([07a5554](https://github.com/yargs/yargs/commit/07a5554))
* allow completionCommand to be set via showCompletionScript ([#1385](https://github.com/yargs/yargs/issues/1385)) ([5562853](https://github.com/yargs/yargs/commit/5562853))

## [13.3.0](https://www.github.com/yargs/yargs/compare/v13.2.4...v13.3.0) (2019-06-10)


### Bug Fixes

* **deps:** yargs-parser update addressing several parsing bugs ([#1357](https://www.github.com/yargs/yargs/issues/1357)) ([e230d5b](https://www.github.com/yargs/yargs/commit/e230d5b))


### Features

* **i18n:** swap out os-locale dependency for simple inline implementation ([#1356](https://www.github.com/yargs/yargs/issues/1356)) ([4dfa19b](https://www.github.com/yargs/yargs/commit/4dfa19b))
* support defaultDescription for positional arguments ([812048c](https://www.github.com/yargs/yargs/commit/812048c))

### [13.2.4](https://github.com/yargs/yargs/compare/v13.2.3...v13.2.4) (2019-05-13)


### Bug Fixes

* **i18n:** rename unclear 'implication failed' to 'missing dependent arguments' ([#1317](https://github.com/yargs/yargs/issues/1317)) ([bf46813](https://github.com/yargs/yargs/commit/bf46813))



### [13.2.3](https://github.com/yargs/yargs/compare/v13.2.2...v13.2.3) (2019-05-05)


### Bug Fixes

* **deps:** upgrade cliui for compatibility with latest chalk. ([#1330](https://github.com/yargs/yargs/issues/1330)) ([b20db65](https://github.com/yargs/yargs/commit/b20db65))
* address issues with dutch translation ([#1316](https://github.com/yargs/yargs/issues/1316)) ([0295132](https://github.com/yargs/yargs/commit/0295132))


### Tests

* accept differently formatted output ([#1327](https://github.com/yargs/yargs/issues/1327)) ([c294d1b](https://github.com/yargs/yargs/commit/c294d1b))



## [13.2.2](https://github.com/yargs/yargs/compare/v13.2.1...v13.2.2) (2019-03-06)



## [13.2.1](https://github.com/yargs/yargs/compare/v13.2.0...v13.2.1) (2019-02-18)


### Bug Fixes

* add zsh script to files array ([3180224](https://github.com/yargs/yargs/commit/3180224))
* support options/sub-commands in zsh completion ([0a96394](https://github.com/yargs/yargs/commit/0a96394))


# [13.2.0](https://github.com/yargs/yargs/compare/v13.1.0...v13.2.0) (2019-02-15)


### Features

* zsh auto completion ([#1292](https://github.com/yargs/yargs/issues/1292)) ([16c5d25](https://github.com/yargs/yargs/commit/16c5d25)), closes [#1156](https://github.com/yargs/yargs/issues/1156)


<a name="13.1.0"></a>
# [13.1.0](https://github.com/yargs/yargs/compare/v13.0.0...v13.1.0) (2019-02-12)


### Features

* add applyBeforeValidation, for applying sync middleware before validation ([5be206a](https://github.com/yargs/yargs/commit/5be206a))



<a name="13.0.0"></a>
# [13.0.0](https://github.com/yargs/yargs/compare/v12.0.5...v13.0.0) (2019-02-02)


### Bug Fixes

* **deps:** Update os-locale to avoid security vulnerability ([#1270](https://github.com/yargs/yargs/issues/1270)) ([27bf739](https://github.com/yargs/yargs/commit/27bf739))
* **validation:** Use the error as a message when none exists otherwise ([#1268](https://github.com/yargs/yargs/issues/1268)) ([0510fe6](https://github.com/yargs/yargs/commit/0510fe6))
* better bash path completion ([#1272](https://github.com/yargs/yargs/issues/1272)) ([da75ea2](https://github.com/yargs/yargs/commit/da75ea2))
* middleware added multiple times due to reference bug ([#1282](https://github.com/yargs/yargs/issues/1282)) ([64af518](https://github.com/yargs/yargs/commit/64af518))


### Chores

* ~drop Node 6 from testing matrix ([#1287](https://github.com/yargs/yargs/issues/1287)) ([ef16792](https://github.com/yargs/yargs/commit/ef16792))~
  * _opting to not drop Node 6 support until April, [see](https://github.com/nodejs/Release)._
* update dependencies ([#1284](https://github.com/yargs/yargs/issues/1284)) ([f25de4f](https://github.com/yargs/yargs/commit/f25de4f))


### Features

* Add `.parserConfiguration()` method, deprecating package.json config ([#1262](https://github.com/yargs/yargs/issues/1262)) ([3c6869a](https://github.com/yargs/yargs/commit/3c6869a))
* adds config option for sorting command output ([#1256](https://github.com/yargs/yargs/issues/1256)) ([6916ce9](https://github.com/yargs/yargs/commit/6916ce9))
* options/positionals with leading '+' and '0' no longer parse as numbers ([#1286](https://github.com/yargs/yargs/issues/1286)) ([e9dc3aa](https://github.com/yargs/yargs/commit/e9dc3aa))
* support promises in middleware ([f3a4e4f](https://github.com/yargs/yargs/commit/f3a4e4f))


### BREAKING CHANGES

* options with leading '+' or '0' now parse as strings
* dropping Node 6 which hits end of life in April 2019
* see [yargs-parser@12.0.0 CHANGELOG](https://github.com/yargs/yargs-parser/blob/main/CHANGELOG.md#breaking-changes)
* we now warn if the yargs stanza package.json is used.

<a name="12.0.5"></a>
## [12.0.5](https://github.com/yargs/yargs/compare/v12.0.4...v12.0.5) (2018-11-19)


### Bug Fixes

* allows camel-case, variadic arguments, and strict mode to be combined ([#1247](https://github.com/yargs/yargs/issues/1247)) ([eacc035](https://github.com/yargs/yargs/commit/eacc035))



<a name="12.0.4"></a>
## [12.0.4](https://github.com/yargs/yargs/compare/v12.0.3...v12.0.4) (2018-11-10)


### Bug Fixes

* don't load config when processing positionals ([5d0dc92](https://github.com/yargs/yargs/commit/5d0dc92))



<a name="12.0.3"></a>
## [12.0.3](https://github.com/yargs/yargs/compare/v12.0.2...v12.0.3) (2018-10-06)


### Bug Fixes

* $0 contains first arg in bundled electron apps ([#1206](https://github.com/yargs/yargs/issues/1206)) ([567820b](https://github.com/yargs/yargs/commit/567820b))
* accept single function for middleware ([66fd6f7](https://github.com/yargs/yargs/commit/66fd6f7)), closes [#1214](https://github.com/yargs/yargs/issues/1214) [#1214](https://github.com/yargs/yargs/issues/1214)
* hide `hidden` options from help output even if they are in a group ([#1221](https://github.com/yargs/yargs/issues/1221)) ([da54028](https://github.com/yargs/yargs/commit/da54028))
* improve Norwegian Bokmål translations ([#1208](https://github.com/yargs/yargs/issues/1208)) ([a458fa4](https://github.com/yargs/yargs/commit/a458fa4))
* improve Norwegian Nynorsk translations ([#1207](https://github.com/yargs/yargs/issues/1207)) ([d422eb5](https://github.com/yargs/yargs/commit/d422eb5))



<a name="12.0.2"></a>
## [12.0.2](https://github.com/yargs/yargs/compare/v12.0.1...v12.0.2) (2018-09-04)


### Bug Fixes

* middleware should work regardless of when method is called  ([664b265](https://github.com/yargs/yargs/commit/664b265)), closes [#1178](https://github.com/yargs/yargs/issues/1178)
* translation not working when using __ with a single parameter ([#1183](https://github.com/yargs/yargs/issues/1183)) ([f449aea](https://github.com/yargs/yargs/commit/f449aea))
* upgrade os-locale to version that addresses license issue ([#1195](https://github.com/yargs/yargs/issues/1195)) ([efc0970](https://github.com/yargs/yargs/commit/efc0970))



<a name="12.0.1"></a>
## [12.0.1](https://github.com/yargs/yargs/compare/v12.0.0...v12.0.1) (2018-06-29)



<a name="12.0.0"></a>
# [12.0.0](https://github.com/yargs/yargs/compare/v11.1.0...v12.0.0) (2018-06-26)


### Bug Fixes

* .argv and .parse() now invoke identical code path ([#1126](https://github.com/yargs/yargs/issues/1126)) ([f13ebf4](https://github.com/yargs/yargs/commit/f13ebf4))
* remove the trailing white spaces from the help output ([#1090](https://github.com/yargs/yargs/issues/1090)) ([3f0746c](https://github.com/yargs/yargs/commit/3f0746c))
* **completion:** Avoid default command and recommendations during completion ([#1123](https://github.com/yargs/yargs/issues/1123)) ([036e7c5](https://github.com/yargs/yargs/commit/036e7c5))


### Chores

* test Node.js 6, 8 and 10 ([#1160](https://github.com/yargs/yargs/issues/1160)) ([84f9d2b](https://github.com/yargs/yargs/commit/84f9d2b))
* upgrade to version of yargs-parser that does not populate value for unset boolean ([#1104](https://github.com/yargs/yargs/issues/1104)) ([d4705f4](https://github.com/yargs/yargs/commit/d4705f4))


### Features

* add support for global middleware, useful for shared tasks like metrics ([#1119](https://github.com/yargs/yargs/issues/1119)) ([9d71ac7](https://github.com/yargs/yargs/commit/9d71ac7))
* allow setting scriptName $0 ([#1143](https://github.com/yargs/yargs/issues/1143)) ([a2f2eae](https://github.com/yargs/yargs/commit/a2f2eae))
* remove `setPlaceholderKeys` ([#1105](https://github.com/yargs/yargs/issues/1105)) ([6ee2c82](https://github.com/yargs/yargs/commit/6ee2c82))


### BREAKING CHANGES

* Options absent from `argv` (not set via CLI argument) are now absent from the parsed result object rather than being set with `undefined`
* drop Node 4 from testing matrix, such that we'll gradually start drifting away from supporting Node 4.
* yargs-parser does not populate 'false' when boolean flag is not passed
* tests that assert against help output will need to be updated



<a name="11.1.0"></a>
# [11.1.0](https://github.com/yargs/yargs/compare/v11.0.0...v11.1.0) (2018-03-04)


### Bug Fixes

* choose correct config directory when require.main does not exist ([#1056](https://github.com/yargs/yargs/issues/1056)) ([a04678c](https://github.com/yargs/yargs/commit/a04678c))


### Features

* allow hidden options to be displayed with --show-hidden ([#1061](https://github.com/yargs/yargs/issues/1061)) ([ea862ae](https://github.com/yargs/yargs/commit/ea862ae))
* extend *.rc files in addition to json ([#1080](https://github.com/yargs/yargs/issues/1080)) ([11691a6](https://github.com/yargs/yargs/commit/11691a6))



<a name="11.0.0"></a>
# [11.0.0](https://github.com/yargs/yargs/compare/v10.1.2...v11.0.0) (2018-01-22)


### Bug Fixes

* Set implicit nargs=1 when type=number requiresArg=true ([#1050](https://github.com/yargs/yargs/issues/1050)) ([2b56812](https://github.com/yargs/yargs/commit/2b56812))


### Features

* requiresArg is now simply an alias for nargs(1) ([#1054](https://github.com/yargs/yargs/issues/1054)) ([a3ddacc](https://github.com/yargs/yargs/commit/a3ddacc))


### BREAKING CHANGES

* requiresArg now has significantly different error output, matching nargs.

[Historical Versions](/docs/CHANGELOG-historical.md)

<a name="10.1.2"></a>
## [10.1.2](https://github.com/yargs/yargs/compare/v10.1.1...v10.1.2) (2018-01-17)


### Bug Fixes

* requiresArg should only be enforced if argument exists ([#1043](https://github.com/yargs/yargs/issues/1043)) ([fbf41ae](https://github.com/yargs/yargs/commit/fbf41ae))



<a name="10.1.1"></a>
## [10.1.1](https://github.com/yargs/yargs/compare/v10.1.0...v10.1.1) (2018-01-09)


### Bug Fixes

* Add `dirname` sanity check on `findUp` ([#1036](https://github.com/yargs/yargs/issues/1036)) ([331d103](https://github.com/yargs/yargs/commit/331d103))



<a name="10.1.0"></a>
# [10.1.0](https://github.com/yargs/yargs/compare/v10.0.3...v10.1.0) (2018-01-01)


### Bug Fixes

* 'undefined' should be taken to mean no argument was provided ([#1015](https://github.com/yargs/yargs/issues/1015)) ([c679e90](https://github.com/yargs/yargs/commit/c679e90))


### Features

* add missing simple chinese locale strings ([#1004](https://github.com/yargs/yargs/issues/1004)) ([3cc24ec](https://github.com/yargs/yargs/commit/3cc24ec))
* add Norwegian Nynorsk translations ([#1028](https://github.com/yargs/yargs/issues/1028)) ([a5ac213](https://github.com/yargs/yargs/commit/a5ac213))
* async command handlers ([#1001](https://github.com/yargs/yargs/issues/1001)) ([241124b](https://github.com/yargs/yargs/commit/241124b))
* middleware ([#881](https://github.com/yargs/yargs/issues/881)) ([77b8dbc](https://github.com/yargs/yargs/commit/77b8dbc))



<a name="10.0.3"></a>
## [10.0.3](https://github.com/yargs/yargs/compare/v10.0.2...v10.0.3) (2017-10-21)


### Bug Fixes

* parse array rather than string, so that quotes are safe ([#993](https://github.com/yargs/yargs/issues/993)) ([c351685](https://github.com/yargs/yargs/commit/c351685))



<a name="10.0.2"></a>
## [10.0.2](https://github.com/yargs/yargs/compare/v10.0.1...v10.0.2) (2017-10-21)


### Bug Fixes

* fix tiny spacing issue with usage ([#992](https://github.com/yargs/yargs/issues/992)) ([7871327](https://github.com/yargs/yargs/commit/7871327))



<a name="10.0.1"></a>
## [10.0.1](https://github.com/yargs/yargs/compare/v10.0.0...v10.0.1) (2017-10-19)


### Bug Fixes

* help strings for nested commands were missing parent commands ([#990](https://github.com/yargs/yargs/issues/990)) ([cd1ca15](https://github.com/yargs/yargs/commit/cd1ca15))
* use correct completion command in generated completion script ([#988](https://github.com/yargs/yargs/issues/988)) ([3c8ac1d](https://github.com/yargs/yargs/commit/3c8ac1d))



<a name="10.0.0"></a>
# [10.0.0](https://github.com/yargs/yargs/compare/v9.1.0...v10.0.0) (2017-10-18)


### Bug Fixes

* config and normalize can be disabled with false ([#952](https://github.com/yargs/yargs/issues/952)) ([3bb8771](https://github.com/yargs/yargs/commit/3bb8771))
* less eager help command execution ([#972](https://github.com/yargs/yargs/issues/972)) ([8c1d7bf](https://github.com/yargs/yargs/commit/8c1d7bf))
* the positional argument parse was clobbering global flag arguments ([#984](https://github.com/yargs/yargs/issues/984)) ([7e58453](https://github.com/yargs/yargs/commit/7e58453))


### Features

* .usage() can now be used to configure a default command ([#975](https://github.com/yargs/yargs/issues/975)) ([7269531](https://github.com/yargs/yargs/commit/7269531))
* hidden options are now explicitly indicated using "hidden" flag ([#962](https://github.com/yargs/yargs/issues/962)) ([280d0d6](https://github.com/yargs/yargs/commit/280d0d6))
* introduce .positional() for configuring positional arguments ([#967](https://github.com/yargs/yargs/issues/967)) ([cb16460](https://github.com/yargs/yargs/commit/cb16460))
* replace $0 with file basename ([#983](https://github.com/yargs/yargs/issues/983)) ([20bb99b](https://github.com/yargs/yargs/commit/20bb99b))


### BREAKING CHANGES

* .usage() no longer accepts an options object as the second argument. It can instead be used as an alias for configuring a default command.
* previously hidden options were simply implied using a falsy description
* help command now only executes if it's the last positional in argv._



<a name="9.1.0"></a>
# [9.1.0](https://github.com/yargs/yargs/compare/v9.0.1...v9.1.0) (2017-09-25)


### Bug Fixes

* **command:** Run default cmd even if the only cmd ([#950](https://github.com/yargs/yargs/issues/950)) ([7b22203](https://github.com/yargs/yargs/commit/7b22203))


### Features

* multiple usage calls are now collected, not replaced ([#958](https://github.com/yargs/yargs/issues/958)) ([74a38b2](https://github.com/yargs/yargs/commit/74a38b2))



<a name="9.0.1"></a>
## [9.0.1](https://github.com/yargs/yargs/compare/v9.0.0...v9.0.1) (2017-09-17)


### Bug Fixes

* implications fails only displayed once ([#954](https://github.com/yargs/yargs/issues/954)) ([ac8088b](https://github.com/yargs/yargs/commit/ac8088b))



<a name="9.0.0"></a>
# [9.0.0](https://github.com/yargs/yargs/compare/v8.0.2...v9.0.0) (2017-09-03)


### Bug Fixes

* 'undefined' default value for choices resulted in validation failing ([782b896](https://github.com/yargs/yargs/commit/782b896))
* address bug with handling of arrays of implications ([c240661](https://github.com/yargs/yargs/commit/c240661))
* defaulting keys to 'undefined' interfered with conflicting key logic ([a8e0cff](https://github.com/yargs/yargs/commit/a8e0cff))
* don't bother calling JSON.stringify() on string default values ([#891](https://github.com/yargs/yargs/issues/891)) ([628be21](https://github.com/yargs/yargs/commit/628be21))
* exclude positional arguments from completion output ([#927](https://github.com/yargs/yargs/issues/927)) ([71c7ec7](https://github.com/yargs/yargs/commit/71c7ec7))
* strict mode should not fail for hidden options ([#949](https://github.com/yargs/yargs/issues/949)) ([0e0c58d](https://github.com/yargs/yargs/commit/0e0c58d))


### Features

* allow implies and conflicts to accept array values ([#922](https://github.com/yargs/yargs/issues/922)) ([abdc7da](https://github.com/yargs/yargs/commit/abdc7da))
* allow parse with no arguments as alias for yargs.argv ([#944](https://github.com/yargs/yargs/issues/944)) ([a9f03e7](https://github.com/yargs/yargs/commit/a9f03e7))
* enable .help() and .version() by default ([#912](https://github.com/yargs/yargs/issues/912)) ([1ef44e0](https://github.com/yargs/yargs/commit/1ef44e0))
* to allow both undefined and nulls, for benefit of TypeScript  ([#945](https://github.com/yargs/yargs/issues/945)) ([792564d](https://github.com/yargs/yargs/commit/792564d))


### BREAKING CHANGES

* version() and help() are now enabled by default, and show up in help output; the implicit help command can no longer be enabled/disabled independently from the help command itself (which can now be disabled).
* parse() now behaves as an alias for .argv, unless a parseCallback is provided.



<a name="8.0.2"></a>
## [8.0.2](https://github.com/yargs/yargs/compare/v8.0.1...v8.0.2) (2017-06-12)



<a name="8.0.1"></a>
## [8.0.1](https://github.com/yargs/yargs/compare/v8.0.0...v8.0.1) (2017-05-02)



<a name="8.0.0"></a>
# [8.0.0](https://github.com/yargs/yargs/compare/v7.1.0...v8.0.0) (2017-05-01)


### Bug Fixes

* commands are now applied in order, from left to right ([#857](https://github.com/yargs/yargs/issues/857)) ([baba863](https://github.com/yargs/yargs/commit/baba863))
* help now takes precedence over command recommendation ([#866](https://github.com/yargs/yargs/issues/866)) ([17e3567](https://github.com/yargs/yargs/commit/17e3567))
* positional arguments now work if no handler is provided to inner command ([#864](https://github.com/yargs/yargs/issues/864)) ([e28ded3](https://github.com/yargs/yargs/commit/e28ded3))


### Chores

* upgrade yargs-parser ([#867](https://github.com/yargs/yargs/issues/867)) ([8f9c6c6](https://github.com/yargs/yargs/commit/8f9c6c6))


### Features

* allow extends to inherit from a module ([#865](https://github.com/yargs/yargs/issues/865)) ([89456d9](https://github.com/yargs/yargs/commit/89456d9))
* allow strict mode to be disabled ([#840](https://github.com/yargs/yargs/issues/840)) ([6f78c05](https://github.com/yargs/yargs/commit/6f78c05))


### BREAKING CHANGES

* extends functionality now always loads the JSON provided, rather than reading from a specific key
* Node 4+ is now required; this will allow us to start updating our dependencies.
* the first argument to strict() is now used to enable/disable its functionality, rather than controlling whether or not it is global.



<a name="7.1.0"></a>
# [7.1.0](https://github.com/yargs/yargs/compare/v7.0.2...v7.1.0) (2017-04-13)


### Bug Fixes

* fix demandOption no longer treats 'false' as truthy ([#829](https://github.com/yargs/yargs/issues/829)) ([c748dd2](https://github.com/yargs/yargs/commit/c748dd2))
* get terminalWidth in non interactive mode no longer causes a validation exception ([#837](https://github.com/yargs/yargs/issues/837)) ([360e301](https://github.com/yargs/yargs/commit/360e301))
* we shouldn't output help if we've printed a prior help-like message ([#847](https://github.com/yargs/yargs/issues/847)) ([17e89bd](https://github.com/yargs/yargs/commit/17e89bd))


### Features

* add support for numeric commands ([#825](https://github.com/yargs/yargs/issues/825)) ([fde0564](https://github.com/yargs/yargs/commit/fde0564))



<a name="7.0.2"></a>
## [7.0.2](https://github.com/yargs/yargs/compare/v7.0.1...v7.0.2) (2017-03-10)


### Bug Fixes

* populating placeholder arguments broke validation ([b3eb2fe](https://github.com/yargs/yargs/commit/b3eb2fe))



<a name="7.0.1"></a>
## [7.0.1](https://github.com/yargs/yargs/compare/v7.0.0...v7.0.1) (2017-03-03)


### Bug Fixes

* --help with default command should print top-level help ([#810](https://github.com/yargs/yargs/issues/810)) ([9c03fa4](https://github.com/yargs/yargs/commit/9c03fa4))



<a name="7.0.0"></a>
# [7.0.0](https://github.com/yargs/yargs/compare/v6.6.0...v7.0.0) (2017-02-26)


### Bug Fixes

* address min/max validation message regression ([#750](https://github.com/yargs/yargs/issues/750)) ([2e5ce0f](https://github.com/yargs/yargs/commit/2e5ce0f))
* address positional argument strict() bug introduced in [#766](https://github.com/yargs/yargs/issues/766) ([#784](https://github.com/yargs/yargs/issues/784)) ([a8528e6](https://github.com/yargs/yargs/commit/a8528e6))
* console.warn() rather than throwing errors when api signatures are incorrect ([#804](https://github.com/yargs/yargs/issues/804)) ([a607061](https://github.com/yargs/yargs/commit/a607061))
* context should override parsed argv ([#786](https://github.com/yargs/yargs/issues/786)) ([0997288](https://github.com/yargs/yargs/commit/0997288))
* context variables are now recognized in strict() mode ([#796](https://github.com/yargs/yargs/issues/796)) ([48575cd](https://github.com/yargs/yargs/commit/48575cd))
* errors were not bubbling appropriately from sub-commands to top-level ([#802](https://github.com/yargs/yargs/issues/802)) ([8a992f5](https://github.com/yargs/yargs/commit/8a992f5))
* positional arguments of sub-commands threw strict() exception ([#805](https://github.com/yargs/yargs/issues/805)) ([f3f074b](https://github.com/yargs/yargs/commit/f3f074b))
* pull in yargs-parser with modified env precedence ([#787](https://github.com/yargs/yargs/issues/787)) ([e0fbbe5](https://github.com/yargs/yargs/commit/e0fbbe5))
* running parse() multiple times on the same yargs instance caused exception if help() enabled ([#790](https://github.com/yargs/yargs/issues/790)) ([07e39b7](https://github.com/yargs/yargs/commit/07e39b7))
* use path.resolve() to support node 0.10 ([#797](https://github.com/yargs/yargs/issues/797)) ([49a93fc](https://github.com/yargs/yargs/commit/49a93fc))


### Features

* add conflicts and implies shorthands. ([#753](https://github.com/yargs/yargs/issues/753)) ([bd1472b](https://github.com/yargs/yargs/commit/bd1472b))
* add traditional Chinese translation ([#780](https://github.com/yargs/yargs/issues/780)) ([6ab6a95](https://github.com/yargs/yargs/commit/6ab6a95))
* allow provided config object to extend other configs ([#779](https://github.com/yargs/yargs/issues/779)) ([3280dd0](https://github.com/yargs/yargs/commit/3280dd0))
* function argument validation ([#773](https://github.com/yargs/yargs/issues/773)) ([22ed9bb](https://github.com/yargs/yargs/commit/22ed9bb))
* if only one column is provided for examples, allow it to take up the entire line ([#749](https://github.com/yargs/yargs/issues/749)) ([7931652](https://github.com/yargs/yargs/commit/7931652))
* introduce custom yargs error object ([#765](https://github.com/yargs/yargs/issues/765)) ([8308efa](https://github.com/yargs/yargs/commit/8308efa))
* introduces support for default commands, using the '*' identifier ([#785](https://github.com/yargs/yargs/issues/785)) ([d78a0f5](https://github.com/yargs/yargs/commit/d78a0f5))
* rethink how options are inherited by commands ([#766](https://github.com/yargs/yargs/issues/766)) ([ab1fa4b](https://github.com/yargs/yargs/commit/ab1fa4b))


### BREAKING CHANGES

* `extends` key in config file is now used for extending other config files
* environment variables now take precedence over config files.
* context now takes precedence over argv and defaults
* the arguments passed to functions are now validated, there's a good chance this will throw exceptions for a few folks who are using the API in an unexpected way.
* by default options, and many of yargs' parsing helpers will now default to being applied globally; such that they are no-longer reset before being passed into commands.
* yargs will no longer aggressively suppress errors, allowing errors that are not generated internally to bubble.



<a name="6.6.0"></a>
# [6.6.0](https://github.com/yargs/yargs/compare/v6.5.0...v6.6.0) (2016-12-29)


### Bug Fixes

* [object Object] was accidentally being populated on options object ([#736](https://github.com/yargs/yargs/issues/736)) ([f755e27](https://github.com/yargs/yargs/commit/f755e27))
* do not use cwd when resolving package.json for yargs parsing config ([#726](https://github.com/yargs/yargs/issues/726)) ([9bdaab7](https://github.com/yargs/yargs/commit/9bdaab7))


### Features

* implement conflicts() for defining mutually exclusive arguments; thanks [@madcampos](https://github.com/madcampos)! ([#741](https://github.com/yargs/yargs/issues/741)) ([5883779](https://github.com/yargs/yargs/commit/5883779))
* split demand() into demandCommand()/demandOption() ([#740](https://github.com/yargs/yargs/issues/740)) ([66573c8](https://github.com/yargs/yargs/commit/66573c8))
* support for positional argument aliases ([#727](https://github.com/yargs/yargs/issues/727)) ([27e1a57](https://github.com/yargs/yargs/commit/27e1a57))



<a name="6.5.0"></a>
# [6.5.0](https://github.com/yargs/yargs/compare/v6.4.0...v6.5.0) (2016-12-01)


### Bug Fixes

* still freeze/unfreeze if parse() is called in isolation ([#717](https://github.com/yargs/yargs/issues/717)) ([30a9492](https://github.com/yargs/yargs/commit/30a9492))


### Features

* pull in yargs-parser introducing additional settings ([#688](https://github.com/yargs/yargs/issues/688)), and fixing [#716](https://github.com/yargs/yargs/issues/716) ([#722](https://github.com/yargs/yargs/issues/722)) ([702995a](https://github.com/yargs/yargs/commit/702995a))



<a name="6.4.0"></a>
# [6.4.0](https://github.com/yargs/yargs/compare/v6.3.0...v6.4.0) (2016-11-13)


### Bug Fixes

* **locales:** correct some Russian translations ([#691](https://github.com/yargs/yargs/issues/691)) ([a980671](https://github.com/yargs/yargs/commit/a980671))


### Features

* **locales:** Added Belarusian translation ([#690](https://github.com/yargs/yargs/issues/690)) ([68dac1f](https://github.com/yargs/yargs/commit/68dac1f))
* **locales:** Create nl.json ([#687](https://github.com/yargs/yargs/issues/687)) ([46ce1bb](https://github.com/yargs/yargs/commit/46ce1bb))
* update to yargs-parser that addresses [#598](https://github.com/yargs/yargs/issues/598), [#617](https://github.com/yargs/yargs/issues/617) ([#700](https://github.com/yargs/yargs/issues/700)) ([54cb31d](https://github.com/yargs/yargs/commit/54cb31d))
* yargs is now passed as the third-argument to fail handler ([#613](https://github.com/yargs/yargs/issues/613)) ([21b74f9](https://github.com/yargs/yargs/commit/21b74f9))


### Performance Improvements

* normalizing package data is an expensive operation ([#705](https://github.com/yargs/yargs/issues/705)) ([49cf533](https://github.com/yargs/yargs/commit/49cf533))



<a name="6.3.0"></a>
# [6.3.0](https://github.com/yargs/yargs/compare/v6.2.0...v6.3.0) (2016-10-19)


### Bug Fixes

* **command:** subcommands via commandDir() now supported for parse(msg, cb) ([#678](https://github.com/yargs/yargs/issues/678)) ([6b85cc6](https://github.com/yargs/yargs/commit/6b85cc6))


### Features

* **locales:** Add Thai locale file ([#679](https://github.com/yargs/yargs/issues/679)) ([c05e36b](https://github.com/yargs/yargs/commit/c05e36b))



<a name="6.2.0"></a>
# [6.2.0](https://github.com/yargs/yargs/compare/v6.1.1...v6.2.0) (2016-10-16)


### Bug Fixes

* stop applying parser to context object ([#675](https://github.com/yargs/yargs/issues/675)) ([3fe9b8f](https://github.com/yargs/yargs/commit/3fe9b8f))


### Features

* add new pt_BR translations ([#674](https://github.com/yargs/yargs/issues/674)) ([5615a82](https://github.com/yargs/yargs/commit/5615a82))
* Italian translations for 'did you mean' and 'aliases' ([#673](https://github.com/yargs/yargs/issues/673)) ([81984e6](https://github.com/yargs/yargs/commit/81984e6))



<a name="6.1.1"></a>
## [6.1.1](https://github.com/yargs/yargs/compare/v6.1.0...v6.1.1) (2016-10-15)


### Bug Fixes

* freeze was not resetting configObjects to initial state; addressed performance issue raised by [@nexdrew](https://github.com/nexdrew). ([#670](https://github.com/yargs/yargs/issues/670)) ([ae4bcd4](https://github.com/yargs/yargs/commit/ae4bcd4))



<a name="6.1.0"></a>
# [6.1.0](https://github.com/yargs/yargs/compare/v6.0.0...v6.1.0) (2016-10-15)


### Bug Fixes

* **locales:** change some translations ([#667](https://github.com/yargs/yargs/issues/667)) ([aa966c5](https://github.com/yargs/yargs/commit/aa966c5))
* **locales:** conform hi locale to y18n.__n expectations ([#666](https://github.com/yargs/yargs/issues/666)) ([22adb18](https://github.com/yargs/yargs/commit/22adb18))


### Features

* initial support for command aliases ([#647](https://github.com/yargs/yargs/issues/647)) ([127a040](https://github.com/yargs/yargs/commit/127a040))
* **command:** add camelcase commands to argv ([#658](https://github.com/yargs/yargs/issues/658)) ([b1cabae](https://github.com/yargs/yargs/commit/b1cabae))
* **locales:** add Hindi translations ([9290912](https://github.com/yargs/yargs/commit/9290912))
* **locales:** add Hungarian translations  ([be92327](https://github.com/yargs/yargs/commit/be92327))
* **locales:** Japanese translations for 'did you mean' and 'aliases'  ([#651](https://github.com/yargs/yargs/issues/651)) ([5eb78fc](https://github.com/yargs/yargs/commit/5eb78fc))
* **locales:** Polish translations for 'did you mean' and 'aliases' ([#650](https://github.com/yargs/yargs/issues/650)) ([c951c0e](https://github.com/yargs/yargs/commit/c951c0e))
* reworking yargs API to make it easier to run in headless environments, e.g., Slack ([#646](https://github.com/yargs/yargs/issues/646)) ([f284c29](https://github.com/yargs/yargs/commit/f284c29))
* Turkish translations for 'did you mean' and 'aliases' ([#660](https://github.com/yargs/yargs/issues/660)) ([072fd45](https://github.com/yargs/yargs/commit/072fd45))



<a name="6.0.0"></a>
# [6.0.0](https://github.com/yargs/yargs/compare/v5.0.0...v6.0.0) (2016-09-30)


### Bug Fixes

* changed parsing of the command string to ignore extra spaces ([#600](https://github.com/yargs/yargs/issues/600)) ([e8e5a72](https://github.com/yargs/yargs/commit/e8e5a72))
* drop lodash.assign ([#641](https://github.com/yargs/yargs/issues/641)) ([ad3146f](https://github.com/yargs/yargs/commit/ad3146f))
* for args that have skipValidation set to `true`, check if the parsed arg is `true` ([#619](https://github.com/yargs/yargs/issues/619)) ([658a34c](https://github.com/yargs/yargs/commit/658a34c))
* upgrade standard, and fix appveyor config so that it works with newest standard ([#607](https://github.com/yargs/yargs/issues/607)) ([c301f42](https://github.com/yargs/yargs/commit/c301f42))


### Chores

* upgrade yargs-parser ([#633](https://github.com/yargs/yargs/issues/633)) ([cc1224e](https://github.com/yargs/yargs/commit/cc1224e))


### Features

* make opts object optional for .option() ([#624](https://github.com/yargs/yargs/issues/624)) ([4f29de6](https://github.com/yargs/yargs/commit/4f29de6))


### Performance Improvements

* defer windowWidth() to improve perf for non-help usage ([#610](https://github.com/yargs/yargs/issues/610)) ([cbc3636](https://github.com/yargs/yargs/commit/cbc3636))


### BREAKING CHANGES

* coerce is now applied as a final step after other parsing is complete



<a name="5.0.0"></a>
# [5.0.0](https://github.com/yargs/yargs/compare/v4.8.1...v5.0.0) (2016-08-14)


### Bug Fixes

* **default:** Remove undocumented alias of default() ([#469](https://github.com/yargs/yargs/issues/469)) ([b8591b2](https://github.com/yargs/yargs/commit/b8591b2))
* remove deprecated zh.json ([#578](https://github.com/yargs/yargs/issues/578)) ([317c62c](https://github.com/yargs/yargs/commit/317c62c))


### Features

* .help() API can now enable implicit help command ([#574](https://github.com/yargs/yargs/issues/574)) ([7645019](https://github.com/yargs/yargs/commit/7645019))
* **command:** builder function no longer needs to return the yargs instance ([#549](https://github.com/yargs/yargs/issues/549)) ([eaa2873](https://github.com/yargs/yargs/commit/eaa2873))
* add coerce api ([#586](https://github.com/yargs/yargs/issues/586)) ([1d53ccb](https://github.com/yargs/yargs/commit/1d53ccb))
* adds recommendCommands() for command suggestions ([#580](https://github.com/yargs/yargs/issues/580)) ([59474dc](https://github.com/yargs/yargs/commit/59474dc))
* apply .env() globally ([#553](https://github.com/yargs/yargs/issues/553)) ([be65728](https://github.com/yargs/yargs/commit/be65728))
* apply default builder to command() and apply fail() handlers globally ([#583](https://github.com/yargs/yargs/issues/583)) ([0aaa68b](https://github.com/yargs/yargs/commit/0aaa68b))
* update yargs-parser to version 3.1.0 ([#581](https://github.com/yargs/yargs/issues/581)) ([882a127](https://github.com/yargs/yargs/commit/882a127))


### Performance Improvements

* defer requiring most external libs until needed ([#584](https://github.com/yargs/yargs/issues/584)) ([f9b0ed4](https://github.com/yargs/yargs/commit/f9b0ed4))


### BREAKING CHANGES

* fail is now applied globally.
* we now default to an empty builder function when command is executed with no builder.
* yargs-parser now better handles negative integer values, at the cost of handling numeric option names, e.g., -1 hello
* default: removed undocumented `defaults` alias for `default`.
* introduces a default `help` command which outputs help, as an alternative to a help flag.
* interpret demand() numbers as relative to executing command ([#582](https://github.com/yargs/yargs/issues/582)) ([927810c](https://github.com/yargs/yargs/commit/927810c))



<a name="4.8.1"></a>
## [4.8.1](https://github.com/yargs/yargs/compare/v4.8.0...v4.8.1) (2016-07-16)


### Bug Fixes

* **commandDir:** make dir relative to caller instead of require.main.filename ([#548](https://github.com/yargs/yargs/issues/548)) ([3c2e479](https://github.com/yargs/yargs/commit/3c2e479))
* add config lookup for .implies() ([#556](https://github.com/yargs/yargs/issues/556)) ([8d7585c](https://github.com/yargs/yargs/commit/8d7585c))
* cache pkg lookups by path to avoid returning the wrong one ([#552](https://github.com/yargs/yargs/issues/552)) ([fea7e0b](https://github.com/yargs/yargs/commit/fea7e0b))
* positional arguments were not being handled appropriately by parse() ([#559](https://github.com/yargs/yargs/issues/559)) ([063a866](https://github.com/yargs/yargs/commit/063a866))
* pull in [@nexdrew](https://github.com/nexdrew)'s fixes to yargs-parser ([#560](https://github.com/yargs/yargs/issues/560)) ([c77c080](https://github.com/yargs/yargs/commit/c77c080)), closes [#560](https://github.com/yargs/yargs/issues/560)



<a name="4.8.0"></a>
# [4.8.0](https://github.com/yargs/yargs/compare/v4.7.1...v4.8.0) (2016-07-09)


### Bug Fixes

* drop unused camelcase dependency fixes [#516](https://github.com/yargs/yargs/issues/516) ([#525](https://github.com/yargs/yargs/issues/525)) ([365fb9a](https://github.com/yargs/yargs/commit/365fb9a)), closes [#516](https://github.com/yargs/yargs/issues/516) [#525](https://github.com/yargs/yargs/issues/525)
* fake a tty in tests, so that we can use the new set-blocking ([#512](https://github.com/yargs/yargs/issues/512)) ([a54c742](https://github.com/yargs/yargs/commit/a54c742))
* ignore invalid package.json during read-pkg-up ([#546](https://github.com/yargs/yargs/issues/546)) ([e058c87](https://github.com/yargs/yargs/commit/e058c87))
* keep both zh and zh_CN until yargs[@5](https://github.com/5).x ([0f8faa7](https://github.com/yargs/yargs/commit/0f8faa7))
* lazy-load package.json and cache. get rid of pkg-conf dependency. ([#544](https://github.com/yargs/yargs/issues/544)) ([2609b2e](https://github.com/yargs/yargs/commit/2609b2e))
* we now respect the order of _ when applying commands ([#537](https://github.com/yargs/yargs/issues/537)) ([ed86b78](https://github.com/yargs/yargs/commit/ed86b78))


### Features

* add .commandDir(dir) to API to apply all command modules from a relative directory ([#494](https://github.com/yargs/yargs/issues/494)) ([b299dff](https://github.com/yargs/yargs/commit/b299dff))
* **command:** derive missing command string from module filename ([#527](https://github.com/yargs/yargs/issues/527)) ([20d4b8a](https://github.com/yargs/yargs/commit/20d4b8a))
* builder is now optional for a command module ([#545](https://github.com/yargs/yargs/issues/545)) ([8d6ad6e](https://github.com/yargs/yargs/commit/8d6ad6e))



<a name="4.7.1"></a>
## [4.7.1](https://github.com/yargs/yargs/compare/v4.7.0...v4.7.1) (2016-05-15)


### Bug Fixes

* switch to using `const` rather than `var` ([#499](https://github.com/yargs/yargs/pull/499))
* make stdout flush on newer versions of Node.js ([#501](https://github.com/yargs/yargs/issues/501)) ([9f8c6f4](https://github.com/yargs/yargs/commit/9f8c6f4))



<a name="4.7.0"></a>
# [4.7.0](https://github.com/yargs/yargs/compare/v4.6.0...v4.7.0) (2016-05-02)


### Bug Fixes

* **pkgConf:** fix aliases issues in .pkgConf() ([#478](https://github.com/yargs/yargs/issues/478))([b900502](https://github.com/yargs/yargs/commit/b900502))


### Features

* **completion:** allow to get completions for any string, not just process.argv ([#470](https://github.com/yargs/yargs/issues/470))([74fcfbc](https://github.com/yargs/yargs/commit/74fcfbc))
* **configuration:** Allow to directly pass a configuration object to .config() ([#480](https://github.com/yargs/yargs/issues/480))([e0a7e05](https://github.com/yargs/yargs/commit/e0a7e05))
* **validation:** Add .skipValidation() method ([#471](https://github.com/yargs/yargs/issues/471))([d72badb](https://github.com/yargs/yargs/commit/d72badb))



<a name="4.6.0"></a>
# [4.6.0](https://github.com/yargs/yargs/compare/v4.5.0...v4.6.0) (2016-04-11)


### Bug Fixes

* **my brand!:** I agree with [@osher](https://github.com/osher) lightweight isn't a huge selling point of ours any longer, see [#468](https://github.com/yargs/yargs/issues/468) ([c46d7e1](https://github.com/yargs/yargs/commit/c46d7e1))

### Features

* switch to standard-version for release management ([f70f801](https://github.com/yargs/yargs/commit/f70f801))
* upgrade to version of yargs-parser that introduces some slick new features, great work [@elas7](https://github.com/elas7). update cliui, replace win-spawn, replace badge. ([#475](https://github.com/yargs/yargs/issues/475)) ([f915dd4](https://github.com/yargs/yargs/commit/f915dd4))



<a name="4.5.0"></a>
# [4.5.0](https://github.com/yargs/yargs/compare/v4.4.0...v4.5.0) (2016-04-05)


### Bug Fixes

* **windows:** handle $0 better on Windows platforms ([eb6e03f](https://github.com/yargs/yargs/commit/eb6e03f))

### Features

* **commands:** implemented variadic positional arguments ([51d926e](https://github.com/yargs/yargs/commit/51d926e))
* **completion:** completion now better handles aliases, and avoids duplicating keys. ([86416c8](https://github.com/yargs/yargs/commit/86416c8))
* **config:** If invoking .config() without parameters, set a default option ([0413dd1](https://github.com/yargs/yargs/commit/0413dd1))
* **conventional-changelog:** switching to using conventional-changelog for generating the changelog ([a2b5a2a](https://github.com/yargs/yargs/commit/a2b5a2a))



### v4.4.0 (2016/04/03 21:10 +07:00)

- [#454](https://github.com/yargs/yargs/pull/454) fix demand() when second argument is an array (@elas7)
- [#452](https://github.com/yargs/yargs/pull/452) fix code example for `.help()` docs (@maxrimue)
- [#450](https://github.com/yargs/yargs/pull/450) fix for bash completion trailing space edge-case (@elas7)
- [#448](https://github.com/yargs/yargs/pull/448) allow a method to be passed to `showHelp`, rather than a log-level (@osher)
- [#446](https://github.com/yargs/yargs/pull/446) update yargs-parser, y18n, nyc, cliui, pkg-conf (@bcoe)
- [#436](https://github.com/yargs/yargs/pull/436) the rebase method is only used by tests, do not export it in two places (@elas7)
- [#428](https://github.com/yargs/yargs/pull/428) initial support for subcommands (@nexdrew)

### v4.3.2 (2016/3/20 15:07 +07:00)

- [#445](https://github.com/yargs/yargs/pull/445) strict mode was failing if no commands were registered (@nexdrew)
- [#443](https://github.com/yargs/yargs/pull/443) adds Italian translation \o/ (@madrisan)
- [#441](https://github.com/yargs/yargs/pull/441) remove duplicate keys from array options configuration (@elas7)
- [#437](https://github.com/yargs/yargs/pull/437) standardize tests for .command() (@lrlna)

### v4.3.0 (2016/3/12 14:19 +07:00)

- [#432](https://github.com/yargs/yargs/pull/432) non-singleton version of yargs (@bcoe)
- [#422, #425, #420] translations for number (@zkat, @rilut, @maxrimue, @watilde)
- [#414](https://github.com/yargs/yargs/pull/414) all command options can be defined in module now (@nexdrew)

### v4.2.0 (2016/2/22 11:02 +07:00)

- [#395](https://github.com/yargs/yargs/pull/395) do not reset groups if they contain
  global keys (@novemberborn)
- [#393](https://github.com/yargs/yargs/pull/393) use sane default for usage strings (@nexdrew)
- [#392](https://github.com/yargs/yargs/pull/392) resetting wrap() was causing layout issues
  with commands (@nexdrew)
- [#391](https://github.com/yargs/yargs/pull/391) commands were being added multiple times (@nexdrew)

### v4.0.0 (2016/2/14 1:27 +07:00)

- [#384](https://github.com/bcoe/yargs/pull/384) add new number type to yargs (@lrlna, @maxrimue)
- [#382](https://github.com/bcoe/yargs/pull/382) pass error as extra parameter to fail (@gajus)
- [#378](https://github.com/bcoe/yargs/pull/378) introduces the pkgConf feature, which tells
  yargs to load default argument values from a key on a project's package.json (@bcoe)
- [#376](https://github.com/bcoe/yargs/pull/376) **breaking change**, make help() method signature
   more consistent with other commands (@maxrimue)
- [#368](https://github.com/bcoe/yargs/pull/368) **breaking change**, overhaul to command handling API:
  introducing named positional arguments, commands as modules, introduces the concept of global options (options that don't reset). (@nexdrew, @bcoe).
- [#364](https://github.com/bcoe/yargs/pull/364) add the slick new yargs website to the package.json (@iarna).
- [#357](https://github.com/bcoe/yargs/pull/357) .strict() now requires that a valid command is provided (@lrlna)
- [#356](https://github.com/bcoe/yargs/pull/356) pull the parsing bits of yargs into the separate module yargs-parser. Various parsing options can now be turned on and off using configuration (@bcoe).
- [#330](https://github.com/bcoe/yargs/pull/330) **breaking change**, fix inconsistencies with `.version()` API. (@maxrimue).

### v3.32.0 (2016/1/14 10:13 +07:00)

- [#344](https://github.com/bcoe/yargs/pull/344) yargs now has a code of conduct and contributor guidelines (@bcoe)
- [#341](https://github.com/bcoe/yargs/issues/341) Fix edge-case with camel-case arguments (@davibe)
- [#331](https://github.com/bcoe/yargs/pull/331) Handle parsing a raw argument string (@kellyselden)
- [#325](https://github.com/bcoe/yargs/pull/325) Tweaks to make tests pass again on Windows (@isaacs)
- [#321](https://github.com/bcoe/yargs/pull/321) Custom config parsing function (@bcoe)

### v3.31.0 (2015/12/03 10:15 +07:00)

- [#239](https://github.com/bcoe/yargs/pull/239) Pass argv to commands (@bcoe)
- [#308](https://github.com/bcoe/yargs/pull/308) Yargs now handles environment variables (@nexdrew)
- [#302](https://github.com/bcoe/yargs/pull/302) Add Indonesian translation (@rilut)
- [#300](https://github.com/bcoe/yargs/pull/300) Add Turkish translation (@feyzo)
- [#298](https://github.com/bcoe/yargs/pull/298) Add Norwegian Bokmål translation (@sindresorhus)
- [#297](https://github.com/bcoe/yargs/pull/297) Fix for layout of cjk characters (@disjukr)
- [#296](https://github.com/bcoe/yargs/pull/296) Add Korean translation (@disjukr)

### v3.30.0 (2015/11/13 16:29 +07:00)

- [#293](https://github.com/bcoe/yargs/pull/293) Polish language support (@kamilogorek)
- [#291](https://github.com/bcoe/yargs/pull/291) fix edge-cases with `.alias()` (@bcoe)
- [#289](https://github.com/bcoe/yargs/pull/289) group options in custom groups (@bcoe)

### v3.29.0 (2015/10/16 21:51 +07:00)

- [#282](https://github.com/bcoe/yargs/pull/282) completions now accept promises (@LinusU)
- [#281](https://github.com/bcoe/yargs/pull/281) fix parsing issues with dot notation (@bcoe)

### v3.28.0 (2015/10/16 1:55 +07:00)

- [#277](https://github.com/bcoe/yargs/pull/277) adds support for ansi escape codes (@bcoe)

### v3.27.0 (2015/10/08 1:55 +00:00)

- [#271](https://github.com/bcoe/yargs/pull/273) skips validation for help or version flags with exitProcess(false) (@tepez)
- [#273](https://github.com/bcoe/yargs/pull/273) implements single output for errors with exitProcess(false) (@nexdrew)
- [#269](https://github.com/bcoe/yargs/pull/269) verifies single output for errors with exitProcess(false) (@tepez)
- [#268](https://github.com/bcoe/yargs/pull/268) adds Chinese translation (@qiu8310)
- [#266](https://github.com/bcoe/yargs/pull/266) adds case for -- after -- in parser test (@geophree)

### v3.26.0 (2015/09/25 2:14 +00:00)

- [#263](https://github.com/bcoe/yargs/pull/263) document count() and option() object keys (@nexdrew)
- [#259](https://github.com/bcoe/yargs/pull/259) remove util in readme (@38elements)
- [#258](https://github.com/bcoe/yargs/pull/258) node v4 builds, update deps (@nexdrew)
- [#257](https://github.com/bcoe/yargs/pull/257) fix spelling errors (@dkoleary88)

### v3.25.0 (2015/09/13 7:38 -07:00)

- [#254](https://github.com/bcoe/yargs/pull/254) adds Japanese translation (@oti)
- [#253](https://github.com/bcoe/yargs/pull/253) fixes for tests on Windows (@bcoe)

### v3.24.0 (2015/09/04 12:02 +00:00)

- [#248](https://github.com/bcoe/yargs/pull/248) reinstate os-locale, no spawning (@nexdrew)
- [#249](https://github.com/bcoe/yargs/pull/249) use travis container-based infrastructure (@nexdrew)
- [#247](https://github.com/bcoe/yargs/pull/247) upgrade standard (@nexdrew)

### v3.23.0 (2015/08/30 23:00 +00:00)

- [#246](https://github.com/bcoe/yargs/pull/246) detect locale based only on environment variables (@bcoe)
- [#244](https://github.com/bcoe/yargs/pull/244) adds Windows CI testing (@bcoe)
- [#245](https://github.com/bcoe/yargs/pull/245) adds OSX CI testing (@bcoe, @nexdrew)

### v3.22.0 (2015/08/28 22:26 +00:00)
- [#242](https://github.com/bcoe/yargs/pull/242) adds detectLocale config option (@bcoe)

### v3.21.1 (2015/08/28 20:58 +00:00)
- [#240](https://github.com/bcoe/yargs/pull/240) hot-fix for Atom on Windows (@bcoe)

### v3.21.0 (2015/08/21 21:20 +00:00)
- [#238](https://github.com/bcoe/yargs/pull/238) upgrade camelcase, window-size, chai, mocha (@nexdrew)
- [#237](https://github.com/bcoe/yargs/pull/237) adds defaultDescription to option() (@nexdrew)

### v3.20.0 (2015/08/20 01:29 +00:00)
- [#231](https://github.com/bcoe/yargs/pull/231) Merge pull request #231 from bcoe/detect-locale (@sindresorhus)
- [#235](https://github.com/bcoe/yargs/pull/235) adds german translation to yargs (@maxrimue)

### v3.19.0 (2015/08/14 05:12 +00:00)
- [#224](https://github.com/bcoe/yargs/pull/224) added Portuguese translation (@codemonkey3045)

### v3.18.1 (2015/08/12 05:53 +00:00)

- [#228](https://github.com/bcoe/yargs/pull/228) notes about embedding yargs in Electron (@etiktin)
- [#223](https://github.com/bcoe/yargs/pull/223) make booleans work in config files (@sgentle)

### v3.18.0 (2015/08/06 20:05 +00:00)
- [#222](https://github.com/bcoe/yargs/pull/222) updates fr locale (@nexdrew)
- [#221](https://github.com/bcoe/yargs/pull/221) adds missing locale strings (@nexdrew)
- [#220](https://github.com/bcoe/yargs/pull/220) adds es locale (@zkat)

### v3.17.1 (2015/08/02 19:35 +00:00)
- [#218](https://github.com/bcoe/yargs/pull/218) upgrades nyc (@bcoe)

### v3.17.0 (2015/08/02 18:39 +00:00)
- [#217](https://github.com/bcoe/yargs/pull/217) sort methods in README.md (@nexdrew)
- [#215](https://github.com/bcoe/yargs/pull/215) adds fr locale (@LoicMahieu)

### v3.16.0 (2015/07/30 04:35 +00:00)
- [#210](https://github.com/bcoe/yargs/pull/210) adds i18n support to yargs (@bcoe)
- [#209](https://github.com/bcoe/yargs/pull/209) adds choices type to yargs (@nexdrew)
- [#207](https://github.com/bcoe/yargs/pull/207) pretty new shields from shields.io (@SimenB)
- [#208](https://github.com/bcoe/yargs/pull/208) improvements to README.md (@nexdrew)
- [#205](https://github.com/bcoe/yargs/pull/205) faster build times on Travis (@ChristianMurphy)

### v3.15.0 (2015/07/06 06:01 +00:00)
- [#197](https://github.com/bcoe/yargs/pull/197) tweaks to how errors bubble up from parser.js (@bcoe)
- [#193](https://github.com/bcoe/yargs/pull/193) upgraded nyc, reporting now happens by default (@bcoe)

### v3.14.0 (2015/06/28 02:12 +00:00)

- [#192](https://github.com/bcoe/yargs/pull/192) standard style nits (@bcoe)
- [#190](https://github.com/bcoe/yargs/pull/190) allow for hidden commands, e.g.,
  .completion('completion', false) (@tschaub)

### v3.13.0 (2015/06/24 04:12 +00:00)

- [#187](https://github.com/bcoe/yargs/pull/187) completion now behaves differently
  if it is being run in the context of a command (@tschaub)
- [#186](https://github.com/bcoe/yargs/pull/186) if no matches are found for a completion
  default to filename completion (@tschaub)

### v3.12.0 (2015/06/19 03:23 +00:00)
- [#183](https://github.com/bcoe/yargs/pull/183) don't complete commands if they've already been completed (@tschaub)
- [#181](https://github.com/bcoe/yargs/pull/181) various fixes for completion. (@bcoe, @tschaub)
- [#182](https://github.com/bcoe/yargs/pull/182) you can now set a maximum # of of required arguments (@bcoe)

### v3.11.0 (2015/06/15 05:15 +00:00)

- [#173](https://github.com/bcoe/yargs/pull/173) update standard, window-size, chai (@bcoe)
- [#171](https://github.com/bcoe/yargs/pull/171) a description can now be set
  when providing a config option. (@5c077yP)

### v3.10.0 (2015/05/29 04:25 +00:00)

- [#165](https://github.com/bcoe/yargs/pull/165) expose yargs.terminalWidth() thanks @ensonic (@bcoe)
- [#164](https://github.com/bcoe/yargs/pull/164) better array handling thanks @getify (@bcoe)

### v3.9.1 (2015/05/20 05:14 +00:00)
- [b6662b6](https://github.com/bcoe/yargs/commit/b6662b6774cfeab4876f41ec5e2f67b7698f4e2f) clarify .config() docs (@linclark)
- [0291360](https://github.com/bcoe/yargs/commit/02913606285ce31ce81d7f12c48d8a3029776ec7) fixed tests, switched to nyc for coverage, fixed security issue, added Lin as collaborator (@bcoe)

### v3.9.0 (2015/05/10 18:32 +00:00)
- [#157](https://github.com/bcoe/yargs/pull/157) Merge pull request #157 from bcoe/command-yargs. allows handling of command specific arguments. Thanks for the suggestion @ohjames (@bcoe)
- [#158](https://github.com/bcoe/yargs/pull/158) Merge pull request #158 from kemitchell/spdx-license. Update license format (@kemitchell)

### v3.8.0 (2015/04/24 23:10 +00:00)
- [#154](https://github.com/bcoe/yargs/pull/154) showHelp's method signature was misleading fixes #153 (@bcoe)
- [#151](https://github.com/bcoe/yargs/pull/151) refactor yargs' table layout logic to use new helper library (@bcoe)
- [#150](https://github.com/bcoe/yargs/pull/150) Fix README example in argument requirements (@annonymouse)

### v3.7.2 (2015/04/13 11:52 -07:00)

* [679fbbf](https://github.com/bcoe/yargs/commit/679fbbf55904030ccee8a2635e8e5f46551ab2f0) updated yargs to use the [standard](https://github.com/feross/standard) style guide (agokjr)
* [22382ee](https://github.com/bcoe/yargs/commit/22382ee9f5b495bc2586c1758cd1091cec3647f9 various bug fixes for $0 (@nylen)

### v3.7.1 (2015/04/10 11:06 -07:00)

* [89e1992](https://github.com/bcoe/yargs/commit/89e1992a004ba73609b5f9ee6890c4060857aba4) detect iojs bin along with node bin. (@bcoe)
* [755509e](https://github.com/bcoe/yargs/commit/755509ea90041e5f7833bba3b8c5deffe56f0aab) improvements to example documentation in README.md (@rstacruz)
* [0d2dfc8](https://github.com/bcoe/yargs/commit/0d2dfc822a43418242908ad97ddd5291a1b35dc6) showHelp() no longer requires that .argv has been called (@bcoe)

### v3.7.0 (2015/04/04 02:29 -07:00)

* [56cbe2d](https://github.com/bcoe/yargs/commit/56cbe2ddd33dc176dcbf97ba40559864a9f114e4) make .requiresArg() work with type hints. (@bcoe).
* [2f5d562](https://github.com/bcoe/yargs/commit/2f5d5624f736741deeedf6a664d57bc4d857bdd0) serialize arrays and objects in usage strings. (@bcoe).
* [5126304](https://github.com/bcoe/yargs/commit/5126304dd18351fc28f10530616fdd9361e0af98) be more lenient about alias/primary key ordering in chaining API. (@bcoe)

### v3.6.0 (2015/03/21 01:00 +00:00)
- [4e24e22](https://github.com/bcoe/yargs/commit/4e24e22e6a195e55ab943ede704a0231ac33b99c) support for .js configuration files. (@pirxpilot)

### v3.5.4 (2015/03/12 05:56 +00:00)
- [c16cc08](https://github.com/bcoe/yargs/commit/c16cc085501155cf7fd853ccdf8584b05ab92b78) message for non-option arguments is now optional, thanks to (@raine)

### v3.5.3 (2015/03/09 06:14 +00:00)
- [870b428](https://github.com/bcoe/yargs/commit/870b428cf515d560926ca392555b7ad57dba9e3d) completion script was missing in package.json (@bcoe)

### v3.5.2 (2015/03/09 06:11 +00:00)
- [58a4b24](https://github.com/bcoe/yargs/commit/58a4b2473ebbb326713d522be53e32d3aabb08d2) parse was being called multiple times, resulting in strange behavior (@bcoe)

### v3.5.1 (2015/03/09 04:55 +00:00)
- [4e588e0](https://github.com/bcoe/yargs/commit/4e588e055afbeb9336533095f051496e3977f515) accidentally left testing logic in (@bcoe)

### v3.5.0 (2015/03/09 04:49 +00:00)
- [718bacd](https://github.com/bcoe/yargs/commit/718bacd81b9b44f786af76b2afe491fe06274f19) added support for bash completions see #4 (@bcoe)
- [a192882](https://github.com/bcoe/yargs/commit/a19288270fc431396c42af01125eeb4443664528) downgrade to mocha 2.1.0 until https://github.com/mochajs/mocha/issues/1585 can be sorted out (@bcoe)

### v3.4.7 (2015/03/09 04:09 +00:00)
- [9845e5c](https://github.com/bcoe/yargs/commit/9845e5c1a9c684ba0be3f0bfb40e7b62ab49d9c8) the Argv singleton was not being updated when manually parsing arguments, fixes #114 (@bcoe)

### v3.4.6 (2015/03/09 04:01 +00:00)
- [45b4c80](https://github.com/bcoe/yargs/commit/45b4c80b890d02770b0a94f326695a8a566e8fe9) set placeholders for all keys fixes #115 (@bcoe)

### v3.4.5 (2015/03/01 20:31 +00:00)
- [a758e0b](https://github.com/bcoe/yargs/commit/a758e0b2556184f067cf3d9c4ef886d39817ebd2) fix for count consuming too many arguments (@bcoe)

### v3.4.4 (2015/02/28 04:52 +00:00)
- [0476af7](https://github.com/bcoe/yargs/commit/0476af757966acf980d998b45108221d4888cfcb) added nargs feature, allowing you to specify the number of arguments after an option (@bcoe)
- [092477d](https://github.com/bcoe/yargs/commit/092477d7ab3efbf0ba11cede57f7d8cfc70b024f) updated README with full example of v3.0 API (@bcoe)

### v3.3.3 (2015/02/28 04:23 +00:00)
- [0c4b769](https://github.com/bcoe/yargs/commit/0c4b769516cd8d93a7c4e5e675628ae0049aa9a8) remove string dependency, which conflicted with other libraries see #106 (@bcoe)

### v3.3.2 (2015/02/28 04:11 +00:00)
- [2a98906](https://github.com/bcoe/yargs/commit/2a9890675821c0e7a12f146ce008b0562cb8ec9a) add $0 to epilog (@schnittstabil)

### v3.3.1 (2015/02/24 03:28 +00:00)
- [ad485ce](https://github.com/bcoe/yargs/commit/ad485ce748ebdfce25b88ef9d6e83d97a2f68987) fix for applying defaults to camel-case args (@bcoe)

### v3.3.0 (2015/02/24 00:49 +00:00)
- [8bfe36d](https://github.com/bcoe/yargs/commit/8bfe36d7fb0f93a799ea3f4c756a7467c320f8c0) fix and document restart() command, as a tool for building nested CLIs (@bcoe)

### v3.2.1 (2015/02/22 05:45 +00:00)
- [49a6d18](https://github.com/bcoe/yargs/commit/49a6d1822a4ef9b1ea6f90cc366be60912628885) you can now provide a function that generates a default value (@bcoe)

### v3.2.0 (2015/02/22 05:24 +00:00)
- [7a55886](https://github.com/bcoe/yargs/commit/7a55886c9343cf71a20744ca5cdd56d2ea7412d5) improvements to yargs two-column text layout (@bcoe)
- [b6ab513](https://github.com/bcoe/yargs/commit/b6ab5136a4c3fa6aa496f6b6360382e403183989) Tweak NPM version badge (@nylen)

### v3.1.0 (2015/02/19 19:37 +00:00)
- [9bd2379](https://github.com/bcoe/yargs/commit/9bd237921cf1b61fd9f32c0e6d23f572fc225861) version now accepts a function, making it easy to load version #s from a package.json (@bcoe)

### v3.0.4 (2015/02/14 01:40 +00:00)
- [0b7c19b](https://github.com/bcoe/yargs/commit/0b7c19beaecb747267ca4cc10e5cb2a8550bc4b7) various fixes for dot-notation handling (@bcoe)

### v3.0.3 (2015/02/14 00:59 +00:00)
- [c3f35e9](https://github.com/bcoe/yargs/commit/c3f35e99bd5a0d278073fcadd95e2d778616cc17) make sure dot-notation is applied to aliases (@bcoe)

### 3.0.2 (2015/02/13 16:50 +00:00)
- [74c8967](https://github.com/bcoe/yargs/commit/74c8967c340c204a0a7edf8a702b6f46c2705435) document epilog shorthand of epilogue. (@bcoe)
- [670110f](https://github.com/bcoe/yargs/commit/670110fc01bedc4831b6fec6afac54517d5a71bc) any non-truthy value now causes check to fail see #76 (@bcoe)
- [0d8f791](https://github.com/bcoe/yargs/commit/0d8f791a33c11ced4cd431ea8d3d3a337d456b56) finished implementing my wish-list of fetures for yargs 3.0. see #88 (@bcoe)
- [5768447](https://github.com/bcoe/yargs/commit/5768447447c4c8e8304f178846206ce86540f063) fix coverage. (@bcoe)
- [82e793f](https://github.com/bcoe/yargs/commit/82e793f3f61c41259eaacb67f0796aea2cf2aaa0) detect console width and perform word-wrapping. (@bcoe)
- [67476b3](https://github.com/bcoe/yargs/commit/67476b37eea07fee55f23f35b9e0c7d76682b86d) refactor two-column table layout so that we can use it for examples and usage (@bcoe)
- [4724cdf](https://github.com/bcoe/yargs/commit/4724cdfcc8e37ae1ca3dcce9d762f476e9ef4bb4) major refactor of index.js, in prep for 3.x release. (@bcoe)

### v2.3.0 (2015/02/08 20:41 +00:00)
- [d824620](https://github.com/bcoe/yargs/commit/d824620493df4e63664af1fe320764dd1a9244e6) allow for undefined boolean defaults (@ashi009)

### v2.2.0 (2015/02/08 20:07 +00:00)
- [d6edd98](https://github.com/bcoe/yargs/commit/d6edd9848826e7389ed1393858c45d03961365fd) in-prep for further refactoring, and a 3.x release I've shuffled some things around and gotten test-coverage to 100%. (@bcoe)

### v2.1.2 (2015/02/08 06:05 +00:00)
- [d640745](https://github.com/bcoe/yargs/commit/d640745a7b9f8d476e0223879d056d18d9c265c4) switch to path.relative (@bcoe)
- [3bfd41f](https://github.com/bcoe/yargs/commit/3bfd41ff262a041f29d828b88936a79c63cad594) remove mocha.opts. (@bcoe)
- [47a2f35](https://github.com/bcoe/yargs/commit/47a2f357091db70903a402d6765501c1d63f15fe) document using .string('_') for string ids. see #56 (@bcoe)
- [#57](https://github.com/bcoe/yargs/pull/57) Merge pull request #57 from eush77/option-readme (@eush77)

### v2.1.1 (2015/02/06 08:08 +00:00)
- [01c6c61](https://github.com/bcoe/yargs/commit/01c6c61d67b4ebf88f41f0b32a345ec67f0ac17d) fix for #71, 'newAliases' of undefined (@bcoe)

### v2.1.0 (2015/02/06 07:59 +00:00)
- [6a1a3fa](https://github.com/bcoe/yargs/commit/6a1a3fa731958e26ccd56885f183dd8985cc828f) try to guess argument types, and apply sensible defaults see #73 (@bcoe)

### v2.0.1 (2015/02/06 07:54 +00:00)
- [96a06b2](https://github.com/bcoe/yargs/commit/96a06b2650ff1d085a52b7328d8bba614c20cc12) Fix for strange behavior with --sort option, see #51 (@bcoe)

### v2.0.0 (2015/02/06 07:45 +00:00)
- [0250517](https://github.com/bcoe/yargs/commit/0250517c9643e53f431b824e8ccfa54937414011) - [108fb84](https://github.com/bcoe/yargs/commit/108fb8409a3a63dcaf99d917fe4dfcfaa1de236d) fixed bug with boolean parsing, when bools separated by = see #66 (@bcoe)
- [a465a59](https://github.com/bcoe/yargs/commit/a465a5915f912715738de890982e4f8395958b10) Add `files` field to the package.json (@shinnn)
- [31043de](https://github.com/bcoe/yargs/commit/31043de7a38a17c4c97711f1099f5fb164334db3) fix for yargs.argv having the same keys added multiple times see #63 (@bcoe)
- [2d68c5b](https://github.com/bcoe/yargs/commit/2d68c5b91c976431001c4863ce47c9297850f1ad) Disable process.exit calls using .exitProcess(false) (@cianclarke)
- [45da9ec](https://github.com/bcoe/yargs/commit/45da9ec4c55a7bd394721bc6a1db0dabad7bc52a) Mention .option in README (@eush77)

### v1.3.2 (2014/10/06 21:56 +00:00)
- [b8d3472](https://github.com/bcoe/yargs/commit/b8d34725482e5821a3cc809c0df71378f282f526) 1.3.2 (@chevex)

### list (2014/08/30 18:41 +00:00)
- [fbc777f](https://github.com/bcoe/yargs/commit/fbc777f416eeefd37c84e44d27d7dfc7c1925721) Now that yargs is the successor to optimist, I'm changing the README language to be more universal. Pirate speak isn't very accessible to non-native speakers. (@chevex)
- [a54d068](https://github.com/bcoe/yargs/commit/a54d0682ae2efc2394d407ab171cc8a8bbd135ea) version output will not print extra newline (@boneskull)
- [1cef5d6](https://github.com/bcoe/yargs/commit/1cef5d62a9d6d61a3948a49574892e01932cc6ae) Added contributors section to package.json (@chrisn)
- [cc295c0](https://github.com/bcoe/yargs/commit/cc295c0a80a2de267e0155b60d315fc4b6f7c709) Added 'require' and 'required' as synonyms for 'demand' (@chrisn)
- [d0bf951](https://github.com/bcoe/yargs/commit/d0bf951d949066b6280101ed606593d079ee15c8) Updating minimist. (@chevex)
- [c15f8e7](https://github.com/bcoe/yargs/commit/c15f8e7f245b261e542cf205ce4f4313630cbdb4) Fix #31 (bad interaction between camelCase options and strict mode) (@nylen)
- [d991b9b](https://github.com/bcoe/yargs/commit/d991b9be687a68812dee1e3b185ba64b7778b82d) Added .help() and .version() methods (@chrisn)
- [e8c8aa4](https://github.com/bcoe/yargs/commit/e8c8aa46268379357cb11e9fc34b8c403037724b) Added .showHelpOnFail() method (@chrisn)
- [e855af4](https://github.com/bcoe/yargs/commit/e855af4a933ea966b5bbdd3c4c6397a4bac1a053) Allow boolean flag with .demand() (@chrisn)
- [14dbec2](https://github.com/bcoe/yargs/commit/14dbec24fb7380683198e2b20c4deb8423e64bea) Fixes issue #22. Arguments are no longer printed to the console when using .config. (@chevex)
- [bef74fc](https://github.com/bcoe/yargs/commit/bef74fcddc1544598a804f80d0a3728459f196bf) Informing users that Yargs is the official optimist successor. (@chevex)
- [#24](https://github.com/bcoe/yargs/pull/24) Merge pull request #24 from chrisn/strict (@chrisn)
- [889a2b2](https://github.com/bcoe/yargs/commit/889a2b28eb9768801b05163360a470d0fd6c8b79) Added requiresArg option, for options that require values (@chrisn)
- [eb16369](https://github.com/bcoe/yargs/commit/eb163692262be1fe80b992fd8803d5923c5a9b18) Added .strict() method, to report error if unknown arguments are given (@chrisn)
- [0471c3f](https://github.com/bcoe/yargs/commit/0471c3fd999e1ad4e6cded88b8aa02013b66d14f) Changed optimist to yargs in usage-options.js example (@chrisn)
- [5c88f74](https://github.com/bcoe/yargs/commit/5c88f74e3cf031b17c54b4b6606c83e485ff520e) Change optimist to yargs in examples (@chrisn)
- [66f12c8](https://github.com/bcoe/yargs/commit/66f12c82ba3c943e4de8ca862980e835da8ecb3a) Fix a couple of bad interactions between aliases and defaults (@nylen)
- [8fa1d80](https://github.com/bcoe/yargs/commit/8fa1d80f14b03eb1f2898863a61f1d1615bceb50) Document second argument of usage(message, opts) (@Gobie)
- [56e6528](https://github.com/bcoe/yargs/commit/56e6528cf674ff70d63083fb044ff240f608448e) For "--some-option", also set argv.someOption (@nylen)
- [ed5f6d3](https://github.com/bcoe/yargs/commit/ed5f6d33f57ad1086b11c91b51100f7c6c7fa8ee) Finished porting unit tests to Mocha. (@chevex)

### v1.0.15 (2014/02/05 23:18 +00:00)
- [e2b1fc0](https://github.com/bcoe/yargs/commit/e2b1fc0c4a59cf532ae9b01b275e1ef57eeb64d2) 1.0.15 update to badges (@chevex)

### v1.0.14 (2014/02/05 23:17 +00:00)
- [f33bbb0](https://github.com/bcoe/yargs/commit/f33bbb0f00fe18960f849cc8e15a7428a4cd59b8) Revert "Fixed issue which caused .demand function not to work correctly." (@chevex)

### v1.0.13 (2014/02/05 22:13 +00:00)
- [6509e5e](https://github.com/bcoe/yargs/commit/6509e5e7dee6ef1a1f60eea104be0faa1a045075) Fixed issue which caused .demand function not to work correctly. (@chevex)

### v1.0.12 (2013/12/13 00:09 +00:00)
- [05eb267](https://github.com/bcoe/yargs/commit/05eb26741c9ce446b33ff006e5d33221f53eaceb) 1.0.12 (@chevex)

### v1.0.11 (2013/12/13 00:07 +00:00)
- [c1bde46](https://github.com/bcoe/yargs/commit/c1bde46e37318a68b87d17a50c130c861d6ce4a9) 1.0.11 (@chevex)

### v1.0.10 (2013/12/12 23:57 +00:00)
- [dfebf81](https://github.com/bcoe/yargs/commit/dfebf8164c25c650701528ee581ca483a99dc21c) Fixed formatting in README (@chevex)

### v1.0.9 (2013/12/12 23:47 +00:00)
- [0b4e34a](https://github.com/bcoe/yargs/commit/0b4e34af5e6d84a9dbb3bb6d02cd87588031c182) Update README.md (@chevex)

### v1.0.8 (2013/12/06 16:36 +00:00)
- [#1](https://github.com/bcoe/yargs/pull/1) fix error caused by check() see #1 (@martinheidegger)

### v1.0.7 (2013/11/24 18:01 +00:00)
- [a247d88](https://github.com/bcoe/yargs/commit/a247d88d6e46644cbb7303c18b1bb678fc132d72) Modified Pirate Joe image. (@chevex)

### v1.0.6 (2013/11/23 19:21 +00:00)
- [d7f69e1](https://github.com/bcoe/yargs/commit/d7f69e1d34bc929736a8bdccdc724583e21b7eab) Updated Pirate Joe image. (@chevex)

### v1.0.5 (2013/11/23 19:09 +00:00)
- [ece809c](https://github.com/bcoe/yargs/commit/ece809cf317cc659175e1d66d87f3ca68c2760be) Updated readme notice again. (@chevex)

### v1.0.4 (2013/11/23 19:05 +00:00)
- [9e81e81](https://github.com/bcoe/yargs/commit/9e81e81654028f83ba86ffc3ac772a0476084e5e) Updated README with a notice about yargs being a fork of optimist and what that implies. (@chevex)

### v1.0.3 (2013/11/23 17:43 +00:00)
- [65e7a78](https://github.com/bcoe/yargs/commit/65e7a782c86764944d63d084416aba9ee6019c5f) Changed some small wording in README.md. (@chevex)
- [459e20e](https://github.com/bcoe/yargs/commit/459e20e539b366b85128dd281ccd42221e96c7da) Fix a bug in the options function, when string and boolean options weren't applied to aliases. (@shockone)

### v1.0.2 (2013/11/23 09:46 +00:00)
- [3d80ebe](https://github.com/bcoe/yargs/commit/3d80ebed866d3799224b6f7d596247186a3898a9) 1.0.2 (@chevex)

### v1.0.1 (2013/11/23 09:39 +00:00)
- [f80ff36](https://github.com/bcoe/yargs/commit/f80ff3642d580d4b68bf9f5a94277481bd027142) Updated image. (@chevex)

### v1.0.0 (2013/11/23 09:33 +00:00)
- [54e31d5](https://github.com/bcoe/yargs/commit/54e31d505f820b80af13644e460894b320bf25a3) Rebranded from optimist to yargs in the spirit of the fork :D (@chevex)
- [4ebb6c5](https://github.com/bcoe/yargs/commit/4ebb6c59f44787db7c24c5b8fe2680f01a23f498) Added documentation for demandCount(). (@chevex)
- [4561ce6](https://github.com/bcoe/yargs/commit/4561ce66dcffa95f49e8b4449b25b94cd68acb25) Simplified the error messages returned by .check(). (@chevex)
- [661c678](https://github.com/bcoe/yargs/commit/661c67886f479b16254a830b7e1db3be29e6b7a6) Fixed an issue with demand not accepting a zero value. (@chevex)
- [731dd3c](https://github.com/bcoe/yargs/commit/731dd3c37624790490bd6df4d5f1da8f4348279e) Add .fail(fn) so death isn't the only option. Should fix issue #39. (@chevex)
- [fa15417](https://github.com/bcoe/yargs/commit/fa15417ff9e70dace0d726627a5818654824c1d8) Added a few missing 'return self' (@chevex)
- [e655e4d](https://github.com/bcoe/yargs/commit/e655e4d99d1ae1d3695ef755d51c2de08d669761) Fix showing help in certain JS environments. (@chevex)
- [a746a31](https://github.com/bcoe/yargs/commit/a746a31cd47c87327028e6ea33762d6187ec5c87) Better string representation of default values. (@chevex)
- [6134619](https://github.com/bcoe/yargs/commit/6134619a7e90b911d5443230b644c5d447c1a68c) Implies: conditional demands (@chevex)
- [046b93b](https://github.com/bcoe/yargs/commit/046b93b5d40a27367af4cb29726e4d781d934639) Added support for JSON config files. (@chevex)
- [a677ec0](https://github.com/bcoe/yargs/commit/a677ec0a0ecccd99c75e571d03323f950688da03) Add .example(cmd, desc) feature. (@chevex)
- [1bd4375](https://github.com/bcoe/yargs/commit/1bd4375e11327ba1687d4bb6e5e9f3c30c1be2af) Added 'defaults' as alias to 'default' so as to avoid usage of a reserved keyword. (@chevex)
- [6b753c1](https://github.com/bcoe/yargs/commit/6b753c16ca09e723060e70b773b430323b29c45c) add .normalize(args..) support for normalizing paths (@chevex)
- [33d7d59](https://github.com/bcoe/yargs/commit/33d7d59341d364f03d3a25f0a55cb99004dbbe4b) Customize error messages with demand(key, msg) (@chevex)
- [647d37f](https://github.com/bcoe/yargs/commit/647d37f164c20f4bafbf67dd9db6cd6e2cd3b49f) Merge branch 'rewrite-duplicate-test' of github.com:isbadawi/node-optimist (@chevex)
- [9059d1a](https://github.com/bcoe/yargs/commit/9059d1ad5e8aea686c2a01c89a23efdf929fff2e) Pass aliases object to check functions for greater versatility. (@chevex)
- [623dc26](https://github.com/bcoe/yargs/commit/623dc26c7331abff2465ef8532e3418996d42fe6) Added ability to count boolean options and rolled minimist library back into project. (@chevex)
- [49f0dce](https://github.com/bcoe/yargs/commit/49f0dcef35de4db544c3966350d36eb5838703f6) Fixed small typo. (@chevex)
- [79ec980](https://github.com/bcoe/yargs/commit/79ec9806d9ca6eb0014cfa4b6d1849f4f004baf2) Removed dependency on wordwrap module. (@chevex)
- [ea14630](https://github.com/bcoe/yargs/commit/ea14630feddd69d1de99dd8c0e08948f4c91f00a) Merge branch 'master' of github.com:chbrown/node-optimist (@chevex)
- [2b75da2](https://github.com/bcoe/yargs/commit/2b75da2624061e0f4f3107d20303c06ec9054906) Merge branch 'master' of github.com:seanzhou1023/node-optimist (@chevex)
- [d9bda11](https://github.com/bcoe/yargs/commit/d9bda1116e26f3b40e833ca9ca19263afea53565) Merge branch 'patch-1' of github.com:thefourtheye/node-optimist (@chevex)
- [d6cc606](https://github.com/bcoe/yargs/commit/d6cc6064a4f1bea38a16a4430b8a1334832fbeff) Renamed README. (@chevex)
- [9498d3f](https://github.com/bcoe/yargs/commit/9498d3f59acfb5e102826503e681623c3a64b178) Renamed readme and added .gitignore. (@chevex)
- [bbd1fe3](https://github.com/bcoe/yargs/commit/bbd1fe37fefa366dde0fb3dc44d91fe8b28f57f5) Included examples for ```help``` and ```showHelp``` functions and fixed few formatting issues (@thefourtheye)
- [37fea04](https://github.com/bcoe/yargs/commit/37fea0470a5796a0294c1dcfff68d8041650e622) .alias({}) behaves differently based on mapping direction when generating descriptions (@chbrown)
- [855b20d](https://github.com/bcoe/yargs/commit/855b20d0be567ca121d06b30bea64001b74f3d6d) Documented function signatures are useful for dynamically typed languages. (@chbrown)

### 0.6.0 (2013/06/25 08:48 +00:00)
- [d37bfe0](https://github.com/bcoe/yargs/commit/d37bfe05ae6d295a0ab481efe4881222412791f4) all tests passing using minimist (@substack)
- [76f1352](https://github.com/bcoe/yargs/commit/76f135270399d01f2bbc621e524a5966e5c422fd) all parse tests now passing (@substack)
- [a7b6754](https://github.com/bcoe/yargs/commit/a7b6754276c38d1565479a5685c3781aeb947816) using minimist, some tests passing (@substack)
- [6655688](https://github.com/bcoe/yargs/commit/66556882aa731cbbbe16cc4d42c85740a2e98099) Give credit where its due (@DeadAlready)
- [602a2a9](https://github.com/bcoe/yargs/commit/602a2a92a459f93704794ad51b115bbb08b535ce) v0.5.3 - Remove wordwrap as dependency (@DeadAlready)

### 0.5.2 (2013/05/31 03:46 +00:00)
- [4497ca5](https://github.com/bcoe/yargs/commit/4497ca55e332760a37b866ec119ded347ca27a87) fixed the whitespace bug without breaking anything else (@substack)
- [5a3dd1a](https://github.com/bcoe/yargs/commit/5a3dd1a4e0211a38613c6e02f61328e1031953fa) failing test for whitespace arg (@substack)

### 0.5.1 (2013/05/30 07:17 +00:00)
- [a20228f](https://github.com/bcoe/yargs/commit/a20228f62a454755dd07f628a7c5759113918327) fix parse() to work with functions before it (@substack)
- [b13bd4c](https://github.com/bcoe/yargs/commit/b13bd4cac856a9821d42fa173bdb58f089365a7d) failing test for parse() with modifiers (@substack)

### 0.5.0 (2013/05/18 21:59 +00:00)
- [c474a64](https://github.com/bcoe/yargs/commit/c474a649231527915c222156e3b40806d365a87c) fixes for dash (@substack)

### 0.4.0 (2013/04/13 19:03 +00:00)
- [dafe3e1](https://github.com/bcoe/yargs/commit/dafe3e18d7c6e7c2d68e06559df0e5cbea3adb14) failing short test (@substack)

### 0.3.7 (2013/04/04 04:07 +00:00)
- [6c7a0ec](https://github.com/bcoe/yargs/commit/6c7a0ec94ce4199a505f0518b4d6635d4e47cc81) Fix for windows. On windows there is no _ in environment. (@hdf)

### 0.3.6 (2013/04/04 04:04 +00:00)
- [e72346a](https://github.com/bcoe/yargs/commit/e72346a727b7267af5aa008b418db89970873f05) Add support for newlines in -a="" arguments (@danielbeardsley)
- [71e1fb5](https://github.com/bcoe/yargs/commit/71e1fb55ea9987110a669ac6ec12338cfff3821c) drop 0.4, add 0.8 to travis (@substack)

### 0.3.5 (2012/10/10 11:09 +00:00)
- [ee692b3](https://github.com/bcoe/yargs/commit/ee692b37554c70a0bb16389a50a26b66745cbbea) Fix parsing booleans (@vojtajina)
- [5045122](https://github.com/bcoe/yargs/commit/5045122664c3f5b4805addf1be2148d5856f7ce8) set $0 properly in the tests (@substack)

### 0.3.4 (2012/04/30 06:54 +00:00)
- [f28c0e6](https://github.com/bcoe/yargs/commit/f28c0e62ca94f6e0bb2e6d82fc3d91a55e69b903) bump for string "true" params (@substack)
- [8f44aeb](https://github.com/bcoe/yargs/commit/8f44aeb74121ddd689580e2bf74ef86a605e9bf2) Fix failing test for aliased booleans. (@coderarity)
- [b9f7b61](https://github.com/bcoe/yargs/commit/b9f7b613b1e68e11e6c23fbda9e555a517dcc976) Add failing test for short aliased booleans. (@coderarity)

### 0.3.3 (2012/04/30 06:45 +00:00)
- [541bac8](https://github.com/bcoe/yargs/commit/541bac8dd787a5f1a5d28f6d8deb1627871705e7) Fixes #37.

### 0.3.2 (2012/04/12 20:28 +00:00)
- [3a0f014](https://github.com/bcoe/yargs/commit/3a0f014c1451280ac1c9caa1f639d31675586eec) travis badge (@substack)
- [4fb60bf](https://github.com/bcoe/yargs/commit/4fb60bf17845f4ce3293f8ca49c9a1a7c736cfce) Fix boolean aliases. (@coderarity)
- [f14dda5](https://github.com/bcoe/yargs/commit/f14dda546efc4fe06ace04d36919bfbb7634f79b) Adjusted package.json to use tap (@jfhbrook)
- [88e5d32](https://github.com/bcoe/yargs/commit/88e5d32295be6e544c8d355ff84e355af38a1c74) test/usage.js no longer hangs (@jfhbrook)
- [e1e740c](https://github.com/bcoe/yargs/commit/e1e740c27082f3ce84deca2093d9db2ef735d0e5) two tests for combined boolean/alias opts parsing (@jfhbrook)

### 0.3.1 (2011/12/31 08:44 +00:00)
- [d09b719](https://github.com/bcoe/yargs/commit/d09b71980ef711b6cf3918cd19beec8257e40e82) If "default" is set to false it was not passed on, fixed. (@wolframkriesing)

### 0.3.0 (2011/12/09 06:03 +00:00)
- [6e74aa7](https://github.com/bcoe/yargs/commit/6e74aa7b46a65773e20c0cb68d2d336d4a0d553d) bump and documented dot notation (@substack)

### 0.2.7 (2011/10/20 02:25 +00:00)
- [94adee2](https://github.com/bcoe/yargs/commit/94adee20e17b58d0836f80e8b9cdbe9813800916) argv._ can be told 'Hey! argv._! Don't be messing with my args.', and it WILL obey (@colinta)
- [c46fdd5](https://github.com/bcoe/yargs/commit/c46fdd56a05410ae4a1e724a4820c82e77ff5469) optimistic critter image (@substack)
- [5c95c73](https://github.com/bcoe/yargs/commit/5c95c73aedf4c7482bd423e10c545e86d7c8a125) alias options() to option() (@substack)
- [f7692ea](https://github.com/bcoe/yargs/commit/f7692ea8da342850af819367833abb685fde41d8) [fix] Fix for parsing boolean edge case (@indexzero)
- [d1f92d1](https://github.com/bcoe/yargs/commit/d1f92d1425bd7f356055e78621b30cdf9741a3c2)
- [b01bda8](https://github.com/bcoe/yargs/commit/b01bda8d86e455bbf74ce497864cb8ab5b9fb847) [fix test] Update to ensure optimist is aware of default booleans. Associated tests included (@indexzero)
- [aa753e7](https://github.com/bcoe/yargs/commit/aa753e7c54fb3a12f513769a0ff6d54aa0f63943) [dist test] Update devDependencies in package.json. Update test pathing to be more npm and require.paths future-proof (@indexzero)
- [7bfce2f](https://github.com/bcoe/yargs/commit/7bfce2f3b3c98e6539e7549d35fbabced7e9341e) s/sys/util/ (@substack)
- [d420a7a](https://github.com/bcoe/yargs/commit/d420a7a9c890d2cdb11acfaf3ea3f43bc3e39f41) update usage output (@substack)
- [cf86eed](https://github.com/bcoe/yargs/commit/cf86eede2e5fc7495b6ec15e6d137d9ac814f075) some sage readme protips about parsing rules (@substack)
- [5da9f7a](https://github.com/bcoe/yargs/commit/5da9f7a5c0e1758ec7c5801fb3e94d3f6e970513) documented all the methods finally (@substack)
- [8ca6879](https://github.com/bcoe/yargs/commit/8ca6879311224b25933642987300f6a29de5c21b) fenced syntax highlighting (@substack)
- [b72bacf](https://github.com/bcoe/yargs/commit/b72bacf1d02594778c1935405bc8137eb61761dc) right-alignment of wrapped extra params (@substack)
- [2b980bf](https://github.com/bcoe/yargs/commit/2b980bf2656b4ee8fc5134dc5f56a48855c35198) now with .wrap() (@substack)
- [d614f63](https://github.com/bcoe/yargs/commit/d614f639654057d1b7e35e3f5a306e88ec2ad1e4) don't show 'Options:' when there aren't any (@substack)
- [691eda3](https://github.com/bcoe/yargs/commit/691eda354df97b5a86168317abcbcaabdc08a0fb) failing test for multi-aliasing (@substack)
- [0826c9f](https://github.com/bcoe/yargs/commit/0826c9f462109feab2bc7a99346d22e72bf774b7) "Options:" > "options:" (@substack)
- [72f7490](https://github.com/bcoe/yargs/commit/72f749025d01b7f295738ed370a669d885fbada0) [minor] Update formatting for `.showHelp()` (@indexzero)
- [75aecce](https://github.com/bcoe/yargs/commit/75aeccea74329094072f95800e02c275e7d999aa) options works again, too lazy to write a proper test right now (@substack)
- [f742e54](https://github.com/bcoe/yargs/commit/f742e5439817c662dc3bd8734ddd6467e6018cfd) line_count_options example, which breaks (@substack)
- [4ca06b8](https://github.com/bcoe/yargs/commit/4ca06b8b4ea99b5d5714b315a2a8576bee6e5537) line count example (@substack)
- [eeb8423](https://github.com/bcoe/yargs/commit/eeb8423e0a5ecc9dc3eb1e6df9f3f8c1c88f920b) remove self.argv setting in boolean (@substack)
- [6903412](https://github.com/bcoe/yargs/commit/69034126804660af9cc20ea7f4457b50338ee3d7) removed camel case for now (@substack)
- [5a0d88b](https://github.com/bcoe/yargs/commit/5a0d88bf23e9fa79635dd034e2a1aa992acc83cd) remove dead longest checking code (@substack)
- [d782170](https://github.com/bcoe/yargs/commit/d782170babf7284b1aa34f5350df0dd49c373fa8) .help() too (@substack)
- [622ec17](https://github.com/bcoe/yargs/commit/622ec17379bb5374fdbb190404c82bc600975791) rm old help generator (@substack)
- [7c8baac](https://github.com/bcoe/yargs/commit/7c8baac4d66195e9f5158503ea9ebfb61153dab7) nub keys (@substack)
- [8197785](https://github.com/bcoe/yargs/commit/8197785ad4762465084485b041abd722f69bf344) generate help message based on the previous calls, todo: nub (@substack)
- [3ffbdc3](https://github.com/bcoe/yargs/commit/3ffbdc33c8f5e83d4ea2ac60575ce119570c7ede) stub out new showHelp, better checks (@substack)
- [d4e21f5](https://github.com/bcoe/yargs/commit/d4e21f56a4830f7de841900d3c79756fb9886184) let .options() take single options too (@substack)
- [3c4cf29](https://github.com/bcoe/yargs/commit/3c4cf2901a29bac119cca8e983028d8669230ec6) .options() is now heaps simpler (@substack)
- [89f0d04](https://github.com/bcoe/yargs/commit/89f0d043cbccd302f10ab30c2069e05d2bf817c9) defaults work again, all tests pass (@substack)
- [dd87333](https://github.com/bcoe/yargs/commit/dd8733365423006a6e4156372ebb55f98323af58) update test error messages, down to 2 failing tests (@substack)
- [53f7bc6](https://github.com/bcoe/yargs/commit/53f7bc626b9875f2abdfc5dd7a80bde7f14143a3) fix for bools doubling up, passes the parse test again, others fail (@substack)
- [2213e2d](https://github.com/bcoe/yargs/commit/2213e2ddc7263226fba717fb041dc3fde9bc2ee4) refactored for an argv getter, failing several tests (@substack)
- [d1e7379](https://github.com/bcoe/yargs/commit/d1e737970f15c6c006bebdd8917706827ff2f0f2) just rescan for now, alias test passes (@substack)
- [b2f8c99](https://github.com/bcoe/yargs/commit/b2f8c99cc477a8eb0fdf4cf178e1785b63185cfd) failing alias test (@substack)
- [d0c0174](https://github.com/bcoe/yargs/commit/d0c0174daa144bfb6dc7290fdc448c393c475e15) .alias() (@substack)
- [d85f431](https://github.com/bcoe/yargs/commit/d85f431ad7d07b058af3f2a57daa51495576c164) [api] Remove `.describe()` in favor of building upon the existing `.usage()` API (@indexzero)
- [edbd527](https://github.com/bcoe/yargs/commit/edbd5272a8e213e71acd802782135c7f9699913a) [doc api] Add `.describe()`, `.options()`, and `.showHelp()` methods along with example. (@indexzero)
- [be4902f](https://github.com/bcoe/yargs/commit/be4902ff0961ae8feb9093f2c0a4066463ded2cf) updates for coffee since it now does argv the node way (@substack)
- [e24cb23](https://github.com/bcoe/yargs/commit/e24cb23798ee64e53b60815e7fda78b87f42390c) more general coffeescript detection (@substack)
- [78ac753](https://github.com/bcoe/yargs/commit/78ac753e5d0ec32a96d39d893272afe989e42a4d) Don't trigger the CoffeeScript hack when running under node_g. (@papandreou)
- [bcfe973](https://github.com/bcoe/yargs/commit/bcfe9731d7f90d4632281b8a52e8d76eb0195ae6) .string() but failing test (@substack)
- [1987aca](https://github.com/bcoe/yargs/commit/1987aca28c7ba4e8796c07bbc547cb984804c826) test hex strings (@substack)
- [ef36db3](https://github.com/bcoe/yargs/commit/ef36db32259b0b0d62448dc907c760e5554fb7e7) more keywords (@substack)
- [cc53c56](https://github.com/bcoe/yargs/commit/cc53c56329960bed6ab077a79798e991711ba01d) Added camelCase function that converts --multi-word-option to camel case (so it becomes argv.multiWordOption). (@papandreou)
- [60b57da](https://github.com/bcoe/yargs/commit/60b57da36797716e5783a633c6d5c79099016d45) fixed boolean bug by rescanning (@substack)
- [dff6d07](https://github.com/bcoe/yargs/commit/dff6d078d97f8ac503c7d18dcc7b7a8c364c2883) boolean examples (@substack)
- [0e380b9](https://github.com/bcoe/yargs/commit/0e380b92c4ef4e3c8dac1da18b5c31d85b1d02c9) boolean() with passing test (@substack)
- [62644d4](https://github.com/bcoe/yargs/commit/62644d4bffbb8d1bbf0c2baf58a1d14a6359ef07) coffee compatibility with node regex for versions too (@substack)
- [430fafc](https://github.com/bcoe/yargs/commit/430fafcf1683d23774772826581acff84b456827) argv._ fixed by fixing the coffee detection (@substack)
- [343b8af](https://github.com/bcoe/yargs/commit/343b8afefd98af274ebe21b5a16b3a949ec5429f) whichNodeArgs test fails too (@substack)
- [63df2f3](https://github.com/bcoe/yargs/commit/63df2f371f31e63d7f1dec2cbf0022a5f08da9d2) replicated mnot's bug in whichNodeEmpty test (@substack)
- [35473a4](https://github.com/bcoe/yargs/commit/35473a4d93a45e5e7e512af8bb54ebb532997ae1) test for ./bin usage (@substack)
- [13df151](https://github.com/bcoe/yargs/commit/13df151e44228eed10e5441c7cd163e086c458a4) don't coerce booleans to numbers (@substack)
- [85f8007](https://github.com/bcoe/yargs/commit/85f8007e93b8be7124feea64b1f1916d8ba1894a) package bump for automatic number conversion (@substack)
- [8f17014](https://github.com/bcoe/yargs/commit/8f170141cded4ccc0c6d67a849c5bf996aa29643) updated readme and examples with new auto-numberification goodness (@substack)
- [73dc901](https://github.com/bcoe/yargs/commit/73dc9011ac968e39b55e19e916084a839391b506) auto number conversion works yay (@substack)
- [bcec56b](https://github.com/bcoe/yargs/commit/bcec56b3d031e018064cbb691539ccc4f28c14ad) failing test for not-implemented auto numification (@substack)
- [ebd2844](https://github.com/bcoe/yargs/commit/ebd2844d683feeac583df79af0e5124a7a7db04e) odd that eql doesn't check types careflly (@substack)
- [fd854b0](https://github.com/bcoe/yargs/commit/fd854b02e512ce854b76386d395672a7969c1bc4) package author + keywords (@substack)
- [656a1d5](https://github.com/bcoe/yargs/commit/656a1d5a1b7c0e49d72e80cb13f20671d56f76c6) updated readme with .default() stuff (@substack)
- [cd7f8c5](https://github.com/bcoe/yargs/commit/cd7f8c55f0b82b79b690d14c5f806851236998a1) passing tests for new .default() behavior (@substack)
- [932725e](https://github.com/bcoe/yargs/commit/932725e39ce65bc91a0385a5fab659a5fa976ac2) new default() thing for setting default key/values (@substack)
- [4e6c7ab](https://github.com/bcoe/yargs/commit/4e6c7aba6374ac9ebc6259ecf91f13af7bce40e3) test for coffee usage (@substack)
- [d54ffcc](https://github.com/bcoe/yargs/commit/d54ffccf2a5a905f51ed5108f7c647f35d64ae23) new --key value style with passing tests. NOTE: changes existing behavior (@substack)
- [ed2a2d5](https://github.com/bcoe/yargs/commit/ed2a2d5d828100ebeef6385c0fb88d146a5cfe9b) package bump for summatix's coffee script fix (@substack)
- [75a975e](https://github.com/bcoe/yargs/commit/75a975eed8430d28e2a79dc9e6d819ad545f4587) Added support for CoffeeScript (@summatix)
- [56b2b1d](https://github.com/bcoe/yargs/commit/56b2b1de8d11f8a2b91979d8ae2d6db02d8fe64d) test coverage for the falsy check() usage (@substack)
- [a4843a9](https://github.com/bcoe/yargs/commit/a4843a9f0e69ffb4afdf6a671d89eb6f218be35d) check bug fixed plus a handy string (@substack)
- [857bd2d](https://github.com/bcoe/yargs/commit/857bd2db933a5aaa9cfecba0ced2dc9b415f8111) tests for demandCount, back up to 100% coverage (@substack)
- [073b776](https://github.com/bcoe/yargs/commit/073b7768ebd781668ef05c13f9003aceca2f5c35) call demandCount from demand (@substack)
- [4bd4b7a](https://github.com/bcoe/yargs/commit/4bd4b7a085c8b6ce1d885a0f486cc9865cee2db1) add demandCount to check for the number of arguments in the _ list (@marshall)
- [b8689ac](https://github.com/bcoe/yargs/commit/b8689ac68dacf248119d242bba39a41cb0adfa07) Rebase checks. That will be its own module eventually. (@substack)
- [e688370](https://github.com/bcoe/yargs/commit/e688370b576f0aa733c3f46183df69e1b561668e) a $0 like in perl (@substack)
- [2e5e196](https://github.com/bcoe/yargs/commit/2e5e1960fc19afb21fb3293752316eaa8bcd3609) usage test hacking around process and console (@substack)
- [fcc3521](https://github.com/bcoe/yargs/commit/fcc352163fbec6a1dfe8caf47a0df39de24fe016) description pun (@substack)
- [87a1fe2](https://github.com/bcoe/yargs/commit/87a1fe29037ca2ca5fefda85141aaeb13e8ce761) mit/x11 license (@substack)
- [8d089d2](https://github.com/bcoe/yargs/commit/8d089d24cd687c0bde3640a96c09b78f884900dd) bool example is more consistent and also shows off short option grouping (@substack)
- [448d747](https://github.com/bcoe/yargs/commit/448d7473ac68e8e03d8befc9457b0d9e21725be0) start of the readme and examples (@substack)
- [da74dea](https://github.com/bcoe/yargs/commit/da74dea799a9b59dbf022cbb8001bfdb0d52eec9) more tests for long and short captures (@substack)
- [ab6387e](https://github.com/bcoe/yargs/commit/ab6387e6769ca4af82ca94c4c67c7319f0d9fcfa) silly bug in the tests with s/not/no/, all tests pass now (@substack)
- [102496a](https://github.com/bcoe/yargs/commit/102496a319e8e06f6550d828fc2f72992c7d9ecc) hack an instance for process.argv onto Argv so the export can be called to create an instance or used for argv, which is the most common case (@substack)
- [a01caeb](https://github.com/bcoe/yargs/commit/a01caeb532546d19f68f2b2b87f7036cfe1aaedd) divide example (@substack)
- [443da55](https://github.com/bcoe/yargs/commit/443da55736acbaf8ff8b04d1b9ce19ab016ddda2) start of the lib with a package.json (@substack)
