import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
describe("AuthController", () => {
    let controller: AuthController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                // Mock AuthService
                {
                    provide: AuthService,
                    useValue: {}, // Replace this with an appropriate mock implementation
                },
            ],
        }).compile();
        controller = module.get<AuthController>(AuthController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
