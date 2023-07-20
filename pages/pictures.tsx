import { useSelector } from "react-redux";
import Seo from "../components/seo";
import { RootState } from "@/store";
import TokenRefresh from "@/components/tokenRefresh";
import goToHome from "@/components/goToHome";
import { useEffect, useRef, useState } from "react";
import styles from "../components/modal.module.css"
import imageCompression from "browser-image-compression";
import { MyInfoState } from "@/store/myInfoUpdate";
import { profile } from "console";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import { useGeoLocation } from "@/components/useGeoLocation";

class pictureScript {
    private isUpload : boolean;
    private setIsUpload : Function;
    private pictureIndex : number;
    private setPictureIndex : Function;
    private pictureData : pictureDataType[];
    private setPictureData : Function;
    private touchPoints : number[];
    private setTouchPoints : Function;
    private panningSum: number;
    private setPanningSum : Function;
    private accessToken: string;
    private currentComment : string;
    private setCurrentComment : Function;
    private router : NextRouter;
    private name : string;
    private setName: Function;
    private profileImg : string;
    private setProfileImg : Function;
    private overviewImg : string;
    private setOverviewImg : Function;

    constructor(
        isUpload : boolean,
        setIsUpload : Function,
        pictureIndex : number,
        setPictureIndex : Function,
        pictureData : pictureDataType[],
        setPictureData : Function,
        touchPoints : number[],
        setTouchPoints : Function,
        panningSum : number,
        setPanningSum : Function,
        accessToken : string,
        currentComment : string,
        setCurrentComment : Function,
        router : NextRouter,
        name : string,
        setName : Function,
        profileImg : string,
        setProfileImg : Function,
        overviewImg : string,
        setOverviewImg : Function,
        ) {
        this.isUpload = isUpload;
        this.setIsUpload = setIsUpload;
        this.pictureIndex = pictureIndex;
        this.setPictureIndex = setPictureIndex;
        this.pictureData = pictureData;
        this.setPictureData = setPictureData;
        this.touchPoints = touchPoints;
        this.setTouchPoints = setTouchPoints;
        this.panningSum = panningSum;
        this.setPanningSum = setPanningSum;
        this.accessToken = accessToken;
        this.currentComment = currentComment;
        this.setCurrentComment = setCurrentComment;
        this.router = router;
        this.name = name;
        this.setName = setName;
        this.profileImg = profileImg;
        this.setProfileImg = setProfileImg;
        this.overviewImg = overviewImg;
        this.setOverviewImg = setOverviewImg;
    }

    editPicture() {
        if (confirm("편집하시겠습니까?")) {
            this.setIsUpload(true);
        }
        
    }

    deletePicture() {
        confirm("삭제하시겠습니까?");
    }

    searchArea() {
        return (
            <div className="rounded-lg border-slate-600 border-4 flex flex-row mt-10 mb-5">
                <img src="searching.png" alt="" />
                <input type="text" placeholder="#정기모임" className="text-center hansans text-xl"/>
                <button className="hansans mx-3 text-slate-500">검색</button>
            </div>
        );
    }

    header() {
        return (
            <>
                {/*this.searchArea()*/}
                <div onClick={() => this.setIsUpload(true)} className="mb-10 rounded-lg py-2 bg-devLogWork text-white px-2 font-bold">
                    + Upload +
                </div>
            </>
        );
    }

