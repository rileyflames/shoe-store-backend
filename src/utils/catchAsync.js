

export const catchAsync = (fn) => {
    return( req, res, next ) => {
        // call the function, and catch any error it throws ( async or sync )
        fn( req, res, next).catch(next)
    }
}