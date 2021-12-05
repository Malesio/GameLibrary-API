const AccountManager = require('../../services/accounts');
const mongoose = require('mongoose');


async function createJestUser() {
    const mgr = new AccountManager();
    const randomId = Math.floor(Math.random() * 10000000000);

    const user = {name: `jest_user${randomId}`, email: `jest${randomId}@nodejs.org`, password: "jestislife"};

    const result = await mgr.createAccount(user);

    return {mgr: mgr, jestUser: result};
}

async function deleteJestUser(user) {
    const mgr = new AccountManager();
    await mgr.deleteAccount(user.id);
}

afterAll(async () => {
    await mongoose.disconnect();
});

describe('AccountManager create/delete account', () => {

    it('should create a new account', async () => {
        const { mgr, jestUser } = await createJestUser();

        expect(jestUser).not.toBe(false);

        await deleteJestUser(jestUser);
    });

    it('should fail to create an account when the username is already taken', async () => {
        const { mgr, jestUser } = await createJestUser();

        const newUser = {name: jestUser.name, email: "jest2@nodejs.org", password: "jestislove"};
        const result = await mgr.createAccount(newUser);

        expect(result).toBe(false);

        await deleteJestUser(jestUser);
    });

    it('should fail to create an account with missing information', async () => {
        const mgr = new AccountManager();
        const partialUser = {name: "jest_user", email: "jest@nodejs.org"};
        const result = await mgr.createAccount(partialUser);

        expect(result).toBe(false);
    });
});

describe('AccountManager login/logout functionality', () => {
    it('should return a session token upon valid credentials submission', async () => {
        const { mgr, jestUser } = await createJestUser();

        const creds = {name: jestUser.name, password: "jestislife"};
        const result = await mgr.login(creds);

        expect(result).not.toBe(false);

        await deleteJestUser(jestUser);
    });

    it('should fail when sending invalid credentials', async () => {
        const { mgr, jestUser } = await createJestUser();

        expect(await mgr.login({name: "invalid", password: "jestislife"})).toBe(false);
        expect(await mgr.login({name: jestUser.name, password: "jestislove"})).toBe(false);

        await deleteJestUser(jestUser);
    });

    it('should logout the user', async () => {
        const { mgr, jestUser } = await createJestUser();
        const token = await mgr.login({name: jestUser.name, password: "jestislife"});

        expect(await mgr.logout(jestUser, token)).toBe(true);

        await deleteJestUser(jestUser);
    });
});

describe('AccountManager update user data', () => {
    it('should update user name when not already taken', async () => {
        const { mgr, jestUser } = await createJestUser();

        const newUser = await mgr.changeUserData(jestUser, {name: "new_jest_user"});
        expect(newUser.name).toEqual("new_jest_user");

        await deleteJestUser(jestUser);
    });
});
