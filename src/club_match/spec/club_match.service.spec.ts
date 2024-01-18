import { Test, TestingModule } from "@nestjs/testing";
import { ClubMatchService } from "../club_match.service";

describe("ClubMatchService", () => {
    let service: ClubMatchService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ClubMatchService],
        }).compile();

        service = module.get<ClubMatchService>(ClubMatchService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
