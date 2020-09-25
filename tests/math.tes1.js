
const add = (a, b) => {
    return new Promise((res, rej) => {
        res(a + b)
    })
}

test('Async test demo', () => {
    // jest.setTimeout(30000)
    expect(2).toBe(2)
}, 1000)

test('Promise test demo', async () => {
    const sum = await add(1, 2)
    expect(sum).toBe(3)
})