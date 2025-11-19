const mongoose = require('mongoose');
const Issue = require('../models/Issue');
require('dotenv').config();

describe('Issue Model Test', () => {
    beforeAll(async () => {
        // Only connect if not already connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/teamsync_test');
        }
    });

    afterAll(async () => {
        // Close connection after all tests
        await mongoose.connection.close();
    });

    afterEach(async () => {
        // Clean up data
        await Issue.deleteMany({});
    });

    it('should create & save issue successfully', async () => {
        const validIssue = new Issue({
            title: 'Test Issue',
            status: 'todo',
            priority: 'low'
        });
        const savedIssue = await validIssue.save();
        expect(savedIssue._id).toBeDefined();
        expect(savedIssue.title).toBe('Test Issue');
        expect(savedIssue.status).toBe('todo');
        expect(savedIssue.priority).toBe('low');
    });

    it('should fail if title is missing', async () => {
        const issueWithoutTitle = new Issue({ status: 'todo' });
        let err;
        try {
            await issueWithoutTitle.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.title).toBeDefined();
    });

    it('should fail if priority is invalid', async () => {
        const issueInvalidPriority = new Issue({ title: 'Test', priority: 'critical' });
        let err;
        try {
            await issueInvalidPriority.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should apply default values', async () => {
        const issue = new Issue({ title: 'Default Test' });
        const savedIssue = await issue.save();
        expect(savedIssue.status).toBe('todo');
        expect(savedIssue.priority).toBe('medium');
    });
});
