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
            res.status(201).send({
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

export const tankFuelData = async(req,res) =>{
    try{
        const {companyCode, stationCode}= req.query;
        // const data= await client.query(`select DISTINCT fuel_type_id, fuel_name from tank_data where station_code='${stationCode}'`)
        const data= await client.query(`select DISTINCT t.tank_number from public.tank_data t where t.company_code='${companyCode}' and t.station_code='${stationCode}'`)
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
            res.status(201).send({
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
        var {startDate,endDate} = req.query;
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

export const tankValues = async(req,res) =>{
    try{
        const {stationCode}= req.query;
        const data = await client.query(`SELECT T.tank_number, F.fuel_name, F.fuel_name, T.data_creation_time, T.fuel_level, T.fuel_vol, T.gross_fuel_vol, T.percent_filling, T.tank_capacity, T.temperature, T.water_level, T.water_vol
	FROM
		(SELECT tank_number, MAX(data_creation_time) AS last_date
			FROM tank_data
			WHERE station_code = '${stationCode}'
			GROUP BY tank_number) SUBQUERY
	INNER JOIN tank_data T
		ON T.tank_number = SUBQUERY.tank_number
			AND T.data_creation_time = SUBQUERY.last_date
	INNER JOIN fuel_name F
		ON F.id = fuel_type_id
	ORDER BY T.tank_number`)

        if(data.rowCount<=0){
            res.status(201).send({
                success:false,
                message:'data not found'
            })
        }
        else{
          var newitem =[];
          for(var i=0;i<data.rows.length;i++){
                  var month = data.rows[i].data_creation_time.getMonth()+1;
                  var date = data.rows[i].data_creation_time.getDate();
                  var year = data.rows[i].data_creation_time.getFullYear();
                  data.rows[i].data_creation_time=year+"-"+('0' + month).slice(-2)+"-"+('0' + date).slice(-2)
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
