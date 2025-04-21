#!/usr/bin/env node
import yargs from 'yargs';

yargs(process.argv.slice(2)).commandDir('cmds').demandCommand().help().parse();
