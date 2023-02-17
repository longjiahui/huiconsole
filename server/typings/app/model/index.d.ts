// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportMenu = require('../../../app/model/menu');
import ExportUser = require('../../../app/model/user');

declare module 'egg' {
  interface IModel {
    Menu: ReturnType<typeof ExportMenu>;
    User: ReturnType<typeof ExportUser>;
  }
}
