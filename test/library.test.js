"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __libraryname__1 = __importDefault(require("../src/--libraryname--"));
/**
 * Dummy test
 */
describe("Dummy test", function () {
    it("works if true is truthy", function () {
        expect(true).toBeTruthy();
    });
    it("DummyClass is instantiable", function () {
        expect(new __libraryname__1.default()).toBeInstanceOf(__libraryname__1.default);
    });
});
