import configKey from '../../config'
import jwt from 'jsonwebtoken';
import {client} from '../../server'

export const getData = async(req,res) =>{
    try{
        const data= await client.query(`select id,customerid,barcode,presettype,presetamount,used,fueltype,fuelname,company_id from barcode_operation ORDER BY id ASC`)
        if(data.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'data not found'
            })
        }
        else{
            const newitem=[];
                for(var i=0;i<data.rows.length;i++){
                    if(data.rows[i].company_id){
                      const companyData= await client.query(`select * from licence_company where id='${data.rows[i].company_id}' `)
                      if(companyData.rowCount>0){
                          data.rows[i].company_id=companyData.rows[0].company_name
                      }
                    }
                    if(data.rows[i].customerid){
                      const customerData= await client.query(`select customer_name from customer_names where id='${data.rows[i].customerid}' `)
                      if (customerData.rowCount>0) {
                          data.rows[i].customerid=customerData.rows[0].customer_name
                      }
                    }
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

export const insertData = async(req,res) =>{
    try{
        var {customerid,barcode,presettype,presetamount,used,fuelname,company_id}=req.body

        const companyData= await client.query(`select * from licence_company where company_name='${company_id}' `)
        const customerData= await client.query(`select * from customer_names where customer_name='${customerid}' `)
        const fuelData= await client.query(`select * from fuel_name where fuel_name='${fuelname}' `)

        const data= await client.query(`INSERT INTO barcode_operation (
            customerid,barcode,presettype,presetamount,used,fueltype,fuelname,company_id)VALUES('${customerData.rows[0].id}', '${barcode}', '${presettype}','${presetamount}','${used}','${fuelData.rows[0].id}','${fuelname}','${companyData.rows[0].id}')`)

        if(data.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'somthing goes to wrong in find data'
            })
        }
        else{
            const dataId= await client.query(`select id from barcode_operation ORDER BY ID DESC LIMIT 1`)

            res.status(201).send({
                success:true,
                message:'data insert successfully',
                data:dataId.rows[0].id
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
        var {id,customerid,barcode,presettype,presetamount,used,fuelname,company_id}=req.body

        const companyData= await client.query(`select * from licence_company where company_name='${company_id}' `)
        const customerData= await client.query(`select * from customer_names where customer_name='${customerid}' `)
        const fuelData= await client.query(`select * from fuel_name where fuel_name='${fuelname}' `)

        const data = await client.query(`UPDATE barcode_operation SET customerid=${customerData.rows[0].id},barcode=${barcode},presettype=${presettype},presetamount=${presetamount},used=${used},fueltype=${fuelData.rows[0].id},fuelname='${fuelname}',company_id=${companyData.rows[0].id}  WHERE id = '${id}'`)

        if(data.rowCount<=0){
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
        const data= await client.query(`DELETE FROM barcode_operation WHERE id='${id}'`)
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

export const getcustomerdata = async(req,res) =>{
    try{
        const data= await client.query(`SELECT id,customer_name FROM customer_names`)
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

export const getfuelname = async(req,res) =>{
    try{
        const {fuelId} = req.body

        const data= await client.query(`SELECT id,fuel_name FROM fuel_name where id=${fuelId}`)
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
