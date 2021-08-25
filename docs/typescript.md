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
import yargs from 'yargs/yargs';

const argv = yargs(process.argv.slice(2)).options({
  a: { type: 'boolean', default: false },
  b: { type: 'string', demandOption: true },
  c: { type: 'number', alias: 'chill' },
  d: { type: 'array' },
  e: { type: 'count' },
  f: { choices: ['1', '2', '3'] }
}).argv;
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

The reason it's a union is because when you call `.argv`, yargs typing doesn't know if you have any asynchronous commands, so it just gives both of them.

This might result in some errors when accessing the properties:

```typescript
const argv = yargs(process.argv.slice(2)).options({
  a: { type: 'boolean', default: false },
  ...
}).argv;

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
  const argv = await parser.argv;
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

# More specific typing for choices()

To improve the `choices` option typing you can also specify its types:

```typescript
type Difficulty = 'normal' | 'nightmare' | 'hell';
const difficulties: ReadonlyArray<Difficulty> = ['normal', 'nightmare', 'hell'];

const argv = yargs.option('difficulty', {
  choices: difficulties,
  demandOption: true
}).argv;
```

`argv` will get  type `'normal' | 'nightmare' | 'hell'`.
