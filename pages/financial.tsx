import logOutOrKeep from "@/components/logOutKeep";
import Seo from "../components/seo";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function Financial() {
    const accessToken = useSelector((state:RootState) => state.accessToken);
    return (
        <div>
            <Seo subtitle = "Financial"/>
        </div>
    );
}