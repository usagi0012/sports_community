import { Test, TestingModule } from "@nestjs/testing";
import { BanlistService } from "../banlist.service";

describe("BanlistService", () => {
    let service: BanlistService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BanlistService],
        }).compile();

        service = module.get<BanlistService>(BanlistService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
