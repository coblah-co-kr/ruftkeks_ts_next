import logOutOrKeep from "@/components/logOutKeep";
import Seo from "../components/seo";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import TokenRefresh from "@/components/tokenRefresh";
import React, { useEffect, useState } from "react";
import goToHome from "@/components/goToHome";
import { useDispatch } from "react-redux";
import styles from "../components/modal.module.css"
import { NextRouter, useRouter } from "next/router";

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
    ZERO="0"
}

const initialExpenseData = {
    "date" : "",
    "location" : "",
    "members" : "",
    "data" : [{
        "expenseTitle" : "",
        "expensePrice" : "",
        "expenseDate" : "",
        "expenseContent" : "",
    }]
}

const initialMemberData = [
    [paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET],
    [paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET],
    [paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET],
    [paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET],
    [paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET],
    [paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET],
    [paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET],
    [paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET],
    [paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET],
    [paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET],
    [paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET],
    [paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET,paymentStrType.NOT_YET],
]
const initialMemberBalanceData = [
    [paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO],
    [paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO],
    [paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO],
    [paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO],
    [paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO],
    [paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO],
    [paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO],
    [paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO],
    [paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO],
    [paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO],
    [paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO],
    [paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO,paymentStrType.ZERO],
]

interface expenseDataType {
    "date" : string,
    "location" : string,
    "members" : string,
    "data" : {
        "expenseTitle" : string,
        "expensePrice" : string,
        "expenseDate" : string,
        "expenseContent" : string,
    }[]
}

class financialScript {
    private todayYear : number;
    private todayMonth : number;
    private selectedYear : number;
    private setSelectedYear : Function;
    private selectedData : string[][];
    private setSelectedData : Function;
    private selectedBalanceData : string[][];
    private setSelectedBalanceData : Function;
    private accessToken : string;
    private dispatch : Function;
    private editExpense : boolean;
    private setEditExpense : Function;
    private expenseCount : number;
    private setExpenseCount : Function;
    private expenseData : expenseDataType;
    private setExpenseData : Function;
    private expenseIndex : number;
    private setExpenseIndex : Function;
    private prevCurrent : number;
    private setPrevCurrent : Function;
    private roleInfo : string;
    private setRoleInfo : Function;
    private router : NextRouter;

