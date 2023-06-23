import { useSelector } from "react-redux";
import Seo from "../components/seo";
import { RootState } from "@/store";
import TokenRefresh from "@/components/tokenRefresh";

export default function Pictures() {
    const reduxAccessToken = useSelector((state:RootState) => state.accessToken);
    let accessToken = TokenRefresh(reduxAccessToken.token);
    return (
        <div>
            <Seo subtitle = "Pictures"/>
        </div>
    );
}