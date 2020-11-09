declare type ArgsOutput = (string | number)[];

// TODO(bcoe): attempt to get the types for YargsInstance working again.
export interface Arguments {
  /** Non-option arguments */
  _: ArgsOutput;
  /** Arguments after the end-of-options flag `--` */
  '--'?: ArgsOutput;
  /** All remaining options */
  [argName: string]: any;
}
