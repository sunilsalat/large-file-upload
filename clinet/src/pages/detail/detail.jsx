import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import style from "./detail.module.css";

export const Detail = () => {
    const { filename } = useParams();

    return (
        <div className={style.container}>
            {detail && (
                <ReactPlayer
                    url={`http://localhost:8000/video/${filename}`}
                    controls
                    width="60%"
                    height="60%"
                />
            )}
        </div>
    );
};
