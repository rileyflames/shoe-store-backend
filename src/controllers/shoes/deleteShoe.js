



const deleteShoe = async ( req, res )=>{
    res.status(200).json({
        "success" : true,
        "message" : "Shoe deleted successfully"
    })
}

export default deleteShoe