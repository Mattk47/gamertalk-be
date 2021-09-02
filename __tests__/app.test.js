const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed');
const endpoints = require('../endpoints.json')

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Wrong path request', () => {
    test('should return status: 404 and an message stating route not found ', () => {
        return request(app).get('/notARoute').expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Route not found' })
            })
    });
});

describe('GET /api/categories', () => {
    test('should return status:200 and an obj with key: categories and a value of an array of category objects', () => {
        return request(app).get('/api/categories').expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.categories)).toBe(true);
                expect(body.categories.length).toBe(4);
                body.categories.forEach((category) => {
                    expect(category).toMatchObject({
                        description: expect.any(String),
                        slug: expect.any(String)
                    })
                })
            })
    });
});

describe('GET /api/reviews/:review_id', () => {
    test('should return a status:200 and an obj with key: reviews and a value of an array of a review objects', () => {
        return request(app).get('/api/reviews/3').expect(200).then(({ body }) => {
            expect(typeof body.review).toBe('object');
            expect(body.review).toMatchObject({
                owner: 'bainesface',
                title: 'Ultimate Werewolf',
                review_id: 3,
                review_body: "We couldn't find the werewolf!",
                designer: 'Akihisa Okui',
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                category: 'social deduction',
                votes: 5,
                comment_count: '3',
                created_at: '2021-01-18T10:01:41.250Z'
            })
        })
    });
    test('status:400, responds with an error message when passed a bad review ID', () => {
        return request(app)
            .get('/api/reviews/ten')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    test('status:404, responds with an error message when passed a bad review ID', () => {
        return request(app)
            .get('/api/reviews/1000')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Resource not found');
            });
    });
});

describe('PATCH /api/reviews/:review_id', () => {
    test('returns an updated review obj with votes increased by 5', () => {
        return request(app).patch('/api/reviews/1').expect(201)
            .send({ inc_votes: 5 }).then(({ body }) => {
                expect(body.updatedReview.votes).toBe(6)
                expect(typeof body).toBe('object')
            })
    });
    test('should return 400 status and message when no inc_votes key provided', () => {
        return request(app).patch('/api/reviews/1').expect(400).send({ testkey: 500 }).then(res => {
            expect(res.body).toEqual({ msg: 'Bad request' })
        })
    });
    test('status:404, responds with an error message when passed a bad user ID', () => {
        return request(app)
            .patch('/api/reviews/1000')
            .send({ inc_votes: 5 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('No user found for user_id: 1000');
            });
    });
    test('status:400, responds with an error message when passed a bad user ID', () => {
        return request(app)
            .patch('/api/reviews/ten')
            .expect(400)
            .send({ inc_votes: 5 })
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    test('status:400, responds with an error message when passed an incorrect type', () => {
        return request(app)
            .patch('/api/reviews/1')
            .send({ inc_votes: 'five' })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });

});

describe('GET /api/reviews', () => {
    test('should return a status:200 and an obj with key: reviews and a value of an array of review objects', () => {
        return request(app).get('/api/reviews').expect(200).then(({ body }) => {
            expect(Array.isArray(body.reviews)).toBe(true);
            body.reviews.forEach(review => {
                expect(review).toMatchObject({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    category: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                })
            })

        })
    });
    test('reviews are sorted by date as default', () => {
        return request(app).get('/api/reviews').expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy('created_at', { descending: true, })
            })
    });
    test('reviews are sorted title when title is passed as a query', () => {
        return request(app).get('/api/reviews?sort_by=title').expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy('title', { descending: true, })

            })
    });
    test('returns an error obj when passed not_a_column as a query', () => {
        return request(app).get('/api/reviews?sort_by=not_a_column').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            })
    });
    test('reviews are sorted by title & ASC when title & ASC is passed as a query', () => {
        return request(app).get('/api/reviews?sort_by=title&order=asc').expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy('title')

            })
    });
    test('returns an error obj when passed not_a_column as a query', () => {
        return request(app).get('/api/reviews?sort_by=title&order=up').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid order query');
            })
    });
    test('reviews are sorted by category when category is passed as a query', () => {
        return request(app).get('/api/reviews?category=dexterity').expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeSortedBy('dexterity', { descending: true, })
            })
    });
    test('returns an error obj when passed not_a_column as a query', () => {
        return request(app).get('/api/reviews?category=not_a_category').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid category query');
            })

    });
    test('returns the num of reviews specified in the ?limit=<number> query', () => {
        return request(app).get('/api/reviews?limit=4').expect(200)
            .then(({ body }) => {
                expect(body.reviews.length).toBe(4);
            })
    });
    test('returns status:200 and correct reviews when page specified in ?page=<num> query', () => {
        return request(app).get('/api/reviews?page=2&order=asc&sort_by=review_id').expect(200)
            .then(({ body }) => {
                expect(body.reviews[0].review_id).toBe(6);
                expect(body.reviews[1].review_id).toBe(7);
                expect(body.reviews[2].review_id).toBe(8);
                expect(body.reviews[3].review_id).toBe(9);
                expect(body.reviews[4].review_id).toBe(10);
            })
    });
    test('returns an error obj when given a page query with no content', () => {
        return request(app).get('/api/reviews?page=500').expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('No content found');
            })
    });
    test('returns an error obj when given a bad request', () => {
        return request(app).get('/api/reviews?page=bla').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            })
    });
    test('returns an error obj when given a bad request', () => {
        return request(app).get('/api/reviews?limit=bla').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            })
    });
    // This test works without a limit however other test fails when limit is too high
    // therefore default limit must be lowered.
    test('returns a total_count property on the response body', () => {
        return request(app).get('/api/reviews').expect(200)
            .then(({ body }) => {
                expect(typeof body.total_count).toBe('number')
                expect(body.total_count).toBe(5)
            })
    });

});

