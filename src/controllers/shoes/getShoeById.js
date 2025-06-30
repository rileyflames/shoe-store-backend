

const getShoeById = async ( req, res ) => {
    res.status(200).json({
        "success" : true,
        "message" : "Retrieved the requested shoe"
    })
}

export default getShoeById