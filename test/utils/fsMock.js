import sinon from 'sinon';

export const create = (fsMock) => {
    return {
        existsSync: sinon.fake(fsMock.existsSync),
        readFileSync: sinon.fake(fsMock.readFileSync),
        writeFileSync: sinon.fake(fsMock.writeFileSync),
        mkdirSync: sinon.fake(fsMock.mkdirSync)
    };
};