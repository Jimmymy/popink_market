import { GET } from "../route"

describe("store custom route", () => {
  it("responds with HTTP 200", async () => {
    const res = {
      sendStatus: jest.fn(),
    }

    await GET({} as never, res as never)

    expect(res.sendStatus).toHaveBeenCalledWith(200)
  })
})
