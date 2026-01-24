import mrModel from "../models/mr.model.js";

// get all Mr's
export const getAllMr=async(req,res)=>{
try {
    const mr= await mrModel.find();
    return res.status(200).json(mr);
} catch (error) {
    return res.status(500).json({
        success:false,
        message:'Internal Error in Server for getting mr list'+" "
    })
}
}
// get single Mr's
export const getOneMr = async (req, res) => {
  try {
    const { mr } = req.query;
    const singleMr = await mrModel.findOne({ mrname: mr });

    if (!singleMr) {
      return res.status(404).json({
        success: false,
        message: "MR not found"
      });
    }

    return res.status(200).json(singleMr);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error " + error
    });
  }
};

// Get MR list by Name
export const getMrByName = async (req, res) => {
  try {
    const { mrname } = req.body;
    const mrList = await mrModel.find({ mrname: mrname });

    if (!mrList || mrList.length === 0) {
      return res.status(200).json({
        success: false,
        message: "MR not found"
      });
    }
    return res.status(200).json({mrList,message:'Found MR'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error ",
      error:error
    });
  }
};

// // add Mr's to
export const postMr=async(req,res)=>{
    try {
        const mr = await mrModel.create(req.body);
        return res.status(201).json({
            success:true,
            createdMr:mr
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Error in adding Data '+error
        })
    }
}
// update MR dueamount
export const updateMr = async (req,res) => {
    try {
      const {_id ,paidamount,dueamount} = req.body;

      if(!_id){
        return res.status(400).json({message:'ID is required'})
      }

      const updated = await mrModel.findByIdAndUpdate(
        _id,
        {paidamount,dueamount},
        {new:true}
      );

      if(!updated){
        return res.status(404).json({message:'MR not Found'});
      }

      return res.json({
        message:'Payment Updated Successfully',
        updatedData:updated,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:'Server Error'})
    }
};