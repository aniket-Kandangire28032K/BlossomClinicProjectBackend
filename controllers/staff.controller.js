import staffmodel from "../models/staff.model.js";

/**
 * CREATE Staff
 */
export const createStaff = async (req, res) => {
  try {
    const staff = await staffmodel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: staff
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET All Staff
 */
export const getAllStaff = async (req, res) => {
  try {
    const staff = await staffmodel.find().sort({_id:-1});
    res.status(200).json({
      success: true,
      staff,
      message:"Staff Found"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET Single Staff by ID
 */
export const getStaffById = async (req, res) => {
  try {
    const staff = await staffmodel.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found"
      });
    }

    res.status(200).json({
      success: true,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * UPDATE Staff
 */
export const updateStaff = async (req, res) => {
  try {
    const staff = await staffmodel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: staff
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * DELETE Staff
 */
export const deleteStaff = async (req, res) => {
  try {
    const staff = await staffmodel.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};