# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [15.2.0](https://www.github.com/yargs/yargs/compare/v15.4.1...v15.2.0) (2020-07-19)


### ⚠ BREAKING CHANGES

* **ts:** yargs now ships with its own types
* drop support for EOL Node 8 (#1686)
* **deps:** yargs-parser@17.0.0 no longer implicitly creates arrays out of boolean
* **deps:** yargs-parser now throws on invalid combinations of config (#1470)
* yargs-parser@16.0.0 drops support for Node 6
* drop Node 6 support (#1461)
* remove package.json-based parserConfiguration (#1460)
* we now only officially support yargs.$0 parameter and discourage direct access to yargs.parsed
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
* the first argument to strict() is now used to enable/disable its functionality, rather than controlling whether or not it is global.
* coerce is now applied as a final step after other parsing is complete
* fail is now applied globally.
* we now default to an empty builder function when command is executed with no builder.
* yargs-parser now better handles negative integer values, at the cost of handling numeric option names, e.g., -1 hello
* **default:** removed undocumented `defaults` alias for `default`.
* introduces a default `help` command which outputs help, as an alternative to a help flag.

### Features

* .help() API can now enable implicit help command ([#574](https://www.github.com/yargs/yargs/issues/574)) ([7645019](https://www.github.com/yargs/yargs/commit/764501903550c8c0fe7f44a934a9315ff2e053c6))
* .usage() can now be used to configure a default command ([#975](https://www.github.com/yargs/yargs/issues/975)) ([7269531](https://www.github.com/yargs/yargs/commit/72695316e02ae7e5cd0a78897dd0748068e345fc))
* add missing simple chinese locale strings ([#1004](https://www.github.com/yargs/yargs/issues/1004)) ([3cc24ec](https://www.github.com/yargs/yargs/commit/3cc24ecd49b2c29ee70af6cdab5a3f014d613576))
* add Norwegian Nynorsk translations ([#1028](https://www.github.com/yargs/yargs/issues/1028)) ([a5ac213](https://www.github.com/yargs/yargs/commit/a5ac2133f712a546c88bb00e2443bb9aeb82d0ac))
* add usage for single-digit boolean aliases ([#1580](https://www.github.com/yargs/yargs/issues/1580)) ([6014e39](https://www.github.com/yargs/yargs/commit/6014e39bca3a1e8445aa0fb2a435f6181e344c45))
* adds deprecation option for commands ([027a636](https://www.github.com/yargs/yargs/commit/027a6365b737e13116811a8ef43670196e1fa00a))
* complete short options with a single dash ([#1507](https://www.github.com/yargs/yargs/issues/1507)) ([99011ab](https://www.github.com/yargs/yargs/commit/99011ab5ba90232506ece0a17e59e2001a1ab562))
* deprecateOption ([#1559](https://www.github.com/yargs/yargs/issues/1559)) ([8aae333](https://www.github.com/yargs/yargs/commit/8aae3332251d09fa136db17ef4a40d83fa052bc4))
* display appropriate $0 for electron apps ([#1536](https://www.github.com/yargs/yargs/issues/1536)) ([d0e4379](https://www.github.com/yargs/yargs/commit/d0e437912917d6a66bb5128992fa2f566a5f830b))
* drop support for EOL Node 8 ([#1686](https://www.github.com/yargs/yargs/issues/1686)) ([863937f](https://www.github.com/yargs/yargs/commit/863937f23c3102f804cdea78ee3097e28c7c289f))
* enable .help() and .version() by default ([#912](https://www.github.com/yargs/yargs/issues/912)) ([1ef44e0](https://www.github.com/yargs/yargs/commit/1ef44e03ef1a2779f92bd979984a6bab3a671ee9))
* expose `Parser` from `require('yargs/yargs')` ([#1477](https://www.github.com/yargs/yargs/issues/1477)) ([1840ba2](https://www.github.com/yargs/yargs/commit/1840ba22f1a24c0ece8e32bbd31db4134a080aee))
* onFinishCommand handler ([#1473](https://www.github.com/yargs/yargs/issues/1473)) ([fe380cd](https://www.github.com/yargs/yargs/commit/fe380cd356aa33aef0449facd59c22cab8930ac9))
* support array of examples ([#1682](https://www.github.com/yargs/yargs/issues/1682)) ([225ab82](https://www.github.com/yargs/yargs/commit/225ab8271938bed3a48d23175f3d580ce8cd1306))
* **completion:** takes negated flags into account when boolean-negation is set ([#1509](https://www.github.com/yargs/yargs/issues/1509)) ([7293ad5](https://www.github.com/yargs/yargs/commit/7293ad50d20ea0fb7dd1ac9b925e90e1bd95dea8))
* **deps:** introduce yargs-parser with support for unknown-options-as-args ([#1440](https://www.github.com/yargs/yargs/issues/1440)) ([4d21520](https://www.github.com/yargs/yargs/commit/4d21520ca487b65f2ace422c323aaecb2be1c8a6))
* **deps:** pull in yargs-parser@17.0.0 ([#1553](https://www.github.com/yargs/yargs/issues/1553)) ([b9409da](https://www.github.com/yargs/yargs/commit/b9409da199ebca515a848489c206b807fab2e65d))
* **deps:** yargs-parser now throws on invalid combinations of config ([#1470](https://www.github.com/yargs/yargs/issues/1470)) ([c10c38c](https://www.github.com/yargs/yargs/commit/c10c38cca04298f96b55a7e374a9a134abefffa7))
* **deps:** yargs-parser with 'greedy-array' configuration ([#1569](https://www.github.com/yargs/yargs/issues/1569)) ([a03a320](https://www.github.com/yargs/yargs/commit/a03a320dbf5c0ce33d829a857fc04a651c0bb53e))
* **yargs-parser:** introduce single-digit boolean aliases ([#1576](https://www.github.com/yargs/yargs/issues/1576)) ([3af7f04](https://www.github.com/yargs/yargs/commit/3af7f04cdbfcbd4b3f432aca5144d43f21958c39))
* Add `.parserConfiguration()` method, deprecating package.json config ([#1262](https://www.github.com/yargs/yargs/issues/1262)) ([3c6869a](https://www.github.com/yargs/yargs/commit/3c6869aae7b488d2416f66c19a801c06243c075c))
* add support for global middleware, useful for shared tasks like metrics ([#1119](https://www.github.com/yargs/yargs/issues/1119)) ([9d71ac7](https://www.github.com/yargs/yargs/commit/9d71ac745baeaf5f5277dd5aef6b4b4316acfafb))
* adds config option for sorting command output ([#1256](https://www.github.com/yargs/yargs/issues/1256)) ([6916ce9](https://www.github.com/yargs/yargs/commit/6916ce9a548c4f0ccd80740a0d85c6e7c567ff84))
* adds support for multiple epilog messages ([#1384](https://www.github.com/yargs/yargs/issues/1384)) ([07a5554](https://www.github.com/yargs/yargs/commit/07a5554c480ff3aa43cdc37b1d4ecbaf2687c779))
* allow hidden options to be displayed with --show-hidden ([#1061](https://www.github.com/yargs/yargs/issues/1061)) ([ea862ae](https://www.github.com/yargs/yargs/commit/ea862ae551b8e973534c1fc0248bc85fd8a01c7a))
* introduces strictCommands() subset of strict mode ([#1540](https://www.github.com/yargs/yargs/issues/1540)) ([1d4cca3](https://www.github.com/yargs/yargs/commit/1d4cca395a98b395e6318f0505fc73bef8b01350))
* **deps:** yargs-parser with support for collect-unknown-options ([#1421](https://www.github.com/yargs/yargs/issues/1421)) ([d388a7c](https://www.github.com/yargs/yargs/commit/d388a7cbb03b5e74bc07b4b48789511fe1306a0a))
* **lang:** add Finnish localization (language code fi) ([222c8fe](https://www.github.com/yargs/yargs/commit/222c8fef2e2ad46e314c337dec96940f896bec35))
* allow completionCommand to be set via showCompletionScript ([#1385](https://www.github.com/yargs/yargs/issues/1385)) ([5562853](https://www.github.com/yargs/yargs/commit/55628535a242979adcf189d917082083edb2ad56))
* allow implies and conflicts to accept array values ([#922](https://www.github.com/yargs/yargs/issues/922)) ([abdc7da](https://www.github.com/yargs/yargs/commit/abdc7da9d60e48b105034a255f62e3d6f10c6650))
* allow parse with no arguments as alias for yargs.argv ([#944](https://www.github.com/yargs/yargs/issues/944)) ([a9f03e7](https://www.github.com/yargs/yargs/commit/a9f03e712a2176d348c34def80d7107adda2ba0e))
* make it possible to merge configurations when extending other config. ([#1411](https://www.github.com/yargs/yargs/issues/1411)) ([5d7ad98](https://www.github.com/yargs/yargs/commit/5d7ad989a851398587a0349cdd15344769b4cd79))
* **i18n:** swap out os-locale dependency for simple inline implementation ([#1356](https://www.github.com/yargs/yargs/issues/1356)) ([4dfa19b](https://www.github.com/yargs/yargs/commit/4dfa19b3275cbd74ed686c437d392c4612e237a4))
* add .commandDir(dir) to API to apply all command modules from a relative directory ([#494](https://www.github.com/yargs/yargs/issues/494)) ([b299dff](https://www.github.com/yargs/yargs/commit/b299dff4dcee2a95528f4e383d998d1a7378967b))
* add coerce api ([#586](https://www.github.com/yargs/yargs/issues/586)) ([1d53ccb](https://www.github.com/yargs/yargs/commit/1d53ccb664253a61addfa6b1e172c00ec2bcb525))
* add conflicts and implies shorthands. ([#753](https://www.github.com/yargs/yargs/issues/753)) ([bd1472b](https://www.github.com/yargs/yargs/commit/bd1472ba3da6a6cbae521559b9c662416d1bac12))
* add new pt_BR translations ([#674](https://www.github.com/yargs/yargs/issues/674)) ([5615a82](https://www.github.com/yargs/yargs/commit/5615a82ed7b7246e9f5e7441ad853a17b8f71ebd))
* add support for numeric commands ([#825](https://www.github.com/yargs/yargs/issues/825)) ([fde0564](https://www.github.com/yargs/yargs/commit/fde0564f4d7275e8ed09684ebf02d606d2ad8569))
* add traditional Chinese translation ([#780](https://www.github.com/yargs/yargs/issues/780)) ([6ab6a95](https://www.github.com/yargs/yargs/commit/6ab6a95de6358f8e42466c424567a28ed0bd45cf))
* adds recommendCommands() for command suggestions ([#580](https://www.github.com/yargs/yargs/issues/580)) ([59474dc](https://www.github.com/yargs/yargs/commit/59474dcde572c34d5bd66b633cc658d266cdd9e4))
* allow extends to inherit from a module ([#865](https://www.github.com/yargs/yargs/issues/865)) ([89456d9](https://www.github.com/yargs/yargs/commit/89456d994216466da2be929d81d3fb936005ae96))
* allow setting scriptName $0 ([#1143](https://www.github.com/yargs/yargs/issues/1143)) ([a2f2eae](https://www.github.com/yargs/yargs/commit/a2f2eae2235fa9b10ce221aea1320b1dfc564efa))
* allow strict mode to be disabled ([#840](https://www.github.com/yargs/yargs/issues/840)) ([6f78c05](https://www.github.com/yargs/yargs/commit/6f78c05a3a719f3c40e3b8197dd1ea2e85afd627))
* apply .env() globally ([#553](https://www.github.com/yargs/yargs/issues/553)) ([be65728](https://www.github.com/yargs/yargs/commit/be657282d455fb1d40de60683674a272efe4f930))
* apply default builder to command() and apply fail() handlers globally ([#583](https://www.github.com/yargs/yargs/issues/583)) ([0aaa68b](https://www.github.com/yargs/yargs/commit/0aaa68bf36d35c697426de4dfe2e4e12128c2dc0))
* async command handlers ([#1001](https://www.github.com/yargs/yargs/issues/1001)) ([241124b](https://www.github.com/yargs/yargs/commit/241124ba4bfad505363433453c51e22c4e4f2baf))
* builder is now optional for a command module ([#545](https://www.github.com/yargs/yargs/issues/545)) ([8d6ad6e](https://www.github.com/yargs/yargs/commit/8d6ad6ef91ab037c5f243b4510b56e79556b6786))
* extend *.rc files in addition to json ([#1080](https://www.github.com/yargs/yargs/issues/1080)) ([11691a6](https://www.github.com/yargs/yargs/commit/11691a670b384e3dce2ee61fc92e6b6965079708))
* hidden options are now explicitly indicated using "hidden" flag ([#962](https://www.github.com/yargs/yargs/issues/962)) ([280d0d6](https://www.github.com/yargs/yargs/commit/280d0d6bd1035b91254db876281c1ae755520f07))
* if only one column is provided for examples, allow it to take up the entire line ([#749](https://www.github.com/yargs/yargs/issues/749)) ([7931652](https://www.github.com/yargs/yargs/commit/793165278bcccdd4f67c2656b4bd12e2d80ee421))
* implement conflicts() for defining mutually exclusive arguments; thanks [@madcampos](https://www.github.com/madcampos)! ([#741](https://www.github.com/yargs/yargs/issues/741)) ([5883779](https://www.github.com/yargs/yargs/commit/5883779b1a3fc6a88b12fa9abe45c82f2ab79a2e))
* initial support for command aliases ([#647](https://www.github.com/yargs/yargs/issues/647)) ([127a040](https://www.github.com/yargs/yargs/commit/127a0407a51817b8dd048c282f7ad6dc59f8b53f))
* interpret demand() numbers as relative to executing command ([#582](https://www.github.com/yargs/yargs/issues/582)) ([927810c](https://www.github.com/yargs/yargs/commit/927810c7615912fb77a160273b2d6a946e9737b8))
* introduce .positional() for configuring positional arguments ([#967](https://www.github.com/yargs/yargs/issues/967)) ([cb16460](https://www.github.com/yargs/yargs/commit/cb16460bffeb13d54215de45c09dbe4708aee770))
* Italian translations for 'did you mean' and 'aliases' ([#673](https://www.github.com/yargs/yargs/issues/673)) ([81984e6](https://www.github.com/yargs/yargs/commit/81984e69e4d6ebfd1a6155a56e4248da7f54c2f5))
* make opts object optional for .option() ([#624](https://www.github.com/yargs/yargs/issues/624)) ([4f29de6](https://www.github.com/yargs/yargs/commit/4f29de630ee1d77ac28d1393b5ca4aa4c08bc71b))
* middleware ([#881](https://www.github.com/yargs/yargs/issues/881)) ([77b8dbc](https://www.github.com/yargs/yargs/commit/77b8dbc495b926ef2dbc9d839882c828b8dad29b))
* multiple usage calls are now collected, not replaced ([#958](https://www.github.com/yargs/yargs/issues/958)) ([74a38b2](https://www.github.com/yargs/yargs/commit/74a38b2646478c301a17498afa36a832277e5b9c))
* options/positionals with leading '+' and '0' no longer parse as numbers ([#1286](https://www.github.com/yargs/yargs/issues/1286)) ([e9dc3aa](https://www.github.com/yargs/yargs/commit/e9dc3aaf7b9d0fe07bfbe28ec347db7d959cbf0b))
* pull in yargs-parser introducing additional settings ([#688](https://www.github.com/yargs/yargs/issues/688)), and fixing [#716](https://www.github.com/yargs/yargs/issues/716) ([#722](https://www.github.com/yargs/yargs/issues/722)) ([702995a](https://www.github.com/yargs/yargs/commit/702995a04648460ac5a4c7c531e26c6b4750f38f))
* remove `setPlaceholderKeys` ([#1105](https://www.github.com/yargs/yargs/issues/1105)) ([6ee2c82](https://www.github.com/yargs/yargs/commit/6ee2c82df515cb1b062e4135a5dd9c386fed2b21))
* replace /bin/bash with file basename ([#983](https://www.github.com/yargs/yargs/issues/983)) ([20bb99b](https://www.github.com/yargs/yargs/commit/20bb99b25630594542577133d51e38a4c6712d31))
* requiresArg is now simply an alias for nargs(1) ([#1054](https://www.github.com/yargs/yargs/issues/1054)) ([a3ddacc](https://www.github.com/yargs/yargs/commit/a3ddacc87e6cbb8a275f97d746511fe1d1f93044))
* reworking yargs API to make it easier to run in headless environments, e.g., Slack ([#646](https://www.github.com/yargs/yargs/issues/646)) ([f284c29](https://www.github.com/yargs/yargs/commit/f284c2968c2f8b818b0737dc09c94a44ef8afc25))
* split demand() into demandCommand()/demandOption() ([#740](https://www.github.com/yargs/yargs/issues/740)) ([66573c8](https://www.github.com/yargs/yargs/commit/66573c82ed1479eb6ba9bf654463e3ca2d99c6dc))
* support defaultDescription for positional arguments ([812048c](https://www.github.com/yargs/yargs/commit/812048ccaa31ac0db072d13589ef5af8cd1474c6))
* support for positional argument aliases ([#727](https://www.github.com/yargs/yargs/issues/727)) ([27e1a57](https://www.github.com/yargs/yargs/commit/27e1a57825bc949cec0f33c802124046499953a4))
* update to yargs-parser that addresses [#598](https://www.github.com/yargs/yargs/issues/598), [#617](https://www.github.com/yargs/yargs/issues/617) ([#700](https://www.github.com/yargs/yargs/issues/700)) ([54cb31d](https://www.github.com/yargs/yargs/commit/54cb31db8510f6b9dcae0939a6c36c028f454bea))
* yargs is now passed as the third-argument to fail handler ([#613](https://www.github.com/yargs/yargs/issues/613)) ([21b74f9](https://www.github.com/yargs/yargs/commit/21b74f91ca63df2eb885de1f8926f92d702faf51))
* **command:** add camelcase commands to argv ([#658](https://www.github.com/yargs/yargs/issues/658)) ([b1cabae](https://www.github.com/yargs/yargs/commit/b1cabae60ca1ae715ee9bc8ad10f7ce69f644048))
* **command:** builder function no longer needs to return the yargs instance ([#549](https://www.github.com/yargs/yargs/issues/549)) ([eaa2873](https://www.github.com/yargs/yargs/commit/eaa28731d805b66e0fce518fb8810560f617f50c))
* **command:** derive missing command string from module filename ([#527](https://www.github.com/yargs/yargs/issues/527)) ([20d4b8a](https://www.github.com/yargs/yargs/commit/20d4b8ae3511e46e3bb39472a21c8ee7aeeecf2b))
* **commands:** implemented variadic positional arguments ([51d926e](https://www.github.com/yargs/yargs/commit/51d926efea1522f27744d28de5efbee8062d1498))
* **completion:** allow to get completions for any string, not just process.argv ([#470](https://www.github.com/yargs/yargs/issues/470)) ([74fcfbc](https://www.github.com/yargs/yargs/commit/74fcfbc34a8094943f9c397ed922cec7dfbb2416))
* **completion:** completion now better handles aliases, and avoids duplicating keys. ([86416c8](https://www.github.com/yargs/yargs/commit/86416c89b1b2625758a95d9a150fa49459ff9c29))
* **config:** If invoking .config() without parameters, set a default option ([0413dd1](https://www.github.com/yargs/yargs/commit/0413dd15e5f4947937ddd10549dfd99c59935769))
* **configuration:** Allow to directly pass a configuration object to .config() ([#480](https://www.github.com/yargs/yargs/issues/480)) ([e0a7e05](https://www.github.com/yargs/yargs/commit/e0a7e05d1cb6e9c29d69e5311a35abedeeaec320))
* **conventional-changelog:** switching to using conventional-changelog for generating the changelog ([a2b5a2a](https://www.github.com/yargs/yargs/commit/a2b5a2ad9e2c93134bddf72744f22bcc7c818ff4))
* **locales:** add Hindi translations ([9290912](https://www.github.com/yargs/yargs/commit/9290912f77767534d603a66666545326009b3553))
* **locales:** add Hungarian translations ([be92327](https://www.github.com/yargs/yargs/commit/be92327fad6c2af52fb52a3e9de52baa58a4800a))
* **locales:** Add Thai locale file ([#679](https://www.github.com/yargs/yargs/issues/679)) ([c05e36b](https://www.github.com/yargs/yargs/commit/c05e36b4ad991bc8f7d771e8612e5d057cf6dd9a))
* **locales:** Added Belarusian translation ([#690](https://www.github.com/yargs/yargs/issues/690)) ([68dac1f](https://www.github.com/yargs/yargs/commit/68dac1f7740649f56df51e0655ff509b85e33756))
* **locales:** Create nl.json ([#687](https://www.github.com/yargs/yargs/issues/687)) ([46ce1bb](https://www.github.com/yargs/yargs/commit/46ce1bb3f980d30355a0b52d83c0d1f995a4996a))
* switch to standard-version for release management ([f70f801](https://www.github.com/yargs/yargs/commit/f70f801b13b70ff42f530649406cae0400944976))
* to allow both undefined and nulls, for benefit of TypeScript  ([#945](https://www.github.com/yargs/yargs/issues/945)) ([792564d](https://www.github.com/yargs/yargs/commit/792564d954d5143b2b57b05aaca4007780f5b728))
* Turkish translations for 'did you mean' and 'aliases' ([#660](https://www.github.com/yargs/yargs/issues/660)) ([072fd45](https://www.github.com/yargs/yargs/commit/072fd45f9c5266eb4833b35075c7eb6ed7d31dae))
* zsh auto completion ([#1292](https://www.github.com/yargs/yargs/issues/1292)) ([16c5d25](https://www.github.com/yargs/yargs/commit/16c5d25c00d2cd1c055987837601f7154a7b41b3)), closes [#1156](https://www.github.com/yargs/yargs/issues/1156)
* **locales:** Japanese translations for 'did you mean' and 'aliases'  ([#651](https://www.github.com/yargs/yargs/issues/651)) ([5eb78fc](https://www.github.com/yargs/yargs/commit/5eb78fcfe1d6c838bbd54a0c318de68e2d853d5a))
* **locales:** Polish translations for 'did you mean' and 'aliases' ([#650](https://www.github.com/yargs/yargs/issues/650)) ([c951c0e](https://www.github.com/yargs/yargs/commit/c951c0e1769c3de689d95e0d79d2aadab6bfeda9))
* **translation:** Update pl-PL translations ([#985](https://www.github.com/yargs/yargs/issues/985)) ([5a9c986](https://www.github.com/yargs/yargs/commit/5a9c98643333799e04fc78c5797fad0ecfefde86))
* update yargs-parser to version 3.1.0 ([#581](https://www.github.com/yargs/yargs/issues/581)) ([882a127](https://www.github.com/yargs/yargs/commit/882a12737a05df005ef8b3adb40fc1b189288128))
* **validation:** Add .skipValidation() method ([#471](https://www.github.com/yargs/yargs/issues/471)) ([d72badb](https://www.github.com/yargs/yargs/commit/d72badbc1fe5e802ef5eaad416a5dd433f385ed9))
* upgrade to version of yargs-parser that introduces some slick new features, great work [@elas7](https://www.github.com/elas7). update cliui, replace win-spawn, replace badge. ([#475](https://www.github.com/yargs/yargs/issues/475)) ([f915dd4](https://www.github.com/yargs/yargs/commit/f915dd4dfd0a2ac219491b3bcc28f9781e10fc6c))


### Bug Fixes

* **deps:** fix enumeration for normalized path arguments ([#1567](https://www.github.com/yargs/yargs/issues/1567)) ([0b5b1b0](https://www.github.com/yargs/yargs/commit/0b5b1b0e5f4f9baf393c48e9cc2bc85c1b67a47a))
* **docs:** broken markdown link ([#1426](https://www.github.com/yargs/yargs/issues/1426)) ([236e24e](https://www.github.com/yargs/yargs/commit/236e24ef74cb32ff22f3d82a808333ec666d3c22))
* **docs:** describe usage of `.check()` in more detail ([932cd11](https://www.github.com/yargs/yargs/commit/932cd1177e93f5cc99edfe57a4028e30717bf8fb))
* **docs:** fix incorrect parserConfiguration documentation ([2a99124](https://www.github.com/yargs/yargs/commit/2a99124d2b388fb32e34886898efc4b624f4e26e))
* **docs:** formalize existing callback argument to showHelp ([#1386](https://www.github.com/yargs/yargs/issues/1386)) ([d217764](https://www.github.com/yargs/yargs/commit/d2177645834007a03ecc1a5163b1cd248b3eaf1f))
* **docs:** TypeScript import to prevent a future major release warning ([#1441](https://www.github.com/yargs/yargs/issues/1441)) ([b1b156a](https://www.github.com/yargs/yargs/commit/b1b156a3eb4ddd6803fbbd56c611a77919293000))
* **docs:** update boolean description and examples in docs ([#1474](https://www.github.com/yargs/yargs/issues/1474)) ([afd5b48](https://www.github.com/yargs/yargs/commit/afd5b4871bfeb90d58351ac56c5c44a83ef033e6))
* **docs:** use recommended cjs import syntax for ts examples ([#1513](https://www.github.com/yargs/yargs/issues/1513)) ([f9a18bf](https://www.github.com/yargs/yargs/commit/f9a18bfd624a5013108084f690cd8a1de794c430))
* **i18n:** Japanese translation phrasing ([#1619](https://www.github.com/yargs/yargs/issues/1619)) ([0894175](https://www.github.com/yargs/yargs/commit/089417550ef5a5b8ce3578dd2a989191300b64cd))
* **locales:** only translate default option group name ([acc16de](https://www.github.com/yargs/yargs/commit/acc16de6b846ea7332db753646a9cec76b589162))
* **locales:** remove extra space in French for 'default' ([#1564](https://www.github.com/yargs/yargs/issues/1564)) ([ecfc2c4](https://www.github.com/yargs/yargs/commit/ecfc2c474575c6cdbc6d273c94c13181bd1dbaa6))
* **strict mode:** report default command unknown arguments ([#1626](https://www.github.com/yargs/yargs/issues/1626)) ([69f29a9](https://www.github.com/yargs/yargs/commit/69f29a9cd429d4bb99481238305390107ac75b02))
* **usage:** translate 'options' group only when displaying help ([#1600](https://www.github.com/yargs/yargs/issues/1600)) ([e60b39b](https://www.github.com/yargs/yargs/commit/e60b39b9d3a912c06db43f87c86ba894142b6c1c))
* __proto__ will now be replaced with ___proto___ in parse ([#1591](https://www.github.com/yargs/yargs/issues/1591)) ([2474c38](https://www.github.com/yargs/yargs/commit/2474c3889dcae42ddc031f0ac3872d306bf99e6b))
* --help with default command should print top-level help ([#810](https://www.github.com/yargs/yargs/issues/810)) ([9c03fa4](https://www.github.com/yargs/yargs/commit/9c03fa497bd15111fac9d0592f14a89cc7982ddf))
* .argv and .parse() now invoke identical code path ([#1126](https://www.github.com/yargs/yargs/issues/1126)) ([f13ebf4](https://www.github.com/yargs/yargs/commit/f13ebf4314225bdd9abb2b117cfb7fec0efaf1a3))
* 'undefined' default value for choices resulted in validation failing ([782b896](https://www.github.com/yargs/yargs/commit/782b89690ecc22f969f381f8eff7e69413f2cbc5))
* 'undefined' should be taken to mean no argument was provided ([#1015](https://www.github.com/yargs/yargs/issues/1015)) ([c679e90](https://www.github.com/yargs/yargs/commit/c679e907d1a19d0858698fdd9fa882d10c4ba5a3))
* [object Object] was accidentally being populated on options object ([#736](https://www.github.com/yargs/yargs/issues/736)) ([f755e27](https://www.github.com/yargs/yargs/commit/f755e2756b227555e0f11e58ecfb6bc1a38cbca0))
* accept single function for middleware ([66fd6f7](https://www.github.com/yargs/yargs/commit/66fd6f7e9831008eab6742c7782f2e255b838ea7)), closes [#1214](https://www.github.com/yargs/yargs/issues/1214) [#1214](https://www.github.com/yargs/yargs/issues/1214)
* Add `dirname` sanity check on `findUp` ([#1036](https://www.github.com/yargs/yargs/issues/1036)) ([331d103](https://www.github.com/yargs/yargs/commit/331d10305af3991bd225fbd7a1060bf43cff22d3))
* add config lookup for .implies() ([#556](https://www.github.com/yargs/yargs/issues/556)) ([8d7585c](https://www.github.com/yargs/yargs/commit/8d7585c385d35d85ca5d8ddf641f7b24e70c032d))
* address ambiguity between nargs of 1 and requiresArg ([#1572](https://www.github.com/yargs/yargs/issues/1572)) ([a5edc32](https://www.github.com/yargs/yargs/commit/a5edc328ecb3f90d1ba09cfe70a0040f68adf50a))
* **translations:** add French translation for unknown command ([#1563](https://www.github.com/yargs/yargs/issues/1563)) ([18b0b75](https://www.github.com/yargs/yargs/commit/18b0b752424bf560271e670ff95a0f90c8386787))
* **translations:** fix pluralization in error messages. ([#1557](https://www.github.com/yargs/yargs/issues/1557)) ([94fa38c](https://www.github.com/yargs/yargs/commit/94fa38cbab8d86943e87bf41d368ed56dffa6835))
* **yargs:** correct support of bundled electron apps ([#1554](https://www.github.com/yargs/yargs/issues/1554)) ([a0b61ac](https://www.github.com/yargs/yargs/commit/a0b61ac21e2b554aa73dbf1a66d4a7af94047c2f))
* $0 contains first arg in bundled electron apps ([#1206](https://www.github.com/yargs/yargs/issues/1206)) ([567820b](https://www.github.com/yargs/yargs/commit/567820b4eed518ffc3651ffb206a03e12ba10eff))
* address bug with handling of arrays of implications ([c240661](https://www.github.com/yargs/yargs/commit/c240661c27a69fdd2bae401919a9ad31ccd1be01))
* address issues with dutch translation ([#1316](https://www.github.com/yargs/yargs/issues/1316)) ([0295132](https://www.github.com/yargs/yargs/commit/02951325c6ea93865b9eeb426828350cc595ed3f))
* address min/max validation message regression ([#750](https://www.github.com/yargs/yargs/issues/750)) ([2e5ce0f](https://www.github.com/yargs/yargs/commit/2e5ce0fa711446c99f2ec3c2741e63bb656189a8))
* allows camel-case, variadic arguments, and strict mode to be combined ([#1247](https://www.github.com/yargs/yargs/issues/1247)) ([eacc035](https://www.github.com/yargs/yargs/commit/eacc03568e0ecb9fa1f2224e77d2ad2ba38d7960))
* async middleware was called twice ([#1422](https://www.github.com/yargs/yargs/issues/1422)) ([9a42b63](https://www.github.com/yargs/yargs/commit/9a42b6380c92a3528a1e47ebf2ed0354e723fea2))
* better bash path completion ([#1272](https://www.github.com/yargs/yargs/issues/1272)) ([da75ea2](https://www.github.com/yargs/yargs/commit/da75ea2a5bac2bca8af278688785298054f54bd3))
* cache pkg lookups by path to avoid returning the wrong one ([#552](https://www.github.com/yargs/yargs/issues/552)) ([fea7e0b](https://www.github.com/yargs/yargs/commit/fea7e0b919f7e4f47f24a1300b24fd19f0f78ca9))
* calling parse multiple times now appropriately maintains state ([#1137](https://www.github.com/yargs/yargs/issues/1137)) ([#1369](https://www.github.com/yargs/yargs/issues/1369)) ([026b151](https://www.github.com/yargs/yargs/commit/026b1514d47d92f8ea1a3811862013500ff12b57))
* changed parsing of the command string to ignore extra spaces ([#600](https://www.github.com/yargs/yargs/issues/600)) ([e8e5a72](https://www.github.com/yargs/yargs/commit/e8e5a7293a26a3afd1ab10a8813ec1e2d76f983e))
* choose correct config directory when require.main does not exist ([#1056](https://www.github.com/yargs/yargs/issues/1056)) ([a04678c](https://www.github.com/yargs/yargs/commit/a04678ca0ab9ac7119e6e72b2a657a8a3eaf7818))
* commands are now applied in order, from left to right ([#857](https://www.github.com/yargs/yargs/issues/857)) ([baba863](https://www.github.com/yargs/yargs/commit/baba863f9889b92e6e8a15d8b321b3392ed3b7be))
* config and normalise can be disabled with false ([#952](https://www.github.com/yargs/yargs/issues/952)) ([3bb8771](https://www.github.com/yargs/yargs/commit/3bb8771876e6c62e7e44b64d62f12a8ede9120ab))
* defaulting keys to 'undefined' interfered with conflicting key logic ([a8e0cff](https://www.github.com/yargs/yargs/commit/a8e0cffbdd36eda0b6f93ca48f0ccfcf6e4af355))
* detect zsh when zsh isnt run as a login prompt ([#1395](https://www.github.com/yargs/yargs/issues/1395)) ([8792d13](https://www.github.com/yargs/yargs/commit/8792d13445458c51bdff6612b1edda5aa344b6a0))
* do not allow additional positionals in strict mode ([35d777c](https://www.github.com/yargs/yargs/commit/35d777c8db9548763a8f00c95bbd56a9c0f31084))
* do not use cwd when resolving package.json for yargs parsing config ([#726](https://www.github.com/yargs/yargs/issues/726)) ([9bdaab7](https://www.github.com/yargs/yargs/commit/9bdaab7ebffbfb70e76fa4067c3cafb4a700ef10))
* don't bother calling JSON.stringify() on string default values ([#891](https://www.github.com/yargs/yargs/issues/891)) ([628be21](https://www.github.com/yargs/yargs/commit/628be21f4300852fb3f905264b222673fbd160f3))
* don't load config when processing positionals ([5d0dc92](https://www.github.com/yargs/yargs/commit/5d0dc9249551afa32d699394902e9adc43624c68))
* drop lodash.assign ([#641](https://www.github.com/yargs/yargs/issues/641)) ([ad3146f](https://www.github.com/yargs/yargs/commit/ad3146fd2e2f6f0211582f7311d9ef7dd2adf041))
* drop unused camelcase dependency fixes [#516](https://www.github.com/yargs/yargs/issues/516) ([#525](https://www.github.com/yargs/yargs/issues/525)) ([365fb9a](https://www.github.com/yargs/yargs/commit/365fb9a88865e0bce6532f8f7c745e80cd18e28e))
* exclude positional arguments from completion output ([#927](https://www.github.com/yargs/yargs/issues/927)) ([71c7ec7](https://www.github.com/yargs/yargs/commit/71c7ec72bc18ff8a449522c3b9b4ee293cf25e49))
* fake a tty in tests, so that we can use the new set-blocking ([#512](https://www.github.com/yargs/yargs/issues/512)) ([a54c742](https://www.github.com/yargs/yargs/commit/a54c7429fecac5c64a0ede4f80f85dcb5c67c661))
* fix demandOption no longer treats 'false' as truthy ([#829](https://www.github.com/yargs/yargs/issues/829)) ([c748dd2](https://www.github.com/yargs/yargs/commit/c748dd21ff090db1ce636dae5c5cdf1d867692aa))
* fix promise check to accept any spec conform object ([#1424](https://www.github.com/yargs/yargs/issues/1424)) ([0be43d2](https://www.github.com/yargs/yargs/commit/0be43d2e1bfa0a485a13d0bbf4aa02bd4a05d4dd))
* fix tiny spacing issue with usage ([#992](https://www.github.com/yargs/yargs/issues/992)) ([7871327](https://www.github.com/yargs/yargs/commit/78713274d5b911bfa8638544a33cd826c792a5b6))
* for args that have skipValidation set to `true`, check if the parsed arg is `true` ([#619](https://www.github.com/yargs/yargs/issues/619)) ([658a34c](https://www.github.com/yargs/yargs/commit/658a34c44b568c85146e388c05623ae7fcb8a2f9))
* freeze was not resetting configObjects to initial state; addressed performance issue raised by [@nexdrew](https://www.github.com/nexdrew). ([#670](https://www.github.com/yargs/yargs/issues/670)) ([ae4bcd4](https://www.github.com/yargs/yargs/commit/ae4bcd446281674e22dcfcabe7a7b014f32856f8))
* get terminalWidth in non interactive mode no longer causes a validation exception ([#837](https://www.github.com/yargs/yargs/issues/837)) ([360e301](https://www.github.com/yargs/yargs/commit/360e3019de266ee04f85e2baf21ce18f8b48cdc1))
* getCompletion() was not working for options ([#1495](https://www.github.com/yargs/yargs/issues/1495)) ([463feb2](https://www.github.com/yargs/yargs/commit/463feb2870158eb9df670222b0f0a40a05cf18d0))
* groups were not being maintained for nested commands ([#1430](https://www.github.com/yargs/yargs/issues/1430)) ([d38650e](https://www.github.com/yargs/yargs/commit/d38650e45b478ef0104af40281df54b41a50f12f))
* help always displayed for the first command parsed having an async handler ([#1535](https://www.github.com/yargs/yargs/issues/1535)) ([d585b30](https://www.github.com/yargs/yargs/commit/d585b303a43746201b05c9c9fda94a444634df33))
* help now takes precedence over command recommendation ([#866](https://www.github.com/yargs/yargs/issues/866)) ([17e3567](https://www.github.com/yargs/yargs/commit/17e356700bfacbb88f98ab2006ed5c43bd04c5dc))
* help strings for nested commands were missing parent commands ([#990](https://www.github.com/yargs/yargs/issues/990)) ([cd1ca15](https://www.github.com/yargs/yargs/commit/cd1ca1587910b98a0edf7457f9682e8ea998769d))
* hide `hidden` options from help output even if they are in a group ([#1221](https://www.github.com/yargs/yargs/issues/1221)) ([da54028](https://www.github.com/yargs/yargs/commit/da54028bbb5cf13739c7fa1eb5d5f00811915696))
* ignore invalid package.json during read-pkg-up ([#546](https://www.github.com/yargs/yargs/issues/546)) ([e058c87](https://www.github.com/yargs/yargs/commit/e058c87df1a0660298364fb7f053191f44d2d32f))
* implications fails only displayed once ([#954](https://www.github.com/yargs/yargs/issues/954)) ([ac8088b](https://www.github.com/yargs/yargs/commit/ac8088bf70bd27aa10268afb0d63bcf3a4a8016f))
* improve Norwegian Bokmål translations ([#1208](https://www.github.com/yargs/yargs/issues/1208)) ([a458fa4](https://www.github.com/yargs/yargs/commit/a458fa42d4cdc80c54072d8838c4bee436c6cb72))
* improve Norwegian Nynorsk translations ([#1207](https://www.github.com/yargs/yargs/issues/1207)) ([d422eb5](https://www.github.com/yargs/yargs/commit/d422eb504898ec2f7464952fbed45e810294c9b8))
* lazy-load package.json and cache. get rid of pkg-conf dependency. ([#544](https://www.github.com/yargs/yargs/issues/544)) ([2609b2e](https://www.github.com/yargs/yargs/commit/2609b2ea3aa4643a8b6ccccf4659a7943495691a))
* less eager help command execution ([#972](https://www.github.com/yargs/yargs/issues/972)) ([8c1d7bf](https://www.github.com/yargs/yargs/commit/8c1d7bfd4b907677fa3915c78e09587ab1cbfb72))
* link build badge to master branch ([#505](https://www.github.com/yargs/yargs/issues/505)) ([7126b47](https://www.github.com/yargs/yargs/commit/7126b4796f5904af194e137d90c89b5563a34ec5))
* make stdout flush on newer versions of Node.js ([#501](https://www.github.com/yargs/yargs/issues/501)) ([9f8c6f4](https://www.github.com/yargs/yargs/commit/9f8c6f4ed3189e757129cb70e798d4ecb42731fe)), closes [#497](https://www.github.com/yargs/yargs/issues/497)
* middleware added multiple times due to reference bug ([#1282](https://www.github.com/yargs/yargs/issues/1282)) ([64af518](https://www.github.com/yargs/yargs/commit/64af518f3aa91239c56983dc57c674f1ad097f1d))
* middleware should work regardless of when method is called  ([664b265](https://www.github.com/yargs/yargs/commit/664b265de038b80677fb2912f8840bc3c7fb98c8)), closes [#1178](https://www.github.com/yargs/yargs/issues/1178)
* misspelling of package.json `engines` field ([0891d0e](https://www.github.com/yargs/yargs/commit/0891d0ed35b30c83a6d9e9f6a5c5f84d13c546a0))
* parse array rather than string, so that quotes are safe ([#993](https://www.github.com/yargs/yargs/issues/993)) ([c351685](https://www.github.com/yargs/yargs/commit/c3516851f21f0321c44b73048da38546335c7356))
* populate correct value on yargs.parsed and stop warning on access ([#1412](https://www.github.com/yargs/yargs/issues/1412)) ([bb0eb52](https://www.github.com/yargs/yargs/commit/bb0eb528ce6ecfd90a9cb1eaf0221fd326b3aeca))
* populate positionals when unknown-options-as-args is set ([#1508](https://www.github.com/yargs/yargs/issues/1508)) ([bb0f2eb](https://www.github.com/yargs/yargs/commit/bb0f2eb996fa4e19d330b31a01c2036cafa99a7e)), closes [#1444](https://www.github.com/yargs/yargs/issues/1444)
* positional arguments now work if no handler is provided to inner command ([#864](https://www.github.com/yargs/yargs/issues/864)) ([e28ded3](https://www.github.com/yargs/yargs/commit/e28ded33339b2a140530280ee5a698eef2bd9369))
* positional arguments of sub-commands threw strict() exception ([#805](https://www.github.com/yargs/yargs/issues/805)) ([f3f074b](https://www.github.com/yargs/yargs/commit/f3f074bd983e9b2dea6df94e21febfeef27b6de4))
* positional arguments were not being handled appropriately by parse() ([#559](https://www.github.com/yargs/yargs/issues/559)) ([063a866](https://www.github.com/yargs/yargs/commit/063a866d675fb0f33dbadf36e7b4945b2185cf50))
* prefer user supplied script name in usage ([#1383](https://www.github.com/yargs/yargs/issues/1383)) ([28c74b9](https://www.github.com/yargs/yargs/commit/28c74b9e584d30cf6a6c6c31dad967fd81fc5077))
* properties accessed on singleton now reflect current state of instance ([#1366](https://www.github.com/yargs/yargs/issues/1366)) ([409d35b](https://www.github.com/yargs/yargs/commit/409d35bfb10928b34b2a6b29492878d42c4825df))
* pull in [@nexdrew](https://www.github.com/nexdrew)'s fixes to yargs-parser ([#560](https://www.github.com/yargs/yargs/issues/560)) ([c77c080](https://www.github.com/yargs/yargs/commit/c77c0809c355bc47b22eb0adff8cffd81bd6a9d4))
* remove deprecated zh.json ([#578](https://www.github.com/yargs/yargs/issues/578)) ([317c62c](https://www.github.com/yargs/yargs/commit/317c62c0cab4ce19e9b6c21d9885346535f36c19))
* remove the trailing white spaces from the help output ([#1090](https://www.github.com/yargs/yargs/issues/1090)) ([3f0746c](https://www.github.com/yargs/yargs/commit/3f0746c0e212d2049e3c1d6633a824382d2ec165))
* requiresArg should only be enforced if argument exists ([#1043](https://www.github.com/yargs/yargs/issues/1043)) ([fbf41ae](https://www.github.com/yargs/yargs/commit/fbf41ae672ea967f80c2f8ec8efd4317e4d70a1d))
* Set implicit nargs=1 when type=number requiresArg=true ([#1050](https://www.github.com/yargs/yargs/issues/1050)) ([2b56812](https://www.github.com/yargs/yargs/commit/2b5681233a0d9406e362ce2ddd434a47117755db))
* show 2 dashes on help for single digit option key or alias ([#1493](https://www.github.com/yargs/yargs/issues/1493)) ([63b3dd3](https://www.github.com/yargs/yargs/commit/63b3dd31a455d428902220c1992ae930e18aff5c))
* showCompletionScript was logging script twice ([#1388](https://www.github.com/yargs/yargs/issues/1388)) ([07c8537](https://www.github.com/yargs/yargs/commit/07c8537aa727d3c9b026523ee255758d76939cb3))
* still freeze/unfreeze if parse() is called in isolation ([#717](https://www.github.com/yargs/yargs/issues/717)) ([30a9492](https://www.github.com/yargs/yargs/commit/30a94921d6a551a05f4dfa82d1ddc722f3028957))
* stop-parse was not being respected by commands ([#1459](https://www.github.com/yargs/yargs/issues/1459)) ([12c82e6](https://www.github.com/yargs/yargs/commit/12c82e62663e928148a7ee2f51629aa26a0f9bb2))
* strict mode should not fail for hidden options ([#949](https://www.github.com/yargs/yargs/issues/949)) ([0e0c58d](https://www.github.com/yargs/yargs/commit/0e0c58dd737f856ee4b3d595ddfb835247db9503))
* strict() should not ignore hyphenated arguments ([#1414](https://www.github.com/yargs/yargs/issues/1414)) ([b774b5e](https://www.github.com/yargs/yargs/commit/b774b5e4834735f7b730a27c4b7bf6e7544ee224))
* support merging deeply nested configuration ([#1423](https://www.github.com/yargs/yargs/issues/1423)) ([bae66fe](https://www.github.com/yargs/yargs/commit/bae66feee45cb59241facc978c8fdd2bb4d4c751))
* temporary fix for libraries that call Object.freeze() ([#1483](https://www.github.com/yargs/yargs/issues/1483)) ([99c2dc8](https://www.github.com/yargs/yargs/commit/99c2dc850e67c606644f8b0c0bca1a59c87dcbcd))
* **deps:** cliui, find-up, and string-width, all drop Node 6 support ([#1479](https://www.github.com/yargs/yargs/issues/1479)) ([6a9ebe2](https://www.github.com/yargs/yargs/commit/6a9ebe2d955e3e979e76c07ffbb1c17fef64cb49))
* the positional argument parse was clobbering global flag arguments ([#984](https://www.github.com/yargs/yargs/issues/984)) ([7e58453](https://www.github.com/yargs/yargs/commit/7e58453e6a46c59d3f51c0c3ccc933ca68089b4a))
* tolerate null prototype for config objects with `extends` ([#1376](https://www.github.com/yargs/yargs/issues/1376)) ([3d26d11](https://www.github.com/yargs/yargs/commit/3d26d114148118763b37886da32ee2ee2af2d8dc)), closes [#1372](https://www.github.com/yargs/yargs/issues/1372)
* update to yargs-parser with fix for array default values ([#1463](https://www.github.com/yargs/yargs/issues/1463)) ([ebee59d](https://www.github.com/yargs/yargs/commit/ebee59d9022da538410e69a5c025019ed46d13d2))
* **completion:** Avoid default command and recommendations during completion ([#1123](https://www.github.com/yargs/yargs/issues/1123)) ([036e7c5](https://www.github.com/yargs/yargs/commit/036e7c5dfc6f0bb91a7609aac69d529a5e6cfb9f))
* **deps:** Update os-locale to avoid security vulnerability ([#1270](https://www.github.com/yargs/yargs/issues/1270)) ([27bf739](https://www.github.com/yargs/yargs/commit/27bf73923423dbe84dd2fd282fdd31d26bdb6cee))
* **deps:** upgrade cliui for compatibility with latest chalk. ([#1330](https://www.github.com/yargs/yargs/issues/1330)) ([b20db65](https://www.github.com/yargs/yargs/commit/b20db651cdfe6c8899e11295b43cae694b91e744))
* **deps:** use decamelize from npm instead of vendored copy ([#1377](https://www.github.com/yargs/yargs/issues/1377)) ([015eeb9](https://www.github.com/yargs/yargs/commit/015eeb9eec7f89c74140722c9587e334e6596f82))
* **deps:** yargs-parser update addressing several parsing bugs ([#1357](https://www.github.com/yargs/yargs/issues/1357)) ([e230d5b](https://www.github.com/yargs/yargs/commit/e230d5bfd947fcc1bc6007cad59973cbd3f49b01))
* **examples:** fix usage-options.js to reflect current API ([#1375](https://www.github.com/yargs/yargs/issues/1375)) ([6e5b76b](https://www.github.com/yargs/yargs/commit/6e5b76b3a0c2a0abf9e5b1b7273ffd4427352c2d))
* **i18n:** rename unclear 'implication failed' to 'missing dependent arguments' ([#1317](https://www.github.com/yargs/yargs/issues/1317)) ([bf46813](https://www.github.com/yargs/yargs/commit/bf468136724a0903cdc37c3e0788dc7f8131ef03))
* **validation:** Use the error as a message when none exists otherwise ([#1268](https://www.github.com/yargs/yargs/issues/1268)) ([0510fe6](https://www.github.com/yargs/yargs/commit/0510fe6a617fc8af77aa205e44feaa5226e9643c))
* translation not working when using __ with a single parameter ([#1183](https://www.github.com/yargs/yargs/issues/1183)) ([f449aea](https://www.github.com/yargs/yargs/commit/f449aead59f44f826cbcf570cf849c4a59c79c81))
* upgrade os-locale to version that addresses license issue ([#1195](https://www.github.com/yargs/yargs/issues/1195)) ([efc0970](https://www.github.com/yargs/yargs/commit/efc0970bc8f91359905882b6990ffc0786193068))
* use correct completion command in generated completion script ([#988](https://www.github.com/yargs/yargs/issues/988)) ([3c8ac1d](https://www.github.com/yargs/yargs/commit/3c8ac1ddd79cc7adc2fc0214318c7b23d98f613c))
* **command:** Run default cmd even if the only cmd ([#950](https://www.github.com/yargs/yargs/issues/950)) ([7b22203](https://www.github.com/yargs/yargs/commit/7b22203934966d35ec38020ce6893682dea0dac4))
* we shouldn't output help if we've printed a prior help-like message ([#847](https://www.github.com/yargs/yargs/issues/847)) ([17e89bd](https://www.github.com/yargs/yargs/commit/17e89bdd0a59455d1c34d028f1cf6a9e591f71cf))
* **command:** subcommands via commandDir() now supported for parse(msg, cb) ([#678](https://www.github.com/yargs/yargs/issues/678)) ([6b85cc6](https://www.github.com/yargs/yargs/commit/6b85cc61930289bec6c6fcf63f20a973289181ff))
* **commandDir:** make dir relative to caller instead of require.main.filename ([#548](https://www.github.com/yargs/yargs/issues/548)) ([3c2e479](https://www.github.com/yargs/yargs/commit/3c2e4791a38967f554412c1b8abd6dae30cb3985))
* **default:** Remove undocumented alias of default() ([#469](https://www.github.com/yargs/yargs/issues/469)) ([b8591b2](https://www.github.com/yargs/yargs/commit/b8591b2ce4fb1165737e5092f4f616900fedc6b9))
* **locales:** change some translations ([#667](https://www.github.com/yargs/yargs/issues/667)) ([aa966c5](https://www.github.com/yargs/yargs/commit/aa966c53220a6c8c5f06921f53b4d629e5f1d5bd))
* **locales:** conform hi locale to y18n.__n expectations ([#666](https://www.github.com/yargs/yargs/issues/666)) ([22adb18](https://www.github.com/yargs/yargs/commit/22adb188e4baca0701d853497a8b19466ce74d45))
* **locales:** correct some Russian translations ([#691](https://www.github.com/yargs/yargs/issues/691)) ([a980671](https://www.github.com/yargs/yargs/commit/a980671ceae7b8895f120026c9eb243d262cc5d0))
* stop applying parser to context object ([#675](https://www.github.com/yargs/yargs/issues/675)) ([3fe9b8f](https://www.github.com/yargs/yargs/commit/3fe9b8fdbd53da8841cc001cffe7f7794100031a))
* upgrade standard, and fix appveyor config so that it works with newest standard ([#607](https://www.github.com/yargs/yargs/issues/607)) ([c301f42](https://www.github.com/yargs/yargs/commit/c301f42a2ddc4ffcf5e8970299c65f5897279f82))
* use const as a semantic tool ([#502](https://www.github.com/yargs/yargs/issues/502)) ([03ab687](https://www.github.com/yargs/yargs/commit/03ab687e795d33c0af05042686c6bca54ad725ef))
* we now respect the order of _ when applying commands ([#537](https://www.github.com/yargs/yargs/issues/537)) ([ed86b78](https://www.github.com/yargs/yargs/commit/ed86b78e15778e8c442a56952b8caf17daf61b92))
* **my brand!:** I agree with [@osher](https://www.github.com/osher) lightweight isn't a huge selling point of ours any longer, see [#468](https://www.github.com/yargs/yargs/issues/468) ([c46d7e1](https://www.github.com/yargs/yargs/commit/c46d7e14ffe3d561d54990112a043b02cf117555))
* **package:** update camelcase to version 3.0.0 ([#495](https://www.github.com/yargs/yargs/issues/495)) ([796285d](https://www.github.com/yargs/yargs/commit/796285dd6b691af50663def528cc20f67db293cb))
* **pkgConf:** fix aliases issues in .pkgConf() ([#478](https://www.github.com/yargs/yargs/issues/478)) ([b900502](https://www.github.com/yargs/yargs/commit/b9005027c0860999fc53cd80c5305d7d0d2afbe9))
* **windows:** handle $0 better on Windows platforms ([eb6e03f](https://www.github.com/yargs/yargs/commit/eb6e03fc73524edb0a505699751efa894bcfd419))


### Performance Improvements

* defer requiring most external libs until needed ([#584](https://www.github.com/yargs/yargs/issues/584)) ([f9b0ed4](https://www.github.com/yargs/yargs/commit/f9b0ed40f6f23d63663f869ada18097871ed08aa))
* defer windowWidth() to improve perf for non-help usage ([#610](https://www.github.com/yargs/yargs/issues/610)) ([cbc3636](https://www.github.com/yargs/yargs/commit/cbc36360b5abab42384f42c8ffab7083a28b1961))
* normalizing package data is an expensive operation ([#705](https://www.github.com/yargs/yargs/issues/705)) ([49cf533](https://www.github.com/yargs/yargs/commit/49cf53390290c79c573fee45eb5557756f75629d))


### Reverts

* Revert "chore(deps): update dependency eslint to v7 (#1656)" (#1673) ([34949f8](https://www.github.com/yargs/yargs/commit/34949f89ee7cdf88f7b315659df4b5f62f714842)), closes [#1656](https://www.github.com/yargs/yargs/issues/1656) [#1673](https://www.github.com/yargs/yargs/issues/1673)
* Revert "Fixed issue which caused .demand function not to work correctly." ([f33bbb0](https://www.github.com/yargs/yargs/commit/f33bbb0f00fe18960f849cc8e15a7428a4cd59b8))


* fix! yargs.parsed now populated before returning, when yargs.parse() called with no args (#1382) ([e3981fd](https://www.github.com/yargs/yargs/commit/e3981fd3a5f65427b4d8daae7331f956c4d2d70d)), closes [#1382](https://www.github.com/yargs/yargs/issues/1382)


### Miscellaneous Chores

* drop Node 6 from testing matrix ([#1287](https://www.github.com/yargs/yargs/issues/1287)) ([ef16792](https://www.github.com/yargs/yargs/commit/ef167921e9f8d03e4bd08604480e1458cbf861e9))
* drop Node 6 support ([#1461](https://www.github.com/yargs/yargs/issues/1461)) ([2ba8ce0](https://www.github.com/yargs/yargs/commit/2ba8ce05e8fefbeffc6cb7488d9ebf6e86cceb1d))
* test Node.js 6, 8 and 10 ([#1160](https://www.github.com/yargs/yargs/issues/1160)) ([84f9d2b](https://www.github.com/yargs/yargs/commit/84f9d2b07b48b675277f6500551dacaf69379a4c))
* update dependencies ([#1284](https://www.github.com/yargs/yargs/issues/1284)) ([f25de4f](https://www.github.com/yargs/yargs/commit/f25de4fc8b4ad4bfd48080439492e6af50596940))
* upgrade to version of yargs-parser that does not populate value for unset boolean ([#1104](https://www.github.com/yargs/yargs/issues/1104)) ([d4705f4](https://www.github.com/yargs/yargs/commit/d4705f474e0243271b307ea880e8c4e4866218eb))
* upgrade yargs-parser ([#633](https://www.github.com/yargs/yargs/issues/633)) ([cc1224e](https://www.github.com/yargs/yargs/commit/cc1224e7eee001af6a9b9126898b428c053344b9))
* upgrade yargs-parser ([#867](https://www.github.com/yargs/yargs/issues/867)) ([8f9c6c6](https://www.github.com/yargs/yargs/commit/8f9c6c6954b51f6e22d772ba2c7dfbbac5cb504b))


### Code Refactoring

* **ts:** ship yargs.d.ts ([#1671](https://www.github.com/yargs/yargs/issues/1671)) ([c06f886](https://www.github.com/yargs/yargs/commit/c06f886142ad02233db2b2ba82f2e606cbf57ccd))
* remove package.json-based parserConfiguration ([#1460](https://www.github.com/yargs/yargs/issues/1460)) ([0d3642b](https://www.github.com/yargs/yargs/commit/0d3642b6f829b637938774c0c6ce5f6bfe1afa51))

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

* **docs:** TypeScript import to prevent a future major release warning ([#1441](https://www.github.com/yargs/yargs/issues/1441)) ([b1b156a](https://www.github.com/yargs/yargs/commit/b1b156a3eb4ddd6803fbbd56c611a77919293000))
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
* see [yargs-parser@12.0.0 CHANGELOG](https://github.com/yargs/yargs-parser/blob/master/CHANGELOG.md#breaking-changes)
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
