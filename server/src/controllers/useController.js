const { Model } = require("mongoose");
const Quiz = require 
const findAllGeneric = (Model, modelName) => async (req, res) => {
  try {
    const data = await Model.find();
    res.status(200).json({
      message: `List of ${modelName}`,
      data: data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const findGenericActive = (Model, modelName) => async (req, res) => {
  try {
    const data = await Model.find({ active: true });
    console.log("List sp" , data)
    res.status(200).json({
      message: `List of ${modelName}`,
      data: data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const findAllGenericRef =
  (Model, refModel = []) =>
    async (req, res) => {
      try {
        let query = Model.find();
        refModel.forEach((fields) => {
          query = query.populate(fields);
        });
        const data = await query.exec();
        res.status(200).json({ data });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    };

const findIdGenericRef =
  (Model, refModel = []) =>
    async (req, res) => {
      try {
        let query = Model.findById(req.params.id);
        refModel.forEach((fields) => {
          query = query.populate(fields);
        });

        const data = await query.exec();
        if (!data) {
          return res.status(404).json({ message: "Data not found" });
        }

        res.status(200).json({ data });
      } catch (err) {
        res.status(500).json({ message: err.message });
        ``;
      }
    };

const findIdGeneric = (Model, modelName) => async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: `${modelName} not found` });
    }
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error retrieving ${modelName}: ${error.message}` });
  }
};

const findUserIdGeneric = (Model, modelName, populateFields = "") => async (req, res) => {
  try {
    const userId = req.params.id;

    // Gọi populate nếu có truyền vào
    let query = Model.find({ user: userId });
    if (populateFields) {
      query = query.populate(populateFields);
    }

    const data = await query;

    // if (!data || data.length === 0) {
    //   return res.status(404).json({ message: `${modelName} not found for user` });
    // }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: `Error retrieving ${modelName}: ${error.message}`
    });
  }
};

const createGeneric = (Model, modelName) => async (req, res) => {
  try {
    const newData = new Model(req.body);
    console.log("🚀 ~ createGeneric ~ newData:", newData)
    const savedData = await newData.save();

    console.log(`Successfully created ${modelName}:`, savedData);

    res.status(201).json({
      message: `${modelName} created successfully`,
      data: savedData,
    });
  } catch (error) {
    console.error(`Error creating ${modelName}:`, {
      message: error.message,
      stack: error.stack,
      errors: error.errors || null,
    });

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        message: `Validation error while creating ${modelName}`,
        errors: validationErrors,
      });
    }

    res.status(500).json({
      message: `Error creating ${modelName}`,
      error: error.message,
    });
  }
};

const deletedSoftGeneric = (Model) => async (req, res) => {
  try {

    const data = await Model.findById(req.params.id);
    console.log("data", data);
    if(!data){
      return res.status(404).json({message: "Data not found"});
    }
    data.active = false;
    await data.save();
    return res.status(200).json({message: "Document is deleted"});
  } catch (error) {
    console.error(`Error updating ${modelName}:`, {
      message: error.message,
      stack: error.stack,
      errors: error.errors || null,
    });

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        message: `Validation error while updating ${modelName}`,
        errors: validationErrors,
      });
    }

    res.status(500).json({
      message: `Error updating ${modelName}`,
      error: error.message,
    });
  }
}

const updateGeneric = (Model, modelName) => async (req, res) => {
  try {
    const updatedData = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedData) {
      return res.status(404).json({ message: `${modelName} not found` });
    }

    console.log(`Successfully updated ${modelName}:`, updatedData);

    res.status(200).json({
      message: `${modelName} updated successfully`,
      data: updatedData,
    });
  } catch (error) {
    console.error(`Error updating ${modelName}:`, {
      message: error.message,
      stack: error.stack,
      errors: error.errors || null,
    });

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        message: `Validation error while updating ${modelName}`,
        errors: validationErrors,
      });
    }

    res.status(500).json({
      message: `Error updating ${modelName}`,
      error: error.message,
    });
  }
};


const deleteGeneric = (Model, modelName) => async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await Model.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ message: `${modelName} not found` });
    }

    res.json({ message: `${modelName} deleted successfully` });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error deleting ${modelName}: ${error.message}` });
  }
};

module.exports = {
  findAllGeneric,
  findIdGeneric,
  createGeneric,
  updateGeneric,
  deleteGeneric,
  findAllGenericRef,
  findIdGenericRef,
  findGenericActive,
  deletedSoftGeneric,
  findUserIdGeneric,
};
