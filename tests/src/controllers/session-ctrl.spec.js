const SessionController = require("../../../src/controllers/session-ctrl");
const SessionService = require("../../../src/services/session-service");
const UserService = require("../../../src/services/user-service");

describe("SessionController", () => {
  const resMock = {
    status: jest.fn(() => resMock),
    json: jest.fn(),
  };
  const reqMock = {
    body: { email: "ada", password: "senha" },
  };

  const reqMock2 = {
    body: { email: "ada@email.com", password: "" },
  };

  const reqMock3 = {
    body: { email: "boti@email.com", password: "1234" },
  };

  jest.mock("../../../src/services/user-service");

  it(`should return status 400`, async () => {
    await SessionController.create(reqMock, resMock);

    expect(resMock.status).toHaveBeenCalledWith(400);
  });
  it(`should return message "Email"`, async () => {
    await SessionController.create(reqMock, resMock);

    expect(resMock.json).toHaveBeenCalledWith("Email inválido");
  });

  it(`should return "senha inválida"`, async () => {
    await SessionController.create(reqMock2, resMock);

    expect(resMock.json).toHaveBeenCalledWith("Senha inválida");
  });

  it(`should return "usuário não encontrado"`, async () => {
    const spy = jest.spyOn(UserService, "userExistsAndCheckPassword");
    spy.mockReturnValue(false);
    await SessionController.create(reqMock3, resMock);

    expect(resMock.json).toHaveBeenCalledWith("Usuário não encontrado");
    expect(resMock.status).toHaveBeenCalledWith(404);
  });

  it(`should return status "200" and "token gerado"`, async () => {
    const spy = jest.spyOn(UserService, "userExistsAndCheckPassword");
    const spy1 = jest.spyOn(SessionService, "generateToken");
    spy.mockReturnValue(true);
    spy1.mockReturnValue("Token gerado");
    await SessionController.create(reqMock3, resMock);

    expect(resMock.json).toHaveBeenCalledWith({ token: "Token gerado" });
    expect(resMock.status).toHaveBeenCalledWith(200);
  });

  it(`should return status "500"`, async () => {
    const spy = jest.spyOn(UserService, "userExistsAndCheckPassword");
    spy.mockImplementation(() => {
      throw new Error("Erro no servidor");
    });

    await SessionController.create(reqMock3, resMock);

    expect(resMock.json).toHaveBeenCalledWith("Erro no servidor");
    expect(resMock.status).toHaveBeenCalledWith(500);
  });
});
