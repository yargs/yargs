export const command = 'init [dir]'
export const desc = 'Create an empty repo'
export const builder = {
  dir: {
    default: '.'
  }
}
export function handler (argv) {
  console.log('init called for dir', argv.dir)
}