describe('GET /api/reviews/:review_id/comments', () => {
    test('returns status:200 and an obj with an array of comments for the given review id', () => {
        return request(app).get('/api/reviews/3/comments').expect(200)
            .then(({ body }) => {
                expect(body.comments.length).toBe(3)
                expect(Array.isArray(body.comments)).toBe(true);
                body.comments.forEach(comment => {
                    expect(comment).toMatchObject({
                        author: expect.any(String),
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        review_id: expect.any(Number)
                    })
                })

            })
    });
    test('status:400, responds with an error message when passed a bad review ID', () => {
        return request(app)
            .get('/api/reviews/ten/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    test('status:404, responds with an error message when passed a bad review ID', () => {
        return request(app)
            .get('/api/reviews/1000/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Resource not found');
            });
    });
    test('status:200, responds with an empty array when passed a legit review id but no comments', () => {
        return request(app)
            .get('/api/reviews/5/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments.length).toBe(0);
            });
    });
    test('returns the num of comments specified in the ?limit=<number> query', () => {
        return request(app).get('/api/reviews/3/comments?limit=3').expect(200)
            .then(({ body }) => {
                expect(body.comments.length).toBe(3);
            })
    });
    test('returns status:200 and correct comment when page specified in ?page=<num> query', () => {
        return request(app).get('/api/reviews/3/comments?page=2&limit=1&order=asc&sort_by=comment_id').expect(200)
            .then(({ body }) => {
                expect(body.comments[0].review_id).toBe(3);
            })
    });
    test('returns an error obj when given a bad request', () => {
        return request(app).get('/api/reviews/1/comments?page=three').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            })
    });
    test('returns an error obj when given a bad request', () => {
        return request(app).get('/api/reviews?limit=seven').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            })
    });
});