    info(picData:pictureDataType) {
        return (
            <div className="flex flex-row">
                <div className="w-2/12">
                    <img className={"rounded-3xl dark:filter dark:brightness-75"} src={`https://ruuftkeksimg.s3.ap-northeast-2.amazonaws.com/profile_img/${picData.name}`} alt=""/>
                </div>
                <div className="flex flex-col justify-evenly ml-3 w-8/12">
                    <div className="hansans text-xl dark:text-slate-300">
                        {picData&&picData.name}
                    </div>
                    <div className="kargugsu text-xl font-bold dark:text-slate-300">
                        {picData&&picData.date}, {picData&&picData.location}
                    </div>
                    <div className="kargugsu text-xl font-bold flex flex-row gap-x-2">
                        {picData&&
                        picData.hashTag.map((hashT, index)=> (
                            <React.Fragment key={index}>
                                <div className="bg-slate-400 rounded-lg px-3">
                                    {hashT}
                                </div>
                            </React.Fragment>
                        ))
                        }
                    </div>
                </div>
                <div className="flex flex-row w-2/12 justify-around">
                    {/*
                    <button onClick={()=>this.editPicture()}>
                        <img src="icons/imgEdit.png" alt="" style={{width:30}}/>
                    </button>
                    <button onClick={()=>this.deletePicture()}>
                        <img src="icons/trash.png" alt="" style={{width:30}}/>
                    </button>
                    */}
                </div>
            </div>
        );
    }
    
    pictureArea(picData:pictureDataType) {
        return (
            <div className="mt-5 mx-auto overflow-x-scroll snap-x">
                <div className="flex flex-row w-full scroll snap-center">
                    {picData&&(
                        picData.pictureList.map((index)=>(
                            <React.Fragment key={index}>
                                <img className="dark:filter dark:brightness-75" src={`https://ruuftkeksimg.s3.ap-northeast-2.amazonaws.com/${index}`} alt="" />
                            </React.Fragment>
                            
                        ))
                    )}
                </div>
            </div>
            
        );
    }

    comment(picData:pictureDataType, reverseIndex:number) {
        return (
            <div className="mt-5">
                <div className="border-b-2 kargugsu mb-5 ml-2 text-2xl dark:text-slate-300">
                    {picData&&(
                        picData.pictureContent.split("\r\n").map((content, index)=>(
                            <div key={index}>
                                {content}
                            </div>
                        ))
                    )}
                </div>
                <div className="ml-2">
                {picData&&
                    (picData.comments.map((comment, index)=>
                    (
                        <React.Fragment key={index}>
                        <div className="flex flex-row mb-2 dark:text-slate-300">
                            <div className="w-1/12">
                                <img className={"rounded-3xl dark:filter dark:brightness-75".concat(this.profileImg?"":" h-12")} src={this.profileImg?`https://ruuftkeksimg.s3.ap-northeast-2.amazonaws.com/${comment.profileImg}`:"/icons/no_profile.png"} alt=""/>
                            </div>
                            <div className="w-2/12 hansans translate-y-3 ml-2 text-xl">
                                {comment.name}
                            </div>
                            <div className="w-7/12 kargugsu text-xl translate-y-2 ml-2">
                                {comment.content}
                            </div>
                            <div className="w-2/12 translate-y-3 text-xs">
                                {comment.date}
                            </div>
                        </div>
                        </React.Fragment>
                    )
                    ))
                }
                </div>
                <div className="flex flex-row border-t-2 py-2 mt-5">
                    <input onKeyDown={(e)=> (e.key === "Enter")? this.postComment(picData, reverseIndex):null} onChange={(e)=> this.setCurrentComment(e.target.value)} value={this.currentComment} type="text" placeholder="댓글 달기.." className="w-9/12 ml-2 dark:bg-slate-700"/>
                    <button onClick={()=>this.postComment(picData, reverseIndex)} className="w-3/12 hansans text-devLogWork dark:text-white">게시</button>
                </div>
            </div>

        );
    }

