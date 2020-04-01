import yargsParser = require('yargs-parser')

export interface ParserConfiguration extends yargsParser.Configuration {
  /** Should command be sorted in help */
  'sort-commands': boolean
}
