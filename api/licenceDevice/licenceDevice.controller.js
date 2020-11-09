import configKey from '../../config'
import jwt from 'jsonwebtoken';
import {client} from '../../server'

export const getData = async(req,res) =>{
    try{
        const profileData= await client.query(`select * from licence_device ORDER BY id ASC`)
        // console.log(profileData);
        if(profileData.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'data not found'
            })
        }
        else{
            const newitem=[];
            // console.log(profileData.rows.length, "profileData.rows.length");
                for(var i=0;i<profileData.rows.length;i++){
                  // console.log(profileData.rows[i].licence_expiry_date);
                  // const data = profileData.rows[i].licence_expiry_date.split('T')
                  // const data = profileData.rows[i].licence_expiry_date
                  // console.log("data",data.split('T'));
                    // profileData.rows[i].licence_expiry_date=data
                    // console.log("=-=-=--=-=proifle data", profileData.rows[i].licence_expiry_date);

                    const companyData= await client.query(`select * from licence_company where id='${profileData.rows[i].company_code}' `)
                    profileData.rows[i].company_code=companyData.rows[0].company_name
                    // console.log("=-=-=-=-profileData.rows[i]", profileData.rows[i].licence_expiry_date);
                    newitem.push(profileData.rows[i])
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
export const insertData = async(req,res) =>{
    try{
        var {devuid,devid,station_code,company_code,country_code,version,compile_date,dev_type,suplier,distributor,licence_status,licence_expiry_date,sale_date,sale_by,op_status}=req.body
        const companyData= await client.query(`select * from licence_company where company_name='${company_code}' `)
        console.log(companyData.rows[0].id);
        const companyCode = await client.query(`SELECT licence_country.country_code FROM licence_country INNER JOIN licence_company ON licence_country.id = licence_company.country_id where licence_company.
        id='${companyData.rows[0].id}';`)
        // console.log("=-=-==-=-=-=compo code",companyCode.rows[0]);
        country_code = companyCode.rows[0].country_code
        console.log("country_code",country_code);
        const profileData= await client.query(`INSERT INTO licence_device (devuid,devid,station_code,company_code,country_code,version,compile_date,dev_type,suplier,distributor,licence_status,licence_expiry_date,sale_date,sale_by,op_status)VALUES('${devuid}', '${devid}', '${station_code}','${companyData.rows[0].id}','${country_code}','${version}','${compile_date}','${dev_type}','${suplier}','${distributor}','${licence_status}','${licence_expiry_date}','${sale_date}','${sale_by}','${op_status}')`)
        // console.log(profileData);
        if(profileData.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'somthing goes to wrong in find data'
            })
        }
        else{
          const profileDataId= await client.query(`select id from licence_device ORDER BY ID DESC LIMIT 1`)
            res.status(201).send({
                success:true,
                message:'data insert successfully',
                data:profileDataId.rows[0].id
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
export const updateData = async(req,res) =>{
    try{
        var {id,devuid,devid,station_code,company_code,country_code,version,compile_date,dev_type,suplier,distributor,licence_status,licence_expiry_date,sale_date,sale_by,op_status}=req.body
        const companyData= await client.query(`select * from licence_company where company_name='${company_code}' `)
        // console.log(companyData.rows[0].id);
        const companyCode = await client.query(`SELECT licence_country.country_code FROM licence_country INNER JOIN licence_company ON licence_country.id = licence_company.country_id where licence_company.
        id='${companyData.rows[0].id}';`)
        // console.log("=-=-==-=-=-=compo code",companyCode.rows[0].country_code);
        country_code = companyCode.rows[0].country_code
        // console.log("country_code",country_code);
        const profileData= await client.query(`UPDATE licence_device SET devuid='${devuid}',devid='${devid}',station_code='${station_code}',company_code='${companyData.rows[0].id}',country_code='${country_code}',version='${version}',compile_date='${compile_date}',dev_type='${dev_type}',suplier='${suplier}',distributor='${distributor}',licence_status='${licence_status}',licence_expiry_date='${licence_expiry_date}',sale_date='${sale_date}',sale_by='${sale_by}',op_status='${op_status}'  WHERE id = '${id}'`)
        if(profileData.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'somthing goes to wrong in find data'
            })
        }
        else{
            res.status(201).send({
                success:true,
                message:'data update successfully',
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

export const deleteData = async(req,res) =>{
    try{
        const {id} =req.body;
        const profileData= await client.query(`DELETE FROM licence_device WHERE id='${id}'`)
        if(profileData.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'data not found'
            })
        }
        else{
            res.status(201).send({
                success:true,
                message:'data deleted successfully ',
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

export const countryCode = async(req,res) =>{
    try{
        const {companyCode} =req.body;
        const data = await client.query(`SELECT licence_country.country_code FROM licence_country INNER JOIN licence_company ON licence_country.id = licence_company.country_id where licence_company.
        id='${companyCode}';`)
        // console.log("=-=-==-=-=-=compo code",data.rows[0].country_code);
        if(data.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'data not found'
            })
        }
        else{
            res.status(201).send({
                success:true,
                message:'data deleted successfully ',
                data:data.rows[0].country_code
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



export const supplierData = async(req,res) =>{
    try{
        const data = await client.query(`select * from licence_suppliers ORDER BY id ASC`)
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
export const distributorData = async(req,res) =>{
    try{
        const data = await client.query(`select * from licence_distributor ORDER BY id ASC`)
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
