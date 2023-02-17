// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportAdmin = require('../../../app/controller/admin');
import ExportMenu = require('../../../app/controller/menu');
import ExportUser = require('../../../app/controller/user');

declare module 'egg' {
  interface IController {
    admin: ExportAdmin;
    menu: ExportMenu;
    user: ExportUser;
  }
}
