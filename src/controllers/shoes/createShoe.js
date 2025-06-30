

const createShoe = async ( req, res )=>{
    res.status(200).json({
        "success" : true,
        "message" : "Shoe created successfully"
    })
}

export default createShoe