    postComment(picData:pictureDataType, reverseIndex:number) {
        if (this.name === "") {
            alert("세션이 만료되었습니다.");
            goToHome(this.accessToken, this.router, true);
            return ;
        }
        const currentDate = new Date();
        const commentList = [...picData.comments];
        commentList.push({
            "profileImg" : `profile_img/${this.name}`,
            "name" : this.name,
            "content" : this.currentComment,
            "date" : `${currentDate.getFullYear()}/${currentDate.getMonth()+1}/${currentDate.getDate()}`,
        });
        const getPictureImg = async () => {
            try{
                const imageRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_HOST}/api/picture/comments`,
                    {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${this.accessToken}`
                        },
                        body: JSON.stringify({
                            id: reverseIndex+1,
                            comments: commentList,
                        })
                    });
    
                const {status} = imageRes;
    
                if (status === 201) {
                    console.log("저장되었습니다.");
                    this.setCurrentComment("");
                } else if (status ==204){
                    console.log("잘못된 id입니다.");
                } else {
                    console.log("개발자에게 문의하세요.");
                }
            } catch (error) {
                console.log(error);
            }
        };
        getPictureImg();
    }

    content(picData: pictureDataType, reverseIndex:number) {
        return (
            <div className="bg-white dark:bg-slate-700 rounded-xl p-7 w-full mx-5 shadow-lg border-slate-200 border-2">
                {this.info(picData)}
                {this.pictureArea(picData)}
                {this.comment(picData, reverseIndex)}
            </div>
        );
    }

    getContent() {
        return (
            <div className="grid justify-items-center pb-40">
                {this.header()}
                {this.pictureData.map((index, kindex)=>(
                    <React.Fragment key={kindex}>
                        {this.content([...this.pictureData].reverse()[kindex], this.pictureData.length-1-kindex)}
                    </React.Fragment>
                ))}
            </div>
        );
    }
}
interface pictureDataType {
    id : number,
    profileImg : string
    name : string,
    date : string,
    location: string,
    pictureList : string[],
    hashTag : string[],
    pictureContent : string,
    comments : {
        profileImg : string,
        name : string,
        content : string,
        date : string,
    }[]
}

