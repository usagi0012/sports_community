import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../user.controller";
import { UserService } from "../user.service";
import { ConfigService } from "@nestjs/config";
describe("UserController", () => {
    let controller: UserController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                UserService,
                ConfigService,
                {
                    provide: "UserRepository",
                    useValue: {
                        // UserRepository의 mock 메소드를 여기에 구현
                    },
                },
            ],
        }).compile();
        controller = module.get<UserController>(UserController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
