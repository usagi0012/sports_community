import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserService } from "../user.service";
import { User } from "../../entity/user.entity";
import { ConfigService } from "@nestjs/config";
describe("UserService", () => {
    let service: UserService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [User],
            providers: [
                UserService,
                // Mock ConfigService
                {
                    provide: ConfigService,
                    useValue: {}, // Replace this with an appropriate mock implementation
                },
                // Mock UserRepository
                {
                    provide: getRepositoryToken(User),
                    useValue: {}, // Replace this with an appropriate mock implementation
                },
            ],
        }).compile();
        service = module.get<UserService>(UserService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
