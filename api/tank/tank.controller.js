import {client} from '../../server'

export const getcompanyData = async(req,res) =>{
    try{
        const data= await client.query(`SELECT * FROM licence_company`)
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

export const gettankdata = async(req,res) =>{
    try{
      var {companyId,stationId,tankNumber,startDate,endDate} = req.query;
      const data= await client.query(`SELECT data_creation_time,gross_fuel_vol,water_level,tank_capacity,fuel_name FROM tank_data where company_code=${companyId} AND station_code=${stationId} AND tank_number=${tankNumber} AND date(data_creation_time)>='${startDate}' AND date(data_creation_time)<='${endDate}'`)

        if(data.rowCount<=0){
            res.status(401).send({
                success:false,
                message:'data not found'
            })
        }
        else{
          const newitem=[];
          for(var i=0;i<data.rows.length;i++){
                  var month = data.rows[i].data_creation_time.getMonth()+1;
                  var date = data.rows[i].data_creation_time.getDate();
                  var year = data.rows[i].data_creation_time.getFullYear();
                  data.rows[i].data_creation_time=year+"-"+month+"-"+date
                  newitem.push(data.rows[i])
          }
            res.status(201).send({
                success:true,
                message:'data find successfully',
                data:data.rows,
            })
        }
        // console.log("timestamp",JSON.stringify(data.rows[0].data_creation_time);
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}

export const getprevMonthdata = async(req,res) =>{
    try{
      var {station_code}=req.query;
      var dataArray=[];
      let date_ob = new Date();
      var month = date_ob.getMonth();
      var date = date_ob.getDate();
      if(date>=30)
      {
        date=date-2
      }
      var year = date_ob.getFullYear();

      for(i=0;i<6;i++){
        month = month-i
        var startDate = year+"-"+month+"-"+date
        month =month+1
        var endDate = year+"-"+month+"-"+date

        const data = await client.query(`SELECT data_creation_time,gross_fuel_vol,water_level,tank_capacity FROM tank_data where date(data_creation_time)>='${startDate}'AND date(data_creation_time)<='${endDate}'`)
          if(data.rowCount>0){
            for(var i=0;i<data.rows.length;i++){
              var month = data.rows[i].data_creation_time.getMonth()+1;
              var date = data.rows[i].data_creation_time.getDate();
              var year = data.rows[i].data_creation_time.getFullYear();
              data.rows[i].data_creation_time=year+"-"+month+"-"+date
            }
            res.status(201).send({
                success:true,
                message:'data find successfully',
                data:data.rows,
            })
            break;
          }
      }
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}

export const getSummarydata = async(req,res) =>{
    try{
      var dataArray=[];
      let date_ob = new Date();
      var month = date_ob.getMonth();
      var date = date_ob.getDate();
      if(date>=30)
      {
        date=date-2
      }
      var year = date_ob.getFullYear();
      var startDate = year+"-"+month+"-"+date
      month =month+1
      var endDate = year+"-"+month+"-"+date

      const data = await client.query(`SELECT DISTINCT t.tank_capacity FROM public.tank_data t where station_code=1001 and t.tank_number='01' ORDER BY t.tank_capacity desc`)
      const getFuelType = await client.query(`SELECT DISTINCT fuel_name.fuel_name FROM tank_data INNER JOIN fuel_name ON tank_data.fuel_type_id = fuel_name.id Where tank_data.station_code=1001 and tank_data.tank_number='01'`)
      const getNumberofRecords = await client.query(`SELECT count(*) FROM tank_data where date(data_creation_time)>='${startDate}'AND date(data_creation_time)<='${endDate}'`)

      dataArray.push(data.rows[0].tank_capacity)
      dataArray.push(getFuelType.rows[0].fuel_name)
      dataArray.push(getNumberofRecords.rows[0].count)

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
                data:dataArray,
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

export const tankstationData = async(req,res) =>{
    try{
        const {companyId}= req.query;
        const data= await client.query(`select DISTINCT station_code from tank_data where company_code='${companyId}'`)

        const get_satation = await client.query(`select id, station_code, station_name from licence_station where station_code=${data.rows[0].station_code}`)
        data.rows[0].station_name=get_satation.rows[0].station_name
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
                // data:data.rows,
                data:get_satation.rows,
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


export const tankFuelData = async(req,res) =>{
    try{
        const {stationCode}= req.query;
        // const data= await client.query(`select DISTINCT fuel_type_id, fuel_name from tank_data where station_code='${stationCode}'`)
        const data= await client.query(`select DISTINCT tank_number from tank_data where station_code='${stationCode}'`)
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


export const dispenserSaleData = async(req,res) =>{
    try{
        var {contryCode,companyId,stationCode,startDate,endDate} = req.query;
        const contryData =await client.query(`SELECT * FROM licence_country where id='${contryCode}'`)
        const stationData =await client.query(`SELECT * FROM licence_station where id='${stationCode}'`)
        const data= await client.query(`SELECT * FROM dispenser_sale where country_code=${contryData.rows[0].country_code} AND company_code=${companyId} AND station_code=${stationData.rows[0].station_code} AND date(data_creation_time)>='${startDate}' AND date(data_creation_time)<='${endDate}'`)
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
                    if(companyData.rowCount>0){
                        data.rows[i].company_code=companyData.rows[0].company_name
                    }
                    const stationData=await client.query(`select * from licence_station where station_code='${data.rows[i].station_code}' `)
                    if(stationData.rowCount>0){
                        data.rows[i].station_code=stationData.rows[0].station_name
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
export const blacklistFilter = async(req,res) =>{
    try{
        var {startDate,endDate} = req.body;
        let date_ob = new Date();
        var month = date_ob.getMonth();
        var date = date_ob.getDate();
        if(date>=30)
        {
            date=date-2
        }
        var year = date_ob.getFullYear();
        var start = year+"-"+month+"-"+date
        month =month+1
        var end = year+"-"+month+"-"+date
        if(startDate==undefined){
            startDate = start
        }
        if(endDate==undefined){
            endDate=end
        }
        const data= await client.query(`SELECT
        blacklist_history_customer.id EventID,
        blacklist_history_customer.blacklist_date as Date,
        Customer_names.customer_name as Customer,
        Customer_names.id as CID,
        blacklist_history_customer.blacklist_value as Value,
        blacklist_history_customer.reason as Reason,
        blacklist_history_customer.erp_code as ErpCode
        FROM public.blacklist_history_customer
        INNER JOIN Customer_names ON Customer_names.id = blacklist_history_customer.customerid
        where date(blacklist_history_customer.blacklist_date)>='${startDate}' AND date(blacklist_history_customer.blacklist_date)<='${endDate}'`)
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