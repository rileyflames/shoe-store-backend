import Shoe from '../../models/shoe.model.js';
import { catchAsync } from '../../utils/catchAsync.js';

const getAllShoes = catchAsync(async (req, res) => {
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
    order = 'desc',
    colors,
  } = req.query;

  // 1 Build filters
  const filters = {};

  if (brand) filters.brand = { $regex: brand, $options: 'i' };
  if (category) filters.category = { $regex: category, $options: 'i' };
  if (inStock !== undefined) filters.inStock = inStock === 'true';
  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }
  if (size) {
    filters.sizes = { $in: [Number(size)] };
  }
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
    ];
  }
  if (colors) {
    const colorsArray = Array.isArray(colors) ? colors : [colors];
    filters.colors = { $all: colorsArray };
  }

  // 2 Pagination
  const skip = (Number(page) - 1) * Number(limit);

  // 3 Sorting
  const sortOptions = { [sortBy]: order === 'asc' ? 1 : -1 };

  // 4 Query DB
  const shoes = await Shoe.find({ isDeleted: { $ne: true }, ...filters })
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Shoe.countDocuments({ isDeleted: { $ne: true }, ...filters });

  res.status(200).json({
    total,
    page: Number(page),
    pages: Math.ceil(total / limit) || 0,
    results: shoes,
  });
});

export default getAllShoes;