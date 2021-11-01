const advancedResults = (model, populate) => async (req, res, next) => {
    // Initialize query
let query;

//COpy req.query
const reqQuery={...req.query}

//Fields to exclude
const fieldsToRemove =['select','sort','page','limit'];

// Loop over fieldsToRemove and delete them from reqQuery
fieldsToRemove.forEach((param) =>{
    delete reqQuery[param];
});
//console.log(reqQuery);
// create custon query string
let queryStr=JSON.stringify(req.query);
queryStr.replace(/\b(gt|gte|lt|in)\b/g, (match) => '$' + match)
//console.log(queryStr);

query= model.find(JSON.parse(queryStr)) //.populate('dishes');

// Select Fields
if (req.query.select){
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
    //console.log(req.query.select);
}
// sort
if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
}else{
    query= query.sort('createdAt');
}
//Pagination logic
const page =parseInt(req.qury.page, 10) || 1;
const limit= parseInt(req.qury.limit, 10) || 20;
const startIndex = (page - 1)* limit;
const endIndex = page * limit - 1;
const total = await model.countDocuments(JSON.parse(queryStr));

query = query.skip(startIndex).limit(limit);
//Limit 20, Page 3

//Populate
if(populate){
    query = query.populate(populate);
}
//Executing query
const results = await query;
   // const restaurants= await Restaurant.find();

//Pagination results
const pagination ={}
// not on the last page
if(endIndex < total){
    pagination.next ={
      page: page + 1,
      limit  
    }
}

// not on the first page'
if(startIndex >0 ){
    pagination.prev ={
        page: page-1,
        limit
    };
}
res.advancedResults ={
    success: true,
    count:results.length,
    pagination,
    data:results
}

next()

}

module.exports = advancedResults;