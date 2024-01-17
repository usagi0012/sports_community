import { Test, TestingModule } from "@nestjs/testing";
import { UserCalenderController } from "../user-calender.controller";
import { UserCalenderService } from "../user-calender.service";

describe("UserCalenderController", () => {
    let controller: UserCalenderController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserCalenderController],
            providers: [UserCalenderService],
        }).compile();

        controller = module.get<UserCalenderController>(UserCalenderController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
