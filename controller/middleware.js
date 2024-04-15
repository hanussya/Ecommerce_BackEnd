

const checkInputValue=  function (req,res,next){
    // if(req.method =="POST"){
        const userDetails =req.body
        console.log("req.body",req.body);
        const isEmpty = Object.keys(userDetails).length==0;
        if(isEmpty){
            res.status(404).json({
                status:"failure",
                message: "userDetails are empty"
            })
        }
        else{
            next();
        }
    // }
    // else{
    //     next();
    // }
}
module.exports={checkInputValue};