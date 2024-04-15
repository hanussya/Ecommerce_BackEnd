const bookingModel=require("../model/bookingModel");
const {protectRouteMiddleWare} = require("../utility/crudFactory");
const protectRouteMiddle= protectRouteMiddleWare();
module.exports={protectRouteMiddle};

