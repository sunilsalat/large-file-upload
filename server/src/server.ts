import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { upload } from "./config/muter";

const app = express();
app.use(cors());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
    "/upload",
    upload.single("fileChunk"),
    async (req: Request, res: Response) => {
        const { file }: any = req;
        const { chunkIndex, totalChunks } = req.body;

        console.log("req received", file.originalname, chunkIndex, totalChunks);

        res.sendStatus(200); // Send success response
    }
);

app.post("/assemble", async (req: Request, res: Response) => {
    const tempDir = path.join(__dirname, "../uploads/others");
    const outputFile = path.join(__dirname, "../uploads/videos/blob");

    // Read and concatenate all chunks into the output file
    fs.readdir(tempDir, (err, files) => {
        if (err) {
            console.error("Error reading temporary directory:", err);
            return;
        }

        const sortedFiles = files.sort(); // Ensure chunks are sorted in order
        const writeStream = fs.createWriteStream(outputFile);

        sortedFiles.forEach((file) => {
            const filePath = path.join(tempDir, file);
            const readStream = fs.createReadStream(filePath);
            readStream.pipe(writeStream, { end: false }); // Append data to output file
            readStream.on("end", () => {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting chunk file:", err);
                    }
                });
            });
        });

        writeStream.on("finish", () => {
            console.log("File reassembled successfully:", outputFile);
            // Cleanup: Close write stream and perform any additional cleanup steps
        });
    });
    return res.status(200).json({ msg: "ok" });
});

app.get("video", async (req: Request, res: Response) => {});

app.listen(8000, () => {
    console.log("server started on port 8000...");
});
