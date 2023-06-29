import { RootState } from "@/store";
import Seo from "../components/seo";
import { useSelector } from "react-redux";
import { ChangeEvent, useRef, useState} from "react";
import goToHome from "@/components/goToHome";
import logOutOrKeep from "@/components/logOutKeep";
import { useDispatch } from "react-redux";
import { updateAddress, updateName } from "@/store/myInfoUpdate";
import AddressModal from "@/components/addressModal";
import TokenRefresh from "@/components/tokenRefresh";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function MyPage() {
    const profileImgRef = useRef<HTMLInputElement>(null);
    const overviewImgRef = useRef<HTMLInputElement>(null);

    const [profileImg, setProfileImg] = useState<any>();
    const [previewProfileImg, setPreviewProfileImg] = useState<any>();

    const [overviewImg, setOverviewImg] = useState<any>();
    const [previewOverviewImg, setPreviewOverviewImg] = useState<any>();

    const handleProfileImageClick = () => {
        if (profileImgRef.current) {
            profileImgRef.current.click();
        }
    };

    const handleOverviewImageClick = () => {
        if (overviewImgRef.current) {
            overviewImgRef.current.click();
        }
    };

    const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.currentTarget.files) return;
        const file = event.currentTarget.files[0];
        const convertFile = new File([file], file.name, {type: `${file.type}`});
        const reader = new FileReader();
        reader.readAsDataURL(convertFile);
        reader.onloadend = () => setPreviewProfileImg(reader.result);
        setProfileImg(file);
    };

    const handleOverviewImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.currentTarget.files) return;
        const file = event.currentTarget.files[0];
        const convertFile = new File([file], file.name, {type: `${file.type}`});
        const reader = new FileReader();
        reader.readAsDataURL(convertFile);
        reader.onloadend = () => setPreviewOverviewImg(reader.result);
        setOverviewImg(file);
    };

    const dispatch = useDispatch();

    const myInfo = useSelector((state:RootState) => state.myInfo);
    const reduxAccessToken = useSelector((state:RootState) => state.accessToken);
    let accessToken = TokenRefresh(reduxAccessToken.token);
    const router = useRouter();
    goToHome(accessToken, router);
    
    const imgSrc = myInfo.profileImg ? ((previewProfileImg === undefined)? `https://ruuftkeksimg.s3.ap-northeast-2.amazonaws.com/${myInfo.profileImg}` : previewProfileImg ) : (previewProfileImg === undefined)? "/icons/addImg.png" : previewProfileImg;
    const overviewSrc = myInfo.overviewImg ? ((previewOverviewImg === undefined)? `https://ruuftkeksimg.s3.ap-northeast-2.amazonaws.com/${myInfo.overviewImg}` : previewOverviewImg ) : (previewOverviewImg === undefined)? "/icons/addFile.png" : previewOverviewImg;

    const [name, setName] = useState(myInfo.name ? myInfo.name : Cookies.get("name")? Cookies.get("name") : undefined);
    const [email, setEmail] = useState(myInfo.email ? myInfo.email : Cookies.get("email")? Cookies.get("email") : undefined);
    const [phone, setPhone] = useState(myInfo.phone ? myInfo.phone : Cookies.get("phone")? Cookies.get("phone") : undefined);
    const [address, setAddress] = useState(myInfo.address ? myInfo.address : Cookies.get("address")? Cookies.get("address") : undefined);
    const [link1, setLink1] = useState(Cookies.get("links")? Cookies.get("links"): myInfo.links? myInfo.links[0] : undefined);


    const [addressSearch, setAddressSearch] = useState(false);
    const [longitude, setLongitude] = useState(myInfo.longitude ? myInfo.longitude :Cookies.get("longitude")? Cookies.get("longitude"): 0.0);
    const [latitude, setLatitude] = useState(myInfo.latitude ? myInfo.latitude : Cookies.get("latitude")? Cookies.get("latitude") : 0.0);

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value);
    };
    const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };
    const handleLinksChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLink1(event.target.value);
    };

    const handleAddressSearch = () => {
        setAddressSearch(!addressSearch);
    }

    const saveBaseInfo = async() => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/my-page/update`,
                {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        email: email,
                        address: address,
                        phone: phone,
                        links: new Array(link1),
                        longitude: longitude,
                        latitude: latitude,
                    })
                }
            )

            const { status } = response;

            if (status === 200) {
                alert("저장되었습니다.");
            } else if (status === 400) {
                console.log(await(response).text());
            } else if (status === 403) {
                logOutOrKeep(accessToken, dispatch)
                alert("다시 시도해보세요.");
            }
            else {
                console.log("개발자에게 문의하세요");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const saveProfileImg = async() => {
        let formData = new FormData();
        if (name == "" || name == undefined || name == null) {
            console.log("이름이 누락되었습니다.")
            return ;
        }
        formData.append("name", name);
        formData.append("profileImg", profileImg);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/my-page/update/profile_img`,
                {
                    method: "put",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: formData
                }
            )

            const { status } = response;

            if (status === 200) {
                alert("저장되었습니다.");
            } else if (status === 400) {
                console.log(await(response).text());
            } else if (status === 403) {
                logOutOrKeep(accessToken, dispatch)
                alert("다시 시도해보세요.");
            }
            else {
                console.log("개발자에게 문의하세요");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const saveOverviewImg = async() => {
        let formData = new FormData();
        if (name == "" || name == undefined || name == null) {
            console.log("이름이 누락되었습니다.");
            return ;
        }
        formData.append("name", name);
        formData.append("overviewImg", overviewImg);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/my-page/update/overview_img`,
                {
                    method: "put",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: formData
                }
            )

            const { status } = response;

            if (status === 200) {
                alert("저장되었습니다.");
            } else if (status === 400) {
                console.log(await(response).text());
            } else if (status === 403) {
                logOutOrKeep(accessToken, dispatch)
                alert("다시 시도해보세요.");
            }
            else {
                console.log("개발자에게 문의하세요");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSaveMyInfo = async () => {
        saveBaseInfo();
        if (profileImg !== undefined) {
            saveProfileImg();
        }
        if (overviewImg !== undefined) {
            saveOverviewImg();
        }
    }

    return (
        <div>
            <Seo subtitle = "MyPage"/>
            <AddressModal isOpen={addressSearch} setOpen={setAddressSearch} setAddress={setAddress} setLongitude={setLongitude} setLatitude={setLatitude}/>
            <div className="flex flex-col mt-20 ml-10">
                <div className="flex flex-row mb-5">
                    <div className="flex justify-center w-4/12 py-10">
                        <img src={imgSrc} alt="" className="self-center rounded-xl" onClick={handleProfileImageClick}  style={{ cursor: 'pointer' }}/>
                        <input ref={profileImgRef} type="file" onChange={handleProfileImageChange} style={{ display: 'none' }} />
                    </div>
                    <div className="flex flex-col justify-around ml-10 text-2xl hansans w-8/12">
                        <div>
                            <input type="text" placeholder="이름" value={name} onChange={handleNameChange}/>
                        </div>
                        <div>
                            <input type="text" placeholder="이메일" value={email} onChange={handleEmailChange}/>
                        </div>
                        <div>
                            <input type="text" placeholder="전화번호" value={phone} onChange={handlePhoneChange}/>
                        </div>
                    </div>
                </div>
                <div className="mb-5">
                    <button className="mb-2 rounded-lg bg-black text-white px-5 py-1" onClick={handleAddressSearch}>주소 검색</button>
                    <input className="hansans text-lg" type="text" placeholder="주소" value={address} size={50} onChange={handleAddressChange}/>
                </div>
                <div className="mb-5 hansans text-lg">
                    <input type="text" placeholder="링크" value={link1} size={50} onChange={handleLinksChange}/>
                </div>
                <button onClick={handleSaveMyInfo} className="bg-sky-500 hover:bg-sky-700 rounded-lg mx-auto px-10 text-white font-bold text-xl py-2 mt-2">저장</button>
                <div className="flex justify-center mt-20">
                    <img src={overviewSrc} alt="" className="self-center rounded-xl" onClick={handleOverviewImageClick}  style={{ cursor: 'pointer' }}/>
                    <input ref={overviewImgRef} type="file" onChange={handleOverviewImageChange} style={{ display: 'none' }} />
                </div>
            </div>
            

        </div>
    );
}