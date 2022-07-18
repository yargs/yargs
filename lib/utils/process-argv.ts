function getProcessArgvBinIndex() {
  // The binary name is the first command line argument for:
  // - bundled Electron apps: bin argv1 argv2 ... argvn
  if (isBundledElectronApp()) return 0;
  // or the second one (default) for:
  // - standard node apps: node bin.js argv1 argv2 ... argvn
  // - unbundled Electron apps: electron bin.js argv1 arg2 ... argvn
  return 1;
}

function isBundledElectronApp() {
  // process.defaultApp is either set by electron in an electron unbundled app, or undefined
  // see https://github.com/electron/electron/blob/main/docs/api/process.md#processdefaultapp-readonly
  return isElectronApp() && !(process as ElectronProcess).defaultApp;
}

function isElectronApp() {
  // process.versions.electron is either set by electron, or undefined
  // see https://github.com/electron/electron/blob/main/docs/api/process.md#processversionselectron-readonly
  return !!(process as ElectronProcess).versions.electron;
}

export function hideBin(argv: string[]) {
  return argv.slice(getProcessArgvBinIndex() + 1);
}

export function getProcessArgvBin() {
  return process.argv[getProcessArgvBinIndex()];
}

interface ElectronProcess extends NodeJS.Process {
  defaultApp?: boolean;
  versions: NodeJS.ProcessVersions & {
    electron: string;
  };
}
