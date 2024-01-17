import { Test, TestingModule } from "@nestjs/testing";
import { UserCalenderService } from "../user-calender.service";

describe("UserCalenderService", () => {
    let service: UserCalenderService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserCalenderService],
        }).compile();

        service = module.get<UserCalenderService>(UserCalenderService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
