const logLevel: LogLevel =
  (localStorage.getItem("logLevel") as LogLevel) || "info";

const colors = [
  "31m", // red
  "32m", // green
  "33m", // yellow
  "34m", // blue
  "35m", // magenta
  "36m", // cyan
  "91m", // bright red
  "92m", // bright green
  "93m", // bright yellow
  "94m", // bright blue
  "95m", // bright magenta
  "96m", // bright cyan
] as const;

type LogLevel = keyof typeof logLevels;

const logLevels = {
  debug: 0,
  info: 1,
  warning: 2,
  error: 3,
} as const;

const getUniqueColorFromName = (name: string) => {
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[sum % colors.length];
};

const formatColor = (color: (typeof colors)[number], value: string): string => {
  return `\x1b[${color}${value}\x1b[0m`;
};

export const createLogger = (name: string) => {
  return {
    info: (...args: any[]) => {
      if (logLevels[logLevel] <= logLevels.info) {
        console.log(
          `${formatColor("34m", `[info]`)} ${formatColor(
            getUniqueColorFromName(name),
            `[${name}]`
          )}`,
          ...args
        );
      }
    },
    debug: (...args: any[]) => {
      if (logLevels[logLevel] <= logLevels.debug) {
        console.debug(
          `${formatColor("36m", `[debug]`)} ${formatColor(
            getUniqueColorFromName(name),
            `[${name}]`
          )}`,
          ...args
        );
      }
    },
    error: (...args: any[]) => {
      if (logLevels[logLevel] <= logLevels.error) {
        console.error(
          `${formatColor("31m", `[error]`)} ${formatColor(
            getUniqueColorFromName(name),
            `[${name}]`
          )}`,
          ...args
        );
      }
    },
    warning: (...args: any[]) => {
      if (logLevels[logLevel] <= logLevels.warning) {
        console.warn(
          `${formatColor("33m", `[warn]`)} ${formatColor(
            getUniqueColorFromName(name),
            `[${name}]`
          )}`,
          ...args
        );
      }
    },
  };
};
