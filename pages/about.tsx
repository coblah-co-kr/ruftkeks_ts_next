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
import { updateAddress, updateEmail, updateName, updateNickname, updatePhone } from "@/store/myInfoUpdate";

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

export default function About() {
    const accessToken = useSelector((state:RootState) => state.accessToken);
    const router = useRouter();
    goToHome(accessToken.token);
    const dispatch = useDispatch();
    const [isKakaoMapLoaded, setKakaoMapLoaded] = useState(false);
    const grant = new Dummy(
        "김용균", "경기 하남시 풍산동", 
        "010-4141-3783", "grant@coblah.co.kr",
        37.5497470827289, 127.191870949288
    );

    const get_users = async (_accessToken : string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/account/me`,
                {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${_accessToken}`
                    }
                },
            )
            if (response.status === 403) {
                logOutOrKeep(`${_accessToken}`, dispatch);
            } else if (response.status === 200) {
                const data = await(response).json();
                console.log(data);
                dispatch(updateName(data.name));
                dispatch(updateNickname(data.nickname));
                dispatch(updateAddress(data.address));
                dispatch(updateEmail(data.email));
                dispatch(updatePhone(data.phone));
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
    useEffect(() => {
        get_users(accessToken.token);
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
    }, []);
    
    useEffect(() => {
        if (isKakaoMapLoaded) {
            const options = {
                center: new window.kakao.maps.LatLng(35.450701, 127.570667),
                level: 13,
            };
            const map = new window.kakao.maps.Map(document.getElementById("map"), options);
            var imageSrc = 'vercel.svg', // 마커이미지의 주소입니다    
                imageSize = new window.kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
                imageOption = {offset: new window.kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                
            // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
            var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

            // 마커를 생성합니다
            const ggl = grant.getLatLng()
            var marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(ggl[0], ggl[1]), 
                image: markerImage,
                title: "김용균",
            });

            var marker2 = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(36.54699, 127.09598),
                image: markerImage,
                title: "김준균",
            });

            // 마커가 지도 위에 표시되도록 설정합니다
            marker.setMap(map);
            marker2.setMap(map);

            window.kakao.maps.event.addListener(marker, 'click', function() {
                // 마커 위에 인포윈도우를 표시합니다
                console.log(marker.Gb);
            });
            window.kakao.maps.event.addListener(marker2, 'click', function() {
                // 마커 위에 인포윈도우를 표시합니다
                console.log(marker2.Gb);
            });
            }  
        }, [isKakaoMapLoaded]);

    return (
        <div>
            <Seo subtitle = "About"/>
            <div className={styles.about}>
                {!isKakaoMapLoaded ? <h4>Loading..</h4> : (
                    <div id="map" className={styles.map}/>
                )}
                {isKakaoMapLoaded && (
                    <div className={styles.profile}>
                        <div className={styles.info}>
                            <img src="no_profile.png" className={styles.profileImg}/>
                            <div className={styles.infoLeft}>
                                <p className={styles.name}>
                                    이름
                                </p>
                                <p className={styles.phone}>
                                    전화번호
                                </p>
                            </div>
                            <div className={styles.infoRight}>
                                <p className={styles.address}>
                                    근거지
                                </p>
                                <p className={styles.email}>
                                    이메일
                                </p>
                            </div>
                        </div>
                        <div className={styles.detailInfo}>
                            약력
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}