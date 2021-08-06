const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed');

beforeEach(() => seed(testData));
afterAll(() => db.end());

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
    test('should return status: 404 and an message stating route not found ', () => {
        return request(app).get('/notARoute').expect(404)
            .then(({ body }) => {
                console.log(body)
                expect(body).toEqual({ msg: 'Route not found' })
            })
    });
});


describe('GET /api/reviews/:review_id', () => {
    test('should return a status:200 and an obj with key: reviews and a value of an array of a review objects', () => {
        return request(app).get('/api/reviews/3').expect(200).then(({ body }) => {
            expect(body.review.length).toEqual(1)
            expect(Array.isArray(body.review)).toBe(true);
            expect(body.review[0]).toMatchObject({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                review_body: expect.any(String),
                designer: expect.any(String),
                review_img_url: expect.any(String),
                category: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(String),
                created_at: expect.any(String)
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
                expect(body.updatedReview[0].votes).toBe(6)
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
                console.log(body.reviews)
                expect(body.reviews[0].review_id).toBe(2)
                expect(body.reviews[1].review_id).toBe(3)

            })
    });
    test('reviews are sorted title when title is passed as a query', () => {
        return request(app).get('/api/reviews?sort_by=title').expect(200)
            .then(({ body }) => {
                expect(body.reviews[0].review_id).toBe(3)
                expect(body.reviews[1].review_id).toBe(2)

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
                expect(body.reviews[0].review_id).toBe(2)
                expect(body.reviews[1].review_id).toBe(3)

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
                expect(body.reviews[0].review_id).toBe(2)
                expect(body.reviews.length).toBe(1)
            })
    });
    test('returns an error obj when passed not_a_column as a query', () => {
        return request(app).get('/api/reviews?category=not_a_category').expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid category query');
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
                        created_at: expect.any(String)
                    })
                    expect(comment.hasOwnProperty('review_id')).toBe(false)
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
});

describe('POST /api/reviews/:review_id/comments', () => {
    test('should return status:200 and the newly posted comment', () => {
        return request(app).post('/api/reviews/1/comments').expect(201)
            .send({ comment: { username: 'mallionaire', body: 'The best review Ive ever layed my eyes on.' } }).then(({ body }) => {
                expect(body.comment.length).toBe(1)
                expect(Array.isArray(body.comment)).toBe(true);
                expect(body.comment[0]).toMatchObject({
                    comment_id: expect.any(Number),
                    author: expect.any(String),
                    review_id: 1,
                    votes: 0,
                    created_at: expect.any(String),
                    body: expect.any(String)
                })
            })
    });
    test

});