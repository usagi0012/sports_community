import { Test, TestingModule } from "@nestjs/testing";
import { ApplyingClubService } from "../applying-club.service";

describe("ApplyingClubService", () => {
    let service: ApplyingClubService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ApplyingClubService],
        }).compile();

        service = module.get<ApplyingClubService>(ApplyingClubService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
