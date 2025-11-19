
expect(res.statusCode).toEqual(200);
const check = await Issue.findById(issue._id);
expect(check).toBeNull();
        });
    });
});