export default function Pictures() {
    const reduxAccessToken = useSelector((state:RootState) => state.accessToken);
    const router = useRouter();
    let accessToken = TokenRefresh(reduxAccessToken.token);
    goToHome(accessToken, router);
    const myInfo = useSelector((state:RootState) => state.myInfo);
    const currentDate = new Date()

    const { location, error } = useGeoLocation({
        enableHighAccuracy: true,
        timeout: 1000 * 10,
        maximumAge: 1000 * 3600 * 24,
    });
    
    const [isMobile, setIsMobile] = useState(false);
    const [isUpload, setIsUpload] = useState(false);
    const [pictureDate, setPictureDate] = useState(`${currentDate.getFullYear()}년 ${currentDate.getMonth()+1}월 ${currentDate.getDate()}일`);
    const [pictureLocate, setPictureLocate] = useState("");
    const [pictureComment, setPictureComment] = useState("");
    const [hashTag, setHashTag] = useState("");
    const [pictureList, setPictureList] = useState<any>([]);
    const [prevPictureList, setPrevPictureList] = useState<any>([]);
    const [pictureIndex, setPictureIndex] = useState(0);
    const [pictureData, setPictureData] = useState<pictureDataType[]>([]);
    const [touchPoints, setTouchPoints] = useState([0,0]);
    const [panningSum, setPanningSum] = useState(0);
    const [currentComment, setCurrentComment] = useState("");
    const [scrollY, setScrollY] = useState(0);
    const [touchAreaPoints, setTouchAreaPoints] = useState([0,0]);
    const [startScroll, setStartScroll] = useState(0);
    const [requestUploadImg, setRequestUploadImg] = useState(false);
    const [convertingPrevImg, setConvertingPrevImg] = useState(false);

    const [name, setName] = useState("");
    const [profileImg, setProfileImg] = useState("");
    const [overviewImg, setOverviewImg] = useState("");

    function handleResize() {
        setIsMobile(window.innerWidth<720);
    }
    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isMobile]);


    const handlePictureDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPictureDate(e.target.value);
    }

    const handleLocateDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPictureLocate(e.target.value);
    }

    const handleComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPictureComment(e.target.value);
    }

    const handleHashTag = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHashTag(e.target.value);
    }

    const ps = new pictureScript(
        isUpload, setIsUpload,
        pictureIndex, setPictureIndex,
        pictureData, setPictureData,
        touchPoints, setTouchPoints,
        panningSum, setPanningSum,
        accessToken,
        currentComment, setCurrentComment, router,
        name, setName,
        profileImg, setProfileImg,
        overviewImg, setOverviewImg,
    );

    const handleImgList = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.currentTarget.files) return;
        setConvertingPrevImg(true);
        const file = e.currentTarget.files[0];
        const compressedFile = await imageCompression(file, {
            maxSizeMB: 0.9,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        });

        const convertFile = new File([compressedFile], file.name, {type: `${file.type}`});
        const reader = new FileReader();
        reader.readAsDataURL(convertFile);
        reader.onloadend = () => setPrevPictureList([...prevPictureList ,reader.result]);

        setPictureList([...pictureList, convertFile]);
        setConvertingPrevImg(false);
    };

    const requestImg = async () => {
        setRequestUploadImg(true);
        let formData = new FormData();
        for(let i=0; i<pictureList.length; i++) {
            formData.append("image", pictureList[i]);
        }
        const splitedHashTag = hashTag.split("#");
        for(let i=0; i<splitedHashTag.length; i++) {
            if (splitedHashTag[i]) {
                formData.append("hashTag", "#"+splitedHashTag[i].trim());
            }
        }
        if (name==="") {
            alert("서버와 연결이 끊어졌습니다.");
            goToHome(accessToken, router, true);
        }
        formData.append("name", name);
        formData.append("profileImg", profileImg);
        formData.append("date", pictureDate);
        formData.append("location", pictureLocate);
        formData.append("pictureContent", pictureComment);

        try{
            const imageRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/picture/upload`,
                {
                    method: "post",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: formData,
                });

            const {status} = imageRes;

            if (status === 201) {
                alert("저장되었습니다.");
                setIsUpload(false);
            } else {
                console.log("개발자에게 문의하세요.");
                alert(`오류가 발생했습니다. status : ${status} formData : ${formData}`);
            }
        } catch (error) {
            console.log(error);
            alert(error);
        }
        setRequestUploadImg(false);
    };

    const previewImg = () => {
        const previewList = [];
        for (let i=0; i<prevPictureList.length; i++) {
            previewList.push(
                <div key={i}>
                    <img className="border-2 border-black" src={prevPictureList[i]} alt="" />
                </div>
            )
        }
        return previewList;
    }

    const getPicture = async () => {
        try{
            const imageRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/picture/get`,
                {
                    method: "get",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                });

            const {status} = imageRes;

            if (status === 200) {
                const data = await(imageRes).json();
                setPictureData(data);
            } else if (status == 403){
                alert("세션이 만료되었습니다");
                goToHome(accessToken, router, true);
            } else {
                console.log("개발자에게 문의하세요.");
            }
        } catch (error) {
            console.log(error);
        }
    };
    const getPictureImg = async () => {
        try{
            const imageRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/picture/get/image?id=1`,
                {
                    method: "get",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                });

            const {status} = imageRes;

            if (status === 200) {
                const data = await(imageRes).json();
                console.log(data);
            } else {
                console.log("개발자에게 문의하세요.");
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (currentComment === "") {
            getPicture();
        }
    }, [isUpload, currentComment]);

    const getMyInfo = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/account/me`,
                {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                },
            )
            if (response.status === 403) {
                alert("세션이 만료되었습니다.");
                goToHome(accessToken, router, true);
            } else if (response.status === 200) {
                const data = await(response).json();
                setName(data.name);
                setProfileImg(data.profileImg);
                setOverviewImg(data.overviewImg);
            } else {
                console.log(response.status);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const searchLocationWithLatitude = async () => {
        try {
            const responseKakao = await fetch(
                `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${location?.longitude}&y=${location?.latitude}`,
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
                setPictureLocate(data.documents[0].address_name)
            } else {
                console.log("개발자에게 문의하세요");
            }
        } catch (error) {
            console.log(error);
        }

        try{
            const locRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/account/update/gps`,
                {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        lastLatitude: location?.latitude,
                        lastLongitude: location?.longitude,
                    })
                });

            const {status} = locRes;

            if (status === 201) {
                setIsUpload(false);
            } else {
                console.log("개발자에게 문의하세요.");
            }
        } catch (error) {
            console.log(error);
            alert(error);
        }
    }
    useEffect(() => {
        if (location !== undefined)
            searchLocationWithLatitude();
    }, [location])

    useEffect(() => {
        getMyInfo();
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);

    const imgFileRef = useRef<HTMLInputElement>(null);

    const handleImageFileClick = () => {
        if (imgFileRef.current) {
            imgFileRef.current.click();
        }
    };
    
    const panAreaStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchAreaPoints([e.changedTouches[0].clientX, e.changedTouches[0].clientY]);
        setStartScroll(scrollY);
    }

    const panAreaEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        const position = (
            (e.changedTouches[0].clientX - touchAreaPoints[0]) /
            Math.abs(e.changedTouches[0].clientY - touchAreaPoints[1])
        );
        if (position<1 && position>-1 && startScroll == scrollY) {
            setPanningSum(0);
            if (startScroll == 0 && scrollY == 0) {
                if (pictureIndex == 0) {
                    setPictureIndex(pictureData.length-1);
                } else {
                    setPictureIndex(pictureIndex-1);
                }
            } else {
                if (pictureIndex == pictureData.length-1) {
                    setPictureIndex(0);
                } else {
                    setPictureIndex(pictureIndex+1);
                }
            }
        }
    }

    const cancelUpload = () => {
        setIsUpload(false);
        setPrevPictureList([]);
        setPictureList([]);
    }
    return (
        <div onTouchStart={(e)=>panAreaStart(e)} onTouchEnd={(e)=>panAreaEnd(e)}>
            <div className={styles.overlay} style={{ display : isUpload? "block" : "none"}}>
                <div className={styles.modal}>
                    <div className={styles.content}>
                        <div className="grid grid-cols-4 grid-flow-row">
                            <div className="hansans text-xl border-b-2">
                                일정
                            </div>
                            <div className="col-span-3 border-b-2">
                                <input type="text" placeholder="2023년 6월 26일" value={pictureDate} onChange={(e)=>handlePictureDate(e)}/>
                            </div>
                            <div className="hansans text-xl border-b-2">
                                장소
                            </div>
                            <div className="col-span-3 border-b-2">
                                <input className="w-full" type="text" placeholder="창원시 성산구 상남동" value={pictureLocate} onChange={(e)=>handleLocateDate(e)}/>
                            </div>
                            <div className="hansans text-xl border-b-2">
                                본문
                            </div>
                            <div className="col-span-3 border-b-2">
                                <textarea className="w-full" cols={30} rows={5} placeholder="난..ㄱ ㅏ끔...눈물을 흘린 ㄷ ㅏ..." value={pictureComment} onChange={(e)=>handleComment(e)}/>
                            </div>
                            <div className="hansans text-xl border-b-2 mb-5">
                                해시태그
                            </div>
                            <div className="col-span-3 border-b-2 mb-5">
                                <input className="w-full" type="text" placeholder="#근황 #여행" value={hashTag} onChange={(e)=>handleHashTag(e)}/>
                            </div>
                            <img src="/icons/addImg.png" alt="" className="self-center" onClick={handleImageFileClick}  style={{ cursor: 'pointer' }}/>
                            <input ref={imgFileRef} type="file" id="image_uploads" name="image" accept="image/*" onChange={(e)=>handleImgList(e)} style={{ display: 'none' }}/>
                            {convertingPrevImg?`이미지 압축 중입니다.`:``}
                        </div>
                        {previewImg()}
                    </div>
                    <div className="flex flex-row mx-auto gap-x-1 pb-5 mt-5">
                        <div onClick={()=> cancelUpload()} className={styles.closeButton}>취소</div>
                        <div onClick={()=>confirm("저장하시겠습니까?")?requestImg():null} className={styles.confirmButton}>{requestUploadImg?`업로드중..`:`확인`}</div>
                    </div>
                </div>
            </div>
            {ps.getContent()}
        </div>
    );
}