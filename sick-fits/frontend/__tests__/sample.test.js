describe('sample test 101', () => {
    // it.only or fit()
    // it.skip() or xit()

    it('works as expected', () => {
        expect(1).toEqual(1);
    });

    it('handles ranges just fine', () => {
        const age = 200;
        expect(age).toBeGreaterThan(100);
    });

    it('makes a list of dog names', () => {
        const dogs = ['snickers', 'hugo'];
        expect(dogs).toEqual(dogs);
        expect(dogs).toContain('snickers');
    });
});
