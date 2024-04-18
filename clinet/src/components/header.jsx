import { useNavigate } from "react-router-dom";
import { headerData } from "../assets/headerData";

export const Header = () => {
    const navigate = useNavigate();
    return (
        <div>
            {headerData.map((item, index) => {
                return (
                    <p
                        key={index}
                        onClick={() => {
                            navigate(`${item.path}`);
                        }}
                    >
                        {item.name}
                    </p>
                );
            })}
        </div>
    );
};
