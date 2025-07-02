import Shoe from "../../models/shoe.model.js";


const suggestShoes = async ( req, res ) => {
    // get the search query from the url eg(/api/shoes/suggest?q=nik)

    const { q } = req.query

    // if no query provided, return an empty array
    if(!q) return res.json([])

    // Find up to 7 shoes where the name or brand contains the query ( case-insensitive)
    const suggestions = await Shoe.find({
        isDeleted: {$ne: true}, // exclude soft-deleted shoes
        $or: [
            { name: {$regex: q, $options: 'i'}},
            { brand: {$regex: q, $options: 'i'}}
        ]
    })
        .limit(7)
        .select('name brand') // Only return name and brand fields


    // send the suggestions as JSON
    res.json(suggestions)
}

export default suggestShoes