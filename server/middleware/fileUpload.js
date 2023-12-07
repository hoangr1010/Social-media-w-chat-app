import AWS from 'aws-sdk';


export const uploadFile = async (req, res, next) => {

    const s3 = new AWS.S3();

    try {
        if (req.file) {
            const params = {
                Bucket: 'hoang-social-project',
                Key: req.file.originalname,
                Body: req.file.buffer,
            }
    
            await s3.upload(params, (err, data) => {
                if (err) {
                    throw new Error(err);
                } else {
                    console.log('Upload successfully:', data.key);
                }
            }).promise();
        }

        next();
    } catch (err) {
        return res.status(401).send({ message: err.message });
    }

}

