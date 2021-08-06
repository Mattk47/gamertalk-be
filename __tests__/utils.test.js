const { formatCategoryData, formatUserData, formatReviewData, createReviewRef, formatCommentData } = require('../db/utils/data-manipulation')

describe('formatCategoryData', () => {
    test('returns an array when invoked with no arg', () => {
        expect(Array.isArray(formatCategoryData())).toBe(true)
        expect(formatCategoryData()).toEqual([])
    });
    test('returns an array containing nested array holding each object values within', () => {
        const input = [
            {
                slug: 'strategy',
                description:
                    'Strategy-focused board games that prioritise limited-randomness'
            },
            {
                slug: 'hidden-roles',
                description:
                    "One or more players around the table have a secret, and the rest of you need to figure out who! Players attempt to uncover each other's hidden role"
            }]
        expect(formatCategoryData(input)).toEqual([['strategy', 'Strategy-focused board games that prioritise limited-randomness'],
        ['hidden-roles', "One or more players around the table have a secret, and the rest of you need to figure out who! Players attempt to uncover each other's hidden role"]])
    });
    test('returns an array with different reference to memory', () => {
        const input = [
            {
                slug: 'strategy',
                description:
                    'Strategy-focused board games that prioritise limited-randomness'
            },
            {
                slug: 'hidden-roles',
                description:
                    "One or more players around the table have a secret, and the rest of you need to figure out who! Players attempt to uncover each other's hidden role"
            }]

        expect(formatCategoryData(input)).not.toBe(input)

    });
    test('category objs remain unchanged', () => {
        const input = [
            {
                slug: 'strategy',
                description:
                    'Strategy-focused board games that prioritise limited-randomness'
            },
            {
                slug: 'hidden-roles',
                description:
                    "One or more players around the table have a secret, and the rest of you need to figure out who! Players attempt to uncover each other's hidden role"
            }]
        formatCategoryData(input)
        expect(input[0]).toEqual(
            {
                slug: 'strategy',
                description:
                    'Strategy-focused board games that prioritise limited-randomness'
            })

    });
});

describe('formatUserData', () => {
    test('returns an array when invoked with no arg', () => {
        expect(Array.isArray(formatUserData())).toBe(true)
        expect(formatUserData()).toEqual([])
    });
    test('returns an array containing nested array holding each object values within', () => {
        const input = [
            {
                username: 'tickle122',
                name: 'Tom Tickle',
                avatar_url:
                    'https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg'
            },
            {
                username: 'grumpy19',
                name: 'Paul Grump',
                avatar_url: 'https://www.tumbit.com/profile-image/4/original/mr-grumpy.jpg'
            }]
        expect(formatUserData(input)).toEqual([
            [
                'tickle122',
                'Tom Tickle',
                'https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg'
            ],
            [
                'grumpy19',
                'Paul Grump',
                'https://www.tumbit.com/profile-image/4/original/mr-grumpy.jpg'
            ]])
    })
    test('returns an array with different reference to memory', () => {
        const input = [
            {
                username: 'tickle122',
                name: 'Tom Tickle',
                avatar_url:
                    'https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg'
            },
            {
                username: 'grumpy19',
                name: 'Paul Grump',
                avatar_url: 'https://www.tumbit.com/profile-image/4/original/mr-grumpy.jpg'
            }]

        expect(formatUserData(input)).not.toBe(input)
    })
    test('category objs remain unchanged', () => {
        const input = [
            {
                username: 'tickle122',
                name: 'Tom Tickle',
                avatar_url:
                    'https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg'
            },
            {
                username: 'grumpy19',
                name: 'Paul Grump',
                avatar_url: 'https://www.tumbit.com/profile-image/4/original/mr-grumpy.jpg'
            }]
        formatUserData(input)
        expect(input[0]).toEqual(
            {
                username: 'tickle122',
                name: 'Tom Tickle',
                avatar_url:
                    'https://www.spiritsurfers.net/monastery/wp-content/uploads/_41500270_mrtickle.jpg'
            }
        )

    });
})

