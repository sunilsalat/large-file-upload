import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Listing = () => {
    const navigate = useNavigate();
    const [list, setList] = useState();

    const fetchList = async () => {
        const res = await axios.get("http://localhost:8000/video/list");
        setList(res.data.files);
    };

    const handleClick = (item) => {
        navigate(`detail/${item}`);
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div>
            {list &&
                list.map((item, index) => {
                    return (
                        <div key={index} onClick={() => handleClick(item)}>
                            {item}
                        </div>
                    );
                })}
        </div>
    );
};
