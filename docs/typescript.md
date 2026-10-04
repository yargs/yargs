# Config

The following examples assumes a config of the following:

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "CommonJS",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  },
  "include": ["cli.ts"]
}
```

Some of the code may be different depending on your config.

# TypeScript usage examples

The TypeScript definitions take into account yargs' `type` key and the presence of
`demandOption`/`default`.

The following `.options()` definition:

```typescript
#!/usr/bin/env node
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2)).options({
  a: { type: 'boolean', default: false },
  b: { type: 'string', demandOption: true },
  c: { type: 'number', alias: 'chill' },
  d: { type: 'array' },
  e: { type: 'count' },
  f: { choices: ['1', '2', '3'] }
}).parse();
```

Will result in an `argv` that's typed like so:

```typescript
{
  [x: string]: unknown;
  a: boolean;
  b: string;
  c: number | undefined;
  d: (string | number)[] | undefined;
  e: number;
  f: string | undefined;
  _: string[];
  $0: string;
} | Promise<{
  [x: string]: unknown;
  a: boolean;
  b: string;
  c: number | undefined;
  d: (string | number)[] | undefined;
  e: number;
  f: string | undefined;
  _: string[];
  $0: string;
}>
```

As you can see it's a union of the arguments and a promise which resolves to the arguments.
The reason for this is because in yargs, you can have commands, and those commands can be asynchronous. If they are asynchronous, the parser would resolve after the command is finished.

The reason it's a union is because when you call `.parse()`, yargs typing doesn't know if you have any asynchronous commands, so it just gives both of them.

This might result in some errors when accessing the properties:

```typescript
const argv = yargs(process.argv.slice(2)).options({
  a: { type: 'boolean', default: false },
  ...
}).parse();

argv.a // => Property 'a' does not exist on type...
```

If you know your program is not using any asynchronous commands, you can simply use [`#parseSync`](https://yargs.js.org/docs/#api-reference-parsesyncargs-context-parsecallback)

```typescript
const argv = yargs(process.argv.slice(2)).options({
  a: { type: 'boolean', default: false },
  ...
}).parseSync();

argv.a // => No error, type: boolean
```

If you do have asynchronous commands, you will need to use `await`:

```typescript
const parser = yargs(process.argv.slice(2)).options({
  a: { type: 'boolean', default: false },
  ...
});


(async() => {
  const argv = await parser.parse();
  argv.a // => No error, type: boolean
})();
```

You will likely want to define an interface for your application, describing the form that
the parsed `argv` will take:

```typescript
interface Arguments {
  [x: string]: unknown;
  a: boolean;
  b: string;
  c: number | undefined;
  d: (string | number)[] | undefined;
  e: number;
  f: string | undefined;
}
```

If you need to use [`.wrap()`](https://yargs.js.org/docs/#api-reference-wrapcolumns) with `.terminalWidth()`, you may need to create instance first:

```ts
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// ...

const yargsInstance = yargs(hideBin(process.argv));

const args = yargsInstance
  .wrap(yargsInstance.terminalWidth())
  // .otherMethods(...)
  .parse()
  
```

# More specific typing for choices()

To improve the `choices` option typing you can also specify it as const:

```typescript
const argv = yargs.option('difficulty', {
  choices: ["normal", "nightmare", "hell"] as const,
  demandOption: true
}).parse();
```

`argv.difficulty` will get  type `'normal' | 'nightmare' | 'hell'`.

# Typed parent and child commands

A `CommandModule` describes a command's input and parsed arguments. Define the
child command's positional argument in its builder so its handler receives a
required `string`. Register the child in the parent builder and use
`.demandCommand(1)` at both levels to require a parent and a child command.

This example uses ES modules: set `"type": "module"` in `package.json`, install
`typescript`, `@types/node`, and `@types/yargs`, and use this `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "outDir": "dist"
  },
  "include": ["cli.ts"]
}
```

```typescript
// cli.ts
import yargs from 'yargs';
import type { ArgumentsCamelCase, Argv, CommandModule } from 'yargs';
import { hideBin } from 'yargs/helpers';

interface GreetArguments {
  name: string;
}

const greet: CommandModule<{}, GreetArguments> = {
  command: 'greet <name>',
  describe: 'Greet someone',
  builder: (parser: Argv<{}>): Argv<GreetArguments> => parser.positional('name', {
    type: 'string',
    demandOption: true,
    describe: 'The person to greet'
  }),
  handler: (argv: ArgumentsCamelCase<GreetArguments>): void => {
    console.log(`Hello, ${argv.name}!`);
  }
};

const user: CommandModule<{}, {}> = {
  command: 'user',
  describe: 'Manage users',
  builder: (parser: Argv<{}>): Argv<{}> => parser.command(greet).demandCommand(1),
  handler: (): void => {}
};

yargs(hideBin(process.argv))
  .command(user)
  .demandCommand(1)
  .strict()
  .help()
  .parseSync();
```

Compile with `npx tsc`, then run `node dist/cli.js user greet Alice`.
`node dist/cli.js user --help` lists the child command, and
`node dist/cli.js user greet --help` describes its required positional argument.