describe('formatReviewData', () => {
    test('returns an array when invoked with no arg', () => {
        expect(Array.isArray(formatReviewData())).toBe(true)
        expect(formatReviewData()).toEqual([])
    });
    test('returns an array containing nested array holding each object values within', () => {
        const input = [{
            title: 'Culture a Love of Agriculture With Agricola',
            review_body:
                "You could sum up Agricola with the simple phrase 'Farmyeard Fun' but the mechanics and game play add so much more than that. You'll find yourself torn between breeding pigs, or sowing crops. Its joyeous and rewarding and it makes you think of time spent outside, which is much harder to do these days!",
            designer: 'Uwe Rosenberg',
            review_img_url:
                'https://images.pexels.com/photos/4917821/pexels-photo-4917821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            votes: 1,
            category: 'strategy',
            owner: 'tickle122',
            created_at: new Date(1610964020514),
        },
        {
            title: 'JengARRGGGH!',
            review_body:
                "Few games are equiped to fill a player with such a defined sense of mild-peril, but a friendly game of Jenga will turn the mustn't-make-it-fall anxiety all the way up to 11! Fiddly fun for all the family, this game needs little explaination. Whether you're a player who chooses to play it safe, or one who lives life on the edge, eventually the removal of blocks will destabilise the tower and all your Jenga dreams come tumbling down.",
            designer: 'Leslie Scott',
            review_img_url:
                'https://images.pexels.com/photos/4009761/pexels-photo-4009761.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
            votes: 5,
            category: 'dexterity',
            owner: 'grumpy19',
            created_at: new Date(1610964101251),
        }]
        expect(formatReviewData(input)).toEqual([
            [

                'Culture a Love of Agriculture With Agricola',
                "You could sum up Agricola with the simple phrase 'Farmyeard Fun' but the mechanics and game play add so much more than that. You'll find yourself torn between breeding pigs, or sowing crops. Its joyeous and rewarding and it makes you think of time spent outside, which is much harder to do these days!",
                'Uwe Rosenberg',
                'https://images.pexels.com/photos/4917821/pexels-photo-4917821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                1,
                'strategy',
                'tickle122',
                new Date(1610964020514)
            ],
            [

                'JengARRGGGH!',
                "Few games are equiped to fill a player with such a defined sense of mild-peril, but a friendly game of Jenga will turn the mustn't-make-it-fall anxiety all the way up to 11! Fiddly fun for all the family, this game needs little explaination. Whether you're a player who chooses to play it safe, or one who lives life on the edge, eventually the removal of blocks will destabilise the tower and all your Jenga dreams come tumbling down.",
                'Leslie Scott',
                'https://images.pexels.com/photos/4009761/pexels-photo-4009761.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
                5,
                'dexterity',
                'grumpy19',
                new Date(1610964101251),

            ]])
    })
    test('returns an array with different reference to memory', () => {
        const input = [{
            title: 'Culture a Love of Agriculture With Agricola',
            review_body:
                "You could sum up Agricola with the simple phrase 'Farmyeard Fun' but the mechanics and game play add so much more than that. You'll find yourself torn between breeding pigs, or sowing crops. Its joyeous and rewarding and it makes you think of time spent outside, which is much harder to do these days!",
            designer: 'Uwe Rosenberg',
            review_image_url:
                'https://images.pexels.com/photos/4917821/pexels-photo-4917821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            votes: 1,
            category: 'strategy',
            owner: 'tickle122',
            created_at: new Date(1610964020514),
        },
        {
            title: 'JengARRGGGH!',
            review_body:
                "Few games are equiped to fill a player with such a defined sense of mild-peril, but a friendly game of Jenga will turn the mustn't-make-it-fall anxiety all the way up to 11! Fiddly fun for all the family, this game needs little explaination. Whether you're a player who chooses to play it safe, or one who lives life on the edge, eventually the removal of blocks will destabilise the tower and all your Jenga dreams come tumbling down.",
            designer: 'Leslie Scott',
            review_image_url:
                'https://images.pexels.com/photos/4009761/pexels-photo-4009761.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
            votes: 5,
            category: 'dexterity',
            owner: 'grumpy19',
            created_at: new Date(1610964101251),
        }]

        expect(formatReviewData(input)).not.toBe(input)
    })
    test('category objs remain unchanged', () => {
        const input = [{
            title: 'Culture a Love of Agriculture With Agricola',
            review_body:
                "You could sum up Agricola with the simple phrase 'Farmyeard Fun' but the mechanics and game play add so much more than that. You'll find yourself torn between breeding pigs, or sowing crops. Its joyeous and rewarding and it makes you think of time spent outside, which is much harder to do these days!",
            designer: 'Uwe Rosenberg',
            review_image_url:
                'https://images.pexels.com/photos/4917821/pexels-photo-4917821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            votes: 1,
            category: 'strategy',
            owner: 'tickle122',
            created_at: new Date(1610964020514),
        },
        {
            title: 'JengARRGGGH!',
            review_body:
                "Few games are equiped to fill a player with such a defined sense of mild-peril, but a friendly game of Jenga will turn the mustn't-make-it-fall anxiety all the way up to 11! Fiddly fun for all the family, this game needs little explaination. Whether you're a player who chooses to play it safe, or one who lives life on the edge, eventually the removal of blocks will destabilise the tower and all your Jenga dreams come tumbling down.",
            designer: 'Leslie Scott',
            review_image_url:
                'https://images.pexels.com/photos/4009761/pexels-photo-4009761.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
            votes: 5,
            category: 'dexterity',
            owner: 'grumpy19',
            created_at: new Date(1610964101251),
        }]
        formatReviewData(input)
        expect(input[0]).toEqual(

            {
                title: 'Culture a Love of Agriculture With Agricola',
                review_body:
                    "You could sum up Agricola with the simple phrase 'Farmyeard Fun' but the mechanics and game play add so much more than that. You'll find yourself torn between breeding pigs, or sowing crops. Its joyeous and rewarding and it makes you think of time spent outside, which is much harder to do these days!",
                designer: 'Uwe Rosenberg',
                review_image_url:
                    'https://images.pexels.com/photos/4917821/pexels-photo-4917821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
                votes: 1,
                category: 'strategy',
                owner: 'tickle122',
                created_at: new Date(1610964020514)
            }

        )

    });
})

