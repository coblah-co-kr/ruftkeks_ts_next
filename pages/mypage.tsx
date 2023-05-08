import { RootState } from "@/store";
import Seo from "../components/seo";
import { useSelector } from "react-redux";

export default function MyPage() {
    const myInfo = useSelector((state:RootState) => state.myInfo);
    console.log(myInfo.name);
    console.log(myInfo.nickname);
    console.log(myInfo.address);
    console.log(myInfo.email);
    console.log(myInfo.phone);
    return (
        <div>
            <Seo subtitle = "MyPage"/>
        </div>
    );
}