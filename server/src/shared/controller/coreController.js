const findAllGeneric = (Model, modelName) => async (context, req) => {
    try {
        const data = await Model.find();
        return {
            status: 200,
            body: {
                message: `List of ${modelName}`,
                data,
            },
        };
    } catch (err) {
        return {
            status: 500,
            body: { message: err.message },
        };
    }
};

const findGenericActive = (Model, modelName) => async (context, req) => {
    try {
        const data = await Model.find({ active: true });
        return {
            status: 200,
            body: {
                message: `List of active ${modelName}`,
                data,
            },
        };
    } catch (err) {
        return {
            status: 500,
            body: { message: err.message },
        };
    }
};

const findAllGenericRef = (Model, refModel = []) => async (context, req) => {
    try {
        let query = Model.find();
        refModel.forEach((fields) => {
            query = query.populate(fields);
        });
        const data = await query.exec();
        return {
            status: 200,
            body: { data },
        };
    } catch (err) {
        return {
            status: 500,
            body: { message: err.message },
        };
    }
};

const findIdGenericRef = (Model, refModel = []) => async (context, req) => {
    try {
        const { id } = req.params || req.query;
        let query = Model.findById(id);
        refModel.forEach((fields) => {
            query = query.populate(fields);
        });

        const data = await query.exec();
        if (!data) {
            return { status: 404, body: { message: "Data not found" } };
        }

        return { status: 200, body: { data } };
    } catch (err) {
        return { status: 500, body: { message: err.message } };
    }
};

const findIdGeneric = (Model, modelName) => async (context, req) => {
    try {
        const { id } = req.params || req.query;
        const data = await Model.findById(id);

        if (!data) {
            return { status: 404, body: { message: `${modelName} not found` } };
        }

        return { status: 200, body: data };
    } catch (err) {
        return {
            status: 500,
            body: { message: `Error retrieving ${modelName}: ${err.message}` },
        };
    }
};

const findUserIdGeneric = (Model, modelName, populateFields = "") => async (context, req) => {
    try {
        const userId = req.params?.id || req.query?.id;

        let query = Model.find({ user: userId });
        if (populateFields) {
            query = query.populate(populateFields);
        }

        const data = await query;

        return {
            status: 200,
            body: data,
        };
    } catch (err) {
        return {
            status: 500,
            body: { message: `Error retrieving ${modelName}: ${err.message}` },
        };
    }
};

const createGeneric = (Model, modelName) => async (context, req) => {
    try {
        const newData = new Model(req.body);
        const savedData = await newData.save();

        return {
            status: 201,
            body: {
                message: `${modelName} created successfully`,
                data: savedData,
            },
        };
    } catch (err) {
        if (err.name === "ValidationError") {
            const validationErrors = Object.values(err.errors).map((e) => ({
                field: e.path,
                message: e.message,
            }));
            return {
                status: 400,
                body: {
                    message: `Validation error while creating ${modelName}`,
                    errors: validationErrors,
                },
            };
        }

        return {
            status: 500,
            body: {
                message: `Error creating ${modelName}`,
                error: err.message,
            },
        };
    }
};

const updateGeneric = (Model, modelName) => async (context, req) => {
    try {
        const { id } = req.params || req.query;
        const updatedData = await Model.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedData) {
            return { status: 404, body: { message: `${modelName} not found` } };
        }

        return {
            status: 200,
            body: {
                message: `${modelName} updated successfully`,
                data: updatedData,
            },
        };
    } catch (err) {
        if (err.name === "ValidationError") {
            const validationErrors = Object.values(err.errors).map((e) => ({
                field: e.path,
                message: e.message,
            }));
            return {
                status: 400,
                body: {
                    message: `Validation error while updating ${modelName}`,
                    errors: validationErrors,
                },
            };
        }

        return {
            status: 500,
            body: {
                message: `Error updating ${modelName}`,
                error: err.message,
            },
        };
    }
};

const deleteGeneric = (Model, modelName) => async (context, req) => {
    try {
        const { id } = req.params || req.query;
        const deletedData = await Model.findByIdAndDelete(id);

        if (!deletedData) {
            return { status: 404, body: { message: `${modelName} not found` } };
        }

        return { status: 200, body: { message: `${modelName} deleted successfully` } };
    } catch (err) {
        return {
            status: 500,
            body: { message: `Error deleting ${modelName}: ${err.message}` },
        };
    }
};

const deletedSoftGeneric = (Model, modelName) => async (context, req) => {
    try {
        const { id } = req.params || req.query;
        const data = await Model.findById(id);

        if (!data) {
            return { status: 404, body: { message: "Data not found" } };
        }

        data.active = false;
        await data.save();

        return { status: 200, body: { message: "Document is deleted" } };
    } catch (err) {
        if (err.name === "ValidationError") {
            const validationErrors = Object.values(err.errors).map((e) => ({
                field: e.path,
                message: e.message,
            }));
            return {
                status: 400,
                body: {
                    message: `Validation error while updating ${modelName}`,
                    errors: validationErrors,
                },
            };
        }

        return {
            status: 500,
            body: {
                message: `Error updating ${modelName}`,
                error: err.message,
            },
        };
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
