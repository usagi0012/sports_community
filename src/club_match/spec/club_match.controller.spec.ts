import { Test, TestingModule } from "@nestjs/testing";
import { ClubMatchController } from "../club_match.controller";

describe("ClubMatchController", () => {
    let controller: ClubMatchController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ClubMatchController],
        }).compile();

        controller = module.get<ClubMatchController>(ClubMatchController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
