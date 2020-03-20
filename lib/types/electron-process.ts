export interface ElectronProcess extends NodeJS.Process {
  defaultApp?: boolean
  versions: NodeJS.ProcessVersions & {
    electron: string
  }
}
