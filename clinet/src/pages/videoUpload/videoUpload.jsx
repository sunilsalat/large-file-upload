import { useState } from "react";
import axios from "axios";

export function VideoUpload() {
    const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB chunk size

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const uploadChunk = async (chunkData, chunkIndex, totalChunks) => {
        try {
            const formData = new FormData();
            formData.append("chunkIndex", chunkIndex.toString());
            formData.append("totalChunks", totalChunks);
            formData.append("file", `${selectedFile.name}-${chunkIndex}`);
            formData.append("fileChunk", chunkData);

            // Make an HTTP POST request to upload the chunk
            await axios.post("http://localhost:8000/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded.`);
        } catch (error) {
            console.error("Error uploading chunk:", error);
            // Handle error (e.g., retrying upload, displaying error message)
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const fileSize = selectedFile.size;
            const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);
            let startByte = 0;

            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                const chunk = selectedFile.slice(
                    startByte,
                    startByte + CHUNK_SIZE
                );
                await uploadChunk(chunk, chunkIndex + 1, totalChunks);
                startByte += CHUNK_SIZE;
            }

            await axios.post(
                `http://localhost:8000/api/assemble/${selectedFile.name}`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        } else {
            alert("Please select a file to upload.");
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}
