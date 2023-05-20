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

export default function MyPage() {
    const profileImgRef = useRef<HTMLInputElement>(null);
    const overviewImgRef = useRef<HTMLInputElement>(null);

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
        const selectedFile = event.target.files?.[0];
        console.log(selectedFile);
    };

    const handleOverviewImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        console.log(selectedFile);
    };

    const dispatch = useDispatch();

    const myInfo = useSelector((state:RootState) => state.myInfo);
    const reduxAccessToken = useSelector((state:RootState) => state.accessToken);
    let accessToken = TokenRefresh(reduxAccessToken.token);
    
    const imgSrc = myInfo.profileImg ? myInfo.profileImg  : "/icons/addImg.png"
    const overviewSrc = myInfo.overviewImg ? myInfo.overviewImg : "/icons/addFile.png"

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

    const handleSaveMyInfo = async () => {
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
                goToHome(accessToken);
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

    return (
        <div>
            <Seo subtitle = "MyPage"/>
            <AddressModal isOpen={addressSearch} setOpen={setAddressSearch} setAddress={setAddress} setLongitude={setLongitude} setLatitude={setLatitude}/>
            <div className="flex flex-col max-w-[40rem] mx-auto h-auto justify-items-center mt-20">
                <div className="flex flex-row mb-5">
                    <div className="w-72 flex justify-center">
                        <img src={imgSrc} alt="" className="self-center" onClick={handleProfileImageClick}  style={{ cursor: 'pointer' }}/>
                        <input ref={profileImgRef} type="file" onChange={handleProfileImageChange} style={{ display: 'none' }} />
                    </div>
                    <div className="flex flex-col justify-around ml-10 text-lg hansans">
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
                    <button className="mb-2 rounded-lg bg-black text-white px-5" onClick={handleAddressSearch}>주소 검색</button>
                    <input className="hansans text-lg" type="text" placeholder="주소" value={address} size={50} onChange={handleAddressChange}/>
                </div>
                <div className="mb-5 hansans text-lg">
                    <input type="text" placeholder="링크" value={link1} size={50} onChange={handleLinksChange}/>
                </div>
                <button onClick={handleSaveMyInfo} className="bg-sky-500 hover:bg-sky-700 rounded-lg mx-auto px-10 text-white font-bold text-lg">저장</button>
                <div className="flex justify-center mt-20">
                    <img src={overviewSrc} alt="" className="self-center" onClick={handleOverviewImageClick}  style={{ cursor: 'pointer' }}/>
                    <input ref={overviewImgRef} type="file" onChange={handleOverviewImageChange} style={{ display: 'none' }} />
                </div>
            </div>
            

        </div>
    );
}