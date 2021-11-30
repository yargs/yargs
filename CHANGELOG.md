# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.0.0 (2021-11-30)


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
* tweaks to ESM/Deno API surface: now exports yargs function by default; getProcessArgvWithoutBin becomes hidBin; types now exported for Deno.
* find-up replaced with escalade; export map added (limits importable files in Node >= 12); yarser-parser@19.x.x (new decamelize/camelcase implementation).
* **usage:** single character aliases are now shown first in help output
* **ts:** yargs now ships with its own types
* drop support for EOL Node 8 (#1686)
* **deps:** 15.2.0
* **deps:** yargs-parser@17.0.0 no longer implicitly creates arrays out of boolean arguments when duplicates are provided
* **deps:** yargs-parser now throws on invalid combinations of config (#1470)
* yargs-parser@16.0.0 drops support for Node 6
* drop Node 6 support (#1461)
* remove package.json-based parserConfiguration (#1460)
* previously to this fix methods like `yargs.getOptions()` contained the state of the last command to execute.
* do not allow additional positionals in strict mode
* options with leading '+' or '0' now parse as strings
* dropping Node 6 which hits end of life in April 2019
* see [yargs-parser@12.0.0 CHANGELOG](https://github.com/yargs/yargs-parser/blob/master/CHANGELOG.md#breaking-changes)
* we now warn if the yargs stanza package.json is used.
* Options absent from `argv` (not set via CLI argument) are now absent from the parsed result object rather tahn being set with `undefined`
* drop Node 6 from testing matrix, such that we'll gradually start drifting away from supporting Node 4.
* yargs-parser does not populate 'false' when boolean flag is not passed
* tests that assert against help output will need to be updated
* requiresArg now has significantly different error output, matching nargs.
* .usage() no longer accepts an options object as the second argument. It can instead be used as an alias for configuring a default command.
* previously hidden options were simply implied using a falsy description
* help command now only executes if it's the last positional in argv._
* version() and help() are now enabled by default, and show up in help output; the implicit help command can no longer be enabled/disabled independently from the help command itself (which can now be disabled).
* environment variables will now override config files, '--' is now populated rather than '_' when parsing is stopped.
* extends functionality now always loads the JSON provided, rather than reading from a specific key
* this pull requests introduces language features that require Node 4+.

### Features

* .usage() can now be used to configure a default command ([#975](https://github.com/yargs/yargs/issues/975)) ([7269531](https://github.com/yargs/yargs/commit/72695316e02ae7e5cd0a78897dd0748068e345fc))
* Add `.parserConfiguration()` method, deprecating package.json config ([#1262](https://github.com/yargs/yargs/issues/1262)) ([3c6869a](https://github.com/yargs/yargs/commit/3c6869aae7b488d2416f66c19a801c06243c075c))
* add applyBeforeValidation, for applying sync middleware before validation ([5be206a](https://github.com/yargs/yargs/commit/5be206ac9ecd096531ed1726032484e7884293a8))
* add commands alias (similar to options function) ([#1850](https://github.com/yargs/yargs/issues/1850)) ([00b74ad](https://github.com/yargs/yargs/commit/00b74adcb30ab89b4450ef7105ef1ad32d820ebf))
* add missing simple chinese locale strings ([#1004](https://github.com/yargs/yargs/issues/1004)) ([3cc24ec](https://github.com/yargs/yargs/commit/3cc24ecd49b2c29ee70af6cdab5a3f014d613576))
* add Norwegian Nynorsk translations ([#1028](https://github.com/yargs/yargs/issues/1028)) ([a5ac213](https://github.com/yargs/yargs/commit/a5ac2133f712a546c88bb00e2443bb9aeb82d0ac))
* add parseSync/parseAsync method ([#1898](https://github.com/yargs/yargs/issues/1898)) ([6130ad8](https://github.com/yargs/yargs/commit/6130ad89b85dc49e34190e596e14a2fd3e668781))
* add support for `showVersion`, similar to `showHelp` ([#1831](https://github.com/yargs/yargs/issues/1831)) ([1a1e2d5](https://github.com/yargs/yargs/commit/1a1e2d554dca3566bc174584394419be0120d207))
* add support for global middleware, useful for shared tasks like metrics ([#1119](https://github.com/yargs/yargs/issues/1119)) ([9d71ac7](https://github.com/yargs/yargs/commit/9d71ac745baeaf5f5277dd5aef6b4b4316acfafb))
* add usage for single-digit boolean aliases ([#1580](https://github.com/yargs/yargs/issues/1580)) ([6014e39](https://github.com/yargs/yargs/commit/6014e39bca3a1e8445aa0fb2a435f6181e344c45))
* adds config option for sorting command output ([#1256](https://github.com/yargs/yargs/issues/1256)) ([6916ce9](https://github.com/yargs/yargs/commit/6916ce9a548c4f0ccd80740a0d85c6e7c567ff84))
* adds deprecation option for commands ([027a636](https://github.com/yargs/yargs/commit/027a6365b737e13116811a8ef43670196e1fa00a))
* adds strictOptions() ([#1738](https://github.com/yargs/yargs/issues/1738)) ([b215fba](https://github.com/yargs/yargs/commit/b215fba0ed6e124e5aad6cf22c8d5875661c63a3))
* adds support for async builder ([#1888](https://github.com/yargs/yargs/issues/1888)) ([ade29b8](https://github.com/yargs/yargs/commit/ade29b864abecaa8c4f8dcc3493f5eb24fb73d84)), closes [#1042](https://github.com/yargs/yargs/issues/1042)
* adds support for ESM and Deno ([#1708](https://github.com/yargs/yargs/issues/1708)) ([ac6d5d1](https://github.com/yargs/yargs/commit/ac6d5d105a75711fe703f6a39dad5181b383d6c6))
* adds support for multiple epilog messages ([#1384](https://github.com/yargs/yargs/issues/1384)) ([07a5554](https://github.com/yargs/yargs/commit/07a5554c480ff3aa43cdc37b1d4ecbaf2687c779))
* allow calling standard completion function from custom one ([#1855](https://github.com/yargs/yargs/issues/1855)) ([31765cb](https://github.com/yargs/yargs/commit/31765cbdce812ee5c16aaae70ab523a2c7e0fcec))
* allow completionCommand to be set via showCompletionScript ([#1385](https://github.com/yargs/yargs/issues/1385)) ([5562853](https://github.com/yargs/yargs/commit/55628535a242979adcf189d917082083edb2ad56))
* allow default completion to be referenced and modified, in custom completion ([#1878](https://github.com/yargs/yargs/issues/1878)) ([01619f6](https://github.com/yargs/yargs/commit/01619f6191a3ab16bf6b77456d4e9dfa80533907))
* allow extends to inherit from a module ([#865](https://github.com/yargs/yargs/issues/865)) ([89456d9](https://github.com/yargs/yargs/commit/89456d994216466da2be929d81d3fb936005ae96))
* allow hidden options to be displayed with --show-hidden ([#1061](https://github.com/yargs/yargs/issues/1061)) ([ea862ae](https://github.com/yargs/yargs/commit/ea862ae551b8e973534c1fc0248bc85fd8a01c7a))
* allow implies and conflicts to accept array values ([#922](https://github.com/yargs/yargs/issues/922)) ([abdc7da](https://github.com/yargs/yargs/commit/abdc7da9d60e48b105034a255f62e3d6f10c6650))
* allow parse with no arguments as alias for yargs.argv ([#944](https://github.com/yargs/yargs/issues/944)) ([a9f03e7](https://github.com/yargs/yargs/commit/a9f03e712a2176d348c34def80d7107adda2ba0e))
* allow setting scriptName $0 ([#1143](https://github.com/yargs/yargs/issues/1143)) ([a2f2eae](https://github.com/yargs/yargs/commit/a2f2eae2235fa9b10ce221aea1320b1dfc564efa))
* async command handlers ([#1001](https://github.com/yargs/yargs/issues/1001)) ([241124b](https://github.com/yargs/yargs/commit/241124ba4bfad505363433453c51e22c4e4f2baf))
* **async:** add support for async check and coerce ([#1872](https://github.com/yargs/yargs/issues/1872)) ([8b95f57](https://github.com/yargs/yargs/commit/8b95f57bb2a49b098c6bf23cea88c6f900a34f89))
* autocomplete choices for options ([#2018](https://github.com/yargs/yargs/issues/2018)) ([01b2c6a](https://github.com/yargs/yargs/commit/01b2c6a99167d826d3d1e6f6b94f18382a17d47e))
* command() now accepts an array of modules ([f415388](https://github.com/yargs/yargs/commit/f415388cc454d02786c65c50dd6c7a0cf9d8b842))
* complete short options with a single dash ([#1507](https://github.com/yargs/yargs/issues/1507)) ([99011ab](https://github.com/yargs/yargs/commit/99011ab5ba90232506ece0a17e59e2001a1ab562))
* **completion:** takes negated flags into account when boolean-negation is set ([#1509](https://github.com/yargs/yargs/issues/1509)) ([7293ad5](https://github.com/yargs/yargs/commit/7293ad50d20ea0fb7dd1ac9b925e90e1bd95dea8))
* deprecateOption ([#1559](https://github.com/yargs/yargs/issues/1559)) ([8aae333](https://github.com/yargs/yargs/commit/8aae3332251d09fa136db17ef4a40d83fa052bc4))
* **deps:** introduce yargs-parser with support for unknown-options-as-args ([#1440](https://github.com/yargs/yargs/issues/1440)) ([4d21520](https://github.com/yargs/yargs/commit/4d21520ca487b65f2ace422c323aaecb2be1c8a6))
* **deps:** pull in yargs-parser@17.0.0 ([#1553](https://github.com/yargs/yargs/issues/1553)) ([b9409da](https://github.com/yargs/yargs/commit/b9409da199ebca515a848489c206b807fab2e65d))
* **deps:** yargs-parser now throws on invalid combinations of config ([#1470](https://github.com/yargs/yargs/issues/1470)) ([c10c38c](https://github.com/yargs/yargs/commit/c10c38cca04298f96b55a7e374a9a134abefffa7))
* **deps:** yargs-parser with 'greedy-array' configuration ([#1569](https://github.com/yargs/yargs/issues/1569)) ([a03a320](https://github.com/yargs/yargs/commit/a03a320dbf5c0ce33d829a857fc04a651c0bb53e))
* **deps:** yargs-parser with support for collect-unknown-options ([#1421](https://github.com/yargs/yargs/issues/1421)) ([d388a7c](https://github.com/yargs/yargs/commit/d388a7cbb03b5e74bc07b4b48789511fe1306a0a))
* display appropriate $0 for electron apps ([#1536](https://github.com/yargs/yargs/issues/1536)) ([d0e4379](https://github.com/yargs/yargs/commit/d0e437912917d6a66bb5128992fa2f566a5f830b))
* drop support for EOL Node 8 ([#1686](https://github.com/yargs/yargs/issues/1686)) ([863937f](https://github.com/yargs/yargs/commit/863937f23c3102f804cdea78ee3097e28c7c289f))
* enable .help() and .version() by default ([#912](https://github.com/yargs/yargs/issues/912)) ([1ef44e0](https://github.com/yargs/yargs/commit/1ef44e03ef1a2779f92bd979984a6bab3a671ee9))
* expose `Parser` from `require('yargs/yargs')` ([#1477](https://github.com/yargs/yargs/issues/1477)) ([1840ba2](https://github.com/yargs/yargs/commit/1840ba22f1a24c0ece8e32bbd31db4134a080aee))
* expose hideBin helper for CJS ([#1768](https://github.com/yargs/yargs/issues/1768)) ([63e1173](https://github.com/yargs/yargs/commit/63e1173bb47dc651c151973a16ef659082a9ae66))
* extend *.rc files in addition to json ([#1080](https://github.com/yargs/yargs/issues/1080)) ([11691a6](https://github.com/yargs/yargs/commit/11691a670b384e3dce2ee61fc92e6b6965079708))
* fallback to default bash completion ([74c0ba5](https://github.com/yargs/yargs/commit/74c0ba5cfcc59afa5538de821fad70e1a76a354e))
* **helpers:** rebase, Parser, applyExtends now blessed helpers ([#1733](https://github.com/yargs/yargs/issues/1733)) ([c7debe8](https://github.com/yargs/yargs/commit/c7debe8eb1e5bc6ea20b5ed68026c56e5ebec9e1))
* hidden options are now explicitly indicated using "hidden" flag ([#962](https://github.com/yargs/yargs/issues/962)) ([280d0d6](https://github.com/yargs/yargs/commit/280d0d6bd1035b91254db876281c1ae755520f07))
* i18n for ESM and Deno ([#1735](https://github.com/yargs/yargs/issues/1735)) ([c71783a](https://github.com/yargs/yargs/commit/c71783a5a898a0c0e92ac501c939a3ec411ac0c1))
* **i18n:** swap out os-locale dependency for simple inline implementation ([#1356](https://github.com/yargs/yargs/issues/1356)) ([4dfa19b](https://github.com/yargs/yargs/commit/4dfa19b3275cbd74ed686c437d392c4612e237a4))
* improve support for async/await ([#1823](https://github.com/yargs/yargs/issues/1823)) ([169b815](https://github.com/yargs/yargs/commit/169b815df7ae190965f04030f28adc3ab92bb4b5))
* introduce .positional() for configuring positional arguments ([#967](https://github.com/yargs/yargs/issues/967)) ([cb16460](https://github.com/yargs/yargs/commit/cb16460bffeb13d54215de45c09dbe4708aee770))
* introduces strictCommands() subset of strict mode ([#1540](https://github.com/yargs/yargs/issues/1540)) ([1d4cca3](https://github.com/yargs/yargs/commit/1d4cca395a98b395e6318f0505fc73bef8b01350))
* **lang:** add Finnish localization (language code fi) ([222c8fe](https://github.com/yargs/yargs/commit/222c8fef2e2ad46e314c337dec96940f896bec35))
* **locale:** add Ukrainian locale ([#1893](https://github.com/yargs/yargs/issues/1893)) ([c872dfc](https://github.com/yargs/yargs/commit/c872dfc1d87ebaa7fcc79801f649318a16195495))
* **locales:** Added Uzbek translation ([#2024](https://github.com/yargs/yargs/issues/2024)) ([ee047b9](https://github.com/yargs/yargs/commit/ee047b9cd6260ce90d845e7e687228e617c8a30d))
* make it possible to merge configurations when extending other config. ([#1411](https://github.com/yargs/yargs/issues/1411)) ([5d7ad98](https://github.com/yargs/yargs/commit/5d7ad989a851398587a0349cdd15344769b4cd79))
* middleware ([#881](https://github.com/yargs/yargs/issues/881)) ([77b8dbc](https://github.com/yargs/yargs/commit/77b8dbc495b926ef2dbc9d839882c828b8dad29b))
* **middleware:** async middleware can now be used before validation. ([e0f9363](https://github.com/yargs/yargs/commit/e0f93636e04fa7e02a2c3b1fe465b6a14aa1f06d))
* **middleware:** global middleware now applied when no command is configured. ([e0f9363](https://github.com/yargs/yargs/commit/e0f93636e04fa7e02a2c3b1fe465b6a14aa1f06d))
* multiple usage calls are now collected, not replaced ([#958](https://github.com/yargs/yargs/issues/958)) ([74a38b2](https://github.com/yargs/yargs/commit/74a38b2646478c301a17498afa36a832277e5b9c))
* **node:** drop Node 10 ([#1919](https://github.com/yargs/yargs/issues/1919)) ([5edeb9e](https://github.com/yargs/yargs/commit/5edeb9ea17b1f0190a3590508f2e7911b5f70659))
* onFinishCommand handler ([#1473](https://github.com/yargs/yargs/issues/1473)) ([fe380cd](https://github.com/yargs/yargs/commit/fe380cd356aa33aef0449facd59c22cab8930ac9))
* options/positionals with leading '+' and '0' no longer parse as numbers ([#1286](https://github.com/yargs/yargs/issues/1286)) ([e9dc3aa](https://github.com/yargs/yargs/commit/e9dc3aaf7b9d0fe07bfbe28ec347db7d959cbf0b))
* remove `setPlaceholderKeys` ([#1105](https://github.com/yargs/yargs/issues/1105)) ([6ee2c82](https://github.com/yargs/yargs/commit/6ee2c82df515cb1b062e4135a5dd9c386fed2b21))
* replace /bin/bash with file basename ([#983](https://github.com/yargs/yargs/issues/983)) ([20bb99b](https://github.com/yargs/yargs/commit/20bb99b25630594542577133d51e38a4c6712d31))
* requiresArg is now simply an alias for nargs(1) ([#1054](https://github.com/yargs/yargs/issues/1054)) ([a3ddacc](https://github.com/yargs/yargs/commit/a3ddacc87e6cbb8a275f97d746511fe1d1f93044))
* support array of examples ([#1682](https://github.com/yargs/yargs/issues/1682)) ([225ab82](https://github.com/yargs/yargs/commit/225ab8271938bed3a48d23175f3d580ce8cd1306))
* support defaultDescription for positional arguments ([812048c](https://github.com/yargs/yargs/commit/812048ccaa31ac0db072d13589ef5af8cd1474c6))
* support promises in middleware ([f3a4e4f](https://github.com/yargs/yargs/commit/f3a4e4f7531d74668a07be87f45dc497d4d08c4b))
* to allow both undefined and nulls, for benefit of TypeScript  ([#945](https://github.com/yargs/yargs/issues/945)) ([792564d](https://github.com/yargs/yargs/commit/792564d954d5143b2b57b05aaca4007780f5b728))
* **translation:** Update pl-PL translations ([#985](https://github.com/yargs/yargs/issues/985)) ([5a9c986](https://github.com/yargs/yargs/commit/5a9c98643333799e04fc78c5797fad0ecfefde86))
* tweaks to API surface based on user feedback ([#1726](https://github.com/yargs/yargs/issues/1726)) ([4151fee](https://github.com/yargs/yargs/commit/4151fee4c33a97d26bc40de7e623e5b0eb87e9bb))
* update Levenshtein to Damerau-Levenshtein ([#1973](https://github.com/yargs/yargs/issues/1973)) ([d2c121b](https://github.com/yargs/yargs/commit/d2c121b00f2e1eb2ea8cc3a23a5039b3a4425bea))
* **usage:** single char aliases first in help ([#1574](https://github.com/yargs/yargs/issues/1574)) ([a552990](https://github.com/yargs/yargs/commit/a552990c120646c2d85a5c9b628e1ce92a68e797))
* **yargs-parser:** introduce single-digit boolean aliases ([#1576](https://github.com/yargs/yargs/issues/1576)) ([3af7f04](https://github.com/yargs/yargs/commit/3af7f04cdbfcbd4b3f432aca5144d43f21958c39))
* zsh auto completion ([#1292](https://github.com/yargs/yargs/issues/1292)) ([16c5d25](https://github.com/yargs/yargs/commit/16c5d25c00d2cd1c055987837601f7154a7b41b3)), closes [#1156](https://github.com/yargs/yargs/issues/1156)


### Bug Fixes

* __proto__ will now be replaced with ___proto___ in parse ([#1591](https://github.com/yargs/yargs/issues/1591)) ([2474c38](https://github.com/yargs/yargs/commit/2474c3889dcae42ddc031f0ac3872d306bf99e6b))
* .argv and .parse() now invoke identical code path ([#1126](https://github.com/yargs/yargs/issues/1126)) ([f13ebf4](https://github.com/yargs/yargs/commit/f13ebf4314225bdd9abb2b117cfb7fec0efaf1a3))
* 'undefined' default value for choices resulted in validation failing ([782b896](https://github.com/yargs/yargs/commit/782b89690ecc22f969f381f8eff7e69413f2cbc5))
* 'undefined' should be taken to mean no argument was provided ([#1015](https://github.com/yargs/yargs/issues/1015)) ([c679e90](https://github.com/yargs/yargs/commit/c679e907d1a19d0858698fdd9fa882d10c4ba5a3))
* $0 contains first arg in bundled electron apps ([#1206](https://github.com/yargs/yargs/issues/1206)) ([567820b](https://github.com/yargs/yargs/commit/567820b4eed518ffc3651ffb206a03e12ba10eff))
* accept single function for middleware ([66fd6f7](https://github.com/yargs/yargs/commit/66fd6f7e9831008eab6742c7782f2e255b838ea7))
* Add `dirname` sanity check on `findUp` ([#1036](https://github.com/yargs/yargs/issues/1036)) ([331d103](https://github.com/yargs/yargs/commit/331d10305af3991bd225fbd7a1060bf43cff22d3))
* add package.json to module exports ([#1818](https://github.com/yargs/yargs/issues/1818)) ([d783a49](https://github.com/yargs/yargs/commit/d783a49a7f21c9bbd4eec2990268f3244c4d5662)), closes [#1817](https://github.com/yargs/yargs/issues/1817)
* add zsh script to files array ([3180224](https://github.com/yargs/yargs/commit/318022499b2d35d1bf4448cd1dbb313fb4c30764))
* address ambiguity between nargs of 1 and requiresArg ([#1572](https://github.com/yargs/yargs/issues/1572)) ([a5edc32](https://github.com/yargs/yargs/commit/a5edc328ecb3f90d1ba09cfe70a0040f68adf50a))
* address bug with handling of arrays of implications ([c240661](https://github.com/yargs/yargs/commit/c240661c27a69fdd2bae401919a9ad31ccd1be01))
* address issues with dutch translation ([#1316](https://github.com/yargs/yargs/issues/1316)) ([0295132](https://github.com/yargs/yargs/commit/02951325c6ea93865b9eeb426828350cc595ed3f))
* allows camel-case, variadic arguments, and strict mode to be combined ([#1247](https://github.com/yargs/yargs/issues/1247)) ([eacc035](https://github.com/yargs/yargs/commit/eacc03568e0ecb9fa1f2224e77d2ad2ba38d7960))
* always cache help message when running commands ([#1865](https://github.com/yargs/yargs/issues/1865)) ([d57ca77](https://github.com/yargs/yargs/commit/d57ca7751d533d7e0f216cd9fbf7c2b0ec98f791)), closes [#1853](https://github.com/yargs/yargs/issues/1853)
* async middleware was called twice ([#1422](https://github.com/yargs/yargs/issues/1422)) ([9a42b63](https://github.com/yargs/yargs/commit/9a42b6380c92a3528a1e47ebf2ed0354e723fea2))
* **async:** don't call parse callback until async ops complete ([#1896](https://github.com/yargs/yargs/issues/1896)) ([a93f5ff](https://github.com/yargs/yargs/commit/a93f5ff35d7c09b01e0ca93d7d855d2b26593165)), closes [#1888](https://github.com/yargs/yargs/issues/1888)
* avoid legacy accessors ([#2013](https://github.com/yargs/yargs/issues/2013)) ([adb0d11](https://github.com/yargs/yargs/commit/adb0d11e02c613af3d9427b3028cc192703a3869))
* better bash path completion ([#1272](https://github.com/yargs/yargs/issues/1272)) ([da75ea2](https://github.com/yargs/yargs/commit/da75ea2a5bac2bca8af278688785298054f54bd3))
* boolean option should work with strict ([#1996](https://github.com/yargs/yargs/issues/1996)) ([e9379e2](https://github.com/yargs/yargs/commit/e9379e27d49820f4db842f22cda6410bbe2bff10))
* **builder:** apply default builder for showHelp/getHelp ([#1913](https://github.com/yargs/yargs/issues/1913)) ([395bb67](https://github.com/yargs/yargs/commit/395bb67749787d269cabe80ffc3133c2f6958aeb)), closes [#1912](https://github.com/yargs/yargs/issues/1912)
* **builder:** nested builder is now awaited ([#1925](https://github.com/yargs/yargs/issues/1925)) ([b5accd6](https://github.com/yargs/yargs/commit/b5accd64ccbd3ffb800517fb40d0f59382515fbb))
* **build:** Node 12 is now minimum version ([#1936](https://github.com/yargs/yargs/issues/1936)) ([0924566](https://github.com/yargs/yargs/commit/09245666e57facb140e0b45a9e45ca704883e5dd))
* calling parse multiple times now appropriately maintains state ([#1137](https://github.com/yargs/yargs/issues/1137)) ([#1369](https://github.com/yargs/yargs/issues/1369)) ([026b151](https://github.com/yargs/yargs/commit/026b1514d47d92f8ea1a3811862013500ff12b57))
* cast error types as TypeScript 4.4 infers them as unknown instead of any ([#2016](https://github.com/yargs/yargs/issues/2016)) ([01b2c6a](https://github.com/yargs/yargs/commit/01b2c6a99167d826d3d1e6f6b94f18382a17d47e))
* choose correct config directory when require.main does not exist ([#1056](https://github.com/yargs/yargs/issues/1056)) ([a04678c](https://github.com/yargs/yargs/commit/a04678ca0ab9ac7119e6e72b2a657a8a3eaf7818))
* code was not passed to process.exit ([#1742](https://github.com/yargs/yargs/issues/1742)) ([d1a9930](https://github.com/yargs/yargs/commit/d1a993035a2f76c138460052cf19425f9684b637))
* coerce middleware should be applied once ([#1978](https://github.com/yargs/yargs/issues/1978)) ([14bd6be](https://github.com/yargs/yargs/commit/14bd6bebc3027ae929106b20dd198b9dccdeec31))
* **coerce:** options using coerce now displayed in help ([#1911](https://github.com/yargs/yargs/issues/1911)) ([d2128cc](https://github.com/yargs/yargs/commit/d2128cc4ffd411eed7111e6a3c561948330e4f6f)), closes [#1909](https://github.com/yargs/yargs/issues/1909)
* **command:** Run default cmd even if the only cmd ([#950](https://github.com/yargs/yargs/issues/950)) ([7b22203](https://github.com/yargs/yargs/commit/7b22203934966d35ec38020ce6893682dea0dac4))
* completion script name clashing on bash ([#1903](https://github.com/yargs/yargs/issues/1903)) ([8f62d9a](https://github.com/yargs/yargs/commit/8f62d9a9e8bebf86f988c100ad3c417dc32b2471))
* **completion:** Avoid default command and recommendations during completion ([#1123](https://github.com/yargs/yargs/issues/1123)) ([036e7c5](https://github.com/yargs/yargs/commit/036e7c5dfc6f0bb91a7609aac69d529a5e6cfb9f))
* config and normalise can be disabled with false ([#952](https://github.com/yargs/yargs/issues/952)) ([3bb8771](https://github.com/yargs/yargs/commit/3bb8771876e6c62e7e44b64d62f12a8ede9120ab))
* conflicts and strip-dashed ([#1998](https://github.com/yargs/yargs/issues/1998)) ([59a86fb](https://github.com/yargs/yargs/commit/59a86fb83cfeb8533c6dd446c73cf4166cc455f2))
* defaulting keys to 'undefined' interfered with conflicting key logic ([a8e0cff](https://github.com/yargs/yargs/commit/a8e0cffbdd36eda0b6f93ca48f0ccfcf6e4af355))
* **deno:** get yargs working on deno@1.5.x ([#1799](https://github.com/yargs/yargs/issues/1799)) ([cb01c98](https://github.com/yargs/yargs/commit/cb01c98c44e30f55c2dc9434caef524ae433d9a4))
* **deno:** update types for deno ^1.4.0 ([#1772](https://github.com/yargs/yargs/issues/1772)) ([0801752](https://github.com/yargs/yargs/commit/080175207d281be63edf90adfe4f0568700b0bf5))
* **deno:** use actual names for keys instead of inferring ([#1891](https://github.com/yargs/yargs/issues/1891)) ([b96ef01](https://github.com/yargs/yargs/commit/b96ef01b16bc5377b79d7914dd5495068037fe7b))
* **dependencies:** upgrade yargs-parser to fix [#1602](https://github.com/yargs/yargs/issues/1602)  ([#1603](https://github.com/yargs/yargs/issues/1603)) ([c67c257](https://github.com/yargs/yargs/commit/c67c257cdf2b79af117cfd1b3938881c8f3e0677))
* **deps:** cliui, find-up, and string-width, all drop Node 6 support ([#1479](https://github.com/yargs/yargs/issues/1479)) ([6a9ebe2](https://github.com/yargs/yargs/commit/6a9ebe2d955e3e979e76c07ffbb1c17fef64cb49))
* **deps:** fix enumeration for normalized path arguments ([#1567](https://github.com/yargs/yargs/issues/1567)) ([0b5b1b0](https://github.com/yargs/yargs/commit/0b5b1b0e5f4f9baf393c48e9cc2bc85c1b67a47a))
* **deps:** update dependency yargs-parser to v21 ([#2063](https://github.com/yargs/yargs/issues/2063)) ([76c1951](https://github.com/yargs/yargs/commit/76c19518d74ca94c0edcd450e5c0ef9efeee369d))
* **deps:** Update os-locale to avoid security vulnerability ([#1270](https://github.com/yargs/yargs/issues/1270)) ([27bf739](https://github.com/yargs/yargs/commit/27bf73923423dbe84dd2fd282fdd31d26bdb6cee))
* **deps:** upgrade cliui for compatibility with latest chalk. ([#1330](https://github.com/yargs/yargs/issues/1330)) ([b20db65](https://github.com/yargs/yargs/commit/b20db651cdfe6c8899e11295b43cae694b91e744))
* **deps:** use decamelize from npm instead of vendored copy ([#1377](https://github.com/yargs/yargs/issues/1377)) ([015eeb9](https://github.com/yargs/yargs/commit/015eeb9eec7f89c74140722c9587e334e6596f82))
* **deps:** yargs-parser update addressing several parsing bugs ([#1357](https://github.com/yargs/yargs/issues/1357)) ([e230d5b](https://github.com/yargs/yargs/commit/e230d5bfd947fcc1bc6007cad59973cbd3f49b01))
* detect zsh when zsh isnt run as a login prompt ([#1395](https://github.com/yargs/yargs/issues/1395)) ([8792d13](https://github.com/yargs/yargs/commit/8792d13445458c51bdff6612b1edda5aa344b6a0))
* do not allow additional positionals in strict mode ([35d777c](https://github.com/yargs/yargs/commit/35d777c8db9548763a8f00c95bbd56a9c0f31084))
* **docs:** broken markdown link ([#1426](https://github.com/yargs/yargs/issues/1426)) ([236e24e](https://github.com/yargs/yargs/commit/236e24ef74cb32ff22f3d82a808333ec666d3c22))
* **docs:** describe usage of `.check()` in more detail ([932cd11](https://github.com/yargs/yargs/commit/932cd1177e93f5cc99edfe57a4028e30717bf8fb))
* **docs:** fix incorrect parserConfiguration documentation ([2a99124](https://github.com/yargs/yargs/commit/2a99124d2b388fb32e34886898efc4b624f4e26e))
* **docs:** formalize existing callback argument to showHelp ([#1386](https://github.com/yargs/yargs/issues/1386)) ([d217764](https://github.com/yargs/yargs/commit/d2177645834007a03ecc1a5163b1cd248b3eaf1f))
* **docs:** stop advertising .argv property ([#2036](https://github.com/yargs/yargs/issues/2036)) ([4f5ecc1](https://github.com/yargs/yargs/commit/4f5ecc1427ed6c83f23ea90ee6da75ce0c332f7a)), closes [#2035](https://github.com/yargs/yargs/issues/2035)
* **docs:** TypeScript import to prevent a future major release warning ([#1441](https://github.com/yargs/yargs/issues/1441)) ([b1b156a](https://github.com/yargs/yargs/commit/b1b156a3eb4ddd6803fbbd56c611a77919293000))
* **docs:** update boolean description and examples in docs ([#1474](https://github.com/yargs/yargs/issues/1474)) ([afd5b48](https://github.com/yargs/yargs/commit/afd5b4871bfeb90d58351ac56c5c44a83ef033e6))
* **docs:** use recommended cjs import syntax for ts examples ([#1513](https://github.com/yargs/yargs/issues/1513)) ([f9a18bf](https://github.com/yargs/yargs/commit/f9a18bfd624a5013108084f690cd8a1de794c430))
* don't bother calling JSON.stringify() on string default values ([#891](https://github.com/yargs/yargs/issues/891)) ([628be21](https://github.com/yargs/yargs/commit/628be21f4300852fb3f905264b222673fbd160f3))
* don't fail if "fileURLToPath(import.meta.url)" throws ([3a44796](https://github.com/yargs/yargs/commit/3a44796c84e3cb60769841d5883448a396227ade))
* don't load config when processing positionals ([5d0dc92](https://github.com/yargs/yargs/commit/5d0dc9249551afa32d699394902e9adc43624c68))
* emit warning on version name collision ([#1986](https://github.com/yargs/yargs/issues/1986)) ([d0e8292](https://github.com/yargs/yargs/commit/d0e829239580bd44873bbde65de2ed7671aa2ab0))
* **examples:** fix usage-options.js to reflect current API ([#1375](https://github.com/yargs/yargs/issues/1375)) ([6e5b76b](https://github.com/yargs/yargs/commit/6e5b76b3a0c2a0abf9e5b1b7273ffd4427352c2d))
* exclude positional arguments from completion output ([#927](https://github.com/yargs/yargs/issues/927)) ([71c7ec7](https://github.com/yargs/yargs/commit/71c7ec72bc18ff8a449522c3b9b4ee293cf25e49))
* exclude positionals from default completion ([#1881](https://github.com/yargs/yargs/issues/1881)) ([0175677](https://github.com/yargs/yargs/commit/0175677b79ffe50a9c5477631288ae10120b8a32))
* **exports:** node 13.0-13.6 require a string fallback ([#1776](https://github.com/yargs/yargs/issues/1776)) ([b45c43a](https://github.com/yargs/yargs/commit/b45c43a5f64b565c3794f9792150eaeec4e00b69))
* expose helpers for legacy versions of Node.js ([#1801](https://github.com/yargs/yargs/issues/1801)) ([107deaa](https://github.com/yargs/yargs/commit/107deaa4f68b7bc3f2386041e1f4fe0272b29c0a))
* fix promise check to accept any spec conform object ([#1424](https://github.com/yargs/yargs/issues/1424)) ([0be43d2](https://github.com/yargs/yargs/commit/0be43d2e1bfa0a485a13d0bbf4aa02bd4a05d4dd))
* fix tiny spacing issue with usage ([#992](https://github.com/yargs/yargs/issues/992)) ([7871327](https://github.com/yargs/yargs/commit/78713274d5b911bfa8638544a33cd826c792a5b6))
* getCompletion() was not working for options ([#1495](https://github.com/yargs/yargs/issues/1495)) ([463feb2](https://github.com/yargs/yargs/commit/463feb2870158eb9df670222b0f0a40a05cf18d0))
* groups were not being maintained for nested commands ([#1430](https://github.com/yargs/yargs/issues/1430)) ([d38650e](https://github.com/yargs/yargs/commit/d38650e45b478ef0104af40281df54b41a50f12f))
* help always displayed for the first command parsed having an async handler ([#1535](https://github.com/yargs/yargs/issues/1535)) ([d585b30](https://github.com/yargs/yargs/commit/d585b303a43746201b05c9c9fda94a444634df33))
* help command spacing when scriptName is empty ([#1994](https://github.com/yargs/yargs/issues/1994)) ([d33e997](https://github.com/yargs/yargs/commit/d33e9972291406490cd8fdad0b3589be234e0f12))
* help now takes precedence over command recommendation ([#866](https://github.com/yargs/yargs/issues/866)) ([17e3567](https://github.com/yargs/yargs/commit/17e356700bfacbb88f98ab2006ed5c43bd04c5dc))
* help strings for nested commands were missing parent commands ([#990](https://github.com/yargs/yargs/issues/990)) ([cd1ca15](https://github.com/yargs/yargs/commit/cd1ca1587910b98a0edf7457f9682e8ea998769d))
* hide `hidden` options from help output even if they are in a group ([#1221](https://github.com/yargs/yargs/issues/1221)) ([da54028](https://github.com/yargs/yargs/commit/da54028bbb5cf13739c7fa1eb5d5f00811915696))
* https://github.com/yargs/yargs/issues/1841#issuecomment-804770453 ([b96ef01](https://github.com/yargs/yargs/commit/b96ef01b16bc5377b79d7914dd5495068037fe7b))
* **i18n:** Japanese translation phrasing ([#1619](https://github.com/yargs/yargs/issues/1619)) ([0894175](https://github.com/yargs/yargs/commit/089417550ef5a5b8ce3578dd2a989191300b64cd))
* **i18n:** rename unclear 'implication failed' to 'missing dependent arguments' ([#1317](https://github.com/yargs/yargs/issues/1317)) ([bf46813](https://github.com/yargs/yargs/commit/bf468136724a0903cdc37c3e0788dc7f8131ef03))
* implications fails only displayed once ([#954](https://github.com/yargs/yargs/issues/954)) ([ac8088b](https://github.com/yargs/yargs/commit/ac8088bf70bd27aa10268afb0d63bcf3a4a8016f))
* implies should not fail when implied key's value is 0, false or empty string ([#1985](https://github.com/yargs/yargs/issues/1985)) ([8010472](https://github.com/yargs/yargs/commit/80104727d5f2ec4c5b491c1bdec4c94b2db95d9c))
* improve Norwegian Bokmål translations ([#1208](https://github.com/yargs/yargs/issues/1208)) ([a458fa4](https://github.com/yargs/yargs/commit/a458fa42d4cdc80c54072d8838c4bee436c6cb72))
* improve Norwegian Nynorsk translations ([#1207](https://github.com/yargs/yargs/issues/1207)) ([d422eb5](https://github.com/yargs/yargs/commit/d422eb504898ec2f7464952fbed45e810294c9b8))
* less eager help command execution ([#972](https://github.com/yargs/yargs/issues/972)) ([8c1d7bf](https://github.com/yargs/yargs/commit/8c1d7bfd4b907677fa3915c78e09587ab1cbfb72))
* **locales:** only translate default option group name ([acc16de](https://github.com/yargs/yargs/commit/acc16de6b846ea7332db753646a9cec76b589162))
* **locales:** remove extra space in French for 'default' ([#1564](https://github.com/yargs/yargs/issues/1564)) ([ecfc2c4](https://github.com/yargs/yargs/commit/ecfc2c474575c6cdbc6d273c94c13181bd1dbaa6))
* make positionals in -- count towards validation ([#1752](https://github.com/yargs/yargs/issues/1752)) ([eb2b29d](https://github.com/yargs/yargs/commit/eb2b29d34f1a41e0fd6c4e841960e5bfc329dc3c))
* middleware added multiple times due to reference bug ([#1282](https://github.com/yargs/yargs/issues/1282)) ([64af518](https://github.com/yargs/yargs/commit/64af518f3aa91239c56983dc57c674f1ad097f1d))
* middleware should work regardless of when method is called  ([664b265](https://github.com/yargs/yargs/commit/664b265de038b80677fb2912f8840bc3c7fb98c8)), closes [#1178](https://github.com/yargs/yargs/issues/1178)
* misspelling of package.json `engines` field ([0891d0e](https://github.com/yargs/yargs/commit/0891d0ed35b30c83a6d9e9f6a5c5f84d13c546a0))
* **modules:** module path was incorrect ([#1759](https://github.com/yargs/yargs/issues/1759)) ([95a4a0a](https://github.com/yargs/yargs/commit/95a4a0ac573cfe158e6e4bc8c8682ebd1644a198))
* move yargs.cjs to yargs to fix Node 10 imports ([#1747](https://github.com/yargs/yargs/issues/1747)) ([5bfb85b](https://github.com/yargs/yargs/commit/5bfb85b33b85db8a44b5f7a700a8e4dbaf022df0))
* parse array rather than string, so that quotes are safe ([#993](https://github.com/yargs/yargs/issues/993)) ([c351685](https://github.com/yargs/yargs/commit/c3516851f21f0321c44b73048da38546335c7356))
* populate correct value on yargs.parsed and stop warning on access ([#1412](https://github.com/yargs/yargs/issues/1412)) ([bb0eb52](https://github.com/yargs/yargs/commit/bb0eb528ce6ecfd90a9cb1eaf0221fd326b3aeca))
* populate positionals when unknown-options-as-args is set ([#1508](https://github.com/yargs/yargs/issues/1508)) ([bb0f2eb](https://github.com/yargs/yargs/commit/bb0f2eb996fa4e19d330b31a01c2036cafa99a7e)), closes [#1444](https://github.com/yargs/yargs/issues/1444)
* positional arguments now work if no handler is provided to inner command ([#864](https://github.com/yargs/yargs/issues/864)) ([e28ded3](https://github.com/yargs/yargs/commit/e28ded33339b2a140530280ee5a698eef2bd9369))
* positional array defaults should not be combined with provided values ([#2006](https://github.com/yargs/yargs/issues/2006)) ([832222d](https://github.com/yargs/yargs/commit/832222d7777da49e5c9da6c5801c2dd90d7fa6a2))
* **positional:** positional strings no longer drop decimals ([#1761](https://github.com/yargs/yargs/issues/1761)) ([e1a300f](https://github.com/yargs/yargs/commit/e1a300f1293ad821c900284616337f080b207980))
* positionals should not overwrite options ([#1992](https://github.com/yargs/yargs/issues/1992)) ([9d84309](https://github.com/yargs/yargs/commit/9d84309e53ce1d30b1c61035ed5c78827a89df86))
* prefer user supplied script name in usage ([#1383](https://github.com/yargs/yargs/issues/1383)) ([28c74b9](https://github.com/yargs/yargs/commit/28c74b9e584d30cf6a6c6c31dad967fd81fc5077))
* properties accessed on singleton now reflect current state of instance ([#1366](https://github.com/yargs/yargs/issues/1366)) ([409d35b](https://github.com/yargs/yargs/commit/409d35bfb10928b34b2a6b29492878d42c4825df))
* re-add options to check callback ([#2079](https://github.com/yargs/yargs/issues/2079)) ([e75319d](https://github.com/yargs/yargs/commit/e75319d99142a048b0abe9856499730fd4bc004c))
* remove the trailing white spaces from the help output ([#1090](https://github.com/yargs/yargs/issues/1090)) ([3f0746c](https://github.com/yargs/yargs/commit/3f0746c0e212d2049e3c1d6633a824382d2ec165))
* requiresArg should only be enforced if argument exists ([#1043](https://github.com/yargs/yargs/issues/1043)) ([fbf41ae](https://github.com/yargs/yargs/commit/fbf41ae672ea967f80c2f8ec8efd4317e4d70a1d))
* Set implicit nargs=1 when type=number requiresArg=true ([#1050](https://github.com/yargs/yargs/issues/1050)) ([2b56812](https://github.com/yargs/yargs/commit/2b5681233a0d9406e362ce2ddd434a47117755db))
* show 2 dashes on help for single digit option key or alias ([#1493](https://github.com/yargs/yargs/issues/1493)) ([63b3dd3](https://github.com/yargs/yargs/commit/63b3dd31a455d428902220c1992ae930e18aff5c))
* showCompletionScript was logging script twice ([#1388](https://github.com/yargs/yargs/issues/1388)) ([07c8537](https://github.com/yargs/yargs/commit/07c8537aa727d3c9b026523ee255758d76939cb3))
* showHelp() and .getHelp() now return same output for commands as --help ([#1826](https://github.com/yargs/yargs/issues/1826)) ([36abf26](https://github.com/yargs/yargs/commit/36abf26919b5a19f3adec08598539851c34b7086))
* stop-parse was not being respected by commands ([#1459](https://github.com/yargs/yargs/issues/1459)) ([12c82e6](https://github.com/yargs/yargs/commit/12c82e62663e928148a7ee2f51629aa26a0f9bb2))
* strict mode should not fail for hidden options ([#949](https://github.com/yargs/yargs/issues/949)) ([0e0c58d](https://github.com/yargs/yargs/commit/0e0c58dd737f856ee4b3d595ddfb835247db9503))
* **strict mode:** report default command unknown arguments ([#1626](https://github.com/yargs/yargs/issues/1626)) ([69f29a9](https://github.com/yargs/yargs/commit/69f29a9cd429d4bb99481238305390107ac75b02))
* strict should fail unknown arguments ([#1977](https://github.com/yargs/yargs/issues/1977)) ([c804f0d](https://github.com/yargs/yargs/commit/c804f0db78e56b44341cc7a91878c27b1b68b9f2))
* strict() should not ignore hyphenated arguments ([#1414](https://github.com/yargs/yargs/issues/1414)) ([b774b5e](https://github.com/yargs/yargs/commit/b774b5e4834735f7b730a27c4b7bf6e7544ee224))
* support merging deeply nested configuration ([#1423](https://github.com/yargs/yargs/issues/1423)) ([bae66fe](https://github.com/yargs/yargs/commit/bae66feee45cb59241facc978c8fdd2bb4d4c751))
* support options/sub-commands in zsh completion ([0a96394](https://github.com/yargs/yargs/commit/0a96394f3b3125332eeaaa6c7a5beeffb3c3a27f))
* temporary fix for libraries that call Object.freeze() ([#1483](https://github.com/yargs/yargs/issues/1483)) ([99c2dc8](https://github.com/yargs/yargs/commit/99c2dc850e67c606644f8b0c0bca1a59c87dcbcd))
* the positional argument parse was clobbering global flag arguments ([#984](https://github.com/yargs/yargs/issues/984)) ([7e58453](https://github.com/yargs/yargs/commit/7e58453e6a46c59d3f51c0c3ccc933ca68089b4a))
* tolerate null prototype for config objects with `extends` ([#1376](https://github.com/yargs/yargs/issues/1376)) ([3d26d11](https://github.com/yargs/yargs/commit/3d26d114148118763b37886da32ee2ee2af2d8dc)), closes [#1372](https://github.com/yargs/yargs/issues/1372)
* translation not working when using __ with a single parameter ([#1183](https://github.com/yargs/yargs/issues/1183)) ([f449aea](https://github.com/yargs/yargs/commit/f449aead59f44f826cbcf570cf849c4a59c79c81))
* **translations:** add French translation for unknown command ([#1563](https://github.com/yargs/yargs/issues/1563)) ([18b0b75](https://github.com/yargs/yargs/commit/18b0b752424bf560271e670ff95a0f90c8386787))
* **translations:** fix pluralization in error messages. ([#1557](https://github.com/yargs/yargs/issues/1557)) ([94fa38c](https://github.com/yargs/yargs/commit/94fa38cbab8d86943e87bf41d368ed56dffa6835))
* **typescript:** yargs-parser was breaking @types/yargs ([#1745](https://github.com/yargs/yargs/issues/1745)) ([2253284](https://github.com/yargs/yargs/commit/2253284b233cceabd8db677b81c5bf1755eef230))
* update to yargs-parser with fix for array default values ([#1463](https://github.com/yargs/yargs/issues/1463)) ([ebee59d](https://github.com/yargs/yargs/commit/ebee59d9022da538410e69a5c025019ed46d13d2))
* upgrade os-locale to version that addresses license issue ([#1195](https://github.com/yargs/yargs/issues/1195)) ([efc0970](https://github.com/yargs/yargs/commit/efc0970bc8f91359905882b6990ffc0786193068))
* **usage:** translate 'options' group only when displaying help ([#1600](https://github.com/yargs/yargs/issues/1600)) ([e60b39b](https://github.com/yargs/yargs/commit/e60b39b9d3a912c06db43f87c86ba894142b6c1c))
* use correct completion command in generated completion script ([#988](https://github.com/yargs/yargs/issues/988)) ([3c8ac1d](https://github.com/yargs/yargs/commit/3c8ac1ddd79cc7adc2fc0214318c7b23d98f613c))
* **validation:** Use the error as a message when none exists otherwise ([#1268](https://github.com/yargs/yargs/issues/1268)) ([0510fe6](https://github.com/yargs/yargs/commit/0510fe6a617fc8af77aa205e44feaa5226e9643c))
* wrap(null) no longer causes strange indentation behavior ([#1988](https://github.com/yargs/yargs/issues/1988)) ([e1871aa](https://github.com/yargs/yargs/commit/e1871aa792de219b221179417d410931af70d405))
* **yargs:** add missing command(module) signature ([#1707](https://github.com/yargs/yargs/issues/1707)) ([0f81024](https://github.com/yargs/yargs/commit/0f810245494ccf13a35b7786d021b30fc95ecad5)), closes [#1704](https://github.com/yargs/yargs/issues/1704)
* **yargs:** correct support of bundled electron apps ([#1554](https://github.com/yargs/yargs/issues/1554)) ([a0b61ac](https://github.com/yargs/yargs/commit/a0b61ac21e2b554aa73dbf1a66d4a7af94047c2f))
* zsh completion is now autoloadable ([#1856](https://github.com/yargs/yargs/issues/1856)) ([d731f9f](https://github.com/yargs/yargs/commit/d731f9f9adbc11f918e918443c5bff4149fc6681))


### Miscellaneous Chores

* **deps:** update dependency mocha to v7 ([#1547](https://github.com/yargs/yargs/issues/1547)) ([4f9fadd](https://github.com/yargs/yargs/commit/4f9fadd3ea8c05444067bf2560b358cdb6162011))
* drop Node 6 from testing matrix ([#1287](https://github.com/yargs/yargs/issues/1287)) ([ef16792](https://github.com/yargs/yargs/commit/ef167921e9f8d03e4bd08604480e1458cbf861e9))
* drop Node 6 support ([#1461](https://github.com/yargs/yargs/issues/1461)) ([2ba8ce0](https://github.com/yargs/yargs/commit/2ba8ce05e8fefbeffc6cb7488d9ebf6e86cceb1d))
* test Node.js 6, 8 and 10 ([#1160](https://github.com/yargs/yargs/issues/1160)) ([84f9d2b](https://github.com/yargs/yargs/commit/84f9d2b07b48b675277f6500551dacaf69379a4c))
* update dependencies ([#1284](https://github.com/yargs/yargs/issues/1284)) ([f25de4f](https://github.com/yargs/yargs/commit/f25de4fc8b4ad4bfd48080439492e6af50596940))
* upgrade to version of yargs-parser that does not populate value for unset boolean ([#1104](https://github.com/yargs/yargs/issues/1104)) ([d4705f4](https://github.com/yargs/yargs/commit/d4705f474e0243271b307ea880e8c4e4866218eb))
* upgrade yargs-parser ([#867](https://github.com/yargs/yargs/issues/867)) ([8f9c6c6](https://github.com/yargs/yargs/commit/8f9c6c6954b51f6e22d772ba2c7dfbbac5cb504b))


### Code Refactoring

* **coerce:** coerce is now applied before validation. ([8b95f57](https://github.com/yargs/yargs/commit/8b95f57bb2a49b098c6bf23cea88c6f900a34f89))
* deprecated reset() method is now private (call yargs() instead). ([376f892](https://github.com/yargs/yargs/commit/376f89242733dcd4ecb8040685c40ae1d622931d))
* implicitly private methods are now actually private ([376f892](https://github.com/yargs/yargs/commit/376f89242733dcd4ecb8040685c40ae1d622931d))
* remove package.json-based parserConfiguration ([#1460](https://github.com/yargs/yargs/issues/1460)) ([0d3642b](https://github.com/yargs/yargs/commit/0d3642b6f829b637938774c0c6ce5f6bfe1afa51))
* **ts:** ship yargs.d.ts ([#1671](https://github.com/yargs/yargs/issues/1671)) ([c06f886](https://github.com/yargs/yargs/commit/c06f886142ad02233db2b2ba82f2e606cbf57ccd))
* **yargs-factory:** refactor yargs-factory to use class ([#1895](https://github.com/yargs/yargs/issues/1895)) ([376f892](https://github.com/yargs/yargs/commit/376f89242733dcd4ecb8040685c40ae1d622931d))

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

[Older CHANGELOG Entries](https://github.com/yargs/yargs/blob/master/docs/CHANGELOG-historical.md)
