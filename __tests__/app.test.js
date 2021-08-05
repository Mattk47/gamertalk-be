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
                comment_count: expect.any(String)
            })
        })
    });
    test('status:400, responds with an error message when passed a bad user ID', () => {
        return request(app)
            .get('/api/reviews/ten')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    test('status:404, responds with an error message when passed a bad user ID', () => {
        return request(app)
            .get('/api/reviews/1000')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('No user found for user_id: 1000');
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
    it.only('should return 400 status and message when no inc_votes key provided', () => {
        return request(app).patch('/api/reviews/1').expect(400).send({ testkey: 500 }).then(res => {
            expect(res.body).toEqual({ msg: 'Bad request' })
        })
    });
    test('status:404, responds with an error message when passed a bad user ID', () => {
        return request(app)
            .patch('/api/reviews/1000')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('No user found for user_id: 1000');
            });
    });
    test('status:400, responds with an error message when passed a bad user ID', () => {
        return request(app)
            .patch('/api/reviews/ten')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request');
            });
    });
});