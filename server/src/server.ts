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
        res.sendStatus(200); // Send success response
    }
);

/* app.post("/assemble", async (req: Request, res: Response) => {
    const tempDir = path.join(__dirname, "../uploads/others");
    const outputFile = path.join(__dirname, "../uploads/videos/blob");

    // Read and concatenate all chunks into the output file
    fs.readdir(tempDir, (err, files) => {
        if (err) {
            console.error("Error reading temporary directory:", err);
            return;
        }

        const sortedFiles = files.sort();
        const writeStream = fs.createWriteStream(outputFile);

        sortedFiles.forEach((file) => {
            console.log(file);
            const filePath = path.join(tempDir, file);
            const readStream = fs.createReadStream(filePath);
            readStream.pipe(writeStream, { end: false });
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
    console.log("slkdjflsf");
    return res.status(200).json({ msg: "ok" });
}); */

app.post("/assemble/:filename", async (req, res) => {
    const { filename } = req.params;
    const tempDir = path.join(__dirname, "../uploads/others");
    const outputFile = path.join(__dirname, `../uploads/videos/${filename}`);

    const sortNumerically = (a: any, b: any) => {
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
    };

    try {
        const files = await fs.promises.readdir(tempDir);
        const sortedFiles = files.sort(sortNumerically);
        const writeStream = fs.createWriteStream(outputFile);

        for (const file of sortedFiles) {
            const filePath = path.join(tempDir, file);
            const readStream = fs.createReadStream(filePath);
            readStream.pipe(writeStream, { end: false });

            await new Promise<void>((resolve, reject) => {
                readStream.on("end", () => {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error("Error deleting chunk file:", err);
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                });
            });
        }

        writeStream.on("finish", () => {
            console.log("File reassembled successfully:", outputFile);
            // Cleanup: Close write stream and perform any additional cleanup steps
        });

        return res.status(200).json({ msg: "ok" });
    } catch (err) {
        console.error("Error reading or processing files:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/video/list", async (req: Request, res: Response) => {
    const files = await fs.promises.readdir(
        path.join(__dirname, "../uploads/videos")
    );
    return res.status(200).json({ files });
});

app.get("/video/:filename", async (req: Request, res: Response) => {
    const videoPath = path.join(
        __dirname,
        `../uploads/videos/${req.params.filename}`
    );

    // Check if the file exists
    if (!fs.existsSync(videoPath)) {
        return res.status(404).send("Video not found");
    }

    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10); // convert string in to integer
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        console.log({ start, end });

        const chunkSize = end - start + 1;
        const fileStream = fs.createReadStream(videoPath, { start, end });

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
            "Cache-Control": "no-store",
        };

        res.writeHead(206, headers);
        fileStream.pipe(res);
    } else {
        // Set headers for download
        // const headers = {
        //     "Content-Type": "video/mp4",
        //     "Content-Disposition": `attachment; filename="${req.params.filename}"`,
        // };
        const headers = {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
            "Cache-Control": "no-store",
        };

        res.writeHead(200, headers);
        fs.createReadStream(videoPath).pipe(res);
    }
});

app.listen(8000, () => {
    console.log("server started on port 8000...");
});
