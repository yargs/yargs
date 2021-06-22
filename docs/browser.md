# Running yargs in the browser

Newer versions of yargs have a `./browser.mjs` entry point, which can be used
through a CDN like [unpkg.com](https://unpkg.com/) to load yargs directly in
the browser:

```html
<script type="module">
  import Yargs from 'https://unpkg.com/yargs@16.0.0-beta.1/browser.mjs';
  const yargs = Yargs()
    .scriptName('>')
    .command('clear', 'clear the output window', () => {}, () => {
      // ...
    })
    .command('alert <message...>', 'display an alert', () => {}, (argv) => {
      alert(argv.message.join(' '))
    })
    .wrap(null)
    .strict()
    .demandCommand(1)
    .version('v1.0.0');
</script>
```

A full example can be found in [example/yargs.html](/example/yargs.html), or
on [jsfiddle](https://jsfiddle.net/bencoe/m9fv2oet/3/).
