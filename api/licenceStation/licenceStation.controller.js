import configKey from '../../config'
import jwt from 'jsonwebtoken';
import {client} from '../../server'
import moment from 'moment'

export const getData = async(req,res) =>{
    try{
        const profileData= await client.query(`select * from licence_station ORDER BY id DESC`)
        if(profileData.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'data not found'
            })
        }
        else{
            const newitem=[];
                for(var i=0;i<profileData.rows.length;i++){
                    const companyData= await client.query(`select * from licence_company where id='${profileData.rows[i].company_code}' `)
                    profileData.rows[i].company_code=companyData.rows[0].company_name
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
        var {company_code,station_code,station_name,station_ref,altitute,longitute,status}=req.body
        if(!altitute){
            altitute=NaN
        }
        if(!longitute){
            longitute=NaN
        }
        const companyData= await client.query(`select * from licence_company where company_name='${company_code}' `)
        const profileData= await client.query(`INSERT INTO licence_station (company_code,station_code,station_name,station_ref,altitute,longitute,status)VALUES('${companyData.rows[0].id}', '${station_code}', '${station_name}','${station_ref}','${altitute}','${longitute}','${status}')`)
        if(profileData.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'somthing goes to wrong in find data'
            })
        }
        else{
            const profileDataId= await client.query(`select id from licence_station ORDER BY ID DESC LIMIT 1`)
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
        var {id,company_code,station_code,station_name,station_ref,altitute,longitute,status}=req.body
        if(!altitute){
            altitute=NaN
        }
        if(!longitute){
            longitute=NaN
        }
        const companyData= await client.query(`select * from licence_company where company_name='${company_code}' `)
        const profileData= await client.query(`UPDATE licence_station SET company_code=${companyData.rows[0].id},station_code=${station_code},station_name='${station_name}',station_ref='${station_ref}',altitute='${altitute}',longitute='${longitute}',status='${status}'  WHERE id = '${id}'`)
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
        const profileData= await client.query(`DELETE FROM licence_station WHERE id='${id}'`)
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

export const getCompanyId = async(req,res) =>{
    try{

        const companyId= await client.query(`select id,company_name from licence_company ORDER BY id ASC`)
        if(companyId.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'data not found'
            })
        }
        else{
            res.status(201).send({
                success:true,
                message:'data find successfully',
                data:companyId.rows,

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

export const getStationDetail = async(req,res) =>{
    try{
        const {company_name,station_code} = req.query;
        console.log(company_name,station_code);
        const company_code = await client.query(`select * from licence_company where company_name='${company_name}'`)
        if(company_code.rowCount<=0){
            res.status(201).send({
                success:false,
                message:'company not found'
            })
        }

        const currentDate = moment().utc().format();
        const tommorow_date = moment().add(2,'days').utc().format();

        const summaryToday = await client.query(`SELECT sum (t.amount) as TotalAmount,
                                              sum(t.volume) as TotalVolume,
                                              count(id) as NumberOfSales
                                              FROM public.dispenser_sale t where
                                              t.company_code=${company_code.rows[0].id}
                                              and t.station_code=${station_code}
                                              and data_creation_time>'${currentDate}'
                                              and data_creation_time<'${tommorow_date}'`)

        const stationDetail= await client.query(`SELECT t.id,
                                                       t.data_creation_time,
                                                       F.fuel_name,
                                                       t.plate_info,
                                                       t.rf_card_code,
                                                       t.payment_type,
                                                       t.price_per_volume,
                                                       t.volume,
                                                       t.amount,
                                                       t.start_total,
                                                       t.end_total,
                                                       t.dcr_total,
                                                       t.dev_id,
                                                       t.device_mode,
                                                       t.pump_id,
                                                       t.nozzle_id,
                                                       t.tank_id,
                                                       t.visual_pump_id,
                                                       t.fleet_code,
                                                       t.fleet_name
                                                FROM public.dispenser_sale t
                                                INNER JOIN fuel_name F on t.fuel_type_id = F.id
                                                where company_code=${company_code.rows[0].id}
                                                  and station_code=${station_code}
                                                ORDER BY t.data_creation_time desc
                                                limit 10`)

        const analogDetail = await client.query(`SELECT t.data_creation_time as LastUpdate
                                                     , t.analog_1 as Tank1
                                                     , t.analog_2 as Tank2
                                                     , t.analog_3 as Tank3
                                                     , t.analog_4 as Tank4
                                                FROM public.analog_data t
                                                where station_code=${station_code} and company_code =${company_code.rows[0].id}
                                                ORDER BY t.id desc limit 1`)
        if(summaryToday.rowCount<=0){
            res.status(201).send({
                success:false,
                message:'Summary Today not found'
            })
        } else if(stationDetail.rowCount<=0){
            res.status(201).send({
                success:false,
                message:'Station Detail not found'
            })
        }
        else if(analogDetail.rowCount<=0){
            res.status(201).send({
                success:false,
                message:'Analog Detail not found'
            })
        }
        else{
            res.status(201).send({
                success:true,
                message:'data find successfully',
                summaryToday:summaryToday.rows,
                stationDetail:stationDetail.rows,
                analogDetail:analogDetail.rows,
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


export const getDispenserDetail = async(req,res) =>{
    try{
        const {company_name,station_code} = req.query;
        console.log(company_name,station_code);
        const company_code = await client.query(`select * from licence_company where company_name='${company_name}'`)
        if(company_code.rowCount<=0){
            res.status(201).send({
                success:false,
                message:'company not found'
            })
        }

        const stationDetail= await client.query(`SELECT t.id,
                                                       t.data_creation_time,
                                                       F.fuel_name,
                                                       t.plate_info,
                                                       t.rf_card_code,
                                                       t.payment_type,
                                                       t.price_per_volume,
                                                       t.volume,
                                                       t.amount,
                                                       t.start_total,
                                                       t.end_total,
                                                       t.dcr_total,
                                                       t.dev_id,
                                                       t.device_mode,
                                                       t.pump_id,
                                                       t.nozzle_id,
                                                       t.tank_id,
                                                       t.visual_pump_id,
                                                       t.fleet_code,
                                                       t.fleet_name
                                                FROM public.dispenser_sale t
                                                INNER JOIN fuel_name F on t.fuel_type_id = F.id
                                                where company_code=${company_code.rows[0].id}
                                                and station_code=${station_code}
                                                ORDER BY t.data_creation_time desc`)
      if(stationDetail.rowCount<=0){
          res.status(201).send({
              success:false,
              message:'Dispenser Sale not found'
          })
      }else{
          res.status(201).send({
              success:true,
              message:'data find successfully',
              data:stationDetail.rows,
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