describe('POST /api/reviews/:review_id/comments', () => {
    test('should return status:200 and the newly posted comment', () => {
        return request(app).post('/api/reviews/1/comments').expect(201)
            .send({ username: 'mallionaire', body: 'The best review Ive ever layed my eyes on.' }).then(({ body }) => {
                expect(body.comment).toMatchObject({
                    comment_id: expect.any(Number),
                    author: 'mallionaire',
                    review_id: 1,
                    votes: 0,
                    created_at: expect.any(String),
                    body: 'The best review Ive ever layed my eyes on.'
                })
            })
    });
    test('return status:400 when sent an obj without both keys username & body', () => {
        return request(app).post('/api/reviews/1/comments').expect(400).send({ comment: { username: 'mallionaire', comment: 'The best review Ive ever layed my eyes on.' } })
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            })
    });
    test('return status:400 when passed a bad user id', () => {
        return request(app).post('/api/reviews/100/comments').expect(400).send({ comment: { username: 'mallionaire', body: 'The best review Ive ever layed my eyes on.' } })
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            })
    });

});

describe('GET /api', () => {
    test('should respond with a JSON describing all the available endpoints', () => {
        return request(app).get('/api').expect(200).then(({ body }) => {
            expect(body).toEqual(endpoints)
        })
    });
    test('should return status: 404 and an message stating route not found ', () => {
        return request(app).get('/notARoute').expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Route not found' })
            })
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    test('should return status:204 and delete the provided comment', async () => {
        const deleteComment = await request(app).delete('/api/comments/1').expect(204);
        const checkIfDeleted = await db.query('SELECT * FROM comments WHERE comment_id = 1')
        expect(checkIfDeleted.rows.length).toBe(0)
    });
    test('returns status:404 when requested a resource that doesnt exist ', () => {
        return request(app).delete('/api/comments/1000').expect(404).then(({ body }) => {
            expect(body.msg).toBe('Resource not found')
        })
    });
    test('returns status:400 when providing an invalid Id', () => {
        return request(app).delete('/api/comments/ten').expect(400).then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    });
});

describe('GET /api/users', () => {
    test('should return a status:200 and an array of users', () => {
        return request(app).get('/api/users').expect(200).then(({ body }) => {
            expect(Array.isArray(body.users)).toBe(true);
            body.users.forEach(user => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                })
            })
        })
    });
    test('returns status:404 when requesting an invalid route', () => {
        return request(app).get('/api/user').expect(404).then(({ body }) => {
            expect(body.msg).toBe('Route not found')
        })
    });
});

describe('GET /api/users/:username', () => {
    test('should return status:200 and an user obj with username, name & avatar props', () => {
        return request(app).get('/api/users/mallionaire').expect(200)
            .then(({ body }) => {
                expect(typeof body.user).toBe('object');
                expect(body.user).toMatchObject({
                    username: 'mallionaire',
                    name: 'haz',
                    avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                })
            })
    });
    test('returns status:404 when requesting a resource that doesnt exist ', () => {
        return request(app).get('/api/users/9090').expect(404).then(({ body }) => {
            expect(body.msg).toBe('Resource not found')
        })
    });
});

describe('PATCH /api/comments/:comment_id', () => {
    test('returns status:201 and the votes property of the comment obj updated by provided amount', async () => {
        const msgVotesBeforeUpdate = await db.query('SELECT comments.votes FROM comments WHERE comment_id = 1');
        return request(app).patch('/api/comments/1').expect(201)
            .send({ inc_votes: 5 }).then(({ body }) => {
                expect(body.updatedComment.votes).toBe(msgVotesBeforeUpdate.rows[0].votes + 5)
            })
    });
    test('status:404, responds with an error message when passed a bad user ID', () => {
        return request(app)
            .patch('/api/comments/1470')
            .send({ inc_votes: 5 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Resource not found');
            });
    });
    test('status:400, responds with an error message when passed a bad user ID', () => {
        return request(app)
            .patch('/api/comments/eleven')
            .expect(400)
            .send({ inc_votes: 5 })
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    })
    test('status:400, responds with an error message when passed an incorrect type', () => {
        return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 'five' })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    test('should return 400 status and message when no inc_votes key provided', () => {
        return request(app).patch('/api/comments/1').expect(400).send({ testkey: 500 }).then(res => {
            expect(res.body).toEqual({ msg: 'Bad request' })
        })
    })
});

