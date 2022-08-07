import {
  CommandHandler,
  CommandInstance,
  FrozenCommandInstance,
  isCommandBuilderCallback,
} from './command.js';
import {completionFigTemplate} from './completion-templates.js';
import {Positional} from './parse-command.js';
import {
  Dictionary,
  NotEmptyArray,
  PlatformShim,
} from './typings/common-types.js';
import {UsageInstance} from './usage.js';
import {YargsInstance, OptionDefinition} from './yargs-factory.js';

type CompactOptionDefinition = Omit<
  OptionDefinition,
  | 'boolean'
  | 'string'
  | 'number'
  | 'count'
  | 'array'
  | 'describe'
  | 'description'
  | 'deprecated'
  | 'demandOption'
  | 'require'
  | 'required'
>;

function toArray<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : [v];
}

export class FigCompletion {
  /* The command to run to generate the spec */
  declare command: string | null;

  constructor(
    private readonly yargs: YargsInstance,
    private readonly shim: PlatformShim,
    private readonly usage: UsageInstance
  ) {}

  private prefixOption(base: Fig.Option): Fig.Option {
    const prefixer = (v: string) => (v.length > 1 ? `--${v}` : `-${v}`);
    return {
      ...base,
      name: toArray(base.name).map(prefixer),
      exclusiveOn: base.exclusiveOn?.map(prefixer),
      dependsOn: base.dependsOn?.map(prefixer),
    };
  }

  private negateOption(base: Fig.Option): Fig.Option {
    const negated = {
      ...base,
      name: toArray(base.name).map(v => `no-${v}`),
    };
    negated.exclusiveOn = [
      ...(negated.exclusiveOn ?? []),
      (base.name as NotEmptyArray<string>)[0],
    ];

    return negated;
  }

  private compactOptionDefinition(
    def: OptionDefinition
  ): CompactOptionDefinition {
    return {
      ...def,
      desc: def.desc || def.describe || def.description,
      type:
        def.type ||
        (def.boolean
          ? 'boolean'
          : def.count
          ? 'count'
          : def.array
          ? 'array'
          : def.number
          ? 'number'
          : 'string'),
      demand: def.demand || def.demandOption || def.require || def.required,
      deprecate: def.deprecate || def.deprecated,
    };
  }

  private generateCompactOptionDefinitionsFromInstance(
    y: YargsInstance
  ): Dictionary<CompactOptionDefinition> {
    const options = y.getOptions();
    // aliased options get added later to the fig option
    const aliases = new Set(
      Object.values(options.alias).reduce<string[]>(
        (p, c) => [...p, ...toArray(c)],
        []
      )
    );
    const {
      key,
      alias,
      array,
      boolean,
      choices,
      count,
      narg,
      default: defaultValue,
      demandedOptions,
      deprecatedOptions,
      hiddenOptions,
      number,
      string,
    } = options;

    const validation = y.getInternalMethods().getValidationInstance();
    const conflicting = validation.getConflicting();
    const implied = validation.getImplied();

    const descriptions = y
      .getInternalMethods()
      .getUsageInstance()
      .getDescriptions();

    const definitions: Dictionary<OptionDefinition> = {};
    for (const option of Object.keys(key)) {
      if (aliases.has(option)) continue;
      const definition: OptionDefinition = {
        alias: alias[option],
        desc: descriptions[option],
        array: array.includes(option),
        boolean: boolean.includes(option),
        nargs: narg[option],
        choices: choices[option],
        count: count.includes(option),
        default: defaultValue[option],
        demand: Object.keys(demandedOptions).includes(option) || undefined,
        deprecate: Object.keys(deprecatedOptions).includes(option)
          ? deprecatedOptions[option] ?? true
          : undefined,
        hidden: hiddenOptions.includes(option),
        number: number.includes(option),
        string: string.includes(option),
        implies: implied[option] ?? [],
        conflicts: (conflicting[option] ?? []).filter(
          (v): v is string => v !== undefined
        ),
      };
      definitions[option] = this.compactOptionDefinition(definition);
    }
    return definitions;
  }

  private generateFigOptionsFromCompactOptionDefinitions(
    definitions: Dictionary<CompactOptionDefinition>,
    excludingPositionals: string[],
    helpOption: string | null,
    versionOption: string | null
  ): Fig.Option[] {
    const argNames = new Set(excludingPositionals);
    const figOptions: Fig.Option[] = [];
    for (const [option, definition] of Object.entries(definitions)) {
      if (argNames.has(option)) continue;
      figOptions.push(
        ...this.generateFigOptionsFromCompactOptionDefinition(
          option,
          definition,
          option === helpOption || option === versionOption,
          argNames
        )
      );
    }
    return figOptions;
  }

