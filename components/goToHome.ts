import { NextPageContext } from "next";
import { NextRouter, useRouter } from "next/router";

export default function goToHome( accessToken : string, router: NextRouter, force? : boolean ) {
    if (force) {
        router.push("/", undefined, { shallow: true });
    }
    if (accessToken === '') {
        if (typeof window === "undefined") {
            const { res } = router.query as unknown as NextPageContext;
            res?.writeHead(302, {Location: "/"});
            res?.end();
        } else {
            alert("세션이 만료되었습니다.");
            router.push("/", undefined, { shallow: true });
        }
    }
}