    constructor(
        todayYear : number,
        todayMonth : number,
        selectedYear : number,
        setSelectedYear : Function,
        selectedData : string[][],
        setSelectedData : Function,
        selectedBalanceData : string[][],
        setSelectedBalanceData : Function,
        accessToken : string,
        dispatch : Function,
        editExpense : boolean,
        setEditExpense : Function,
        expenseCount : number,
        setExpenseCount : Function,
        expenseData : expenseDataType,
        setExpenseData : Function,
        expenseIndex : number,
        setExpenseIndex : Function,
        prevCurrent : number,
        setPrevCurrent : Function,
        roleInfo : string,
        setRoleInfo : Function,
        router : NextRouter,
        ) {
        this.todayYear = todayYear;
        this.todayMonth = todayMonth;
        this.selectedYear = selectedYear;
        this.setSelectedYear = setSelectedYear;
        this.selectedData = selectedData;
        this.setSelectedData = setSelectedData;
        this.selectedBalanceData = selectedBalanceData;
        this.setSelectedBalanceData = setSelectedBalanceData;
        this.accessToken = accessToken;
        this.dispatch = dispatch;
        this.editExpense = editExpense;
        this.setEditExpense = setEditExpense;
        this.expenseCount = expenseCount;
        this.setExpenseCount = setExpenseCount;
        this.expenseData = expenseData;
        this.setExpenseData = setExpenseData;
        this.expenseIndex = expenseIndex;
        this.setExpenseIndex = setExpenseIndex;
        this.prevCurrent = prevCurrent;
        this.setPrevCurrent = setPrevCurrent;
        this.roleInfo = roleInfo;
        this.setRoleInfo = setRoleInfo;
        this.router = router
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

    expenseInputs() {
        const expenseInputs = [];
        for (let i=0; i<this.expenseCount; i++) {
            expenseInputs.push(
                <React.Fragment key={i}>
                    <input type="text" placeholder="숙소비" value={this.expenseData.data[i].expenseTitle? this.expenseData.data[i].expenseTitle: ""} onChange={(e)=>this.handleExpenseData(e, Number(i), 0)}/>
                    <input type="number" placeholder="175210" value={this.expenseData.data[i].expensePrice} onChange={(e)=>this.handleExpenseData(e, Number(i), 1)}/>
                    <input type="text" placeholder="5/26" value={this.expenseData.data[i].expenseDate} onChange={(e)=>this.handleExpenseData(e, Number(i), 2)}/>
                    <input type="text" placeholder="5인 기준" value={this.expenseData.data[i].expenseContent} onChange={(e)=>this.handleExpenseData(e, Number(i), 3)}/>
                </React.Fragment>
            )
        }
        return expenseInputs;
    }

    isDataCompleted(index: number) {
        const prevData = this.expenseData.data[this.expenseCount-index];
        return (prevData.expenseDate && prevData.expensePrice && prevData.expenseTitle)
    }

    handleExpenseInputs() {
        if (this.isDataCompleted(1)) {
            this.setExpenseCount(this.expenseCount+1);
            const updatedData = {...this.expenseData};
            updatedData.data.push(
                {
                    expenseTitle : "",
                    expensePrice : "",
                    expenseDate : "",
                    expenseContent : "",
                }
            )
            this.setExpenseData(updatedData);
        }
        else {
            alert("데이터를 입력해주세요.")
        }
    }

    handleExpenseDate(e: React.ChangeEvent<HTMLInputElement>) {
        const updatedData = {...this.expenseData};
        updatedData.date = e.target.value;
        this.setExpenseData(updatedData);
    }

    handleExpenseLocation(e: React.ChangeEvent<HTMLInputElement>) {
        const updatedData = {...this.expenseData};
        updatedData.location = e.target.value;
        this.setExpenseData(updatedData);
    }

    handleExpenseMembers(e: React.ChangeEvent<HTMLInputElement>) {
        const updatedData = {...this.expenseData};
        updatedData.members = e.target.value;
        this.setExpenseData(updatedData);
    }

    handleExpenseData(e: React.ChangeEvent<HTMLInputElement>, index:number, expenseDetailIndex : number) {
        const updatedData = {...this.expenseData};
        switch (expenseDetailIndex) {
            case 0:
                updatedData.data[index].expenseTitle = e.target.value;
                break;
            case 1:
                updatedData.data[index].expensePrice = e.target.value;
                break;
            case 2:
                updatedData.data[index].expenseDate = e.target.value;
                break;
            case 3:
                updatedData.data[index].expenseContent = e.target.value;
                break;
        }
        this.setExpenseData(updatedData);
    }

    getContent() {
        const MonthList = Array.from({ length: (this.selectedYear === this.todayYear)? this.todayMonth: 12 }, (_, index) => index);
        return (
            <div>
                <Seo subtitle = "Financial"/>
                <div className={styles.overlay} style={{ display : this.editExpense? "block" : "none"}}>
                    <div className={styles.modal}>
                        <div className={styles.content}>
                            <div className="grid grid-cols-4 grid-flow-row">
                                <div className="hansans text-xl">
                                    일정
                                </div>
                                <div>
                                    <input type="text" placeholder="6/1 ~ 6/2" value={this.expenseData.date} onChange={(e)=>this.handleExpenseDate(e)}/>
                                </div>
                                <div className="hansans text-xl">
                                    장소
                                </div>
                                <div>
                                    <input className="w-full" type="text" placeholder="태안" value={this.expenseData.location} onChange={(e)=>this.handleExpenseLocation(e)}/>
                                </div>
                                <div className="hansans text-xl">
                                    참석인원
                                </div>
                                <div className="col-span-3">
                                    <input className="w-full" type="text" placeholder="방준용, 손호진, 손세호" value={this.expenseData.members} onChange={(e)=>this.handleExpenseMembers(e)}/>
                                </div>
                                <div className="hansans text-xl">
                                    지출내역
                                </div>
                                <div className="hansans text-xl">
                                    금액
                                </div>
                                <div className="hansans text-xl">
                                    사용일
                                </div>
                                <div className="hansans text-xl">
                                    기타
                                </div>
                                {this.expenseInputs()}
                            </div>
                        </div>
                        <button onClick={()=>this.handleExpenseInputs()} className="rounded border-2 h-10 border-black my-10 mx-5">+</button>
                        <div className="flex flex-row mx-auto gap-x-1 pb-5">
                            <div onClick={()=>this.cancelExpense()} className={styles.closeButton}>취소</div>
                            <div onClick={()=>this.resetExpense()} className={styles.closeButton}>리셋</div>
                            <div onClick={()=>this.confirmExpense()} className={styles.confirmButton}>확인</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-items-center">
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
                    <div className="hansans text-5xl mt-5 text-center mb-10 dark:text-slate-300">
                        회비 납부 내역
                    </div>
                    <div className="flex flex-row justify-center hansans mb-10 dark:text-slate-200">
                        <div className="rounded p-3 bg-paymentsCompany mx-2"/>납부(취업자: 2만)
                        <div className="rounded p-3 bg-paymentsGray mx-2"/>납부(회색분자: 1.5만)
                        <div className="rounded p-3 bg-paymentsGod mx-2"/>납부(갓수: 1만)
                        <div className="rounded p-3 bg-paymentsNotYet mx-2"/>미납
                        <div className="rounded p-3 bg-paymentsPass mx-2"/>Pass
                    </div>
                    <div className="grid grid-cols-12 grid-flow-row justify-items-center gap-y-4 dark:text-slate-300">
                        {this.paymentHead()}
                        {MonthList.map((index) => (
                            <React.Fragment key={index}>
                            {this.monthlyData(index, 
                                this.selectedData[index]
                            )}
                            </React.Fragment>
                        ))}
                    </div>
                    <button onClick={()=>this.handleSave()} className="mt-10 rounded-lg bg-paymentsGod mx-auto px-5 py-2 hansans text-2xl hover:bg-paymentsPass">저장</button>
                </div>
            </div>
        );
    }

    cancelExpense() {
        this.setEditExpense(false);
    }

    resetExpense() {
        const updatedExpenseData = {...this.expenseData};
        updatedExpenseData.date = initialExpenseData.date;
        updatedExpenseData.location = initialExpenseData.location;
        updatedExpenseData.members = initialExpenseData.members;
        updatedExpenseData.data = [{
            "expenseContent" : "",
            "expenseDate" : "",
            "expensePrice" : "",
            "expenseTitle" : "",
        }];
        this.setExpenseCount(1);
        this.setExpenseData(updatedExpenseData);
    }

    confirmExpense() {
        const expenseSum = (this.expenseData.data.map(
            (arr)=> Number(arr.expensePrice))).reduce((arr, curr)=> arr+curr, 0);
        const balanceData = [...this.selectedBalanceData];
        balanceData[this.expenseIndex][2] = expenseSum.toString();
        if (this.roleInfo === "CFO" || this.roleInfo === "CTO") {
            if(this.isDataCompleted(1)) {
                this.handleMakeExpenseBill();
                this.setSelectedBalanceData(balanceData);
            } else {
                if (this.expenseCount>1) {
                    this.handleMakeExpenseBill();
                    this.setSelectedBalanceData(balanceData);
                    const updatedData = {...this.expenseData};
                    updatedData.data.pop();
                    this.setExpenseData(updatedData);
                    this.setExpenseCount(this.expenseCount-1);
                }
                alert("내용을 입력해주세요.");
            }
            this.setEditExpense(false);
            console.log(this.selectedBalanceData);
        }
        else {
            alert("권한이 없습니다. 다시 로그인하거나, 관리자에게 문의하세요.");
        }
    }

    handleSave() {
        if (this.roleInfo === "CFO" || this.roleInfo === "CTO") {
            this.handleMakeBill();
        } else {
            alert("권한이 없습니다. 다시 로그인하거나, 관리자에게 문의하세요.");
        }
    }

    handleMakeExpenseBill = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/expense/make`,
                {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.accessToken}`
                    },
                    body: JSON.stringify({
                        year: this.selectedYear,
                        month: this.expenseIndex+1,
                        date: this.expenseData.date,
                        location: this.expenseData.location,
                        members: this.expenseData.members,
                        expenses: this.expenseData.data.map((arr) => [arr.expenseTitle, arr.expensePrice, arr.expenseDate, arr.expenseContent]),
                    })
                }
            )

            const { status } = response;

            if (status === 200) {
                alert("수정되었습니다.");
            } else if (status === 201) {
                alert("저장되었습니다.");
            } else if (status === 400) {
                goToHome(this.accessToken, this.router, true);
            } else if (status === 403) {
                logOutOrKeep(this.accessToken, this.dispatch)
                alert("다시 시도해보세요.");
            }
            else {
                console.log("개발자에게 문의하세요");
            }
        } catch (error) {
            console.log(error);
        }

    }

    handleMakeBill = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/payment/make`,
                {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.accessToken}`
                    },
                    body: JSON.stringify({
                        year: this.selectedYear,
                        payments: this.selectedData.map((arr, index) => arr.concat(this.selectedBalanceData[index])),
                    })
                }
            )

            const { status } = response;

            if (status === 200) {
                alert("수정되었습니다.");
            } else if (status === 201) {
                alert("저장되었습니다.");
            } else if (status === 400) {
                goToHome(this.accessToken, this.router, true);
            } else if (status === 403) {
                logOutOrKeep(this.accessToken, this.dispatch)
                alert("다시 시도해보세요.");
            }
            else {
                console.log("개발자에게 문의하세요");
            }
        } catch (error) {
            console.log(error);
        }

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
                    이자(￦)
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
            <input className="dark:bg-black" type="text" value={this.formatCurrency(this.autoCalc(this.selectedData, monthName)?.toString())} readOnly onChange={(e)=>this.handleBalanceData(e, monthName, 0)} style={{width:80, height:40, borderWidth:2, borderColor:"black"}}/>
            </div>
            <div>
            <input className="dark:bg-black" type="number" placeholder="0" value={this.selectedBalanceData[monthName][1] === "0"? "" :this.selectedBalanceData[monthName][1]} onChange={(e)=>this.handleBalanceData(e, monthName, 1)} style={{width:80, height:40, borderWidth:2, borderColor:"black"}}/>
            </div>
            <div>
            <button className="w-20 rounded border-2 h-10 border-black" onClick={() => this.noteExpense(monthName)} value={this.selectedBalanceData[monthName][2]}>{this.selectedBalanceData[monthName][2] === "0"? "추가" :this.formatCurrency(this.selectedBalanceData[monthName][2])}</button>
            </div>
            <div>
            <input className="dark:bg-black" type="text" value={this.formatCurrency(this.selectedBalanceData[monthName][3])} readOnly style={{width:80, height:40, borderWidth:2, borderColor:"black"}}/>
            </div>
            </>
            
        );
    }

    getExpenseInfo = async (monthName : number) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/expense/get?year=${this.selectedYear}&month=${monthName+1}`,
                {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.accessToken}`
                    }
                }
            )

            const { status } = response;

            if (status === 200) {
                const result = await(response).json();
                const updatedData = {...this.expenseData};
                updatedData.date = result.date;
                updatedData.location = result.location;
                updatedData.members = result.members;
                this.setExpenseCount(result.expenses.length);
                for (let i=0; i<result.expenses.length; i++) {
                    if (updatedData.data.length != result.expenses.length) {
                        updatedData.data.push({
                            "expenseContent" : "",
                            "expenseDate" : "",
                            "expensePrice" : "",
                            "expenseTitle" : "",
                        })
                    }
                    updatedData.data[i].expenseTitle = result.expenses[i][0];
                    updatedData.data[i].expensePrice = result.expenses[i][1];
                    updatedData.data[i].expenseDate = result.expenses[i][2];
                    updatedData.data[i].expenseContent = result.expenses[i][3];
                }
                this.setExpenseData(updatedData);
            } 
            else if (status === 204) {
                console.log("해당 데이터는 존재하지 않습니다.");
                const updatedExpenseData = {...this.expenseData};
                updatedExpenseData.date = initialExpenseData.date;
                updatedExpenseData.location = initialExpenseData.location;
                updatedExpenseData.members = initialExpenseData.members;
                updatedExpenseData.data = [{
                    "expenseContent" : "",
                    "expenseDate" : "",
                    "expensePrice" : "",
                    "expenseTitle" : "",
                }];
                this.setExpenseData(updatedExpenseData);
            }
            else if (status === 400) {
                console.log(await(response).text());
            } else if (status === 403) {
                logOutOrKeep(this.accessToken, this.dispatch)
                alert("다시 시도해보세요.");
            }
            else {
                console.log("개발자에게 문의하세요");
            }
        } catch (error) {
            console.log(error);
        }
    }

    noteExpense(monthName : number) {
        const updateData = [...this.selectedBalanceData];
        this.setExpenseCount(1);
        this.setEditExpense(true);
        this.getExpenseInfo(monthName);
        this.setExpenseIndex(monthName);
    }

    formatCurrency = (value:number|string) => {
        // 통화 형식 적용
        return Number(value).toLocaleString("ko-KR", {
            style: "currency",
            currency: "KRW",
        });
    };
    
    handleBalanceData(e: React.ChangeEvent<HTMLInputElement>, monthName:number, whoIs:number) {
        const updateData = [...this.selectedBalanceData];
        updateData[monthName][whoIs] = (e.target.value).toString();
        updateData[monthName][3] = (Number(updateData[monthName][0]) + Number(updateData[monthName][1]) - Number(updateData[monthName][2])).toString();
        this.setSelectedBalanceData(updateData);
    };

    autoCalc(data : string[][], monthName:number){
        const dataList: number[] = data[monthName].map((dataStr) => this.countMap(dataStr));
        const sum: number = dataList.reduce((acc: number, curr: number) => acc + curr, 0);

        const updateData = [...this.selectedBalanceData];
        updateData[monthName][0] = (sum + Number(monthName>0? updateData[monthName-1][3]:this.prevCurrent)).toString();
        updateData[monthName][3] = (Number(updateData[monthName][0]) + Number(updateData[monthName][1]) - Number(updateData[monthName][2])).toString();
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
    const [selectedData, setSelectedData] = useState(initialMemberData);
    const [selectedBalanceData, setSelectedBalanceData] = useState(initialMemberBalanceData);
    const [editExpense, setEditExpense] = useState(false);
    const [expenseCount, setExpenseCount] = useState(1);
    const [expenseData, setExpenseData] = useState(initialExpenseData);
    const [expenseIndex, setExpenseIndex] = useState(0);
    const [prevCurrent, setPrevCurrent] = useState(0);
    const myInfo = useSelector((state:RootState) => state.myInfo);
    const [roleInfo, setRoleInfo] = useState(myInfo.role);
    const reduxAccessToken = useSelector((state:RootState) => state.accessToken);
    let accessToken = TokenRefresh(reduxAccessToken.token);
    const router = useRouter();
    goToHome(accessToken, router);
    const dispatch = useDispatch();
    const fs = new financialScript(
        currentYear, currentMonth, selectedYear, setSeletedYear, 
        selectedData, setSelectedData, selectedBalanceData, setSelectedBalanceData, 
        accessToken, dispatch,
        editExpense, setEditExpense,
        expenseCount, setExpenseCount,
        expenseData, setExpenseData,
        expenseIndex, setExpenseIndex,
        prevCurrent, setPrevCurrent,
        roleInfo, setRoleInfo, router
    );

    const getPaymentsInfo = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/payment/get?year=${selectedYear}`,
                {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                }
            )

            const { status } = response;

            if (status === 200) {
                const data = await(response).json();
                setSelectedData(data.payments.map((arr : string[]) => arr.slice(0, 7)));
                setSelectedBalanceData(data.payments.map((arr : string[]) => arr.slice(7)));
            } 
            else if (status === 204) {
                console.log("해당 데이터는 존재하지 않습니다.");
                setSelectedData(initialMemberData);
                setSelectedBalanceData(initialMemberBalanceData);
            }
            else if (status === 400) {
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
    const getPrevPaymentsInfo = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/payment/get?year=${selectedYear-1}`,
                {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                }
            )

            const { status } = response;

            if (status === 200) {
                const data = await(response).json();
                setPrevCurrent(Number(data.payments[11][10]));
            } 
            else if (status === 204) {
                console.log("해당 데이터는 존재하지 않습니다.");
            }
            else if (status === 400) {
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
    useEffect(() => {
        getPaymentsInfo();
        if (selectedYear>2019) {
            getPrevPaymentsInfo();
        } else {
            setPrevCurrent(0);
        }
    }, [selectedYear])

    return fs.getContent();
}