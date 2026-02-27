const log = (level: string, message: string, meta?: object) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  console.log(JSON.stringify(entry));
};

export const logger = {
  info: (message: string, meta?: object) => log('INFO', message, meta),
  error: (message: string, meta?: object) => log('ERROR', message, meta),
  warn: (message: string, meta?: object) => log('WARN', message, meta),
  debug: (message: string, meta?: object) => log('DEBUG', message, meta),
};
