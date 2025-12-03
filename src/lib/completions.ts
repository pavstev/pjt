import { commandRegistry } from "../bin/registry";

const getCommandDescriptions = (): { name: string; description: string }[] => [
  ...commandRegistry.map(cmd => ({
    name: cmd.name,
    description: cmd.description,
  })),
  { name: "completions", description: "Generate shell completions" },
];

export const generateCompletions = (shell: string): string => {
  const allCommands = [...commandRegistry.map(cmd => cmd.name), "completions"];

  if (shell === "bash") {
    return `_pjt_completions() {
  local cur prev opts
  COMPREPLY=()
  cur="$\{COMP_WORDS[COMP_CWORD]}"
  prev="$\{COMP_WORDS[COMP_CWORD-1]}"
  opts="${allCommands.join(" ")}"

  if [[ $\{cur} == -* ]] ; then
    COMPREPLY=( $(compgen -W "--help --version" -- $\{cur}) )
    return 0
  fi

  COMPREPLY=( $(compgen -W "$\{opts}" -- $\{cur}) )
}

complete -F _pjt_completions pjt`;
  }

  if (shell === "zsh") {
    const commandDescriptions = getCommandDescriptions().map(
      cmd => `${cmd.name}:${cmd.description}`,
    );

    return `#compdef pjt

_pjt() {
  local -a commands
  commands=(
    ${commandDescriptions.map(desc => `'${desc}'`).join("\n    ")}
  )

  _describe 'command' commands
}

_pjt "$@"`;
  }

  if (shell === "fish") {
    const commandDescriptions = getCommandDescriptions().map(
      cmd => `${cmd.name}\t${cmd.description}`,
    );

    return `function __fish_pjt_needs_command
  set cmd (commandline -opc)
  if [ (count $cmd) -eq 1 ]
    return 0
  end
  return 1
end

function __fish_pjt_commands
  echo -e '${commandDescriptions.join("\n  echo -e '")}'
end

complete -f -c pjt -n '__fish_pjt_needs_command' -a '(__fish_pjt_commands)'`;
  }

  throw new Error(
    `Unsupported shell: ${shell}. Supported shells: bash, zsh, fish`,
  );
};
