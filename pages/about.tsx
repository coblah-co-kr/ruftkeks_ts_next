import Seo from "@/components/seo";
import { useEffect, useState } from "react";
import styles from "./about.module.css";
import { User } from "./_app";
import goToHome from "@/components/goToHome";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import logOutOrKeep from "@/components/logOutKeep";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { updateAddress, updateEmail, updateLatitude, updateLinks, updateLongitude, updateName, updateNickname, updateOverviewImg, updatePhone, updateProfileImg, updateRole } from "@/store/myInfoUpdate";
import TokenRefresh from "@/components/tokenRefresh";
import Cookies from "js-cookie";

class Dummy extends User {
    constructor(
        protected name:string,
        protected address:string,
        protected phone:string,
        protected email:string,
        protected addressLatY:number,
        protected addressLngX:number,
    ) {
        super(name, address, phone, email);
        this.addressLatY = addressLatY;
        this.addressLngX = addressLngX;
    }

    getLatLng(): [number, number] {
        return [this.addressLatY, this.addressLngX];
    }
}

interface UsersInfo {
    latitude : number,
    longitude : number,
    name : string,
    nickname : string,
    email : string,
    phone : string,
    address: string,
    links : Array<string>,
    profileImg : string,
    overviewImg : string,
}
export default function About() {
    const reduxAccessToken = (useSelector((state:RootState) => state.accessToken));
    let accessToken = TokenRefresh(reduxAccessToken.token);
    const router = useRouter();
    goToHome(accessToken, router);
    const dispatch = useDispatch();
    const [users, setUsers] = useState<Array<UsersInfo>>([]);
    const [isKakaoMapLoaded, setKakaoMapLoaded] = useState(false);

    const [name, setName] = useState("");
    const [nickname, setNickName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [links, setLinks] = useState<Array<string>>([]);
    const [profileImg, setProfileImg] = useState("");
    const [overviewImg, setOverviewImg] = useState("");

    const getMyInfo = async (_accessToken : string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/account/me`,
                {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${_accessToken}`
                    }
                },
            )
            if (response.status === 403) {
                logOutOrKeep(_accessToken, dispatch);
                alert("세션이 만료되었습니다.");
                goToHome(accessToken, router, true);
            } else if (response.status === 200) {
                const data = await(response).json();
                console.log(data);
                dispatch(updateName(data.name));
                dispatch(updateNickname(data.nickname));
                dispatch(updateAddress(data.address));
                dispatch(updateEmail(data.email));
                dispatch(updatePhone(data.phone));
                dispatch(updateLinks(data.links));
                dispatch(updateProfileImg(data.profileImg));
                dispatch(updateOverviewImg(data.overviewImg));
                dispatch(updateLongitude(data.longitude));
                dispatch(updateLatitude(data.latitude));
                dispatch(updateRole(data.role));
                Cookies.set("name", data.name, {expires : 7});
                Cookies.set("nickname", data.nickname, {expires : 7});
                Cookies.set("address", data.address, {expires : 7});
                Cookies.set("email", data.email, {expires : 7});
                Cookies.set("phone", data.phone, {expires : 7});
                Cookies.set("links", data.links, {expires : 7});
                Cookies.set("profileImg", data.profileImg, {expires : 7});
                Cookies.set("overviewImg", data.overviewImg, {expires : 7});
                Cookies.set("longitude", data.longitude, {expires : 7});
                Cookies.set("latitude", data.latitude, {expires : 7});
                if (!data.address || !data.email || !data.phone) {
                    alert("추가정보를 입력해주세요.")
                    router.push("/mypage", undefined, { shallow:true })
                }
            } else {
                console.log(response.status);
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getAllUsers = async (_accessToken : string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/account/users`,
                {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${_accessToken}`
                    }
                },
            )
            if (response.status === 403) {
                logOutOrKeep(_accessToken, dispatch);
                alert("세션이 만료되었습니다.");
                goToHome(accessToken, router, true);
            } else if (response.status === 200) {
                const data = await(response).json();
                setUsers(data);
                if (name === '') {
                    setName(data[0].name);
                    setNickName(data[0].nickname);
                    setEmail(data[0].email);
                    setPhone(data[0].phone);
                    setAddress(data[0].address);
                    setLinks(data[0].links);
                    setProfileImg(data[0].profileImg);
                    setOverviewImg(data[0].overviewImg);
                }
            } else {
                console.log(response.status);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getMyInfo(accessToken);
        const script = document.createElement("script");
        script.type="text/javascript";
        script.src=`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}&autoload=false`;
        script.async=true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                setKakaoMapLoaded(true);
            });
        };
        document.head.appendChild(script);
        getAllUsers(accessToken);
    }, []);
    
    useEffect(() => {
        if (isKakaoMapLoaded) {
            const options = {
                center: new window.kakao.maps.LatLng(35.450701, 127.570667),
                level: 13,
            };
            const map = new window.kakao.maps.Map(document.getElementById("map"), options);
            const markerImage = new window.kakao.maps.MarkerImage(
                (
                    profileImg ? `https://ruuftkeksimg.s3.ap-northeast-2.amazonaws.com/${profileImg}` : "/icons/no_profile.png"
                ), 
                new window.kakao.maps.Size(64, 69), 
                { offset: new window.kakao.maps.Point(27, 69) }
            );
            users.forEach(user => {
                const position = new window.kakao.maps.LatLng(user.latitude, user.longitude);
                const marker = new window.kakao.maps.Marker({
                    position: position,
                    image: markerImage,
                    title: user.name
                });
            
                marker.setMap(map);
            
                window.kakao.maps.event.addListener(marker, 'click', function() {
                    console.log(user);
                    setName(user.name);
                    setNickName(user.nickname);
                    setEmail(user.email);
                    setPhone(user.phone);
                    setAddress(user.address);
                    setLinks(user.links);
                    setProfileImg(user.profileImg);
                    setOverviewImg(user.profileImg);
                });
            });
        }  
    }, [isKakaoMapLoaded, users]);

    const getIconFromLink = (strLink:string) => {
        if (strLink && strLink.includes("vercel")) {
            return "favicon.ico"
        } else {
            return "/icons/link.png"
        }
        
    }

    return (
        <div className="mx-auto h-auto grid justify-items-center">
            <Seo subtitle = "About"/>
            {isKakaoMapLoaded && (
                <div className="flex flex-col mt-10">
                    <div className="flex flex-row mb-5 mx-20">
                        <img src={profileImg ? `https://ruuftkeksimg.s3.ap-northeast-2.amazonaws.com/${profileImg}` : "/icons/no_profile.png"} className="w-2/5"/>
                        <div className="flex flex-col justify-around ml-5">
                            <p>
                                {`${name}(${nickname})`}
                            </p>
                            <p>
                                {email}
                            </p>
                            <p>
                                {phone}
                            </p>
                            <p>
                                <img className="w-7" src={getIconFromLink(links[0])} alt="" onClick={ () => router.push(links[0])}/>
                            </p>
                        </div>
                    </div>
                    <div className="mb-5 mx-20">
                        {address}
                    </div>
                    <div className="flex flex-col justify-center">
                        <img className="rounded-xl" src={`https://ruuftkeksimg.s3.ap-northeast-2.amazonaws.com/${overviewImg}`} alt="" />
                    </div>
                </div>
            )}
            {!isKakaoMapLoaded ? <h4>Loading..</h4> : (
                <div id="map" className="rounded-xl shadow-lg px-48 py-96 mt-10"/>
            )}
        </div>
    );
}