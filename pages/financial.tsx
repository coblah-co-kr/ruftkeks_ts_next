import logOutOrKeep from "@/components/logOutKeep";
import Seo from "../components/seo";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import TokenRefresh from "@/components/tokenRefresh";
import React, { useState } from "react";
import goToHome from "@/components/goToHome";
import { useDispatch } from "react-redux";

enum paymentType {
    SEND_COMPANY="0",
    SEND_GRAY="1",
    SEND_GODSU="2",
    NOT_YET="3",
    PASS="4",
}

enum paymentStrType {
    SEND_COMPANY="bg-paymentsCompany",
    SEND_GRAY="bg-paymentsGray",
    SEND_GODSU="bg-paymentsGod",
    NOT_YET="bg-paymentsNotYet",
    PASS="bg-paymentsPass",
}

class financialScript {
    private todayYear : number;
    private todayMonth : number;
    private selectedYear : number;
    private setSelectedYear : Function;
    private selectedData : string[][];
    private setSelectedData : Function;

    constructor(
        todayYear : number,
        todayMonth : number,
        selectedYear : number,
        setSelectedYear : Function,
        selectedData : string[][],
        setSelectedData : Function
        ) {
        this.todayYear = todayYear;
        this.todayMonth = todayMonth;
        this.selectedYear = selectedYear;
        this.setSelectedYear = setSelectedYear;
        this.selectedData = selectedData;
        this.setSelectedData = setSelectedData;
    }

    protected handleArrowClick(direction : string, todayYear: number, selectedYear: number, setSelectedYear : Function) {
        if (direction === "left") {
            if (selectedYear === 2019) {
                setSelectedYear(todayYear);
            } else {
                setSelectedYear(selectedYear - 1);
            }
        } else if (direction === "right") {
            if (selectedYear === todayYear) {
                setSelectedYear(2019);
            } else {
                setSelectedYear(selectedYear + 1);
            }
        } else {
            console.log("Unexpected Input");
        }
    };

    getContent() {
        const MonthList = Array.from({ length: (this.selectedYear === this.todayYear)? this.todayMonth: 12 }, (_, index) => index);
        return (
            <div>
                <Seo subtitle = "Financial"/>
                <div className="flex flex-col justify-items-center max-w-[72rem] mx-auto h-auto">
                    <div className="flex flex-row mx-auto">
                        <button onClick={() => this.handleArrowClick("left", this.todayYear, this.selectedYear, this.setSelectedYear)}>
                        <img src="icons/left.png" alt="" style={{maxWidth: "40px"}}/>
                        </button>
                        <div className="hansans text-center text-4xl rounded-lg bg-paymentsGod mx-auto px-2">
                            {this.selectedYear}
                        </div>
                        <button onClick={() => this.handleArrowClick("right", this.todayYear, this.selectedYear, this.setSelectedYear)}>
                            <img src="icons/right.png" alt="" style={{maxWidth: "40px"}}/>
                        </button>
                    </div>
                    <div className="hansans text-5xl mt-5 text-center mb-10">
                        회비 납부 내역
                    </div>
                    <div className="flex flex-row justify-center hansans mb-10">
                        <div className="rounded p-3 bg-paymentsCompany mx-2"/>납부(취업자: 2만)
                        <div className="rounded p-3 bg-paymentsGray mx-2"/>납부(회색분자: 1.5만)
                        <div className="rounded p-3 bg-paymentsGod mx-2"/>납부(갓수: 1만)
                        <div className="rounded p-3 bg-paymentsNotYet mx-2"/>미납
                        <div className="rounded p-3 bg-paymentsPass mx-2"/>Pass
                    </div>
                    <div className="grid grid-cols-12 grid-flow-row justify-items-center gap-y-4">
                        {this.paymentHead()}
                        {MonthList.map((index) => (
                            <React.Fragment key={index}>
                            {this.monthlyData(index, 
                                this.selectedData[index]
                            )}
                            </React.Fragment>
                        ))}
                    </div>
                    <button className="mt-10 rounded-lg bg-paymentsGod mx-auto px-5 py-2 hansans text-2xl hover:bg-paymentsPass">저장</button>
                </div>
            </div>
        );
    }
    
    handlePayment(monthIndex: number, whoIs: number, state: string) {
        const updatedData = [...this.selectedData]; // selectedData의 사본 생성
      
        if (state === paymentStrType.SEND_COMPANY) {
          updatedData[monthIndex][whoIs] = paymentStrType.SEND_GRAY;
        } else if (state === paymentStrType.SEND_GRAY) {
          updatedData[monthIndex][whoIs] = paymentStrType.SEND_GODSU;
        } else if (state === paymentStrType.SEND_GODSU) {
          updatedData[monthIndex][whoIs] = paymentStrType.NOT_YET;
        } else if (state === paymentStrType.NOT_YET) {
          updatedData[monthIndex][whoIs] = paymentStrType.PASS;
        } else {
          updatedData[monthIndex][whoIs] = paymentStrType.SEND_COMPANY;
        }
      
        this.setSelectedData(updatedData); // 상태 업데이트
      }

    convertMonthChar2Int(char : string) {
        return ["Jan","Feb","Mar",
            "Apr","May","Jun",
            "Jul","Aug","Sep",
            "Oct","Nov","Dec"
        ].indexOf(char)
    }

