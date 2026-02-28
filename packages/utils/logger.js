const log = (level, message, meta) => {
  const entry = { timestamp: new Date().toISOString(), level, message, ...meta };
  console.log(JSON.stringify(entry));
};
exports.logger = {
  info: (message, meta) => log('INFO', message, meta),
  error: (message, meta) => log('ERROR', message, meta),
  warn: (message, meta) => log('WARN', message, meta),
  debug: (message, meta) => log('DEBUG', message, meta),
};
