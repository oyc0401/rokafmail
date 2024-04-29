export default class MockRokafApiClient {

  private getProfileResponse: {
    member: {
      memberSeq: '12345678',
      sodae: '1234',
    },
    serverOn: true,
  }

  forcedSetGetProfileResponse(response) {
    this.getProfileResponse = response;
  }

  async getProfile(name: string, birth: string) {
    return this.getProfileResponse;
  }

  private postMailResponse: {
    complete: false,
    serverOn: true,
  }

  forcedSetPostMailResponse(response) {
    this.postMailResponse = response;
  }
  async postMail(
    body: {
      name: string;
      relationship: string;
      title: string;
      contents: string;
      password: string;
      memberSeq: string;
      sodae: string;
    },
    createdAt = new Date(),
  ) {
    return this.postMailResponse;
  }


}
