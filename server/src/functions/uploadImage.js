const { app } = require('@azure/functions');
const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
const connectDB = require('../shared/mongoose');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

function parseFormData(req) {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });
}

function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        const stream = cloudinary.v2.uploader.upload_stream(
            {
                folder: 'demo_uploads',
                transformation: [{ width: 500, height: 500, crop: 'limit' }],
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );
        fs.createReadStream(file.filepath).pipe(stream);
    });
}

app.http('uploadImages', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'upload/images',
    handler: async (request, context) => {
        try {
            await connectDB();
            const { files } = await parseFormData(request);
            const fileList = Array.isArray(files.images) ? files.images : [files.images];

            if (!fileList || fileList.length === 0) {
                return {
                    status: 400,
                    jsonBody: { message: 'No files uploaded' }
                };
            }

            const uploads = await Promise.all(fileList.slice(0, 5).map(uploadToCloudinary));

            return {
                status: 200,
                jsonBody: {
                    files: uploads
                }
            };
        } catch (error) {
            context.log('Upload error:', error);
            return {
                status: 500,
                jsonBody: { message: 'Upload failed', error: error.message }
            };
        }
    }
});
