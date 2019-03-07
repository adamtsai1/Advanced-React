function Person(name, foods) {
    this.name = name;
    this.foods = foods;
}

Person.prototype.fetchFavFoods = function() {
    return new Promise((resolve, reject) => {
        // Simulate an API call
        setTimeout(() => {
            resolve(this.foods);
        }, 2000);
    });
};

describe('mocking learning', () => {
    it('mocks a reg function', () => {
        const fetchDogs = jest.fn();

        fetchDogs('snickers');
        expect(fetchDogs).toHaveBeenCalled();
        expect(fetchDogs).toHaveBeenCalledWith('snickers');

        fetchDogs('hugo');
        expect(fetchDogs).toHaveBeenCalledTimes(2);
    });

    it('can create a person', () => {
        const me = new Person('Adam', ['ramen', 'burgers']);
        expect(me.name).toBe('Adam');
    });

    it('can fetch foods', async () => {
        const me = new Person('Adam', ['ramen', 'burgers']);

        // Mock the favFoods function
        me.fetchFavFoods = jest.fn().mockResolvedValue(['ramen', 'burgers']);

        const favFoods = await me.fetchFavFoods();
        expect(favFoods).toContain('burgers');
    });
});
