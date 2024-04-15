const {createFactory,getAllFactory,getByIdFactory,deleteByIdFactory,protectRouteMiddleWare}=require("../utility/crudFactory");
const UserModel=require("../model/userModal")
const createUserHandler= createFactory(UserModel);
const getAllUserHandler= getAllFactory(UserModel);
const getUserByIdHandler= getByIdFactory(UserModel); 
const deleteUserById = deleteByIdFactory(UserModel);
const protectRoute= protectRouteMiddleWare();
module.exports={createUserHandler,getAllUserHandler,getUserByIdHandler,deleteUserById, protectRoute};