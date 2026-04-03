import DailyStock from "../models/dailyStocks.model.js";

export const getDailyStocks = async (req,res) => {
    try {
    const sales = await DailyStock.find().sort({companyname:1})
    if(!sales){
        return res.status(404).json({
            success:false,
            message:"Stock Records Not Found"
        })
    }
    return res.status(200).json({
        success:true,
        dailysales:sales
    })

    } catch (error) {
         return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

