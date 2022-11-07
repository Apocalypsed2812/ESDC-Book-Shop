const accountRouter = require('./Account');
const adminRouter = require('./Admin');
const staffRouter = require('./Staff');
const userRouter = require('./User');

function route(app){

    app.use('/', accountRouter);

    app.use('/admin', adminRouter)

    app.use('/staff', staffRouter)

    app.use('/user', userRouter)
    
}

module.exports = route;