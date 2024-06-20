

export const fileFiler = (req: Express.Request, file: Express.Multer.File, callback: Function) =>{

    if(!file) return callback(new Error('File inexistente'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtension = ['jpg', 'jpeg', 'png', 'gif']
    if (!validExtension.includes(fileExtension)) return callback(new Error('Extension not allowed'), false);
    return callback(null, true);

}