describe('POST /api/reviews', () => {
    test('returns status:201 & a review obj of the newly posted review', () => {
        return request(app).post('/api/reviews').expect(201).send({
            owner: 'mallionaire',
            title: 'Bohemian Raspberry',
            review_body: 'I highly recommend this game',
            designer: 'Freddie Mercury',
            category: 'euro game',
            review_img_url:
                'https://images.ctfassets.net/3s5io6mnxfqz/wfAz3zUBbrcf1eSMLZi8u/c03ac28c778813bd72373644ee8b8b02/AdobeStock_364059453.jpeg?fm=jpg&w=900&fl=progressive'
        }
        ).then(({ body }) => {
            expect(body.addedReview).toMatchObject({
                owner: 'mallionaire',
                title: 'Bohemian Raspberry',
                review_body: 'I highly recommend this game',
                designer: 'Freddie Mercury',
                category: 'euro game',
                review_id: 14,
                votes: 0,
                created_at: expect.any(String),
                review_img_url: expect.any(String)
            })
        })
    });
    test('return status:400 when sent an obj without all essential keys', () => {
        return request(app).post('/api/reviews').expect(400).send({
            owner: 'mallionaire',
            title: 'Bohemian Raspberry',
            review_body: 'I highly recommend this game',
            designer: 'Freddie Mercury'
        })
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            })
    });
    test('return status:400 when passed a bad username in the req obj', () => {
        return request(app).post('/api/reviews').expect(400).send({
            owner: 'matty123',
            title: 'Bohemian Raspberry',
            review_body: 'I highly recommend this game',
            designer: 'Freddie Mercury',
            category: 'euro game',
            review_id: 14,
            votes: 0,
            created_at: expect.any(String)
        })
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            })
    });
    test('return status:400 when passed a bad category in the req obj', () => {
        return request(app).post('/api/reviews').expect(400).send({
            owner: 'mallionaire',
            title: 'Bohemian Raspberry',
            review_body: 'I highly recommend this game',
            designer: 'Freddie Mercury',
            category: 'pear',
            review_id: 14,
            votes: 0,
            created_at: expect.any(String)
        })
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            })
    });
});

describe('POST /api/categories', () => {
    test('Returns status:201 and the newly added category obj', () => {
        return request(app).post('/api/categories').expect(201).send({
            slug: 'first person shooter',
            description: 'Category dedicated to first person shooter games'
        })
            .then(({ body }) => {
                expect(body.newCategory).toMatchObject({
                    slug: 'first person shooter',
                    description: 'Category dedicated to first person shooter games'
                })
            })
    });
    test('return status:400 when sent an obj without slug & description keys', () => {
        return request(app).post('/api/categories').expect(400).send({
            slug: 'first person shooter',
            desc: 'Category dedicated to first person shooter games'
        })
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            })
    });
    test('return status:400 when sent an keys with wrong data type', () => {
        return request(app).post('/api/categories').expect(400).send({
            slug: 999,
            desc: 'Category dedicated to first person shooter games'
        })
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            })
    });
});

describe('DELETE /api/reviews/:review_id', () => {
    test('returns status:204 & no content', async () => {
        const deleteReview = await request(app).delete('/api/reviews/1').expect(204);
        const checkIfDeleted = await db.query('SELECT * FROM reviews WHERE review_id = 1')
        expect(checkIfDeleted.rows.length).toBe(0)
    });
    test('returns status:404 when requested a resource that doesnt exist ', () => {
        return request(app).delete('/api/reviews/1000').expect(404).then(({ body }) => {
            expect(body.msg).toBe('Resource not found')
        })
    });
    test('returns status:400 when providing an invalid Id', () => {
        return request(app).delete('/api/reviews/ten').expect(400).then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    });
});