  private generateOptionArgs(definition: CompactOptionDefinition): Fig.Arg[] {
    const {type, nargs, choices} = definition;
    const argCount = typeof nargs !== 'undefined' ? nargs : 1;
    const arg: Fig.Arg = {
      ...(type &&
        ['number', 'string', 'boolean'].includes(type) && {
          name: type,
        }),
      ...(type === 'array' && argCount === 1 && {isVariadic: true}),
    };
    if (choices) {
      arg.suggestions = toArray(choices);
    } else if (type === 'boolean') {
      arg.suggestions = ['true', 'false'];
    }
    return Array(argCount).fill(arg);
  }

  private generateFigOptionsFromCompactOptionDefinition(
    name: string,
    definition: CompactOptionDefinition,
    isHelpOrVersion: boolean,
    argNames: Set<string>
  ): Fig.Option[] {
    const {
      demand,
      nargs,
      alias,
      hidden,
      deprecate,
      desc,
      type,
      choices,
      implies,
      conflicts,
    } = definition;

    const conflicting = toArray(conflicts ?? []).filter(v => !argNames.has(v));
    const implied = toArray(implies ?? []).filter(
      (v): v is string => typeof v !== 'number' && !argNames.has(v)
    );
    const mainOption: Fig.Option = {
      name: [name, ...toArray(alias ?? [])],
      ...(desc && {
        description: desc.replace('__yargsString__:', ''),
      }),
      ...(demand && {isRequired: true}),
      ...(deprecate && {
        deprecated:
          typeof deprecate === 'string' ? {description: deprecate} : true,
      }),
      ...(hidden && {hidden: true}),
      ...(type === 'count' && {isRepeatable: true}),
      ...(conflicting.length && {exclusiveOn: conflicting}),
      ...(implied.length && {dependsOn: implied}),
    };
    if (isHelpOrVersion) return [this.prefixOption(mainOption)];

    if (type === 'boolean' && (!nargs || nargs === 1)) {
      // if option only has one bool argument we consider it as argument less but we add both --opt and --no-opt
      let negatedOption: Fig.Option | undefined = undefined;
      if (
        this.yargs.getInternalMethods().getParserConfiguration()[
          'boolean-negation'
        ] ??
        true
      ) {
        negatedOption = this.negateOption(mainOption);
        if (!mainOption.exclusiveOn) {
          mainOption.exclusiveOn = [];
        }
        mainOption.exclusiveOn.push(
          (negatedOption.name as NotEmptyArray<string>)[0]
        );
      }
      mainOption.args = {
        name: 'boolean',
        suggestions: ['true', 'false'],
        isOptional: true,
      };
      const returnedOptions = [mainOption];
      if (negatedOption) returnedOptions.push(negatedOption);
      return returnedOptions.map(this.prefixOption);
    }

    if (
      nargs ||
      choices ||
      (definition.type &&
        ['array', 'string', 'number'].includes(definition.type))
    ) {
      // then we have at least one argument
      mainOption.args = this.generateOptionArgs(definition);
    }
    return [this.prefixOption(mainOption)];
  }

  private positionalToFigArg(pos: Positional, optional: boolean): Fig.Arg {
    const {cmd, variadic} = pos;
    return {
      name: cmd.join('|'),
      ...(variadic && {isVariadic: true}),
      ...(optional && {isOptional: true}),
    };
  }

  private generateCommandArgs(
    demanded: Positional[],
    optional: Positional[],
    options?: Dictionary<CompactOptionDefinition>
  ): Fig.Arg[] {
    const allPositionals = [...demanded, ...optional];
    const figArgs: Fig.Arg[] = [];

    for (let i = 0; i < allPositionals.length; i++) {
      const positional = allPositionals[i];
      const figArg = this.positionalToFigArg(positional, i >= demanded.length);

      if (options) {
        const definition = options[positional.cmd[0]];
        if (definition) {
          const {alias, desc, choices, default: defaultValue} = definition;
          Object.assign(figArg, {
            ...(alias && {name: [figArg.name, ...toArray(alias)].join('|')}),
            ...(desc && {description: desc}),
            ...(defaultValue && {default: defaultValue.toString()}),
            ...(choices && {suggestions: toArray(choices)}),
          });
        }
      }

      figArgs.push(figArg);
    }

    return figArgs;
  }

