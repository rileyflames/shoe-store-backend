import Shoe from "../../models/shoe.model.js"

const getAllShoes = async ( req, res )=>{
   
    const {
        page = 1,
        limit = 12,
        brand,
        category,
        inStock,
        minPrice,
        maxPrice,
        size,
        search,
        sortBy = 'createdAt',
        order = 'desc'
    } =req.query

    //1 Build filters
    const filters = {}

    if(brand) filters.brand = brand
    if(category) filters.category = category
    if(inStock !== undefined) filters.inStock = inStock === 'true'

    //2 Price range
    if(minPrice || maxPrice){
        filters.price = {}
        if( minPrice ) filters.price.$gte = Number(minPrice)
        if( maxPrice ) filters.price.$lte = Number(maxPrice)
    }

    // 3 Size filter
    if (size) {
        filters.sizes = { $in:[Number(size)]} // returns any shoe with that size
    }

    //4 Full-text search on name + description 
    if(search) {
        filters.$or = [
            { name: new RegExp(search, 'i')},
            { description: new RegExp(search, 'i')}
        ]
    }

    // 5 Pagination
    const skip = (Number(page) - 1) * Number(limit)

    //6 Sorting
    const sortOptions = { [sortBy]: order === 'asc' ? 1: -1 }

    //7 Query DB
    const shoes = await Shoe.find(filters)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))

    const total = await Shoe.countDocuments(filters)

    res.json({
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        results: shoes,
    })
}


export default getAllShoes