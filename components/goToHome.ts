import { NextPageContext } from "next";
import { useRouter } from "next/router";

export default function goToHome( accessToken : string ) {
    const router = useRouter();
    if (accessToken === '') {
        alert("세션이 만료되었습니다.");
        if (typeof window === "undefined") {
            const { res } = router.query as unknown as NextPageContext;
            res?.writeHead(302, {Location: "/"});
            res?.end();
        } else {
            router.push("/", undefined, { shallow: true });
        }
    }
}