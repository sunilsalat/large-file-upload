import axios from "axios";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";

export const Detail = () => {
    const [detail, setDetail] = useState(true);
    const { filename } = useParams();

    const fetchDetail = async () => {
        const res = await axios.get(`http://localhost:8000/video/${filename}`);
        setDetail(res.data);
    };

    useEffect(() => {
        // fetchDetail();
    }, [filename]);

    return (
        <div>
            {detail && (
                <ReactPlayer
                    url={`http://localhost:8000/video/${filename}`}
                    controls
                    width="100%"
                    height="100%"
                />
            )}
        </div>
    );
};
