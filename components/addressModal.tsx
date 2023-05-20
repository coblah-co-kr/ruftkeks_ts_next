import { useState, KeyboardEvent } from "react";
import styles from "./modal.module.css"

interface AddressModalInterface {
    isOpen : boolean
    setOpen : Function
    setAddress : Function
    setLongitude : Function
    setLatitude : Function
}

interface KakaoDataInterface {
    address_name : string,
    address_type : string,
    road_address : {
        address_name : string,
    },
    x : number,
    y : number,
}

export default function AddressModal({isOpen, setOpen, setAddress, setLongitude, setLatitude}:AddressModalInterface) {
    const [address, setTempAddress] = useState('');
    const [longitude, setTempLongitude] = useState(0.0);
    const [latitude, setTempLatitude] = useState(0.0);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [kakaoData, setKakaoData] = useState<KakaoDataInterface[]>([]);
    
    const handleSearch = async () => {
        try {
            const responseKakao = await fetch(
                `https://dapi.kakao.com/v2/local/search/address.JSON?query=${address}`,
                {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `KakaoAK ${process.env.NEXT_PUBLIC_KAKAODEV_APPKEY}`
                    }
                }
            )
            if (responseKakao.status === 200) {
                const data = await(responseKakao).json();
                setKakaoData(data.documents);
                console.log(data.documents);
                
            } else {
                console.log("개발자에게 문의하세요");
                setKakaoData([]);
            }
        } catch (error) {
            console.log(error);
            setKakaoData([]);
        }
        
    }

    const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        //console.log(scrollPosition);
        setScrollPosition(e.currentTarget.scrollTop);
    };

    const handleModal = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        setOpen(false);
        setAddress(selectedAddress);
        setLongitude(longitude);
        setLatitude(latitude);
    }

    const handlerSelectedAddress = (address_name:string, longitude:number, latitude:number) => {
        setSelectedAddress(address_name);
        setTempLongitude(longitude);
        setTempLatitude(latitude);
    }
    return (
        <div className={styles.overlay} style={{ display: isOpen ? "block" : "none" }}>
            <div className={styles.modal}>
                <div className={styles.content} onScroll={handleScroll}>
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-center mb-10">
                            <input className="text-xl text-center" type="text" placeholder="주소지 입력" value={address} onChange={(e)=>setTempAddress(e.target.value)} onKeyDown={handleKeyPress}/>
                            <button onClick={handleSearch} className="rounded-lg bg-black text-white hansans px-5 text-xl">검색</button>
                        </div>
                        <div className="ml-10">
                            {kakaoData.map((document) => (
                            <div key={document.address_name} className="mb-2 text-lg">
                                <input
                                type="radio"
                                name="address"
                                value={document.address_name}
                                checked={selectedAddress === (document.address_type === "ROAD" ? document.road_address.address_name : document.address_name)}
                                onChange={() => handlerSelectedAddress(
                                    document.address_type === "ROAD" ? document.road_address.address_name : document.address_name, 
                                    document.x,
                                    document.y
                                )}
                                />
                                <label htmlFor={document.address_name}>
                                {document.address_type === "ROAD" ? document.road_address.address_name : document.address_name}
                                </label>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.scrollbar}>
                    <div className={styles.track}>
                        <div className={styles.thumb} style={{ top: `${(scrollPosition / 2)}px` }} />
                    </div>
                </div>
                <div className="flex flex-row mx-auto">
                    <button className={styles.confirmButton} onClick={handleConfirm}>확인</button>
                    <button className={styles.closeButton} onClick={handleModal}>취소</button>
                </div>
            </div>
        </div>
    );
}