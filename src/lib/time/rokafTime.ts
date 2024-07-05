import { Status, serveStatus } from "./time";

export class RokafTime {
  static mockMap = {};

  static setMock(generation: number, status: Status) {
    RokafTime.mockMap[generation] = status;
  }
  static resetMock() {
    RokafTime.mockMap = {};
  }
  static getStatus(generation: number) {
    if (RokafTime.mockMap[generation] != null) {
      return RokafTime.mockMap[generation];
    }

    return serveStatus(generation);
  }
}

