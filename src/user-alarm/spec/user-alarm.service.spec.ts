import { Test, TestingModule } from "@nestjs/testing";
import { UserAlarmService } from "../user-alarm.service";

describe("UserAlarmService", () => {
    let service: UserAlarmService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserAlarmService],
        }).compile();

        service = module.get<UserAlarmService>(UserAlarmService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
