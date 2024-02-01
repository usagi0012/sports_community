import { Test, TestingModule } from "@nestjs/testing";
import { UserAlarmController } from "../user-alarm.controller";
import { UserAlarmService } from "../user-alarm.service";

describe("UserAlarmController", () => {
    let controller: UserAlarmController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserAlarmController],
            providers: [UserAlarmService],
        }).compile();

        controller = module.get<UserAlarmController>(UserAlarmController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
