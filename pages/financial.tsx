import logOutOrKeep from "@/components/logOutKeep";
import Seo from "../components/seo";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import TokenRefresh from "@/components/tokenRefresh";

export default function Financial() {
    const reduxAccessToken = useSelector((state:RootState) => state.accessToken);
    let accessToken = TokenRefresh(reduxAccessToken.token);
    return (
        <div>
            <Seo subtitle = "Financial"/>
        </div>
    );
}