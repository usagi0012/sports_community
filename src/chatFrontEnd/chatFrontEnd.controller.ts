import { Controller, Get, Render } from "@nestjs/common";

@Controller("view/chat") //index.ejs가 렌더링 시작하는 부분이기 때문에 여기 경로를 변경해주면 front를 보기 편함
export class ChatFrontEndController {
    @Get()
    @Render("index") //index.ejs
    root() {
        return { name: "윤찬" };
    }
}
