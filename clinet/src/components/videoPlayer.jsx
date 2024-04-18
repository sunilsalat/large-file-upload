// VideoPlayer.js
import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

export const VideoPlayer = ({ videoStreamUrl }) => {
    const [videoUrl, setVideoUrl] = useState("");

    useEffect(() => {
        const fetchVideoStream = async () => {
            try {
                const response = await axios.get(videoStreamUrl);
                setVideoUrl(response.data.streamUrl);
            } catch (error) {
                console.error("Error fetching video stream:", error);
            }
        };

        fetchVideoStream();
    }, [videoStreamUrl]);

    return (
        <div>
            {videoUrl && (
                <ReactPlayer
                    url={videoUrl}
                    controls
                    width="100%"
                    height="100%"
                />
            )}
        </div>
    );
};
