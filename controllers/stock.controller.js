import Stock from "../models/stock.model.js"
import Medicine from "../models/medicine.model.js"

export const closeStock = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const medicines = await Medicine.find();
    const existingStock = await Stock.findOne({ date: today });

    // If no record for today → create
    if (!existingStock) {
      const products = medicines.map(m => ({
        companyName: m.companyname,
        productname: m.medicinename,
        Openingstock: m.Openingstock || m.stock,
        closingstock: m.stock
      }));

      const stockData = new Stock({
        date: today,
        products
      });

      await stockData.save();

      return res.json({ message: "Stock snapshot saved" });
    }

    // If record exists → update only closingstock
    for (const med of medicines) {
      await Stock.updateOne(
        { date: today, "products.productname": med.medicinename },
        {
          $set: {
            "products.$.closingstock": med.stock
          }
        }
      );
    }

    res.json({
      message: "Closing stock updated"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStock = async (req,res) => {
    try {
        
    
    const stock = await Stock.find();
    if(stock.length === 0 ){
        return res.status(404).json({success:false,message:"No stock Found"})
    }
    stock.forEach(s => {
      if (s.products && Array.isArray(s.products)) {
        s.products.sort((a, b) => {
          const nameA = a.productname || "";
          const nameB = b.productname || "";
          return nameA.localeCompare(nameB);
        });
      }
    });   
    return res.status(200).json({
        success:true,
        stock:stock
    })
    } catch (error) {
     return res.status(500).json({
        message:"Internal Server Error",
        success:false,
        error:error
     })
    }
}