    convertMonthInt2Char(index : number) {
        return ["Jan","Feb","Mar",
            "Apr","May","Jun",
            "Jul","Aug","Sep",
            "Oct","Nov","Dec"
        ][index]
    }

    paymentHead() {
        return (
            <>
                <div className="translate-y-2 text-xl font-bold">
                    
                </div>
                <div className="translate-y-2 text-xl font-bold">
                    방준용
                </div>
                <div className="translate-y-2 text-xl font-bold">
                    손호진
                </div>
                <div className="translate-y-2 text-xl font-bold">
                    손세호
                </div>
                <div className="translate-y-2 text-xl font-bold">
                    김민섭
                </div>
                <div className="translate-y-2 text-xl font-bold">
                    김용균
                </div>
                <div className="translate-y-2 text-xl font-bold">
                    이현호
                </div>
                <div className="translate-y-2 text-xl font-bold">
                    이재현
                </div>
                <div className="translate-y-2 text-xl font-bold border-l-4 border-black pl-6 mr-7">
                    수입
                </div>
                <div className="translate-y-2 text-xl font-bold">
                    이자
                </div>
                <div className="translate-y-2 text-xl font-bold">
                    지출
                </div>
                <div className="translate-y-2 text-xl font-bold">
                    잔액
                </div>
            </>
        );
    }

    monthlyData(monthName: number, paymentList: Array<string>) {
        
        return (
            <>
            <div className="translate-y-2 text-xl font-bold">
                {this.convertMonthInt2Char(monthName)}
            </div>

            <div>
                <button onClick={()=> this.handlePayment(monthName, 0, paymentList[0])} className={"w-5 p-5 ".concat(paymentList[0])}/>
            </div>
            <div>
            <button onClick={()=> this.handlePayment(monthName, 1, paymentList[1])} className={"w-5 p-5 ".concat(paymentList[1])}/>
            </div>
            <div>
            <button onClick={()=> this.handlePayment(monthName, 2, paymentList[2])} className={"w-5 p-5 ".concat(paymentList[2])}/>
            </div>
            <div>
            <button onClick={()=> this.handlePayment(monthName, 3, paymentList[3])} className={"w-5 p-5 ".concat(paymentList[3])}/>
            </div>
            <div>
            <button onClick={()=> this.handlePayment(monthName, 4, paymentList[4])} className={"w-5 p-5 ".concat(paymentList[4])}/>
            </div>
            <div>
            <button onClick={()=> this.handlePayment(monthName, 5, paymentList[5])} className={"w-5 p-5 ".concat(paymentList[5])}/>
            </div>
            <div>
            <button onClick={()=> this.handlePayment(monthName, 6, paymentList[6])} className={"w-5 p-5 ".concat(paymentList[6])}/>
            </div>
            <div>
            <input type="number" placeholder={this.autoCalc(this.selectedData[monthName])?.toString()} style={{width:80, height:40, borderWidth:2, borderColor:"black"}}/>
            </div>
            <div>
            <input type="number" style={{width:80, height:40, borderWidth:2, borderColor:"black"}}/>
            </div>
            <div>
            <input type="number" style={{width:80, height:40, borderWidth:2, borderColor:"black"}}/>
            </div>
            <div>
            <input type="number" style={{width:80, height:40, borderWidth:2, borderColor:"black"}}/>
            </div>
            </>
            
        );
    }

    autoCalc(data : string[]){
        const dataList: number[] = data.map((dataStr) => this.countMap(dataStr));
        const sum: number = dataList.reduce((acc: number, curr: number) => acc + curr, 0);
        return sum.toString();
    }

    countMap(dataStr : string) {
        if (dataStr === paymentStrType.SEND_COMPANY) {
            return 20000
        }
        else if (dataStr === paymentStrType.SEND_GRAY) {
            return 15000
        }
        else if (dataStr === paymentStrType.SEND_GODSU) {
            return 10000
        }
        else {
            return 0
        }
    }
}

export default function Financial() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const [selectedYear, setSeletedYear]= useState(currentYear);
    const [selectedData, setSelectedData] = useState([
        ["bg-paymentsCompany","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet"],
        ["bg-paymentsNotYet","bg-paymentsCompany","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet"],
        ["bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsCompany","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet"],
        ["bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsCompany","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet"],
        ["bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsCompany","bg-paymentsNotYet","bg-paymentsNotYet"],
        ["bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsCompany","bg-paymentsNotYet"],
        ["bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsCompany"],
        ["bg-paymentsCompany","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet"],
        ["bg-paymentsNotYet","bg-paymentsCompany","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet"],
        ["bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsCompany","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet"],
        ["bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsCompany","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet"],
        ["bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsNotYet","bg-paymentsCompany","bg-paymentsNotYet","bg-paymentsNotYet"],
    ]);
    const reduxAccessToken = useSelector((state:RootState) => state.accessToken);
    let accessToken = TokenRefresh(reduxAccessToken.token);
    
    const fs = new financialScript(currentYear, currentMonth, selectedYear, setSeletedYear, selectedData, setSelectedData);
    const dispatch = useDispatch();
    const handleSaveMyInfo = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/payment/make`,
                {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        nickname: "grant",
                        year: "2019",
                        month: "3",
                        status: paymentType.SEND_GRAY
                    })
                }
            )

            const { status } = response;

            if (status === 201) {
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
    //handleSaveMyInfo();

    return fs.getContent();
}