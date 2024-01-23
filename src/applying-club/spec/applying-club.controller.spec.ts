import { Test, TestingModule } from "@nestjs/testing";
import { ApplyingClubController } from "../applying-club.controller";

describe("ApplyingClubController", () => {
    let controller: ApplyingClubController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ApplyingClubController],
        }).compile();

        controller = module.get<ApplyingClubController>(ApplyingClubController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
