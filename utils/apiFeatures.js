class ApiFeatures{
    constructor(query,queryStr){
        this.query=query,
        this.queryStr=queryStr
    }

    search(){
        let keyword=this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:'i'
            }
        }:{}
        this.query=this.query.find({...keyword})
        return this
    }
    filter(){
        let queryCopy={...this.queryStr}
       
        let removeFields=['keyword','page','limit']

        removeFields.forEach((key)=>delete queryCopy[key])

        let queryString=JSON.stringify(queryCopy)
        queryString=queryString.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`)


        this.query=this.query.find(JSON.parse(queryString))
         
        return this
        
    }

    pagination(resultPerPage){

        let currentPage=Number(this.queryStr.page) || 1 
        let skip=resultPerPage*(currentPage-1)
        this.query=this.query.limit(resultPerPage).skip(skip)
        return this

    }

    
}

module.exports=ApiFeatures