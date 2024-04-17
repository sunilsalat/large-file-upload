import multer from "multer";

const storage = multer.diskStorage({
    destination: (req: any, file, cb) => {
        let destinationFolder = "uploads/";
        if (file.mimetype.startsWith("image/")) {
            destinationFolder += "images/";
        } else if (file.mimetype.startsWith("video/")) {
            destinationFolder += "videos/";
        } else {
            destinationFolder += "others/";
        }

        cb(null, destinationFolder);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}-${req.body.chunkIndex}`);
    },
});

export const upload = multer({ storage });
