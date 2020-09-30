exports.photoupload=async(req,res,next)=>{
    try {
        const bootcamp=await Bootcamp.findById(req.params.id);
        if(!bootcamp){
            res.status(400).json({
                success:false,
            })
        }
      if(!req.files){
        return  next(new ErrorResponse(` Please upload a file`,400));
      }
      const file=req.files.file;
      //MAKE SURE THAT IMAGE IS PHOTO
      if(!file.mimetype.startsWith('image')){
        return  next(new ErrorResponse(` Please upload a image file`,400));
      }
      if(file.size>process.env.MAX_FILE_UPLOAD){
        return  next(new ErrorResponse(` Please upload a image less than ${process.env.process.env.MAX_FILE_UPLOAD}`,400));
      }
      //create custome filename
      file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`;
      console.log(file.name);
      file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err=>{
          if(err){
              console.error(err);
              return  next(new ErrorResponse(` Problem with fileupload`,500));

          }
          await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name});
          res.status(200).json({
              success:true,
              data:file.name
          })
      })
    } catch (err) {
        next(err);
    }

}
