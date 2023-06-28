import { useSelector } from "react-redux";
import Seo from "../components/seo";
import { RootState } from "@/store";
import TokenRefresh from "@/components/tokenRefresh";
import goToHome from "@/components/goToHome";
import { useEffect, useState } from "react";
import styles from "../components/modal.module.css"
import imageCompression from "browser-image-compression";
import { MyInfoState } from "@/store/myInfoUpdate";
import { profile } from "console";
import { NextRouter, useRouter } from "next/router";
import React from "react";

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
    private myInfo: MyInfoState;
    private accessToken: string;
    private currentComment : string;
    private setCurrentComment : Function;
    private router : NextRouter;

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
        myInfo: MyInfoState,
        accessToken : string,
        currentComment : string,
        setCurrentComment : Function,
        router : NextRouter,
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
        this.myInfo = myInfo;
        this.accessToken = accessToken;
        this.currentComment = currentComment;
        this.setCurrentComment = setCurrentComment;
        this.router = router;
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
                {this.searchArea()}
                <div onClick={() => this.setIsUpload(true)} className="mb-10 rounded-lg py-2 bg-devLogWork text-white px-2 font-bold">
                    + Upload +
                </div>
            </>
        );
    }

    info() {
        return (
            <div className="flex flex-row">
                <div className="w-2/12">
                    <img className="rounded-3xl" src="https://coblah.co.kr/img/ruftkeks_img/king.png" alt=""/>
                </div>
                <div className="flex flex-col justify-evenly ml-3 w-8/12">
                    <div className="hansans text-xl">
                        {this.pictureData[this.pictureIndex]&&this.pictureData[this.pictureIndex].name}
                    </div>
                    <div className="kargugsu text-xl font-bold">
                        {this.pictureData[this.pictureIndex]&&this.pictureData[this.pictureIndex].date}, {this.pictureData[this.pictureIndex]&&this.pictureData[this.pictureIndex].location}
                    </div>
                    <div className="kargugsu text-xl font-bold flex flex-row gap-x-2">
                        {this.pictureData[this.pictureIndex]&&
                        this.pictureData[this.pictureIndex].hashTag.map((hashT, index)=> (
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

    panPictureStart(e: React.TouchEvent<HTMLImageElement>) {
        this.setTouchPoints([e.changedTouches[0].clientX, e.changedTouches[0].clientY]);
    }

    panPictureEnd(e: React.TouchEvent<HTMLImageElement>) {
        const position = (
            (e.changedTouches[0].clientX - this.touchPoints[0]) /
            Math.abs(e.changedTouches[0].clientY - this.touchPoints[1])
        );
        const currentPicture = this.pictureData[this.pictureIndex];
        if (!currentPicture) {
            return ;
        }
        if (position > 5) {
            if (this.panningSum+1 === currentPicture.pictureList.length) {
                this.setPanningSum(0);
            } else {
                this.setPanningSum(this.panningSum+1);
            }
        } else if (position < -5) {
            if (this.panningSum === 0) {
                this.setPanningSum(currentPicture.pictureList.length-1);
            } else {
                this.setPanningSum(this.panningSum-1);
            }
        }
        
    }

    pictureArea() {
        return (
            <div className="mt-5 mx-auto">
                {this.pictureData[this.pictureIndex]&&(
                    <img onTouchStart={(e) => this.panPictureStart(e)} onTouchEnd={(e) => this.panPictureEnd(e)} className="rounded-lg" src={`https://ruuftkeksimg.s3.ap-northeast-2.amazonaws.com/${this.pictureData[this.pictureIndex].pictureList[this.panningSum]}`} alt=""/>
                )}
            </div>
        );
    }

    comment() {
        return (
            <div className="mt-5">
                <div className="border-b-2 kargugsu mb-5 ml-2 text-2xl">
                    {this.pictureData[this.pictureIndex]&&this.pictureData[this.pictureIndex].pictureContent}
                </div>
                <div className="ml-2">
                {this.pictureData[this.pictureIndex]&&
                    (this.pictureData[this.pictureIndex].comments.map((comment, index)=>
                    (
                        <React.Fragment key={index}>
                        <div className="flex flex-row mb-2">
                            <div className="w-1/12">
                                {/*<img className="rounded-3xl" src={`https://ruuftkeksimg.s3.ap-northeast-2.amazonaws.com/${comment.profileImg}`} alt=""/>*/}
                                <img className="rounded-3xl" src={`https://coblah.co.kr/img/ruftkeks_img/king.png`} alt=""/>
                            </div>
                            <div className="w-1/12 hansans translate-y-3 ml-2 text-xl">
                                {comment.name}
                            </div>
                            <div className="w-8/12 kargugsu text-xl translate-y-2 ml-2">
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
                    <input onKeyDown={(e)=> (e.key === "Enter")? this.postComment():null} onChange={(e)=> this.setCurrentComment(e.target.value)} value={this.currentComment} type="text" placeholder="댓글 달기.." className="w-9/12 ml-2"/>
                    <button onClick={()=>this.postComment()} className="w-3/12 hansans text-devLogWork">게시</button>
                </div>
            </div>

        );
    }

    postComment() {
        if (this.myInfo.name === "") {
            alert("세션이 만료되었습니다.");
            goToHome(this.accessToken, this.router, true);
            return ;
        }
        const currentDate = new Date();
        const commentList = [...this.pictureData[this.pictureIndex].comments];
        commentList.push({
            "profileImg" : `profile_img/${this.myInfo.name}`,
            "name" : this.myInfo.name,
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
                            id: this.pictureIndex+1,
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

    content() {
        return (
            <div className="bg-white rounded-xl p-7 w-full mx-5 shadow-lg border-slate-200 border-2">
                {this.info()}
                {this.pictureArea()}
                {this.comment()}
            </div>
        );
    }

    getContent() {
        return (
            <div className="grid justify-items-center">
                {this.header()}
                {this.content()}
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
    

    const [isMobile, setIsMobile] = useState(false);
    const [isUpload, setIsUpload] = useState(false);
    const [pictureDate, setPictureDate] = useState("");
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

    const handleComment = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        myInfo, accessToken,
        currentComment, setCurrentComment, router,
    );

    const handleImgList = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.currentTarget.files) return;
        const file = e.currentTarget.files[0];

        const convertFile = new File([file], file.name, {type: `${file.type}`});
        const reader = new FileReader();
        reader.readAsDataURL(convertFile);
        reader.onloadend = () => setPrevPictureList([...prevPictureList ,reader.result]);

        setPictureList([...pictureList, file]);
    };

    const requestImg = async () => {
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
        if (myInfo.name==="") {
            alert("서버와 연결이 끊어졌습니다.");
            goToHome(accessToken, router, true);
        }
        formData.append("name", myInfo.name);
        formData.append("profileImg", myInfo.profileImg);
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
            }
        } catch (error) {
            console.log(error);
        }
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
                console.log(data);
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

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (pictureData.length === 0) {
                return ;
            }
            
            switch (scrollY*100/(window.document.body.offsetHeight - window.innerHeight)) {
                case 0:
                    setPanningSum(0);
                    switch (pictureIndex) {
                        case 0:
                            setPictureIndex(pictureData.length-1);
                            break;
                        default:
                            setPictureIndex(pictureIndex - 1);
                            break;
                    }
                    break;
                case 100:
                    setPanningSum(0);
                    switch (pictureIndex) {
                        case pictureData.length-1:
                            setPictureIndex(0);
                            break;
                        default:
                            setPictureIndex(pictureIndex + 1);
                            break;
                    }
                    break;

            } 

        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);
    return (
        <div className={isMobile? "w-fit snap-y max-w-[48rem] mx-auto h-auto":"snap-y max-w-[48rem] mx-auto h-auto"}>
            <div className={styles.overlay} style={{ display : isUpload? "block" : "none"}}>
                <div className={styles.modal}>
                    <div className={styles.content}>
                        <div className="grid grid-cols-4 grid-flow-row">
                            <div className="hansans text-xl border-b-2">
                                일정
                            </div>
                            <div className="border-b-2">
                                <input type="text" placeholder="2023년 6월 26일" value={pictureDate} onChange={(e)=>handlePictureDate(e)}/>
                            </div>
                            <div className="hansans text-xl border-b-2">
                                장소
                            </div>
                            <div className="border-b-2">
                                <input className="w-full" type="text" placeholder="창원시 성산구 상남동" value={pictureLocate} onChange={(e)=>handleLocateDate(e)}/>
                            </div>
                            <div className="hansans text-xl border-b-2">
                                본문
                            </div>
                            <div className="col-span-3 border-b-2">
                                <input className="w-full" type="text" placeholder="난..ㄱ ㅏ끔...눈물을 흘린 ㄷ ㅏ..." value={pictureComment} onChange={(e)=>handleComment(e)}/>
                            </div>
                            <div className="hansans text-xl border-b-2 mb-5">
                                해시태그
                            </div>
                            <div className="col-span-3 border-b-2 mb-5">
                                <input className="w-full" type="text" placeholder="#근황" value={hashTag} onChange={(e)=>handleHashTag(e)}/>
                            </div>
                            <input type="file" id="image_uploads" name="image" accept="image/*" onChange={(e)=>handleImgList(e)}/>
                        </div>
                        {previewImg()}
                    </div>
                    <div className="flex flex-row mx-auto gap-x-1 pb-5 mt-5">
                        <div onClick={()=>setIsUpload(false)} className={styles.closeButton}>취소</div>
                        <div onClick={()=>requestImg()} className={styles.confirmButton}>확인</div>
                    </div>
                </div>
            </div>
            {ps.getContent()}
        </div>
    );
}