  private generateCommandFromHandler(
    name: string[],
    commandHandler: CommandHandler
  ): Fig.Subcommand {
    const {builder, deprecated, demanded, description, optional} =
      commandHandler;
    const figCommand: Fig.Subcommand = {
      name,
      ...(deprecated && {deprecated}),
      ...(description && {description}),
    };

    if (isCommandBuilderCallback(builder)) {
      const y = this.yargs.getInternalMethods().reset();
      builder(y, true);
      const internalMethods = y.getInternalMethods();
      const subcommandInstance = internalMethods.getCommandInstance();
      const optionDefinitions =
        this.generateCompactOptionDefinitionsFromInstance(y);
      Object.assign(figCommand, {
        subcommands: this.generateSubcommands(
          subcommandInstance.handlers,
          subcommandInstance.aliasMap
        ),
        options: this.generateFigOptionsFromCompactOptionDefinitions(
          optionDefinitions,
          y.getGroups()[this.usage.getPositionalGroupName()],
          internalMethods.getHelpOpt(),
          internalMethods.getVersionOpt()
        ),
      });
      if (demanded.length > 0 || optional.length > 0) {
        Object.assign(figCommand, {
          args: this.generateCommandArgs(demanded, optional, optionDefinitions),
        });
      }
    } else {
      const figOptions: Fig.Option[] = [];
      for (const [option, optionDefinition] of Object.entries(builder)) {
        figOptions.push(
          ...this.generateFigOptionsFromCompactOptionDefinition(
            option,
            this.compactOptionDefinition(optionDefinition),
            false,
            new Set()
          )
        );
      }
      Object.assign(figCommand, {
        options: figOptions,
        ...((demanded.length > 0 || optional.length > 0) && {
          args: this.generateCommandArgs(demanded, optional),
        }),
      });
    }
    return figCommand;
  }

  private generateSubcommands(
    handlers: Dictionary<CommandHandler>,
    aliases: Dictionary<string>
  ): Fig.Subcommand[] {
    const aliasMap = new Map<string, string[]>(); // we store the command main name and all his aliases here
    const figSubcommands: Fig.Subcommand[] = [];
    for (const [alias, command] of Object.entries(aliases)) {
      const _aliases = aliasMap.get(command);
      aliasMap.set(command, _aliases ? [..._aliases, alias] : [command, alias]);
    }
    for (const [name, handler] of Object.entries(handlers)) {
      if (name === '$0' || name === this.command) continue;
      figSubcommands.push(
        this.generateCommandFromHandler(aliasMap.get(name) ?? [name], handler)
      );
    }
    return figSubcommands;
  }

  generateCompletionSpec($0: string, command: string | null): string {
    this.command = command;
    const template = completionFigTemplate;
    const name = this.shim.path.basename($0);
    const internalMethods = this.yargs.getInternalMethods();
    let baseCommandInstance:
      | CommandInstance
      | FrozenCommandInstance
      | undefined = internalMethods.getCommandInstance();
    if (this.command !== null) {
      const {frozens} = internalMethods.getCommandInstance();
      baseCommandInstance = frozens[frozens.length - 1];
    }
    const spec: Fig.Spec = {
      name,
    };
    if (baseCommandInstance) {
      /* there are two places where commands may be added, under an imported yargs instance
       * e.g. yargs
       *        .command(...)
       * or under the default command builder declared in yargs instance
       * e.g. yargs
       *        .command('$0', desc, y => {
       *          return y.command(...)
       *    }, () => {})
       */
      const {handlers, aliasMap, defaultCommand} = baseCommandInstance;
      const optionDefinitions =
        this.generateCompactOptionDefinitionsFromInstance(this.yargs);
      const subcommands = this.generateSubcommands(handlers, aliasMap);
      if (defaultCommand) {
        Object.assign(
          spec,
          this.generateCommandFromHandler([name], defaultCommand)
        );
      } else {
        const options = this.generateFigOptionsFromCompactOptionDefinitions(
          optionDefinitions,
          [],
          internalMethods.getHelpOpt(),
          internalMethods.getVersionOpt()
        );
        spec.options = options;
      }
      if (spec.subcommands) {
        spec.subcommands.push(...subcommands);
      } else {
        spec.subcommands = subcommands;
      }
    }
    return template.replace(
      /{{stringified_spec_object}}/g,
      JSON.stringify(spec, null, 2)
    );
  }
}
