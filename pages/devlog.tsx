import Seo from "@/components/seo";
import { ReactElement, useEffect, useState } from "react";

interface sprintInfoType {
    name : string;
    startDate : string;
    endDate : string;
    goal : string;
}

interface sprintDetailType {
    id:string,
    fields : {
        summary : string,
        description : string,
        status : {
            statusCategory : {
                name : string
            }
        },
        issuetype : {
            name : string
        },
        subtasks : Array<sprintDetailType>
    }
}


class stackScript {
    private themeCode : string;
    private frameCode : string;
    private sprintInfo : sprintInfoType;
    private sprintDetail : Array<sprintDetailType>;
  
  
    constructor(
        themeCode:string, frameCode:string,
        sprintInfo:sprintInfoType, sprintDetail:Array<sprintDetailType>
        ) {
        this.themeCode = themeCode;
        this.frameCode = frameCode;
        this.sprintInfo = sprintInfo;
        this.sprintDetail = sprintDetail;
    }
  
    getContent() {
        return (
            <div className={this.themeCode}>
                <Seo subtitle="DevLog" />
                {this.content()}
            </div>
        );
    }
    content() {
        return (
            <div className={this.frameCode}>
                <div className="grid justify-items-center">
                    {this.title()}
                    {this.titleCaption()}
                </div>
                {this.sprintOverview()}
                {this.sprintDetail.map((index) => this.addLog(index))}
            </div>
        );
    }

    addLog(data: sprintDetailType) {
        const titleColor = data.fields.issuetype.name === "스토리" ? "text-devLogStory" : data.fields.issuetype.name === "하위 작업" ? "text-devLogWork" : "";
        return (
          <div key={data.id} className="rounded-x bg-white p-5 my-1 w-full mx-5 shadow-2xl">
            <div className="grid grid-cols-1 divide-y-2 divide-grantProject">
              {this.setBlockTitle(data.fields.summary, data.fields.status.statusCategory.name, titleColor)}
              <div>
                {data.fields.description}
              </div>
              <div className="flex flex-col mt-2">
                {data.fields.subtasks && data.fields.subtasks.map((index) => this.addLog(index))}
              </div>
            </div>
          </div>
        );
      }
    
    sprintOverview() {
        return (
            <div className="ml-10 mb-10 divide-y-2">
                <div className="hansans text-4xl text-devLogSprint">
                    {this.sprintInfo? this.sprintInfo.name : ""}
                </div>
                <div className="">
                    {this.sprintInfo? this.sprintInfo.goal : ""}
                </div>
            </div>
        )
    }
  
    title() {
        return (
            <div className="hansans text-5xl mt-20">
                개발 현황
            </div>
        );
    }
    titleCaption():ReactElement {
        return (
            <div className="kargugsu text-xl mb-20">
            단기 개발 계획 및 진행상황을 알려드립니다.
            </div>
        );
    }
    setBlockTitle(titleName: string, statusName: string, bgColor: string):ReactElement {
        const statusColor = (statusName === "할 일"? 
            "bg-devLogToDo" : statusName === "진행 중"?
            "bg-devLogProgress" : "bg-devLogDone"
        )
        return (
            <div className="flex flex-row">
                <div className={"text-2xl font-bold mb-2 ".concat(bgColor)}>
                    {titleName}
                </div>
                <div className={"rounded hansans mx-2 px-2 pt-2 -translate-y-1 ".concat(statusColor)}>
                    {statusName}
                </div>
            </div>
            
        );
    }
  }

export default function DevLog() {
    const [issueData, setIssueData] = useState([]);
    const [sprintData, setSprintData] = useState(
        {
            name : "",
            startDate : "",
            endDate : "",
            goal : ""
        }
    );

    const getSprintDetail = async (sprintNum:number) => {
        try {
            const response = await fetch(
                `/api/devlog/sprint/${sprintNum}/issue`,
                {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `${process.env.NEXT_PUBLIC_JIRA_ACCESS_KEY}`
                    },
                }
            )

            const { status } = response;

            if (status === 200) {
                const data = await(response).json();
                const issuesNum = data.total;
                setIssueData(data.issues);
            } else {
                console.log("개발자에게 문의하세요");
            }
        } catch (error) {
            console.log(error);
        }

    }

    const getJiraSprint = async () => {
        try {
            const response = await fetch(
                `/api/devlog/board/8/sprint`,
                {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `${process.env.NEXT_PUBLIC_JIRA_ACCESS_KEY}`
                    },
                }
            )

            const { status } = response;

            if (status === 200) {
                const data = await(response).json();
                
                for (const idx in data.values) {
                    if (data.values[idx].state === "active") {
                        setSprintData(data.values[idx]);
                        const domainArray = data.values[idx].self.split("/");
                        getSprintDetail(domainArray[domainArray.length-1]);
                        break;
                    }
                }
            } else {
                console.log("개발자에게 문의하세요");
            }
        } catch (error) {
            console.log(error);
        }

    }
    useEffect(() => {
        getJiraSprint();
    }, []);
    const ss = new stackScript(
        "bg-grantStack snap-start",
        "",
        sprintData,
        issueData
    );
    
    return ss.getContent();
}