describe('createReviewRef', () => {
    it('should return an empty obj when passed an empty arr ', () => {
        expect(typeof createReviewRef([])).toBe('object')
    });
    it('should return an obj {reviewName: reviewId} when passed an arr with one review obj  ', () => {
        input = [
            {
                review_id: 1,
                title: 'Agricola',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_img_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: 'Farmyard fun!',
                category: 'euro game',
                created_at: new Date(1610964020514),
                votes: 1
            }
        ]
        expect(createReviewRef(input)).toEqual({ 'Agricola': 1 })
    });
    it('should return an obj with key-pairs: reviewName: reviewId when passed an arr with multiple review objects  ', () => {
        input = [
            {
                review_id: 1,
                title: 'Agricola',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_img_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: 'Farmyard fun!',
                category: 'euro game',
                created_at: new Date(1610964020514),
                votes: 1
            }, {
                review_id: 2,
                title: 'Jenga',
                designer: 'Leslie Scott',
                owner: 'philippaclaire9',
                review_img_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: 'Fiddly fun for all the family',
                category: 'dexterity',
                created_at: new Date(1610964101251),
                votes: 5
            }
        ]
        expect(createReviewRef(input)).toEqual({ 'Agricola': 1, 'Jenga': 2 })
    });
    test('review objects remain unchanged', () => {
        input = [
            {
                review_id: 1,
                title: 'Agricola',
                designer: 'Uwe Rosenberg',
                owner: 'mallionaire',
                review_img_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                review_body: 'Farmyard fun!',
                category: 'euro game',
                created_at: new Date(1610964020514),
                votes: 1
            }]
        createReviewRef(input);
        expect(input[0]).toEqual({
            review_id: 1,
            title: 'Agricola',
            designer: 'Uwe Rosenberg',
            owner: 'mallionaire',
            review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            review_body: 'Farmyard fun!',
            category: 'euro game',
            created_at: new Date(1610964020514),
            votes: 1
        })
    });
    test('returned object has different reference to memory than inputted review obj', () => {
        input = [{
            review_id: 1,
            title: 'Agricola',
            designer: 'Uwe Rosenberg',
            owner: 'mallionaire',
            review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            review_body: 'Farmyard fun!',
            category: 'euro game',
            created_at: new Date(1610964020514),
            votes: 1
        }]
        expect(createReviewRef(input)).not.toBe(input[0])
    });
});

describe('formatCommentData', () => {
    test('should return an empty arr when passed an empty arr', () => {
        expect(formatCommentData([])).toEqual([])
    });
    test('returns an array containing nested array holding each object values within', () => {
        const input = [{
            body: 'I loved this game too!',
            belongs_to: 'Jenga',
            created_by: 'bainesface',
            votes: 16,
            created_at: new Date(1511354613389)
        },
        {
            body: 'My dog loved this game too!',
            belongs_to: 'Ultimate Werewolf',
            created_by: 'mallionaire',
            votes: 13,
            created_at: new Date(1610964545410)
        }]
        const reviewRef = {
            'Jenga': 1,
            'Ultimate Werewolf': 2
        }
        expect(formatCommentData(input, reviewRef)).toEqual([['bainesface', 1, 16, new Date(1511354613389), 'I loved this game too!'],
        ['mallionaire', 2, 13, new Date(1610964545410), 'My dog loved this game too!']])
    });
    test('returns an array with different reference to memory', () => {
        const input = [{
            body: 'I loved this game too!',
            belongs_to: 'Jenga',
            created_by: 'bainesface',
            votes: 16,
            created_at: new Date(1511354613389)
        },
        {
            body: 'My dog loved this game too!',
            belongs_to: 'Ultimate Werewolf',
            created_by: 'mallionaire',
            votes: 13,
            created_at: new Date(1610964545410)
        }]
        const reviewRef = {
            'Jenga': 1,
            'Ultimate Werewolf': 2
        }
        expect(formatCommentData(input, reviewRef)).not.toBe(input)
    });
    test('category objs remain unchanged', () => {
        const input = [{
            body: 'I loved this game too!',
            belongs_to: 'Jenga',
            created_by: 'bainesface',
            votes: 16,
            created_at: new Date(1511354613389)
        },
        {
            body: 'My dog loved this game too!',
            belongs_to: 'Ultimate Werewolf',
            created_by: 'mallionaire',
            votes: 13,
            created_at: new Date(1610964545410)
        }]
        const reviewRef = {
            'Jenga': 1,
            'Ultimate Werewolf': 2
        }
        formatCommentData(input, reviewRef)
        expect(input[0]).toEqual(
            {
                body: 'I loved this game too!',
                belongs_to: 'Jenga',
                created_by: 'bainesface',
                votes: 16,
                created_at: new Date(1511354613389)
            }
        )

    });
});