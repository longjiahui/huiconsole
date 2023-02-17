// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExtendIHelper = require('../../../app/extend/helper');
type ExtendIHelperType = typeof ExtendIHelper;
declare module 'egg' {
  interface IHelper extends ExtendIHelperType { }
}