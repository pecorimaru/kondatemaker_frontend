import * as Const from '../constants/constants.js';


export function isConvTypePer100Unit(convType) {
  return convType === Const.UNIT_CONV_TYPE_100_COMP ? true : false;
};

export function convUnitToPer100Unit(convRate) {
  return 100 / (convRate);
};


export function per100UnitToConvUnit(convRate) {
  return 100 * (convRate) / 100;
};

