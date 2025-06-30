

const getAllShoes = async ( req, res )=>{
    res.status(200).json({
        "success" : true,
        "message" : "Retrieved all shoes"
    })
}


export default getAllShoes