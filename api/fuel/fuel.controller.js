import {client} from '../../server'


export const insertPriceData = async(req,res) =>{
    try{
        const {company_code,country_code,station_code,fuel_name,price_date,fuel_price}=req.body;
        const data= await client.query(`INSERT INTO fuel_name_price (
            company_code,country_code,station_code,fuel_name,price_date,fuel_price)VALUES('${company_code}', '${country_code}', '${station_code}','${fuel_name}','${price_date}','${fuel_price}')`)

        if(data.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'something wrong'
            })
        }
        else{
          const fuelDataId= await client.query(`select station_code from fuel_name_price ORDER BY ID DESC LIMIT 1`)
            res.status(201).send({
                success:true,
                message:'data added successfully',
                data:fuelDataId.rows[0].station_code
            })
        }
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}

export const countryData = async(req,res) =>{
    try{

        const data= await client.query(`select * from licence_country ORDER BY id ASC`)
        // console.log(data);
        if(data.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'data not found'
            })
        }
        else{
            res.status(201).send({
                success:true,
                message:'data find successfully',
                data:data.rows,
            })
        }
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}
export const companyData = async(req,res) =>{
    try{
        const {countryId}= req.query;
        const data= await client.query(`select * from licence_company where country_id='${countryId}'`)
        // console.log(data);
        if(data.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'data not found'
            })
        }
        else{
            res.status(201).send({
                success:true,
                message:'data find successfully',
                data:data.rows,

            })
        }
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}

export const stationData = async(req,res) =>{
    try{
        const {companyId}= req.query;
        const data= await client.query(`select id,company_code,station_code,station_name from licence_station where company_code='${companyId}'`)
        // console.log(data);
        if(data.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'data not found'
            })
        }
        else{
            res.status(201).send({
                success:true,
                message:'data find successfully',
                data:data.rows,
            })
        }
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}

export const priceData = async(req,res) =>{
    try{
        const {stationId}= req.query;
        const data= await client.query(`select * from fuel_name_price WHERE station_code='${stationId}' order by price_date DESC`)
        console.log(data);
        if(data.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'data not found'
            })
        }
        else{
          const newitem=[];
              for(var i=0;i<data.rows.length;i++){
                  const companyData= await client.query(`select * from licence_company where id='${data.rows[i].company_code}' `)
                  data.rows[i].company_code=companyData.rows[0].company_name
                  const countryData= await client.query(`select * from licence_country where id='${data.rows[i].country_code}' `)
                  data.rows[i].country_code=countryData.rows[0].country_name
                  const stationData= await client.query(`select * from licence_station where id='${data.rows[i].station_code}' `)
                  data.rows[i].station_code=stationData.rows[0].station_name
                  const fuelData= await client.query(`select * from fuel_name where id='${data.rows[i].fuel_name}' `)
                  data.rows[i].fuel_name=fuelData.rows[0].fuel_name
                  newitem.push(data.rows[i])
              }
            res.status(201).send({
                success:true,
                message:'data find successfully',
                data:newitem,
            })
        }
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}

export const fuelData = async(req,res) =>{
    try{
        const data= await client.query(`select id,fuel_name from fuel_name ORDER BY id ASC`)
        // console.log(data);
        if(data.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'data not found'
            })
        }
        else{
            res.status(201).send({
                success:true,
                message:'data find successfully',
                data:data.rows,
            })
        }
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}
