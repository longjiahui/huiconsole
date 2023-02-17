// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportError = require('../../../app/middleware/error');
import ExportLog = require('../../../app/middleware/log');

declare module 'egg' {
  interface IMiddleware {
    error: typeof ExportError;
    log: typeof ExportLog;
  }
}
